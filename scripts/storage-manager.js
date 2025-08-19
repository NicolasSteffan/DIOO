/**
 * Module de gestion centralisée du localStorage
 * Centralise tous les accès aux données persistantes de l'application DIOO
 */

const StorageManager = {
    // ========================================
    // CONSTANTES DE CLÉS
    // ========================================
    
    KEYS: {
        DIOO_DONNEES: 'dioo_donnees',
        DIOO_SUMMARY: 'dioo_summary', 
        DIOO_RAND_COUNTER: 'dioo_rand_counter'
    },
    
    // ========================================
    // MÉTHODES PRINCIPALES - DONNÉES
    // ========================================
    
    /**
     * Récupère les données principales DIOO
     * @returns {Object} Structure: { donnees: [...], headers: [...] }
     */
    getDonnees() {
        try {
            const data = localStorage.getItem(this.KEYS.DIOO_DONNEES);
            const parsed = JSON.parse(data || '{}');
            console.log('📖 StorageManager - Lecture dioo_donnees:', {
                hasData: !!data,
                structure: Object.keys(parsed),
                dataLength: parsed.donnees?.donnees?.length || parsed.donnees?.length || 0
            });
            return parsed;
        } catch (error) {
            console.error('❌ StorageManager - Erreur lecture dioo_donnees:', error);
            return {};
        }
    },
    
    /**
     * Sauvegarde les données principales DIOO
     * @param {Object} donnees - Structure: { donnees: [...], headers: [...] }
     * @returns {boolean} true si succès, false sinon
     */
    setDonnees(donnees) {
        try {
            const dataString = JSON.stringify(donnees);
            localStorage.setItem(this.KEYS.DIOO_DONNEES, dataString);
            
            console.log('💾 StorageManager - Sauvegarde dioo_donnees:', {
                size: dataString.length,
                structure: Object.keys(donnees),
                dataLength: donnees.donnees?.donnees?.length || donnees.donnees?.length || 0
            });
            
            // Vérification de la sauvegarde
            const verification = this.getDonnees();
            const success = JSON.stringify(verification) === dataString;
            
            if (success) {
                console.log('✅ StorageManager - Sauvegarde vérifiée avec succès');
            } else {
                console.error('❌ StorageManager - Échec de la vérification de sauvegarde');
            }
            
            return success;
        } catch (error) {
            console.error('❌ StorageManager - Erreur sauvegarde dioo_donnees:', error);
            return false;
        }
    },
    
    /**
     * Supprime les données principales DIOO
     * @returns {boolean} true si succès
     */
    removeDonnees() {
        try {
            localStorage.removeItem(this.KEYS.DIOO_DONNEES);
            console.log('🗑️ StorageManager - Suppression dioo_donnees');
            return true;
        } catch (error) {
            console.error('❌ StorageManager - Erreur suppression dioo_donnees:', error);
            return false;
        }
    },
    
    // ========================================
    // MÉTHODES SUMMARY/HISTORIQUE
    // ========================================
    
    /**
     * Récupère l'historique des calculs de consolidation
     * @returns {Array} Tableau des entrées d'historique
     */
    getSummary() {
        try {
            const data = localStorage.getItem(this.KEYS.DIOO_SUMMARY);
            const parsed = JSON.parse(data || '[]');
            console.log('📖 StorageManager - Lecture dioo_summary:', {
                hasData: !!data,
                length: parsed.length
            });
            return parsed;
        } catch (error) {
            console.error('❌ StorageManager - Erreur lecture dioo_summary:', error);
            return [];
        }
    },
    
    /**
     * Sauvegarde l'historique des calculs
     * @param {Array} summary - Tableau des entrées d'historique
     * @returns {boolean} true si succès
     */
    setSummary(summary) {
        try {
            const dataString = JSON.stringify(summary);
            localStorage.setItem(this.KEYS.DIOO_SUMMARY, dataString);
            
            console.log('💾 StorageManager - Sauvegarde dioo_summary:', {
                size: dataString.length,
                length: summary.length
            });
            
            return true;
        } catch (error) {
            console.error('❌ StorageManager - Erreur sauvegarde dioo_summary:', error);
            return false;
        }
    },
    
    /**
     * Ajoute une entrée à l'historique
     * @param {Object} entry - Nouvelle entrée d'historique
     * @param {number} maxEntries - Nombre maximum d'entrées (défaut: 50)
     * @returns {boolean} true si succès
     */
    addSummaryEntry(entry, maxEntries = 50) {
        try {
            const currentSummary = this.getSummary();
            currentSummary.unshift(entry); // Ajouter au début
            
            // Limiter le nombre d'entrées
            if (currentSummary.length > maxEntries) {
                currentSummary.splice(maxEntries);
            }
            
            return this.setSummary(currentSummary);
        } catch (error) {
            console.error('❌ StorageManager - Erreur ajout summary:', error);
            return false;
        }
    },
    
    /**
     * Supprime l'historique des calculs
     * @returns {boolean} true si succès
     */
    removeSummary() {
        try {
            localStorage.removeItem(this.KEYS.DIOO_SUMMARY);
            console.log('🗑️ StorageManager - Suppression dioo_summary');
            return true;
        } catch (error) {
            console.error('❌ StorageManager - Erreur suppression dioo_summary:', error);
            return false;
        }
    },
    
    // ========================================
    // MÉTHODES COMPTEUR ALÉATOIRE
    // ========================================
    
    /**
     * Récupère le compteur pour les lignes aléatoires
     * @returns {number} Valeur du compteur
     */
    getRandCounter() {
        try {
            const value = localStorage.getItem(this.KEYS.DIOO_RAND_COUNTER);
            const counter = parseInt(value || '0');
            console.log('📖 StorageManager - Lecture dioo_rand_counter:', counter);
            return counter;
        } catch (error) {
            console.error('❌ StorageManager - Erreur lecture dioo_rand_counter:', error);
            return 0;
        }
    },
    
    /**
     * Sauvegarde le compteur pour les lignes aléatoires
     * @param {number} counter - Nouvelle valeur du compteur
     * @returns {boolean} true si succès
     */
    setRandCounter(counter) {
        try {
            localStorage.setItem(this.KEYS.DIOO_RAND_COUNTER, counter.toString());
            console.log('💾 StorageManager - Sauvegarde dioo_rand_counter:', counter);
            return true;
        } catch (error) {
            console.error('❌ StorageManager - Erreur sauvegarde dioo_rand_counter:', error);
            return false;
        }
    },
    
    /**
     * Incrémente et retourne le compteur
     * @returns {number} Nouvelle valeur du compteur
     */
    incrementRandCounter() {
        const current = this.getRandCounter();
        const newValue = current + 1;
        this.setRandCounter(newValue);
        return newValue;
    },
    
    /**
     * Supprime le compteur aléatoire
     * @returns {boolean} true si succès
     */
    removeRandCounter() {
        try {
            localStorage.removeItem(this.KEYS.DIOO_RAND_COUNTER);
            console.log('🗑️ StorageManager - Suppression dioo_rand_counter');
            return true;
        } catch (error) {
            console.error('❌ StorageManager - Erreur suppression dioo_rand_counter:', error);
            return false;
        }
    },
    
    // ========================================
    // MÉTHODES UTILITAIRES
    // ========================================
    
    /**
     * Efface toutes les données DIOO du localStorage
     * @returns {Object} Rapport de suppression
     */
    clearAll() {
        console.log('🧹 StorageManager - Nettoyage complet du localStorage');
        
        const report = {
            donnees: this.removeDonnees(),
            summary: this.removeSummary(),
            randCounter: this.removeRandCounter(),
            success: true
        };
        
        report.success = report.donnees && report.summary && report.randCounter;
        
        console.log('📊 StorageManager - Rapport de nettoyage:', report);
        return report;
    },
    
    /**
     * Obtient des statistiques sur le stockage
     * @returns {Object} Statistiques détaillées
     */
    getStats() {
        const donnees = this.getDonnees();
        const summary = this.getSummary();
        const randCounter = this.getRandCounter();
        
        const stats = {
            donnees: {
                exists: Object.keys(donnees).length > 0,
                structure: Object.keys(donnees),
                dataLength: donnees.donnees?.donnees?.length || donnees.donnees?.length || 0,
                headersLength: donnees.headers?.length || donnees.donnees?.headers?.length || 0,
                sizeBytes: JSON.stringify(donnees).length
            },
            summary: {
                exists: summary.length > 0,
                length: summary.length,
                sizeBytes: JSON.stringify(summary).length
            },
            randCounter: {
                value: randCounter,
                sizeBytes: randCounter.toString().length
            },
            total: {
                sizeBytes: JSON.stringify(donnees).length + JSON.stringify(summary).length + randCounter.toString().length
            }
        };
        
        console.log('📊 StorageManager - Statistiques:', stats);
        return stats;
    },
    
    /**
     * Vérifie l'intégrité des données stockées
     * @returns {Object} Rapport d'intégrité
     */
    checkIntegrity() {
        const report = {
            donnees: { valid: false, issues: [] },
            summary: { valid: false, issues: [] },
            randCounter: { valid: false, issues: [] },
            overall: { valid: false }
        };
        
        // Vérification des données principales
        try {
            const donnees = this.getDonnees();
            if (Object.keys(donnees).length === 0) {
                report.donnees.issues.push('Aucune donnée trouvée');
            } else if (!donnees.donnees && !donnees.headers) {
                report.donnees.issues.push('Structure de données invalide');
            } else {
                report.donnees.valid = true;
            }
        } catch (error) {
            report.donnees.issues.push(`Erreur de lecture: ${error.message}`);
        }
        
        // Vérification du summary
        try {
            const summary = this.getSummary();
            if (!Array.isArray(summary)) {
                report.summary.issues.push('Summary n\'est pas un tableau');
            } else {
                report.summary.valid = true;
            }
        } catch (error) {
            report.summary.issues.push(`Erreur de lecture: ${error.message}`);
        }
        
        // Vérification du compteur
        try {
            const counter = this.getRandCounter();
            if (isNaN(counter) || counter < 0) {
                report.randCounter.issues.push('Compteur invalide');
            } else {
                report.randCounter.valid = true;
            }
        } catch (error) {
            report.randCounter.issues.push(`Erreur de lecture: ${error.message}`);
        }
        
        report.overall.valid = report.donnees.valid && report.summary.valid && report.randCounter.valid;
        
        console.log('🔍 StorageManager - Rapport d\'intégrité:', report);
        return report;
    },
    
    /**
     * Exporte toutes les données pour sauvegarde
     * @returns {Object} Données exportées
     */
    exportAll() {
        return {
            timestamp: new Date().toISOString(),
            version: 'v0.000-stable-extract-viewer-database',
            data: {
                donnees: this.getDonnees(),
                summary: this.getSummary(),
                randCounter: this.getRandCounter()
            }
        };
    },
    
    /**
     * Importe des données depuis une sauvegarde
     * @param {Object} exportedData - Données exportées
     * @returns {boolean} true si succès
     */
    importAll(exportedData) {
        try {
            if (!exportedData.data) {
                throw new Error('Format de données invalide');
            }
            
            const success = {
                donnees: this.setDonnees(exportedData.data.donnees || {}),
                summary: this.setSummary(exportedData.data.summary || []),
                randCounter: this.setRandCounter(exportedData.data.randCounter || 0)
            };
            
            const allSuccess = success.donnees && success.summary && success.randCounter;
            
            console.log('📥 StorageManager - Import terminé:', { success, allSuccess });
            return allSuccess;
        } catch (error) {
            console.error('❌ StorageManager - Erreur import:', error);
            return false;
        }
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
}