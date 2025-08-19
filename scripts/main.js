/**
 * Application DIOO - Script principal
 * Gestion de la navigation et interactions utilisateur
 */

/**
 * Gestionnaire de base de données SQL.js
 * Remplace le système de parsing SQL custom
 */
class DatabaseManager {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.initPromise = this.init();
    }

    /**
     * Initialisation de SQL.js
     */
    async init() {
        try {
            console.log('🔄 Initialisation de SQL.js...');
            
            // Initialiser SQL.js avec le chemin vers le fichier WASM
            const SQL = await initSqlJs({
                locateFile: file => `./${file}`
            });
            
            // Créer une nouvelle base de données en mémoire
            this.db = new SQL.Database();
            
            // Créer la table principale
            this.createMainTable();
            
            this.isInitialized = true;
            console.log('✅ SQL.js initialisé avec succès');
            
            return this.db;
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de SQL.js:', error);
            throw error;
        }
    }

    /**
     * Créer la table principale DIOO
     */
    createMainTable() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS dioo_donnees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                Dx TEXT,
                "App Appli" TEXT,
                "App Code" TEXT,
                "Operator/Department" TEXT,
                "Business criticality" TEXT,
                "Functional monitoring (BSM)" TEXT,
                "In HCC" TEXT,
                "HCC eligibility" TEXT
            );
        `;
        
        this.db.run(createTableSQL);
        console.log('✅ Table dioo_donnees créée');
    }

    /**
     * Attendre que la base soit initialisée
     */
    async waitForInit() {
        if (!this.isInitialized) {
            await this.initPromise;
        }
        return this.db;
    }

    /**
     * Exécuter une requête SQL
     */
    async executeQuery(sql, params = []) {
        await this.waitForInit();
        
        try {
            console.log('🔍 Exécution requête SQL:', sql);
            console.log('📊 Paramètres:', params);
            
            const results = this.db.exec(sql, params);
            
            console.log('✅ Requête exécutée avec succès');
            console.log('📋 Résultats:', results);
            
            return results;
        } catch (error) {
            console.error('❌ Erreur SQL:', error);
            throw error;
        }
    }

    /**
     * Insérer des données depuis un tableau d'objets
     */
    async insertData(data, headers) {
        await this.waitForInit();
        
        try {
            console.log(`🔄 Insertion de ${data.length} lignes...`);
            
            // Vider la table existante
            this.db.run('DELETE FROM dioo_donnees');
            
            // Préparer la requête d'insertion
            const placeholders = headers.map(() => '?').join(', ');
            const columnNames = headers.map(h => `"${h}"`).join(', ');
            const insertSQL = `INSERT INTO dioo_donnees (${columnNames}) VALUES (${placeholders})`;
            
            console.log('📝 Requête d\'insertion:', insertSQL);
            
            // Préparer la statement
            const stmt = this.db.prepare(insertSQL);
            
            // Insérer chaque ligne
            data.forEach((row, index) => {
                const values = headers.map(header => row[header] || '');
                stmt.run(values);
                
                if (index % 1000 === 0) {
                    console.log(`📊 Insertion: ${index}/${data.length} lignes`);
                }
            });
            
            stmt.free();
            
            console.log(`✅ ${data.length} lignes insérées avec succès`);
            
            // Vérifier l'insertion
            const countResult = this.db.exec('SELECT COUNT(*) as count FROM dioo_donnees');
            const count = countResult[0]?.values[0]?.[0] || 0;
            console.log(`📊 Nombre total de lignes en base: ${count}`);
            
            return count;
        } catch (error) {
            console.error('❌ Erreur lors de l\'insertion:', error);
            throw error;
        }
    }

    /**
     * Obtenir le nombre total de lignes
     */
    async getRowCount() {
        await this.waitForInit();
        
        const results = this.db.exec('SELECT COUNT(*) as count FROM dioo_donnees');
        return results[0]?.values[0]?.[0] || 0;
    }

    /**
     * Vider la base de données
     */
    async clearData() {
        await this.waitForInit();
        
        this.db.run('DELETE FROM dioo_donnees');
        console.log('🗑️ Base de données vidée');
    }

    /**
     * Obtenir les informations sur la table
     */
    async getTableInfo() {
        await this.waitForInit();
        
        const results = this.db.exec('PRAGMA table_info(dioo_donnees)');
        return results[0] || { columns: [], values: [] };
    }
}

class DiooApp {
    constructor() {
        this.currentPage = 'chargement';
        this.pages = ['chargement', 'monitoring', 'database'];
        this.dbManager = new DatabaseManager();
        this.init();
    }

    /**
     * Initialisation de l'application
     */
    init() {
        this.setupEventListeners();
        this.updatePageTitle();
        this.showWelcomeMessage();
        console.log('✅ Application DIOO initialisée avec succès - Style FDJ');
    }

    /**
     * Configuration des écouteurs d'événements
     */
    setupEventListeners() {
        // Navigation entre les pages
        const navButtons = document.querySelectorAll('.nav-btn');
        console.log(`🔍 Boutons de navigation trouvés: ${navButtons.length}`);
        navButtons.forEach((button, index) => {
            const page = button.dataset.page;
            console.log(`🔍 Bouton ${index + 1}: ${page}`);
            button.addEventListener('click', (e) => {
                const targetPage = e.currentTarget.dataset.page;
                console.log(`🖱️ Clic sur le bouton de navigation: ${targetPage}`);
                this.navigateToPage(targetPage);
            });
        });

        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    /**
     * Navigation vers une page spécifique
     */
    navigateToPage(pageName) {
        console.log(`🚀 Navigation vers: ${pageName}`);
        
        if (!this.pages.includes(pageName)) {
            console.warn(`⚠️ Page "${pageName}" non trouvée`);
            return;
        }

        // Masquer toutes les pages
        this.hideAllPages();

        // Afficher la page demandée
        this.showPage(pageName);

        // Mettre à jour la navigation
        this.updateNavigation(pageName);

        // Mettre à jour l'état courant
        this.currentPage = pageName;

        // Mettre à jour le titre de la page
        this.updatePageTitle();

        console.log(`📄 Navigation terminée vers: ${pageName}`);
    }

    /**
     * Masquer toutes les pages
     */
    hideAllPages() {
        this.pages.forEach(page => {
            const pageElement = document.getElementById(`${page}-page`);
            if (pageElement) {
                pageElement.style.display = 'none';
            }
        });
    }

    /**
     * Afficher une page
     */
    showPage(pageName) {
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.style.display = 'block';
        }
    }

    /**
     * Mettre à jour la navigation
     */
    updateNavigation(activePage) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            if (button.dataset.page === activePage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    /**
     * Mettre à jour le titre de la page
     */
    updatePageTitle() {
        const titles = {
            'chargement': 'DIOO - Chargement des données',
            'monitoring': 'DIOO - Monitoring et consolidation',
            'database': 'DIOO - Base de données'
        };
        document.title = titles[this.currentPage] || 'DIOO - Application';
    }

    /**
     * Afficher le message de bienvenue
     */
    showWelcomeMessage() {
        console.log('🎉 Bienvenue dans DIOO v0.000-stable-extract-viewer-database');
        console.log('🚀 Application initialisée avec SQL.js');
    }

    /**
     * Gestion des raccourcis clavier
     */
    handleKeyboardShortcuts(e) {
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.navigateToPage('chargement');
                    break;
                case '2':
                    e.preventDefault();
                    this.navigateToPage('monitoring');
                    break;
                case '3':
                    e.preventDefault();
                    this.navigateToPage('database');
                    break;
            }
        }
    }
}

/**
 * Exécuter une requête prédéfinie avec SQL.js
 */
async function executeQuery(queryType) {
    console.log(`🔍 DataBase - Exécution requête prédéfinie avec SQL.js: ${queryType}`);
    
    const dbManager = window.diooApp.dbManager;
    
    try {
        let query = '';
        let titre = '';
        
        // Définir les requêtes SQL natives selon le type
        switch (queryType) {
            case 'info_tables':
                query = 'SELECT name, sql FROM sqlite_master WHERE type="table";';
                titre = 'Informations sur les tables';
                break;
                
            case 'total_lignes':
                query = 'SELECT COUNT(*) as "Nombre total de lignes" FROM dioo_donnees;';
                titre = 'Total des lignes';
                break;
                
            case 'premieres_lignes':
                query = 'SELECT * FROM dioo_donnees LIMIT 10;';
                titre = 'Premières lignes';
                break;
                
            case 'criticites':
                query = 'SELECT "Business criticality", COUNT(*) as "Nombre" FROM dioo_donnees GROUP BY "Business criticality" ORDER BY COUNT(*) DESC;';
                titre = 'Répartition des criticités';
                break;
                
            case 'prefixes_dp':
                query = 'SELECT SUBSTR(Dx, 1, 3) as "Préfixe", COUNT(*) as "Nombre" FROM dioo_donnees WHERE Dx LIKE "DP%" GROUP BY SUBSTR(Dx, 1, 3) ORDER BY COUNT(*) DESC;';
                titre = 'Préfixes DP*';
                break;
                
            case 'vue_ensemble':
                query = `SELECT 
                    COUNT(*) as "Total lignes",
                    COUNT(CASE WHEN Dx LIKE 'DP%' THEN 1 END) as "Lignes DP",
                    COUNT(CASE WHEN "Business criticality" = 'Critical' THEN 1 END) as "Lignes Critical",
                    COUNT(CASE WHEN Dx LIKE 'DP%' AND "Business criticality" = 'Critical' THEN 1 END) as "Lignes DP Critical"
                FROM dioo_donnees;`;
                titre = 'Vue d\'ensemble';
                break;
                
            case 'ajouter_ligne_aleatoire':
                return await ajouterLigneAleatoireSQL();
                
            default:
                throw new Error(`Type de requête non reconnu: ${queryType}`);
        }
        
        console.log(`🚀 DataBase - Exécution SQL native: ${query}`);
        
        // Exécuter la requête SQL native
        const results = await dbManager.executeQuery(query);
        console.log('✅ DataBase - Résultats SQL.js:', results);
        
        // Convertir les résultats
        let resultatsFormates = [];
        if (results && results.length > 0 && results[0].values) {
            const columns = results[0].columns || [];
            const values = results[0].values || [];
            
            resultatsFormates = values.map(row => {
                const obj = {};
                columns.forEach((col, index) => {
                    obj[col] = row[index] || '';
                });
                return obj;
            });
        }
        
        // Afficher les résultats
        afficherResultats(resultatsFormates, titre);
        
    } catch (error) {
        console.error('❌ DataBase - Erreur SQL.js:', error);
        afficherErreur(`Erreur: ${error.message}`);
    }
}

/**
 * Exécuter une requête personnalisée avec SQL.js
 */
async function executeCustomQuery() {
    console.log('🔍 DataBase - Exécution requête personnalisée avec SQL.js');
    
    const queryInput = document.getElementById('custom-query-input');
    if (!queryInput) {
        console.error('❌ DataBase - Élément custom-query-input non trouvé');
        afficherErreur('Erreur: Élément de saisie non trouvé.');
        return;
    }
    
    const query = queryInput.value.trim();
    console.log(`🔍 DataBase - Requête saisie: "${query}"`);
    
    if (!query) {
        console.log('⚠️ DataBase - Requête vide');
        afficherErreur('Veuillez entrer une requête.');
        return;
    }
    
    try {
        // Utiliser SQL.js directement
        const dbManager = window.diooApp.dbManager;
        console.log('🚀 DataBase - Exécution NATIVE avec SQL.js...');
        
        // Exécuter la requête SQL native
        const results = await dbManager.executeQuery(query);
        console.log('✅ DataBase - Résultats SQL.js bruts:', results);
        
        // Convertir les résultats SQL.js en format attendu par l'interface
        let resultatsFormates = [];
        if (results && results.length > 0 && results[0].values) {
            const columns = results[0].columns || [];
            const values = results[0].values || [];
            
            resultatsFormates = values.map(row => {
                const obj = {};
                columns.forEach((col, index) => {
                    obj[col] = row[index] || '';
                });
                return obj;
            });
        }
        
        console.log('✅ DataBase - Résultats formatés:', resultatsFormates);
        
        // Afficher les résultats
        const titreAvecTimestamp = `Requête SQL.js (${new Date().toLocaleTimeString()})`;
        afficherResultats(resultatsFormates, titreAvecTimestamp);
        
    } catch (error) {
        console.error('❌ DataBase - Erreur SQL.js:', error);
        
        // Afficher une erreur plus claire pour l'utilisateur
        let messageErreur = error.message;
        if (messageErreur.includes('no such table')) {
            messageErreur = 'Table non trouvée. Utilisez "dioo_donnees" comme nom de table.';
        } else if (messageErreur.includes('syntax error')) {
            messageErreur = 'Erreur de syntaxe SQL. Vérifiez votre requête.';
        } else if (messageErreur.includes('no such column')) {
            messageErreur = 'Colonne non trouvée. Colonnes disponibles : Dx, "App Appli", "App Code", "Business criticality", etc.';
        }
        
        afficherErreur(`Erreur SQL: ${messageErreur}`);
    }
}

/**
 * Ajouter une ligne aléatoire avec SQL.js
 */
async function ajouterLigneAleatoireSQL() {
    console.log('🎲 DataBase - Ajout ligne aléatoire avec SQL.js');
    
    const dbManager = window.diooApp.dbManager;
    
    try {
        // Obtenir le prochain compteur
        const compteur = obtenirProchainCompteurRand();
        const identifiant = `Rand_${compteur.toString().padStart(3, '0')}`;
        
        // Générer des valeurs aléatoires
        const valeurs = [
            identifiant,
            `Application Test ${compteur}`,
            `T${compteur.toString().padStart(3, '0')}`,
            'Test Department',
            ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
            ['YES', 'NO'][Math.floor(Math.random() * 2)],
            ['YES', 'NO'][Math.floor(Math.random() * 2)],
            ['YES', 'NO'][Math.floor(Math.random() * 2)]
        ];
        
        // Insérer avec SQL.js
        const insertQuery = `INSERT INTO dioo_donnees (Dx, "App Appli", "App Code", "Operator/Department", "Business criticality", "Functional monitoring (BSM)", "In HCC", "HCC eligibility") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await dbManager.executeQuery(insertQuery, valeurs);
        
        // Vérifier l'insertion
        const countResult = await dbManager.executeQuery('SELECT COUNT(*) as count FROM dioo_donnees');
        const nouveauTotal = countResult[0]?.values[0]?.[0] || 0;
        
        console.log(`✅ Ligne aléatoire ajoutée. Nouveau total: ${nouveauTotal}`);
        
        // Afficher le résultat
        const resultats = [{
            'Action': 'Ligne ajoutée',
            'Identifiant': identifiant,
            'Total lignes': nouveauTotal,
            'Moteur': 'SQL.js'
        }];
        
        afficherResultats(resultats, 'Ligne aléatoire ajoutée');
        
    } catch (error) {
        console.error('❌ Erreur ajout ligne aléatoire:', error);
        afficherErreur(`Erreur: ${error.message}`);
    }
}

