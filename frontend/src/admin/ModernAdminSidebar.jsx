import React, { useState } from 'react';

const ModernAdminSidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Tableau de bord',
      icon: '📊',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Vue d\'ensemble'
    },
    {
      id: 'users',
      name: 'Utilisateurs',
      icon: '👥',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Gestion des comptes'
    },
    {
      id: 'events',
      name: 'Événements',
      icon: '🎉',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Organisation campus'
    },
    {
      id: 'mentors',
      name: 'Mentors',
      icon: '🎓',
      gradient: 'from-orange-500 to-red-500',
      description: 'Programme mentorat'
    },
    {
      id: 'presences',
      name: 'Présences',
      icon: '🏢',
      gradient: 'from-indigo-500 to-purple-600',
      description: 'Suivi des présences'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📈',
      gradient: 'from-teal-500 to-cyan-600',
      description: 'Données & insights'
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: '⚙️',
      gradient: 'from-gray-600 to-gray-800',
      description: 'Configuration'
    }
  ];

  return (
    <div className={`bg-slate-900 text-white ${isCollapsed ? 'w-20' : 'w-64'} h-screen flex flex-col`}>
      {/* Bordure accent */}
      <div className="w-full h-1 bg-blue-500"></div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Logo et toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl">
              🎓
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-white">
                  EasyCampus
                </h1>
                <p className="text-xs text-slate-400">ADMIN</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            <svg className={`w-4 h-4 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                activeTab === item.id
                  ? `bg-gradient-to-r ${item.gradient} text-white`
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2'} rounded-lg`}
            >
              <div className={`text-xl ${isCollapsed ? '' : 'mr-3'}`}>
                {item.icon}
              </div>

              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <span className="font-medium text-sm block">
                    {item.name}
                  </span>
                  <span className="text-xs opacity-75">
                    {item.description}
                  </span>
                </div>
              )}

              {activeTab === item.id && !isCollapsed && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Statistiques rapides */}
        {!isCollapsed && (
          <div className="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Statut Système
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Uptime</span>
                <span className="text-green-400 font-medium">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Utilisateurs actifs</span>
                <span className="text-blue-400 font-medium">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Événements ce mois</span>
                <span className="text-purple-400 font-medium">12</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile section */}
      <div className="p-4 border-t border-slate-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} cursor-pointer hover:bg-slate-800 p-2 rounded-lg`}>
          <div className="relative">
            <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">En ligne</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 space-y-1">
            <button className="w-full text-left text-xs text-slate-400 hover:text-white flex items-center p-2 rounded-lg hover:bg-slate-800">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon Profil
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="w-full text-left text-xs text-slate-400 hover:text-red-400 flex items-center p-2 rounded-lg hover:bg-red-500/10"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernAdminSidebar;
