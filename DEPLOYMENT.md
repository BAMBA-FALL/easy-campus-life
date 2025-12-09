# Guide de Déploiement sur Render

Ce guide vous explique comment déployer votre application **Easy Campus Life** (Backend Python FastAPI) sur Render.

## Prérequis

- Un compte GitHub (déjà fait ✅)
- Un compte Render (gratuit) : [https://render.com](https://render.com)
- Le code poussé sur GitHub (déjà fait ✅)

## Option 1 : Déploiement Automatique avec render.yaml (Recommandé)

Cette méthode utilise le fichier `render.yaml` pour configurer automatiquement tous les services.

### Étapes :

1. **Connectez-vous à Render**
   - Allez sur [https://render.com](https://render.com)
   - Connectez-vous avec votre compte GitHub

2. **Créer un nouveau Blueprint**
   - Cliquez sur "New +" en haut à droite
   - Sélectionnez "Blueprint"
   - Connectez votre dépôt GitHub : `BAMBA-FALL/easy-campus-life`
   - Render détectera automatiquement le fichier `render.yaml`

3. **Configuration automatique**
   - Render va créer automatiquement :
     - ✅ Une base de données PostgreSQL (`easy-campus-life-db`)
     - ✅ Un service web pour l'API (`easy-campus-life-api`)
   - Les variables d'environnement seront configurées automatiquement

4. **Déploiement**
   - Cliquez sur "Apply"
   - Attendez que le déploiement se termine (5-10 minutes)
   - Votre API sera disponible à : `https://easy-campus-life-api.onrender.com`

### Variables d'environnement (configurées automatiquement) :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | Auto-générée | URL de connexion PostgreSQL |
| `SECRET_KEY` | Auto-générée | Clé secrète pour JWT |
| `ALGORITHM` | HS256 | Algorithme de chiffrement |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 30 | Durée de validité du token |
| `PORT` | 10000 | Port d'écoute (Render) |

---

## Option 2 : Déploiement Manuel (Sans render.yaml)

Si vous préférez configurer manuellement :

### Étape 1 : Créer la base de données PostgreSQL

1. Dans Render Dashboard, cliquez sur "New +"
2. Sélectionnez "PostgreSQL"
3. Configurez :
   - **Name** : `easy-campus-life-db`
   - **Database** : `campus_db`
   - **Plan** : Free (expire après 90 jours)
4. Cliquez sur "Create Database"
5. **IMPORTANT** : Copiez la valeur de "Internal Database URL" (vous en aurez besoin)

### Étape 2 : Déployer le Backend

1. Cliquez sur "New +" → "Web Service"
2. Connectez votre dépôt : `BAMBA-FALL/easy-campus-life`
3. Configurez :
   - **Name** : `easy-campus-life-api`
   - **Region** : Frankfurt (ou le plus proche)
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Environment** : Docker
   - **Dockerfile Path** : `./Dockerfile`
   - **Plan** : Free

4. **Variables d'environnement** (Section "Environment")
   Ajoutez ces variables :
   ```
   DATABASE_URL = [Collez l'Internal Database URL de l'étape 1]
   SECRET_KEY = [Générez une clé aléatoire, ex: openssl rand -hex 32]
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   PORT = 10000
   ```

5. **Advanced Settings** :
   - **Health Check Path** : `/health`

6. Cliquez sur "Create Web Service"

### Étape 3 : Attendre le déploiement

- Le build prend environ 5-10 minutes
- Vous pouvez suivre les logs en temps réel
- Une fois terminé, votre API sera accessible

---

## Vérification du Déploiement

### Testez votre API :

1. **Page d'accueil** :
   ```
   https://votre-app.onrender.com/
   ```
   Devrait retourner :
   ```json
   {
     "message": "Bienvenue sur l'API Campus Life",
     "version": "1.0.0",
     "endpoints": {...}
   }
   ```

2. **Health Check** :
   ```
   https://votre-app.onrender.com/health
   ```
   Devrait retourner :
   ```json
   {
     "status": "healthy"
   }
   ```

3. **Documentation API** :
   ```
   https://votre-app.onrender.com/docs
   ```

---

## Initialisation de la Base de Données

Une fois le déploiement terminé, vous devez initialiser la base de données :

### Option A : Via Shell Render

1. Dans le dashboard Render, allez dans votre service web
2. Cliquez sur "Shell" (en haut à droite)
3. Exécutez :
   ```bash
   # Se connecter à la base de données
   psql $DATABASE_URL

   # Copier et exécuter le contenu de backend/script.sql
   # puis backend/insert_school_life_data.sql
   ```

### Option B : Migrations Alembic (Recommandé)

Si vous utilisez Alembic, ajoutez cette commande au Dockerfile :
```dockerfile
CMD alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

---

## Configuration du Frontend

Une fois le backend déployé, mettez à jour votre frontend :

### Dans `frontend/src/services/apiService.js` :

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://easy-campus-life-api.onrender.com';
```

### Variables d'environnement frontend (.env) :

```
REACT_APP_API_URL=https://easy-campus-life-api.onrender.com
```

---

## Notes Importantes

### Plan Gratuit Render :

✅ **Avantages** :
- Gratuit pour commencer
- 750 heures/mois (suffisant pour un projet)
- HTTPS automatique
- Déploiement continu depuis GitHub

⚠️ **Limitations** :
- Base de données gratuite expire après 90 jours
- Le service s'endort après 15 min d'inactivité (cold start de ~30s)
- 512 MB RAM, CPU partagé
- 100 GB bande passante/mois

### Mise à jour automatique :

Render redéploie automatiquement quand vous poussez sur GitHub :
```bash
git add .
git commit -m "Update backend"
git push origin main
```

### Surveillance :

- Consultez les logs en temps réel dans le dashboard Render
- Configurez des alertes email en cas d'échec
- Endpoint `/health` pour monitoring externe

---

## Déploiement du Frontend (Bonus)

Pour déployer aussi le frontend React sur Render :

1. Cliquez sur "New +" → "Static Site"
2. Sélectionnez votre dépôt
3. Configurez :
   - **Name** : `easy-campus-life-frontend`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `build`
4. Variables d'environnement :
   ```
   REACT_APP_API_URL=https://easy-campus-life-api.onrender.com
   ```

---

## Troubleshooting

### Erreur de connexion à la base de données :

- Vérifiez que `DATABASE_URL` est correctement configurée
- Utilisez "Internal Database URL" (pas External)
- Format : `postgresql://user:password@host:port/database`

### L'application ne démarre pas :

- Consultez les logs dans le dashboard
- Vérifiez que toutes les dépendances sont dans `requirements.txt`
- Testez le Dockerfile localement :
  ```bash
  cd backend
  docker build -t test-api .
  docker run -p 8000:8000 test-api
  ```

### Cold Start trop long :

- Passez au plan payant (7$/mois) pour éviter le sommeil
- Ou utilisez un service de ping (UptimeRobot) pour garder l'app active

---

## Support

- Documentation Render : [https://render.com/docs](https://render.com/docs)
- Communauté Render : [https://community.render.com](https://community.render.com)

---

**Votre backend est maintenant prêt à être déployé sur Render !** 🚀
