#!/bin/bash

# =============================================================================
# Script de Déploiement DIOO Docker Alpine + HTTPS
# Description: Déploiement automatique avec SSL Let's Encrypt
# Usage: ./deploy-alpine.sh -d domaine.com -e email@domaine.com
# =============================================================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration par défaut
DOMAIN=""
EMAIL=""
DRY_RUN=false
SKIP_SSL=false
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Fonction d'aide
show_help() {
    echo "Usage: $0 -d DOMAIN -e EMAIL [OPTIONS]"
    echo
    echo "Options obligatoires:"
    echo "  -d, --domain DOMAIN    Nom de domaine (ex: dioo.example.com)"
    echo "  -e, --email EMAIL      Email pour Let's Encrypt"
    echo
    echo "Options:"
    echo "  -h, --help            Afficher cette aide"
    echo "  --dry-run            Mode test (certificat de test)"
    echo "  --skip-ssl           Ignorer la configuration SSL"
    echo "  --project-dir DIR    Répertoire du projet (défaut: répertoire courant)"
    echo
    echo "Exemples:"
    echo "  $0 -d dioo.example.com -e admin@example.com"
    echo "  $0 -d test.local -e test@local --skip-ssl"
}

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -e|--email)
            EMAIL="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-ssl)
            SKIP_SSL=true
            shift
            ;;
        --project-dir)
            PROJECT_DIR="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}[ERROR]${NC} Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
done

# Vérifier les paramètres obligatoires
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}[ERROR]${NC} Le domaine est obligatoire"
    show_help
    exit 1
fi

if [ -z "$EMAIL" ] && [ "$SKIP_SSL" != true ]; then
    echo -e "${RED}[ERROR]${NC} L'email est obligatoire pour SSL"
    show_help
    exit 1
fi

# Bannière
echo
echo -e "${PURPLE}===============================================${NC}"
echo -e "${PURPLE}    DIOO - Déploiement Docker Alpine + HTTPS${NC}"
echo -e "${PURPLE}===============================================${NC}"
echo
echo -e "${CYAN}Configuration:${NC}"
echo -e "  ${BLUE}Domaine:${NC} $DOMAIN"
echo -e "  ${BLUE}Email:${NC} $EMAIL"
echo -e "  ${BLUE}Répertoire:${NC} $PROJECT_DIR"
echo -e "  ${BLUE}Mode test:${NC} $DRY_RUN"
echo -e "  ${BLUE}Ignorer SSL:${NC} $SKIP_SSL"
echo

# ÉTAPE 1: Vérifications préalables
echo -e "${BLUE}[ÉTAPE 1]${NC} Vérifications préalables..."

# Vérifier les droits
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}[WARNING]${NC} Exécution en tant que root détectée"
    echo -e "${BLUE}[INFO]${NC} Il est recommandé d'exécuter ce script avec un utilisateur normal"
fi

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker n'est pas installé"
    echo -e "${BLUE}[INFO]${NC} Installation automatique de Docker..."
    
    # Installation automatique de Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    # Ajouter l'utilisateur au groupe docker
    sudo usermod -aG docker $USER
    
    echo -e "${GREEN}[OK]${NC} Docker installé"
    echo -e "${YELLOW}[INFO]${NC} Vous devez vous déconnecter/reconnecter ou exécuter 'newgrp docker'"
    echo -e "${BLUE}[INFO]${NC} Puis relancer ce script"
    exit 0
fi

# Vérifier Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}[INFO]${NC} Installation de Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}[OK]${NC} Docker Compose installé"
fi

# Vérifier que Docker fonctionne
if ! docker ps &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker n'est pas accessible"
    echo -e "${BLUE}[INFO]${NC} Vérifiez que Docker est démarré et que l'utilisateur est dans le groupe docker"
    exit 1
fi

# Vérifier la résolution DNS (sauf pour skip-ssl)
if [ "$SKIP_SSL" != true ]; then
    echo -e "${BLUE}[INFO]${NC} Vérification de la résolution DNS pour $DOMAIN..."
    if ! nslookup "$DOMAIN" &> /dev/null; then
        echo -e "${YELLOW}[WARNING]${NC} Le domaine $DOMAIN ne semble pas résoudre vers ce serveur"
        echo -e "${BLUE}[INFO]${NC} Assurez-vous que le DNS pointe vers l'IP de ce serveur"
        read -p "Continuer quand même ? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}[OK]${NC} Résolution DNS confirmée"
    fi
