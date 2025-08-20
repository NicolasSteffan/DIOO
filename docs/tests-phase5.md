# 🧪 PHASE 5 - Plan de Tests Complets

## ✅ **Tests à effectuer**

### **1. Module Chargement**
- [ ] **Chargement CSV** : Fichier CSV avec données DIOO
- [ ] **Chargement Excel** : Fichier .xlsx avec plusieurs onglets
- [ ] **Validation données** : Vérification structure après chargement
- [ ] **Gestion erreurs** : Fichiers corrompus/invalides

### **2. Module Database (Requêtes prédéfinies)**
- [ ] **Informations tables** : `PRAGMA table_info(dioo_donnees)`
- [ ] **Total lignes** : `SELECT COUNT(*) FROM dioo_donnees`
- [ ] **Premières lignes** : `SELECT * FROM dioo_donnees LIMIT 10`
- [ ] **Ajouter ligne aléatoire** : `INSERT INTO dioo_donnees`

### **3. Module Database (Requêtes personnalisées)**
- [ ] **SELECT simple** : `SELECT * FROM dioo_donnees WHERE "Dx" = 'DP'`
- [ ] **COUNT avec WHERE** : `SELECT COUNT(*) FROM dioo_donnees WHERE "Business criticality" = 'Critical'`
- [ ] **SELECT colonnes** : `SELECT "Dx", "App Appli" FROM dioo_donnees`
- [ ] **Requêtes complexes** : JOINs, GROUP BY, ORDER BY

### **4. Module Monitoring (Consolidation)**
- [ ] **Calcul consolidation** : Génération des métriques DP*
- [ ] **Sections dynamiques** : DP1, DP2, DP3, DP4, DP5
- [ ] **Graphiques** : Affichage des charts par section
- [ ] **Historique** : Sauvegarde et récupération

### **5. Interface utilisateur**
- [ ] **Navigation** : Alt+1 (Chargement), Alt+2 (Monitoring)
- [ ] **Responsive** : Affichage sur différentes tailles
- [ ] **Boutons** : Tous les boutons fonctionnels
- [ ] **Messages** : Erreurs et succès affichés

### **6. Persistance des données**
- [ ] **LocalStorage** : Sauvegarde automatique
- [ ] **Rechargement page** : Données conservées
- [ ] **Migration** : Compatibilité anciennes versions
- [ ] **Nettoyage** : Effacement complet

## 🎯 **Critères de validation**

### **Performance**
- Chargement fichier < 5 secondes
- Requêtes SQL < 1 seconde
- Interface réactive

### **Robustesse**
- Gestion erreurs gracieuse
- Pas de crash JavaScript
- Messages utilisateur clairs

### **Fonctionnalité**
- Toutes les fonctions opérationnelles
- Résultats corrects
- Données cohérentes

## 📊 **Résultats des tests**

### ✅ **Tests réussis**
- (À remplir pendant les tests)

### ❌ **Tests échoués**
- (À documenter avec solutions)

### ⚠️ **Points d'attention**
- (À noter pour améliorations futures)