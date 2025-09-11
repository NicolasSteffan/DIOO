# 🚀 Guide de Déploiement DIOO - Toutes Solutions

## 📋 Vue d'Ensemble Complète

Ce guide présente **toutes les solutions de déploiement** pour DIOO avec un serveur Ubuntu et différents types d'accès clients. Chaque solution répond à des besoins spécifiques selon le contexte d'utilisation.

---

## 🎯 **Tableau de Choix des Solutions**

| Solution | Sécurité | Performance | Complexité | Usage Recommandé |
|----------|----------|-------------|------------|------------------|
| **🔐 SSH Tunnel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | **Clients Professionnels** |
| **🌐 Accès Direct** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | Réseau Local/Démo |
| **🖥️ X11 Forwarding** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | Debug Ponctuel |
| **🐳 Docker** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Déploiement Conteneurisé |
| **⚡ Nginx Proxy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Production Web |

---

## 🖥️ PARTIE 1 : PRÉPARATION SERVEUR UBUNTU

### **🔧 Prérequis Communs**

#### **Système requis :**
- Ubuntu 18.04+ (LTS recommandé)
- 2 GB RAM minimum
- 10 GB espace disque
- Connexion internet
- Accès SSH activé

#### **Installation des dépendances de base :**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js (méthode recommandée)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérification
node --version
npm --version

# Installation de http-server globalement
sudo npm install -g http-server

# Installation d'outils utiles
sudo apt install -y git curl wget lsof net-tools ufw
```

### **📁 Déploiement du Projet DIOO**

#### **Transfert depuis Windows :**
```bash
# Sur votre PC Windows (PowerShell ou CMD)
scp -r Z:\YESDATA_AI\PROJETS\CLIENTS\AIRBUS\DIOO user@SERVER_IP:~/

# Exemple concret :
# scp -r Z:\YESDATA_AI\PROJETS\CLIENTS\AIRBUS\DIOO nicolas@192.168.1.100:~/
```

#### **Configuration des permissions :**
```bash
# Sur le serveur Ubuntu
cd ~/DIOO
chmod +x go.sh stop.sh

# Test de base
./go.sh
```

---

## 🔐 SOLUTION 1 : SSH TUNNEL (RECOMMANDÉE CLIENTS)

### **🎯 Contexte d'Usage**
- **Clients professionnels** (internes/externes)
- **Télétravail sécurisé**
- **Démonstrations contrôlées**
- **Audit et conformité**

### **✅ Avantages**
- Sécurité maximale (chiffrement AES-256)
- Pas d'ouverture de ports publics
- Authentification par clés SSH
- Audit complet des connexions
- Révocation instantanée des accès

### **🖥️ Déploiement Côté Serveur**

#### **Configuration utilisateurs clients :**
```bash
# Créer un utilisateur dédié pour chaque client
sudo adduser client-demo --disabled-password

# Générer une paire de clés SSH
ssh-keygen -t rsa -b 4096 -f /tmp/client-demo-key -N ""

# Configurer l'accès SSH
sudo mkdir /home/client-demo/.ssh
sudo cp /tmp/client-demo-key.pub /home/client-demo/.ssh/authorized_keys
sudo chmod 700 /home/client-demo/.ssh
sudo chmod 600 /home/client-demo/.ssh/authorized_keys
sudo chown -R client-demo:client-demo /home/client-demo/.ssh

# Récupérer la clé privée pour le client
cp /tmp/client-demo-key ~/client-demo-private.key
chmod 600 ~/client-demo-private.key

echo "Clé privée à transférer au client : ~/client-demo-private.key"
```

#### **Lancement DIOO :**
```bash
# Le script go.sh détecte automatiquement l'environnement headless
./go.sh

# Sortie attendue en mode headless :
# ===============================================
#         SERVEUR HEADLESS - ACCÈS DISTANT
# ===============================================
# 
# [SERVEUR PRÊT] Application accessible via :
# 
# • Accès local SSH tunnel :
#   ssh -L 3020:localhost:3020 user@192.168.1.100
#   Puis ouvrir: http://localhost:3020
```

### **💻 Configuration Côté Client**

#### **Windows - Configuration automatique :**
```cmd
# Exécuter le script de configuration
setup-client.bat 192.168.1.100 client-demo

# Placer la clé SSH reçue
copy client-demo-private.key C:\DIOO-Access\dioo-key.pem

