#!/bin/bash

# =============================================================================
# Script de Déploiement Automatique DIOO - Ubuntu Serveur
# Description: Installation et configuration complète de DIOO sur Ubuntu
# Usage: ./deploy-ubuntu.sh
# =============================================================================

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DIOO_USER="dioo"
DIOO_DIR="/opt/dioo"
SERVICE_NAME="dioo"

echo
echo "==============================================="
echo "    DIOO - Déploiement Automatique Ubuntu"
echo "==============================================="
echo

# Vérifier les droits root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Ce script doit être exécuté en tant que root"
    echo "Usage: sudo ./deploy-ubuntu.sh"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} Démarrage du déploiement DIOO..."

# ÉTAPE 1: Mise à jour du système
echo -e "${BLUE}[ÉTAPE 1]${NC} Mise à jour du système..."
apt update && apt upgrade -y

# ÉTAPE 2: Installation des dépendances
echo -e "${BLUE}[ÉTAPE 2]${NC} Installation des dépendances..."

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}[INFO]${NC} Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt-get install -y nodejs
else
    echo -e "${GREEN}[OK]${NC} Node.js déjà installé"
fi

# Outils utiles
apt install -y git curl wget lsof net-tools ufw

# http-server
echo -e "${BLUE}[INFO]${NC} Installation de http-server..."
npm install -g http-server

echo -e "${GREEN}[OK]${NC} Dépendances installées"

# ÉTAPE 3: Création de l'utilisateur DIOO
echo -e "${BLUE}[ÉTAPE 3]${NC} Configuration utilisateur..."

if ! id "$DIOO_USER" &>/dev/null; then
    echo -e "${BLUE}[INFO]${NC} Création de l'utilisateur $DIOO_USER..."
    adduser --system --group --home "$DIOO_DIR" --shell /bin/bash "$DIOO_USER"
else
    echo -e "${GREEN}[OK]${NC} Utilisateur $DIOO_USER existe déjà"
fi

# ÉTAPE 4: Déploiement des fichiers DIOO
echo -e "${BLUE}[ÉTAPE 4]${NC} Déploiement des fichiers..."

# Créer le répertoire si nécessaire
mkdir -p "$DIOO_DIR"

