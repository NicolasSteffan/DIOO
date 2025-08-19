# DIOO - Extract & Viewer Database

**Version**: v0.000-stable-extract-viewer-database  
**Date**: 19 août 2025  
**Status**: ✅ Production Ready

## 🎯 Description

Application web complète pour l'extraction, la visualisation et l'interrogation des données DIOO (Digital Infrastructure Operations Overview). Cette version stable offre une interface intuitive pour gérer les données d'applications critiques avec des fonctionnalités avancées de requêtage et de monitoring.

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** (v14+)
- **http-server** (`npm install -g http-server`)

### Installation et lancement
```bash
# Cloner le projet
git clone [repository-url]
cd DIOO

# Lancer l'application
.\go.bat
```

L'application sera accessible sur : **http://localhost:3020**

## 📋 Fonctionnalités

### 📁 **Module Chargement**
- **Import Excel** : Support multi-onglets avec détection automatique
- **Validation des données** : Contrôles de cohérence et format
- **Overview fichier** : Visualisation paginée (10 lignes/page)
- **Dump des requêtes** : Traçabilité complète des opérations

### 📊 **Module Monitoring**
- **Calculs de consolidation** : Métriques automatiques sur applications critiques
- **Visualisation graphique** : Charts interactifs avec Chart.js
- **Sections organisées** : DP, DPA, DPB, DPC, DPP, DPS
- **Indicateurs visuels** : LED colorées et sections pliables

### 🗄️ **Module DataBase**
- **Requêtes prédéfinies** : Accès rapide aux données courantes
- **SQL personnalisé** : Support complet avec parser avancé
- **Pagination intelligente** : Automatique pour les gros résultats (50+)
- **Gestion des données** : CRUD complet avec traçabilité

## 🔧 Architecture technique

### Structure des données
```javascript
// Format de stockage localStorage
{
  "dioo_donnees": {
    "donnees": [...],     // Tableau d'objets
    "headers": [...]      // Noms des colonnes
  },
  "dioo_summary": [...],  // Résultats consolidation
  "dioo_rand_counter": 0  // Compteur lignes aléatoires
}
```

### Colonnes supportées
- **Dx** : Identifiant application
- **App Appli** : Nom de l'application
- **App Code** : Code application
- **Business criticality** : Niveau de criticité
- **Functional monitoring (BSM)** : Monitoring fonctionnel
- **HCC eligibility** : Éligibilité HCC
- **In HCC** : Statut HCC

### Requêtes SQL supportées
```sql
-- Sélection de colonnes
SELECT [Dx] FROM dioo_donnees;
SELECT [Dx], [Business criticality] FROM dioo_donnees;

-- Avec conditions
SELECT * FROM dioo_donnees WHERE [Business criticality] = 'Critical';

-- Comptage
SELECT COUNT(*) FROM dioo_donnees;
```

## 🎨 Interface utilisateur

### Thème et design
- **Couleurs** : Palette FDJ (turquoise, bleu, gris)
- **Responsive** : Adaptation mobile/desktop
- **Accessibilité** : Contrastes et navigation clavier

### Composants interactifs
- **LED d'état** : Grise (fermé) / Verte (ouvert)
- **Sections pliables** : Avec flèches directionnelles
- **Pagination** : Contrôles complets (première, précédente, suivante, dernière)
- **Notifications** : Messages de succès/erreur

## 📊 Métriques et performances

### Capacités
- **Données** : Jusqu'à 10,000+ lignes testées
- **Colonnes** : Support illimité
- **Requêtes** : Exécution < 100ms pour datasets moyens
- **Pagination** : Rendu instantané

### Optimisations
- **Lazy loading** : Chargement à la demande
- **Pagination automatique** : Évite les blocages UI
- **Cache localStorage** : Persistance locale
- **Parsing optimisé** : Regex efficaces pour SQL

## 🔒 Sécurité et données

### Stockage
- **Local uniquement** : Aucune donnée transmise en réseau
- **Persistance** : localStorage du navigateur
- **Effacement** : Fonction de nettoyage complète

### Validation
- **Format Excel** : Vérification structure et contenu
- **Types de données** : Validation automatique
- **Intégrité** : Contrôles de cohérence

## 🐛 Dépannage

### Problèmes courants
1. **"Aucune donnée"** → Vérifier le chargement du fichier Excel
2. **"Erreur de requête"** → Vérifier la syntaxe SQL
3. **"Pagination manquante"** → Rafraîchir la page (F5)

### Logs de débogage
```javascript
// Console développeur
dioo.diagnostic();        // État général
dioo.compterLignes();    // Nombre de lignes
dioo.getLocalStorage();  // Contenu localStorage
```

## 📝 Changelog

### v0.000 - Stable - Extract - Viewer Database
- ✅ **Modules complets** : Chargement, Monitoring, DataBase
- ✅ **Parser SQL avancé** : Support colonnes spécifiques
- ✅ **Pagination intelligente** : Automatique selon volume
- ✅ **Interface unifiée** : CSS cohérent et responsive
- ✅ **Corrections majeures** : Accès données, initialisation variables

## 👥 Support

Pour toute question ou problème :
1. Consulter les logs de la console (F12)
2. Vérifier la documentation SQL (`docs/requetes_sql.md`)
3. Utiliser les fonctions de diagnostic intégrées

---

**🎉 DIOO v0.000 - Une solution complète et stable pour la gestion des données d'infrastructure digitale.**