# Se connecter
C:\DIOO-Access\connect-dioo.bat
```

#### **Linux/Mac - Configuration automatique :**
```bash
# Exécuter le script de configuration
./setup-client.sh 192.168.1.100 client-demo

# Placer la clé SSH reçue
cp client-demo-private.key ~/DIOO-Access/dioo-key.pem
chmod 600 ~/DIOO-Access/dioo-key.pem

# Se connecter
~/DIOO-Access/connect-dioo.sh
# OU si alias configuré : dioo
```

### **🔧 Connexion Manuelle (pour comprendre) :**
```bash
# Créer le tunnel SSH
ssh -L 3020:localhost:3020 client-demo@192.168.1.100

# Dans un autre terminal ou après connexion SSH
# Ouvrir le navigateur sur : http://localhost:3020
```

---

## 🌐 SOLUTION 2 : ACCÈS RÉSEAU DIRECT

### **🎯 Contexte d'Usage**
- **Réseau local d'entreprise**
- **Démonstrations rapides**
- **Tests internes**
- **Environnements de développement**

### **✅ Avantages**
- Configuration très simple
- Performance maximale
- Pas de tunnel nécessaire
- Accès direct depuis le réseau

### **⚠️ Inconvénients**
- Sécurité limitée
- Exposition du port sur le réseau
- Pas de chiffrement supplémentaire

### **🖥️ Déploiement**

#### **Configuration du firewall Ubuntu :**
```bash
# Autoriser le port 3020 pour tout le réseau local
sudo ufw allow from 192.168.1.0/24 to any port 3020

# OU autoriser depuis une IP spécifique
sudo ufw allow from 192.168.1.50 to any port 3020

# OU autoriser complètement (non recommandé)
sudo ufw allow 3020

# Vérifier le statut
sudo ufw status verbose
```

#### **Lancement DIOO :**
```bash
# Lancer normalement
./go.sh

# Le script affichera automatiquement l'IP d'accès
# Exemple: http://192.168.1.100:3020
```

### **💻 Accès Client**
```bash
# Depuis n'importe quel navigateur sur le réseau
http://IP_DU_SERVEUR:3020

# Exemple :
http://192.168.1.100:3020
```

### **🛡️ Sécurisation Recommandée**
```bash
# Limiter l'accès au réseau local uniquement
sudo ufw delete allow 3020  # Supprimer règle générale
sudo ufw allow from 192.168.1.0/24 to any port 3020

# Optionnel : Authentification HTTP basique avec Nginx
sudo apt install nginx apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd dioo-user
```

---

## 🖥️ SOLUTION 3 : SSH AVEC X11 FORWARDING

### **🎯 Contexte d'Usage**
- **Debug ponctuel**
- **Administration graphique distante**
- **Tests avec navigateur serveur**
- **Développement avec outils graphiques**

### **✅ Avantages**
- Interface graphique complète sur le serveur
- Sécurité SSH maintenue
- Contrôle total de l'environnement

### **⚠️ Inconvénients**
- Performance limitée (latence réseau)
- Nécessite serveur X11 sur le client
- Consommation bande passante élevée

### **🖥️ Déploiement Côté Serveur**

#### **Installation de l'environnement graphique :**
```bash
# Installer Firefox sur Ubuntu headless
sudo apt update
sudo apt install firefox

# Optionnel : installer un environnement graphique minimal
sudo apt install xfce4-session xfce4-goodies

# Configurer SSH pour X11 Forwarding
sudo nano /etc/ssh/sshd_config
# Vérifier que ces lignes sont présentes :
# X11Forwarding yes
# X11DisplayOffset 10

sudo systemctl restart ssh
```

#### **Lancement DIOO :**
```bash
# Lancer DIOO normalement
./go.sh
```

### **💻 Connexion Client**

#### **Linux/Mac :**
```bash
# Connexion SSH avec X11 forwarding
ssh -X client-demo@192.168.1.100

# Lancer Firefox sur le serveur (s'affichera localement)
firefox http://localhost:3020 &
```

#### **Windows :**
```cmd
# Installer un serveur X11 (ex: VcXsrv, Xming)
# Configurer DISPLAY
set DISPLAY=localhost:0.0

# Connexion SSH avec X11
ssh -X client-demo@192.168.1.100

