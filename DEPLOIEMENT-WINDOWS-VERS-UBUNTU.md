# 🚀 Déploiement DIOO - Depuis Windows (Cursor) vers Ubuntu

## 📋 Contexte de Déploiement

**Environnement de développement :**
- Windows avec Cursor IDE
- Projet DIOO développé localement

**Environnement de production :**
- Machine Ubuntu distante
- Docker Alpine + Nginx + HTTPS
- Accès client via lien HTTPS

---

## 🎯 Processus de Déploiement

### **Phase 1 : Préparation sur Windows (Cursor)**
### **Phase 2 : Transfert vers Ubuntu**
### **Phase 3 : Déploiement sur Ubuntu**

---

## 💻 PHASE 1 : PRÉPARATION SUR WINDOWS

### **📁 Structure de Déploiement**

Créez cette structure dans votre projet DIOO :

```
Z:\YESDATA_AI\PROJETS\CLIENTS\AIRBUS\DIOO\
├── deployment/
│   ├── Dockerfile.alpine
│   ├── docker-compose.alpine.yml
│   ├── nginx.alpine.conf
│   ├── nginx.site.conf
│   ├── deploy-alpine.sh
│   └── README-DEPLOYMENT.md
├── [fichiers DIOO existants]
└── [autres fichiers du projet]
```

### **🔧 Création du Package de Déploiement**

Créez un script PowerShell pour préparer le déploiement :

```powershell
# create-deployment-package.ps1
$deploymentDir = "deployment"
$packageName = "dioo-docker-alpine-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Créer le dossier de déploiement s'il n'existe pas
if (!(Test-Path $deploymentDir)) {
    New-Item -ItemType Directory -Path $deploymentDir
}

# Copier les fichiers de configuration Docker
Copy-Item "Dockerfile.alpine" "$deploymentDir/"
Copy-Item "docker-compose.alpine.yml" "$deploymentDir/"
Copy-Item "nginx.alpine.conf" "$deploymentDir/"
Copy-Item "nginx.site.conf" "$deploymentDir/"
Copy-Item "deploy-alpine.sh" "$deploymentDir/"

# Copier les fichiers DIOO (exclure les fichiers de développement)
$excludePatterns = @("*.git*", "node_modules", "*.log", "deployment")
Get-ChildItem -Path "." -Exclude $excludePatterns | Copy-Item -Destination "$deploymentDir/" -Recurse -Force

# Créer l'archive
Compress-Archive -Path "$deploymentDir\*" -DestinationPath "$packageName.zip" -Force

Write-Host "Package de déploiement créé : $packageName.zip" -ForegroundColor Green
Write-Host "Transférez ce fichier sur votre serveur Ubuntu" -ForegroundColor Yellow
```

---

## 📤 PHASE 2 : TRANSFERT VERS UBUNTU

### **🔐 Méthode 1 : SCP (Recommandée)**

Depuis PowerShell sur Windows :

```powershell
# Remplacez par vos informations
$serverIP = "192.168.1.100"
$username = "votre-utilisateur"
$packageFile = "dioo-docker-alpine-*.zip"

# Transfert via SCP
scp $packageFile ${username}@${serverIP}:~/

# Connexion SSH pour déploiement
ssh ${username}@${serverIP}
```

### **🔐 Méthode 2 : WinSCP (Interface Graphique)**

1. Téléchargez et installez WinSCP
2. Connectez-vous à votre serveur Ubuntu
3. Transférez le fichier `.zip` dans le répertoire home
4. Connectez-vous en SSH pour la suite

### **🔐 Méthode 3 : Git (Si Repository)**

```bash
# Sur Ubuntu, cloner ou mettre à jour le repository
git clone https://github.com/votre-repo/dioo.git
# OU
git pull origin main
```

---

## 🐧 PHASE 3 : DÉPLOIEMENT SUR UBUNTU

### **📦 Extraction et Préparation**

```bash
# Se connecter à Ubuntu
ssh votre-utilisateur@192.168.1.100

# Aller dans le répertoire home
cd ~

# Extraire le package (si méthode zip)
unzip dioo-docker-alpine-*.zip -d dioo-deployment
cd dioo-deployment

# OU si méthode Git
cd dioo/deployment

# Rendre les scripts exécutables
chmod +x deploy-alpine.sh
chmod +x *.sh

# Vérifier le contenu
ls -la
```

### **🚀 Lancement du Déploiement**

```bash
# Déploiement avec votre domaine
./deploy-alpine.sh -d votre-domaine.com -e votre-email@domaine.com

# OU pour un test local sans SSL
./deploy-alpine.sh -d localhost -e test@local --skip-ssl
```

