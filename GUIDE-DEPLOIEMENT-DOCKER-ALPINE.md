# 🐳 Guide de Déploiement DIOO - Docker Alpine + HTTPS

## 📋 Vue d'Ensemble

Ce guide présente un déploiement **production-ready** de DIOO utilisant :
- **Docker Alpine** (image ultra-légère ~5MB)
- **Nginx Reverse Proxy** avec SSL/TLS
- **Let's Encrypt** pour certificats HTTPS automatiques
- **Accès client via HTTPS** depuis n'importe quel PC

---

## 🎯 Architecture de la Solution

```
Internet → [Nginx Proxy + SSL] → [DIOO Container Alpine] → Application
   ↓              ↓                        ↓
HTTPS:443    Reverse Proxy           http://localhost:3020
```

### **✅ Avantages de cette Solution**
- **Sécurité maximale** : HTTPS obligatoire + isolation Docker
- **Performance optimale** : Alpine Linux (5MB) + Nginx cache
- **Simplicité client** : Accès direct via URL HTTPS
- **Maintenance minimale** : Renouvellement SSL automatique
- **Scalabilité** : Load balancing et clustering possibles

---

## 🖥️ PARTIE 1 : PRÉPARATION SERVEUR UBUNTU

### **🔧 Prérequis Système**

#### **Configuration minimale :**
- Ubuntu 20.04+ LTS
- 1 GB RAM (2 GB recommandé)
- 10 GB espace disque
- Domaine pointant vers le serveur
- Ports 80 et 443 ouverts

#### **Vérifications initiales :**
```bash
# Vérifier la version Ubuntu
lsb_release -a

# Vérifier l'espace disque
df -h

# Vérifier la résolution DNS de votre domaine
nslookup votre-domaine.com

# Vérifier les ports ouverts
sudo ss -tlnp | grep -E ':80|:443'
```

### **📦 Installation Docker et Docker Compose**

> **⚠️ Note Importante :** Si vous obtenez l'erreur "le groupe 'docker' n'existe pas", cela signifie que Docker n'est pas encore complètement installé. Suivez cette procédure complète :

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Ajouter la clé GPG Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le repository Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine avec tous les plugins
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Démarrer et activer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Installer Docker Compose standalone (version classique)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Appliquer les changements de groupe (IMPORTANT)
newgrp docker

# OU se déconnecter/reconnecter pour appliquer les changements

# Vérifier l'installation
docker --version
docker-compose --version

# Test de fonctionnement
cd

```

### **🔧 Dépannage Installation Docker**

#### **Si le groupe docker n'existe pas :**
```bash
# Créer le groupe docker manuellement
sudo groupadd docker

# Ajouter l'utilisateur au groupe
sudo usermod -aG docker $USER

# Redémarrer Docker
sudo systemctl restart docker

# Appliquer les changements
newgrp docker
```

#### **Alternative : Installation via script officiel**
```bash
# Si la méthode ci-dessus ne fonctionne pas
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Puis ajouter l'utilisateur au groupe
sudo usermod -aG docker $USER
newgrp docker
```

#### **Vérification complète :**
```bash
# Vérifier que Docker fonctionne
sudo systemctl status docker

# Vérifier les groupes de l'utilisateur
groups $USER

# Tester sans sudo
docker ps
```

---

## 🐳 PARTIE 2 : CRÉATION DES CONTAINERS

### **📁 Structure du Projet**

```bash
# Créer la structure de déploiement
mkdir -p ~/dioo-docker/{app,nginx,ssl,scripts}
cd ~/dioo-docker

# Structure finale :
# ~/dioo-docker/
# ├── docker-compose.yml
# ├── app/
# │   ├── Dockerfile
# │   └── [fichiers DIOO]
# ├── nginx/
# │   ├── nginx.conf
# │   └── default.conf
# ├── ssl/
# │   └── [certificats Let's Encrypt]
# └── scripts/
#     ├── deploy.sh
#     └── renew-ssl.sh
```

### **🔧 Dockerfile Alpine Optimisé**

```dockerfile
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
```

### **🌐 Configuration Nginx**

#### **Configuration principale :**
```nginx
# ~/dioo-docker/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
}
```

#### **Configuration du site DIOO :**
```nginx
# ~/dioo-docker/nginx/default.conf
# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Permettre Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Rediriger tout le reste vers HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Proxy vers l'application DIOO
    location / {
        proxy_pass http://dioo-app:3020;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Cache pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://dioo-app:3020;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers spécifiques
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';";
}
```

### **🐙 Docker Compose Configuration**

```yaml
# ~/dioo-docker/docker-compose.yml
version: '3.8'

services:
  # Application DIOO
  dioo-app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: dioo-application
    restart: unless-stopped
    networks:
      - dioo-network
    volumes:
      - ./app:/app:ro
    environment:
      - NODE_ENV=production
      - PORT=3020
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3020/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp:noexec,nosuid,size=100m

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: dioo-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/letsencrypt:ro
      - certbot-www:/var/www/certbot:ro
    networks:
      - dioo-network
    depends_on:
      - dioo-app
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Certbot pour Let's Encrypt
  certbot:
    image: certbot/certbot
    container_name: dioo-certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - certbot-www:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email votre-email@domaine.com --agree-tos --no-eff-email -d votre-domaine.com -d www.votre-domaine.com
    depends_on:
      - nginx

