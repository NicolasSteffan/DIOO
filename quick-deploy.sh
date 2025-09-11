#!/bin/bash

# =============================================================================
# Script de Déploiement Rapide DIOO Docker Alpine
# Description: Déploiement simplifié pour Ubuntu
# Usage: ./quick-deploy.sh [domaine] [email]
# =============================================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
DOMAIN="${1:-}"
EMAIL="${2:-}"
SKIP_SSL=false

# Bannière
echo
echo -e "${PURPLE}===============================================${NC}"
echo -e "${PURPLE}    DIOO - Déploiement Rapide Docker Alpine${NC}"
echo -e "${PURPLE}===============================================${NC}"
echo

# Fonction d'aide
show_help() {
    echo "Usage: $0 [DOMAIN] [EMAIL]"
    echo
    echo "Arguments:"
    echo "  DOMAIN    Nom de domaine (ex: dioo.example.com)"
    echo "  EMAIL     Email pour Let's Encrypt"
    echo
    echo "Exemples:"
    echo "  $0 dioo.example.com admin@example.com"
    echo "  $0  # Mode interactif"
}

# Demander les informations si pas fournies
if [ -z "$DOMAIN" ]; then
    echo -e "${BLUE}Configuration du déploiement:${NC}"
    read -p "Nom de domaine: " DOMAIN
    
    if [ -z "$DOMAIN" ]; then
        echo -e "${RED}Erreur: Le domaine est obligatoire${NC}"
        show_help
        exit 1
    fi
fi

if [ -z "$EMAIL" ]; then
    read -p "Email pour SSL (laisser vide pour HTTP seulement): " EMAIL
    
    if [ -z "$EMAIL" ]; then
        SKIP_SSL=true
        echo -e "${YELLOW}Mode HTTP seulement (pas de SSL)${NC}"
    fi
fi

echo
echo -e "${BLUE}Configuration:${NC}"
echo -e "  Domaine: $DOMAIN"
echo -e "  Email: $EMAIL"
echo -e "  SSL: $( [ "$SKIP_SSL" = true ] && echo "Non" || echo "Oui" )"
echo

# ÉTAPE 1: Vérifications
echo -e "${BLUE}[ÉTAPE 1]${NC} Vérifications préalables..."

