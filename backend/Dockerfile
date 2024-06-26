# Utiliser l'image de base node:18-alpine
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json spécifiques au backend
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install && npm cache clean --force

# Copier le reste des fichiers du backend, en excluant ceux listés dans .dockerignore
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3001

# Commande à exécuter lorsque le conteneur est démarré
CMD ["npm", "run", "dev"]
