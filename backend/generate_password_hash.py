#!/usr/bin/env python3
"""
Script pour générer un hash bcrypt pour un mot de passe
Utile pour créer des utilisateurs directement dans la base de données
"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_hash(password: str) -> str:
    """Génère un hash bcrypt pour le mot de passe donné"""
    return pwd_context.hash(password)

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = input("Entrez le mot de passe à hasher: ")

    hashed = generate_hash(password)
    print(f"\nMot de passe: {password}")
    print(f"Hash bcrypt: {hashed}")
    print(f"\nVous pouvez utiliser ce hash dans vos INSERT SQL:")
    print(f"INSERT INTO users (name, email, password, level) VALUES")
    print(f"    ('Nom', 'email@example.com', '{hashed}', 'Beginner');")
