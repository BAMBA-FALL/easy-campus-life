"""
Script d'initialisation de la base de données
Crée un utilisateur de test et des données de démonstration
"""
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.classroom import Classroom
from app.models.event import Event
from app.utils.auth import get_password_hash
from datetime import datetime, timedelta


def init_test_user(db: Session) -> dict:
    """
    Crée un utilisateur de test s'il n'existe pas déjà
    Email: etudiant@test.com
    Password: student123
    """
    # Vérifier si l'utilisateur existe déjà
    existing_user = db.query(User).filter(User.email == "etudiant@test.com").first()

    if existing_user:
        return {
            "status": "exists",
            "message": "L'utilisateur de test existe déjà",
            "user": {
                "id": existing_user.id,
                "name": existing_user.name,
                "email": existing_user.email,
                "level": existing_user.level
            }
        }

    # Créer l'utilisateur de test
    hashed_password = get_password_hash("student123")
    test_user = User(
        name="Étudiant Test",
        email="etudiant@test.com",
        password=hashed_password,
        level="Beginner"
    )

    db.add(test_user)
    db.commit()
    db.refresh(test_user)

    return {
        "status": "created",
        "message": "Utilisateur de test créé avec succès",
        "user": {
            "id": test_user.id,
            "name": test_user.name,
            "email": test_user.email,
            "level": test_user.level
        },
        "credentials": {
            "email": "etudiant@test.com",
            "password": "student123"
        }
    }


def init_sample_classrooms(db: Session) -> dict:
    """Crée des salles de classe de démonstration"""
    classrooms_data = [
        "Salle A101",
        "Salle B203",
        "Bibliothèque",
        "Cafétéria",
        "Amphithéâtre"
    ]

    created = []
    existing = []

    for classroom_name in classrooms_data:
        existing_classroom = db.query(Classroom).filter(Classroom.name == classroom_name).first()

        if existing_classroom:
            existing.append(classroom_name)
        else:
            classroom = Classroom(name=classroom_name)
            db.add(classroom)
            created.append(classroom_name)

    if created:
        db.commit()

    return {
        "created": created,
        "existing": existing,
        "total": len(classrooms_data)
    }


def init_sample_events(db: Session) -> dict:
    """Crée des événements de démonstration"""
    now = datetime.now()

    events_data = [
        {
            "title": "Semaine d'intégration",
            "description": "Bienvenue aux nouveaux étudiants ! Découvrez le campus et rencontrez vos camarades.",
            "category": "Social",
            "attendance": "Optional",
            "place": "Campus Principal",
            "date_start": now + timedelta(days=5, hours=9),
            "date_end": now + timedelta(days=9, hours=18)
        },
        {
            "title": "Workshop Python",
            "description": "Atelier d'introduction à Python pour les débutants.",
            "category": "Workshop",
            "attendance": "Optional",
            "place": "Salle B203",
            "date_start": now + timedelta(days=10, hours=14),
            "date_end": now + timedelta(days=10, hours=17)
        },
        {
            "title": "Conférence IA",
            "description": "Conférence sur l'intelligence artificielle et ses applications.",
            "category": "Seminar",
            "attendance": "Mandatory",
            "place": "Amphithéâtre",
            "date_start": now + timedelta(days=15, hours=10),
            "date_end": now + timedelta(days=15, hours=12)
        }
    ]

    created = []

    for event_data in events_data:
        # Vérifier si l'événement existe déjà
        existing_event = db.query(Event).filter(Event.title == event_data["title"]).first()

        if not existing_event:
            event = Event(**event_data)
            db.add(event)
            created.append(event_data["title"])

    if created:
        db.commit()

    return {
        "created": created,
        "total": len(events_data)
    }


def initialize_database(db: Session) -> dict:
    """
    Initialise la base de données avec des données de test
    """
    try:
        user_result = init_test_user(db)
        classrooms_result = init_sample_classrooms(db)
        events_result = init_sample_events(db)

        return {
            "success": True,
            "message": "Base de données initialisée avec succès",
            "details": {
                "user": user_result,
                "classrooms": classrooms_result,
                "events": events_result
            }
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Erreur lors de l'initialisation: {str(e)}",
            "error": str(e)
        }
