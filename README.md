# DIOO - Application de Gestion

Une application web moderne avec une interface utilisateur claire et intuitive, comportant deux modules principaux : **Chargement** et **Monitoring**.

## 🚀 Fonctionnalités

### 📋 Structure de l'application
- **Page Chargement** : Interface pour le chargement et l'import de données
- **Page Monitoring** : Interface pour la surveillance et le monitoring des systèmes
- Navigation intuitive avec menu principal
- Design responsive adapté aux différentes tailles d'écran

### 🎨 Interface utilisateur
- Design moderne et professionnel
- Icônes Font Awesome pour une meilleure expérience utilisateur
- Animations fluides et transitions élégantes
- Thème cohérent avec variables CSS personnalisées

### ⌨️ Raccourcis clavier
- `Alt + 1` : Naviguer vers la page Chargement
- `Alt + 2` : Naviguer vers la page Monitoring  
- `Échap` : Retourner à la page d'accueil (Chargement)

## 📁 Structure du projet

```
DIOO/
├── index.html          # Page principale de l'application
├── styles/
│   └── main.css        # Styles CSS principaux
├── scripts/
│   └── main.js         # Logique JavaScript de l'application
└── README.md           # Documentation du projet
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique de l'application
- **CSS3** : Styles modernes avec variables CSS et Flexbox/Grid
- **JavaScript (ES6+)** : Logique applicative avec classes et modules
- **Font Awesome** : Icônes vectorielles
- **Design Responsive** : Compatible mobile, tablette et desktop

## 🚀 Installation et utilisation

### Prérequis
Aucun prérequis spécifique. L'application fonctionne directement dans un navigateur web moderne.

### Lancement
1. Cloner le repository :
   ```bash
   git clone git@github.com:NicolasSteffan/DIOO.git
   cd DIOO
   ```

2. Ouvrir le fichier `index.html` dans un navigateur web

### Utilisation avec un serveur local (recommandé)
Pour éviter les problèmes de CORS et avoir une expérience optimale :

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si npx est installé)
npx serve .

# Avec PHP
php -S localhost:8000
```

Puis ouvrir : http://localhost:8000

## 🏗️ Architecture de l'application

### Classe principale : `DiooApp`
La classe `DiooApp` gère :
- Navigation entre les pages
- Gestion des événements utilisateur
- Raccourcis clavier
- État de l'application

### Utilitaires : `DiooUtils`
Fonctions utilitaires pour :
- Formatage des dates
- Détection du type d'appareil
- Notifications (extensible)

### Système de navigation
- Navigation basée sur les attributs `data-page`
- Gestion des états actifs/inactifs
- Transitions animées entre les pages

## 🎯 Pages de l'application

### Page Chargement
- **Objectif** : Interface pour le chargement et l'import de données
- **Fonctionnalités prévues** :
  - Upload de fichiers
  - Import de données
  - Validation des données

### Page Monitoring
- **Objectif** : Interface pour la surveillance et le monitoring
- **Fonctionnalités prévues** :
  - Métriques en temps réel
  - Alertes système
  - Tableaux de bord

## 🔧 Personnalisation

### Variables CSS
Les couleurs et styles peuvent être facilement modifiés via les variables CSS dans `styles/main.css` :

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    --success-color: #10b981;
    /* ... autres variables */
}
```

### Ajout de nouvelles pages
1. Ajouter la page dans le tableau `pages` de la classe `DiooApp`
2. Créer la structure HTML correspondante
3. Ajouter un bouton de navigation dans le header
4. Mettre à jour les styles si nécessaire

## 🐛 Débogage

L'application expose une API de débogage accessible via la console :

```javascript
// Naviguer vers une page
dioo.navigateTo('monitoring');

// Obtenir l'état de l'application
dioo.getState();

// Réinitialiser l'application
dioo.reset();

// Vérifier la version
dioo.version;
```

## 🚀 Développement futur

### Fonctionnalités à implémenter
- [ ] Système de notifications visuelles
- [ ] Sauvegarde de l'état de navigation
- [ ] Thèmes multiples (clair/sombre)
- [ ] Internationalisation (i18n)
- [ ] Tests automatisés
- [ ] Progressive Web App (PWA)

### Intégrations possibles
- [ ] API REST pour le chargement de données
- [ ] WebSockets pour le monitoring en temps réel
- [ ] Base de données locale (IndexedDB)
- [ ] Authentification utilisateur

## 📝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche pour votre fonctionnalité
3. Commiter vos modifications
4. Pousser vers la branche
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Août 2025  
**Auteur** : Nicolas Steffan