---

## 🔧 SCRIPTS ADAPTÉS WINDOWS → UBUNTU

### **📝 Script PowerShell de Préparation**

```powershell
# prepare-deployment.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$true)]
    [string]$Email
)

Write-Host "=== Préparation du Déploiement DIOO ===" -ForegroundColor Cyan

# 1. Créer le package
Write-Host "1. Création du package de déploiement..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$packageName = "dioo-deployment-$timestamp"

# Créer le dossier temporaire
New-Item -ItemType Directory -Path $packageName -Force

# Copier les fichiers nécessaires
$filesToCopy = @(
    "Dockerfile.alpine",
    "docker-compose.alpine.yml", 
    "nginx.alpine.conf",
    "nginx.site.conf",
    "deploy-alpine.sh",
    "index.html",
    "scripts/",
    "styles/",
    "sql-wasm.js",
    "sql-wasm.wasm"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file "$packageName/" -Recurse -Force
        Write-Host "  ✓ $file copié" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $file non trouvé" -ForegroundColor Yellow
    }
}

# Créer un script de configuration
@"
#!/bin/bash
# Configuration automatique générée depuis Windows
DOMAIN="$Domain"
EMAIL="$Email"
SERVER_IP="$ServerIP"

echo "Configuration pour le déploiement :"
echo "  Domaine: `$DOMAIN"
echo "  Email: `$EMAIL"
echo "  Serveur: `$SERVER_IP"

# Lancer le déploiement
./deploy-alpine.sh -d "`$DOMAIN" -e "`$EMAIL"
"@ | Out-File -FilePath "$packageName/auto-deploy.sh" -Encoding UTF8

# 2. Créer l'archive
Write-Host "2. Création de l'archive..." -ForegroundColor Yellow
Compress-Archive -Path "$packageName\*" -DestinationPath "$packageName.zip" -Force
Remove-Item -Path $packageName -Recurse -Force

Write-Host "✓ Package créé : $packageName.zip" -ForegroundColor Green

# 3. Transfert SCP
Write-Host "3. Transfert vers le serveur Ubuntu..." -ForegroundColor Yellow
try {
    scp "$packageName.zip" "${Username}@${ServerIP}:~/"
    Write-Host "✓ Transfert réussi" -ForegroundColor Green
    
    # 4. Connexion SSH et déploiement
    Write-Host "4. Connexion SSH pour déploiement..." -ForegroundColor Yellow
    
    $sshCommands = @"
cd ~
unzip -o $packageName.zip
chmod +x *.sh
echo "Fichiers prêts pour déploiement. Exécutez :"
echo "  ./auto-deploy.sh"
echo "OU manuellement :"
echo "  ./deploy-alpine.sh -d $Domain -e $Email"
"@
    
    # Créer un fichier de commandes SSH temporaire
    $sshCommands | Out-File -FilePath "ssh-commands.txt" -Encoding UTF8
    
    Write-Host "Commandes à exécuter sur Ubuntu :" -ForegroundColor Cyan
    Write-Host $sshCommands -ForegroundColor White
    
    # Connexion SSH interactive
    ssh "${Username}@${ServerIP}"
    
} catch {
    Write-Host "✗ Erreur lors du transfert : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Transférez manuellement le fichier $packageName.zip" -ForegroundColor Yellow
}

# Nettoyage
Remove-Item "$packageName.zip" -ErrorAction SilentlyContinue
Remove-Item "ssh-commands.txt" -ErrorAction SilentlyContinue

Write-Host "=== Préparation terminée ===" -ForegroundColor Cyan
```

### **🔧 Script de Déploiement Simplifié**

```bash
#!/bin/bash
# quick-deploy.sh - Script simplifié pour déploiement rapide

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Déploiement Rapide DIOO Docker Alpine ===${NC}"

# Vérifications de base
if [ ! -f "docker-compose.alpine.yml" ]; then
    echo -e "${RED}Erreur: Fichiers de déploiement manquants${NC}"
    exit 1
fi

# Demander les informations si pas fournies
if [ -z "$1" ]; then
    read -p "Nom de domaine: " DOMAIN
else
    DOMAIN="$1"
fi

if [ -z "$2" ]; then
    read -p "Email pour SSL: " EMAIL
else
    EMAIL="$2"
fi

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Domaine: $DOMAIN"
echo -e "  Email: $EMAIL"
echo

# Installation Docker si nécessaire
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installation de Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker installé. Reconnectez-vous et relancez ce script.${NC}"
    exit 0
fi

