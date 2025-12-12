import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const userStr = localStorage.getItem('user');
    let userId = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Connexion au serveur Socket.io
    // Utilise l'URL de production par défaut, ou REACT_APP_API_URL pour le développement local
    const socketUrl = process.env.REACT_APP_API_URL || 'https://easy-campus-life.onrender.com';
    const newSocket = io(socketUrl, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      auth: userId ? { user_id: userId } : {},
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
      setConnected(false);
    });

    newSocket.on('connection_established', (data) => {
      console.log('Connection established:', data);
    });

    // Écouter les nouvelles notifications
    newSocket.on('new_notification', (notification) => {
      console.log('New notification received:', notification);

      // Ajouter un ID unique et un timestamp si non présent
      const notificationWithId = {
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [notificationWithId, ...prev]);

      // Afficher une notification native du navigateur si autorisé
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });

    setSocket(newSocket);

    // Demander la permission pour les notifications natives
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    connected,
    notifications,
    markAsRead,
    clearNotification,
    clearAllNotifications,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