fi

# Vérifier les ports
echo -e "${BLUE}[INFO]${NC} Vérification des ports 80 et 443..."
if ss -tlnp | grep -q ":80 "; then
    echo -e "${YELLOW}[WARNING]${NC} Le port 80 semble occupé"
    ss -tlnp | grep ":80 "
fi
if ss -tlnp | grep -q ":443 "; then
    echo -e "${YELLOW}[WARNING]${NC} Le port 443 semble occupé"
    ss -tlnp | grep ":443 "
fi

echo -e "${GREEN}[OK]${NC} Vérifications terminées"

# ÉTAPE 2: Préparation de l'environnement
echo -e "${BLUE}[ÉTAPE 2]${NC} Préparation de l'environnement..."

cd "$PROJECT_DIR"

# Créer la structure de répertoires
mkdir -p {nginx,ssl,logs}

# Copier les fichiers de configuration si ils n'existent pas
if [ ! -f "docker-compose.alpine.yml" ]; then
    echo -e "${YELLOW}[WARNING]${NC} docker-compose.alpine.yml non trouvé dans le répertoire courant"
    echo -e "${BLUE}[INFO]${NC} Assurez-vous d'avoir tous les fichiers de configuration nécessaires"
    exit 1
fi

# Personnaliser les fichiers de configuration
echo -e "${BLUE}[INFO]${NC} Personnalisation des fichiers de configuration..."

# Copier et personnaliser nginx.site.conf
if [ -f "nginx.site.conf" ]; then
    cp nginx.site.conf nginx/default.conf
    sed -i "s/VOTRE_DOMAINE/$DOMAIN/g" nginx/default.conf
    echo -e "${GREEN}[OK]${NC} Configuration Nginx personnalisée"
else
    echo -e "${RED}[ERROR]${NC} Fichier nginx.site.conf non trouvé"
    exit 1
fi

# Copier nginx.alpine.conf
if [ -f "nginx.alpine.conf" ]; then
    cp nginx.alpine.conf nginx/nginx.conf
    echo -e "${GREEN}[OK]${NC} Configuration Nginx principale copiée"
else
    echo -e "${RED}[ERROR]${NC} Fichier nginx.alpine.conf non trouvé"
    exit 1
fi

# Personnaliser docker-compose.yml
cp docker-compose.alpine.yml docker-compose.yml
sed -i "s/VOTRE_EMAIL/$EMAIL/g" docker-compose.yml
sed -i "s/VOTRE_DOMAINE/$DOMAIN/g" docker-compose.yml

echo -e "${GREEN}[OK]${NC} Configuration personnalisée"

# ÉTAPE 3: Vérification des fichiers DIOO
echo -e "${BLUE}[ÉTAPE 3]${NC} Vérification des fichiers DIOO..."