volumes:
  certbot-www:

networks:
  dioo-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 🚀 PARTIE 3 : DÉPLOIEMENT PRATIQUE

Maintenant que Docker est installé, nous allons créer les fichiers nécessaires et déployer DIOO.

### **📁 Étape 1 : Créer la Structure de Projet**

```bash
# Créer la structure de base
mkdir -p ~/dioo-docker/{app,nginx,ssl}
cd ~/dioo-docker

# Vérifier la structure créée
ls -la
```

### **📋 Étape 2 : Copier les Fichiers DIOO**

```bash
# Copier tous vos fichiers DIOO dans le dossier app/
# Remplacez /chemin/vers/DIOO par le chemin réel de vos fichiers
cp -r /chemin/vers/vos/fichiers/DIOO/* app/

# OU si vous avez les fichiers dans votre home
cp -r ~/DIOO/* app/

# Vérifier que les fichiers sont copiés
ls -la app/
```

### **🐳 Étape 3 : Créer le Dockerfile**

```bash
# Créer le Dockerfile dans le dossier app/
nano app/Dockerfile
```

**Contenu à copier dans le Dockerfile :**
```dockerfile
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

# Installer http-server
RUN npm install -g http-server@latest && \
    npm cache clean --force

# Copier les fichiers de l'application
COPY --chown=$USER:$USER . .

# Changer vers l'utilisateur non-root
USER $USER

# Exposer le port
EXPOSE $PORT

# Point de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/ || exit 1

# Utiliser dumb-init comme PID 1
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["http-server", ".", "-p", "3020", "-c-1", "--cors", "--silent", "-d", "false"]
```

**Sauvegarder :** `Ctrl+X`, puis `Y`, puis `Entrée`

### **🌐 Étape 4 : Choisir Votre Type de Déploiement**

#### **Option A : Déploiement Simple (IP seulement - Recommandé pour commencer)**

```bash
# Créer docker-compose simple
nano docker-compose.yml
```

**Contenu pour déploiement IP :**
```yaml
version: '3.8'

services:
  # Application DIOO
  dioo-app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: dioo-application
    restart: unless-stopped
    ports:
      - "3020:3020"
    environment:
      - NODE_ENV=production
      - PORT=3020
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3020/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### **Option B : Déploiement avec HTTPS (Nécessite un nom de domaine)**

```bash
# Créer docker-compose avec Nginx et SSL
nano docker-compose.yml
```

**Contenu pour déploiement HTTPS :**
```yaml
version: '3.8'

services:
  # Application DIOO
  dioo-app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: dioo-application
    restart: unless-stopped
    networks:
      - dioo-network
    environment:
      - NODE_ENV=production
      - PORT=3020
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3020/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: dioo-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/letsencrypt:ro
      - certbot-www:/var/www/certbot:ro
    networks:
      - dioo-network
    depends_on:
      - dioo-app

  # Certbot pour Let's Encrypt
  certbot:
    image: certbot/certbot
    container_name: dioo-certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - certbot-www:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email VOTRE_EMAIL --agree-tos --no-eff-email -d VOTRE_DOMAINE

volumes:
  certbot-www:

networks:
  dioo-network:
    driver: bridge
```

### **🚀 Étape 5 : Scripts de Déploiement Automatisés**

#### **Script Simple (pour Option A - IP seulement)**

```bash
# Créer le script de déploiement simple
nano deploy-simple.sh
```

**Contenu du script simple :**
```bash
#!/bin/bash

# =============================================================================
# Script de Déploiement DIOO Simple (IP seulement)
# Usage: ./deploy-simple.sh
# =============================================================================

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo
echo "==============================================="
echo "    DIOO - Déploiement Simple (IP seulement)"
echo "==============================================="
echo

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker n'est pas installé"
    echo -e "${BLUE}[INFO]${NC} Installez Docker d'abord avec la Partie 1 du guide"
    exit 1
fi

if ! docker ps &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker n'est pas accessible"
    echo -e "${BLUE}[INFO]${NC} Exécutez: newgrp docker"
    exit 1
fi

echo -e "${BLUE}[ÉTAPE 1]${NC} Vérification des fichiers..."

# Vérifier la structure
if [ ! -f "app/Dockerfile" ]; then
    echo -e "${RED}[ERROR]${NC} Dockerfile manquant dans app/"
    echo -e "${BLUE}[INFO]${NC} Créez d'abord le Dockerfile selon l'Étape 3"
    exit 1
fi

if [ ! -f "app/index.html" ]; then
    echo -e "${RED}[ERROR]${NC} Fichiers DIOO manquants dans app/"
    echo -e "${BLUE}[INFO]${NC} Copiez vos fichiers DIOO dans app/ selon l'Étape 2"
    exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}[ERROR]${NC} docker-compose.yml manquant"
    echo -e "${BLUE}[INFO]${NC} Créez le docker-compose.yml selon l'Étape 4"
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Tous les fichiers sont présents"