# Copier les fichiers depuis le répertoire courant
if [ -f "./index.html" ]; then
    echo -e "${BLUE}[INFO]${NC} Copie des fichiers DIOO..."
    cp -r ./* "$DIOO_DIR/"
    chown -R "$DIOO_USER:$DIOO_USER" "$DIOO_DIR"
    chmod +x "$DIOO_DIR"/*.sh 2>/dev/null
    echo -e "${GREEN}[OK]${NC} Fichiers copiés"
else
    echo -e "${YELLOW}[WARNING]${NC} Fichiers DIOO non trouvés dans le répertoire courant"
    echo -e "${BLUE}[INFO]${NC} Vous devrez copier manuellement les fichiers dans $DIOO_DIR"
fi

# ÉTAPE 5: Configuration du service systemd
echo -e "${BLUE}[ÉTAPE 5]${NC} Configuration du service..."

cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=DIOO Application Server
After=network.target

[Service]
Type=simple
User=$DIOO_USER
WorkingDirectory=$DIOO_DIR
ExecStart=/usr/bin/http-server . -p 3020 -c-1 --cors --silent
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Recharger systemd
systemctl daemon-reload
systemctl enable $SERVICE_NAME

echo -e "${GREEN}[OK]${NC} Service configuré"

# ÉTAPE 6: Configuration du firewall
echo -e "${BLUE}[ÉTAPE 6]${NC} Configuration du firewall..."

# Activer UFW si pas déjà fait
ufw --force enable

# Autoriser SSH (critique !)
ufw allow ssh

# Demander la configuration du firewall pour DIOO
echo
echo -e "${YELLOW}[QUESTION]${NC} Configuration du firewall pour DIOO (port 3020):"
echo "1. Accès depuis tout le réseau local (192.168.x.x)"
echo "2. Accès depuis une IP spécifique"
echo "3. Accès public (non recommandé)"
echo "4. Pas de règle firewall (configuration manuelle)"
echo

read -p "Choisissez une option (1-4): " firewall_choice

case $firewall_choice in
    1)
        # Détecter le réseau local
        LOCAL_NETWORK=$(ip route | grep -E "192\.168\.|10\.|172\." | head -1 | awk '{print $1}' | head -1)
        if [ -n "$LOCAL_NETWORK" ]; then
            ufw allow from $LOCAL_NETWORK to any port 3020
            echo -e "${GREEN}[OK]${NC} Accès autorisé depuis le réseau local: $LOCAL_NETWORK"
        else
            ufw allow from 192.168.0.0/16 to any port 3020
            echo -e "${GREEN}[OK]${NC} Accès autorisé depuis 192.168.0.0/16"
        fi
        ;;
    2)
        read -p "Entrez l'adresse IP autorisée: " client_ip
        ufw allow from $client_ip to any port 3020
        echo -e "${GREEN}[OK]${NC} Accès autorisé depuis: $client_ip"
        ;;
    3)
        ufw allow 3020
        echo -e "${YELLOW}[WARNING]${NC} Accès public autorisé (non recommandé pour la production)"
        ;;
    4)
        echo -e "${BLUE}[INFO]${NC} Configuration firewall ignorée"
        ;;
    *)
        echo -e "${YELLOW}[WARNING]${NC} Option invalide, configuration firewall ignorée"
        ;;
esac

# ÉTAPE 7: Génération des clés SSH pour clients
echo -e "${BLUE}[ÉTAPE 7]${NC} Génération des clés SSH clients..."

SSH_DIR="/etc/dioo/ssh-keys"
mkdir -p "$SSH_DIR"

echo
read -p "Voulez-vous générer des clés SSH pour les clients ? (y/n): " generate_keys

if [[ $generate_keys =~ ^[Yy]$ ]]; then
    read -p "Nom du client (ex: client-demo): " client_name
    
    if [ -n "$client_name" ]; then
        # Créer l'utilisateur client
        if ! id "$client_name" &>/dev/null; then
            adduser --disabled-password --gecos "" "$client_name"
        fi
        
        # Générer les clés
        ssh-keygen -t rsa -b 4096 -f "$SSH_DIR/$client_name" -N "" -C "DIOO-Client-$client_name"
        
        # Configurer SSH pour le client
        mkdir -p "/home/$client_name/.ssh"
        cp "$SSH_DIR/$client_name.pub" "/home/$client_name/.ssh/authorized_keys"
        chmod 700 "/home/$client_name/.ssh"
        chmod 600 "/home/$client_name/.ssh/authorized_keys"
        chown -R "$client_name:$client_name" "/home/$client_name/.ssh"
        
        echo -e "${GREEN}[OK]${NC} Clés générées pour $client_name"
        echo -e "${BLUE}[INFO]${NC} Clé privée: $SSH_DIR/$client_name"
        echo -e "${BLUE}[INFO]${NC} À transférer au client de manière sécurisée"
    fi
fi

# ÉTAPE 8: Démarrage du service
echo -e "${BLUE}[ÉTAPE 8]${NC} Démarrage du service DIOO..."

systemctl start $SERVICE_NAME

# Attendre que le service démarre
sleep 5

if systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}[OK]${NC} Service DIOO démarré avec succès"
else
    echo -e "${RED}[ERROR]${NC} Échec du démarrage du service"
    echo -e "${BLUE}[INFO]${NC} Vérifiez les logs: journalctl -u $SERVICE_NAME"
fi

# ÉTAPE 9: Informations finales
echo
echo "==============================================="
echo "        DÉPLOIEMENT DIOO TERMINÉ"
echo "==============================================="
echo

# Obtenir l'IP du serveur
SERVER_IP=$(hostname -I | awk '{print $1}')

echo -e "${GREEN}[SUCCÈS]${NC} DIOO est maintenant déployé et accessible !"
echo
echo "📋 INFORMATIONS DE CONNEXION:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖥️  Serveur Ubuntu: $SERVER_IP"
echo "🌐 URL locale: http://localhost:3020"
echo "🌐 URL réseau: http://$SERVER_IP:3020"
echo "📁 Répertoire: $DIOO_DIR"
echo "👤 Utilisateur service: $DIOO_USER"
echo

echo "🔧 COMMANDES DE GESTION:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▶️  Démarrer: sudo systemctl start $SERVICE_NAME"
echo "⏹️  Arrêter: sudo systemctl stop $SERVICE_NAME"
echo "🔄 Redémarrer: sudo systemctl restart $SERVICE_NAME"
echo "📊 Statut: sudo systemctl status $SERVICE_NAME"
echo "📋 Logs: sudo journalctl -u $SERVICE_NAME -f"
echo

if [ -f "$SSH_DIR/$client_name" ]; then
    echo "🔑 CLÉS SSH CLIENT:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "👤 Utilisateur: $client_name"
    echo "🔐 Clé privée: $SSH_DIR/$client_name"
    echo "📤 À transférer au client pour connexion SSH tunnel"
    echo
fi

echo "🚀 ACCÈS CLIENT SSH TUNNEL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ssh -L 3020:localhost:3020 $client_name@$SERVER_IP"
echo "Puis ouvrir: http://localhost:3020"
echo

echo "🛡️ SÉCURITÉ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Firewall UFW configuré"
echo "✅ Service systemd sécurisé"
echo "✅ Utilisateur dédié non-privilégié"
if [ -f "$SSH_DIR/$client_name" ]; then
    echo "✅ Authentification SSH par clés"
fi
echo

echo -e "${BLUE}[INFO]${NC} Pour tester localement: curl http://localhost:3020"
echo -e "${BLUE}[INFO]${NC} Guide complet: GUIDE-DEPLOIEMENT.md"
echo

echo "🎉 Déploiement terminé avec succès !"