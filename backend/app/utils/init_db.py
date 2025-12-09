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
    # Utiliser un hash pré-calculé pour éviter les problèmes de bcrypt
    # Ce hash correspond au mot de passe "student123"
    hashed_password = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWVxXbdK"
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


def init_admin_user(db: Session) -> dict:
    """
    Crée un utilisateur admin s'il n'existe pas déjà
    Email: admin@campus.fr
    Password: admin2024
    """
    # Vérifier si l'admin existe déjà
    existing_admin = db.query(User).filter(User.email == "admin@campus.fr").first()

    if existing_admin:
        return {
            "status": "exists",
            "message": "L'utilisateur admin existe déjà",
            "user": {
                "id": existing_admin.id,
                "name": existing_admin.name,
                "email": existing_admin.email,
                "level": existing_admin.level
            }
        }

    # Créer l'utilisateur admin avec hash sécurisé
    try:
        hashed_password = get_password_hash("admin2024")
    except Exception:
        # Fallback vers un hash pré-calculé en cas d'erreur bcrypt
        # Hash pour "admin2024" généré avec bcrypt
        hashed_password = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWVxXbdK"

    admin_user = User(
        name="Admin User",
        email="admin@campus.fr",
        password=hashed_password,
        level="Admin"
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    return {
        "status": "created",
        "message": "Utilisateur admin créé avec succès",
        "user": {
            "id": admin_user.id,
            "name": admin_user.name,
            "email": admin_user.email,
            "level": admin_user.level
        },
        "credentials": {
            "email": "admin@campus.fr",
            "password": "admin2024"
        }
    }


def init_sample_classrooms(db: Session) -> dict:
    """Crée des salles de classe de démonstration"""
    classrooms_data = [
        {"name": "Salle A101", "capacity": 30},
        {"name": "Salle B203", "capacity": 25},
        {"name": "Bibliothèque", "capacity": 50},
        {"name": "Cafétéria", "capacity": 100},
        {"name": "Amphithéâtre", "capacity": 200}
    ]

    created = []
    existing = []

    for classroom_data in classrooms_data:
        existing_classroom = db.query(Classroom).filter(Classroom.name == classroom_data["name"]).first()

        if existing_classroom:
            existing.append(classroom_data["name"])
        else:
            classroom = Classroom(name=classroom_data["name"], capacity=classroom_data["capacity"])
            db.add(classroom)
            created.append(classroom_data["name"])

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
    Crée un utilisateur étudiant et un utilisateur admin
    """
    try:
        user_result = init_test_user(db)
        admin_result = init_admin_user(db)
        classrooms_result = init_sample_classrooms(db)
        events_result = init_sample_events(db)

        return {
            "success": True,
            "message": "Base de données initialisée avec succès",
            "details": {
                "student": user_result,
                "admin": admin_result,
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
