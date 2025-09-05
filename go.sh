#!/bin/bash

# =============================================================================
# Script de lancement DIOO pour Linux/Ubuntu
# Description: Lance l'application DIOO sur le port 3020
# Auteur: Nicolas Steffan
# Version: 1.1.0 (Linux)
# =============================================================================

# Configuration
PORT=3020
APP_NAME="DIOO"
URL="http://localhost:$PORT"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo
echo "==============================================="
echo "         DIOO - Lancement de l'application"
echo "==============================================="
echo

# ETAPE 1: ARRETER LES SERVEURS EXISTANTS
echo -e "${BLUE}[ETAPE 1]${NC} Arrêt des serveurs existants..."
echo -e "${BLUE}[INFO]${NC} Recherche des processus sur le port $PORT..."

# Fonction d'arrêt des processus sur le port
PIDS=$(lsof -ti:$PORT 2>/dev/null)
if [ ! -z "$PIDS" ]; then
    for PID in $PIDS; do
        echo -e "${BLUE}[INFO]${NC} Arrêt du processus $PID..."
        if kill -9 $PID 2>/dev/null; then
            echo -e "${GREEN}[OK]${NC} Processus $PID arrêté"
        else
            echo -e "${YELLOW}[WARNING]${NC} Impossible d'arrêter le processus $PID"
        fi
    done
else
    echo -e "${GREEN}[OK]${NC} Aucun serveur actif sur le port $PORT"
fi

# Vérification finale
sleep 2
if lsof -ti:$PORT >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING]${NC} Des processus peuvent encore utiliser le port $PORT"
else
    echo -e "${GREEN}[OK]${NC} Aucun serveur actif sur le port $PORT"
fi

echo -e "${GREEN}[OK]${NC} Nettoyage terminé"
echo
echo "==============================================="

# ETAPE 2: VERIFICATION DES PREREQUIS
echo -e "${BLUE}[ETAPE 2]${NC} Vérification des prérequis..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js non détecté"
    echo -e "${BLUE}[INFO]${NC} Installation de Node.js..."
    
    # Installer Node.js sur Ubuntu
    if command -v apt &> /dev/null; then
        echo -e "${BLUE}[INFO]${NC} Installation via apt..."
        sudo apt update
        sudo apt install -y nodejs npm
    elif command -v snap &> /dev/null; then
        echo -e "${BLUE}[INFO]${NC} Installation via snap..."
        sudo snap install node --classic
    else
        echo -e "${RED}[ERROR]${NC} Impossible d'installer Node.js automatiquement"
        echo -e "${BLUE}[INFO]${NC} Veuillez installer Node.js manuellement:"
        echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
        echo "  sudo apt-get install -y nodejs"
        exit 1
    fi
fi

echo -e "${GREEN}[OK]${NC} Node.js détecté"
node --version

# Vérifier/installer http-server
echo -e "${BLUE}[INFO]${NC} Vérification de http-server..."
if ! npm list -g http-server &> /dev/null; then
    echo -e "${BLUE}[INFO]${NC} Installation de http-server..."
    if npm install -g http-server; then
        echo -e "${GREEN}[OK]${NC} http-server installé"
    else
        echo -e "${YELLOW}[WARNING]${NC} Installation globale échouée, tentative locale..."
        if npm install http-server; then
            echo -e "${GREEN}[OK]${NC} http-server installé localement"
            HTTP_SERVER="npx http-server"
        else
            echo -e "${RED}[ERROR]${NC} Échec de l'installation de http-server"
            manual_launch
        fi
    fi
else
    HTTP_SERVER="http-server"
fi

echo -e "${GREEN}[OK]${NC} http-server prêt"
echo
echo "==============================================="

# ETAPE 3: LANCEMENT DU SERVEUR
echo -e "${BLUE}[ETAPE 3]${NC} Lancement du serveur..."
echo -e "${BLUE}[INFO]${NC} Démarrage sur le port $PORT..."

# Lancer le serveur en arrière-plan
if [ -z "$HTTP_SERVER" ]; then
    HTTP_SERVER="http-server"
fi

nohup $HTTP_SERVER . -p $PORT -c-1 --cors --silent > /dev/null 2>&1 &
SERVER_PID=$!

# Attendre que le serveur démarre
echo -e "${BLUE}[INFO]${NC} Attente du démarrage du serveur..."
tentatives=0

