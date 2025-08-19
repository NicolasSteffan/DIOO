/**
 * EXEMPLE DE REFACTORISATION - main.js avec modules externalisés
 * 
 * Ce fichier montre comment refactoriser les fonctions principales
 * pour utiliser les nouveaux modules RegexPatterns, StorageManager et SQLParser
 */

// ========================================
// EXEMPLE 1: Refactorisation executeCustomQuery
// ========================================

/**
 * Version AVANT refactorisation (version actuelle)
 */
function executeCustomQuery_AVANT() {
    const query = document.getElementById('custom-query-input').value.trim();
    if (!query) {
        afficherErreur('Veuillez saisir une requête.');
        return;
    }
    
    // Récupérer les données DIRECTEMENT de la base de données (localStorage)
    console.log('🔥 CUSTOM_QUERY - Lecture DIRECTE dans la BASE DE DONNÉES (localStorage)');
    const donnees = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
    console.log('🔍 DataBase - Données récupérées:', donnees);
    
    let lignes, headers;
    
    if (donnees.donnees && donnees.donnees.donnees) {
        lignes = donnees.donnees.donnees;
        headers = donnees.donnees.headers || [];
        console.log(`✅ DataBase - Structure imbriquée: ${lignes.length} lignes`);
    } else if (Array.isArray(donnees.donnees)) {
        lignes = donnees.donnees;
        headers = donnees.headers || [];
        console.log(`✅ DataBase - Structure directe: ${lignes.length} lignes`);
    } else {
        console.error('❌ DataBase - Aucune structure de données reconnue');
        afficherErreur('Aucune donnée disponible. Veuillez d\'abord charger un fichier.');
        return;
    }
    
    try {
        const resultats = executerFiltreSimple(lignes, headers, query);
        // ... reste du code
    } catch (error) {
        console.error('❌ Erreur lors de l\'exécution:', error);
        afficherErreur(`Erreur: ${error.message}`);
    }
}

/**
 * Version APRÈS refactorisation (avec modules)
 */
function executeCustomQuery_APRES() {
    const query = document.getElementById('custom-query-input').value.trim();
    if (!query) {
        afficherErreur('Veuillez saisir une requête.');
        return;
    }
    
    // Validation de la requête avec le module SQLParser
    const validation = SQLParser.validateQuery(query);
    if (!validation.valid) {
        afficherErreur(`Requête invalide: ${validation.issues.join(', ')}`);
        return;
    }
    
    // Récupération des données avec StorageManager
    const donnees = StorageManager.getDonnees();
    const { lignes, headers } = extractDataStructure(donnees);
    
    if (!lignes || lignes.length === 0) {
        afficherErreur('Aucune donnée disponible. Veuillez d\'abord charger un fichier.');
        return;
    }
    
    try {
        // Analyse de la requête
        const analysis = SQLParser.analyzeQuery(query);
        console.log('📊 Analyse de requête:', analysis);
        
        // Exécution avec le parser SQL
        const resultats = SQLParser.executeQuery(lignes, headers, query);
        
        // Création de la requête SQL.js équivalente pour affichage
        const sqlJSQuery = SQLParser.createSQLJSQuery(query, headers);
        
        // Affichage des détails
        const rawData = {
            requete_originale: query,
            requete_sqljs: sqlJSQuery,
            lignes_brutes: lignes.slice(0, 10),
            headers: headers,
            nombre_lignes_total: lignes.length,
            timestamp: new Date().toISOString(),
            analysis: analysis
        };
        
        afficherDetailsRequete(query, 'Requête personnalisée', rawData);
        afficherResultats(resultats, `Résultats pour: ${query}`);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'exécution:', error);
        afficherErreur(`Erreur: ${error.message}`);
    }
}

// ========================================
// EXEMPLE 2: Refactorisation effacerDonnees
// ========================================

/**
 * Version AVANT refactorisation
 */
