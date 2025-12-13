import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const MentorRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  useEffect(() => {
    fetchMentorRequests();
  }, [user]);

  const fetchMentorRequests = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les sessions de mentorat où je suis le mentor
      const data = await apiService.getUserMentoring(user.id);
      setRequests(data);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await apiService.updateMentoringSession(requestId, { status: newStatus });
      // Rafraîchir la liste
      fetchMentorRequests();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Impossible de mettre à jour le statut');
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    const labels = {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Refusée',
      completed: 'Terminée'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Mes demandes de mentorat
          </h1>
          <p className="text-gray-600">Gérez les demandes d'aide des étudiants</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Toutes ({requests.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              En attente ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${
                filter === 'accepted'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Acceptées ({requests.filter(r => r.status === 'accepted').length})
            </button>
          </div>
        </div>

        {/* Liste des demandes */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune demande</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? "Vous n'avez pas encore reçu de demandes de mentorat"
                : `Aucune demande ${filter === 'pending' ? 'en attente' : filter === 'accepted' ? 'acceptée' : 'avec ce statut'}`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-150">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {request.sponsored_name ? request.sponsored_name.charAt(0) : 'E'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {request.sponsored_name || 'Étudiant'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(request.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {request.subject || 'Sujet non spécifié'}
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {request.description || 'Pas de description fournie'}
                    </p>
                  </div>

                  {/* Actions */}
                  {request.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleStatusChange(request.id, 'accepted')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl font-semibold transition-colors duration-150 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Accepter
                      </button>
                      <button
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-semibold transition-colors duration-150 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Refuser
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleStatusChange(request.id, 'completed')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-xl font-semibold transition-colors duration-150 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Marquer comme terminée
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorRequestsPage;
