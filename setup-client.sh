#!/bin/bash

# =============================================================================
# Script de Configuration Client DIOO - Linux/Mac
# Description: Configuration automatique de l'accès SSH tunnel
# Usage: ./setup-client.sh [SERVER_IP] [USERNAME]
# =============================================================================

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut
DEFAULT_SERVER="192.168.1.100"
DEFAULT_USER="client-demo"
INSTALL_DIR="$HOME/DIOO-Access"

echo
echo "==============================================="
echo "     DIOO - Configuration Client Linux/Mac"
echo "==============================================="
echo

# Vérifier les paramètres
if [ -z "$1" ]; then
    read -p "Adresse IP du serveur DIOO [$DEFAULT_SERVER]: " SERVER_IP
    SERVER_IP=${SERVER_IP:-$DEFAULT_SERVER}
else
    SERVER_IP="$1"
fi

if [ -z "$2" ]; then
    read -p "Nom d'utilisateur SSH [$DEFAULT_USER]: " USERNAME
    USERNAME=${USERNAME:-$DEFAULT_USER}
else
    USERNAME="$2"
fi

echo
echo -e "${BLUE}[INFO]${NC} Configuration:"
echo "  Serveur: $SERVER_IP"
echo "  Utilisateur: $USERNAME"
echo "  Dossier: $INSTALL_DIR"
echo

# ÉTAPE 1: Créer le dossier d'installation
echo -e "${BLUE}[ÉTAPE 1]${NC} Création du dossier d'installation..."

if [ ! -d "$INSTALL_DIR" ]; then
    mkdir -p "$INSTALL_DIR"
    echo -e "${GREEN}[OK]${NC} Dossier créé: $INSTALL_DIR"
else
    echo -e "${GREEN}[OK]${NC} Dossier existe déjà: $INSTALL_DIR"
fi

# Sécuriser les permissions
chmod 700 "$INSTALL_DIR"

# ÉTAPE 2: Vérifier SSH
echo
echo -e "${BLUE}[ÉTAPE 2]${NC} Vérification de SSH..."

if command -v ssh &> /dev/null; then
    echo -e "${GREEN}[OK]${NC} SSH Client détecté"
else
    echo -e "${RED}[ERROR]${NC} SSH Client non détecté"
    
    # Détecter l'OS et proposer l'installation
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "${BLUE}[INFO]${NC} Sur macOS, SSH est normalement préinstallé"
        echo -e "${BLUE}[INFO]${NC} Essayez: xcode-select --install"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${BLUE}[INFO]${NC} Installation SSH sur Linux:"
        echo "  Ubuntu/Debian: sudo apt install openssh-client"
        echo "  CentOS/RHEL: sudo yum install openssh-clients"
        echo "  Arch: sudo pacman -S openssh"
    fi
    
    read -p "Continuer malgré tout ? (y/n): " continue_anyway
    if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# ÉTAPE 3: Créer le script de connexion personnalisé
echo
echo -e "${BLUE}[ÉTAPE 3]${NC} Création du script de connexion..."

CONNECT_SCRIPT="$INSTALL_DIR/connect-dioo.sh"

cat > "$CONNECT_SCRIPT" << EOF
#!/bin/bash

# =============================================================================
# DIOO - Script de Connexion Client Personnalisé
# Généré automatiquement par setup-client.sh
# =============================================================================

# Configuration personnalisée
SERVER_HOST="$SERVER_IP"
USERNAME="$USERNAME"
SSH_KEY="$INSTALL_DIR/dioo-key.pem"
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
if [ ! -f "\$SSH_KEY" ]; then
    echo -e "\${RED}[ERROR]\${NC} Clé SSH non trouvée : \$SSH_KEY"
    echo -e "\${BLUE}[INFO]\${NC} Contactez votre administrateur pour obtenir la clé"
    echo -e "\${BLUE}[INFO]\${NC} La clé doit être placée dans : \$SSH_KEY"
    exit 1
fi

# Vérifier les permissions de la clé
chmod 600 "\$SSH_KEY" 2>/dev/null

