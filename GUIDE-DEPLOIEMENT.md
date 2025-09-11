# 🚀 Guide de Déploiement DIOO - Ubuntu Serveur & PC Client

## 📋 Vue d'Ensemble

Ce guide détaille le déploiement complet de DIOO avec :
- **Serveur Ubuntu** (headless ou avec interface)
- **PC Client** (Windows/Mac/Linux) avec accès SSH Tunnel sécurisé

---

## 🖥️ PARTIE 1 : DÉPLOIEMENT CÔTÉ UBUNTU (SERVEUR)

### **🔧 Prérequis Serveur Ubuntu**

#### **Système requis :**
- Ubuntu 18.04+ (LTS recommandé)
- 2 GB RAM minimum
- 10 GB espace disque
- Connexion internet
- Accès SSH activé

#### **Vérifications initiales :**
```bash
# Vérifier la version Ubuntu
lsb_release -a

# Vérifier l'espace disque
df -h

# Vérifier la mémoire
free -h

# Vérifier SSH
sudo systemctl status ssh
```

---

### **📦 ÉTAPE 1 : Installation des Dépendances**

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
sudo apt install -y git curl wget lsof net-tools
```

---

### **📁 ÉTAPE 2 : Déploiement du Projet DIOO**

#### **Option A : Transfert depuis Windows**
```bash
# Sur votre PC Windows (PowerShell ou CMD)
# Remplacer USER et SERVER_IP par vos valeurs
scp -r Z:\YESDATA_AI\PROJETS\CLIENTS\AIRBUS\DIOO user@SERVER_IP:~/

# Exemple concret :
# scp -r Z:\YESDATA_AI\PROJETS\CLIENTS\AIRBUS\DIOO nicolas@192.168.1.100:~/
```

#### **Option B : Clone depuis Git (si disponible)**
```bash
# Sur le serveur Ubuntu
cd ~
git clone [URL_DU_REPO] DIOO
cd DIOO
```

#### **Option C : Transfert manuel par étapes**
```bash
# 1. Créer le dossier sur Ubuntu
mkdir ~/DIOO
cd ~/DIOO

# 2. Transférer les fichiers essentiels un par un
# (depuis votre PC Windows via WinSCP, FileZilla, ou scp)
```

---

### **🔑 ÉTAPE 3 : Configuration des Permissions**

```bash
# Aller dans le dossier DIOO
cd ~/DIOO

# Rendre les scripts exécutables
chmod +x go.sh stop.sh

# Vérifier les permissions
ls -la *.sh

# Optionnel : Créer un lien symbolique global
sudo ln -sf ~/DIOO/go.sh /usr/local/bin/dioo-start
sudo ln -sf ~/DIOO/stop.sh /usr/local/bin/dioo-stop
```

---

### **🚀 ÉTAPE 4 : Premier Lancement et Test**

```bash
# Lancer DIOO
./go.sh

# Le script va :
# 1. Détecter l'environnement (graphique ou headless)
# 2. Installer http-server si nécessaire
# 3. Démarrer le serveur sur le port 3020
# 4. Afficher les instructions d'accès
```

#### **Sortie attendue en mode headless :**
```
===============================================
        SERVEUR HEADLESS - ACCÈS DISTANT
===============================================

[SERVEUR PRÊT] Application accessible via :

• Accès local SSH tunnel :
  ssh -L 3020:localhost:3020 user@192.168.1.100
  Puis ouvrir: http://localhost:3020

• Accès réseau direct :
  http://192.168.1.100:3020

• Accès via nom d'hôte :
  http://ubuntu-server:3020

[SÉCURITÉ] Pour l'accès réseau, vérifiez le firewall :
  sudo ufw allow 3020
```

---

### **🛡️ ÉTAPE 5 : Configuration Sécurité (Recommandée)**

#### **Firewall pour accès réseau direct :**
```bash
# Activer UFW si pas déjà fait
sudo ufw enable

# Autoriser SSH (important !)
sudo ufw allow ssh

# Autoriser DIOO seulement depuis votre réseau local
sudo ufw allow from 192.168.1.0/24 to any port 3020

# Ou depuis une IP spécifique
sudo ufw allow from 192.168.1.50 to any port 3020

# Vérifier les règles
sudo ufw status verbose
```

#### **Configuration SSH pour clients (optionnel mais recommandé) :**
```bash
# Créer un utilisateur dédié pour chaque client
sudo adduser client-demo --disabled-password

# Créer le dossier SSH
sudo mkdir /home/client-demo/.ssh
sudo chmod 700 /home/client-demo/.ssh

