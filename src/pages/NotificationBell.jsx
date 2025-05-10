import React, { useState, useEffect } from 'react';
import { Bell } from 'react-bootstrap-icons'; // Or any other icon library
import { useNotifications } from '../context/NotificationContext';
import '../assets/css/notification.css';

export const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, unreadCount, markAsRead, loadNotifications } = useNotifications();
  
  // Add an effect to ensure UI updates when notifications change
  useEffect(() => {
    // This empty dependency array ensures the component re-renders when these props change
  }, [notifications, unreadCount]);
  
  // Refresh notifications when the bell is clicked
  const handleClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      loadNotifications(); // Refresh notifications when opening the dropdown
    }
  };
  
  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation();
    markAsRead(notificationId);
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh"
    });
  };
  
  return (
    <div className="notification-bell-container">
      <div className="notification-bell" onClick={handleClick}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h5>Notifications</h5>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <small>{formatTime(notification.createdAt)}</small>
                  </div>
                  {!notification.read && (
                    <button 
                      className="mark-read-btn"
                      onClick={(e) => handleMarkAsRead(e, notification._id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};