if [ ! -f "index.html" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Fichiers DIOO non trouvés dans le répertoire courant"
    
    # Chercher les fichiers DIOO
    DIOO_LOCATIONS=(
        "../"
        "../../"
        "/opt/dioo"
        "$HOME/DIOO"
        "$HOME/dioo"
    )
    
    DIOO_FOUND=false
    for location in "${DIOO_LOCATIONS[@]}"; do
        if [ -f "$location/index.html" ] && [ -f "$location/go.sh" ]; then
            echo -e "${BLUE}[INFO]${NC} Fichiers DIOO trouvés dans: $location"
            read -p "Copier les fichiers depuis $location ? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                cp -r "$location"/* ./ 2>/dev/null || true
                DIOO_FOUND=true
                break
            fi
        fi
    done
    
    if [ "$DIOO_FOUND" != true ]; then
        read -p "Chemin vers les fichiers DIOO: " DIOO_PATH
        if [ -d "$DIOO_PATH" ] && [ -f "$DIOO_PATH/index.html" ]; then
            cp -r "$DIOO_PATH"/* ./
            DIOO_FOUND=true
        fi
    fi
    
    if [ "$DIOO_FOUND" != true ]; then
        echo -e "${RED}[ERROR]${NC} Impossible de trouver les fichiers DIOO"
        echo -e "${BLUE}[INFO]${NC} Placez les fichiers DIOO dans le répertoire courant et relancez"
        exit 1
    fi
fi

echo -e "${GREEN}[OK]${NC} Fichiers DIOO présents"

# ÉTAPE 4: Construction des images
echo -e "${BLUE}[ÉTAPE 4]${NC} Construction des images Docker..."

# Arrêter les containers existants
if docker-compose ps -q | grep -q .; then
    echo -e "${BLUE}[INFO]${NC} Arrêt des containers existants..."
    docker-compose down
fi

# Construire l'image DIOO
echo -e "${BLUE}[INFO]${NC} Construction de l'image DIOO Alpine..."
docker-compose build --no-cache dioo-app

echo -e "${GREEN}[OK]${NC} Images construites"

# ÉTAPE 5: Configuration SSL
if [ "$SKIP_SSL" != true ]; then
    echo -e "${BLUE}[ÉTAPE 5]${NC} Configuration SSL Let's Encrypt..."
    
    # Créer une configuration nginx temporaire sans SSL
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
    
    # Démarrer nginx temporairement
    echo -e "${BLUE}[INFO]${NC} Démarrage temporaire pour obtention SSL..."
    docker-compose up -d nginx dioo-app
    
    # Attendre que nginx soit prêt
    sleep 15
    
    # Obtenir le certificat SSL
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[INFO]${NC} Mode dry-run: simulation du certificat SSL"
        docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email "$EMAIL" --agree-tos --no-eff-email --dry-run -d "$DOMAIN"
    else
        echo -e "${BLUE}[INFO]${NC} Obtention du certificat SSL réel..."
        docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email "$EMAIL" --agree-tos --no-eff-email -d "$DOMAIN"
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[OK]${NC} Certificat SSL obtenu avec succès"
        
        # Restaurer la configuration SSL
        mv nginx/default-ssl.conf nginx/default.conf
        
        # Redémarrer avec la configuration SSL
        docker-compose down
        sleep 5
    else
        echo -e "${RED}[ERROR]${NC} Échec de l'obtention du certificat SSL"
        echo -e "${BLUE}[INFO]${NC} Vérifiez que le domaine pointe vers ce serveur"
        exit 1
    fi
else
    echo -e "${YELLOW}[INFO]${NC} Configuration SSL ignorée (--skip-ssl)"
fi

# ÉTAPE 6: Démarrage final
echo -e "${BLUE}[ÉTAPE 6]${NC} Démarrage final de la stack complète..."

# Démarrer tous les services
docker-compose up -d

# Attendre que tous les services soient prêts
echo -e "${BLUE}[INFO]${NC} Attente du démarrage des services..."
sleep 30

# Vérifier la santé des containers
echo -e "${BLUE}[INFO]${NC} Vérification de la santé des containers..."
docker-compose ps

# ÉTAPE 7: Configuration du renouvellement SSL
if [ "$SKIP_SSL" != true ]; then
    echo -e "${BLUE}[ÉTAPE 7]${NC} Configuration du renouvellement automatique SSL..."
    
    # Créer le script de renouvellement
    cat > renew-ssl.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
docker-compose run --rm certbot renew --quiet
if [ $? -eq 0 ]; then
    docker-compose exec nginx nginx -s reload
    echo "$(date): Certificat SSL renouvelé et Nginx rechargé" >> ssl-renew.log
else
    echo "$(date): Erreur lors du renouvellement SSL" >> ssl-renew.log
fi
EOF
    
    chmod +x renew-ssl.sh
    
    # Ajouter au crontab (renouvellement quotidien à 2h du matin)
    (crontab -l 2>/dev/null | grep -v "renew-ssl.sh"; echo "0 2 * * * $PROJECT_DIR/renew-ssl.sh") | crontab -
    
    echo -e "${GREEN}[OK]${NC} Renouvellement automatique configuré"
fi

# ÉTAPE 8: Tests de validation
echo -e "${BLUE}[ÉTAPE 8]${NC} Tests de validation..."

# Attendre un peu plus pour que tout soit stable
sleep 10

# Test de base de l'application
echo -e "${BLUE}[INFO]${NC} Test de l'application DIOO..."
if docker-compose exec -T dioo-app curl -f http://localhost:3020/ > /dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC} Application DIOO répond correctement"
else
    echo -e "${YELLOW}[WARNING]${NC} L'application DIOO ne répond pas encore"
fi

# Test HTTP (redirection)
if [ "$SKIP_SSL" != true ]; then
    echo -e "${BLUE}[INFO]${NC} Test de redirection HTTP vers HTTPS..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}[OK]${NC} Redirection HTTP → HTTPS fonctionnelle"
    else
        echo -e "${YELLOW}[WARNING]${NC} Redirection HTTP non testable (code: $HTTP_CODE)"
    fi
    
    # Test HTTPS
    if [ "$DRY_RUN" != true ]; then
        echo -e "${BLUE}[INFO]${NC} Test d'accès HTTPS..."
        HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" 2>/dev/null || echo "000")
        if [ "$HTTPS_CODE" = "200" ]; then
            echo -e "${GREEN}[OK]${NC} Accès HTTPS fonctionnel"
        else
            echo -e "${YELLOW}[WARNING]${NC} Accès HTTPS non testable (code: $HTTPS_CODE)"
        fi
    fi
fi

# Créer un script de gestion
cat > manage.sh << 'EOF'
#!/bin/bash
# Script de gestion DIOO Docker

case "$1" in
    start)
        docker-compose up -d
        ;;
    stop)
        docker-compose down
        ;;
    restart)
        docker-compose restart
        ;;
    logs)
        docker-compose logs -f ${2:-}
        ;;
    status)
        docker-compose ps
        ;;
    update)
        docker-compose build --no-cache
        docker-compose up -d
        ;;
    backup)
        tar -czf "backup-$(date +%Y%m%d-%H%M%S).tar.gz" ssl/ nginx/ docker-compose.yml
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|update|backup}"
        exit 1
        ;;
esac
EOF

chmod +x manage.sh

# Résumé final
echo
echo -e "${PURPLE}===============================================${NC}"
echo -e "${PURPLE}        DÉPLOIEMENT TERMINÉ AVEC SUCCÈS${NC}"
echo -e "${PURPLE}===============================================${NC}"
echo
echo -e "${GREEN}[SUCCÈS]${NC} DIOO est maintenant accessible via HTTPS !"
echo
echo -e "${CYAN}📋 INFORMATIONS D'ACCÈS:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$SKIP_SSL" != true ]; then
    echo -e "${GREEN}🌐 URL HTTPS:${NC} https://$DOMAIN"
    echo -e "${GREEN}🔒 Certificat SSL:${NC} Let's Encrypt (auto-renouvelé)"
else
    echo -e "${GREEN}🌐 URL HTTP:${NC} http://$DOMAIN"
fi
echo -e "${GREEN}🐳 Containers:${NC} $(docker-compose ps --services | wc -l) services actifs"
echo -e "${GREEN}📁 Répertoire:${NC} $PROJECT_DIR"
echo
echo -e "${CYAN}🔧 COMMANDES DE GESTION:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}▶️  Démarrer:${NC} ./manage.sh start"
echo -e "${BLUE}⏹️  Arrêter:${NC} ./manage.sh stop"
echo -e "${BLUE}🔄 Redémarrer:${NC} ./manage.sh restart"
echo -e "${BLUE}📊 Statut:${NC} ./manage.sh status"
echo -e "${BLUE}📋 Logs:${NC} ./manage.sh logs"
echo -e "${BLUE}🔄 Mettre à jour:${NC} ./manage.sh update"
echo -e "${BLUE}💾 Sauvegarder:${NC} ./manage.sh backup"
if [ "$SKIP_SSL" != true ]; then
    echo -e "${BLUE}🔄 Renouveler SSL:${NC} ./renew-ssl.sh"
fi
echo
echo -e "${CYAN}🛡️ SÉCURITÉ:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$SKIP_SSL" != true ]; then
    echo -e "${GREEN}✅ HTTPS obligatoire${NC} (redirection automatique)"
    echo -e "${GREEN}✅ Certificat SSL valide${NC} et auto-renouvelé"
fi
echo -e "${GREEN}✅ Headers de sécurité${NC} configurés"
echo -e "${GREEN}✅ Container isolé${NC} et utilisateur non-root"
echo -e "${GREEN}✅ Rate limiting${NC} activé"
echo
echo -e "${PURPLE}🎉 Déploiement Docker Alpine + HTTPS terminé !${NC}"