# Vérifier si le port local est libre
if lsof -ti:\$LOCAL_PORT >/dev/null 2>&1; then
    echo -e "\${YELLOW}[WARNING]\${NC} Port \$LOCAL_PORT déjà utilisé"
    echo -e "\${BLUE}[INFO]\${NC} Fermeture des connexions existantes..."
    
    PIDS=\$(lsof -ti:\$LOCAL_PORT 2>/dev/null)
    if [ ! -z "\$PIDS" ]; then
        for PID in \$PIDS; do
            kill -9 \$PID 2>/dev/null
        done
    fi
    sleep 2
fi

echo -e "\${BLUE}[INFO]\${NC} Connexion au serveur DIOO..."
echo -e "\${BLUE}[INFO]\${NC} Serveur: \$SERVER_HOST"
echo -e "\${BLUE}[INFO]\${NC} Utilisateur: \$USERNAME"
echo -e "\${BLUE}[INFO]\${NC} Port local: \$LOCAL_PORT"
echo

# Créer le tunnel SSH en arrière-plan
echo -e "\${BLUE}[INFO]\${NC} Établissement du tunnel sécurisé..."
ssh -i "\$SSH_KEY" -L \$LOCAL_PORT:localhost:3020 -N -f \$USERNAME@\$SERVER_HOST

# Vérifier que le tunnel est établi
echo -e "\${BLUE}[INFO]\${NC} Vérification de la connexion..."
tentatives=0

while [ \$tentatives -lt 10 ]; do
    tentatives=\$((tentatives + 1))
    sleep 2
    
    if lsof -ti:\$LOCAL_PORT >/dev/null 2>&1; then
        echo -e "\${GREEN}[OK]\${NC} Tunnel SSH établi avec succès !"
        break
    fi
    
    echo -e "\${BLUE}[INFO]\${NC} Tentative \$tentatives/10..."
done

if [ \$tentatives -eq 10 ]; then
    echo -e "\${RED}[ERROR]\${NC} Impossible d'établir le tunnel SSH"
    echo -e "\${BLUE}[INFO]\${NC} Vérifiez votre connexion internet et contactez l'administrateur"
    exit 1
fi

echo
echo "==============================================="
echo "           DIOO - Accès Sécurisé Prêt"
echo "==============================================="
echo

URL="http://localhost:\$LOCAL_PORT"
echo -e "\${GREEN}[OK]\${NC} Application DIOO accessible sur: \$URL"
echo -e "\${BLUE}[INFO]\${NC} Ouverture automatique du navigateur..."

# Ouvrir le navigateur
if command -v google-chrome &> /dev/null; then
    google-chrome "\$URL" &> /dev/null &
elif command -v chromium-browser &> /dev/null; then
    chromium-browser "\$URL" &> /dev/null &
elif command -v firefox &> /dev/null; then
    firefox "\$URL" &> /dev/null &
elif command -v open &> /dev/null; then  # macOS
    open "\$URL"
elif command -v xdg-open &> /dev/null; then  # Linux
    xdg-open "\$URL" &> /dev/null &
else
    echo -e "\${YELLOW}[INFO]\${NC} Ouvrez manuellement: \$URL"
fi

echo
echo "==============================================="
echo "              INFORMATIONS CLIENT"
echo "==============================================="
echo
echo "URL d'accès: \$URL"
echo "Serveur distant: \$SERVER_HOST"
echo "Utilisateur: \$USERNAME"
echo "Connexion établie: \$(date)"
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
    echo -e "\${BLUE}[INFO]\${NC} Fermeture de la session DIOO..."
    
    # Tuer les processus SSH tunnel
    PIDS=\$(lsof -ti:\$LOCAL_PORT 2>/dev/null)
    if [ ! -z "\$PIDS" ]; then
        for PID in \$PIDS; do
            kill \$PID 2>/dev/null
        done
    fi
    
    # Tuer les processus SSH spécifiques
    pkill -f "ssh.*\$USERNAME@\$SERVER_HOST" 2>/dev/null
    
    echo -e "\${GREEN}[OK]\${NC} Session fermée proprement"
    exit 0
}

