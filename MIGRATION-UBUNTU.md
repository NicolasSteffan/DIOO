# 🐧 Migration DIOO vers Ubuntu Linux

## 📋 Guide de migration depuis Windows

### **🎯 Résumé**
Ce projet DIOO a été développé sur Windows avec un script `go.bat`. Pour Ubuntu Linux, utilisez les scripts équivalents `go.sh` et `stop.sh`.

---

## **📁 Fichiers de lancement**

| Windows | Ubuntu Linux | Description |
|---------|--------------|-------------|
| `go.bat` | `go.sh` | Lance l'application DIOO |
| `stop.bat` | `stop.sh` | Arrête l'application DIOO |

---

## **🚀 Installation sur Ubuntu**

### **1. Prérequis système**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js et npm (si pas déjà installé)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérification
node --version
npm --version
```

### **2. Installation des dépendances**
```bash
# Installation globale de http-server (recommandé)
sudo npm install -g http-server

# OU installation locale (si pas de droits admin)
npm install http-server
```

### **3. Permissions des scripts**
```bash
# Rendre les scripts exécutables
chmod +x go.sh stop.sh
```

---

## **🎮 Utilisation sur Ubuntu**

### **Lancement de l'application**
```bash
# Méthode 1: Script direct
./go.sh

# Méthode 2: Via bash
bash go.sh
```

### **Arrêt de l'application**
```bash
# Méthode 1: Ctrl+C dans le terminal du serveur
# Méthode 2: Script d'arrêt
./stop.sh

# Méthode 3: Arrêt manuel
kill $(lsof -ti:3020)
```

---

## **🔧 Fonctionnalités des scripts Linux**

### **`go.sh` - Lancement automatique**
- ✅ **Détection automatique** de Node.js
- ✅ **Installation automatique** de http-server si manquant
- ✅ **Arrêt des processus** existants sur le port 3020
- ✅ **Lancement du serveur** en arrière-plan
- ✅ **Ouverture automatique** du navigateur
- ✅ **Support multi-navigateurs** : Chrome, Chromium, Firefox
- ✅ **Affichage coloré** avec codes de statut
- ✅ **Gestion d'erreurs** complète

### **`stop.sh` - Arrêt propre**
- ✅ **Détection des processus** sur le port 3020
- ✅ **Arrêt progressif** (SIGTERM puis SIGKILL)
- ✅ **Vérification finale** de libération du port
- ✅ **Affichage des processus** restants si nécessaire

---

## **🌐 Navigateurs supportés**

### **Ordre de priorité d'ouverture**
1. **Google Chrome** (`google-chrome`)
2. **Chromium** (`chromium-browser`)
3. **Firefox** (`firefox`)
4. **Navigateur par défaut** (`xdg-open`)

### **Installation des navigateurs**
```bash
# Google Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt update
sudo apt install google-chrome-stable

# Chromium (alternative légère)
sudo apt install chromium-browser

# Firefox
sudo apt install firefox
```

---

## **📊 Comparaison Windows vs Ubuntu**

| Fonctionnalité | Windows (`go.bat`) | Ubuntu (`go.sh`) |
|----------------|-------------------|------------------|
| **Détection processus** | `netstat + taskkill` | `lsof + kill` |
| **Installation Node.js** | Manuel | Automatique via apt |
| **Navigateur par défaut** | Edge → Chrome → Défaut | Chrome → Chromium → Firefox → Défaut |
| **Couleurs terminal** | Non | Oui (codes ANSI) |
| **Arrière-plan** | `start /MIN` | `nohup ... &` |
| **Permissions** | Automatiques | `chmod +x` requis |

---

## **🐛 Dépannage**

### **Problème: "Permission denied"**
```bash
# Solution
chmod +x go.sh stop.sh
```

### **Problème: "Node.js non détecté"**
```bash
# Vérification
which node
node --version

# Installation manuelle
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **Problème: "Port 3020 occupé"**
```bash
# Voir les processus sur le port
sudo lsof -i:3020

# Arrêter tous les processus
sudo kill $(lsof -ti:3020)

# Ou utiliser le script
./stop.sh
```

### **Problème: "http-server non trouvé"**
```bash
# Installation globale
sudo npm install -g http-server

# Installation locale
npm install http-server
# Puis modifier go.sh pour utiliser: npx http-server
```

---

## **🔗 URLs et accès**

- **Application locale** : http://localhost:3020
- **Fichier direct** : file:///chemin/vers/projet/index.html
- **Réseau local** : http://[IP-UBUNTU]:3020

---

## **📝 Notes importantes**

1. **Firewall Ubuntu** : Le port 3020 doit être ouvert pour l'accès réseau
2. **WSL** : Ces scripts fonctionnent aussi sous Windows Subsystem for Linux
3. **Docker** : Possibilité de conteneuriser avec un Dockerfile basé sur Ubuntu
4. **Systemd** : Possibilité de créer un service système pour démarrage automatique

---

## **✅ Checklist de migration**

- [ ] Copier tous les fichiers du projet
- [ ] Installer Node.js sur Ubuntu
- [ ] Rendre les scripts exécutables (`chmod +x`)
- [ ] Tester le lancement avec `./go.sh`
- [ ] Vérifier l'ouverture du navigateur
- [ ] Tester l'arrêt avec `./stop.sh`
- [ ] Configurer le firewall si accès réseau nécessaire

---

**🎉 Votre application DIOO est maintenant prête pour Ubuntu Linux !**