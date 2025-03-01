# **Compte-rendu du Projet Wordle - 8 Octobre**

## **Participants :**
- **Kevin** (Lead Design)
- **Nicolas** (Lead Back)
- **Jeremy** (Scrum Master)
- **Laurent** (Lead Front)
- **Florent** (Product Owner)

---

## **Objectifs du jour :**
1. **Compréhension générale** du projet Wordle.
2. Introduction à la **méthode Agile** avec un focus sur les sprints.
3. **Définir les fonctionnalités de base** pour le **Minimum Viable Product (MVP)**.
4. Choix des **technologies** pour le projet.
5. Élaboration des **Wireframes** pour mobile et desktop.
6. **Rédaction des user stories** et début du **CDCF** (Cahier des Charges Fonctionnel).
7. Début de la conception des **diagrammes UML** (cas d’utilisation, ERD, séquence).
8. **Priorisation** des fonctionnalités pour le premier sprint.

---

## **Fonctionnalités discutées pour le MVP :**
- **Inscription / Connexion** : Les utilisateurs doivent pouvoir créer un compte et se connecter.
- **Jouer en solo** : Un mode où le joueur devine un mot choisi aléatoirement.
- **Jouer en multijoueur** : Mode compétitif où plusieurs joueurs devinent le même mot.
- **Grille de jeu** : Affichage d'une grille pour permettre de saisir les mots.
- **Validation des mots** : Envoi de la réponse et retour sur la validité et position des lettres.

---

## **Fonctionnalités futures :**
- **Personnalisation d’avatar** : Les utilisateurs peuvent personnaliser leur avatar.
- **Classement** : Système de classement global selon les scores.
- **Notifications** : Notifications pour informer des résultats, nouveaux défis, etc.
- **Récompenses** : Système de récompenses pour encourager l'engagement.

---

## **Décisions prises :**
- Priorisation sur **l’authentification** et le **mode Solo** et **mode Multi** pour le MVP.
- Mise en place de l’**architecture backend** avec la gestion des utilisateurs, des parties, et des soumissions de mots.
- Utilisation de **WebSockets** pour la gestion en temps réel des parties multijoueurs.
- Création de **diagrammes UML** : séquence pour la gestion d'une partie et diagramme d’activité pour le parcours utilisateur.

---

## **Wireframes :**
- **Mobile** : Pages d'accueil, connexion, jeu solo, jeu multijoueur, statistiques, détail menu, admin.
- **Desktop** : Pages d'accueil et de jeu similaires, mais adaptées aux écrans plus larges.

---

## **Technologies choisies :**
- **Frontend :** React 18 + Vite.
- **Backend :** Node.js avec Apollo Server (WebSockets pour le multijoueur).
- **Base de données :** PostgreSQL avec JSONB pour les résultats de jeu.
- **Déploiement :** Docker + Compose.

---

## **Diagrammes UML réalisés :**
1. **ERD** diagramme de relation entre les entités.
2. **Diagramme de séquence** pour une partie.
3. **Diagramme de cas d’utilisation** pour les fonctionnalités principales.

---

## **Prochaines étapes :**
1. **Finaliser les diagrammes UML**.
2. Organiser un **premier sprint** pour implémenter les fonctionnalités du MVP.
3. Commencer l’implémentation des fonctionnalités **inscription**, **connexion**, et **mode Solo**.