echo -e "${BLUE}[ÉTAPE 2]${NC} Construction de l'image Docker..."
docker-compose build --no-cache

echo -e "${BLUE}[ÉTAPE 3]${NC} Démarrage de l'application..."
docker-compose up -d

echo -e "${BLUE}[ÉTAPE 4]${NC} Vérification du démarrage..."
sleep 10

if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}[OK]${NC} Application démarrée avec succès !"
    
    # Obtenir l'IP du serveur
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo
    echo "==============================================="
    echo "        DÉPLOIEMENT TERMINÉ AVEC SUCCÈS"
    echo "==============================================="
    echo
    echo -e "${GREEN}🎉 DIOO est maintenant accessible !${NC}"
    echo
    echo -e "${BLUE}📋 INFORMATIONS D'ACCÈS:${NC}"
    echo -e "${GREEN}🌐 URL:${NC} http://$SERVER_IP:3020"
    echo -e "${GREEN}🌐 URL locale:${NC} http://localhost:3020"
    echo
    echo -e "${BLUE}🔧 COMMANDES DE GESTION:${NC}"
    echo -e "${GREEN}📊 Statut:${NC} docker-compose ps"
    echo -e "${GREEN}📋 Logs:${NC} docker-compose logs -f"
    echo -e "${GREEN}🔄 Redémarrer:${NC} docker-compose restart"
    echo -e "${GREEN}⏹️ Arrêter:${NC} docker-compose down"
    echo -e "${GREEN}▶️ Démarrer:${NC} docker-compose up -d"
    echo
else
    echo -e "${RED}[ERROR]${NC} Problème de démarrage"
    echo -e "${BLUE}[INFO]${NC} Vérifiez les logs: docker-compose logs"
fi
```

**Rendre le script exécutable :**
```bash
chmod +x deploy-simple.sh
```

**Utiliser le script :**
```bash
./deploy-simple.sh
```

#### **Script Complet (pour Option B - avec HTTPS)**

Si vous avez un nom de domaine et voulez HTTPS, utilisez le script complet original du guide.

### **🎯 Étape 6 : Déploiement Final**

#### **Pour Option A (IP seulement) :**
1. Suivez les étapes 1-4 ci-dessus
2. Utilisez `./deploy-simple.sh`
3. Accédez via `http://VOTRE_IP:3020`

#### **Pour Option B (avec HTTPS) :**
1. Suivez les étapes 1-4 avec l'Option B
2. Configurez Nginx (voir sections suivantes)
3. Utilisez le script complet avec domaine

### **📋 Résumé des Étapes**

| Étape | Action | Fichier à créer |
|-------|--------|-----------------|
| 1 | Structure | `mkdir -p ~/dioo-docker/{app,nginx,ssl}` |
| 2 | Fichiers DIOO | `cp -r ~/DIOO/* app/` |
| 3 | Dockerfile | `nano app/Dockerfile` |
| 4 | Docker Compose | `nano docker-compose.yml` |
| 5 | Script déploiement | `nano deploy-simple.sh` |
| 6 | Lancement | `./deploy-simple.sh` |

**🎉 Vous êtes maintenant prêt à déployer DIOO avec Docker Alpine !**

---

## 🔧 PARTIE 4 : CONFIGURATION NGINX (Pour HTTPS seulement)

Si vous avez choisi l'Option B (HTTPS avec nom de domaine), vous devez configurer Nginx.

### **📁 Créer les Fichiers de Configuration Nginx**

```bash
# Créer la configuration Nginx principale
nano nginx/nginx.conf
```

**Contenu de nginx.conf :**
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    server_tokens off;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
}
```

```bash
# Créer la configuration du site
nano nginx/default.conf
```

**Contenu de default.conf (remplacez VOTRE_DOMAINE) :**
```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name VOTRE_DOMAINE;
    
    # Permettre Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Rediriger tout le reste vers HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    server_name VOTRE_DOMAINE;

    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/VOTRE_DOMAINE/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/VOTRE_DOMAINE/privkey.pem;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Proxy vers l'application DIOO
    location / {
        proxy_pass http://dioo-app:3020;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## 🎯 ÉTAPES SUIVANTES

### **Pour Option A (IP seulement) :**
1. ✅ Vous avez terminé ! Utilisez `./deploy-simple.sh`
2. Accédez à votre application via `http://VOTRE_IP:3020`

### **Pour Option B (HTTPS avec domaine) :**
1. Remplacez `VOTRE_DOMAINE` dans les fichiers Nginx par votre vrai domaine
2. Utilisez le script complet avec SSL (voir sections avancées du guide)

---

## 🎉 CONCLUSION

Vous disposez maintenant d'un guide complet pour déployer DIOO avec Docker Alpine !

**🚀 Prochaines étapes pour vous :**
1. Suivez la **Partie 3** étape par étape
2. Choisissez l'**Option A** (IP seulement) pour commencer
3. Utilisez le script `deploy-simple.sh` pour automatiser le déploiement

**📞 En cas de problème :** Consultez la section Dépannage ou posez vos questions !
