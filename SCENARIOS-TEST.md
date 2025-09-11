# 🧪 Scénarios de Test - Déploiement DIOO

## 📋 Guide de Test Complet

Ce document présente les scénarios de test pour valider le déploiement DIOO côté Ubuntu serveur et PC client.

---

## 🖥️ TESTS CÔTÉ SERVEUR UBUNTU

### **🔧 Test 1 : Installation Automatique**

#### **Objectif :** Valider le script de déploiement automatique

#### **Prérequis :**
- Ubuntu 18.04+ fraîchement installé
- Connexion internet active
- Droits sudo

#### **Procédure :**
```bash
# 1. Télécharger le script de déploiement
wget https://raw.githubusercontent.com/[REPO]/deploy-ubuntu.sh
# OU copier depuis le projet local

# 2. Rendre exécutable
chmod +x deploy-ubuntu.sh

# 3. Exécuter en tant que root
sudo ./deploy-ubuntu.sh

# 4. Suivre les prompts interactifs
```

#### **Résultats attendus :**
- ✅ Node.js installé et fonctionnel
- ✅ http-server installé globalement
- ✅ Utilisateur `dioo` créé
- ✅ Service systemd configuré et démarré
- ✅ Firewall UFW configuré
- ✅ Clés SSH générées (si demandé)
- ✅ Application accessible sur http://localhost:3020

#### **Vérifications :**
```bash
# Vérifier Node.js
node --version
npm --version

# Vérifier le service
sudo systemctl status dioo

# Vérifier l'écoute du port
sudo lsof -i:3020

# Tester l'accès local
curl http://localhost:3020

# Vérifier le firewall
sudo ufw status
```

---

### **🔧 Test 2 : Installation Manuelle**

#### **Objectif :** Valider l'installation pas à pas

#### **Procédure :**
```bash
# 1. Mise à jour système
sudo apt update && sudo apt upgrade -y

# 2. Installation Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Installation http-server
sudo npm install -g http-server

# 4. Déploiement DIOO
mkdir ~/DIOO && cd ~/DIOO
# Copier les fichiers du projet
chmod +x go.sh stop.sh

# 5. Premier lancement
./go.sh
```

#### **Résultats attendus :**
- ✅ Détection automatique environnement headless
- ✅ Instructions SSH tunnel affichées
- ✅ Serveur démarré sur port 3020
- ✅ IP locale détectée et affichée

---

### **🔧 Test 3 : Environnement Headless**

#### **Objectif :** Valider la détection et les instructions headless

#### **Simulation environnement headless :**
```bash
# Désactiver temporairement les variables d'environnement graphique
unset DISPLAY
unset WAYLAND_DISPLAY

# Lancer DIOO
./go.sh
```

#### **Résultats attendus :**
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

### **🔧 Test 4 : Service Systemd**

#### **Objectif :** Valider le service de production

#### **Procédure :**
```bash
# 1. Arrêter le serveur manuel
./stop.sh

# 2. Démarrer via systemd
sudo systemctl start dioo

# 3. Vérifier le statut
sudo systemctl status dioo

# 4. Tester la persistance
sudo systemctl stop dioo
sudo systemctl start dioo

# 5. Tester le démarrage automatique
sudo systemctl enable dioo
sudo reboot
# Après redémarrage, vérifier que le service est actif
```

#### **Résultats attendus :**
- ✅ Service démarre sans erreur
- ✅ Port 3020 accessible
- ✅ Logs propres dans journalctl
- ✅ Redémarrage automatique après reboot

---

## 💻 TESTS CÔTÉ CLIENT

### **🔧 Test 5 : Configuration Client Windows**

#### **Objectif :** Valider la configuration automatique Windows

#### **Prérequis :**
- Windows 10/11
- OpenSSH Client installé
- Droits administrateur

#### **Procédure :**
```cmd
# 1. Exécuter le script de configuration
setup-client.bat 192.168.1.100 client-demo

# 2. Suivre les prompts interactifs
# 3. Vérifier les fichiers créés
```

#### **Résultats attendus :**
- ✅ Dossier `C:\DIOO-Access` créé
- ✅ Script `connect-dioo.bat` personnalisé
- ✅ Fichier `INSTRUCTIONS.txt` généré
- ✅ Raccourci bureau créé (si demandé)

