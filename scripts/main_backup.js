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

console.log('✅ Script main.js chargé avec SQL.js');