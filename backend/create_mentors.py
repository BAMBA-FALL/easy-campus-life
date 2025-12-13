#!/usr/bin/env python3
"""
Script pour créer les utilisateurs mentors via l'API
À exécuter depuis le répertoire backend
"""

import requests
import json

# URL de l'API (modifier selon votre configuration)
API_URL = "https://easy-campus-life.onrender.com/users/"  # URL de production
# API_URL = "http://localhost:8000/users/"  # Pour le développement local

# Données des mentors à créer
mentors = [
    {
        "name": "Sarah Martin",
        "email": "mentor@test.com",
        "password": "mentor123",
        "level": "Mentor"
    },
    {
        "name": "Thomas Dubois",
        "email": "mentor2@test.com",
        "password": "mentor123",
        "level": "Mentor"
    },
    {
        "name": "Marie Lefebvre",
        "email": "mentor3@test.com",
        "password": "mentor123",
        "level": "Mentor"
    }
]

def create_mentor(mentor_data):
    """Créer un mentor via l'API"""
    try:
        response = requests.post(
            API_URL,
            json=mentor_data,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 201:
            print(f"[OK] Mentor cree: {mentor_data['name']} ({mentor_data['email']})")
            return True
        elif response.status_code == 400 and "deja enregistre" in response.text.lower():
            print(f"[INFO] Mentor existe deja: {mentor_data['name']} ({mentor_data['email']})")
            return False
        else:
            print(f"[ERREUR] Pour {mentor_data['name']}: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"[ERREUR] Exception pour {mentor_data['name']}: {str(e)}")
        return False

def main():
    print("Creation des utilisateurs mentors...")
    print(f"API URL: {API_URL}\n")

    success_count = 0
    for mentor in mentors:
        if create_mentor(mentor):
            success_count += 1

    print(f"\nTermine! {success_count}/{len(mentors)} mentors crees avec succes")
    print("\nIdentifiants de connexion:")
    print("=" * 50)
    for mentor in mentors:
        print(f"Email: {mentor['email']}")
        print(f"Mot de passe: {mentor['password']}")
        print("-" * 50)

if __name__ == "__main__":
    main()
