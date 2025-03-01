# **Compte-rendu du Projet Wordle - 11 Octobre**

## **Participants :**

- **Kevin** (Lead Design)
- **Nicolas** (Lead Back)
- **Jeremy** (Scrum Master)
- **Laurent** (Lead Front)
- **Florent** (Product Owner & Lead Devops)

---

## **Objectifs du jour :**

1. **Finaliser les diagrammes UML** pour le projet (ERD, séquence, activité, déploiement).
2. Discuter de la **méthode de calcul des scores** pour le mode multijoueur et le **système MMR** pour gérer les rangs des joueurs.
3. Poursuivre la **mise en place du pipeline CI/CD** pour pousser sur le VPS après chaque push sur la branche main.
4. Ajouter les **librairies nécessaires** au front et au back dans les `package.json` respectifs avec `pnpm`.

---

## **Fonctionnalités principales du MVP :**

- **Inscription / Connexion** : Les utilisateurs peuvent créer un compte et se connecter.
- **Jouer en solo** : Deviner un mot aléatoire dans un temps limité.
- **Jouer en multijoueur** : Mode compétitif où les joueurs s’affrontent simultanément.
- **Grille de jeu** : Affichage d’une grille de lettres où les joueurs entrent leurs suppositions.
- **Validation des mots** : Retour immédiat sur la validité et la position des lettres devinées.

---

## **Fonctionnalités futures (versions post-MVP) :**

- **Personnalisation d’avatar** : Les utilisateurs pourront personnaliser leur avatar.
- **Classement** : Système de classement général basé sur les scores des joueurs.
- **Notifications** : Alertes pour de nouveaux défis, résultats, etc.
- **Récompenses** : Encourager les joueurs avec des jalons et des trophées.

---

## **Décisions prises :**

- Finalisation des **diagrammes UML** pour tout le projet.
- **MMR et calcul des scores** : Discussions sur les meilleures approches pour calculer les scores des parties multijoueurs et gérer les rangs des joueurs.
- Mise en place de **GitHub Actions** pour le **pipeline CI/CD** afin de déployer automatiquement les modifications sur le VPS.
- Ajout des **dépendances front et back** via `pnpm` dans les `package.json` respectifs pour préparer l'environnement de production.

---

## **Prochaines étapes :**

1. Tester le **pipeline CI/CD** avec des déploiements sur le VPS.
2. Organiser un **sprint** pour l’implémentation des fonctionnalités **MVP** (authentification, connexion, jeu solo et multi).
3. Définir les **règles du MMR** pour le classement des joueurs en multijoueur.
4. Continuer à travailler sur l’optimisation des performances pour le mode multijoueur.
