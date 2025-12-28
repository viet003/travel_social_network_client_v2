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
    notifyUnreadStateChange(true);
  }
};

// Global function to clear unread messages
export const clearUnreadMessages = () => {
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


  // Subscribe to global unread state changes
  useEffect(() => {
    const unsubscribe = subscribeToUnreadState((hasUnread) => {
      setHasUnreadMessages(hasUnread);
    });

    return unsubscribe;
  }, []);

  // Subscribe to WebSocket unread message notifications
  useEffect(() => {
    if (!isLoggedIn || !userId) {
      return;
    }

    // Listen for unread message notifications from dedicated endpoint
    const unsubscribeWs = webSocketService.onUnreadMessage((notification: any) => {
      // Server sends to /queue/unread-messages - always show red dot
      notifyUnreadStateChange(true);
    });

    return () => {
      if (unsubscribeWs) {
        unsubscribeWs();
      }
    };
  }, [isLoggedIn, userId]);

  return {
    hasUnreadMessages,
    clearUnreadMessages
  };
};
