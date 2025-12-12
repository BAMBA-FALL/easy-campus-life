from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, get_db
from app.models import User, Event, Mentoring, Classroom, Presence, EventParticipation, Notification
from app.routes import users, events, mentoring, auth, classrooms, presences, event_participations
from app.utils.init_db import initialize_database
from app.socketio_manager import sio
import socketio

# Créer les tables dans la base de données
from app.database import Base
Base.metadata.create_all(bind=engine)

# Créer l'application FastAPI
app = FastAPI(
    title="Campus Life API",
    description="API pour gérer la vie dans un campus d'étudiants - événements et mentorat",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Combiner FastAPI avec Socket.io ASGI
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=app,
    socketio_path='socket.io'
)

# Inclure les routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(mentoring.router)
app.include_router(classrooms.router)
app.include_router(presences.router)
app.include_router(event_participations.router)

@app.get("/")
def read_root():
    """Page d'accueil de l'API"""
    return {
        "message": "Bienvenue sur l'API Campus Life",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth",
            "users": "/users",
            "events": "/events", 
            "mentoring": "/mentoring",
            "classrooms": "/classrooms",
            "presences": "/presences",
            "event-participations": "/event-participations",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    """Vérification de l'état de l'API"""
    return {"status": "healthy"}

@app.post("/initialize-db")
def init_db(db: Session = Depends(get_db)):
    """
    Endpoint pour initialiser la base de données avec des données de test
    ATTENTION: Cet endpoint est temporaire et devrait être supprimé en production

    Crée:
    - Un utilisateur étudiant (etudiant@test.com / student123)
    - Un utilisateur admin (admin@campus.fr / admin2024)
    - 8 mentors dans différentes technologies (Python, React, ML, DevOps, Java, Cybersécurité, UI/UX, Data Science)
    - Des relations de mentorat entre mentors et étudiants
    - Des salles de classe de démonstration
    - Des événements de démonstration
    """
    result = initialize_database(db)
    return result

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    # Utiliser socket_app au lieu de app pour combiner FastAPI et Socket.io
    uvicorn.run(socket_app, host="0.0.0.0", port=port) 