# Vérifier les fichiers nécessaires
REQUIRED_FILES=(
    "docker-compose.alpine.yml"
    "Dockerfile.alpine"
    "nginx.alpine.conf"
    "nginx.site.conf"
    "index.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}Erreur: Fichier manquant: $file${NC}"
        echo -e "${YELLOW}Assurez-vous d'avoir extrait tous les fichiers du package${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ Fichiers nécessaires présents${NC}"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installation de Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker installé.${NC}"
    echo -e "${YELLOW}Reconnectez-vous et relancez ce script.${NC}"
    exit 0
fi

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installation de Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installé${NC}"
fi

# Vérifier que Docker fonctionne
if ! docker ps &> /dev/null; then
    echo -e "${RED}Erreur: Docker n'est pas accessible${NC}"
    echo -e "${YELLOW}Essayez: sudo usermod -aG docker $USER && newgrp docker${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker opérationnel${NC}"

# ÉTAPE 2: Préparation des fichiers
echo -e "${BLUE}[ÉTAPE 2]${NC} Préparation des fichiers de configuration..."

# Créer les répertoires
mkdir -p nginx ssl logs

# Configuration Nginx
cp nginx.alpine.conf nginx/nginx.conf
cp nginx.site.conf nginx/default.conf

# Remplacer les variables dans la configuration Nginx
sed -i "s/VOTRE_DOMAINE/$DOMAIN/g" nginx/default.conf

# Configuration Docker Compose
cp docker-compose.alpine.yml docker-compose.yml
sed -i "s/VOTRE_EMAIL/$EMAIL/g" docker-compose.yml
sed -i "s/VOTRE_DOMAINE/$DOMAIN/g" docker-compose.yml

echo -e "${GREEN}✓ Configuration préparée${NC}"

# ÉTAPE 3: Construction des images
echo -e "${BLUE}[ÉTAPE 3]${NC} Construction des images Docker..."

# Arrêter les containers existants s'ils existent
if docker-compose ps -q 2>/dev/null | grep -q .; then
    echo -e "${YELLOW}Arrêt des containers existants...${NC}"
    docker-compose down
fi

# Construction
echo -e "${BLUE}Construction de l'image DIOO...${NC}"
docker-compose build --no-cache dioo-app

echo -e "${GREEN}✓ Images construites${NC}"

# ÉTAPE 4: Configuration SSL ou HTTP
if [ "$SKIP_SSL" = false ]; then
    echo -e "${BLUE}[ÉTAPE 4]${NC} Configuration HTTPS avec SSL..."
    
    # Vérifier la résolution DNS
    echo -e "${BLUE}Vérification DNS pour $DOMAIN...${NC}"
    if ! nslookup "$DOMAIN" &> /dev/null; then
        echo -e "${YELLOW}⚠ Le domaine $DOMAIN ne semble pas résoudre vers ce serveur${NC}"
        read -p "Continuer quand même ? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            SKIP_SSL=true
            echo -e "${YELLOW}Passage en mode HTTP seulement${NC}"
        fi
    fi
    
    if [ "$SKIP_SSL" = false ]; then
        # Configuration temporaire sans SSL pour obtenir le certificat
        cat > nginx/default-temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://dioo-app:3020;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
        
        # Sauvegarder la config SSL et utiliser la temporaire
        mv nginx/default.conf nginx/default-ssl.conf
        mv nginx/default-temp.conf nginx/default.conf
        
        # Démarrer les services pour obtenir SSL
        echo -e "${BLUE}Démarrage temporaire pour obtention SSL...${NC}"
        docker-compose up -d nginx dioo-app
        
        # Attendre que nginx soit prêt
        sleep 15
        
        # Obtenir le certificat SSL
        echo -e "${BLUE}Obtention du certificat SSL...${NC}"
        if docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email "$EMAIL" --agree-tos --no-eff-email -d "$DOMAIN"; then
            echo -e "${GREEN}✓ Certificat SSL obtenu${NC}"
            
            # Restaurer la configuration SSL
            mv nginx/default-ssl.conf nginx/default.conf
            
            # Redémarrer avec SSL
            docker-compose down
            sleep 5
        else
            echo -e "${RED}✗ Échec de l'obtention du certificat SSL${NC}"
            echo -e "${YELLOW}Passage en mode HTTP seulement${NC}"
            SKIP_SSL=true
        fi
    fi
fi

if [ "$SKIP_SSL" = true ]; then
    echo -e "${BLUE}[ÉTAPE 4]${NC} Configuration HTTP (sans SSL)..."
    
    # Configuration HTTP simple
    cat > nginx/default.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://dioo-app:3020;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Headers de sécurité basiques
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
    }
    
    # Cache pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://dioo-app:3020;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    echo -e "${GREEN}✓ Configuration HTTP préparée${NC}"
fi

# ÉTAPE 5: Démarrage final
echo -e "${BLUE}[ÉTAPE 5]${NC} Démarrage de la stack complète..."

# Démarrer tous les services
docker-compose up -d

# Attendre que les services soient prêts
echo -e "${BLUE}Attente du démarrage des services...${NC}"
sleep 20

# Vérifier la santé des containers
echo -e "${BLUE}Vérification des containers...${NC}"
docker-compose ps

# ÉTAPE 6: Tests de validation
echo -e "${BLUE}[ÉTAPE 6]${NC} Tests de validation..."

# Test de l'application
echo -e "${BLUE}Test de l'application DIOO...${NC}"
if docker-compose exec -T dioo-app curl -f http://localhost:3020/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Application DIOO opérationnelle${NC}"
else
    echo -e "${YELLOW}⚠ Application DIOO pas encore prête${NC}"
fi

# Test d'accès externe
if [ "$SKIP_SSL" = false ]; then
    URL="https://$DOMAIN"
else
    URL="http://$DOMAIN"
fi

echo -e "${BLUE}Test d'accès externe...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Accès externe fonctionnel${NC}"
else
    echo -e "${YELLOW}⚠ Accès externe non testable (code: $HTTP_CODE)${NC}"
fi

# ÉTAPE 7: Création des scripts de gestion
echo -e "${BLUE}[ÉTAPE 7]${NC} Création des scripts de gestion..."

# Script de gestion principal
cat > manage.sh << 'EOF'
#!/bin/bash
# Script de gestion DIOO Docker

