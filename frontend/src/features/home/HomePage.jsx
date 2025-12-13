import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';

const HomePage = () => {
  // État pour les données dynamiques des mentors
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  // État pour le carousel d'images (stories)
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyImages, setStoryImages] = useState([]);
  
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
      'bg-blue-200 text-blue-800',
      'bg-green-200 text-green-800',
      'bg-purple-200 text-purple-800',
      'bg-yellow-200 text-yellow-800',
      'bg-red-200 text-red-800',
      'bg-indigo-200 text-indigo-800',
      'bg-pink-200 text-pink-800'
    ];
    return colors[id % colors.length];
  };
  

  
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
      'Jeux de Société': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    };
    
    // Images spécifiques pour certains mots-clés dans le titre
    if (title.toLowerCase().includes('festival')) {
      return 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    } else if (title.toLowerCase().includes('vélo')) {
      return 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    } else if (title.toLowerCase().includes('marathon')) {
      return 'https://images.unsplash.com/photo-1530947443747-bcb41920bdaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    }
    
    // Retourne l'image de la catégorie ou une image par défaut si la catégorie n'existe pas
    return categoryImages[category] || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
  };
  
  // Charger les données des mentors
  useEffect(() => {
    const fetchMentors = async () => {
      setLoadingMentors(true);
      try {
        const data = await apiService.getMentoringSessions();
        
        // Conversion des données de l'API au format attendu
        const mentorsMap = new Map();
        
        data.forEach(session => {
          const mentor = session.mentor;
          
          if (!mentorsMap.has(mentor.id)) {
            mentorsMap.set(mentor.id, {
              id: mentor.id,
              name: mentor.name,
              level: mentor.level,
              specialty: session.subject || 'Non spécifié',
              // Ajout d'un rating pour chaque mentor (entre 4.0 et 5.0)
              rating: (4 + Math.random()).toFixed(1)
            });
          }
        });
        
        // Récupérer les mentors depuis l'API
        const apiMentors = Array.from(mentorsMap.values());
        
        // Si nous avons au moins 3 mentors de l'API, les utiliser
        if (apiMentors.length >= 3) {
          setMentors(apiMentors.slice(0, 6)); // Limiter à 6 mentors
        } else {
          // Utiliser uniquement les mentors de l'API
          setMentors(apiMentors.slice(0, 6)); // Limiter à 6 mentors
        }
      } catch (err) {
        console.error('Erreur lors du chargement des mentors:', err);
        
        // En cas d'erreur, afficher un message d'erreur et laisser la liste vide
        console.error('Impossible de charger les mentors depuis l\'API');
        setMentors([]);
      } finally {
        setLoadingMentors(false);
      }
    };
    
    fetchMentors();
  }, []);
  
  // Charger les données des événements depuis l'API
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Utiliser getEvents pour avoir les mêmes événements que sur la page des événements
        const data = await apiService.getEvents();
        
        if (data && data.length > 0) {
          // Tri des événements par date pour afficher les plus proches
          const sortedEvents = [...data].sort((a, b) => {
            const dateA = new Date(a.date_start || '2099-01-01');
            const dateB = new Date(b.date_start || '2099-01-01');
            return dateA - dateB;
          });
          
          // Limiter à 5 événements
          setUpcomingEvents(sortedEvents.slice(0, 5));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Charger les données d'affluence depuis l'API
  useEffect(() => {
    const fetchAffluenceData = async () => {
      try {
        const data = await apiService.getAffluenceData();
        if (data) {
          setAffluenceData(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'affluence:', error);
      }
    };
    
    fetchAffluenceData();
  }, []);
  
  const [campusNews, setCampusNews] = useState([]);
  
  const [affluenceData, setAffluenceData] = useState({});
  
  // Les événements sont déjà déclarés plus haut
  
  const [mentorRequests, setMentorRequests] = useState([
    {
      id: 1,
      student: 'Sophie Martin',
      subject: 'Programmation React',
      urgency: 'Moyenne',
      date: '2025-07-03',
      status: 'En attente'
    },
    {
      id: 2,
      student: 'Thomas Dubois',
      subject: 'Bases de données NoSQL',
      urgency: 'Élevée',
      date: '2025-07-02',
      status: 'En attente'
    },
    {
      id: 3,
      student: 'Camille Leroy',
      subject: 'Sécurité Web',
      urgency: 'Faible',
      date: '2025-07-04',
      status: 'Planifié'
    }
  ]);

  const getCategoryConfig = (category) => {
    const configs = {
      'Développement': { gradient: 'from-blue-500 to-cyan-500', color: 'bg-blue-100 text-blue-800', icon: '💻' },
      'Carrière': { gradient: 'from-green-500 to-emerald-500', color: 'bg-green-100 text-green-800', icon: '🚀' },
      'Ressources': { gradient: 'from-purple-500 to-pink-500', color: 'bg-purple-100 text-purple-800', icon: '📚' },
      'Événements': { gradient: 'from-orange-500 to-red-500', color: 'bg-orange-100 text-orange-800', icon: '🎉' },
      'Campus': { gradient: 'from-indigo-500 to-purple-500', color: 'bg-indigo-100 text-indigo-800', icon: '🏫' }
    };
    return configs[category] || { gradient: 'from-gray-500 to-gray-600', color: 'bg-gray-100 text-gray-800', icon: '💬' };
  };

  const getNewsBadgeColor = (badgeColor) => {
    const colors = {
      'blue': 'bg-blue-100 text-blue-800',
      'green': 'bg-green-100 text-green-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
      'red': 'bg-red-100 text-red-800'
    };
    return colors[badgeColor] || 'bg-gray-100 text-gray-800';
  };

  const getAffluenceColor = (niveau) => {
    if (!niveau) return 'bg-gray-200 text-gray-600';
    
    switch (niveau.toLowerCase()) {
      case 'élevée':
      case 'elevee':
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'moyenne':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'faible':
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header moderne avec image et dégradé */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        {/* Image en arrière-plan avec transparence */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
            alt="Campus background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Forme ondulée en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="px-4 py-36 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-8">
              Ton campus, ta vie étudiante
            </h1>
            <p className="text-2xl text-white/90 mb-16">
              Tout ce dont tu as besoin pour réussir et t'épanouir à l'ESTIAM
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
        {/* Stories Section moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center">
              <span className="mr-3 text-2xl">🔥</span>
              À ne pas manquer
            </h2>
            <Link to="/social" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center group">
              Voir tous les événements
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className="flex-shrink-0 w-64 relative">
                <div className="h-72 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                  onClick={() => window.location.href = `/social/event/${event.id}`}
                >
                  {/* Image de l'événement */}
                  <img
                    src={event.image_url || getEventImage(event.category, event.title)}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>

                  {/* Story WhatsApp - Cercle unique avec bordure segmentée - Coin supérieur gauche */}
                  <div
                    className="absolute top-4 left-4 w-16 h-16 z-30 cursor-pointer transform transition-transform hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Créer un tableau d'images pour le carousel
                      const images = [
                        event.image_url || getEventImage(event.category, event.title),
                        getEventImage(event.category, 'Tech'),
                        getEventImage(event.category, 'Social'),
                        getEventImage(event.category, 'Culture')
                      ];
                      setStoryImages(images);
                      setCurrentStoryIndex(0);
                      setShowStoryModal(true);
                    }}
                  >
                    <div className="relative w-full h-full">
                        {/* Bordure segmentée avec SVG */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                          {/* Segment 1 - Jaune à Rose */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient1)"
                            strokeWidth="3"
                            strokeDasharray="70.7 212.1"
                            strokeDashoffset="0"
                            strokeLinecap="round"
                          />
                          {/* Segment 2 - Violet à Bleu */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient2)"
                            strokeWidth="3"
                            strokeDasharray="70.7 212.1"
                            strokeDashoffset="-70.7"
                            strokeLinecap="round"
                          />
                          {/* Segment 3 - Vert à Émeraude */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient3)"
                            strokeWidth="3"
                            strokeDasharray="70.7 212.1"
                            strokeDashoffset="-141.4"
                            strokeLinecap="round"
                          />
                          {/* Segment 4 - Orange à Rouge */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient4)"
                            strokeWidth="3"
                            strokeDasharray="70.7 212.1"
                            strokeDashoffset="-212.1"
                            strokeLinecap="round"
                          />

                          {/* Définition des gradients */}
                          <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#34d399" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fb923c" />
                              <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Image au centre */}
                        <div className="absolute inset-2 rounded-full border-2 border-white overflow-hidden shadow-lg">
                          <img
                            src={event.image_url || getEventImage(event.category, event.title)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Badge compteur d'images */}
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-orange-500 to-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-md">
                          4
                        </div>
                    </div>
                  </div>

                  {/* Contenu en bas de la carte */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium">
                          {event.category}
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium">
                          {event.date_start &&
                            new Date(event.date_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-white/90 mb-3 line-clamp-2">{event.description}</p>

                      {/* Groupe d'avatars des participants (style WhatsApp stories) */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center -space-x-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                            A
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                            M
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                            S
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                            +{event.attendance || '5'}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-white/80">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>

                      <div className="text-xs text-white/70">
                        {event.place || 'Lieu à confirmer'}
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Section affluence - Maintenant à gauche */}
          <aside className="lg:w-1/3">
            {/* Titre de la section affluence */}
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mr-3">
                📊
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Affluence Campus
              </h2>
            </div>

            {/* Card Affluence */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Statistiques d'affluence en temps réel</h3>
                <div className="text-xs text-gray-500">
                  Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Salle M */}
                <div className="bg-gray-50 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 to-green-500"></div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold mr-2">M</div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Occupation</span>
                        <span className="text-green-600 font-bold">{affluenceData?.salleM?.occupation || '2.5%'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: affluenceData?.salleM?.occupation || '2.5%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{affluenceData?.salleM?.places || 'undefined places disponibles'}</div>
                </div>
                
                {/* Salle L */}
                <div className="bg-gray-50 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 to-green-500"></div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold mr-2">L</div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Occupation</span>
                        <span className="text-green-600 font-bold">{affluenceData?.salleL?.occupation || '15%'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: affluenceData?.salleL?.occupation || '15%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{affluenceData?.salleL?.places || 'undefined places disponibles'}</div>
                </div>
                
                {/* Salle H */}
                <div className="bg-gray-50 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 to-green-500"></div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold mr-2">H</div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Occupation</span>
                        <span className="text-green-600 font-bold">{affluenceData?.salleH?.occupation || '5%'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: affluenceData?.salleH?.occupation || '5%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{affluenceData?.salleH?.places || 'undefined places disponibles'}</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/affluence" className="text-blue-600 hover:text-blue-800 transition-colors text-sm flex items-center justify-center">
                  Voir toutes les salles
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </aside>

          {/* Contenu principal - Section des mentors - Maintenant à droite avec hauteur augmentée */}
          <main className="lg:w-2/3">
            {/* Header des mentors */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mr-3">
                  🎓
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Trouver un mentor
                </h2>
              </div>
              <Link to="/mentoring" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold px-6 py-3 rounded-2xl flex items-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Voir tout
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Liste des mentors avec hauteur augmentée */}
            {loadingMentors ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentors.map((mentor, index) => (
                  <Link
                    to="/mentoring"
                    key={index}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-4 h-40"
                  >
                    <div className={`h-20 w-20 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-semibold ${getBackgroundColor(mentor.id)}`}>
                      {getInitials(mentor.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{mentor.name}</h3>
                      <p className="text-gray-600">Niveau: {mentor.level}</p>
                      <p className="text-gray-600">{mentor.specialty}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-500 mr-1 text-lg">★</span>
                        <span className="font-medium">{mentor.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {mentors.length === 0 && (
                  <div className="col-span-full bg-white rounded-3xl p-6 text-center shadow-xl border border-gray-200">
                    <p className="text-gray-500">Aucun mentor disponible pour le moment.</p>
                    <Link to="/mentoring" className="text-purple-600 font-medium mt-2 inline-block">Voir toutes les options de mentorat</Link>
                  </div>
                )}
              </div>
            )}
          </main>

        </div>
      </div>

      {/* CSS réduit */}
      <style jsx>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Modal Carousel Stories WhatsApp */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          {/* Bouton fermer */}
          <button
            onClick={() => setShowStoryModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[10000]"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Barres de progression (comme WhatsApp) */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-[10000]">
            {storyImages.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    index < currentStoryIndex ? 'w-full' : index === currentStoryIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Container principal du carousel */}
          <div className="relative w-full h-full max-w-lg mx-auto flex items-center justify-center">
            {/* Zone cliquable gauche - Image précédente */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-[9998]"
              onClick={() => {
                if (currentStoryIndex > 0) {
                  setCurrentStoryIndex(currentStoryIndex - 1);
                }
              }}
            />

            {/* Image actuelle */}
            <img
              src={storyImages[currentStoryIndex]}
              alt={`Story ${currentStoryIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Zone cliquable droite - Image suivante */}
            <div
              className="absolute right-0 top-0 bottom-0 w-2/3 cursor-pointer z-[9998]"
              onClick={() => {
                if (currentStoryIndex < storyImages.length - 1) {
                  setCurrentStoryIndex(currentStoryIndex + 1);
                } else {
                  setShowStoryModal(false);
                }
              }}
            />

            {/* Flèche gauche (optionnel) */}
            {currentStoryIndex > 0 && (
              <button
                onClick={() => setCurrentStoryIndex(currentStoryIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[10000]"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Flèche droite (optionnel) */}
            {currentStoryIndex < storyImages.length - 1 && (
              <button
                onClick={() => setCurrentStoryIndex(currentStoryIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[10000]"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Compteur d'images */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentStoryIndex + 1} / {storyImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;