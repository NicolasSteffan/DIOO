# Phase 3 - Plan de Migration SQL.js - DIOO

## 🎯 Objectif Phase 3

Remplacer complètement le système custom de parsing SQL et localStorage par une vraie base de données SQLite en mémoire via SQL.js.

**Version cible**: v0.000C-SQLjs-Migration  
**Réduction de code attendue**: ~80% (suppression de tout le parsing custom)

## 📋 État actuel (Post Phase 2)

### ✅ Acquis
- ✅ Architecture modulaire complète
- ✅ SQLParser centralisé (facile à remplacer)
- ✅ StorageManager unifié (migration vers SQLite)
- ✅ Fonctions obsolètes identifiées et marquées @deprecated
- ✅ extractDataStructure() pour logique unifiée

### 🎯 À migrer
- 🔄 SQLParser → SQL.js natif
- 🔄 StorageManager → SQLite en mémoire
- 🗑️ Suppression définitive des fonctions obsolètes
- 🔄 Adaptation des requêtes pour SQL.js

## 📊 Plan détaillé Phase 3

### Étape 3.1 - Préparation SQL.js

#### 3.1.1 Installation SQL.js
```bash
# Télécharger SQL.js
curl -o sql-wasm.js https://sql.js.org/dist/sql-wasm.js
curl -o sql-wasm.wasm https://sql.js.org/dist/sql-wasm.wasm
```

#### 3.1.2 Intégration HTML
```html
<!-- Dans index.html -->
<script src="sql-wasm.js"></script>
```

#### 3.1.3 Initialisation base
```javascript
// Nouveau module: scripts/database-manager.js
class DatabaseManager {
    constructor() {
        this.db = null;
        this.SQL = null;
    }
    
    async init() {
        this.SQL = await initSqlJs({
            locateFile: file => `./${file}`
        });
        this.db = new this.SQL.Database();
        this.createTables();
    }
    
    createTables() {
        // CREATE TABLE dioo_donnees
        // CREATE TABLE dioo_summary  
        // CREATE TABLE dioo_metadata
    }
}
```

### Étape 3.2 - Migration StorageManager → DatabaseManager

#### 3.2.1 Nouveau DatabaseManager
```javascript
// scripts/database-manager.js
class DatabaseManager {
    // Remplace StorageManager avec vraie DB SQLite
    
    async setDonnees(data) {
        // INSERT INTO dioo_donnees
        // Remplace localStorage
    }
    
    async getDonnees() {
        // SELECT * FROM dioo_donnees
        // Remplace JSON.parse(localStorage.getItem())
    }
    
    async executeQuery(sql, params = []) {
        // Exécution SQL.js native
        // Remplace tout le parsing custom
    }
    
    async getStats() {
        // SELECT COUNT(*), SUM(length(data)) FROM tables
        // Statistiques via SQL natif
    }
}
```

#### 3.2.2 Migration des données
```javascript
// Fonction de migration localStorage → SQLite
async function migrateFromLocalStorage() {
    const oldData = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
    const { lignes, headers } = extractDataStructure(oldData);
    
    // Créer la table avec les bonnes colonnes
    const createTable = `CREATE TABLE dioo_donnees (${headers.map(h => `"${h}" TEXT`).join(', ')})`;
    await db.executeQuery(createTable);
    
    // Insérer les données
    for (const ligne of lignes) {
        const values = headers.map(h => ligne[h] || '');
        const placeholders = headers.map(() => '?').join(', ');
        await db.executeQuery(`INSERT INTO dioo_donnees VALUES (${placeholders})`, values);
    }
}
```

### Étape 3.3 - Remplacement SQLParser → SQL.js natif

#### 3.3.1 Suppression SQLParser
```javascript
// scripts/sql-parser.js → SUPPRIMÉ
// Tout le parsing custom supprimé (~500 lignes)

// Remplacement direct par SQL.js
async function executeCustomQuery() {
    const query = document.getElementById('custom-query-input').value;
    
    // Plus de validation custom - SQL.js gère tout
    try {
        const results = await DatabaseManager.executeQuery(query);
        afficherResultats(results);
    } catch (error) {
        // SQL.js donne des erreurs SQL précises
        afficherErreur(`Erreur SQL: ${error.message}`);
    }
}
```

#### 3.3.2 Requêtes prédéfinies simplifiées
```javascript
// Dans executeQuery()
switch (queryType) {
    case 'total_lignes':
        return await DatabaseManager.executeQuery('SELECT COUNT(*) as count FROM dioo_donnees');
        
    case 'premieres_lignes':
        return await DatabaseManager.executeQuery('SELECT * FROM dioo_donnees LIMIT 10');
        
    case 'info_tables':
        return await DatabaseManager.executeQuery("SELECT name FROM sqlite_master WHERE type='table'");
}
```

### Étape 3.4 - Suppression définitive du code obsolète

#### 3.4.1 Fonctions à supprimer complètement
- ❌ `executerFiltreSimple()` (~200 lignes)
- ❌ `filtrerLignesAvecWhere()` (~150 lignes)  
- ❌ `creerRequeteSQLJS()` (~100 lignes)
- ❌ Tout le parsing regex custom (~300 lignes)

