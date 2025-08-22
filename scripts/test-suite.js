/**
 * Suite de tests automatisés pour YesData Frequentation
 * Tests des fonctions principales après refactoring SQL.js
 */

const TestSuite = {
    results: [],
    
    /**
     * Lancer tous les tests
     */
    async runAllTests() {
        console.log('🧪 ===== DÉBUT DES TESTS AUTOMATISÉS =====');
        this.results = [];
        
        // Tests de base
        await this.testDatabaseManager();
        await this.testRequetesPredefinies();
        await this.testRequetesPersonnalisees();
        await this.testConsolidation();
        
        // Rapport final
        this.generateReport();
        
        console.log('🧪 ===== FIN DES TESTS AUTOMATISÉS =====');
        return this.results;
    },
    
    /**
     * Test DatabaseManager
     */
    async testDatabaseManager() {
        console.log('🔍 Test DatabaseManager...');
        
        try {
            // Test initialisation
            const isInit = window.DatabaseManager.isInitialized();
            this.addResult('DatabaseManager.isInitialized()', isInit, 'boolean');
            
            // Test données de test
            if (isInit) {
                const donnees = await window.DatabaseManager.getDonnees();
                this.addResult('DatabaseManager.getDonnees()', donnees !== null, 'object');
                
                const tables = await window.DatabaseManager.getTables();
                this.addResult('DatabaseManager.getTables()', Array.isArray(tables), 'array');
            }
            
        } catch (error) {
            this.addResult('DatabaseManager Tests', false, 'error', error.message);
        }
    },
    
    /**
     * Test requêtes prédéfinies
     */
    async testRequetesPredefinies() {
        console.log('🔍 Test requêtes prédéfinies...');
        
        const queries = [
            'informations_tables',
            'total_lignes', 
            'premieres_lignes',
            'ajouter_ligne_aleatoire'
        ];
        
        for (const queryType of queries) {
            try {
                // Simuler l'exécution sans affichage
                const originalAfficher = window.afficherResultats;
                let resultReceived = false;
                
                window.afficherResultats = (results, title) => {
                    resultReceived = true;
                    console.log(`📊 Résultat ${queryType}:`, results);
                };
                
                await window.executeQueryAsync(queryType);
                
                // Restaurer la fonction originale
                window.afficherResultats = originalAfficher;
                
                this.addResult(`Requête prédéfinie: ${queryType}`, resultReceived, 'function');
                
            } catch (error) {
                this.addResult(`Requête prédéfinie: ${queryType}`, false, 'error', error.message);
            }
        }
    },
    
    /**
     * Test requêtes personnalisées
     */
    async testRequetesPersonnalisees() {
        console.log('🔍 Test requêtes personnalisées...');
        
        const testQueries = [
            'SELECT COUNT(*) FROM yesdata_donnees',
        'SELECT * FROM yesdata_donnees LIMIT 5',
        'PRAGMA table_info(yesdata_donnees)'
        ];
        
        for (const query of testQueries) {
            try {
                // Simuler l'exécution
                const originalAfficher = window.afficherResultats;
                let resultReceived = false;
                
                window.afficherResultats = (results, title) => {
                    resultReceived = true;
                    console.log(`📊 Résultat requête "${query}":`, results);
                };
                
                // Mettre la requête dans le textarea
                const textarea = document.getElementById('custom-query');
                if (textarea) {
                    textarea.value = query;
                    await window.executeCustomQueryAsync();
                }
                
                // Restaurer la fonction originale
                window.afficherResultats = originalAfficher;
                
                this.addResult(`Requête personnalisée: ${query}`, resultReceived, 'function');
                
            } catch (error) {
                this.addResult(`Requête personnalisée: ${query}`, false, 'error', error.message);
            }
        }
    },
    
    /**
     * Test consolidation
     */
    async testConsolidation() {
        console.log('🔍 Test consolidation...');
        
        try {
            // Test avec données de test
            const testData = [
                { 'Dx': 'DP1', 'Business criticality': 'Critical', 'Functional monitoring (BSM)': 'YES' },
                { 'Dx': 'DP2', 'Business criticality': 'High', 'Functional monitoring (BSM)': 'NO' },
                { 'Dx': 'DP3', 'Business criticality': 'Medium', 'Functional monitoring (BSM)': 'YES' }
            ];
            
            const consolidation = await window.calculerConsolidation(testData);
            
            this.addResult('calculerConsolidation()', consolidation !== null, 'object');
            this.addResult('Sections DP générées', consolidation && consolidation.sections && Object.keys(consolidation.sections).length > 0, 'object');
            
        } catch (error) {
            this.addResult('calculerConsolidation()', false, 'error', error.message);
        }
    },
    
    /**
     * Ajouter un résultat de test
     */
    addResult(testName, success, type, errorMessage = null) {
        const result = {
            test: testName,
            success: success,
            type: type,
            error: errorMessage,
            timestamp: new Date().toISOString()
        };
        
        this.results.push(result);
        
        const status = success ? '✅' : '❌';
        const message = errorMessage ? ` (${errorMessage})` : '';
        console.log(`${status} ${testName}${message}`);
    },
    
    /**
     * Générer le rapport final
     */
    generateReport() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.success).length;
        const failed = total - passed;
        const percentage = Math.round((passed / total) * 100);
        
        console.log('\n📊 ===== RAPPORT DE TESTS =====');
        console.log(`Total: ${total} tests`);
        console.log(`✅ Réussis: ${passed} (${percentage}%)`);
        console.log(`❌ Échoués: ${failed}`);
        
        if (failed > 0) {
            console.log('\n❌ Tests échoués:');
            this.results.filter(r => !r.success).forEach(result => {
                console.log(`- ${result.test}: ${result.error || 'Échec'}`);
            });
        }
        
        console.log('===============================\n');
        
        // Stocker les résultats pour consultation
        window.testResults = this.results;
        
        return {
            total,
            passed,
            failed,
            percentage,
            results: this.results
        };
    }
};

// Exposer la suite de tests
window.TestSuite = TestSuite;

// Fonction de lancement rapide
window.runTests = () => TestSuite.runAllTests();