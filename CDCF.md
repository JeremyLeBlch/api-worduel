# Cahier des Charges : Worduel

## 1. Contexte du projet

### Le projet en une phrase

Proposer un jeu de type "Wordle" jouable en solo ou en version multijoueur "Duel" (en 1vs1).

### Qu'est-ce que Wordle ?

Wordle est un jeu de réflexion dans lequel les joueurs doivent deviner un mot de cinq lettres en un maximum de six essais, avec des indices sur les lettres correctes et leur emplacement.

### Cible et besoins

Ce projet s'adresse principalement aux personnes qui connaissent déjà Wordle et des jeux similaires tels que Motus ou Sutom, mais qui recherchent un mode compétitif et multijoueur pour ajouter une dimension plus stimulante et pimenter leur expérience de jeu. Un système de points et de classement renforcera cet aspect compétitif et apportera une motivation supplémentaire aux joueurs.

### Accessibilité

Le jeu devra être accessible en ligne, et offrir une expérience dynamique et intuitive pour l'utilisateur, avec des interactions en temps réel.

## 2. Objectifs

- Créer une application web intuitive où plusieurs utilisateurs peuvent jouer simultanément (en modes Solo et Duel).
- Permettre aux joueurs de jouer en solo ou en mode duel, que ce soit avec des amis ou en rejoignant des parties publiques.
- Mettre en place un système de classement pour permettre aux joueurs de suivre leur progression et de se mesurer les uns aux autres.
- Garantir une expérience de jeu fluide, réactive et agréable.

## 3. Fonctionnalités Clés

### Modes de Jeu

- **Solo** : Une version solo permettant aux joueurs de jouer de manière individuelle, sans restriction sur le nombre de parties par jour, avec un nombre de tentatives limité pour deviner le mot du jour, et un suivi des performances personnelles.
- **Duel** : Un mode multijoueur permettant à deux joueurs de s'affronter en 1vs1. En mode Duel, les joueurs peuvent voir la grille de leur concurrent avec les codes couleur, mais sans afficher les lettres.

### Inscription / Connexion

- Les utilisateurs doivent pouvoir créer un compte, se connecter et se déconnecter.
- Un système de pseudonyme unique pour identifier les joueurs en ligne.

### Interface de Jeu

- Interface dynamique utilisant React et Tailwind, permettant une réponse en temps réel.
- Deux thèmes visuels seront disponibles : un thème clair et un thème sombre.
- Mots de 5 lettres avec un maximum de 6 essais.
- Composants d’interface réactifs créés avec shadcn/tailwind pour une esthétique moderne.
- Le jeu doit permettre aux joueurs de deviner des mots en un nombre limité d'essais (6 maximum), avec un feedback immédiat sur chaque tentative : lettre bien placée en vert, lettre présente dans le mot mais mal placée en orange.

### Duel

- **Sessions de Jeu** : Création de sessions privées 1vs1, permettant aux utilisateurs de défier un ami ou un autre joueur en ligne.
- **Classements** : Suivi des scores des joueurs et classement global
- **Temps Réel** : Utilisation de Redis pour gérer les événements en temps réel et permettre une interaction fluide entre les joueurs.

### Leaderboard et Historique (Solo & Duel)

- Un leaderboard pour suivre les meilleurs joueurs.
- Historique des scores et performances individuelles.

## 4. MVP (Minimum Viable Product)

Le MVP du projet consiste à livrer une version fonctionnelle du jeu de type Wordle avec les fonctionnalités essentielles permettant aux utilisateurs de jouer et d'avoir une expérience complète, même si certaines fonctionnalités annexes ne sont pas encore implémentées. Les fonctionnalités incluses dans le MVP sont :

