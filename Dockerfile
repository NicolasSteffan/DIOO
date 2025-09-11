# ~/dioo-docker/app/Dockerfile
FROM node:18-alpine

# Métadonnées
LABEL maintainer="DIOO Team"
LABEL description="DIOO Application - Alpine Linux"
LABEL version="1.0"

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3020
ENV USER=dioo

# Installer les dépendances système minimales
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S $USER && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G $USER -g $USER $USER

# Définir le répertoire de travail
WORKDIR /app

# Installer http-server globalement
RUN npm install -g http-server@latest && \
    npm cache clean --force

# Copier les fichiers de l'application
COPY --chown=$USER:$USER . .

# Changer vers l'utilisateur non-root
USER $USER

# Exposer le port
EXPOSE $PORT

# Point de santé pour Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/ || exit 1

# Utiliser dumb-init comme PID 1
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["http-server", ".", "-p", "3020", "-c-1", "--cors", "--silent", "-d", "false"]