#### **Vérifications :**
```cmd
# Vérifier OpenSSH
ssh -V

# Vérifier les fichiers
dir C:\DIOO-Access

# Tester la configuration (sans clé SSH)
C:\DIOO-Access\connect-dioo.bat
# Doit afficher l'erreur "Clé SSH non trouvée"
```

---

### **🔧 Test 6 : Configuration Client Linux/Mac**

#### **Objectif :** Valider la configuration automatique Linux/Mac

#### **Procédure :**
```bash
# 1. Exécuter le script de configuration
./setup-client.sh 192.168.1.100 client-demo

# 2. Suivre les prompts interactifs
# 3. Vérifier les fichiers créés
```

#### **Résultats attendus :**
- ✅ Dossier `~/DIOO-Access` créé avec permissions 700
- ✅ Script `connect-dioo.sh` personnalisé et exécutable
- ✅ Fichier `INSTRUCTIONS.txt` généré
- ✅ Alias `dioo` ajouté au shell (si demandé)
- ✅ Lanceur desktop créé (Linux uniquement)

#### **Vérifications :**
```bash
# Vérifier SSH
ssh -V

# Vérifier les fichiers et permissions
ls -la ~/DIOO-Access/

# Vérifier l'alias (après rechargement shell)
source ~/.bashrc
alias | grep dioo

# Tester la configuration (sans clé SSH)
~/DIOO-Access/connect-dioo.sh
# Doit afficher l'erreur "Clé SSH non trouvée"
```

---

## 🔐 TESTS DE CONNEXION SSH TUNNEL

### **🔧 Test 7 : Génération et Test des Clés SSH**

#### **Objectif :** Valider le processus complet d'authentification SSH

#### **Côté Serveur Ubuntu :**
```bash
# 1. Créer un utilisateur de test
sudo adduser test-client --disabled-password

# 2. Générer les clés SSH
ssh-keygen -t rsa -b 4096 -f /tmp/test-client-key -N ""

# 3. Installer la clé publique
sudo mkdir /home/test-client/.ssh
sudo cp /tmp/test-client-key.pub /home/test-client/.ssh/authorized_keys
sudo chmod 700 /home/test-client/.ssh
sudo chmod 600 /home/test-client/.ssh/authorized_keys
sudo chown -R test-client:test-client /home/test-client/.ssh

# 4. Récupérer la clé privée
cp /tmp/test-client-key ~/test-client-private.key
chmod 600 ~/test-client-private.key
```

#### **Côté Client :**
```bash
# 1. Copier la clé privée du serveur
scp user@server-ip:~/test-client-private.key ~/DIOO-Access/dioo-key.pem
chmod 600 ~/DIOO-Access/dioo-key.pem

# 2. Tester la connexion SSH directe
ssh -i ~/DIOO-Access/dioo-key.pem test-client@server-ip

# 3. Tester le tunnel SSH
ssh -i ~/DIOO-Access/dioo-key.pem -L 3020:localhost:3020 -N test-client@server-ip &

# 4. Vérifier le tunnel
lsof -i:3020

# 5. Tester l'accès DIOO
curl http://localhost:3020
```

#### **Résultats attendus :**
- ✅ Connexion SSH réussie sans mot de passe
- ✅ Tunnel SSH établi sur port 3020
- ✅ Application DIOO accessible via http://localhost:3020

---

### **🔧 Test 8 : Connexion Client Complète**

#### **Objectif :** Valider le processus complet de connexion client

#### **Procédure Windows :**
```cmd
# 1. Placer la clé SSH
copy test-client-private.key C:\DIOO-Access\dioo-key.pem

# 2. Lancer la connexion
C:\DIOO-Access\connect-dioo.bat

# 3. Vérifier l'ouverture automatique du navigateur
```

#### **Procédure Linux/Mac :**
```bash
# 1. Placer la clé SSH
cp test-client-private.key ~/DIOO-Access/dioo-key.pem
chmod 600 ~/DIOO-Access/dioo-key.pem

# 2. Lancer la connexion
~/DIOO-Access/connect-dioo.sh
# OU si alias configuré :
dioo

# 3. Vérifier l'ouverture automatique du navigateur
```

#### **Résultats attendus :**
- ✅ Tunnel SSH établi automatiquement
- ✅ Navigateur s'ouvre sur http://localhost:3020
- ✅ Application DIOO fonctionnelle
- ✅ Reconnexion automatique en cas de coupure
- ✅ Fermeture propre avec Ctrl+C

---

## 🌐 TESTS DE SCÉNARIOS RÉELS

