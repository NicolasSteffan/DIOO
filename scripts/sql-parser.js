/**
 * Module de parsing SQL personnalisé
 * Centralise toute la logique de parsing et d'exécution des requêtes SQL custom
 */

const SQLParser = {
    // ========================================
    // MÉTHODES PRINCIPALES
    // ========================================
    
    /**
     * Exécute une requête SQL simple sur les données
     * @param {Array} lignes - Données à traiter
     * @param {Array} headers - En-têtes des colonnes
     * @param {string} query - Requête SQL à exécuter
     * @returns {Array} Résultats de la requête
     */
    executeQuery(lignes, headers, query) {
        console.log(`🔍 SQLParser - Parsing de la requête: "${query}"`);
        console.log(`📊 SQLParser - Données: ${lignes.length} lignes, ${headers.length} colonnes`);
        
        const queryLower = query.toLowerCase().trim();
        
        // Gestion des requêtes COUNT(*)
        if (RegexPatterns.isCountQuery(queryLower)) {
            return this._executeCountQuery(lignes, headers, query);
        }
        
        // Gestion des requêtes "filtrer par" (legacy)
        if (queryLower.includes('filtrer par')) {
            return this._executeFilterQuery(lignes, headers, query);
        }
        
        // Gestion des requêtes SELECT
        if (queryLower.includes('select')) {
            return this._executeSelectQuery(lignes, headers, query);
        }
        
        console.log('⚠️ SQLParser - Type de requête non reconnu, retour de toutes les données');
        return lignes.slice(0, 10); // Limite par défaut
    },
    
    /**
     * Crée une requête SQL.js équivalente (pour affichage)
     * @param {string} query - Requête originale
     * @param {Array} headers - En-têtes des colonnes
     * @returns {string} Requête SQL.js formatée
     */
    createSQLJSQuery(query, headers) {
        console.log(`🔧 SQLParser - Création requête SQL.js pour: "${query}"`);
        
        const queryLower = query.toLowerCase().trim();
        let sqlQuery = '';
        
        if (RegexPatterns.isCountQuery(queryLower)) {
            sqlQuery = 'SELECT COUNT(*) AS count FROM dioo_donnees';
            const whereClause = RegexPatterns.extractWhereClause(query);
            if (whereClause) {
                const convertedWhere = this._convertWhereClause(whereClause, headers);
                sqlQuery += ` WHERE ${convertedWhere}`;
            }
        } else if (queryLower.includes('select *') || (queryLower.includes('select') && !queryLower.includes('count'))) {
            sqlQuery = 'SELECT * FROM dioo_donnees';
            const whereClause = RegexPatterns.extractWhereClause(query);
            if (whereClause) {
                const convertedWhere = this._convertWhereClause(whereClause, headers);
                sqlQuery += ` WHERE ${convertedWhere}`;
            }
        } else if (queryLower.includes('select')) {
            // Requêtes SELECT complexes
            sqlQuery = query.replace(/dioo_donnees/gi, 'dioo_donnees');
            sqlQuery = RegexPatterns.replaceColumnBrackets(sqlQuery, (match, columnName) => {
                const realColumnName = this._findColumnName(headers, columnName);
                return realColumnName ? `"${realColumnName}"` : `"${columnName}"`;
            });
        } else {
            sqlQuery = 'SELECT * FROM dioo_donnees LIMIT 10';
        }
        
        // Nettoyer et finaliser
        sqlQuery = RegexPatterns.cleanSQLQuery(sqlQuery) + ';';
        
        console.log(`📤 SQLParser - Requête SQL.js générée: "${sqlQuery}"`);
        return sqlQuery;
    },
    
    // ========================================
    // MÉTHODES PRIVÉES - EXÉCUTION
    // ========================================
    
    /**
     * Exécute une requête COUNT(*)
     * @private
     */
    _executeCountQuery(lignes, headers, query) {
        console.log('📊 SQLParser - Exécution requête COUNT(*)');
        
        const whereClause = RegexPatterns.extractWhereClause(query);
        let lignesFiltrees = lignes;
        
        if (whereClause) {
            console.log(`🔍 SQLParser - Application WHERE: "${whereClause}"`);
            lignesFiltrees = this._filterWithWhere(lignes, headers, whereClause);
        }
        
        const count = lignesFiltrees.length;
        console.log(`✅ SQLParser - COUNT(*) résultat: ${count}`);
        
        return [{ 'Nombre de lignes': count }];
    },
    
    /**
     * Exécute une requête "filtrer par" (legacy)
     * @private
     */
    _executeFilterQuery(lignes, headers, query) {
        console.log('🔍 SQLParser - Exécution requête "filtrer par"');
        
        const condition = RegexPatterns.parseEqualityCondition(query);
        if (!condition) {
            console.log('⚠️ SQLParser - Condition non parsée pour "filtrer par"');
            return [];
        }
        
        const columnIndex = this._findColumnIndex(headers, condition.column);
        if (columnIndex === -1) {
            console.log(`⚠️ SQLParser - Colonne "${condition.column}" non trouvée`);
            return [];
        }
        
        const filtered = lignes.filter(ligne => {
            const valeur = ligne[headers[columnIndex]] || '';
            return valeur.toString().toUpperCase() === condition.value.toUpperCase();
        });
        
        console.log(`✅ SQLParser - Filtrage terminé: ${filtered.length} résultats`);
        return filtered;
    },
    
    /**
     * Exécute une requête SELECT
     * @private
     */
    _executeSelectQuery(lignes, headers, query) {
        console.log('📋 SQLParser - Exécution requête SELECT');
        
        // Extraire les colonnes demandées
        const selectColumns = RegexPatterns.extractSelectColumns(query);
        let colonnesARetourner = headers; // Par défaut, toutes les colonnes
        
        if (selectColumns && selectColumns !== '*') {
            // Parser les colonnes spécifiques
            const colonnesDemandees = selectColumns.split(',').map(col => {
                const cleaned = RegexPatterns.cleanColumnBrackets(col.trim());
                return this._findColumnName(headers, cleaned) || cleaned;
            });
            colonnesARetourner = colonnesDemandees.filter(col => headers.includes(col));
            console.log(`📋 SQLParser - Colonnes sélectionnées: ${colonnesARetourner.join(', ')}`);
        }
        
        // Appliquer le WHERE si présent
        const whereClause = RegexPatterns.extractWhereClause(query);
        let lignesFiltrees = lignes;
        
        if (whereClause) {
            console.log(`🔍 SQLParser - Application WHERE: "${whereClause}"`);
            lignesFiltrees = this._filterWithWhere(lignes, headers, whereClause);
        }
        
        // Projeter les colonnes demandées
        const resultats = lignesFiltrees.map(ligne => {
            const nouvelleLigne = {};
            colonnesARetourner.forEach(colonne => {
                nouvelleLigne[colonne] = ligne[colonne] || '';
            });
            return nouvelleLigne;
        });
        
        console.log(`✅ SQLParser - SELECT terminé: ${resultats.length} résultats, ${colonnesARetourner.length} colonnes`);
        return resultats;
    },
    
    // ========================================
    // MÉTHODES PRIVÉES - FILTRAGE
    // ========================================
    
    /**
     * Filtre les lignes avec une clause WHERE
     * @private
     */
    _filterWithWhere(lignes, headers, whereClause) {
        console.log(`🔍 SQLParser - Filtrage WHERE: "${whereClause}"`);
        
        // Séparer les conditions AND
        const conditions = whereClause.split(/\s+and\s+/i);
        console.log(`🔍 SQLParser - ${conditions.length} condition(s):`, conditions);
        
        return lignes.filter(ligne => {
            return conditions.every(condition => this._evaluateCondition(ligne, headers, condition.trim()));
        });
    },
    
    /**
     * Évalue une condition individuelle
     * @private
     */
    _evaluateCondition(ligne, headers, condition) {
        // Condition d'égalité
        const equalityCondition = RegexPatterns.parseEqualityCondition(condition);
        if (equalityCondition) {
            return this._evaluateEqualityCondition(ligne, headers, equalityCondition);
        }
        
        // Condition LIKE
        const likeCondition = RegexPatterns.parseLikeCondition(condition);
        if (likeCondition) {
            return this._evaluateLikeCondition(ligne, headers, likeCondition);
        }
        
        console.log(`⚠️ SQLParser - Condition non reconnue: "${condition}"`);
        return false; // Rejeter si condition non parsée
    },
    
    /**
     * Évalue une condition d'égalité
     * @private
     */
    _evaluateEqualityCondition(ligne, headers, condition) {
        const columnName = this._findColumnName(headers, condition.column);
        if (!columnName) {
            console.log(`⚠️ SQLParser - Colonne "${condition.column}" non trouvée`);
            return false;
        }
        
        const valeurLigne = ligne[columnName] || '';
        const resultat = valeurLigne.toString().toUpperCase() === condition.value.toUpperCase();
        
        console.log(`🔍 SQLParser - Égalité: ${columnName}="${valeurLigne}" = "${condition.value}" → ${resultat}`);
        return resultat;
    },
    
    /**
     * Évalue une condition LIKE
     * @private
     */
    _evaluateLikeCondition(ligne, headers, condition) {
        const columnName = this._findColumnName(headers, condition.column);
        if (!columnName) {
            console.log(`⚠️ SQLParser - Colonne "${condition.column}" non trouvée pour LIKE`);
            return false;
        }
        
        const valeurLigne = ligne[columnName] || '';
        const pattern = condition.pattern;
        
        // Convertir le pattern SQL LIKE en regex JavaScript
        const regexPattern = this._convertLikePattern(pattern);
        const regex = new RegExp(`^${regexPattern}$`, 'i');
        const resultat = regex.test(valeurLigne.toString());
        
        console.log(`🔍 SQLParser - LIKE: ${columnName}="${valeurLigne}" LIKE "${pattern}" (regex: ${regexPattern}) → ${resultat}`);
        return resultat;
    },
    
    // ========================================
    // MÉTHODES PRIVÉES - UTILITAIRES
    // ========================================
    
    /**
     * Convertit un pattern SQL LIKE en regex JavaScript
     * @private
     */
    _convertLikePattern(pattern) {
        // Utiliser des placeholders temporaires pour éviter les conflits
        let regexPattern = pattern
            .replace(/%/g, '__PERCENT__')
            .replace(/_/g, '__UNDERSCORE__')
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Échapper les caractères spéciaux regex
            .replace(/__PERCENT__/g, '.*')           // % → .*
            .replace(/__UNDERSCORE__/g, '.');        // _ → .
        
        return regexPattern;
    },
    
    /**
     * Trouve l'index d'une colonne par son nom
     * @private
     */
    _findColumnIndex(headers, columnName) {
        return headers.findIndex(header => 
            header.toLowerCase().includes(columnName.toLowerCase())
        );
    },
    
    /**
     * Trouve le nom exact d'une colonne
     * @private
     */
    _findColumnName(headers, columnName) {
        const index = this._findColumnIndex(headers, columnName);
        return index !== -1 ? headers[index] : null;
    },
    
    /**
     * Convertit une clause WHERE pour SQL.js
     * @private
     */
    _convertWhereClause(whereClause, headers) {
        return RegexPatterns.replaceColumnBrackets(whereClause, (match, columnName) => {
            const realColumnName = this._findColumnName(headers, columnName);
            return realColumnName ? `"${realColumnName}"` : `"${columnName}"`;
        });
    },
    
    // ========================================
    // MÉTHODES PUBLIQUES - UTILITAIRES
    // ========================================
    
    /**
     * Valide une requête SQL
     * @param {string} query - Requête à valider
     * @returns {Object} Résultat de validation
     */
    validateQuery(query) {
        const result = {
            valid: false,
            type: 'unknown',
            issues: []
        };
        
        if (!query || typeof query !== 'string') {
            result.issues.push('Requête vide ou invalide');
            return result;
        }
        
        const queryLower = query.toLowerCase().trim();
        
        if (RegexPatterns.isCountQuery(queryLower)) {
            result.type = 'count';
            result.valid = true;
        } else if (queryLower.includes('select')) {
            result.type = 'select';
            result.valid = true;
        } else if (queryLower.includes('filtrer par')) {
            result.type = 'filter';
            result.valid = true;
        } else {
            result.issues.push('Type de requête non supporté');
        }
        
        return result;
    },
    
    /**
     * Analyse une requête pour extraire ses composants
     * @param {string} query - Requête à analyser
     * @returns {Object} Composants de la requête
     */
    analyzeQuery(query) {
        const analysis = {
            original: query,
            type: 'unknown',
            hasWhere: false,
            whereClause: null,
            selectColumns: null,
            isCount: false
        };
        
        const queryLower = query.toLowerCase().trim();
        
        analysis.isCount = RegexPatterns.isCountQuery(queryLower);
        analysis.hasWhere = queryLower.includes('where');
        analysis.whereClause = RegexPatterns.extractWhereClause(query);
        analysis.selectColumns = RegexPatterns.extractSelectColumns(query);
        
        if (analysis.isCount) {
            analysis.type = 'count';
        } else if (queryLower.includes('select')) {
            analysis.type = 'select';
        } else if (queryLower.includes('filtrer par')) {
            analysis.type = 'filter';
        }
        
        console.log('🔍 SQLParser - Analyse de requête:', analysis);
        return analysis;
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SQLParser;
} else if (typeof window !== 'undefined') {
    window.SQLParser = SQLParser;
}