# Lancer Firefox
firefox http://localhost:3020 &
```

---

## 🐳 SOLUTION 4 : DOCKER AVEC PORT MAPPING

### **🎯 Contexte d'Usage**
- **Déploiement conteneurisé**
- **Environnements isolés**
- **CI/CD pipelines**
- **Scalabilité horizontale**

### **✅ Avantages**
- Isolation complète
- Déploiement reproductible
- Gestion des dépendances simplifiée
- Scalabilité native

### **🖥️ Déploiement**

#### **Installation de Docker :**
```bash
# Installer Docker
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

#### **Créer le Dockerfile :**
```dockerfile
FROM ubuntu:22.04

# Installation des dépendances
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Installation de http-server
RUN npm install -g http-server

# Créer utilisateur non-root
RUN useradd -m -s /bin/bash dioo

# Copier les fichiers du projet
WORKDIR /app
COPY . .
RUN chown -R dioo:dioo /app

# Changer vers utilisateur non-root
USER dioo

# Exposer le port
EXPOSE 3020

# Lancer l'application
CMD ["http-server", ".", "-p", "3020", "-c-1", "--cors"]
```

#### **Construction et lancement :**
```bash
# Construire l'image
docker build -t dioo-app .

# Lancer le conteneur
docker run -d -p 3020:3020 --name dioo --restart unless-stopped dioo-app

# Vérifier le statut
docker ps

# Voir les logs
docker logs dioo

# Accéder via http://IP_SERVEUR:3020
```

### **🔧 Gestion Docker**
```bash
# Arrêter le conteneur
docker stop dioo

# Redémarrer
docker start dioo

# Supprimer
docker rm -f dioo

# Mettre à jour (rebuild + redeploy)
docker stop dioo && docker rm dioo
docker build -t dioo-app .
docker run -d -p 3020:3020 --name dioo --restart unless-stopped dioo-app
```

---

## ⚡ SOLUTION 5 : NGINX PROXY (PRODUCTION WEB)

### **🎯 Contexte d'Usage**
- **Production web publique**
- **Domaines personnalisés**
- **HTTPS/SSL automatique**
- **Load balancing**
- **Cache et optimisations**

### **✅ Avantages**
- Performance maximale
- HTTPS natif avec Let's Encrypt
- Gestion des domaines
- Cache et compression
- Load balancing possible

### **🖥️ Déploiement**

#### **Installation et configuration Nginx :**
```bash
# Installer Nginx
sudo apt install nginx

# Créer la configuration DIOO
sudo tee /etc/nginx/sites-available/dioo << EOF
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Redirection HTTPS (optionnel)
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Configuration SSL (à configurer avec certbot)
    # ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Configuration proxy vers DIOO
    location / {
        proxy_pass http://localhost:3020;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Optimisations
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Activer le site
sudo ln -s /etc/nginx/sites-available/dioo /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

#### **Configuration HTTPS avec Let's Encrypt :**
```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

#### **Lancement DIOO en service :**
```bash
# Créer le service systemd
sudo tee /etc/systemd/system/dioo.service << EOF
[Unit]
Description=DIOO Application Server
After=network.target

[Service]
Type=simple
User=dioo
WorkingDirectory=/opt/dioo
ExecStart=/usr/bin/http-server . -p 3020 -c-1 --cors --silent
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Activer et démarrer
sudo systemctl daemon-reload
sudo systemctl enable dioo
sudo systemctl start dioo
```

### **💻 Accès Client**
```bash
# Accès via le domaine
https://votre-domaine.com

# Ou HTTP si pas de SSL
http://votre-domaine.com
```

---

## 🔧 PARTIE 2 : SCRIPTS D'AUTOMATISATION

### **📦 Script de Déploiement Automatique**

Le script `deploy-ubuntu.sh` automatise l'installation complète :

```bash
# Télécharger et exécuter
sudo ./deploy-ubuntu.sh

# Le script propose :
# 1. Installation des dépendances
# 2. Configuration utilisateur dédié
# 3. Déploiement des fichiers
# 4. Configuration du service
# 5. Configuration du firewall
# 6. Génération des clés SSH clients
```

### **💻 Scripts de Configuration Client**

#### **Windows :**
```cmd
# Configuration automatique
setup-client.bat [SERVER_IP] [USERNAME]

# Génère :
# - Dossier C:\DIOO-Access
# - Script connect-dioo.bat personnalisé
# - Instructions détaillées
# - Raccourci bureau (optionnel)
```

#### **Linux/Mac :**
```bash
# Configuration automatique
./setup-client.sh [SERVER_IP] [USERNAME]

# Génère :
# - Dossier ~/DIOO-Access
# - Script connect-dioo.sh personnalisé
# - Alias shell 'dioo' (optionnel)
# - Lanceur desktop (Linux)
```