# Générer une paire de clés pour le client
ssh-keygen -t rsa -b 4096 -f /tmp/client-demo-key -N ""

# Installer la clé publique
sudo cp /tmp/client-demo-key.pub /home/client-demo/.ssh/authorized_keys
sudo chmod 600 /home/client-demo/.ssh/authorized_keys
sudo chown -R client-demo:client-demo /home/client-demo/.ssh

# Récupérer la clé privée pour le client
cp /tmp/client-demo-key ~/client-demo-private.key
chmod 600 ~/client-demo-private.key

echo "Clé privée pour le client : ~/client-demo-private.key"
echo "À transférer de manière sécurisée au client"
```

---

### **🔄 ÉTAPE 6 : Service Automatique (Production)**

#### **Créer un service systemd :**
```bash
# Créer le fichier de service
sudo tee /etc/systemd/system/dioo.service << EOF
[Unit]
Description=DIOO Application Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/DIOO
ExecStart=/usr/bin/http-server . -p 3020 -c-1 --cors --silent
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Recharger systemd
sudo systemctl daemon-reload

# Activer le service (démarrage automatique)
sudo systemctl enable dioo

# Démarrer le service
sudo systemctl start dioo

# Vérifier le statut
sudo systemctl status dioo
```

#### **Commandes de gestion du service :**
```bash
# Démarrer
sudo systemctl start dioo

# Arrêter
sudo systemctl stop dioo

# Redémarrer
sudo systemctl restart dioo

# Voir les logs
sudo journalctl -u dioo -f
```

---

## 💻 PARTIE 2 : DÉPLOIEMENT CÔTÉ PC CLIENT

### **🔧 Prérequis Client**

#### **Windows :**
- Windows 10/11
- OpenSSH Client (inclus par défaut)
- Navigateur web moderne

#### **Mac/Linux :**
- SSH client (préinstallé)
- Navigateur web moderne

---

### **📦 ÉTAPE 1 : Réception des Fichiers Client**

L'administrateur vous fournit :
1. **Script de connexion** (`client-connect.bat` ou `client-connect.sh`)
2. **Clé SSH privée** (`client-demo-private.key`)
3. **Instructions personnalisées**

---

### **🔑 ÉTAPE 2 : Configuration Client Windows**

#### **Créer le dossier sécurisé :**
```cmd
# Créer le dossier d'accès
mkdir C:\DIOO-Access

# Copier les fichiers reçus
copy client-connect.bat C:\DIOO-Access\
copy client-demo-private.key C:\DIOO-Access\
```

#### **Personnaliser le script :**
```cmd
# Éditer C:\DIOO-Access\client-connect.bat
# Modifier ces lignes selon vos paramètres :

set SERVER_HOST=192.168.1.100
set USERNAME=client-demo
set SSH_KEY=C:\DIOO-Access\client-demo-private.key
```

#### **Créer un raccourci bureau :**
```cmd
# Clic droit sur le bureau > Nouveau > Raccourci
# Cible : C:\DIOO-Access\client-connect.bat
# Nom : "Accès DIOO Sécurisé"
```

---

### **🔑 ÉTAPE 3 : Configuration Client Mac/Linux**

#### **Créer le dossier sécurisé :**
```bash
# Créer le dossier d'accès
mkdir ~/DIOO-Access

# Copier les fichiers reçus
cp client-connect.sh ~/DIOO-Access/
cp client-demo-private.key ~/DIOO-Access/

# Sécuriser les permissions
chmod 700 ~/DIOO-Access
chmod 600 ~/DIOO-Access/client-demo-private.key
chmod +x ~/DIOO-Access/client-connect.sh
```

#### **Personnaliser le script :**
```bash
# Éditer ~/DIOO-Access/client-connect.sh
# Modifier ces lignes selon vos paramètres :

SERVER_HOST="192.168.1.100"
USERNAME="client-demo"
SSH_KEY="$HOME/DIOO-Access/client-demo-private.key"
```

---

### **🚀 ÉTAPE 4 : Première Connexion Client**

#### **Windows :**
```cmd
# Double-cliquer sur le raccourci bureau
# OU exécuter manuellement :
C:\DIOO-Access\client-connect.bat
```

#### **Mac/Linux :**
```bash
# Exécuter le script
~/DIOO-Access/client-connect.sh

# OU créer un alias pratique
echo "alias dioo='~/DIOO-Access/client-connect.sh'" >> ~/.bashrc
source ~/.bashrc
# Puis simplement : dioo
```

#### **Résultat attendu :**
```
===============================================
         DIOO - Connexion Client Sécurisée
