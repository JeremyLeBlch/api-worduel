# Utiliser Node.js 20 comme base
FROM node:20-alpine

# Installer pnpm globalement
RUN npm install -g pnpm

# Créer un répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et pnpm-lock.yaml pour installer les dépendances
COPY package*.json ./
COPY pnpm-lock.yaml ./

# RUN rm -rf node_modules/.vite
# RUN rm -rf dist
# Installer les dépendances avec pnpm
RUN pnpm install


# Copier le reste du code de l'application (en excluant node_modules via .dockerignore)
COPY . .

# Build de l'application en production
# RUN pnpm build

# Exposer le port 4173 pour Vite
EXPOSE 5173

# Lancer le serveur en production
CMD ["pnpm", "dev"]
