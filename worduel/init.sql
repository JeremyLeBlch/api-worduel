-- Création de l'extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création des ENUMs
CREATE TYPE game_status AS ENUM ('waiting', 'in_progress', 'completed', 'cancelled');
CREATE TYPE game_mode AS ENUM ('solo', 'duel');
CREATE TYPE game_result AS ENUM ('in_progress', 'won', 'lost', 'draw');
CREATE TYPE auth_type AS ENUM ('email', 'google', 'facebook');
CREATE TYPE user_role as ENUM ('USER', 'ADMIN');

-- Création de la table User
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255) DEFAULT 'default.png',
    role user_role DEFAULT 'USER' NOT NULL,
    mmr INTEGER DEFAULT 1000,
    total_score_multi INTEGER DEFAULT 0,
    primary_color_preference VARCHAR(20) DEFAULT '192 82% 61%',
    secondary_color_preference VARCHAR(20) DEFAULT '0 74% 65%',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table Authentication
CREATE TABLE "Authentication" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
    type auth_type NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (type, identifier)
);

-- Création de la table Word
CREATE TABLE "Word" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word_text VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Importation des mots depuis le fichier CSV
COPY "Word"(word_text)
FROM '/docker-entrypoint-initdb.d/mots_5_lettres.csv'
WITH (FORMAT csv, HEADER false, ENCODING 'UTF8');

-- Création de la table Game
CREATE TABLE "Game" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    mode game_mode NOT NULL,
    word_id UUID REFERENCES "Word"(id) ON DELETE SET NULL,
    status game_status NOT NULL DEFAULT 'waiting',
    max_players INTEGER DEFAULT 2,
    player_in_game INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table PlayerGameSession
CREATE TABLE "PlayerGameSession" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES "Game"(id) ON DELETE CASCADE,
    user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
    score_by_time INTEGER DEFAULT 0,
    score_by_guesses INTEGER DEFAULT 0,
    score_bonus INTEGER DEFAULT 0,
    succeeded game_result DEFAULT 'in_progress',
    mmr_change INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    guesses_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'actif',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table Guess