# Capturer Ctrl+C pour nettoyage
trap cleanup INT

# Maintenir la connexion active et surveiller
echo -e "\${BLUE}[INFO]\${NC} Session active - Appuyez sur Ctrl+C pour déconnecter"

while true; do
    sleep 30
    
    # Vérifier que le tunnel est toujours actif
    if ! lsof -ti:\$LOCAL_PORT >/dev/null 2>&1; then
        echo -e "\${YELLOW}[WARNING]\${NC} Connexion perdue - Tentative de reconnexion..."
        
        # Relancer le tunnel
        ssh -i "\$SSH_KEY" -L \$LOCAL_PORT:localhost:3020 -N -f \$USERNAME@\$SERVER_HOST
        sleep 5
        
        if lsof -ti:\$LOCAL_PORT >/dev/null 2>&1; then
            echo -e "\${GREEN}[OK]\${NC} Reconnexion réussie"
        else
            echo -e "\${RED}[ERROR]\${NC} Impossible de se reconnecter"
            echo -e "\${BLUE}[INFO]\${NC} Contactez l'administrateur"
            break
        fi
    fi
done
EOF

# Rendre le script exécutable
chmod +x "$CONNECT_SCRIPT"
echo -e "${GREEN}[OK]${NC} Script de connexion créé: $CONNECT_SCRIPT"

# ÉTAPE 4: Créer un fichier d'instructions
echo
echo -e "${BLUE}[ÉTAPE 4]${NC} Création du fichier d'instructions..."

INSTRUCTIONS="$INSTALL_DIR/INSTRUCTIONS.txt"

cat > "$INSTRUCTIONS" << EOF
===============================================
     DIOO - Instructions d'Installation Client
===============================================

CONFIGURATION AUTOMATIQUE TERMINÉE

Serveur DIOO: $SERVER_IP
Utilisateur SSH: $USERNAME
Dossier d'installation: $INSTALL_DIR

PROCHAINES ÉTAPES:

1. RECEVOIR LA CLÉ SSH
   - Contactez votre administrateur
   - Demandez la clé SSH privée pour l'utilisateur: $USERNAME
   - Placez la clé dans: $INSTALL_DIR/dioo-key.pem
   - Sécurisez les permissions: chmod 600 $INSTALL_DIR/dioo-key.pem

2. TESTER LA CONNEXION
   - Exécutez: $CONNECT_SCRIPT
   - Le navigateur doit s'ouvrir automatiquement sur DIOO

3. CRÉER UN ALIAS (OPTIONNEL)
   - Ajoutez à votre ~/.bashrc ou ~/.zshrc:
     alias dioo='$CONNECT_SCRIPT'
   - Puis rechargez: source ~/.bashrc
   - Utilisez simplement: dioo

DÉPANNAGE:

- Si "Permission denied": Vérifiez que la clé SSH est correcte
  chmod 600 $INSTALL_DIR/dioo-key.pem
- Si "Connection refused": Vérifiez l'adresse IP du serveur
- Si "Port already in use": Fermez les autres connexions DIOO
  lsof -ti:3020 | xargs kill -9

SUPPORT:
Contactez votre administrateur système en cas de problème.

===============================================
Configuration générée le: $(date)
===============================================
EOF

echo -e "${GREEN}[OK]${NC} Instructions créées: $INSTRUCTIONS"

# ÉTAPE 5: Créer un alias (optionnel)
echo
echo -e "${BLUE}[ÉTAPE 5]${NC} Configuration de l'alias..."

read -p "Créer un alias 'dioo' pour la connexion rapide ? (y/n) [y]: " CREATE_ALIAS
CREATE_ALIAS=${CREATE_ALIAS:-y}