#### 3.4.2 Modules à supprimer/simplifier
- ❌ `scripts/sql-parser.js` → SUPPRIMÉ COMPLÈTEMENT
- 🔄 `scripts/regex-patterns.js` → Simplifié (garde juste Excel date)
- 🔄 `scripts/storage-manager.js` → Remplacé par database-manager.js

### Étape 3.5 - Adaptation de l'interface

#### 3.5.1 Chargement asynchrone
```javascript
// Toutes les opérations DB deviennent async
async function gererClicCharger() {
    // await DatabaseManager.init() si pas déjà fait
    // await DatabaseManager.insertData()
}

async function calculerConsolidation() {
    const results = await DatabaseManager.executeQuery(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN "Functional monitoring (BSM)" = 'YES' THEN 1 ELSE 0 END) as monitored
        FROM dioo_donnees 
        WHERE "Dx" LIKE 'DP%' AND "Business criticality" = 'Critical'
    `);
}
```

#### 3.5.2 Gestion d'erreurs SQL natives
```javascript
// Plus besoin de validation custom
// SQL.js donne des erreurs précises et standards
try {
    const results = await db.executeQuery(userQuery);
} catch (error) {
    if (error.message.includes('syntax error')) {
        showError('Erreur de syntaxe SQL');
    } else if (error.message.includes('no such table')) {
        showError('Table inexistante');
    }
    // etc.
}
```

## 📊 Impact attendu Phase 3

### Réduction de code massive

| Composant | Avant | Après | Réduction |
|-----------|-------|-------|-----------|
| `scripts/sql-parser.js` | 500 lignes | 0 lignes | -100% |
| `executerFiltreSimple()` | 200 lignes | 0 lignes | -100% |
| `filtrerLignesAvecWhere()` | 150 lignes | 0 lignes | -100% |
| `creerRequeteSQLJS()` | 100 lignes | 0 lignes | -100% |
| Parsing regex custom | 300 lignes | 0 lignes | -100% |
| **TOTAL** | **1250 lignes** | **0 lignes** | **-100%** |

### Nouveau code SQL.js

| Composant | Lignes |
|-----------|--------|
| `scripts/database-manager.js` | ~200 lignes |
| Migration localStorage | ~50 lignes |
| Adaptations async | ~100 lignes |
| **TOTAL NOUVEAU** | **~350 lignes** |

### **Bilan net: -900 lignes (-72%)**

## 🧪 Plan de tests Phase 3

### Tests de migration
1. **Migration localStorage → SQLite**: Vérifier intégrité des données
2. **Requêtes SQL natives**: Tester toutes les requêtes prédéfinies
3. **Requêtes custom**: Tester syntaxe SQL standard
4. **Performance**: Comparer vitesse SQL.js vs parsing custom

### Tests de régression
1. **Chargement fichier Excel**: Doit fonctionner identiquement
2. **Calculs consolidation**: Résultats identiques
3. **Interface utilisateur**: Aucun changement visible
4. **Persistence**: Données conservées entre sessions

## 🎯 Critères de succès Phase 3

### Fonctionnalités
- ✅ Toutes les fonctionnalités existantes préservées
- ✅ Requêtes SQL standard supportées (plus de limitations custom)
- ✅ Performance égale ou supérieure
- ✅ Messages d'erreur SQL précis

### Code
- ✅ Suppression de 900+ lignes de code obsolète
- ✅ Architecture simplifiée (SQL.js natif)
- ✅ Plus de parsing custom fragile
- ✅ Maintenance réduite drastiquement

### Utilisateur
- ✅ Interface identique (transparence totale)
- ✅ Fonctionnalités étendues (SQL complet)
- ✅ Erreurs plus claires
- ✅ Performance améliorée

## 🚀 Étapes d'exécution Phase 3

### Sprint 3.1 - Préparation (1-2h)
1. Télécharger et intégrer SQL.js
2. Créer DatabaseManager de base
3. Tests d'initialisation

### Sprint 3.2 - Migration données (2-3h)
1. Fonction de migration localStorage → SQLite
2. Adaptation extractDataStructure
3. Tests de migration

### Sprint 3.3 - Remplacement requêtes (2-3h)
1. Remplacer executeCustomQuery par SQL.js natif
2. Adapter executeQuery pour requêtes prédéfinies
3. Tests de requêtes

### Sprint 3.4 - Nettoyage final (1-2h)
1. Supprimer définitivement fonctions obsolètes
2. Nettoyer modules inutiles
3. Tests de régression complets

### Sprint 3.5 - Finalisation (1h)
1. Documentation finale
2. Commit et tag v0.000C
3. Validation complète

**Durée totale estimée: 7-11h**

---

## 🎉 Vision finale

Après la Phase 3, DIOO aura:
- ✅ **Architecture moderne**: SQLite + SQL.js
- ✅ **Code minimal**: -80% de code obsolète supprimé
- ✅ **SQL standard**: Plus de limitations custom
- ✅ **Maintenance facile**: Plus de parsing fragile
- ✅ **Performance optimale**: Base de données native
- ✅ **Évolutivité**: Prêt pour nouvelles fonctionnalités

**DIOO deviendra une application moderne, maintenable et performante !** 🚀