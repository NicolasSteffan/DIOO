/**
 * DatabaseManager - Gestionnaire de base de données SQLite avec SQL.js
 * 
 * Remplace StorageManager et SQLParser par une vraie base de données SQLite en mémoire
 * 
 * @version v0.000C-SQLjs-Migration
 * @author DIOO Team
 */

class DatabaseManager {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.initialized = false;
        this.migrationCompleted = false;
    }

    /**
     * Initialiser SQL.js et créer la base de données
     */
    async init() {
        console.log('🚀 DatabaseManager - Initialisation SQL.js...');
        
        try {
            // Initialiser SQL.js
            this.SQL = await initSqlJs({
                locateFile: file => `./${file}`
            });
            
            console.log('✅ SQL.js initialisé avec succès');
            
            // Créer une nouvelle base de données en mémoire
            this.db = new this.SQL.Database();
            console.log('✅ Base de données SQLite créée en mémoire');
            
            // Créer les tables
            this.createTables();
            
            this.initialized = true;
            console.log('🎉 DatabaseManager initialisé avec succès !');
            
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de DatabaseManager:', error);
            throw error;
        }
    }

    /**
     * Créer les tables de base
     */
    createTables() {
        console.log('🏗️ Création des tables SQLite...');
        
        try {
            // Table principale des données
            this.db.run(`
                CREATE TABLE IF NOT EXISTS dioo_donnees (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    "Dx" TEXT,
                    "App Appli" TEXT,
                    "App Code" TEXT,
                    "Operator/Department" TEXT,
                    "Business criticality" TEXT,
                    "Functional monitoring (BSM)" TEXT,
                    "In HCC" TEXT,
                    "HCC eligibility" TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Table de consolidation/summary
            this.db.run(`
                CREATE TABLE IF NOT EXISTS dioo_summary (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    value INTEGER NOT NULL,
                    percentage REAL,
                    date_tag TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Table de métadonnées
            this.db.run(`
                CREATE TABLE IF NOT EXISTS dioo_metadata (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Insérer les métadonnées de base
            this.db.run(`
                INSERT OR REPLACE INTO dioo_metadata (key, value) 
                VALUES ('version', 'v0.000C-SQLjs-Migration')
            `);
            
            this.db.run(`
                INSERT OR REPLACE INTO dioo_metadata (key, value) 
                VALUES ('rand_counter', '0')
            `);
            
            console.log('✅ Tables SQLite créées avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de la création des tables:', error);
            throw error;
        }
    }

    /**
     * Exécuter une requête SQL
     */
    async executeQuery(sql, params = []) {
        if (!this.initialized) {
            throw new Error('DatabaseManager non initialisé. Appelez init() d\'abord.');
        }
        
        console.log(`🔍 DatabaseManager - Exécution SQL: "${sql}"`);
        if (params.length > 0) {
            console.log(`📋 Paramètres:`, params);
        }
        
        try {
            const stmt = this.db.prepare(sql);
            
            if (sql.trim().toLowerCase().startsWith('select')) {
                // Requête SELECT - retourner les résultats
                const results = [];
                while (stmt.step()) {
                    const row = stmt.getAsObject();
                    results.push(row);
                }
                stmt.free();
                
                console.log(`✅ Requête SELECT exécutée: ${results.length} résultats`);
                return results;
                
            } else {
                // Requête INSERT/UPDATE/DELETE
                if (params.length > 0) {
                    stmt.bind(params);
                }
                stmt.step();
                const changes = this.db.getRowsModified();
                stmt.free();
                
                console.log(`✅ Requête ${sql.split(' ')[0]} exécutée: ${changes} lignes affectées`);
                return { changes, lastInsertRowid: this.db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] };
            }
            
        } catch (error) {
            console.error('❌ Erreur SQL:', error);
            console.error('❌ Requête:', sql);
            console.error('❌ Paramètres:', params);
            throw new Error(`Erreur SQL: ${error.message}`);
        }
    }

    /**
     * Insérer des données (remplace StorageManager.setDonnees)
     */
    async setDonnees(lignes, headers) {
        console.log(`💾 DatabaseManager - Insertion de ${lignes.length} lignes`);
        
        try {
            // Vider la table existante
            await this.executeQuery('DELETE FROM dioo_donnees');
            
            // Préparer la requête d'insertion
            const placeholders = headers.map(() => '?').join(', ');
            const columnNames = headers.map(h => `"${h}"`).join(', ');
            const insertSQL = `INSERT INTO dioo_donnees (${columnNames}) VALUES (${placeholders})`;
            
            console.log(`🔧 Requête d'insertion: ${insertSQL}`);
            
            // Insérer chaque ligne
            let inserted = 0;
            for (const ligne of lignes) {
                const values = headers.map(header => ligne[header] || '');
                await this.executeQuery(insertSQL, values);
                inserted++;
                
                if (inserted % 1000 === 0) {
                    console.log(`📊 Progression: ${inserted}/${lignes.length} lignes insérées`);
                }
            }
            
            console.log(`✅ ${inserted} lignes insérées avec succès`);
            return true;
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'insertion:', error);
            throw error;
        }
    }

    /**
     * Récupérer les données (remplace StorageManager.getDonnees)
     */
    async getDonnees() {
        console.log('📖 DatabaseManager - Récupération des données');
        
        try {
            const lignes = await this.executeQuery('SELECT * FROM dioo_donnees ORDER BY id');
            const headers = await this.getHeaders();
            
            console.log(`✅ ${lignes.length} lignes récupérées`);
            
            // Retourner dans le format attendu par extractDataStructure
            return {
                donnees: {
                    donnees: lignes,
                    headers: headers
                },
                metadata: {
                    nombreLignes: lignes.length,
                    version: 'v0.000C-SQLjs-Migration'
                }
            };
            
        } catch (error) {
            console.error('❌ Erreur lors de la récupération:', error);
            throw error;
        }
    }

    /**
     * Obtenir les headers des colonnes
     */
    async getHeaders() {
        try {
            const result = this.db.exec("PRAGMA table_info(dioo_donnees)");
            if (result.length === 0) {
                return ['Dx', 'App Appli', 'App Code', 'Operator/Department', 'Business criticality', 'Functional monitoring (BSM)', 'In HCC', 'HCC eligibility'];
            }
            
            const headers = result[0].values
                .filter(row => row[1] !== 'id' && row[1] !== 'created_at') // Exclure les colonnes techniques
                .map(row => row[1]); // Nom de la colonne
            
            return headers;
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des headers:', error);
            return [];
        }
    }

    /**
     * Obtenir les statistiques (remplace StorageManager.getStats)
     */
    async getStats() {
        console.log('📊 DatabaseManager - Calcul des statistiques');
        
        try {
            const donneesCount = await this.executeQuery('SELECT COUNT(*) as count FROM dioo_donnees');
            const summaryCount = await this.executeQuery('SELECT COUNT(*) as count FROM dioo_summary');
            
            const stats = {
                donnees: {
                    exists: donneesCount[0].count > 0,
                    dataLength: donneesCount[0].count,
                    headersLength: (await this.getHeaders()).length,
                    sizeBytes: 0 // TODO: Calculer la taille réelle
                },
                summary: {
                    exists: summaryCount[0].count > 0,
                    length: summaryCount[0].count,
                    sizeBytes: 0 // TODO: Calculer la taille réelle
                }
            };
            
            console.log('✅ Statistiques calculées:', stats);
            return stats;
            
        } catch (error) {
            console.error('❌ Erreur lors du calcul des statistiques:', error);
            throw error;
        }
    }

    /**
     * Incrémenter le compteur aléatoire (remplace StorageManager.incrementRandCounter)
     */
    async incrementRandCounter() {
        try {
            const current = await this.executeQuery(
                "SELECT value FROM dioo_metadata WHERE key = 'rand_counter'"
            );
            
            const currentValue = current.length > 0 ? parseInt(current[0].value) : 0;
            const newValue = currentValue + 1;
            
            await this.executeQuery(
                "UPDATE dioo_metadata SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = 'rand_counter'",
                [newValue.toString()]
            );
            
            console.log(`🔢 Compteur aléatoire incrémenté: ${newValue}`);
            return newValue;
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'incrémentation du compteur:', error);
            throw error;
        }
    }

    /**
     * Effacer toutes les données (remplace StorageManager.clearAll)
     */
    async clearAll() {
        console.log('🗑️ DatabaseManager - Effacement de toutes les données');
        
        try {
            await this.executeQuery('DELETE FROM dioo_donnees');
            await this.executeQuery('DELETE FROM dioo_summary');
            await this.executeQuery("UPDATE dioo_metadata SET value = '0' WHERE key = 'rand_counter'");
            
            console.log('✅ Toutes les données effacées');
            return { success: true, message: 'Données effacées avec succès' };
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'effacement:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Migrer depuis localStorage (fonction de transition)
     */
    async migrateFromLocalStorage() {
        if (this.migrationCompleted) {
            console.log('ℹ️ Migration déjà effectuée');
            return true;
        }
        
        console.log('🔄 Début de la migration localStorage → SQLite');
        
        try {
            // Récupérer les anciennes données
            const oldData = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
            
            if (!oldData.donnees) {
                console.log('ℹ️ Aucune donnée à migrer');
                this.migrationCompleted = true;
                return true;
            }
            
            // Utiliser extractDataStructure pour la compatibilité
            const { lignes, headers } = window.extractDataStructure ? 
                window.extractDataStructure(oldData) : 
                { lignes: [], headers: [] };
            
            if (lignes.length > 0) {
                console.log(`🔄 Migration de ${lignes.length} lignes...`);
                await this.setDonnees(lignes, headers);
                console.log('✅ Migration des données terminée');
            }
            
            // Migrer le summary si présent
            const oldSummary = JSON.parse(localStorage.getItem('dioo_summary') || '[]');
            if (oldSummary.length > 0) {
                console.log(`🔄 Migration de ${oldSummary.length} éléments de summary...`);
                // TODO: Migrer le summary
            }
            
            this.migrationCompleted = true;
            console.log('🎉 Migration terminée avec succès !');
            return true;
            
        } catch (error) {
            console.error('❌ Erreur lors de la migration:', error);
            throw error;
        }
    }

    /**
     * Vérifier si la base est initialisée
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Obtenir des informations sur la base
     */
    async getInfo() {
        if (!this.initialized) {
            return { status: 'Non initialisé' };
        }
        
        try {
            const tables = await this.executeQuery(
                "SELECT name FROM sqlite_master WHERE type='table'"
            );
            
            const stats = await this.getStats();
            
            return {
                status: 'Initialisé',
                version: 'v0.000C-SQLjs-Migration',
                tables: tables.map(t => t.name),
                stats: stats,
                migrationCompleted: this.migrationCompleted
            };
            
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des infos:', error);
            return { status: 'Erreur', error: error.message };
        }
    }
}

// Instance globale
window.DatabaseManager = new DatabaseManager();

console.log('📦 DatabaseManager chargé - Prêt pour l\'initialisation');