# Installation Docker Compose si nécessaire
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installation de Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Préparation des fichiers
echo -e "${BLUE}Préparation des fichiers...${NC}"
mkdir -p nginx ssl

# Configuration Nginx
cp nginx.alpine.conf nginx/nginx.conf
cp nginx.site.conf nginx/default.conf
sed -i "s/VOTRE_DOMAINE/$DOMAIN/g" nginx/default.conf

# Configuration Docker Compose
cp docker-compose.alpine.yml docker-compose.yml
sed -i "s/VOTRE_EMAIL/$EMAIL/g" docker-compose.yml
sed -i "s/VOTRE_DOMAINE/$DOMAIN/g" docker-compose.yml

# Déploiement
echo -e "${BLUE}Démarrage du déploiement...${NC}"

# Construction
docker-compose build --no-cache

# Démarrage pour SSL
docker-compose up -d nginx dioo-app
sleep 15

# Obtention SSL
echo -e "${BLUE}Obtention du certificat SSL...${NC}"
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email "$EMAIL" --agree-tos --no-eff-email -d "$DOMAIN"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Certificat SSL obtenu !${NC}"
    docker-compose down
    sleep 5
    docker-compose up -d
    
    echo -e "${GREEN}=== DÉPLOIEMENT TERMINÉ ===${NC}"
    echo -e "${GREEN}Application accessible sur: https://$DOMAIN${NC}"
else
    echo -e "${RED}Erreur SSL. Vérifiez que le domaine pointe vers ce serveur.${NC}"
    echo -e "${YELLOW}Déploiement en HTTP seulement...${NC}"
    # Configuration HTTP seulement
    cat > nginx/default.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    location / {
        proxy_pass http://dioo-app:3020;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF
    docker-compose restart nginx
    echo -e "${YELLOW}Application accessible sur: http://$DOMAIN${NC}"
fi

# Script de gestion
cat > manage.sh << 'EOF'
#!/bin/bash
case "$1" in
    start) docker-compose up -d ;;
    stop) docker-compose down ;;
    restart) docker-compose restart ;;
    logs) docker-compose logs -f ;;
    status) docker-compose ps ;;
    *) echo "Usage: $0 {start|stop|restart|logs|status}" ;;
esac
EOF
chmod +x manage.sh

echo -e "${BLUE}Script de gestion créé: ./manage.sh${NC}"
```

---

## 📋 GUIDE D'UTILISATION COMPLET

### **🖥️ Sur Windows (Cursor)**

1. **Préparer le déploiement :**
```powershell
# Dans PowerShell
.\prepare-deployment.ps1 -ServerIP "192.168.1.100" -Username "ubuntu" -Domain "dioo.example.com" -Email "admin@example.com"
```

2. **Le script va automatiquement :**
   - Créer le package de déploiement
   - Transférer les fichiers via SCP
   - Ouvrir une session SSH

### **🐧 Sur Ubuntu (après connexion SSH)**

3. **Déploiement automatique :**
```bash
# Déploiement avec configuration automatique
./auto-deploy.sh

# OU déploiement manuel
./deploy-alpine.sh -d dioo.example.com -e admin@example.com
```

4. **Gestion post-déploiement :**
```bash
# Voir le statut
./manage.sh status

# Voir les logs
./manage.sh logs

# Redémarrer
./manage.sh restart
```

---

## 💻 ACCÈS CLIENT FINAL

Une fois déployé, vos clients accèdent simplement via :

```
https://dioo.example.com
```

**✅ Avantages pour les clients :**
- Accès direct via navigateur web
- HTTPS sécurisé automatique
- Aucune configuration requise
- Compatible tous appareils
- Performance optimale

---

## 🔧 DÉPANNAGE WINDOWS → UBUNTU

### **Problèmes de Transfert**

```powershell
# Si SCP ne fonctionne pas, utiliser PSCP (PuTTY)
pscp dioo-deployment-*.zip username@server-ip:/home/username/

# Ou utiliser WinSCP en interface graphique
```

### **Problèmes de Permissions**

```bash
# Sur Ubuntu, après transfert
chmod +x *.sh
chmod 644 *.conf *.yml
```

### **Problèmes Docker**

```bash
# Vérifier Docker
sudo systemctl status docker

# Redémarrer Docker si nécessaire
sudo systemctl restart docker

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🎯 RÉSUMÉ DU WORKFLOW

1. **Windows (Cursor)** → Développement + Préparation package
2. **Transfert** → SCP/WinSCP vers Ubuntu
3. **Ubuntu** → Extraction + Déploiement Docker
4. **Clients** → Accès HTTPS direct

**🎉 Solution complète adaptée à votre environnement Windows → Ubuntu !**