# 🖥️ **Développement Frontend du projet Wordle**

## 🎯 Objectifs Frontend
- Développer une interface utilisateur intuitive et réactive pour le projet Wordle.
- Prioriser l’expérience utilisateur pour mobile et desktop.

## 🎨 **Design & UX**

### 1. **Choix des technologies**
- Framework : **React**
- Librairie CSS : **TailwindCSS** pour un développement rapide et modulaire.

### 2. **Wireframes**
- Mobile-first :
  - Affichage simple de la grille de jeu.
  - Navigation intuitive.
- Desktop :
  - Espace pour le tableau de bord et classement.
  - Grille plus large avec statistiques visibles.

## 🔧 **Fonctionnalités principales**

### 1. **Inscription & Connexion**
- Authentification via **NextAuth** avec Google et email/password.
- Formulaire d’inscription responsive.

### 2. **Affichage de la grille de jeu**
- Grille dynamique et responsive.
- Validation en temps réel des tentatives de mots.

### 3. **Mode multijoueur**
- Utilisation de **WebSockets** pour les mises à jour en direct.
- Affichage du statut de l’adversaire (tentatives, temps).

## 🧪 **Tests frontend**

### 1. **Tests unitaires**
- Librairies : **Jest** et **React Testing Library**
- Objectif : Vérifier la logique des composants et la validation des mots.

### 2. **Tests end-to-end**
- Outil : **Cypress**
- Objectif : Tester l’expérience utilisateur complète, de la connexion au jeu en passant par la soumission de mots.

## 🚀 **Optimisation**

### 1. **Performance**
- Lazy loading des composants non critiques.
- Optimisation des assets et gestion des bundles avec **Vite** ou **Webpack**.