/**
 * Obtenir le prochain compteur pour les identifiants Rand_XXX
 */
function obtenirProchainCompteurRand() {
    let compteur = parseInt(localStorage.getItem('dioo_rand_counter') || '0');
    compteur++;
    localStorage.setItem('dioo_rand_counter', compteur.toString());
    console.log(`🔢 Prochain compteur Rand: ${compteur}`);
    return compteur;
}

/**
 * Afficher les résultats dans la section résultats
 */
function afficherResultats(resultats, titre) {
    console.log(`📋 DataBase - afficherResultats: "${titre}" (${resultats ? resultats.length : 0} résultats)`);
    
    const resultsDiv = document.getElementById('query-results');
    if (!resultsDiv) {
        console.error('❌ Élément query-results non trouvé');
        return;
    }
    
    if (!resultats || resultats.length === 0) {
        console.log('⚠️ DataBase - Aucun résultat à afficher');
        resultsDiv.innerHTML = '<p class="no-results">Aucun résultat trouvé.</p>';
        return;
    }
    
    // Vérifier si c'est un résultat COUNT avec 0
    if (resultats.length === 1 && resultats[0]['Nombre de lignes'] === 0) {
        console.log('⚠️ DataBase - COUNT(*) retourne 0');
        resultsDiv.innerHTML = '<p class="no-results">Aucun résultat trouvé.</p>';
        return;
    }
    
    console.log('✅ DataBase - Génération du tableau HTML');
    
    // Créer le HTML des résultats
    let html = `<div class="results-count">${resultats.length} résultat(s) trouvé(s) - ${titre}</div>`;
    
    if (resultats.length > 0) {
        const colonnes = Object.keys(resultats[0]);
        
        html += '<table class="results-table">';
        html += '<thead><tr>';
        colonnes.forEach(colonne => {
            html += `<th>${colonne}</th>`;
        });
        html += '</tr></thead>';
        
        html += '<tbody>';
        resultats.forEach((ligne) => {
            html += '<tr>';
            colonnes.forEach(colonne => {
                const valeur = ligne[colonne] || '';
                html += `<td>${String(valeur)}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
    }
    
    resultsDiv.innerHTML = html;
}

/**
 * Afficher un message d'erreur
 */
function afficherErreur(message) {
    const resultsDiv = document.getElementById('query-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

/**
 * Effacer les données de la base
 */
async function effacerDonnees() {
    console.log('🗑️ DÉBUT - Fonction effacerDonnees() appelée');
    
    // Confirmer l'action
    if (!confirm('Êtes-vous sûr de vouloir effacer toutes les données de la base ?\n\nCette action est irréversible.')) {
        console.log('❌ Effacement annulé par l\'utilisateur');
        return;
    }
    
    try {
        // Effacer les données SQL.js
        const dbManager = window.diooApp.dbManager;
        await dbManager.clearData();
        
        // Effacer les clés localStorage restantes
        localStorage.removeItem('dioo_summary');
        localStorage.removeItem('dioo_rand_counter');
        
        console.log('✅ SUCCÈS - Toutes les données ont été effacées');
        
        // Notification de succès
        alert('Données effacées avec succès');
        
    } catch (error) {
        console.error('❌ ERREUR lors de l\'effacement:', error);
        alert('Erreur lors de l\'effacement des données');
    }
}

/**
 * Initialisation de l'application au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    // Créer une instance globale de l'application
    window.diooApp = new DiooApp();
    
    console.log('✅ Application DIOO initialisée avec SQL.js');
});

/**
 * API globale pour le débogage
 */
window.dioo = {
    navigateTo: (page) => window.diooApp?.navigateToPage(page),
    version: 'v0.000-stable-extract-viewer-database-sqljs',
    diagnostic: () => {
        console.log('🔍 DIAGNOSTIC SQL.js');
        return window.diooApp?.dbManager;
    },
    executeQuery: executeQuery,
    executeCustomQuery: executeCustomQuery,
    effacerDonnees: effacerDonnees,
    testSQL: async (query) => {
        if (window.diooApp?.dbManager) {
            return await window.diooApp.dbManager.executeQuery(query || 'SELECT COUNT(*) FROM dioo_donnees');
        }
        return 'Base non initialisée';
    }
};

/**
 * FONCTIONS MANQUANTES POUR LES BOUTONS HTML
 */

/**
 * Gérer le clic sur le bouton "Charger fichier DIOO"
 */
function gererClicCharger() {
    console.log('🖱️ Clic sur Charger fichier DIOO');
    alert('Fonction de chargement de fichier non encore implémentée avec SQL.js');
}

/**
 * Calculer la consolidation (page Monitoring)
 */
function calculerConsolidation() {
    console.log('🖱️ Clic sur Calculer consolidation');
    alert('Fonction de calcul de consolidation non encore implémentée avec SQL.js');
}

/**
 * Basculer l'affichage d'une section
 */
function toggleSection(sectionId) {
    console.log(`🔄 Toggle section: ${sectionId}`);
    const content = document.getElementById(sectionId);
    if (content) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        
        // Trouver la LED et la flèche associées
        const header = content.previousElementSibling;
        if (header) {
            const led = header.querySelector('.led-indicator');
            const arrow = header.querySelector('.arrow-indicator');
            
            if (led) {
                if (isVisible) {
                    led.classList.remove('active');
                } else {
                    led.classList.add('active');
                }
            }
            
            if (arrow) {
                arrow.textContent = isVisible ? '▼' : '▲';
            }
        }
    }
}

/**
 * Basculer l'affichage d'une section de la page Database
 */
function toggleDatabaseSection(sectionId) {
    console.log(`🔄 Toggle database section: ${sectionId}`);
    const content = document.getElementById(sectionId);
    if (content) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        
        // Trouver la LED et la flèche associées
        const header = content.previousElementSibling;
        if (header) {
            const led = header.querySelector('.led-indicator');
            const arrow = header.querySelector('.arrow-indicator');
            
            if (led) {
                if (isVisible) {
                    led.classList.remove('active');
                } else {
                    led.classList.add('active');
                }
            }
            
            if (arrow) {
                arrow.textContent = isVisible ? '▼' : '▲';
            }
        }
    }
}

/**
 * Fonctions de gestion des dumps (sections pliables)
 */
function toggleImportDumpSection() {
    console.log('🔄 Toggle import dump section');
    toggleSection('import-dump-content');
}

function toggleOverviewSection() {
    console.log('🔄 Toggle overview section');
    toggleSection('overview-content');
}

function toggleInsertionDumpSection() {
    console.log('🔄 Toggle insertion dump section');
    toggleSection('insertion-dump-content');
}

function effacerImportDump() {
    console.log('🗑️ Effacer import dump');
    const content = document.getElementById('import-dump-content');
    if (content) {
        content.innerHTML = '<p>Dump effacé</p>';
    }
}

function effacerDumpInsertion() {
    console.log('🗑️ Effacer dump insertion');
    const content = document.getElementById('insertion-dump-content');
    if (content) {
        content.innerHTML = '<p>Dump effacé</p>';
    }
}

/**
 * Fonctions de pagination pour la page Chargement
 */
function allerPremierePage() {
    console.log('📄 Aller première page');
    // TODO: Implémenter la pagination
}

function pagePrecedente() {
    console.log('📄 Page précédente');
    // TODO: Implémenter la pagination
}

function pageSuivante() {
    console.log('📄 Page suivante');
    // TODO: Implémenter la pagination
}

function allerDernierePage() {
    console.log('📄 Aller dernière page');
    // TODO: Implémenter la pagination
}

/**
 * Fonctions de pagination pour les résultats de la page Database
 */
function allerPremierePageResultats() {
    console.log('📄 Aller première page résultats');
    // TODO: Implémenter la pagination des résultats
}

function pagePrecedenteResultats() {
    console.log('📄 Page précédente résultats');
    // TODO: Implémenter la pagination des résultats
}

function pageSuivanteResultats() {
    console.log('📄 Page suivante résultats');
    // TODO: Implémenter la pagination des résultats
}

function allerDernierePageResultats() {
    console.log('📄 Aller dernière page résultats');
    // TODO: Implémenter la pagination des résultats
}

console.log('✅ Script main.js chargé avec SQL.js - Version refactorisée + fonctions manquantes');