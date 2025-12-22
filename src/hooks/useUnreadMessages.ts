import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import webSocketService from '../services/webSocketService';

interface AuthState {
  userId: string | null;
  isLoggedIn: boolean;
}

// Global state for unread messages - simple boolean flag
let hasGlobalUnreadMessages = false;
const unreadMessageListeners: ((hasUnread: boolean) => void)[] = [];

// Notify all listeners about unread message state change
const notifyUnreadStateChange = (hasUnread: boolean) => {
  hasGlobalUnreadMessages = hasUnread;
  unreadMessageListeners.forEach(listener => listener(hasUnread));
};

// Global function to notify when a new message arrives
export const notifyNewMessageReceived = (message: { senderId: string; [key: string]: unknown }, currentUserId: string) => {
  // Only set unread flag if message is from another user
  if (message.senderId !== currentUserId) {
    console.log('🔴 New message from another user - showing red dot');
    notifyUnreadStateChange(true);
  }
};

// Global function to clear unread messages
export const clearUnreadMessages = () => {
  console.log('✅ Clearing unread messages - hiding red dot');
  notifyUnreadStateChange(false);
};

// Subscribe to unread state changes
const subscribeToUnreadState = (callback: (hasUnread: boolean) => void) => {
  unreadMessageListeners.push(callback);
  // Immediately call with current state
  callback(hasGlobalUnreadMessages);
  
  return () => {
    const index = unreadMessageListeners.indexOf(callback);
    if (index > -1) {
      unreadMessageListeners.splice(index, 1);
    }
  };
};

export const useUnreadMessages = () => {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(hasGlobalUnreadMessages);
  const { userId, isLoggedIn } = useSelector((state: { auth: AuthState }) => state.auth);

  console.log('🎯 useUnreadMessages hook initialized - userId:', userId, 'isLoggedIn:', isLoggedIn, 'hasUnreadMessages:', hasUnreadMessages);
  console.log('🔌 WebSocket connected status:', webSocketService.isConnected());

  // Subscribe to global unread state changes
  useEffect(() => {
    console.log('📡 useUnreadMessages: Subscribing to global state changes');
    const unsubscribe = subscribeToUnreadState((hasUnread) => {
      console.log('🔔 useUnreadMessages: Global state changed to:', hasUnread);
      setHasUnreadMessages(hasUnread);
    });

    return unsubscribe;
  }, []);

  // Subscribe to WebSocket unread message notifications
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      console.log('⚠️ useUnreadMessages: Not logged in or no userId, skipping subscription');
      return;
    }

    console.log('🔌 useUnreadMessages: Setting up WebSocket subscription for userId:', userId);

    // Listen for unread message notifications from dedicated endpoint
    const unsubscribeWs = webSocketService.onUnreadMessage((notification: any) => {
      console.log('🔴 Unread message notification received:', notification);
      
      // Server sends to /queue/unread-messages - always show red dot
      console.log('🔴 New unread message - showing red dot');
      notifyUnreadStateChange(true);
    });

    console.log('✅ useUnreadMessages: Subscribed to /queue/unread-messages');

    return () => {
      if (unsubscribeWs) {
        unsubscribeWs();
        console.log('🔕 useUnreadMessages: Unsubscribed from unread messages');
      }
    };
  }, [isLoggedIn, userId]);

  return {
    hasUnreadMessages,
    clearUnreadMessages
  };
};
