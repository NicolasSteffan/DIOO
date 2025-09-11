#!/bin/bash

# =============================================================================
# DIOO - Script de Connexion Client (Linux/Mac)
# Description: Connexion sécurisée via SSH Tunnel
# Usage: Remplacer les variables ci-dessous avec vos identifiants
# =============================================================================

# CONFIGURATION CLIENT - À PERSONNALISER
SERVER_HOST="dioo-server.entreprise.com"
USERNAME="votre-nom"
SSH_KEY="$HOME/DIOO-Access/dioo-access.key"
LOCAL_PORT=3020

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo
echo "==============================================="
echo "         DIOO - Connexion Client Sécurisée"
echo "==============================================="
echo

# Vérifier la présence de la clé SSH
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}[ERROR]${NC} Clé SSH non trouvée : $SSH_KEY"
    echo -e "${BLUE}[INFO]${NC} Contactez votre administrateur pour obtenir la clé"
    exit 1
fi

# Vérifier les permissions de la clé
chmod 600 "$SSH_KEY" 2>/dev/null

# Vérifier si le port local est libre
if lsof -ti:$LOCAL_PORT >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING]${NC} Port $LOCAL_PORT déjà utilisé"
    echo -e "${BLUE}[INFO]${NC} Fermeture des connexions existantes..."
    
    PIDS=$(lsof -ti:$LOCAL_PORT 2>/dev/null)
    if [ ! -z "$PIDS" ]; then
        for PID in $PIDS; do
            kill -9 $PID 2>/dev/null
        done
    fi
    sleep 2
fi

echo -e "${BLUE}[INFO]${NC} Connexion au serveur DIOO..."
echo -e "${BLUE}[INFO]${NC} Serveur: $SERVER_HOST"
echo -e "${BLUE}[INFO]${NC} Utilisateur: $USERNAME"
echo -e "${BLUE}[INFO]${NC} Port local: $LOCAL_PORT"
echo

# Créer le tunnel SSH en arrière-plan
echo -e "${BLUE}[INFO]${NC} Établissement du tunnel sécurisé..."
ssh -i "$SSH_KEY" -L $LOCAL_PORT:localhost:3020 -N -f $USERNAME@$SERVER_HOST

# Vérifier que le tunnel est établi
echo -e "${BLUE}[INFO]${NC} Vérification de la connexion..."
tentatives=0

while [ $tentatives -lt 10 ]; do
    tentatives=$((tentatives + 1))
    sleep 2
    
    if lsof -ti:$LOCAL_PORT >/dev/null 2>&1; then
        echo -e "${GREEN}[OK]${NC} Tunnel SSH établi avec succès !"
        break
    fi
    
    echo -e "${BLUE}[INFO]${NC} Tentative $tentatives/10..."
done

if [ $tentatives -eq 10 ]; then
    echo -e "${RED}[ERROR]${NC} Impossible d'établir le tunnel SSH"
    echo -e "${BLUE}[INFO]${NC} Vérifiez votre connexion internet et contactez l'administrateur"
    exit 1
fi

echo
echo "==============================================="
echo "           DIOO - Accès Sécurisé Prêt"
echo "==============================================="
echo

URL="http://localhost:$LOCAL_PORT"
echo -e "${GREEN}[OK]${NC} Application DIOO accessible sur: $URL"
echo -e "${BLUE}[INFO]${NC} Ouverture automatique du navigateur..."

# Ouvrir le navigateur
if command -v google-chrome &> /dev/null; then
    google-chrome "$URL" &> /dev/null &
elif command -v chromium-browser &> /dev/null; then
    chromium-browser "$URL" &> /dev/null &
elif command -v firefox &> /dev/null; then
    firefox "$URL" &> /dev/null &
elif command -v open &> /dev/null; then  # macOS
    open "$URL"
elif command -v xdg-open &> /dev/null; then  # Linux
    xdg-open "$URL" &> /dev/null &
else
    echo -e "${YELLOW}[INFO]${NC} Ouvrez manuellement: $URL"
fi

echo
echo "==============================================="
echo "              INFORMATIONS CLIENT"
echo "==============================================="
echo
echo "URL d'accès: $URL"
echo "Serveur distant: $SERVER_HOST"
echo "Utilisateur: $USERNAME"
echo "Connexion établie: $(date)"
echo
echo "IMPORTANT:"
echo "- Gardez ce terminal ouvert pendant votre session"
echo "- Appuyez sur Ctrl+C pour déconnecter"
echo "- En cas de problème, contactez l'administrateur"
echo
echo "==============================================="
echo "         Session DIOO Active - Ne pas fermer"
echo "==============================================="
echo

# Fonction de nettoyage à la fermeture
cleanup() {
    echo
    echo -e "${BLUE}[INFO]${NC} Fermeture de la session DIOO..."
    
    # Tuer les processus SSH tunnel
    PIDS=$(lsof -ti:$LOCAL_PORT 2>/dev/null)
    if [ ! -z "$PIDS" ]; then
        for PID in $PIDS; do
            kill $PID 2>/dev/null
        done
    fi
    
    # Tuer les processus SSH spécifiques
    pkill -f "ssh.*$USERNAME@$SERVER_HOST" 2>/dev/null
    
    echo -e "${GREEN}[OK]${NC} Session fermée proprement"
    exit 0
}

# Capturer Ctrl+C pour nettoyage
trap cleanup INT

# Maintenir la connexion active et surveiller
echo -e "${BLUE}[INFO]${NC} Session active - Appuyez sur Ctrl+C pour déconnecter"

while true; do
    sleep 30
    
    # Vérifier que le tunnel est toujours actif
    if ! lsof -ti:$LOCAL_PORT >/dev/null 2>&1; then
        echo -e "${YELLOW}[WARNING]${NC} Connexion perdue - Tentative de reconnexion..."
        
        # Relancer le tunnel
        ssh -i "$SSH_KEY" -L $LOCAL_PORT:localhost:3020 -N -f $USERNAME@$SERVER_HOST
        sleep 5
        
        if lsof -ti:$LOCAL_PORT >/dev/null 2>&1; then
            echo -e "${GREEN}[OK]${NC} Reconnexion réussie"
        else
            echo -e "${RED}[ERROR]${NC} Impossible de se reconnecter"
            echo -e "${BLUE}[INFO]${NC} Contactez l'administrateur"
            break
        fi
    fi
done