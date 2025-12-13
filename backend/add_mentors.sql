-- Script pour ajouter les utilisateurs mentors à la base de données
-- À exécuter sur la base de données de production

-- Vérifier si les mentors existent déjà
DO $$
BEGIN
    -- Mentor 1: Sarah Martin
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'mentor@test.com') THEN
        INSERT INTO users (name, email, password, level)
        VALUES (
            'Sarah Martin',
            'mentor@test.com',
            '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWVxXbdK',
            'Mentor'
        );
        RAISE NOTICE 'Mentor Sarah Martin créé avec succès';
    ELSE
        RAISE NOTICE 'Mentor Sarah Martin existe déjà';
    END IF;

    -- Mentor 2: Thomas Dubois
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'mentor2@test.com') THEN
        INSERT INTO users (name, email, password, level)
        VALUES (
            'Thomas Dubois',
            'mentor2@test.com',
            '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWVxXbdK',
            'Mentor'
        );
        RAISE NOTICE 'Mentor Thomas Dubois créé avec succès';
    ELSE
        RAISE NOTICE 'Mentor Thomas Dubois existe déjà';
    END IF;

    -- Mentor 3: Marie Lefebvre
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'mentor3@test.com') THEN
        INSERT INTO users (name, email, password, level)
        VALUES (
            'Marie Lefebvre',
            'mentor3@test.com',
            '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWVxXbdK',
            'Mentor'
        );
        RAISE NOTICE 'Mentor Marie Lefebvre créé avec succès';
    ELSE
        RAISE NOTICE 'Mentor Marie Lefebvre existe déjà';
    END IF;
END $$;

-- Afficher tous les mentors
SELECT id, name, email, level, created_at
FROM users
WHERE level = 'Mentor'
ORDER BY created_at DESC;
