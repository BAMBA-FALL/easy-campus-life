#!/usr/bin/env python3
"""
Script pour tester le login via l'API
"""

import requests
import json

# URL de l'API
API_URL = "https://easy-campus-life.onrender.com"

# Comptes à tester
accounts = [
    {"email": "etudiant@test.com", "password": "student123", "type": "Etudiant"},
    {"email": "mentor@test.com", "password": "mentor123", "type": "Mentor"},
    {"email": "admin@campus.fr", "password": "admin2024", "type": "Admin"}
]

print("="*60)
print("TEST DE CONNEXION")
print("="*60 + "\n")

for account in accounts:
    print(f"Test: {account['type']} ({account['email']})")
    print(f"Mot de passe: {account['password']}")

    try:
        response = requests.post(
            f"{API_URL}/auth/login-json",
            json={"email": account['email'], "password": account['password']},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            data = response.json()
            print(f"[OK] Connexion reussie!")
            print(f"Token: {data.get('access_token', 'N/A')[:50]}...")
        else:
            print(f"[ERREUR] Status: {response.status_code}")
            print(f"Reponse: {response.text}")

    except Exception as e:
        print(f"[ERREUR] Exception: {str(e)}")

    print("-" * 60 + "\n")