- **Solo** : Jouer de manière individuelle sans restriction de nombre de parties par jour.
- **Duel 1vs1** : Création de sessions privées pour s'affronter entre deux joueurs.
- **Inscription / Connexion** : Créer un compte, se connecter et se déconnecter.
- **Interface de Jeu** : Interface fonctionnelle avec les thèmes clair et sombre, ainsi que le feedback sur les lettres devinées (lettres bien placées en vert, lettres mal placées en orange).
- **Classement de base** : Affichage du score global pour les joueurs sous forme de classement (leaderboard).

Les fonctionnalités telles que les classements détaillés, des tableaux de statistiques des joueurs , le chat intégré, ou des options avancées ( obtention de bonus/malus en modes solos et multis ) seront développées dans des versions ultérieures du projet.

## 5. Architecture Technique

### Frontend

- Le frontend sera développé avec **React** (version 18) en utilisant **TypeScript** pour ajouter du typage aux variables, et **ViteJS** pour optimiser la vitesse de développement et le build en production.
- La gestion des états de l'application sera assurée par **Redux**.
- **React Router** sera utilisé pour gérer les routes de l'application.
- Pour les tests, **Vitest** sera utilisé afin de garantir la robustesse des composants frontend.
- **Tailwind CSS** fournira une mise en forme rapide et efficace des pages grâce à ses classes CSS prédéfinies, tandis que **ShadcnUI** sera utilisé pour fournir des composants d'interface utilisateur modernes et réactifs.
- La gestion des dates sera facilitée par **Dayjs**.

### Backend

- Le backend sera développé avec **Node.js** et **Express** pour faciliter la création de routes et de middlewares. **Apollo Server** sera utilisé avec **GraphQL** pour permettre des échanges de données efficaces entre le frontend et le backend.
- **PostgreSQL** sera utilisé comme base de données relationnelle, gérée via l'ORM **Prisma**, facilitant l'interaction avec les données.
- **Nginx** jouera le rôle de reverse proxy pour rediriger les requêtes vers l'API backend.
- **Redis** sera utilisé pour la gestion du cache et des événements en temps réel, particulièrement pour la synchronisation des sessions multijoueurs.
- L'authentification des utilisateurs sera réalisée via **GoogleApiAuth** pour l'intégration des connexions Google, et la sécurité des routes sera renforcée par l'utilisation de **JWT** (JSON Web Tokens).
- **bcrypt** sera utilisé pour le hachage des mots de passe avant leur stockage dans la base de données.
- **Adminer** sera utilisé pour la gestion de la base de données, offrant une interface d'administration.
- **Jest** sera utilisé pour les tests backend, afin d'assurer la robustesse des routes API.

### Tests et Sécurité

- Les tests côté frontend seront réalisés avec **Vitest** et côté backend avec **Jest**.
- La sécurité des données sera assurée par le chiffrement des mots de passe avec **bcrypt** et l'utilisation de **JWT** pour l'authentification sécurisée des routes.

### Containerisation

- L'ensemble du projet sera dockerisé, avec des conteneurs séparés pour le frontend et le backend. **Docker** garantira la portabilité de l'application et permettra de travailler dans un environnement identique pour tous les développeurs.

## 6. Développement et Déploiement

- **Environnement de Développement** : Utilisation de **Docker** pour créer des environnements reproductibles.
- **Déploiement** : Prévu avec **Docker**, pour une solution facilement scalable.
- **CI/CD** : Mise en place d'une pipeline de **CI/CD** pour automatiser les tests, le build et le déploiement, garantissant une intégration et un déploiement continus.

## 7. Exigences de Performance

- L’application doit pouvoir supporter plusieurs centaines de joueurs simultanément, que ce soit en solo ou dans des sessions 1vs1.

## 8. Sécurité

- **Authentification** : Utilisation de JWT pour l'authentification des utilisateurs.
- **Protection des Données** : Chiffrement des données sensibles.
- **Protection contre les attaques** : Mise en place de mesures pour se protéger contre les attaques par DDoS, injections SQL, etc.

## 9. Documentation

- **Documentation** : Explication des règles du jeu pour les utilisateurs, documentation technique pour les développeurs, et documentation des API GraphQL.

