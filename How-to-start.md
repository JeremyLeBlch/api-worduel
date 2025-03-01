# How to start the project

## 🚧 WIP 🚧

### 🟢 Démarrage des conteneurs

Pour démarrer les conteneurs en mode développement et qu'ils soient " prêts à l'emploi " :

```bash
npm run docker:dev-start
```

Cette commande exécute `docker compose -f docker-compose.dev.yml up --build`, qui construit les images Docker pour la partie développement et démarre les conteneurs en arrière-plan.

### ⚙️ Execution de commandes sur le container api

### 🛑 Arrêt / Redémarrage / Reinitialisation des conteneurs

Pour démarrer les conteneurs en mode développement et supprimer les volumes :

```bash
npm run docker:dev-stop
```

Cette commande exécute `docker-compose -f docker-compose.dev.yml down -v`.

docker-compose -f docker-compose.dev.yml down -v (pour supprimer les volumes)

docker exec -it worduel-api sh

# Prisma Studio

npx prisma generate (pour générer les modèles)
npx prisma db push (pour push les schémas)
npx prisma db pull (pour pull les schémas)
npx prisma studio --hostname 0.0.0.0 (pour lancer prisma studio)