case "$1" in
    start)
        echo "Démarrage de DIOO..."
        docker-compose up -d
        echo "DIOO démarré."
        ;;
    stop)
        echo "Arrêt de DIOO..."
        docker-compose down
        echo "DIOO arrêté."
        ;;
    restart)
        echo "Redémarrage de DIOO..."
        docker-compose restart
        echo "DIOO redémarré."
        ;;
    logs)
        echo "Logs de DIOO (Ctrl+C pour quitter):"
        docker-compose logs -f ${2:-}
        ;;
    status)
        echo "Statut des containers DIOO:"
        docker-compose ps
        ;;
    update)
        echo "Mise à jour de DIOO..."
        docker-compose build --no-cache
        docker-compose up -d
        echo "DIOO mis à jour."
        ;;
    backup)
        BACKUP_FILE="dioo-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
        echo "Sauvegarde dans $BACKUP_FILE..."
        tar -czf "$BACKUP_FILE" ssl/ nginx/ docker-compose.yml *.html scripts/ styles/ 2>/dev/null || true
        echo "Sauvegarde terminée: $BACKUP_FILE"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|update|backup}"
        echo
        echo "Commandes disponibles:"
        echo "  start    - Démarrer DIOO"
        echo "  stop     - Arrêter DIOO"
        echo "  restart  - Redémarrer DIOO"
        echo "  logs     - Voir les logs"
        echo "  status   - Voir le statut"
        echo "  update   - Mettre à jour"
        echo "  backup   - Sauvegarder"
        exit 1
        ;;
esac
EOF

chmod +x manage.sh

# Script de renouvellement SSL (si applicable)
if [ "$SKIP_SSL" = false ]; then
    cat > renew-ssl.sh << 'EOF'
#!/bin/bash
# Script de renouvellement SSL automatique

echo "$(date): Début du renouvellement SSL" >> ssl-renew.log

if docker-compose run --rm certbot renew --quiet; then
    echo "$(date): Certificat renouvelé avec succès" >> ssl-renew.log
    
    if docker-compose exec nginx nginx -s reload; then
        echo "$(date): Nginx rechargé avec succès" >> ssl-renew.log
    else
        echo "$(date): ERREUR: Échec du rechargement nginx" >> ssl-renew.log
    fi
else
    echo "$(date): ERREUR: Échec du renouvellement" >> ssl-renew.log
fi

echo "$(date): Fin du renouvellement SSL" >> ssl-renew.log
EOF
    
    chmod +x renew-ssl.sh
    
    # Ajouter au crontab pour renouvellement automatique
    (crontab -l 2>/dev/null | grep -v "renew-ssl.sh"; echo "0 2 * * * $(pwd)/renew-ssl.sh") | crontab -
    
    echo -e "${GREEN}✓ Renouvellement SSL automatique configuré${NC}"
fi

echo -e "${GREEN}✓ Scripts de gestion créés${NC}"

# Résumé final
echo
echo -e "${PURPLE}===============================================${NC}"
echo -e "${PURPLE}        DÉPLOIEMENT TERMINÉ AVEC SUCCÈS${NC}"
echo -e "${PURPLE}===============================================${NC}"
echo
echo -e "${GREEN}🎉 DIOO est maintenant accessible !${NC}"
echo
echo -e "${BLUE}📋 INFORMATIONS D'ACCÈS:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 URL d'accès:${NC} $URL"
echo -e "${GREEN}🐳 Containers:${NC} $(docker-compose ps --services | wc -l) services actifs"
echo -e "${GREEN}📁 Répertoire:${NC} $(pwd)"
echo
echo -e "${BLUE}🔧 COMMANDES DE GESTION:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}▶️  Démarrer:${NC} ./manage.sh start"
echo -e "${GREEN}⏹️  Arrêter:${NC} ./manage.sh stop"
echo -e "${GREEN}🔄 Redémarrer:${NC} ./manage.sh restart"
echo -e "${GREEN}📊 Statut:${NC} ./manage.sh status"
echo -e "${GREEN}📋 Logs:${NC} ./manage.sh logs"
echo -e "${GREEN}🔄 Mettre à jour:${NC} ./manage.sh update"
echo -e "${GREEN}💾 Sauvegarder:${NC} ./manage.sh backup"
if [ "$SKIP_SSL" = false ]; then
    echo -e "${GREEN}🔄 Renouveler SSL:${NC} ./renew-ssl.sh"
fi
echo
echo -e "${BLUE}🛡️ SÉCURITÉ:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$SKIP_SSL" = false ]; then
    echo -e "${GREEN}✅ HTTPS activé${NC} avec certificat Let's Encrypt"
    echo -e "${GREEN}✅ Renouvellement automatique${NC} configuré"
else
    echo -e "${YELLOW}⚠ HTTP seulement${NC} (pas de SSL)"
fi
echo -e "${GREEN}✅ Container isolé${NC} avec utilisateur non-root"
echo -e "${GREEN}✅ Nginx optimisé${NC} avec headers de sécurité"
echo
echo -e "${PURPLE}🎉 Déploiement Docker Alpine terminé !${NC}"
echo
echo -e "${BLUE}Pour vos clients:${NC}"
echo -e "Ils peuvent maintenant accéder à DIOO via: ${GREEN}$URL${NC}"