import React, { useState } from 'react';

import ModernSidebar from './ModernAdminSidebar';
import ModernDashboardOverview from './ModernDashboardOverview';
import ModernUsersManagement from './ModernUsersManagement';
import ModernEventsManagement from './ModernEventsManagement';
import ModernMentorsManagement from './ModernMentorsManagement';
import ModernPresencesManagement from './ModernPresencesManagement';

const ModernMainAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = (activeTab) => {
    const titles = {
      dashboard: 'Tableau de Bord',
      users: 'Gestion des Utilisateurs',
      events: 'Gestion des Événements',
      mentors: 'Gestion des Mentors',
      presences: 'Gestion des Présences',
      analytics: 'Analytics',
      settings: 'Paramètres'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getPageDescription = (activeTab) => {
    const descriptions = {
      dashboard: 'Vue d\'ensemble de votre plateforme EasyCampus',
      users: 'Gérez les utilisateurs, leurs rôles et permissions',
      events: 'Créez et gérez les événements du campus',
      mentors: 'Organisez le programme de mentorat et suivez les sessions',
      presences: 'Suivi des présences et occupation des salles en temps réel',
      analytics: 'Analysez les performances et l\'engagement',
      settings: 'Configurez les paramètres de la plateforme'
    };
    return descriptions[activeTab] || '';
  };

  const PlaceholderPage = ({ title, icon, description }) => (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-lg flex items-center justify-center text-3xl">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 font-semibold mb-2">
            🚀 Interface en cours de développement
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>✨ Design moderne et intuitif</p>
            <p>🎯 Optimisé pour l'expérience utilisateur</p>
            <p>⚡ Performance et accessibilité</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernDashboardOverview />;
      case 'users':
        return <ModernUsersManagement />;
      case 'events':
        return <ModernEventsManagement />;
      case 'mentors':
        return <ModernMentorsManagement />;
      case 'presences':
        return <ModernPresencesManagement />;
      case 'analytics':
        return <PlaceholderPage
          title="Analytics Avancées"
          icon="📈"
          description="Analysez les performances avec des graphiques interactifs et des insights détaillés"
        />;
      case 'settings':
        return <PlaceholderPage
          title="Paramètres"
          icon="⚙️"
          description="Configurez votre plateforme avec des options avancées de personnalisation"
        />;
      default:
        return <ModernDashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <ModernSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      {getPageTitle(activeTab)}
                    </h1>
                    <p className="text-gray-600 text-sm">{getPageDescription(activeTab)}</p>
                  </div>
                </div>
              </div>

              {/* Actions du header */}
              <div className="flex items-center space-x-2">
                {/* Notification */}
                <button className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                </button>

                {/* Recherche rapide */}
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Profile dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AD</span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-500">Administrateur</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 hover:opacity-100 invisible hover:visible z-50">
                    <div className="p-2">
                      <a href="/dashboard" className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour au site
                      </a>
                      <hr className="my-2 border-gray-200" />
                      <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon Profil
                      </a>
                      <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Paramètres
                      </a>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={() => {
                          localStorage.removeItem('isAuthenticated');
                          localStorage.removeItem('user');
                          localStorage.removeItem('token');
                          window.location.href = '/login';
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <span>© 2025 EasyCampus</span>
              <span className="text-gray-400">|</span>
              <span>Version 1.0.0</span>
              <span className="text-gray-400">|</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Système opérationnel</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span>Hackathon 2025</span>
              <span>🚀</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModernMainAdminDashboard;
