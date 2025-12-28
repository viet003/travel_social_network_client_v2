import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { MessageDeliveryReceipt } from '../types/chat.types';

type MessageHandler = (message: any) => void;

class WebSocketService {
  private client: Client | null = null;
  private isConnecting = false;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private storedToken: string | null = null;
  private currentUserId: string | null = null;

  /**
   * Khởi tạo kết nối WebSocket với STOMP over SockJS
   * @param token - JWT token for authentication
   * @param userId - User ID for subscription
   */
  connect(token: string, userId: string): Promise<void> {
    // Store current credentials for reconnection
    this.storedToken = token;
    this.currentUserId = userId;
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        console.log('✅ WebSocket already connected');
        resolve();
        return;
      }

      if (this.isConnecting) {
        console.log('⏳ WebSocket connection already in progress');
        return;
      }

      this.isConnecting = true;

      // Get WebSocket URL from env
      const wsBaseUrl = import.meta.env.VITE_WS_URL?.trim() || 'http://localhost:8080/ws';
      
      // Add token as query parameter for authentication
      const wsUrl = `${wsBaseUrl}?token=${encodeURIComponent(token)}`;
      
      console.log('🔌 WebSocket Base URL:', wsBaseUrl);
      console.log('🔌 WebSocket URL:', wsUrl.replace(token, '***TOKEN***'));
      console.log('🔌 Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

      // Tạo SockJS instance with token in URL
      const socket = new SockJS(wsUrl);

      // Tạo STOMP client
      this.client = new Client({
        webSocketFactory: () => socket as any,
        
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },

        debug: (str) => {
          console.log('🔌 STOMP Debug:', str);
        },

        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: (frame) => {
          console.log('✅ WebSocket Connected:', frame);
          this.isConnecting = false;
          this.reconnectAttempts = 0;

          // Subscribe to user's notification queue
          this.subscribeToNotifications(userId);
          
          // Subscribe to user's unread messages queue
          this.subscribeToUnreadMessages(userId);
          
          resolve();
        },

        onStompError: (frame) => {
          console.error('❌ STOMP Error:', frame.headers['message']);
          console.error('Details:', frame.body);
          this.isConnecting = false;
          reject(new Error(frame.headers['message']));
        },

        onWebSocketError: (event) => {
          console.error('❌ WebSocket Error:', event);
          this.isConnecting = false;
        },

        onWebSocketClose: (event) => {
          console.warn('⚠️ WebSocket Closed:', event);
          this.isConnecting = false;
          this.handleReconnect(token, userId);
        },

        onDisconnect: () => {
          console.log('🔌 WebSocket Disconnected');
          this.isConnecting = false;
        }
      });

