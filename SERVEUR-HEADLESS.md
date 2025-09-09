# 🖥️ DIOO sur Serveur Linux Headless (Sans Interface Graphique)

## 🎯 Solutions pour accéder à DIOO via SSH

### **📋 Contexte**
Votre machine Linux virtuelle **sans interface graphique** ne peut pas lancer Firefox directement, mais vous pouvez accéder à DIOO de plusieurs façons.

**💡 Important :** SSH Tunnel n'est PAS réservé au développement ! C'est une solution **professionnelle de premier plan** pour les clients, offrant sécurité maximale et simplicité d'usage.

---

## **🚀 Solution 1: SSH Tunnel (Recommandée pour Clients)**

### **Sur le serveur Ubuntu (headless) :**
```bash
# Lancer DIOO normalement
./go.sh

# Le script détectera automatiquement l'environnement headless
# et affichera les instructions d'accès
```

### **Depuis votre machine locale (Windows/Mac/Linux) :**
```bash
# Créer un tunnel SSH (remplacez 'user' et 'IP_SERVEUR')
ssh -L 3020:localhost:3020 user@IP_SERVEUR

# Dans un autre terminal ou après connexion SSH
# Ouvrir dans votre navigateur local :
# http://localhost:3020
```

### **Exemple concret :**
```bash
# Si votre serveur Ubuntu a l'IP 192.168.1.100
ssh -L 3020:localhost:3020 nicolas@192.168.1.100

# Puis ouvrir http://localhost:3020 sur votre machine locale
```

---

## **🌐 Solution 2: Accès Réseau Direct**

### **Configuration du firewall Ubuntu :**
```bash
# Autoriser le port 3020
sudo ufw allow 3020

# Vérifier le statut
sudo ufw status
```

### **Lancement avec accès réseau :**
```bash
# Lancer DIOO
./go.sh

# Le script affichera automatiquement l'IP d'accès
# Exemple: http://192.168.1.100:3020
```

### **Accès depuis votre navigateur local :**
```
http://IP_DU_SERVEUR:3020
```

---

## **🔧 Solution 3: SSH avec X11 Forwarding**

### **Si vous voulez vraiment Firefox sur le serveur :**
```bash
# Installer Firefox sur Ubuntu headless
sudo apt update
sudo apt install firefox

# Connexion SSH avec X11 forwarding
ssh -X user@IP_SERVEUR

# Lancer Firefox (s'affichera sur votre écran local)
firefox http://localhost:3020 &
```

**⚠️ Note :** Cette solution est plus lente et nécessite un serveur X11 sur votre machine locale.

---

## **🐳 Solution 4: Docker avec Port Mapping**

### **Créer un Dockerfile :**
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

# Copier les fichiers du projet
WORKDIR /app
COPY . .

# Exposer le port
EXPOSE 3020

# Lancer l'application
CMD ["http-server", ".", "-p", "3020", "-c-1", "--cors"]
```

### **Construction et lancement :**
```bash
# Construire l'image
docker build -t dioo-app .

# Lancer le conteneur
docker run -d -p 3020:3020 --name dioo dioo-app

# Accéder via http://IP_SERVEUR:3020
```

---

## **📱 Solution 5: Serveur Web Nginx (Production)**

### **Installation et configuration :**
```bash
# Installer Nginx
sudo apt install nginx

# Créer la configuration
sudo tee /etc/nginx/sites-available/dioo << EOF
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:3020;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Activer le site
sudo ln -s /etc/nginx/sites-available/dioo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Accéder via http://votre-domaine.com
```

---

## **🔍 Détection Automatique dans go.sh**

Le script `go.sh` modifié détecte automatiquement l'environnement :

```bash
# Variables d'environnement vérifiées :
# - $DISPLAY (X11)
# - $WAYLAND_DISPLAY (Wayland)

# Si aucune n'est définie → Mode headless activé
# Affichage automatique des instructions d'accès
```

### **Sortie exemple en mode headless :**
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

## **🛡️ Sécurité et Bonnes Pratiques**

### **Firewall et accès réseau :**
```bash
# Autoriser seulement depuis votre réseau local
sudo ufw allow from 192.168.1.0/24 to any port 3020

# Ou depuis une IP spécifique
sudo ufw allow from 192.168.1.50 to any port 3020
```

### **Authentification SSH avec clés :**
```bash
# Générer une paire de clés (sur votre machine locale)
ssh-keygen -t rsa -b 4096

# Copier la clé publique sur le serveur
ssh-copy-id user@IP_SERVEUR
```

### **Systemd service (démarrage automatique) :**
```bash
# Créer le service
sudo tee /etc/systemd/system/dioo.service << EOF
[Unit]
Description=DIOO Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/dioo
ExecStart=/usr/bin/http-server . -p 3020 -c-1 --cors
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Activer et démarrer
sudo systemctl enable dioo
sudo systemctl start dioo
```

---

## **🔧 Dépannage**

### **Problème: "Connection refused"**
```bash
# Vérifier que le serveur écoute
netstat -tlnp | grep 3020
# ou
ss -tlnp | grep 3020
```

### **Problème: "Firewall bloque"**
```bash
# Vérifier les règles UFW
sudo ufw status verbose

# Tester depuis le serveur
curl http://localhost:3020
```

### **Problème: "SSH tunnel ne fonctionne pas"**
```bash
# Vérifier la configuration SSH
ssh -v -L 3020:localhost:3020 user@IP_SERVEUR

# Tester le tunnel
curl http://localhost:3020
```

---

## **📊 Comparaison des Solutions**

| Solution | Sécurité | Performance | Complexité | Usage |
|----------|----------|-------------|------------|-------|
| **SSH Tunnel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | **Clients & Production** |
| **Accès Direct** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | Réseau local |
| **X11 Forward** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | Debug ponctuel |
| **Docker** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Déploiement |
| **Nginx Proxy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Production web |

---

## **✅ Recommandation**

**Pour votre cas (VM headless via SSH) :**

1. **Clients Professionnels** → **SSH Tunnel** (Solution 1) - Sécurité maximale
2. **Accès Interne/Demo** → **Accès Direct** (Solution 2) - Simplicité  
3. **Production Web Publique** → **Nginx Proxy** (Solution 5) - Performance

**💡 SSH Tunnel est LA solution professionnelle pour clients !**

**🎉 Le script `go.sh` détectera automatiquement votre environnement headless et vous guidera !**