CREATE TABLE "Guess" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_session_id UUID REFERENCES "PlayerGameSession"(id) ON DELETE CASCADE,
    word_id UUID REFERENCES "Word"(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de quelques utilisateurs
INSERT INTO "User" (username, email, avatar, role, mmr, total_score_multi, primary_color_preference, secondary_color_preference) VALUES
('Player1', 'player1@example.com', 'avatar1.jpg', 'USER', 1200, 500, '#FF5733', '#33FF57'),
('Player2', 'player2@example.com', 'avatar2.jpg', 'USER', 1100, 450, '#3357FF', '#FF33A6'),
('Admin', 'admin@example.com', 'avatar3.jpg', 'ADMIN', 1500, 1000, '#000000', '#FFFFFF');

-- Insertion des informations d'authentification
INSERT INTO "Authentication" (user_id, type, identifier, password_hash) VALUES
((SELECT id FROM "User" WHERE username = 'Player1'), 'email', 'player1@example.com', 'hashed_password_1'),
((SELECT id FROM "User" WHERE username = 'Player2'), 'email', 'player2@example.com', 'hashed_password_2'),
((SELECT id FROM "User" WHERE username = 'Admin'), 'email', 'admin@example.com', 'hashed_password_admin');

-- Insertion de jeux
-- Insérer un jeu solo si le mot 'pomme' existe
DO $$
DECLARE
    game_id UUID;
BEGIN
    IF EXISTS (SELECT 1 FROM "Word" WHERE word_text = 'pomme') THEN
        INSERT INTO "Game" (id, creator_id, mode, word_id, status, max_players, player_in_game, started_at) 
        VALUES (uuid_generate_v4(), (SELECT id FROM "User" WHERE username = 'Player1'), 'solo', (SELECT id FROM "Word" WHERE word_text = 'pomme'), 'in_progress', 1, 1, CURRENT_TIMESTAMP)
        RETURNING id INTO game_id;

        -- Insertion de la session de jeu pour Player1 dans le jeu solo
        INSERT INTO "PlayerGameSession" (game_id, user_id, score_by_time, score_by_guesses, score_bonus, succeeded, mmr_change, guesses_count)
        VALUES (game_id, (SELECT id FROM "User" WHERE username = 'Player1'), 100, 50, 10, 'won', 20, 3);
    END IF;
END $$;

DO $$
DECLARE
    v_game_id UUID;
BEGIN
    IF EXISTS (SELECT 1 FROM "Word" WHERE word_text = 'accus') THEN
        INSERT INTO "Game" (id, creator_id, mode, word_id, status, max_players, player_in_game) 
        VALUES (uuid_generate_v4(), (SELECT id FROM "User" WHERE username = 'Player2'), 'duel', (SELECT id FROM "Word" WHERE word_text = 'accus'), 'waiting', 2, 1)
        RETURNING id INTO v_game_id;

        -- Insertion de la session de jeu pour Player2 dans le jeu duel
        INSERT INTO "PlayerGameSession" (game_id, user_id, status)
        VALUES (v_game_id, (SELECT id FROM "User" WHERE username = 'Player2'), 'actif');

        -- Player1 rejoint le jeu duel
        UPDATE "Game" SET player_in_game = player_in_game + 1 WHERE id = v_game_id;
        INSERT INTO "PlayerGameSession" (game_id, user_id, status)
        VALUES (v_game_id, (SELECT id FROM "User" WHERE username = 'Player1'), 'actif');

        -- Démarrer le jeu duel
        UPDATE "Game" SET status = 'in_progress', started_at = CURRENT_TIMESTAMP WHERE id = v_game_id;

        -- Insertion de guesses pour le jeu duel
        -- Player2 fait un guess
        INSERT INTO "Guess" (game_session_id, word_id, attempt_number, result)
        VALUES (
            (SELECT id FROM "PlayerGameSession" WHERE user_id = (SELECT id FROM "User" WHERE username = 'Player2') AND game_id = v_game_id),
            (SELECT id FROM "Word" WHERE word_text = 'aboie'), 1, '{"correct": false, "positions": [false, false, false, true, false]}'
        );

        -- Player1 fait un guess
        INSERT INTO "Guess" (game_session_id, word_id, attempt_number, result)
        VALUES (
            (SELECT id FROM "PlayerGameSession" WHERE user_id = (SELECT id FROM "User" WHERE username = 'Player1') AND game_id = v_game_id),
            (SELECT id FROM "Word" WHERE word_text = 'abats'), 1, '{"correct": false, "positions": [false, false, true, false, false]}'
        );

        -- Supposons que Player2 gagne le duel
        UPDATE "PlayerGameSession" SET succeeded = 'won', score_by_time = 120, score_by_guesses = 80, mmr_change = 15 WHERE user_id = (SELECT id FROM "User" WHERE username = 'Player2') AND game_id = v_game_id;
        UPDATE "PlayerGameSession" SET succeeded = 'lost', mmr_change = -15 WHERE user_id = (SELECT id FROM "User" WHERE username = 'Player1') AND game_id = v_game_id;

        -- Mise à jour du MMR des joueurs
        UPDATE "User" SET mmr = mmr + 15 WHERE username = 'Player2';
        UPDATE "User" SET mmr = mmr - 15 WHERE username = 'Player1';

        -- Mise à jour du statut du jeu duel
        UPDATE "Game" SET status = 'completed', ended_at = CURRENT_TIMESTAMP WHERE id = v_game_id;
    END IF;
END $$;

-- Insertion de guesses pour le jeu solo
DO $$
DECLARE
    v_session_id UUID;
BEGIN
    SELECT pgs.id INTO v_session_id
    FROM "PlayerGameSession" pgs
    JOIN "Game" g ON pgs.game_id = g.id
    WHERE pgs.user_id = (SELECT id FROM "User" WHERE username = 'Player1') AND g.mode = 'solo';

    IF v_session_id IS NOT NULL THEN
        INSERT INTO "Guess" (game_session_id, word_id, attempt_number, result)
        VALUES 
        (v_session_id, (SELECT id FROM "Word" WHERE word_text = 'abord'), 1, '{"correct": false, "positions": [false, true, false, false, false]}'),
        (v_session_id, (SELECT id FROM "Word" WHERE word_text = 'pomme'), 2, '{"correct": true, "positions": [true, true, true, true, true]}');

        -- Mise à jour du statut du jeu solo de Player1
        UPDATE "Game" SET status = 'completed', ended_at = CURRENT_TIMESTAMP WHERE id = (SELECT game_id FROM "PlayerGameSession" WHERE id = v_session_id);
    END IF;
END $$;
