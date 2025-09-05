#!/bin/bash

# =============================================================================
# Script d'arrêt DIOO pour Linux/Ubuntu
# Description: Arrête l'application DIOO sur le port 3020
# Auteur: Nicolas Steffan
# Version: 1.0.0 (Linux)
# =============================================================================

# Configuration
PORT=3020

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo
echo "==============================================="
echo "         DIOO - Arrêt de l'application"
echo "==============================================="
echo

echo -e "${BLUE}[INFO]${NC} Recherche des processus sur le port $PORT..."

# Trouver et arrêter les processus sur le port
PIDS=$(lsof -ti:$PORT 2>/dev/null)

if [ ! -z "$PIDS" ]; then
    echo -e "${BLUE}[INFO]${NC} Processus trouvés: $PIDS"
    
    for PID in $PIDS; do
        # Obtenir des informations sur le processus
        PROCESS_INFO=$(ps -p $PID -o comm= 2>/dev/null)
        
        echo -e "${BLUE}[INFO]${NC} Arrêt du processus $PID ($PROCESS_INFO)..."
        
        # Tentative d'arrêt propre avec SIGTERM
        if kill $PID 2>/dev/null; then
            sleep 2
            # Vérifier si le processus est toujours actif
            if kill -0 $PID 2>/dev/null; then
                echo -e "${YELLOW}[WARNING]${NC} Processus $PID résistant, arrêt forcé..."
                kill -9 $PID 2>/dev/null
            fi
            echo -e "${GREEN}[OK]${NC} Processus $PID arrêté"
        else
            echo -e "${YELLOW}[WARNING]${NC} Impossible d'arrêter le processus $PID"
        fi
    done
else
    echo -e "${GREEN}[OK]${NC} Aucun processus trouvé sur le port $PORT"
fi

# Vérification finale
sleep 1
if lsof -ti:$PORT >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING]${NC} Certains processus utilisent encore le port $PORT"
    echo -e "${BLUE}[INFO]${NC} Processus restants:"
    lsof -i:$PORT 2>/dev/null
else
    echo -e "${GREEN}[OK]${NC} Port $PORT libéré avec succès"
fi

echo
echo "==============================================="
echo "              ARRÊT TERMINÉ"
echo "==============================================="
echo