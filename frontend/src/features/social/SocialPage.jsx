import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';

const SocialPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [participantCounts, setParticipantCounts] = useState({});

  // Fonction pour obtenir une image en fonction de la catégorie de l'événement
  const getEventImage = (category, title) => {
    // Images par défaut pour chaque catégorie
    const categoryImages = {
      'Musique': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Culture': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Gastronomie': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Sport': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Marché': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Cinéma': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Écologie': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Exposition': 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Fête nationale': 'https://images.unsplash.com/photo-1551803091-e20673f15770?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Atelier': 'https://images.unsplash.com/photo-1544928147-79a2dbc1f669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Technologie': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Art': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Littérature': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Business': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Five': 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Jeux de Société': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Social': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Tech': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      'Académique': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    };

    // Images spécifiques pour certains mots-clés dans le titre
    if (title && title.toLowerCase().includes('festival')) {
      return 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    } else if (title && title.toLowerCase().includes('vélo')) {
      return 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    } else if (title && title.toLowerCase().includes('marathon')) {
      return 'https://images.unsplash.com/photo-1530947443747-bcb41920bdaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    }

    // Retourne l'image de la catégorie ou une image par défaut si la catégorie n'existe pas
    return categoryImages[category] || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
  };

  // Charger les données des événements depuis l'API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getEvents();
        console.log(data);
        setEvents(data);
        
        // Récupérer les statistiques de participation pour chaque événement
        const counts = {};
        for (const event of data) {
          try {
            const participantData = await apiService.getEventParticipantCount(event.id);
            counts[event.id] = participantData;
          } catch (error) {
            console.error(`Erreur lors du chargement des stats pour l'événement ${event.id}:`, error);
          }
        }
        setParticipantCounts(counts);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getEvents();
      setEvents(data);
      
      // Rafraîchir les statistiques
      const counts = {};
      for (const event of data) {
        try {
          const participantData = await apiService.getEventParticipantCount(event.id);
          counts[event.id] = participantData;
        } catch (error) {
          console.error(`Erreur lors du chargement des stats pour l'événement ${event.id}:`, error);
        }
      }
      setParticipantCounts(counts);
    } catch (error) {
      console.error('Erreur lors de l\'actualisation des événements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeUntilEvent = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Événement terminé';
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    if (diffDays < 7) return `Dans ${diffDays} jours`;
    if (diffDays < 30) return `Dans ${Math.ceil(diffDays / 7)} semaines`;
    return `Dans ${Math.ceil(diffDays / 30)} mois`;
  };

  const filteredEvents = selectedCategory === 'Tous' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const renderCreateEventModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-white/50">
          <button
            onClick={() => setShowCreateModal(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Créer un événement</h2>
              <p className="text-sm text-slate-600">Partagez votre événement avec la communauté</p>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="eventTitle" className="block text-sm font-medium text-slate-700 mb-2">Titre de l'événement</label>
              <input 
                type="text" 
                id="eventTitle" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="Ex: Festival Jazz sur Seine"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input 
                  type="date" 
                  id="eventDate" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="eventTime" className="block text-sm font-medium text-slate-700 mb-2">Heure</label>
                <input 
                  type="time" 
                  id="eventTime" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  required 
                />
              </div>
            </div>

            <div>
              <label htmlFor="eventLocation" className="block text-sm font-medium text-slate-700 mb-2">Lieu</label>
              <input 
                type="text" 
                id="eventLocation" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="Ex: Campus ESTIAM"
                required 
              />
            </div>

            <div>
              <label htmlFor="eventDescription" className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea 
                id="eventDescription" 
                rows="3" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                placeholder="Décrivez votre événement..."
                required
              ></textarea>
            </div>

                         <button 
               type="submit" 
               className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]"
             >
              Créer l'événement
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Événements Campus</h1>
              <p className="text-slate-600 mt-1">Découvrez et participez aux événements qui favorisent la vie étudiante d'ESTIAM</p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {['Tous', 'Social', 'Tech', 'Académique'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh} 
                disabled={isLoading} 
                className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 ${
                  isLoading 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8 8 0 004.582 9H9m11 11v-5h-.581a8 8 0 01-15.357-2H15" />
                </svg>
                {isLoading ? 'Actualisation...' : 'Actualiser'}
              </button>
              
                             <button 
                 onClick={() => setShowCreateModal(true)}
                 className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center gap-2"
               >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer un événement
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl border border-white/50">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Aucun événement trouvé</h3>
            <p className="text-slate-600 mb-6">
              {selectedCategory === 'Tous' 
                ? 'Aucun événement n\'est disponible pour le moment.' 
                : `Aucun événement dans la catégorie "${selectedCategory}" n'est disponible.`
              }
            </p>
            <button 
              onClick={() => setSelectedCategory('Tous')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Voir tous les événements
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map(event => {
              const participantData = participantCounts[event.id];
              const timeUntilEvent = getTimeUntilEvent(event.date_start);
              
              return (
                                 <div key={event.id} className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="relative">
                    {/* Image d'événement avec overlay gradient */}
                    <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                      <img
                        src={event.image_url || getEventImage(event.category, event.title)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                          {event.category || 'Social'}
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <span className="bg-purple-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {participantData ? participantData.participant_count : event.attendance || '0'} participants
                        </span>
                      </div>
                      
                      {/* Time indicator */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-blue-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {timeUntilEvent}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{event.title}</h2>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center text-slate-600 text-sm">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span>{new Date(event.date_start).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      
                      {event.place && (
                        <div className="flex items-center text-slate-600 text-sm">
                          <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span>{event.place}</span>
                        </div>
                      )}
                      
                      {participantData && (
                        <div className="flex items-center text-slate-600 text-sm">
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div>
                            <span>{participantData.participant_count} participants</span>
                            {participantData.expected_attendance && (
                              <span className="text-slate-500 ml-2">• {participantData.expected_attendance} attendus</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">{event.description}</p>
                    
                                         <Link 
                       to={`/social/event/${event.id}`} 
                       className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-center py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02]"
                     >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {renderCreateEventModal()}
      </div>
    </div>
  );
};

export default SocialPage;