## 10. Échéancier

- **Phase de Conception** : du 08/10 au 29/10 (6 journées).
- **Développement Frontend & Backend** : du 29/10 au 11/12 (10 journées).

**Démo technique** : Présentation des projets le vendredi 13/12 de 13h à 17h sur BBB et Discord. 20 minutes pour chaque projet (15 minutes de présentation + 5 minutes de questions/réponses).

## 11. Rôles

- **Product Owner** : Florent Huitruc
- **Lead Dev Back** : Nicolas Lipowiez
- **Référent Technique Backend** : Jérémy Le Boulc'h
- **Lead Dev Front** : Laurent Arcos
- **Référent Technique Frontend** : Kévin Bourgitteau
- **Scrum Master** : Jérémy Le Boulc'h
- **Git Master** : Laurent Arcos
- **Lead Designer** : Kévin Bourgitteau
- **DevOps** : Florent Huitruc

## 12. Analyse des risques (sécurité)

La sécurité est un enjeu central dans le développement de Worduel. Voici les principaux risques que nous anticipons et les mesures prévues pour y faire face :

### Risques identifiés

1. **Fuite de données personnelles** :

    - Risque : Vol d'informations sensibles (pseudonymes, adresses e-mail, mots de passe) par des acteurs malveillants.
    - Mesure : Utilisation du chiffrement des données personnelles avec **bcrypt** pour les mots de passe et **SSL/TLS** pour sécuriser les connexions entre les utilisateurs et le serveur.

2. **Attaques par injection SQL** :

    - Risque : Exploitation des failles dans les requêtes SQL pour accéder à des données non autorisées.
    - Mesure : Utilisation de **Prisma ORM** pour éviter les requêtes SQL non sécurisées et mise en place de vérifications strictes sur les entrées utilisateur.

3. **Attaques par déni de service (DDoS)** :

    - Risque : Saturation du serveur par un trop grand nombre de requêtes, rendant le service indisponible.
    - Mesure : Mise en place de mesures de protection DDoS via le reverse proxy **Nginx** et **Redis** pour le caching des requêtes.

4. **Usurpation d'identité** :

    - Risque : Tentatives de connexion malveillantes par des utilisateurs non autorisés ou vol d'identifiants.
    - Mesure : Utilisation de **JWT (JSON Web Token)** pour sécuriser les sessions des utilisateurs, avec expiration automatique des tokens et authentification par **GoogleApiAuth**.

5. **Mauvaise gestion des sessions utilisateur** :

    - Risque : Vol de sessions utilisateur par des attaquants interceptant les cookies de session.
    - Mesure : Chiffrement des cookies de session et utilisation du protocole **HTTPS** pour toutes les communications.

6. **Perte de disponibilité des services** :
    - Risque : Problèmes d'infrastructure ou de surcharge des serveurs, entraînant une indisponibilité de l'application.
    - Mesure : Utilisation de **Docker** pour le déploiement en conteneurs, facilitant la scalabilité horizontale et la portabilité de l'application.

### Plan de réponse aux incidents

En cas d'incident de sécurité majeur, voici les étapes prévues :

-   **Identification** : Détection rapide de l'incident à l'aide d'outils de monitoring (logs, alertes).
-   **Confinement** : Limiter l'impact de l'incident en bloquant les accès non autorisés.
-   **Résolution** : Corriger les failles exploitées et rétablir les services en ligne.
-   **Analyse post-incident** : Analyse des causes profondes de l'incident et mise en place de mesures correctives pour éviter une répétition.

## 13. Conception

### Diagrammes de Séquences

#### Diagramme de Séquence Mode Solo

![Diagramme de Séquence Mode Solo](./conception/diagrammes/sequenceDiagramSolo.png)

<details>
<summary>Voir le code PUML</summary>

