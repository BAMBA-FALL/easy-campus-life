#!/usr/bin/env python3
"""
Script pour créer un nouvel utilisateur étudiant valide via l'API
"""

import requests
import json

# URL de l'API
API_URL = "https://easy-campus-life.onrender.com/users/"

# Nouvel étudiant avec email différent
student = {
    "name": "Jean Dupont",
    "email": "student@campus.fr",
    "password": "student123",
    "level": "L3"
}

print("="*60)
print("CREATION D'UN NOUVEL ETUDIANT")
print("="*60 + "\n")

try:
    # Créer l'utilisateur
    response = requests.post(
        API_URL,
        json=student,
        headers={"Content-Type": "application/json"}
    )

    if response.status_code == 201:
        print(f"[OK] Etudiant cree avec succes!")
        user_data = response.json()
        print(f"ID: {user_data.get('id')}")
        print(f"Nom: {user_data.get('name')}")
        print(f"Email: {user_data.get('email')}")
        print(f"Niveau: {user_data.get('level')}")
    elif response.status_code == 400:
        print(f"[INFO] Erreur 400: {response.text}")
    else:
        print(f"[ERREUR] Status: {response.status_code}")
        print(f"Reponse: {response.text}")

except Exception as e:
    print(f"[ERREUR] Exception: {str(e)}")

print("\n" + "="*60)
print("TEST DE CONNEXION")
print("="*60 + "\n")

# Tester la connexion
try:
    login_response = requests.post(
        "https://easy-campus-life.onrender.com/auth/login-json",
        json={"email": student['email'], "password": student['password']},
        headers={"Content-Type": "application/json"}
    )

    if login_response.status_code == 200:
        print(f"[OK] Connexion reussie avec le nouveau compte!")
        token_data = login_response.json()
        print(f"Token recu: {token_data.get('access_token', 'N/A')[:50]}...")
    else:
        print(f"[ERREUR] Echec de connexion - Status: {login_response.status_code}")
        print(f"Reponse: {login_response.text}")

except Exception as e:
    print(f"[ERREUR] Exception lors du test: {str(e)}")

print("\n" + "="*60)
print("IDENTIFIANTS DU NOUVEAU COMPTE")
print("="*60)
print(f"Email: {student['email']}")
print(f"Mot de passe: {student['password']}")
print(f"Niveau: {student['level']}")
print("="*60)
