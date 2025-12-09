# Instructions de Déploiement - Easy Campus Life

## Configuration Actuelle

### Backend (Render)
- **URL de l'API**: https://easy-campus-life.onrender.com
- **Port**: 10000
- **Statut**: En ligne et fonctionnel

### Frontend
- **Configuration API**: Déjà mise à jour dans `frontend/src/services/apiService.js`
- **URL configurée**: https://easy-campus-life.onrender.com

---

## Initialisation de la Base de Données

### Option 1: Via le Shell Render (Recommandé)

1. **Accédez au Dashboard Render**
   - Allez sur https://dashboard.render.com
   - Sélectionnez votre service Web "easy-campus-life"

2. **Ouvrez le Shell**
   - Cliquez sur "Shell" dans le menu en haut à droite
   - Un terminal s'ouvrira dans votre container

3. **Connectez-vous à PostgreSQL**
   ```bash
   psql $DATABASE_URL
   ```

4. **Copiez-collez le contenu du fichier `backend/init_database.sql`**
   - Ouvrez le fichier `backend/init_database.sql`
   - Copiez tout son contenu
   - Collez-le dans le terminal psql
   - Appuyez sur Entrée

5. **Vérifiez que tout s'est bien passé**
   ```sql
   -- Vérifier les tables créées
   \dt

   -- Vérifier l'utilisateur de test
   SELECT id, name, email, level FROM users WHERE email = 'etudiant@test.com';

   -- Vérifier les salles
   SELECT * FROM classrooms;

   -- Vérifier les événements
   SELECT id, title, category FROM events;
   ```

6. **Quittez psql**
   ```
   \q
   ```

### Option 2: Via un Client PostgreSQL Local

Si vous avez un client PostgreSQL installé localement (pgAdmin, DBeaver, psql):

1. **Récupérez l'URL de connexion**
   - Dans Render Dashboard → votre service Web → Environment
   - Copiez la valeur de `DATABASE_URL`

2. **Connectez-vous avec votre client**
   - Utilisez l'URL de connexion ou parsez-la pour obtenir:
     - Host
     - Port
     - Database
     - User
     - Password

3. **Exécutez le script**
   - Ouvrez `backend/init_database.sql`
   - Exécutez-le dans votre client

### Option 3: Via Alembic (Migration)

Si vous préférez utiliser Alembic pour gérer le schéma:

1. **Dans le Shell Render**
   ```bash
   cd /opt/render/project/src/backend

   # Créer les tables via Alembic
   alembic upgrade head
   ```

2. **Ensuite, insérer l'utilisateur de test**
   ```bash
   psql $DATABASE_URL -c "INSERT INTO users (name, email, password, level) VALUES ('Étudiant Test', 'etudiant@test.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWVxXbdK', 'Beginner') ON CONFLICT (email) DO NOTHING;"
   ```

---

## Compte de Test Créé

Après l'initialisation, vous pouvez vous connecter avec:

- **Email**: `etudiant@test.com`
- **Mot de passe**: `student123`
- **Niveau**: Beginner

---

## Tests à Effectuer

### 1. Test de l'API Backend

Ouvrez dans votre navigateur ou utilisez curl:

```bash
# Page d'accueil
curl https://easy-campus-life.onrender.com/

# Health Check
curl https://easy-campus-life.onrender.com/health

# Documentation Swagger
# Ouvrez dans le navigateur:
https://easy-campus-life.onrender.com/docs
```

### 2. Test de Connexion

Utilisez la documentation Swagger ou curl:

```bash
curl -X POST https://easy-campus-life.onrender.com/auth/login-json \
  -H "Content-Type: application/json" \
  -d '{
    "email": "etudiant@test.com",
    "password": "student123"
  }'
```

Vous devriez recevoir un token JWT:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### 3. Test avec le Token

```bash
# Remplacez YOUR_TOKEN par le token reçu
curl -X GET https://easy-campus-life.onrender.com/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Tester les Événements

```bash
curl -X GET https://easy-campus-life.onrender.com/events/
```

### 5. Tester les Salles de Classe

```bash
curl -X GET https://easy-campus-life.onrender.com/classrooms/
```

---

## Déploiement du Frontend

### Option 1: Netlify

1. **Créer un compte sur Netlify** (https://www.netlify.com)

2. **Connecter votre dépôt Git**
   - "New site from Git"
   - Sélectionnez votre repository
   - Branch: `main`

3. **Configurer le build**
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`
   - Base directory: laissez vide

4. **Variables d'environnement**
   - Ajoutez: `REACT_APP_API_URL=https://easy-campus-life.onrender.com`

5. **Déployer**

### Option 2: Vercel

1. **Créer un compte sur Vercel** (https://vercel.com)

2. **Importer le projet**
   - "New Project"
   - Sélectionnez votre repository

3. **Configurer**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Variables d'environnement**
   - `REACT_APP_API_URL=https://easy-campus-life.onrender.com`

5. **Deploy**

### Option 3: Render (Static Site)

1. **Créer un nouveau Static Site**
   - Dashboard → New → Static Site

2. **Configurer**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

3. **Variables d'environnement**
   - `REACT_APP_API_URL=https://easy-campus-life.onrender.com`

4. **Deploy**

---

## Créer des Utilisateurs Supplémentaires

### Méthode 1: Via l'API (Recommandé)

```bash
curl -X POST https://easy-campus-life.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "password": "motdepasse123",
    "level": "Intermediate"
  }'
```

### Méthode 2: Générer un Hash et Insérer Manuellement

1. **Sur votre machine locale**
   ```bash
   cd backend
   python generate_password_hash.py
   # Entrez le mot de passe souhaité
   ```

2. **Copiez le hash généré**

3. **Insérez dans la base**
   ```sql
   INSERT INTO users (name, email, password, level)
   VALUES ('Nom', 'email@example.com', 'HASH_GÉNÉRÉ_ICI', 'Advanced');
   ```

---

## Résolution de Problèmes

### La connexion échoue

1. Vérifiez que l'utilisateur existe:
   ```sql
   SELECT * FROM users WHERE email = 'etudiant@test.com';
   ```

2. Vérifiez que le mot de passe est bien hashé (doit commencer par `$2b$`)

3. Essayez de créer un nouvel utilisateur via l'API `/auth/register`

### Les tables n'existent pas

Exécutez de nouveau le script `init_database.sql` ou utilisez Alembic:
```bash
alembic upgrade head
```

### Erreur de connexion à la base de données

Vérifiez que `DATABASE_URL` est bien définie dans les variables d'environnement Render.

---

## Prochaines Étapes

1. ✅ Backend déployé sur Render
2. ✅ Base de données initialisée
3. ✅ Utilisateur de test créé
4. ✅ Frontend configuré avec l'URL de l'API
5. ⬜ Déployer le frontend (Netlify/Vercel/Render)
6. ⬜ Tester l'application complète
7. ⬜ Ajouter des données supplémentaires si nécessaire

---

## Support

Pour toute question ou problème:
1. Vérifiez les logs dans Render Dashboard → Logs
2. Testez les endpoints via Swagger UI: https://easy-campus-life.onrender.com/docs
3. Consultez la documentation FastAPI: https://fastapi.tiangolo.com