      // Activate the client
      this.client.activate();
    });
  }

  /**
   * Subscribe to user's notification queue
   * @param userId - User ID
   */
  private subscribeToNotifications(userId: string) {
    if (!this.client?.connected) {
      console.error('❌ Cannot subscribe: WebSocket not connected');
      return;
    }

    // Subscribe to /user/{userId}/queue/notifications
    this.client.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
      try {
        const notification = JSON.parse(message.body);
        console.log('📩 Received notification:', notification);
        
        // Trigger all registered handlers
        const handlers = this.messageHandlers.get('notification') || [];
        handlers.forEach(handler => handler(notification));
      } catch (error) {
        console.error('❌ Error parsing notification:', error);
      }
    });

    console.log(`✅ Subscribed to /user/${userId}/queue/notifications`);
  }

  /**
   * Subscribe to user's unread messages queue
   * @param userId - User ID
   */
  private subscribeToUnreadMessages(userId: string) {
    if (!this.client?.connected) {
      console.error('❌ Cannot subscribe: WebSocket not connected');
      return;
    }

    // Subscribe to /user/{userId}/queue/unread-messages
    this.client.subscribe(`/user/${userId}/queue/unread-messages`, (message: IMessage) => {
      try {
        const notification = JSON.parse(message.body);
        console.log('🔴 Received unread message notification:', notification);
        
        // Trigger all registered handlers
        const handlers = this.messageHandlers.get('unread-message') || [];
        handlers.forEach(handler => handler(notification));
      } catch (error) {
        console.error('❌ Error parsing unread message notification:', error);
      }
    });

    console.log(`✅ Subscribed to /user/${userId}/queue/unread-messages`);
  }

  /**
   * Subscribe to a conversation's message channel
   * @param conversationId - Conversation ID to subscribe to
   * @returns Unsubscribe function
   */
  subscribeToConversation(conversationId: string): () => void {
    if (!this.client?.connected) {
      console.error('❌ Cannot subscribe: WebSocket not connected');
      return () => {};
    }

    console.log(`🔔 Subscribing to conversation: ${conversationId}`);

    // Subscribe to /group/{conversationId} for messages
    const messageSub = this.client.subscribe(`/group/${conversationId}`, (message: IMessage) => {
      try {
        const chatMessage = JSON.parse(message.body);
        console.log('💬 Received chat message:', chatMessage);
        
        // Trigger all registered message handlers for this conversation
        const handlers = this.messageHandlers.get(`chat-${conversationId}`) || [];
        handlers.forEach(handler => handler(chatMessage));
      } catch (error) {
        console.error('❌ Error parsing chat message:', error);
      }
    });

    // Subscribe to /group/{conversationId}/typing for typing notifications
    const typingSub = this.client.subscribe(`/group/${conversationId}/typing`, (message: IMessage) => {
      try {
        const typingNotification = JSON.parse(message.body);
        console.log('⌨️ Received typing notification:', typingNotification);
        
        // Trigger all registered typing handlers for this conversation
        const handlers = this.messageHandlers.get(`typing-${conversationId}`) || [];
        handlers.forEach(handler => handler(typingNotification));
      } catch (error) {
        console.error('❌ Error parsing typing notification:', error);
      }
    });

    // Subscribe to /group/{conversationId}/receipt for delivery/read receipts
    const receiptSub = this.client.subscribe(`/group/${conversationId}/receipt`, (message: IMessage) => {
      try {
        const receipt = JSON.parse(message.body);
        console.log('📬 Received delivery receipt:', receipt);
        
        // Trigger all registered receipt handlers for this conversation
        const handlers = this.messageHandlers.get(`receipt-${conversationId}`) || [];
        handlers.forEach(handler => handler(receipt));
      } catch (error) {
        console.error('❌ Error parsing delivery receipt:', error);
      }
    });

    console.log(`✅ Subscribed to conversation ${conversationId}`);

    // Return unsubscribe function
    return () => {
      messageSub.unsubscribe();
      typingSub.unsubscribe();
      receiptSub.unsubscribe();
      this.messageHandlers.delete(`chat-${conversationId}`);
      this.messageHandlers.delete(`typing-${conversationId}`);
      this.messageHandlers.delete(`receipt-${conversationId}`);
      console.log(`🔕 Unsubscribed from conversation ${conversationId}`);
    };
  }

  /**
   * Send a chat message
   * @param conversationId - Conversation ID
   * @param content - Message content
   * @param type - Message type (text, image, video, file)
   * @param mediaUrl - Optional media URL
   * @param replyToMessageId - Optional MongoDB ID of message being replied to
   */
  sendMessage(conversationId: string, content: string, type: string = 'text', mediaUrl?: string, replyToMessageId?: string) {
    if (!this.client?.connected) {
      console.error('❌ Cannot send message: WebSocket not connected');
      throw new Error('WebSocket not connected');
    }

    const messageRequest = {
      groupChatId: conversationId,
      content,
      type,
      mediaUrl,
      replyToMessageId
    };

    this.client.publish({
      destination: '/app/private-message',
      body: JSON.stringify(messageRequest)
    });

    console.log('📤 Sent message to conversation:', conversationId);
  }

  /**
   * Send typing notification
   * @param conversationId - Conversation ID
   * @param isTyping - Whether user is typing
   */
  sendTypingNotification(conversationId: string, isTyping: boolean) {
    if (!this.client?.connected) {
      console.error('❌ Cannot send typing notification: WebSocket not connected');
      return;
    }

    const typingNotification = {
      groupChatId: conversationId,
      typing: isTyping
    };

    console.log(`⌨️ Sending typing notification:`, typingNotification);

    this.client.publish({
      destination: '/app/typing',
      body: JSON.stringify(typingNotification)
    });

    console.log(`✅ Typing notification sent (${isTyping}) to conversation:`, conversationId);
  }

  /**
   * Send message delivered confirmation
   * @param messageId - Message ID (MongoDB ID)
   * @param conversationId - Conversation ID
   */
  sendMessageDelivered(messageId: string, conversationId: string) {
    if (!this.client?.connected) {
      console.error('❌ Cannot send delivery confirmation: WebSocket not connected');
      return;
    }

    const deliveryRequest = {
      messageId,
      conversationId
    };

    this.client.publish({
      destination: '/app/message-delivered',
      body: JSON.stringify(deliveryRequest)
    });

    console.log(`📬 Sent delivery confirmation for message:`, messageId);
  }

  /**
   * Send message read confirmation
   * @param messageId - Message ID (MongoDB ID)
   * @param conversationId - Conversation ID
   */
  sendMessageRead(messageId: string, conversationId: string) {
    if (!this.client?.connected) {
      console.error('❌ Cannot send read confirmation: WebSocket not connected');
      return;
    }

    const readRequest = {
      messageId,
      conversationId
    };

    this.client.publish({
      destination: '/app/message-read',
      body: JSON.stringify(readRequest)
    });

    console.log(`👁️ Sent read confirmation for message:`, messageId);
  }

  /**
   * Register a message handler for a specific conversation
   * @param conversationId - Conversation ID
   * @param handler - Callback function to handle message
   * @returns Unsubscribe function
   */
  onChatMessage(conversationId: string, handler: MessageHandler): () => void {
    const key = `chat-${conversationId}`;
    if (!this.messageHandlers.has(key)) {
      this.messageHandlers.set(key, []);
    }
    
    const handlers = this.messageHandlers.get(key)!;
    handlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * Register a typing notification handler for a specific conversation
   * @param conversationId - Conversation ID
   * @param handler - Callback function to handle typing notification
   * @returns Unsubscribe function
   */
  onTypingNotification(conversationId: string, handler: MessageHandler): () => void {
    const key = `typing-${conversationId}`;
    if (!this.messageHandlers.has(key)) {
      this.messageHandlers.set(key, []);
    }
    
    const handlers = this.messageHandlers.get(key)!;
    handlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * Register a delivery receipt handler for a specific conversation
   * @param conversationId - Conversation ID
   * @param handler - Callback function to handle delivery receipts
   * @returns Unsubscribe function
   */
  onDeliveryReceipt(conversationId: string, handler: (receipt: MessageDeliveryReceipt) => void): () => void {
    const key = `receipt-${conversationId}`;
    if (!this.messageHandlers.has(key)) {
      this.messageHandlers.set(key, []);
    }
    
    const handlers = this.messageHandlers.get(key)!;
    handlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * Register a message handler for unread message notifications
   * @param handler - Callback function to handle unread message notification
   * @returns Unsubscribe function
   */
  onUnreadMessage(handler: MessageHandler): () => void {
    if (!this.messageHandlers.has('unread-message')) {
      this.messageHandlers.set('unread-message', []);
    }
    
    const handlers = this.messageHandlers.get('unread-message')!;
    handlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * Register a message handler for notifications
   * @param handler - Callback function to handle notification
   * @returns Unsubscribe function
   */
  onNotification(handler: MessageHandler): () => void {
    if (!this.messageHandlers.has('notification')) {
      this.messageHandlers.set('notification', []);
    }
    
    const handlers = this.messageHandlers.get('notification')!;
    handlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * Send a test notification (for testing)
   * @param message - Test message
   */
  sendTestNotification(message: string) {
    if (!this.client?.connected) {
      console.error('❌ Cannot send: WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: '/app/notifications/test',
      body: JSON.stringify({ message })
    });

    console.log('📤 Sent test notification:', message);
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(token: string, userId: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(token, userId).catch(error => {
        console.error('❌ Reconnection failed:', error);
      });
    }, this.reconnectDelay);
  }

  /**
   * Update token and reconnect WebSocket with new token
   * Should be called when token is refreshed
   * @param newToken - New JWT token
   */
  updateToken(newToken: string) {
    if (!this.currentUserId) {
      console.warn('⚠️ Cannot update token: No userId stored');
      return;
    }

    console.log('🔄 Token updated, reconnecting WebSocket...');
    this.storedToken = newToken;
    
    // Disconnect current connection
    if (this.client?.connected) {
      this.client.deactivate();
    }
    
    // Reset reconnection attempts
    this.reconnectAttempts = 0;
    
    // Reconnect with new token
    this.connect(newToken, this.currentUserId).catch(error => {
      console.error('❌ Failed to reconnect with new token:', error);
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.client?.connected) {
      this.client.deactivate();
      console.log('🔌 WebSocket Disconnected');
    }
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
    this.storedToken = null;
    this.currentUserId = null;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  /**
   * Get the current stored token
   */
  getStoredToken(): string | null {
    return this.storedToken;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
