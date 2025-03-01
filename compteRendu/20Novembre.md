# **Compte-rendu du Projet Wordle - 20 Novembre**

## **Participants :**
- Kevin (Lead Design)
- Nicolas (Lead Back)
- Jeremy (Scrum Master)
- Laurent (Lead Front)
- Florent (Product Owner & Lead Devops)

---

## **Objectifs du jour :**
1. Compléter l'**implémentation des sockets** pour la gestion des tentatives en mode solo.
2. **Tests unitaires** pour la connexion et l'inscription.
3. Régler les problèmes de **déploiement** liés à la configuration Nginx.

---

## **Avancements :**
- **Sockets pour la gestion des tentatives** intégrés avec succès, permettant une synchronisation en temps réel des essais des joueurs.
- Les premiers **tests unitaires** pour l'authentification sont passés avec succès, préparant ainsi le chemin vers une meilleure sécurité.
- **Problèmes avec Nginx** identifiés et partiellement résolus, mais des tests supplémentaires sont requis.

---

## **Décisions prises :**
- **Refactorisation de la configuration Nginx** pour éviter de servir la page par défaut lors du déploiement.
- Implémentation de **tests E2E** pour garantir que la connexion socket fonctionne bien en condition réelle.

---

## **Prochaines étapes :**
1. Finaliser la **configuration Nginx** et les tests E2E.
2. Continuer à régler les problèmes mineurs de déploiement.
3. Intégrer la **fonctionnalité de recommencer une partie** après une défaite ou une victoire.

---