function effacerDonnees_AVANT() {
    // Vérifier l'état avant effacement
    const donneesAvant = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
    const summaryAvant = JSON.parse(localStorage.getItem('dioo_summary') || '[]');
    
    console.log('🗑️ État avant effacement:', {
        donnees: Object.keys(donneesAvant).length > 0,
        summary: summaryAvant.length,
        timestamp: new Date().toISOString()
    });
    
    // Confirmer l'action
    if (!confirm('⚠️ Êtes-vous sûr de vouloir effacer toutes les données de la base ?\n\nCette action est irréversible.')) {
        console.log('🚫 Effacement annulé par l\'utilisateur');
        return;
    }
    
    // Effacer toutes les données localStorage liées à DIOO
    console.log('🗑️ Effacement des données localStorage...');
    localStorage.removeItem('dioo_donnees');
    localStorage.removeItem('dioo_summary');
    localStorage.removeItem('dioo_rand_counter');
    
    // ... reste du code
}

/**
 * Version APRÈS refactorisation
 */
function effacerDonnees_APRES() {
    // Vérifier l'état avec StorageManager
    const stats = StorageManager.getStats();
    console.log('🗑️ État avant effacement:', stats);
    
    if (!stats.donnees.exists && !stats.summary.exists) {
        DiooUtils.showNotification('Aucune donnée à effacer', 'info');
        return;
    }
    
    // Confirmer l'action
    if (!confirm('⚠️ Êtes-vous sûr de vouloir effacer toutes les données de la base ?\n\nCette action est irréversible.')) {
        console.log('🚫 Effacement annulé par l\'utilisateur');
        return;
    }
    
    // Effacement avec StorageManager
    const report = StorageManager.clearAll();
    
    if (report.success) {
        console.log('✅ Toutes les données ont été effacées');
        DiooUtils.showNotification('Données effacées avec succès', 'success');
        
        // Réinitialiser l'interface
        reinitialiserInterface();
        
    } else {
        console.error('❌ Erreur lors de l\'effacement:', report);
        DiooUtils.showNotification('Erreur lors de l\'effacement', 'error');
    }
}

// ========================================
// EXEMPLE 3: Refactorisation parseXLSX
// ========================================

/**
 * Version AVANT refactorisation (extrait)
 */
function parseXLSX_AVANT_extrait(file) {
    // ... code de lecture du fichier ...
    
    // Extraire une date du nom de l'onglet si possible
    let dateExtraction = null;
    const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})|(\d{1,2}\s+\w+\s+\d{4})/;
    const matchDate = targetSheetName.match(dateRegex);
    if (matchDate) {
        dateExtraction = matchDate[0];
        console.log(`📅 Date extraite de l'onglet: ${dateExtraction}`);
    }
    
    // ... reste du code ...
}

/**
 * Version APRÈS refactorisation
 */
function parseXLSX_APRES_extrait(file) {
    // ... code de lecture du fichier ...
    
    // Extraire une date du nom de l'onglet avec RegexPatterns
    const dateExtraction = RegexPatterns.extractExcelDate(targetSheetName);
    if (dateExtraction) {
        console.log(`📅 Date extraite de l'onglet: ${dateExtraction}`);
    }
    
    // ... reste du code ...
}

// ========================================
// EXEMPLE 4: Fonctions utilitaires refactorisées
// ========================================

/**
 * Fonction utilitaire pour extraire la structure des données
 * Remplace la logique répétitive dans plusieurs fonctions
 */
function extractDataStructure(donnees) {
    if (!donnees || Object.keys(donnees).length === 0) {
        return { lignes: [], headers: [] };
    }
    
    // Structure imbriquée
    if (donnees.donnees && donnees.donnees.donnees) {
        return {
            lignes: donnees.donnees.donnees,
            headers: donnees.donnees.headers || []
        };
    }
    
    // Structure directe
    if (Array.isArray(donnees.donnees)) {
        return {
            lignes: donnees.donnees,
            headers: donnees.headers || []
        };
    }
    
    return { lignes: [], headers: [] };
}

/**
 * Fonction de validation des données avec RegexPatterns
 */
function validateDataIntegrity(lignes) {
    const issues = [];
    
    lignes.forEach((ligne, index) => {
        Object.entries(ligne).forEach(([colonne, valeur]) => {
            if (RegexPatterns.hasSpecialChars(valeur)) {
                issues.push({
                    ligne: index,
                    colonne: colonne,
                    valeur: valeur,
                    issue: 'Caractères spéciaux détectés'
                });
            }
        });
    });
    
    return {
        valid: issues.length === 0,
        issues: issues
    };
}

