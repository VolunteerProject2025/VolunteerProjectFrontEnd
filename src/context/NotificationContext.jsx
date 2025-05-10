import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const NotificationContext = createContext();
const API_URL = `${import.meta.env.VITE_API_URL}/notifications`;  // API URL

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load initial notifications from API
  const loadNotifications = async () => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${API_URL}/${notificationId}/read`, {}, { withCredentials: true });

      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true } : n))
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications,
        unreadCount,
        markAsRead,
        loadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);  