### **🔧 Test 9 : Scénario Entreprise Interne**

#### **Configuration :**
- Serveur Ubuntu sur réseau local (192.168.1.100)
- 3 clients : Windows, Linux, Mac
- Firewall configuré pour réseau local uniquement

#### **Procédure :**
```bash
# Serveur : Configurer firewall réseau local
sudo ufw allow from 192.168.1.0/24 to any port 3020

# Clients : Tester depuis différents OS
# Vérifier que l'accès fonctionne depuis le réseau local
# Vérifier que l'accès est bloqué depuis l'extérieur
```

---

### **🔧 Test 10 : Scénario Télétravail**

#### **Configuration :**
- Serveur Ubuntu accessible via internet
- Client à domicile avec IP dynamique
- Authentification SSH par clés uniquement

#### **Procédure :**
```bash
# Serveur : Configuration sécurisée
sudo ufw deny 3020  # Bloquer l'accès direct
# Seul SSH tunnel autorisé

# Client : Connexion depuis domicile
# Tester la stabilité sur connexion instable
# Vérifier la reconnexion automatique
```

---

### **🔧 Test 11 : Scénario Démonstration Client**

#### **Configuration :**
- Accès temporaire pour présentation
- Compte SSH avec durée de vie limitée
- Audit des connexions

#### **Procédure :**
```bash
# Serveur : Créer compte temporaire
sudo adduser demo-client --disabled-password
# Configurer expiration : sudo chage -E 2024-12-31 demo-client

# Client : Tester l'accès pendant la période
# Vérifier que l'accès est révoqué après expiration
```

---

## 📊 CHECKLIST DE VALIDATION

### **✅ Tests Serveur Ubuntu**
- [ ] Installation automatique réussie
- [ ] Installation manuelle réussie  
- [ ] Détection environnement headless
- [ ] Service systemd fonctionnel
- [ ] Firewall correctement configuré
- [ ] Génération clés SSH réussie

### **✅ Tests Client**
- [ ] Configuration Windows automatique
- [ ] Configuration Linux/Mac automatique
- [ ] Scripts personnalisés générés
- [ ] Permissions correctes appliquées
- [ ] Alias et raccourcis créés

### **✅ Tests Connexion SSH**
- [ ] Authentification par clés réussie
- [ ] Tunnel SSH établi automatiquement
- [ ] Application accessible via tunnel
- [ ] Reconnexion automatique fonctionnelle
- [ ] Fermeture propre des connexions

### **✅ Tests Scénarios Réels**
- [ ] Entreprise interne validé
- [ ] Télétravail validé
- [ ] Démonstration client validée
- [ ] Sécurité et audit fonctionnels

---

## 🚨 Dépannage des Tests

### **Problèmes Courants :**

#### **"Node.js non installé" :**
```bash
# Vérifier les sources APT
cat /etc/apt/sources.list.d/nodesource.list
# Réinstaller si nécessaire
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

#### **"Service ne démarre pas" :**
```bash
# Vérifier les logs
sudo journalctl -u dioo -n 50
# Vérifier les permissions
sudo chown -R dioo:dioo /opt/dioo
```

#### **"SSH Connection refused" :**
```bash
# Vérifier SSH serveur
sudo systemctl status ssh
# Vérifier firewall
sudo ufw status
# Tester connectivité
telnet server-ip 22
```

#### **"Tunnel ne s'établit pas" :**
```bash
# Vérifier permissions clé
chmod 600 cle-ssh.pem
# Tester SSH direct
ssh -i cle-ssh.pem user@server
# Debug verbose
ssh -v -i cle-ssh.pem -L 3020:localhost:3020 user@server
```

---

## 🎯 Critères de Succès

### **Déploiement Réussi :**
- ✅ Installation serveur en moins de 10 minutes
- ✅ Configuration client en moins de 5 minutes
- ✅ Première connexion réussie du premier coup
- ✅ Application DIOO accessible et fonctionnelle
- ✅ Sécurité SSH validée
- ✅ Reconnexion automatique opérationnelle

### **Performance Attendue :**
- ⚡ Temps d'établissement tunnel : < 10 secondes
- ⚡ Temps de chargement DIOO : < 5 secondes
- ⚡ Latence acceptable via tunnel SSH
- ⚡ Stabilité sur connexions longues (> 8h)

**🎉 Si tous les tests passent, le déploiement DIOO est validé et prêt pour la production !**