while [ $tentatives -lt 10 ]; do
    tentatives=$((tentatives + 1))
    sleep 1
    
    if lsof -ti:$PORT >/dev/null 2>&1; then
        echo -e "${GREEN}[OK]${NC} Serveur démarré avec succès !"
        break
    fi
    
    echo -e "${BLUE}[INFO]${NC} Tentative $tentatives/10..."
done

if [ $tentatives -eq 10 ]; then
    echo -e "${RED}[ERROR]${NC} Le serveur n'a pas pu démarrer"
    manual_launch
fi

echo
echo "==============================================="
echo "           APPLICATION DIOO PRÊTE"
echo "==============================================="
echo
echo -e "${GREEN}[OK]${NC} Serveur lancé sur: $URL"
echo -e "${BLUE}[INFO]${NC} Ouverture du navigateur..."

# ETAPE 4: OUVERTURE DU NAVIGATEUR
echo -e "${BLUE}[ETAPE 4]${NC} Ouverture du navigateur..."

# Essayer différents navigateurs
if command -v google-chrome &> /dev/null; then
    echo -e "${BLUE}[INFO]${NC} Ouverture avec Google Chrome..."
    google-chrome "$URL" &> /dev/null &
    echo -e "${GREEN}[OK]${NC} Application ouverte dans Chrome"
elif command -v chromium-browser &> /dev/null; then
    echo -e "${BLUE}[INFO]${NC} Ouverture avec Chromium..."
    chromium-browser "$URL" &> /dev/null &
    echo -e "${GREEN}[OK]${NC} Application ouverte dans Chromium"
elif command -v firefox &> /dev/null; then
    echo -e "${BLUE}[INFO]${NC} Ouverture avec Firefox..."
    firefox "$URL" &> /dev/null &
    echo -e "${GREEN}[OK]${NC} Application ouverte dans Firefox"
elif command -v xdg-open &> /dev/null; then
    echo -e "${BLUE}[INFO]${NC} Ouverture avec le navigateur par défaut..."
    xdg-open "$URL" &> /dev/null &
    echo -e "${GREEN}[OK]${NC} Application ouverte dans le navigateur par défaut"
else
    echo -e "${YELLOW}[WARNING]${NC} Aucun navigateur détecté"
    echo -e "${BLUE}[INFO]${NC} Ouvrez manuellement: $URL"
fi

echo
echo "==============================================="
echo "              INFORMATIONS UTILES"
echo "==============================================="
echo
echo "URL de l'application: $URL"
echo "Port utilisé: $PORT"
echo "Répertoire: $(pwd)"
echo "Heure de lancement: $(date)"
echo "PID du serveur: $SERVER_PID"
echo
echo "Commandes utiles:"
echo "- Ctrl+C pour arrêter ce script"
echo "- kill $SERVER_PID pour arrêter le serveur"
echo "- F5 dans le navigateur pour actualiser"
echo "- Alt+1 : Module Chargement"
echo "- Alt+2 : Module Monitoring"
echo
echo "==============================================="
echo "             APPLICATION LANCÉE"
echo "==============================================="
echo
echo -e "${GREEN}[INFO]${NC} Le serveur fonctionne en arrière-plan (PID: $SERVER_PID)"
echo -e "${BLUE}[INFO]${NC} Pour arrêter le serveur: kill $SERVER_PID"
echo -e "${BLUE}[INFO]${NC} Ou utilisez: ./stop.sh"
echo

# Fonction de lancement manuel
manual_launch() {
    echo
    echo "==============================================="
    echo "            LANCEMENT MANUEL"
    echo "==============================================="
    echo
    echo "Impossible de lancer automatiquement."
    echo
    echo "Options manuelles:"
    echo "1. Installer Node.js puis relancer ce script"
    echo "2. Ouvrir index.html directement dans un navigateur"
    echo
    echo "URL locale: file://$(pwd)/index.html"
    echo
    exit 1
}

# Attendre l'interruption
echo -e "${BLUE}[INFO]${NC} Appuyez sur Ctrl+C pour arrêter le serveur et quitter"
trap "echo; echo -e '${BLUE}[INFO]${NC} Arrêt du serveur...'; kill $SERVER_PID 2>/dev/null; echo -e '${GREEN}[OK]${NC} Serveur arrêté'; exit 0" INT

# Boucle infinie pour maintenir le script actif
while true; do
    sleep 1
done