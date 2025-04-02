import React, { useState } from 'react';
import './Notifs.css';
import { IoIosNotifications } from "react-icons/io";
import { MdError } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";


export default function NotificationsComp() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Новая функция',
      message: 'Теперь вы можете еще эффективнее анализировать свой бюджет',
      time: '1 день назад',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Вы исполнили цель',
      message: 'Вы накопили запланированную сумму для цели',
      time: '12 часов назад',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Вы почти достигли лимита',
      message: 'Месячные траты почти достигли запланированного лимита',
      time: '5 часов назад',
      read: false
    },
    {
      id: 4,
      type: 'error',
      title: 'Вы превысили лимит',
      message: 'Месячные траты выли за пределы запланированного лимита',
      time: '2 часа назад',
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="container settings-container">
      <div className="notifications-header">
        <h1>Уведомления</h1>
        <div className="notifications-actions">
          <span className="unread-count">{unreadCount} непрочитано</span>
          <button 
            className="notif-buttons" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Пометить все прочитанным
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">
                {notification.type === 'info' && <span className="icon info-icon"><IoIosNotifications /></span>}
                {notification.type === 'success' && <span className="icon success-icon"><BiSolidLike /></span>}
                {notification.type === 'error' && <span className="icon error-icon"><MdError /></span>}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="read-button"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Пометить прочитанным
                  </button>
                )}
                <button 
                  className="delete-button"
                  onClick={() => deleteNotification(notification.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <p>У вас нет уведомлений!</p>
          </div>
        )}
      </div>
    </div>
  );
}