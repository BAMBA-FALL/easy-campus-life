# 👨‍🏫 Mentors - Easy Campus Life

## Liste des Mentors Disponibles

Cette liste contient tous les mentors créés dans le système avec leurs spécialités.

---

### 1. Sophie Martin
- **Email**: sophie.martin@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E4
- **Spécialité**: Python & Django
- **Description**: Développement web avec Python et le framework Django

### 2. Thomas Dubois
- **Email**: thomas.dubois@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E4
- **Spécialité**: React & JavaScript
- **Description**: Maîtrise de React.js et des concepts avancés de JavaScript moderne

### 3. Marie Lambert
- **Email**: marie.lambert@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E5
- **Spécialité**: Machine Learning & IA
- **Description**: Introduction au Machine Learning avec Python et scikit-learn

### 4. Lucas Bernard
- **Email**: lucas.bernard@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E5
- **Spécialité**: DevOps & Cloud
- **Description**: Pratiques DevOps, Docker, Kubernetes et pipelines CI/CD

### 5. Emma Petit
- **Email**: emma.petit@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E4
- **Spécialité**: Java & Spring Boot
- **Description**: Développement d'applications entreprise avec Java et Spring Boot

### 6. Hugo Roux
- **Email**: hugo.roux@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E5
- **Spécialité**: Cybersécurité
- **Description**: Fondamentaux de la sécurité informatique et tests de pénétration

### 7. Léa Moreau
- **Email**: lea.moreau@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E4
- **Spécialité**: UI/UX Design
- **Description**: Conception d'interfaces utilisateur et expérience utilisateur

### 8. Nathan Simon
- **Email**: nathan.simon@mentor.fr
- **Mot de passe**: mentor123
- **Niveau**: E5
- **Spécialité**: Data Science & Analytics
- **Description**: Analyse de données et visualisation avec Python (Pandas, Matplotlib)

---

## Technologies Couvertes

- 🐍 **Python & Django** - Développement web backend
- ⚛️ **React & JavaScript** - Développement frontend moderne
- 🤖 **Machine Learning & IA** - Intelligence artificielle
- ☁️ **DevOps & Cloud** - Infrastructure et déploiement
- ☕ **Java & Spring Boot** - Applications entreprise
- 🔒 **Cybersécurité** - Sécurité informatique
- 🎨 **UI/UX Design** - Design d'interface
- 📊 **Data Science** - Analyse de données

---

## Comment accéder aux mentors ?

### Option 1 : Initialisation de la base de données
Envoyez une requête POST à l'endpoint `/initialize-db` :

```bash
curl -X POST https://easy-campus-life.onrender.com/initialize-db
```

### Option 2 : Consulter via le dashboard admin
1. Connectez-vous avec le compte admin (admin@campus.fr / admin2024)
2. Accédez à `/admin`
3. Naviguez vers "Gestion des Mentors"

### Option 3 : API directe
Utilisez l'endpoint `/mentoring` pour consulter les relations de mentorat :

```bash
curl -X GET https://easy-campus-life.onrender.com/mentoring \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Relations de Mentorat

Les mentors sont automatiquement assignés aux étudiants lors de l'initialisation de la base de données. Chaque mentor est spécialisé dans un domaine spécifique et peut accompagner plusieurs étudiants.

**Toutes les relations de mentorat sont créées automatiquement avec :**
- Le mentor spécialisé dans le domaine
- Un étudiant assigné
- Un sujet de mentorat défini
- Une description du parcours d'apprentissage