```puml
@startuml Sequence Diagram Soloplayer

' Diagramme de séquence pour une partie de Worduel en Solo

actor Player
participant GameServer
participant WordList
participant Scoreboard

Player -> GameServer: startGame()
activate GameServer
GameServer -> WordList: getRandomWord()
activate WordList
WordList -> GameServer: randomWord
GameServer -> Player: displayWordGrid()
deactivate WordList

loop max 6 times
  Player -> GameServer: submitGuess(word)
  activate GameServer
  GameServer -> WordList: validateGuess(word)
  activate WordList
  WordList -> GameServer: validationResult
  deactivate WordList
  GameServer -> Player: displayFeedback(validationResult)
  alt correct word
    GameServer -> Scoreboard: updateScore(Player)
    deactivate GameServer
    GameServer -> Player: endGame(success)
    deactivate Scoreboard
    break
  end
  deactivate GameServer
end

GameServer -> Player: endGame(failure)
deactivate GameServer

@enduml
```

</details>

#### Diagramme de Séquence Mode Duel

![Diagramme de Séquence Mode Duel](./conception/diagrammes/sequenceDiagramMulti.png)

<details>
<summary>Voir le code PUML</summary>

```puml
@startuml Sequence Diagram Multiplayer (Duel) with Matchmaking

' Diagramme de séquence pour une partie Duel de Worduel

actor Player1
actor Player2
participant GameServer
participant GameMatchmaking
participant WordList
participant Timer
participant Scoreboard


Player1 -> GameServer: requestGame()
activate GameServer
GameServer -> GameMatchmaking: findExistingGame()
activate GameMatchmaking
alt game exists (true)
  GameMatchmaking -> GameServer: return true
  GameServer -> Player1: joinGame()
  deactivate GameMatchmaking
else no game (false)
  GameMatchmaking -> GameServer: return false
  GameServer -> Player1: createNewGame()
  GameServer -> Player1: displayWaitingForOpponent()
  deactivate GameMatchmaking
end

Player2 -> GameServer: requestGame()
activate GameServer
GameServer -> GameMatchmaking: findExistingGame()
activate GameMatchmaking
alt game exists (true)
  GameMatchmaking -> GameServer: return true
  GameServer -> Player2: joinGame()
  GameServer -> Player1: notifyOpponentJoined()
  deactivate GameMatchmaking
  GameServer -> WordList: getRandomWord()
  activate WordList
  WordList -> GameServer: randomWord
  GameServer -> Player1: displayWordGrid()
  GameServer -> Player2: displayWordGrid()
  deactivate WordList
else no game (false)
  GameMatchmaking -> GameServer: return false
  GameServer -> Player2: createNewGame()
  GameServer -> Player2: displayWaitingForOpponent()
  deactivate GameMatchmaking
end

GameServer -> Timer: startTimer()

par Player1 and Player2 play simultaneously
    Player1 -> GameServer: submitGuess(word)
    activate GameServer
    GameServer -> WordList: validateGuess(word)
    activate WordList
    WordList -> GameServer: validationResult
    deactivate WordList
    GameServer -> Player1: displayFeedback(validationResult)
    alt correct word
      GameServer -> Player1: endGame(success)
      GameServer -> Player2: endGame(failure)
      GameServer -> Scoreboard: updateScore(Player1, Player2)
      deactivate GameServer
      break
    end
    deactivate GameServer

    Player2 -> GameServer: submitGuess(word)
    activate GameServer
    GameServer -> WordList: validateGuess(word)
    activate WordList
    WordList -> GameServer: validationResult
    deactivate WordList
    GameServer -> Player2: displayFeedback(validationResult)
    alt correct word
      GameServer -> Player2: endGame(success)
      GameServer -> Player1: endGame(failure)
      GameServer -> Scoreboard: updateScore(Player1, Player2)
      deactivate GameServer
      break
    end
    deactivate GameServer
end

alt maxAttemptsReached
  GameServer -> Player1: endGame(draw)
  GameServer -> Player2: endGame(draw)
  GameServer -> Scoreboard: updateScore(Player1, Player2)
  deactivate GameServer
end

alt playerDisconnected
  GameServer -> Player1: checkConnection()
  alt Player1 disconnected
    GameServer -> Player2: endGame(success)
    GameServer -> Player1: endGame(failure)
    GameServer -> Scoreboard: updateScore(Player1, Player2)
  else Player2 disconnected
    GameServer -> Player1: endGame(success)
    GameServer -> Player2: endGame(failure)
    GameServer -> Scoreboard: updateScore(Player1, Player2)
  end
end

alt timeOut
  Timer -> GameServer: timeElapsed()
  GameServer -> Player1: endGame(draw)
  GameServer -> Player2: endGame(draw)
  GameServer -> Scoreboard: updateScore(Player1, Player2)
end

@enduml

```