/**
 * Fonction de formatage SQL avec RegexPatterns
 */
function formatSQLValue(value) {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    
    if (typeof value === 'number') {
        return value.toString();
    }
    
    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }
    
    // Échapper les apostrophes avec RegexPatterns
    const escaped = RegexPatterns.escapeSQLQuotes(value);
    return `'${escaped}'`;
}

// ========================================
// EXEMPLE 5: Refactorisation des requêtes prédéfinies
// ========================================

/**
 * Version APRÈS refactorisation pour les requêtes prédéfinies
 */
function executeQuery_APRES(queryType) {
    console.log(`🔍 DataBase - Exécution requête prédéfinie: ${queryType}`);
    
    // Récupération des données avec StorageManager
    const donnees = StorageManager.getDonnees();
    const { lignes, headers } = extractDataStructure(donnees);
    
    if (!lignes || lignes.length === 0) {
        afficherErreur('Aucune donnée disponible. Veuillez d\'abord charger un fichier.');
        return;
    }
    
    // Définition des requêtes prédéfinies
    const predefinedQueries = {
        'premieres_lignes': 'SELECT * FROM dioo_donnees LIMIT 10',
        'nombre_lignes': 'SELECT COUNT(*) FROM dioo_donnees',
        'colonnes_info': 'PRAGMA table_info(dioo_donnees)',
        'donnees_critiques': 'SELECT * FROM dioo_donnees WHERE [Business criticality] = \'Critical\'',
        'applications_dp': 'SELECT * FROM dioo_donnees WHERE [Dx] LIKE \'DP%\''
    };
    
    const query = predefinedQueries[queryType];
    if (!query) {
        afficherErreur(`Type de requête non reconnu: ${queryType}`);
        return;
    }
    
    try {
        // Exécution avec SQLParser
        const resultats = SQLParser.executeQuery(lignes, headers, query);
        
        // Affichage des résultats
        afficherResultats(resultats, `Résultats - ${queryType}`);
        
        // Affichage des détails
        const rawData = {
            requete_originale: query,
            requete_sqljs: SQLParser.createSQLJSQuery(query, headers),
            lignes_brutes: lignes.slice(0, 10),
            headers: headers,
            nombre_lignes_total: lignes.length,
            timestamp: new Date().toISOString()
        };
        
        afficherDetailsRequete(query, `Requête prédéfinie: ${queryType}`, rawData);
        
    } catch (error) {
        console.error(`❌ Erreur requête ${queryType}:`, error);
        afficherErreur(`Erreur: ${error.message}`);
    }
}

// ========================================
// RÉSUMÉ DES BÉNÉFICES DE LA REFACTORISATION
// ========================================

/*
BÉNÉFICES DE L'EXTERNALISATION:

1. **Séparation des responsabilités**
   - RegexPatterns: Toutes les expressions régulières centralisées
   - StorageManager: Tous les accès localStorage centralisés  
   - SQLParser: Toute la logique de parsing SQL centralisée

2. **Réduction de la duplication**
   - Plus de code répétitif pour localStorage
   - Plus de regex dupliquées dans différentes fonctions
   - Logique de parsing SQL unifiée

3. **Facilité de maintenance**
   - Modifications des regex en un seul endroit
   - Gestion d'erreurs localStorage centralisée
   - Tests unitaires plus faciles

4. **Meilleure lisibilité**
   - main.js se concentre sur la logique métier
   - Fonctions plus courtes et plus claires
   - Noms de méthodes explicites

5. **Préparation à SQL.js**
   - SQLParser peut être remplacé par SQL.js facilement
   - StorageManager peut évoluer vers une vraie DB
   - Architecture modulaire prête pour l'évolution

IMPACT SUR LA TAILLE DU CODE:
- main.js: ~4000 lignes → ~2500 lignes (-37%)
- Modules externes: ~1000 lignes
- Total: Même taille mais mieux organisé
- Préparation pour réduction massive avec SQL.js
*/