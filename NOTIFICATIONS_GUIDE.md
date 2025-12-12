# Guide de test des notifications en temps réel

## Installation et démarrage

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

Le backend démarrera sur `http://localhost:8000`

### Frontend

**1. Configuration de l'environnement**
```bash
cd frontend
# Copier le fichier de configuration
cp .env.example .env
```

**2. Modifier `.env` selon votre environnement :**

Pour le **développement local** :
```env
REACT_APP_API_URL=http://localhost:8000
```

Pour la **production** :
```env
REACT_APP_API_URL=https://easy-campus-life.onrender.com
```

**3. Démarrer le frontend**
```bash
npm install  # Si pas encore fait
npm start
```

Le frontend démarrera sur `http://localhost:3000`

## Comment tester les notifications

### 1. Ouvrir deux onglets

**Onglet 1 - Étudiant:**
- Ouvrez `http://localhost:3000`
- Connectez-vous avec un compte étudiant :
  - Email: `demo@campus.fr` ou `etudiant@test.com`
  - Mot de passe: (celui configuré dans votre BD)

**Onglet 2 - Admin:**
- Ouvrez `http://localhost:3000`
- Connectez-vous avec un compte admin :
  - Email: `admin@campus.fr`
  - Mot de passe: `admin2024`
- Cliquez sur le bouton "Admin" en haut à droite

### 2. Créer un élément depuis le dashboard admin

Dans l'onglet Admin, créez :
- Un **événement** (onglet "Événements")
- Un **mentor** (onglet "Mentors")
- Une **salle** (onglet "Présences" > Créer une salle)

### 3. Observer les notifications dans l'onglet étudiant

Vous devriez voir :
- **Toast animé** apparaître en haut à droite de l'écran
- **Badge rouge** sur l'icône de cloche 🔔 avec le nombre de notifications
- **Notification native** du navigateur (si autorisée)

### 4. Cliquer sur l'icône de cloche

- Affiche le dropdown avec toutes les notifications
- Les notifications non lues ont un fond bleu clair
- Cliquez sur une notification pour la marquer comme lue

## Structure de l'icône de notification

L'icône de cloche se trouve dans le header, à côté du bouton "Admin" :

```
[Logo] [Navigation] ... [🔔 (3)] [Admin] [Déconnexion]
```

## Vérifications si les notifications ne s'affichent pas

### 1. Vérifier que socket.io-client est installé
```bash
cd frontend
npm list socket.io-client
```

Devrait afficher : `socket.io-client@4.7.2`

### 2. Vérifier la console du navigateur

Ouvrez les DevTools (F12) et vérifiez :
- Console : Devrait afficher "Connected to Socket.io server"
- Network : Devrait montrer une connexion WebSocket active

### 3. Vérifier que le backend tourne

```bash
curl http://localhost:8000/health
```

Devrait retourner : `{"status":"healthy"}`

### 4. Redémarrer le frontend

Si le frontend tournait déjà avant l'installation de socket.io-client :
```bash
cd frontend
# Ctrl+C pour arrêter
npm start
```

## Test avec l'API directement

Si le frontend ne fonctionne pas, testez l'API directement :

```bash
# 1. Se connecter
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@campus.fr&password=admin2024"

# 2. Créer un événement (remplacez TOKEN par celui reçu)
curl -X POST "http://localhost:8000/events/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Notification",
    "description": "Test",
    "category": "tech",
    "attendance": "50",
    "place": "Salle A",
    "image_url": "",
    "date_start": "2025-12-14",
    "date_end": "2025-12-17"
  }'
```

## Structure des notifications

Chaque notification contient :
- **type**: "event", "mentor" ou "classroom"
- **title**: Titre de la notification
- **message**: Message descriptif
- **data**: Données complètes de l'élément créé
- **timestamp**: Date et heure de création

## Icônes par type de notification

- 🎉 **Événement**: Fond vert
- 🎓 **Mentor**: Fond orange
- 🏢 **Salle**: Fond violet

## Problèmes connus

### Le badge de notification ne s'affiche pas

Vérifiez que vous êtes connecté en tant qu'**étudiant**, pas admin. Les notifications sont destinées aux étudiants.

### "Cannot read property 'notifications' of undefined"

Le SocketProvider n'est pas correctement chargé. Vérifiez que :
1. `SocketProvider` enveloppe bien l'application dans `App.js`
2. Le frontend a été redémarré après l'installation de `socket.io-client`

### Connexion Socket.io échoue

Vérifiez que :
1. Le backend tourne sur `http://localhost:8000`
2. CORS est activé dans `main.py` (déjà configuré)
3. Le firewall ne bloque pas la connexion WebSocket