if [[ $CREATE_ALIAS =~ ^[Yy]$ ]]; then
    # Détecter le shell
    if [ -n "$ZSH_VERSION" ]; then
        SHELL_RC="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        SHELL_RC="$HOME/.bashrc"
    else
        SHELL_RC="$HOME/.profile"
    fi
    
    # Ajouter l'alias s'il n'existe pas déjà
    if ! grep -q "alias dioo=" "$SHELL_RC" 2>/dev/null; then
        echo "" >> "$SHELL_RC"
        echo "# DIOO - Alias de connexion sécurisée" >> "$SHELL_RC"
        echo "alias dioo='$CONNECT_SCRIPT'" >> "$SHELL_RC"
        echo -e "${GREEN}[OK]${NC} Alias ajouté à $SHELL_RC"
        echo -e "${BLUE}[INFO]${NC} Rechargez votre shell: source $SHELL_RC"
        echo -e "${BLUE}[INFO]${NC} Puis utilisez simplement: dioo"
    else
        echo -e "${YELLOW}[INFO]${NC} Alias 'dioo' existe déjà dans $SHELL_RC"
    fi
else
    echo -e "${BLUE}[INFO]${NC} Alias ignoré"
fi

# ÉTAPE 6: Créer un lanceur desktop (Linux uniquement)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo
    echo -e "${BLUE}[ÉTAPE 6]${NC} Création du lanceur desktop..."
    
    read -p "Créer un lanceur desktop ? (y/n) [y]: " CREATE_DESKTOP
    CREATE_DESKTOP=${CREATE_DESKTOP:-y}
    
    if [[ $CREATE_DESKTOP =~ ^[Yy]$ ]]; then
        DESKTOP_FILE="$HOME/Desktop/DIOO-Access.desktop"
        
        cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=DIOO - Accès Sécurisé
Comment=Connexion sécurisée à DIOO via SSH Tunnel
Exec=gnome-terminal -- $CONNECT_SCRIPT
Icon=network-server
Terminal=true
Categories=Network;
EOF
        
        chmod +x "$DESKTOP_FILE"
        echo -e "${GREEN}[OK]${NC} Lanceur desktop créé: $DESKTOP_FILE"
    else
        echo -e "${BLUE}[INFO]${NC} Lanceur desktop ignoré"
    fi
fi

# Résumé final
echo
echo "==============================================="
echo "        CONFIGURATION CLIENT TERMINÉE"
echo "==============================================="
echo
echo -e "${GREEN}[SUCCÈS]${NC} Configuration terminée avec succès !"
echo
echo -e "${BLUE}FICHIERS CRÉÉS:${NC}"
echo "  Script de connexion: $CONNECT_SCRIPT"
echo "  Instructions: $INSTRUCTIONS"
if [[ $CREATE_ALIAS =~ ^[Yy]$ ]]; then
    echo "  Alias 'dioo' ajouté au shell"
fi
if [[ "$OSTYPE" == "linux-gnu"* ]] && [[ $CREATE_DESKTOP =~ ^[Yy]$ ]]; then
    echo "  Lanceur desktop: $HOME/Desktop/DIOO-Access.desktop"
fi
echo
echo -e "${YELLOW}PROCHAINE ÉTAPE:${NC}"
echo "  1. Recevez la clé SSH de votre administrateur"
echo "  2. Placez-la dans: $INSTALL_DIR/dioo-key.pem"
echo "  3. Sécurisez-la: chmod 600 $INSTALL_DIR/dioo-key.pem"
echo "  4. Exécutez: $CONNECT_SCRIPT"
if [[ $CREATE_ALIAS =~ ^[Yy]$ ]]; then
    echo "     Ou simplement: dioo (après rechargement du shell)"
fi
echo
echo -e "${BLUE}[INFO]${NC} Consultez $INSTRUCTIONS pour plus de détails"
echo

# Ouvrir le dossier d'installation
read -p "Ouvrir le dossier d'installation ? (y/n) [y]: " OPEN_FOLDER
OPEN_FOLDER=${OPEN_FOLDER:-y}

if [[ $OPEN_FOLDER =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "$INSTALL_DIR" &> /dev/null &
    elif command -v open &> /dev/null; then  # macOS
        open "$INSTALL_DIR"
    else
        echo -e "${BLUE}[INFO]${NC} Dossier: $INSTALL_DIR"
    fi
fi

echo
echo -e "${GREEN}🎉 Configuration terminée avec succès !${NC}"