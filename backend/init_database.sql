-- ========================================
-- SCRIPT D'INITIALISATION DE LA BASE DE DONNÉES
-- Easy Campus Life - Production sur Render
-- ========================================

-- 1. CRÉATION DES TABLES
-- ========================================

-- TABLE users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- TABLE classrooms
CREATE TABLE IF NOT EXISTS classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- TABLE events
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    attendance VARCHAR(50),
    place VARCHAR(255),
    date_start TIMESTAMP WITH TIME ZONE,
    date_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- TABLE presences (anciennement to_be)
CREATE TABLE IF NOT EXISTS presences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
    presence BOOLEAN NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- TABLE event_participations (anciennement participate)
CREATE TABLE IF NOT EXISTS event_participations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- TABLE mentoring
CREATE TABLE IF NOT EXISTS mentoring (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sponsored_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_presences_user_id ON presences(user_id);
CREATE INDEX IF NOT EXISTS idx_presences_classroom_id ON presences(classroom_id);
CREATE INDEX IF NOT EXISTS idx_presences_timestamp ON presences(timestamp);
CREATE INDEX IF NOT EXISTS idx_event_participations_user_id ON event_participations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participations_event_id ON event_participations(event_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_mentor_id ON mentoring(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_sponsored_id ON mentoring(sponsored_id);
CREATE INDEX IF NOT EXISTS idx_events_date_start ON events(date_start);

-- 2. INSERTION D'UN UTILISATEUR ÉTUDIANT DE TEST
-- ========================================
-- Email: etudiant@test.com
-- Mot de passe: student123
-- Le hash bcrypt ci-dessous correspond à "student123"

INSERT INTO users (name, email, password, level)
VALUES (
    'Étudiant Test',
    'etudiant@test.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWVxXbdK',
    'Beginner'
) ON CONFLICT (email) DO NOTHING;

-- 3. INSERTION DE QUELQUES SALLES DE CLASSE
-- ========================================

INSERT INTO classrooms (name) VALUES
    ('Salle A101'),
    ('Salle B203'),
    ('Bibliothèque'),
    ('Cafétéria'),
    ('Amphithéâtre')
ON CONFLICT DO NOTHING;

-- 4. INSERTION D'ÉVÉNEMENTS DE TEST
-- ========================================

INSERT INTO events (title, description, category, attendance, place, date_start, date_end)
VALUES
    (
        'Semaine d''intégration',
        'Bienvenue aux nouveaux étudiants ! Découvrez le campus et rencontrez vos camarades.',
        'Social',
        'Optional',
        'Campus Principal',
        '2025-01-15 09:00:00',
        '2025-01-19 18:00:00'
    ),
    (
        'Workshop Python',
        'Atelier d''introduction à Python pour les débutants.',
        'Workshop',
        'Optional',
        'Salle B203',
        '2025-01-20 14:00:00',
        '2025-01-20 17:00:00'
    ),
    (
        'Conférence IA',
        'Conférence sur l''intelligence artificielle et ses applications.',
        'Seminar',
        'Mandatory',
        'Amphithéâtre',
        '2025-01-25 10:00:00',
        '2025-01-25 12:00:00'
    )
ON CONFLICT DO NOTHING;

-- Afficher un message de succès
SELECT 'Base de données initialisée avec succès!' AS status;
SELECT 'Utilisateur de test créé:' AS info;
SELECT '  Email: etudiant@test.com' AS credentials;
SELECT '  Mot de passe: student123' AS credentials;
