# 🔍 **Problématiques API du projet Wordle**

## 🔧 **Problématiques techniques**

### 1. **Gestion des requêtes multiples**
- Problème : Lors de parties multijoueur, comment gérer un grand nombre de requêtes simultanées ?  
- Pistes de réflexion :
  - Utilisation de WebSockets pour les interactions en temps réel.
  - Scalabilité via load balancers.

### 2. **Sécurisation des API**
- Problème : Assurer la sécurité des endpoints exposés.
- Pistes de réflexion :
  - Implémenter des tokens JWT pour l’authentification.
  - Limitation du nombre de requêtes par IP (rate limiting).

### 3. **Validation des mots**
- Problème : Comment valider efficacement les mots soumis dans un délai réduit ?
- Pistes de réflexion :
  - Utilisation de cache pour éviter des requêtes répétées.
  - Stockage des mots dans une base de données optimisée.

### 4. **Synchronisation multijoueur**
- Problème : Comment synchroniser les réponses entre joueurs sans conflit ?
- Pistes de réflexion :
  - Gestion des états des parties via des événements temps réels.
  - Verrouillage transactionnel lors des modifications d'état de partie.

## 🚧 **Challenges à explorer**
- Performance de l'API avec des milliers d'utilisateurs simultanés.
- Prévenir les attaques DoS/DDoS sur le serveur.
