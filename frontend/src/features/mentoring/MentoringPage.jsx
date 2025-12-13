import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';

const MentoringPage = () => {
  const { user } = useAuth();
  const isMentor = user && (user.level === 'Mentor' || user.level === 'mentor');

  // États pour la vue étudiant
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    topic: '',
    message: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [mentoringSessions, setMentoringSessions] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // États pour la vue mentor
  const [mentorRequests, setMentorRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour générer les initiales à partir d'un nom
  const getInitials = (name) => {
    if (!name) return 'XX';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Fonction pour générer une couleur de fond basée sur l'ID
  const getBackgroundColor = (id) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-pink-400 to-pink-600'
    ];
    return colors[id % colors.length];
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
    setShowBookingForm(false);
    setBookingSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      const mentoringData = {
        mentor_id: selectedMentor.id,
        sponsored_id: user.id,
        subject: bookingData.topic,
        description: bookingData.message
      };

      await apiService.createMentoringSession(mentoringData);
      await fetchMentoringSessions();

      setBookingSuccess(true);
      setShowBookingForm(false);
      setBookingData({
        date: '',
        time: '',
        topic: '',
        message: ''
      });
    } catch (error) {
      console.error('Erreur lors de la création de la session de mentorat:', error);
      alert('Erreur lors de la création de la demande. Veuillez réessayer.');
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await apiService.updateMentoringSession(requestId, { status: newStatus });
      fetchMentorRequests();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Impossible de mettre à jour le statut');
    }
  };

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

  // Chargement des données selon le rôle
  const fetchMentorRequests = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUserMentoring(user.id);
      setMentorRequests(data);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const users = await apiService.getUsers();
      // Filtrer pour ne garder que les mentors
      const mentorUsers = users.filter(u => u.level === 'Mentor' || u.level === 'mentor');
      // Convertir au format attendu par le composant
      const formattedMentors = mentorUsers.map(mentor => ({
        id: mentor.id,
        name: mentor.name,
        department: `Niveau ${mentor.level}`,
        specialty: 'Mentorat académique',
        availability: 'Sur demande',
        rating: 4.5,
        bio: `${mentor.name} est disponible pour vous accompagner dans vos études.`
      }));
      setMentors(formattedMentors);
    } catch (err) {
      console.error('Erreur lors du chargement des mentors:', err);
    }
  };

  const fetchMentoringSessions = async () => {
    try {
      const data = await apiService.getMentoringSessions();
      setMentoringSessions(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des sessions de mentorat:', err);
      setError('Impossible de charger les données de mentorat.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (isMentor) {
        await fetchMentorRequests();
      } else {
        await Promise.all([fetchMentors(), fetchMentoringSessions()]);
      }
      setLoading(false);
    };
    loadData();
  }, [isMentor, user]);

  const filteredMentors = selectedCategory === 'Tous'
    ? mentors
    : mentors.filter(mentor => mentor.specialty === selectedCategory);

  const filteredRequests = mentorRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Vue pour les mentors
  if (isMentor) {
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
                className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${filter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                Toutes ({mentorRequests.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${filter === 'pending'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                En attente ({mentorRequests.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('accepted')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors duration-150 ${filter === 'accepted'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                Acceptées ({mentorRequests.filter(r => r.status === 'accepted').length})
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
  }

  // Vue pour les étudiants (contenu original)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Mentorat Entre Étudiants</h1>
              <p className="text-slate-600 mt-1">Connectez-vous avec d'autres étudiants pour partager vos compétences et progresser ensemble</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Mentors actifs</p>
                <p className="text-3xl font-bold text-slate-800">{mentors.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Sessions actives</p>
                <p className="text-3xl font-bold text-slate-800">{mentoringSessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Note moyenne</p>
                <p className="text-3xl font-bold text-slate-800">4.8</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {['Tous', 'React', 'Python', 'Java', 'DevOps', 'Data Science'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Section des sessions de mentorat actives */}
        {mentoringSessions.length > 0 && !error && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Sessions de mentorat actives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentoringSessions.map(session => (
                <Link
                  to={`/mentoring/session/${session.id}`}
                  key={session.id}
                  className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800 text-base">{session.subject}</h3>
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-slate-600 text-sm">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span><strong>Mentor:</strong> {session.mentor.name}</span>
                      </div>
                      <div className="flex items-center text-slate-600 text-sm">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <span><strong>Étudiant:</strong> {session.sponsored.name}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">Voir détails →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Liste des mentors */}
          <div className="lg:w-1/3">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                Mentors disponibles
              </h2>

              {filteredMentors.length > 0 ? (
                <div className="space-y-3">
                  {filteredMentors.map((mentor, index) => (
                    <div
                      key={mentor.id}
                      onClick={() => handleMentorSelect(mentor)}
                      className={`cursor-pointer p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${selectedMentor?.id === mentor.id
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 shadow-lg'
                        : 'bg-white/60 hover:bg-white/80 border border-white/50 hover:shadow-lg'
                        }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-bold shadow-lg ${getBackgroundColor(mentor.id)}`}>
                          {getInitials(mentor.name)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{mentor.name}</h3>
                          <p className="text-sm text-slate-600 mb-1">{mentor.department}</p>
                          <div className="flex items-center text-yellow-500 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {mentor.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">Aucun mentor disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Détails du mentor sélectionné */}
          <div className="lg:w-2/3">
            {selectedMentor ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                <div className="flex items-center mb-6">
                  <div className={`w-24 h-24 rounded-full mr-6 flex items-center justify-center text-white text-2xl font-bold shadow-xl ${getBackgroundColor(selectedMentor.id)}`}>
                    {getInitials(selectedMentor.name)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{selectedMentor.name}</h2>
                    <p className="text-slate-600 text-lg mb-2">{selectedMentor.department}</p>
                    <div className="flex items-center text-yellow-500 text-lg">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {selectedMentor.rating} - Mentor expérimenté
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">{selectedMentor.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                    <h3 className="font-semibold text-purple-700 text-lg mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Spécialité
                    </h3>
                    <p className="text-purple-800 font-medium">{selectedMentor.specialty}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                    <h3 className="font-semibold text-blue-700 text-lg mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Disponibilité
                    </h3>
                    <p className="text-blue-800 font-medium">{selectedMentor.availability}</p>
                  </div>
                </div>

                {bookingSuccess ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-2xl text-green-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Réservation confirmée !</h3>
                        <p>Votre session avec {selectedMentor.name} a été réservée avec succès.</p>
                      </div>
                    </div>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      onClick={() => setBookingSuccess(false)}
                    >
                      Voir mes réservations
                    </button>
                  </div>
                ) : (
                  <>
                    {!showBookingForm ? (
                      <button
                        onClick={() => setShowBookingForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Réserver une session
                      </button>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date de la session</label>
                            <input
                              type="date"
                              name="date"
                              value={bookingData.date}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Heure de la session</label>
                            <input
                              type="time"
                              name="time"
                              value={bookingData.time}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Sujet de la session</label>
                          <input
                            type="text"
                            name="topic"
                            placeholder="Ex: Projet React, Algorithmes, Architecture..."
                            value={bookingData.topic}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Description de vos besoins</label>
                          <textarea
                            name="message"
                            rows="4"
                            placeholder="Expliquez brièvement ce sur quoi vous souhaitez travailler avec ce mentor..."
                            value={bookingData.message}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          ></textarea>
                        </div>

                        <div className="flex gap-4">
                          <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Confirmer la réservation
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowBookingForm(false)}
                            className="px-6 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-50"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-12 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Sélectionnez un mentor</h3>
                <p className="text-slate-600">Choisissez un mentor dans la liste pour voir ses détails et réserver une session</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentoringPage;