---

## 📊 PARTIE 3 : COMPARAISON ET CHOIX

### **🎯 Matrice de Décision**

| Critère | SSH Tunnel | Accès Direct | X11 Forward | Docker | Nginx Proxy |
|---------|------------|--------------|-------------|--------|-------------|
| **Sécurité** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Simplicité Setup** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Simplicité Usage** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Coût** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Maintenance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Scalabilité** | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### **🎯 Recommandations par Contexte**

#### **🏢 Entreprise - Clients Internes**
**→ Solution 1 : SSH Tunnel**
- Sécurité maximale
- Audit complet
- Gestion centralisée des accès

#### **🌐 Entreprise - Réseau Local**
**→ Solution 2 : Accès Direct**
- Performance optimale
- Configuration simple
- Idéal pour démonstrations

#### **🔧 Développement - Debug**
**→ Solution 3 : X11 Forwarding**
- Contrôle graphique complet
- Outils de développement
- Debug interactif

#### **☁️ Cloud - Microservices**
**→ Solution 4 : Docker**
- Isolation et sécurité
- Déploiement reproductible
- Intégration CI/CD

#### **🌍 Production - Web Public**
**→ Solution 5 : Nginx Proxy**
- Performance web maximale
- HTTPS natif
- Domaines personnalisés

---

## ✅ PARTIE 4 : CHECKLIST DE DÉPLOIEMENT

### **🖥️ Serveur Ubuntu**
- [ ] Ubuntu 18.04+ installé et à jour
- [ ] Node.js et npm installés
- [ ] http-server installé globalement
- [ ] Projet DIOO déployé et permissions correctes
- [ ] Script `go.sh` testé et fonctionnel
- [ ] Firewall UFW configuré selon la solution choisie
- [ ] Service systemd configuré (si production)
- [ ] Clés SSH générées (si SSH Tunnel)

### **💻 Client Windows**
- [ ] OpenSSH Client installé
- [ ] Script `setup-client.bat` exécuté
- [ ] Dossier `C:\DIOO-Access` créé
- [ ] Clé SSH reçue et placée correctement
- [ ] Premier test de connexion réussi
- [ ] Raccourci bureau créé (optionnel)

### **💻 Client Linux/Mac**
- [ ] SSH client disponible
- [ ] Script `setup-client.sh` exécuté
- [ ] Dossier `~/DIOO-Access` créé avec bonnes permissions
- [ ] Clé SSH reçue et sécurisée (chmod 600)
- [ ] Premier test de connexion réussi
- [ ] Alias shell configuré (optionnel)

### **🔐 Sécurité**
- [ ] Authentification par clés SSH (pas de mots de passe)
- [ ] Firewall configuré selon les besoins
- [ ] Utilisateurs dédiés non-privilégiés
- [ ] Logs et audit configurés
- [ ] Procédure de révocation d'accès définie

---

## 🚨 PARTIE 5 : DÉPANNAGE COMMUN

### **Problèmes Serveur**
```bash
# Service ne démarre pas
sudo systemctl status dioo
sudo journalctl -u dioo -n 50

# Port occupé
sudo lsof -i:3020
sudo kill $(lsof -ti:3020)

# Permissions incorrectes
sudo chown -R dioo:dioo /opt/dioo
chmod +x /opt/dioo/go.sh
```

### **Problèmes Client SSH**
```bash
# Connection refused
ping server-ip
telnet server-ip 22

# Permission denied
chmod 600 ~/.ssh/dioo-key.pem
ssh -v -i ~/.ssh/dioo-key.pem user@server

# Tunnel ne s'établit pas
lsof -i:3020  # Vérifier si port libre
ssh -v -L 3020:localhost:3020 user@server
```

### **Problèmes Réseau**
```bash
# Firewall bloque
sudo ufw status verbose
sudo ufw allow from CLIENT_IP to any port 3020

# DNS/Résolution
nslookup server-domain
ping server-domain
```

---

## 🎉 CONCLUSION

Ce guide complet vous permet de choisir et déployer la solution DIOO la plus adaptée à votre contexte :

- **🔐 SSH Tunnel** pour la sécurité maximale
- **🌐 Accès Direct** pour la simplicité
- **🖥️ X11 Forwarding** pour le debug
- **🐳 Docker** pour la conteneurisation
- **⚡ Nginx Proxy** pour la production web

**Chaque solution est documentée, testée et prête pour la production !**