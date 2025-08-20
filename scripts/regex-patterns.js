/**
 * Module de centralisation des expressions régulières
 * Version simplifiée - Contient seulement les patterns utilisés
 */

const RegexPatterns = {
    // ========================================
    // PATTERNS UTILISÉS
    // ========================================
    
    /**
     * Extraction de date d'un nom d'onglet Excel
     * Exemple: "Données_2024-01-15" → capture "2024-01-15"
     */
    EXCEL_DATE_EXTRACTION: /\d{4}-\d{2}-\d{2}/,
    
    /**
     * Remplacement des placeholders ? dans les requêtes SQL
     */
    SQL_PLACEHOLDER: /\?/g,
    
    // ========================================
    // MÉTHODES UTILITAIRES
    // ========================================
    
    /**
     * Échapper les guillemets simples dans les valeurs SQL
     * @param {string} value - Valeur à échapper
     * @returns {string} Valeur échappée
     */
    escapeSQLQuotes(value) {
        if (typeof value !== 'string') {
            return String(value);
        }
        return value.replace(/'/g, "''");
    },
    
    /**
     * Extrait une date d'un nom d'onglet Excel
     * @param {string} sheetName - Nom de l'onglet
     * @returns {string|null} Date extraite ou null si non trouvée
     */
    extractExcelDate(sheetName) {
        const match = sheetName.match(this.EXCEL_DATE_EXTRACTION);
        return match ? match[0] : null;
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegexPatterns;
} else if (typeof window !== 'undefined') {
    window.RegexPatterns = RegexPatterns;
}