</details>

### Diagramme d'activité

![Diagramme d'activité](./conception/diagrammes/activityDiagram.png)

<details>

<summary>Voir le code PUML</summary>

```puml
@startuml Wordle
start
:Inscription / Connexion;
if (Est connecté ?) then (Oui)
  :Sélection du mode;
  if (Solo ou Multijoueur ?) then (Solo)
    :Débuter une partie solo;
    :Sélectionner un mot aléatoire;
    :Afficher la grille de mots;
    repeat
      :Soumettre un mot;
      :Valider le mot;
      :Afficher feedback (lettres correctes, emplacement);
    repeat while (Mot correct ou 6 essais épuisés ?)
    if (Mot correct ?) then (Oui)
      :Fin de la partie (victoire);
    else (Non)
      :Fin de la partie (échec);
    endif
    :Proposer Rejouer / Quitter;
  else (Multijoueur)
    :Trouver un adversaire;
    :Débuter une partie Multijoueur;
    fork
      :Chronomètre partagé (60s);
    fork again
      :Joueur 1 soumet un mot;
      :Valider le mot pour J1;
      :Afficher feedback J1;
    fork again
      :Joueur 2 soumet un mot;
      :Valider le mot pour J2;
      :Afficher feedback J2;
    end fork
    :Mise à jour de l'état des deux joueurs (Lettres correctes sans les dévoiler);

    if (Adversaire déconnecté ?) then (Oui)
      :Afficher pop-up "Adversaire déconnecté, victoire !";
      :Fin de la partie;
      :Proposer Revanche / Quitter;
    else (Non)
      if (Joueur trouve le mot ?) then (Oui)
        :Fin de partie pour J1/J2;
        :Déclaration du gagnant;
        :Proposer Revanche / Quitter;
      else (Non)
        if (Chronomètre écoulé ?) then (Oui)
          :Fin de la partie, aucun gagnant;
          :Proposer Revanche / Quitter;
        endif
      endif
    endif
  endif
else (Non)
  :Rediriger vers la page de connexion;
endif
stop
@enduml
```

</details>

### User Stories

| ID  | Rôle        | Fonctionnalité                           | Description                                                                                         |
| --- | ----------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Utilisateur | Créer un compte                          | Je veux pouvoir créer un compte pour m'inscrire et sauvegarder mes progrès.                         |
| 2   | Utilisateur | Modifier mon compte                      | Je veux pouvoir modifier mon compte (email ou nom de joueur).                                       |
| 3   | Utilisateur | Supprimer mon compte                     | Je veux pouvoir supprimer mon compte et les données non obligatoires.                               |
| 4   | Utilisateur | Se connecter                             | Je veux pouvoir me connecter avec mes identifiants pour accéder à mon compte.                       |
| 5   | Utilisateur | Se déconnecter                           | Je veux pouvoir me déconnecter de mon compte en toute sécurité.                                     |
| 6   | Joueur      | Personnaliser mon avatar                 | Je veux pouvoir personnaliser mon avatar pour refléter mon style.                                   |
| 7   | Joueur      | Jouer en solo                            | Je veux pouvoir jouer en mode solo pour m'entraîner quotidiennement au Wordle.                      |
| 8   | Joueur      | Jouer en multijoueur                     | Je veux pouvoir jouer en multijoueur pour affronter d'autres joueurs.                               |
| 9   | Joueur      | Voir mes statistiques                    | Je veux pouvoir voir mes statistiques pour suivre mes performances.                                 |
| 10  | Joueur      | Jouer plusieurs fois par jour            | Je veux pouvoir jouer plusieurs fois par jour pour améliorer mes compétences.                       |
| 11  | Joueur      | Inviter des amis                         | Je veux pouvoir inviter des amis à jouer avec moi en multijoueur.                                   |
| 12  | Admin       | Gérer les utilisateurs                   | Je veux pouvoir gérer les utilisateurs pour bannir ou supprimer des comptes problématiques.         |
| 13  | Admin       | Accéder au tableau d'administration      | Je veux pouvoir accéder à un tableau de bord pour gérer les statistiques et les utilisateurs.       |
| 14  | Joueur      | Voir un classement                       | Je veux pouvoir consulter un leaderboard pour comparer mes performances.                            |
| 15  | Joueur      | Débloquer des récompenses                | Je veux pouvoir débloquer des récompenses en atteignant certains jalons.                            |
| 16  | Joueur      | Recevoir des notifications en temps réel | Je veux recevoir des notifications en temps réel quand un ami se connecte ou m'invite à une partie. |

### Entity-Relationship Diagram (ERD)

![Entity-Relationship Diagram (ERD) ](./conception/diagrammes/erd.png)

<details>

<summary>Voir le code PUML</summary>

```puml
@startuml

' Définition des entités

entity "User" as User {
    * id
    --
    username
    email
    avatar
    role
    mmr
    total_score_multi
    primary_color_preference
    secondary_color_preference
    created_at
    updated_at
}

entity "Authentication" as Authentication {
    * id
    --
    user_id
    type
    identifier
    password_hash
    created_at
    updated_at
}

entity "Word" as Word {
    * id
    --
    word_text
    created_at
}

entity "Game" as Game {
    * id
    --
    creator_id
    mode
    word_id
    status
    max_players
    player_in_game
    started_at
    ended_at
    created_at
    updated_at
}

entity "PlayerGameSession" as PlayerGameSession {
    * id
    --
    game_id
    user_id
    score_by_time
    score_by_guesses
    score_bonus
    succeeded
    joined_at
    mmr_change
    guesses_count
    status
    updated_at
}

entity "Guess" as Guess {
    * id
    --
    game_session_id
    word_id
    attempt_number
    result
    created_at
}

' Définition des relations avec cardinalités

User "1" -- "1..N" Authentication

User "1" -- "0..N" PlayerGameSession

Game "1" -- "0..N" PlayerGameSession

PlayerGameSession "1" -- "0..N" Guess

User "1" -- "0..N" Game

Word "1" -- "0..N" Game : Utilisé dans

Word "1" -- "0..N" Guess : Utilisé dans la tentative

@enduml
```

</details>

### Diagramme de déploiement

![Diagramme de déploiement ](./conception/diagrammes/deploymentDiagram.png)

<details>

<summary>Voir le code PUML</summary>

```puml
@startuml

title Worduel Deployment Diagram (Multiplayer)

node "VPS (Ubuntu 24 LTS)" {
    node "Docker" {
        node "Nginx Reverse Proxy" as nginx {
            [Nginx] --> [Frontend (Vite)]
            [Nginx] --> [API (Apollo Server)]
            [Nginx] --> [Adminer]
        }

        node "Frontend (React + Vite)" as frontend {
            [React + Vite] --> [Browser]
        }

        node "API (Apollo Server + Socket.io)" as api {
            [Apollo Server] --> db
            [Apollo Server] --> redis
            [Apollo Server] --> websocket
        }

        node "WebSocket Server" as websocket {
            [WebSocket (Socket.io)] --> [Players]
        }

        node "Adminer" as adminer {
            [Adminer] --> db
        }

        node "PostgreSQL" as db {
            [Database]
        }

        node "Redis" as redis {
            [Cache]
        }

        node "Monitoring (Prometheus + Grafana)" as monitoring {
            [Prometheus] --> nginx
            [Prometheus] --> api
            [Prometheus] --> db
            [Prometheus] --> redis
        }
    }
}

cloud "Internet" {
    [DNS: worduel.fr] --> nginx
}

node "Test de charge (Artillery)" as load_test {
    [Artillery] --> websocket
    [Artillery] --> api
}

@enduml
```

</details>

### Use Cases

![Use Cases ](./conception/diagrammes/useCases.png)

<details>

<summary>Voir le code PUML</summary>

```puml
@startuml Wordle
left to right direction
actor Joueur as J
actor Admin as A <<optional>>

package "Version 1.0 - MVP" {
  J --> (S'inscrire) : "S'inscrire"
  J --> (Se connecter) : "Se connecter"
  J --> (Supprimer compte) : "Supprimer"
  J --> (Modifier compte) : "Modifier"
  J --> (Jouer en solo) : "Jouer en solo"
  J --> (Jouer en multijoueur) : "Jouer en multijoueur"
}

package "Version 2.0 - Personnalisation et Classement" {
  J --> (Personnaliser avatar) : "Personnaliser avatar"
  J --> (Voir classement) : "Voir classement"
  J --> (Consulter statistiques) : "Consulter statistiques"
}

package "Version 3.0 - Notifications et Récompenses" {
  J --> (Recevoir notifications) : "Recevoir notifications"
  J --> (Accéder aux récompenses) : "Accéder aux récompenses"
}

A --> (Gérer les utilisateurs)
A --> (Gérer le jeu)
A --> (Gérer le leaderboard)

@enduml
```

</details>

### Diagramme d'Architecture

![Diagramme d'Architecture](./conception/diagrammes/architectureDiagram.png)

<details>

<summary>Voir le code PUML</summary>

```puml
@startuml

skinparam componentStyle rectangle

' Navigateur de l'utilisateur
actor "Utilisateur" as user

node "Navigateur de l'Utilisateur" {
  component "Application React" <<BrowserApp>> as react_app
}

user --> react_app : Interaction

' Serveur Hostinger
node "Serveur Hostinger" as hostinger_server {
  frame "Docker Host" {
    [NGINX] <<Reverse Proxy>> as nginx
    node "Conteneur Docker : Application Node.js" as nodejs_container {
      component "Express Server" as express
      component "Apollo Server" as apollo_server
      component "Prisma ORM" as prisma
      component "Module d'Authentification" as auth_module
      component "Module d'Autorisation" as authz_module
      component "GraphQL Subscriptions" as graphql_subs
      component "Gestion des Logs (Morgan)" as morgan
      component "Surveillance des Erreurs (Sentry)" as sentry_agent
    }
    node "Conteneur Docker : Redis" as redis
    node "Conteneur Docker : PostgreSQL" as postgres
  }
}

' Services Externes
cloud "Services Externes" {
  [Mailgun API] as mailgun
  [Google OAuth 2.0] as google_oauth
  [Let's Encrypt] as lets_encrypt
  [Sentry Service] as sentry_service
}

' CI/CD
node "Pipeline CI/CD" {
  component "GitHub Actions" as github_actions
}

' Contrôle de Version
node "Contrôle de Version" {
  component "Dépôt GitHub" as github_repo
}

' Relations

react_app --> nginx : Requêtes HTTPS
nginx --> express : Proxy des Requêtes

express --> apollo_server : Requêtes GraphQL
apollo_server --> prisma : Opérations ORM
prisma --> postgres : Requêtes SQL

express --> redis : Sessions & Cache

auth_module --> google_oauth : Authentification OAuth 2.0

nodejs_container --> mailgun : Envoi d'Emails

express --> morgan : Logs des Requêtes
express --> sentry_agent : Envoi des Erreurs
sentry_agent --> sentry_service : Surveillance des Erreurs

nginx --> lets_encrypt : Certificats SSL/TLS

github_repo --> github_actions : Déclenchement CI/CD
github_actions --> hostinger_server : Déploiement

@enduml
```

</details>

---

### Arborescence de l'application

![Arborescence](./conception/diagrammes/arborescence.webp)


### Wireframes

#### Page d'accueil

![Wireframe page d'accueil - Desktop](./conception/wireframes/Desktop/Desktop-welcome.jpg)
![Wireframe page d'accueil - Mobile](./conception/wireframes/Mobile/Mobile-welcome.jpg)

#### Page de connexion

![Wireframe page de connexion - Desktop](./conception/wireframes/Desktop/Desktop-connexion.jpg)
![Wireframe page de connexion - Mobile](./conception/wireframes/Mobile/Mobile-connexion.jpg)

#### Page d'inscription

![Wireframe page d'inscription - Desktop](./conception/wireframes/Desktop/Desktop-register.jpg)
![Wireframe page d'inscription - Mobile](./conception/wireframes/Mobile/Mobile-register.jpg)

#### Page de sélection du mode de jeu

![Wireframe page de sélection du mode de jeu - Desktop](./conception/wireframes/Desktop/Desktop-gameSelection.jpg)
![Wireframe page de sélection du mode de jeu - Mobile](./conception/wireframes/Mobile/Mobile-gameSelection.jpg)

#### Page de jeu - solo

![Wireframe page de jeu solo - Desktop](./conception/wireframes/Desktop/Desktop-in_gameSolo.jpg)
![Wireframe page de jeu solo - Mobile](./conception/wireframes/Mobile/Mobile-in_gameSolo.jpg)

#### Page de jeu - multijoueur

![Wireframe page de jeu multijoueur - Desktop](./conception/wireframes/Desktop/Desktop-in_gameMulti.jpg)
![Wireframe page de jeu multijoueur - Mobile](./conception/wireframes/Mobile/Mobile-in_gameMulti.jpg)

#### Page classement

![Wireframe page de classement - Desktop](./conception/wireframes/Desktop/Desktop-leaderboard.jpg)
![Wireframe page de classement - Mobile](./conception/wireframes/Mobile/Mobile-leaderboard.jpg)

#### Page historique des parties

![Wireframe page historique des parties - Desktop](./conception/wireframes/Desktop/Desktop-history.jpg)
![Wireframe page historique des parties - Mobile](./conception/wireframes/Mobile/Mobile-history.jpg)

#### Détail du bouton "profil"

![Wireframe page amis - Desktop](./conception/wireframes/Desktop/Desktop-detailBtnProfil.jpg)
![Wireframe page amis - Mobile](./conception/wireframes/Mobile/Mobile-detailBtnProfile.jpg)

#### Page de profil

![Wireframe page paramètres du compte - Desktop](./conception/wireframes/Desktop/Desktop-profile.jpg)
![Wireframe page paramètres du compte - Mobile](./conception/wireframes/Mobile/Mobile-profile.jpg)

### Charte graphique

#### Couleurs

| Couleur    | Code Hexadécimal |
| ---------- | ---------------- |
| Blue       | `#48CDED`        |
| Red        | `#E86262`        |
| Dark grey  | `#232323`        |
| Light grey | `#E8E8E8`        |

#### Typographies

-   Titres : _Poppins 300 & 700_

-   Contenu : _Roboto_

#### Logo

![Logo dark](./conception/assets/Logo-dark.webp)
![Logo light](./conception/assets/Logo-light.webp)

### Mockups

Les mockups suivants ont été réalisés sur la _page de jeu multijoueur_ selon le principe du worst case : Il s'agit de la page contenant le plus de composants graphiques.

![In-game - dark mode](./conception/mockups/Mockup-compo-dark.webp)
![In-game - light mode](./conception/mockups/Mockup-compo-light.webp)