===============================================

[INFO] Connexion au serveur DIOO...
[INFO] Serveur: 192.168.1.100
[INFO] Utilisateur: client-demo
[INFO] Port local: 3020

[INFO] Établissement du tunnel sécurisé...
[OK] Tunnel SSH établi avec succès !

===============================================
           DIOO - Accès Sécurisé Prêt
===============================================

[OK] Application DIOO accessible sur: http://localhost:3020
[INFO] Ouverture automatique du navigateur...

# Le navigateur s'ouvre automatiquement sur DIOO
```

---

## 🔧 PARTIE 3 : DÉPANNAGE ET MAINTENANCE

### **🚨 Problèmes Côté Serveur Ubuntu**

#### **Serveur ne démarre pas :**
```bash
# Vérifier Node.js
node --version

# Vérifier http-server
npm list -g http-server

# Vérifier les ports
sudo lsof -i:3020

# Relancer manuellement
cd ~/DIOO
./go.sh
```

#### **Problème de permissions :**
```bash
# Réparer les permissions
chmod +x ~/DIOO/go.sh ~/DIOO/stop.sh
chown -R $USER:$USER ~/DIOO
```

#### **Firewall bloque :**
```bash
# Vérifier UFW
sudo ufw status

# Tester localement
curl http://localhost:3020

# Autoriser temporairement
sudo ufw allow 3020
```

---

### **🚨 Problèmes Côté Client**

#### **"Connection refused" :**
```bash
# Vérifier la connectivité réseau
ping 192.168.1.100

# Tester SSH sans tunnel
ssh client-demo@192.168.1.100

# Vérifier que le serveur écoute
# (depuis le serveur) netstat -tlnp | grep 3020
```

#### **"Permission denied" :**
```bash
# Windows : Vérifier le chemin de la clé
# Mac/Linux : Réparer les permissions
chmod 600 ~/DIOO-Access/client-demo-private.key
```

#### **"Port already in use" :**
```cmd
# Windows
netstat -ano | findstr :3020
taskkill /F /PID [PID_NUMBER]

# Mac/Linux
lsof -ti:3020 | xargs kill -9
```

---

## 📊 PARTIE 4 : SCÉNARIOS DE DÉPLOIEMENT

### **🏢 Scénario 1 : Entreprise Interne**
- **Serveur** : Ubuntu sur réseau local
- **Clients** : Employés avec accès SSH
- **Sécurité** : Clés SSH individuelles + Firewall réseau local

### **🌐 Scénario 2 : Accès Distant**
- **Serveur** : Ubuntu sur VPS/Cloud
- **Clients** : Consultants externes
- **Sécurité** : SSH tunnel + Accès temporaire

### **🏠 Scénario 3 : Télétravail**
- **Serveur** : Ubuntu au bureau
- **Clients** : Employés à domicile
- **Sécurité** : VPN entreprise + SSH tunnel

---

## ✅ CHECKLIST DE DÉPLOIEMENT

### **Côté Serveur Ubuntu :**
- [ ] Ubuntu mis à jour
- [ ] Node.js et npm installés
- [ ] Projet DIOO transféré
- [ ] Scripts exécutables (`chmod +x`)
- [ ] Premier test avec `./go.sh`
- [ ] Firewall configuré si nécessaire
- [ ] Comptes clients créés
- [ ] Clés SSH générées
- [ ] Service systemd configuré (optionnel)

### **Côté Client :**
- [ ] Fichiers reçus de l'administrateur
- [ ] Dossier sécurisé créé
- [ ] Script personnalisé avec bons paramètres
- [ ] Permissions correctes (Mac/Linux)
- [ ] Premier test de connexion
- [ ] Navigateur s'ouvre sur DIOO
- [ ] Raccourci bureau créé (optionnel)

---

## 🎯 RÉSUMÉ RAPIDE

### **Déploiement Express (5 minutes) :**

#### **Serveur Ubuntu :**
```bash
sudo apt update && sudo apt install -y nodejs npm
sudo npm install -g http-server
cd ~/DIOO && chmod +x *.sh && ./go.sh
```

#### **Client Windows :**
```cmd
# Recevoir client-connect.bat + clé SSH
# Personnaliser les paramètres dans le script
# Double-clic pour se connecter
```

#### **Client Mac/Linux :**
```bash
# Recevoir client-connect.sh + clé SSH
chmod +x client-connect.sh && chmod 600 cle-ssh.key
# Personnaliser les paramètres dans le script
./client-connect.sh
```

**🎉 DIOO est maintenant accessible de manière sécurisée !**