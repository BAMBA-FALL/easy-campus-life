import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

const NotificationToast = () => {
  const { notifications, markAsRead, clearNotification } = useSocket();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Afficher uniquement les 3 dernières notifications non lues
    const unreadNotifications = notifications
      .filter((n) => !n.read)
      .slice(0, 3);
    setVisibleNotifications(unreadNotifications);
  }, [notifications]);

  const handleDismiss = (notificationId) => {
    markAsRead(notificationId);
    setTimeout(() => {
      clearNotification(notificationId);
    }, 300);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event':
        return '🎉';
      case 'mentor':
        return '🎓';
      case 'classroom':
        return '🏢';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event':
        return 'from-green-500 to-emerald-500';
      case 'mentor':
        return 'from-orange-500 to-red-500';
      case 'classroom':
        return 'from-indigo-500 to-purple-600';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-3 pointer-events-none">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto animate-slide-in-right"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm">
            <div className={`h-1 bg-gradient-to-r ${getNotificationColor(notification.type)}`}></div>

            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getNotificationColor(
                      notification.type
                    )} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>

                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Dismiss"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
