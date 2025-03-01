# **Compte-rendu du Projet Wordle - 9 Octobre**

## **Participants :**

-   **Kevin** (Lead Design)
-   **Nicolas** (Lead Back)
-   **Jeremy** (Scrum Master)
-   **Laurent** (Lead Front)
-   **Florent** (Product Owner & Lead Devops)

---

## **Objectifs du jour :**

1. **Poursuivre les wireframes** et débuter la maquette visuelle.
2. Définir les **technologies additionnelles** comme **nginx** en reverse proxy.
3. Créer des fichiers **markdown** pour :
    - Les **idées générales** et fonctionnalités futures.
    - Un fichier de **problématiques** pour le **front**, l'**API**, et le **DevOps** afin d'y revenir plus tard.
4. **Avancer sur les diagrammes UML** :
    - **Diagramme d’activité**
    - **Schéma de déploiement**
    - Décliner le **diagramme de séquence** pour la version multijoueur.
5. **Mise à jour du CDCF** (Cahier des Charges Fonctionnel) avec les nouveaux diagrammes.
6. Organisation de deux workshops :
    - **Design** pour valider les choix visuels.
    - **ERD** pour s'assurer que l'architecture de la base de données est complète.
7. Soumettre l’étape de conception à notre **référent** pour validation.

---

## **Fonctionnalités principales du MVP** :

-   **Inscription / Connexion** : Les utilisateurs peuvent créer un compte et se connecter.
-   **Jouer en solo** : Deviner un mot aléatoire dans un temps limité.
-   **Jouer en multijoueur** : Mode compétitif où les joueurs s’affrontent simultanément.
-   **Grille de jeu** : Affichage d’une grille de lettres où les joueurs entrent leurs suppositions.
-   **Validation des mots** : Retour immédiat sur la validité et la position des lettres devinées.

---

## **Fonctionnalités futures (versions post-MVP) :**

-   **Personnalisation d’avatar** : Les utilisateurs pourront personnaliser leur avatar.
-   **Classement** : Système de classement général basé sur les scores des joueurs.
-   **Notifications** : Alertes pour de nouveaux défis, résultats, etc.
-   **Récompenses** : Encourager les joueurs avec des jalons et des trophées.

---

## **Décisions prises :**

-   **Nginx** a été sélectionné pour servir de **reverse proxy**.
-   Priorisation de l’authentification et du mode solo et multijoueur pour le MVP.
-   Le **workshop design** a permis de valider les wireframes, les choix de polices, couleurs, et du logo.
-   Confirmation de la structure des **bases de données** et validation de l’ERD.

---

## **Wireframes & Design** :

-   **Mobile** : Pages de connexion, jeu solo, multijoueur, statistiques, et menu d’administration.
-   **Desktop** : Adaptation de ces pages pour un affichage sur plus grand écran.
-   Logo : Défini lors du workshop.
-   Polices choisies : **Roboto** pour le texte principal et **Poppins** pour les titres.
-   **Mockups** : Réalisation des mockups mobile & desktop pour la page multijoueur (Page contenant le plus d'éléments).

---

## **Technologies choisies :**

-   **Frontend** : React 18 + Vite pour plus de documentations en cas de debug.
-   **Backend** : Node.js avec Apollo Server et WebSockets pour la communication temps réel.
-   **Base de données** : PostgreSQL avec JSONB pour stocker les résultats des parties.
-   **Reverse proxy** : Nginx pour gérer le trafic entre le frontend et le backend.
-   **Déploiement** : Docker et Nginx, en plus de GitHub Actions pour l’intégration continue.
-   **Serveur O2Switch** : Déploiement sur un serveur personnel en CI/CD via
GitHub Actions

---

## **Diagrammes UML réalisés :**

1. **Diagramme ERD** : Structure des tables pour utilisateurs, parties, soumissions, leaderboard.
2. **Diagramme de séquence** : Déroulement d’une partie solo et multijoueur.
3. **Diagramme d’activité** : Processus utilisateur pour une partie de jeu.
4. **Schéma de déploiement** : Explication de l’architecture de l'application avec les conteneurs Docker.

---

## **Prochaines étapes :**

1. Finalisation des **diagrammes UML** manquants.
2. Mise en place du **Pipeline CI/CD** pour push sur main vers Prod.
3. Organisation d’un **sprint** pour l’implémentation des fonctionnalités **MVP** (authentification, connexion, jeu solo et multi).
4. **Valider la conception** auprès du référent et se préparer à la première revue.
5. Définir les **objectifs du prochain sprint** avec les fonctionnalités clés du MVP à implémenter.
