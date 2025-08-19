/**
 * Module de centralisation des expressions régulières
 * Regroupe tous les patterns regex utilisés dans l'application DIOO
 */

const RegexPatterns = {
    // ========================================
    // PATTERNS SQL PARSING
    // ========================================
    
    /**
     * Extraction de la clause WHERE dans une requête SQL
     * Exemple: "SELECT * FROM table WHERE condition;" → capture "condition"
     */
    SQL_WHERE_CLAUSE: /where\s+(.+?)(?:;|$)/i,
    
    /**
     * Extraction de la clause SELECT avec colonnes
     * Exemple: "SELECT col1, col2 FROM table" → capture "col1, col2"
     */
    SQL_SELECT_COLUMNS: /select\s+(.+?)\s+from/i,
    
    /**
     * Détection des requêtes COUNT(*)
     * Exemple: "SELECT COUNT(*) FROM table"
     */
    SQL_COUNT_QUERY: /select\s+count\(\*\)/i,
    
    /**
     * Condition d'égalité avec crochets
     * Exemple: "[Business criticality] = 'Critical'" → capture colonne et valeur
     */
    SQL_EQUALITY_CONDITION: /\[([^\]]+)\]\s*=\s*['"']([^'"']+)['"']/i,
    
    /**
     * Condition LIKE avec crochets
     * Exemple: "[Dx] LIKE 'DP%'" → capture colonne et pattern
     */
    SQL_LIKE_CONDITION: /\[([^\]]+)\]\s+like\s+['"']([^'"']+)['"']/i,
    
    /**
     * Remplacement des noms de colonnes avec crochets
     * Exemple: "[Business criticality]" → capture "Business criticality"
     */
    SQL_COLUMN_BRACKETS: /\[([^\]]+)\]/g,
    
    /**
     * Nettoyage des crochets en début/fin
     * Exemple: "[colonne]" → "colonne"
     */
    SQL_CLEAN_BRACKETS: /^\[|\]$/g,
    
    /**
     * Suppression des points-virgules en fin de requête
     */
    SQL_TRAILING_SEMICOLON: /;+$/,
    
    // ========================================
    // PATTERNS EXCEL PARSING
    // ========================================
    
    /**
     * Extraction de dates dans les noms d'onglets Excel
     * Formats supportés: DD/MM/YYYY, YYYY-MM-DD, DD Month YYYY
     */
    EXCEL_DATE_EXTRACTION: /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})|(\d{1,2}\s+\w+\s+\d{4})/,
    
    // ========================================
    // PATTERNS VALIDATION DONNÉES
    // ========================================
    
    /**
     * Détection de caractères spéciaux (non-ASCII imprimables)
     * Utilisé pour valider l'intégrité des données
     */
    NON_ASCII_CHARS: /[^\x20-\x7E]/,
    
    /**
     * Nettoyage des caractères spéciaux
     * Remplace par '?' les caractères non-ASCII
     */
    CLEAN_NON_ASCII: /[^\x20-\x7E]/g,
    
    // ========================================
    // PATTERNS UI
    // ========================================
    
    /**
     * Conversion d'ID de contenu vers ID de LED
     * Exemple: "section-content" → "section-led"
     */
    CONTENT_TO_LED_ID: /-content$/,
    
    /**
     * Conversion d'ID de contenu vers ID de flèche
     * Exemple: "section-content" → "section-arrow"
     */
    CONTENT_TO_ARROW_ID: /-content$/,
    
    // ========================================
    // PATTERNS FORMATAGE SQL
    // ========================================
    
    /**
     * Remplacement des placeholders ? dans les requêtes SQL
     * Utilisé pour l'affichage des requêtes avec valeurs réelles
     */
    SQL_PLACEHOLDER: /\?/g,
    
    /**
     * Échappement des apostrophes dans les valeurs SQL
     * Exemple: "O'Connor" → "O''Connor"
     */
    SQL_ESCAPE_QUOTES: /'/g,
    
    // ========================================
    // MÉTHODES UTILITAIRES
    // ========================================
    
    /**
     * Teste si une chaîne contient des caractères non-ASCII
     * @param {string} text - Texte à tester
     * @returns {boolean} true si des caractères spéciaux sont détectés
     */
    hasSpecialChars(text) {
        return this.NON_ASCII_CHARS.test(String(text));
    },
    
    /**
     * Nettoie les caractères non-ASCII d'une chaîne
     * @param {string} text - Texte à nettoyer
     * @returns {string} Texte nettoyé
     */
    cleanSpecialChars(text) {
        return String(text).replace(this.CLEAN_NON_ASCII, '?');
    },
    
    /**
     * Échappe les apostrophes pour SQL
     * @param {string} value - Valeur à échapper
     * @returns {string} Valeur échappée
     */
    escapeSQLQuotes(value) {
        return String(value).replace(this.SQL_ESCAPE_QUOTES, "''");
    },
    
    /**
     * Extrait la clause WHERE d'une requête SQL
     * @param {string} query - Requête SQL
     * @returns {string|null} Clause WHERE ou null si non trouvée
     */
    extractWhereClause(query) {
        const match = query.match(this.SQL_WHERE_CLAUSE);
        return match ? match[1].trim() : null;
    },
    
    /**
     * Extrait les colonnes d'une requête SELECT
     * @param {string} query - Requête SQL
     * @returns {string|null} Liste des colonnes ou null si non trouvée
     */
    extractSelectColumns(query) {
        const match = query.match(this.SQL_SELECT_COLUMNS);
        return match ? match[1].trim() : null;
    },
    
    /**
     * Vérifie si une requête est un COUNT(*)
     * @param {string} query - Requête SQL
     * @returns {boolean} true si c'est une requête COUNT(*)
     */
    isCountQuery(query) {
        return this.SQL_COUNT_QUERY.test(query.toLowerCase());
    },
    
    /**
     * Nettoie les crochets d'un nom de colonne
     * @param {string} columnName - Nom de colonne avec ou sans crochets
     * @returns {string} Nom de colonne sans crochets
     */
    cleanColumnBrackets(columnName) {
        return columnName.replace(this.SQL_CLEAN_BRACKETS, '');
    },
    
    /**
     * Remplace les noms de colonnes avec crochets par des noms SQL valides
     * @param {string} query - Requête SQL avec crochets
     * @param {Function} replacer - Fonction de remplacement
     * @returns {string} Requête SQL avec noms de colonnes convertis
     */
    replaceColumnBrackets(query, replacer) {
        return query.replace(this.SQL_COLUMN_BRACKETS, replacer);
    },
    
    /**
     * Nettoie une requête SQL (supprime les points-virgules en fin)
     * @param {string} query - Requête SQL à nettoyer
     * @returns {string} Requête SQL nettoyée
     */
    cleanSQLQuery(query) {
        return query.replace(this.SQL_TRAILING_SEMICOLON, '');
    },
    
    /**
     * Parse une condition d'égalité SQL
     * @param {string} condition - Condition à parser
     * @returns {Object|null} {column, value} ou null si non parsée
     */
    parseEqualityCondition(condition) {
        const match = condition.match(this.SQL_EQUALITY_CONDITION);
        return match ? { column: match[1], value: match[2] } : null;
    },
    
    /**
     * Parse une condition LIKE SQL
     * @param {string} condition - Condition à parser
     * @returns {Object|null} {column, pattern} ou null si non parsée
     */
    parseLikeCondition(condition) {
        const match = condition.match(this.SQL_LIKE_CONDITION);
        return match ? { column: match[1], pattern: match[2] } : null;
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