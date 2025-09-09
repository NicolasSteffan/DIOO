/**
 * Application DIOO - Script principal
 * Gestion de la navigation et interactions utilisateur
 */

class DiooApp {
    constructor() {
        this.currentPage = 'chargement';
        this.pages = ['chargement', 'monitoring', 'database'];
        this.init();
    }

    /**
     * Initialisation de l'application
     */
    init() {
        this.setupEventListeners();
        this.updatePageTitle();
        this.showWelcomeMessage();
        this.initCanvasMenu();
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

        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Prévention du comportement par défaut des boutons
        document.addEventListener('click', (e) => {
            if (e.target.type === 'button') {
                e.preventDefault();
            }
        });
    }

    /**
     * Navigation vers une page spécifique
     * @param {string} pageName - Nom de la page à afficher
     */
    navigateToPage(pageName) {
        console.log(`🚀 Tentative de navigation vers: ${pageName}`);
        console.log(`🔍 Pages disponibles: ${this.pages.join(', ')}`);
        
        if (!this.pages.includes(pageName)) {
            console.warn(`⚠️ Page "${pageName}" non trouvée dans la liste des pages disponibles`);
            return;
        }

        console.log(`✅ Page "${pageName}" trouvée, début de la navigation`);

        // Masquer toutes les pages
        console.log(`🙈 Masquage de toutes les pages`);
        this.hideAllPages();

        // Afficher la page demandée
        console.log(`👁️ Affichage de la page: ${pageName}`);
        this.showPage(pageName);

        // Mettre à jour la navigation
        console.log(`🔄 Mise à jour de la navigation`);
        this.updateNavigation(pageName);

        // Mettre à jour l'état courant
        this.currentPage = pageName;

        // Mettre à jour le titre de la page
        this.updatePageTitle();

        // Log pour débogage
        console.log(`📄 Navigation terminée vers la page: ${pageName}`);

        // Déclencher un événement personnalisé
        this.dispatchPageChangeEvent(pageName);
    }

    /**
     * Masquer toutes les pages
     */
    hideAllPages() {
        this.pages.forEach(pageName => {
            const pageElement = document.getElementById(`${pageName}-page`);
            console.log(`🔍 Recherche de l'élément: ${pageName}-page`);
            if (pageElement) {
                console.log(`✅ Élément trouvé, masquage de: ${pageName}-page`);
                pageElement.classList.remove('active');
            } else {
                console.warn(`⚠️ Élément non trouvé: ${pageName}-page`);
            }
        });
    }

    /**
     * Afficher une page spécifique
     * @param {string} pageName - Nom de la page à afficher
     */
    showPage(pageName) {
        const pageElement = document.getElementById(`${pageName}-page`);
        console.log(`🔍 Recherche de l'élément à afficher: ${pageName}-page`);
        if (pageElement) {
            console.log(`✅ Élément trouvé, affichage de: ${pageName}-page`);
            pageElement.classList.add('active');
            
            // Animation d'entrée
            pageElement.style.opacity = '0';
            setTimeout(() => {
                pageElement.style.opacity = '1';
            }, 50);
        } else {
            console.error(`❌ Impossible de trouver l'élément: ${pageName}-page`);
        }
    }

    /**
     * Mettre à jour l'état de la navigation
     * @param {string} activePage - Page actuellement active
     */
    updateNavigation(activePage) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            const buttonPage = button.dataset.page;
            if (buttonPage === activePage) {
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
        const pageNames = {
            'chargement': 'Chargement',
            'monitoring': 'Monitoring'
        };
        
        const currentPageName = pageNames[this.currentPage] || 'DIOO';
        document.title = `${currentPageName} - DIOO`;
    }

    /**
     * Gestion des raccourcis clavier
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeyboardShortcuts(e) {
        // Alt + 1 = Page Chargement
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            this.navigateToPage('chargement');
        }
        
        // Alt + 2 = Page Monitoring
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            this.navigateToPage('monitoring');
        }

        // Échap pour revenir à la première page
        if (e.key === 'Escape') {
            this.navigateToPage('chargement');
        }
    }

    /**
     * Gestion du redimensionnement de la fenêtre
     */
    handleWindowResize() {
        // Ajuster l'interface si nécessaire
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
    }

    /**
     * Déclencher un événement personnalisé lors du changement de page
     * @param {string} pageName - Nom de la nouvelle page
     */
    dispatchPageChangeEvent(pageName) {
        const event = new CustomEvent('pageChange', {
            detail: {
                currentPage: pageName,
                previousPage: this.currentPage,
                timestamp: new Date().toISOString()
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Afficher un message de bienvenue dans la console
     */
    showWelcomeMessage() {
        console.log(`
🚀 Application DIOO v1.0.0 - Style FDJ Futuriste
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 Thème: Design futuriste sombre avec effets visuels
📋 Modules disponibles: ${this.pages.join(', ')}
🎯 Module actuel: ${this.currentPage}
🖥️ Canvas cylindrique: Activé
✨ Background gradients: Activé
⌨️ Raccourcis:
   • Alt + 1: Module Chargement
   • Alt + 2: Module Monitoring
   • Échap: Retour à l'accueil
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
    }

    /**
     * Obtenir des informations sur l'état actuel de l'application
     * @returns {Object} Informations sur l'état de l'application
     */
    getAppState() {
        return {
            currentPage: this.currentPage,
            availablePages: this.pages,
            version: 'v0.000-stable-extract-viewer-database',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Réinitialiser l'application à son état initial
     */
    reset() {
        this.navigateToPage('chargement');
        console.log('🔄 Application réinitialisée');
    }

    /**
     * Initialiser le menu canvas cylindrique - Style FDJ
     */
    initCanvasMenu() {
        this.drawCylMenu();
        window.addEventListener('resize', () => this.drawCylMenu());
    }

    /**
     * Dessiner le menu cylindrique - Inspiré du projet FDJ
     */
    drawCylMenu() {
        const menuCanvas = document.getElementById('menuCanvas');
        if (!menuCanvas) return;

        const header = document.querySelector('.app-header');
        if (!header) return;

        const dpr = window.devicePixelRatio || 1;
        const w = header.clientWidth;
        const h = header.clientHeight;
        
        menuCanvas.style.position = 'absolute';
        menuCanvas.style.left = '0';
        menuCanvas.style.top = '0';
        menuCanvas.style.width = w + 'px';
        menuCanvas.style.height = h + 'px';
        menuCanvas.width = Math.floor(w * dpr);
        menuCanvas.height = Math.floor(h * dpr);
        
        const ctx = menuCanvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        const radius = Math.min(18, h / 2 - 2);
        const padding = 8;
        const barH = Math.max(h - padding * 2, 12);
        const barW = w - padding * 2;
        const x = padding;
        const y = (h - barH) / 2;

        // Gradient principal
        const grd = ctx.createLinearGradient(0, y, 0, y + barH);
        grd.addColorStop(0, 'rgba(255,255,255,0.18)');
        grd.addColorStop(0.5, 'rgba(255,255,255,0.06)');
        grd.addColorStop(1, 'rgba(0,0,0,0.18)');

        ctx.beginPath();
        this.roundRect(ctx, x, y, barW, barH, radius);
        ctx.fillStyle = grd;
        ctx.fill();

        // Highlight spéculaire
        ctx.beginPath();
        this.roundRect(ctx, x + 2, y + 2, barW - 4, barH * 0.35, radius * 0.8);
        const hi = ctx.createLinearGradient(0, y + 2, 0, y + 2 + barH * 0.35);
        hi.addColorStop(0, 'rgba(255,255,255,0.25)');
        hi.addColorStop(1, 'rgba(255,255,255,0.02)');
        ctx.fillStyle = hi;
        ctx.fill();

        // Ombre du bas
        ctx.beginPath();
        this.roundRect(ctx, x + 2, y + barH * 0.6, barW - 4, barH * 0.35, radius * 0.8);
        const sh = ctx.createLinearGradient(0, y + barH * 0.6, 0, y + barH);
        sh.addColorStop(0, 'rgba(0,0,0,0.08)');
        sh.addColorStop(1, 'rgba(0,0,0,0.18)');
        ctx.fillStyle = sh;
        ctx.fill();
    }

    /**
     * Fonction utilitaire pour dessiner des rectangles arrondis
     */
    roundRect(ctx, x, y, width, height, radius) {
        const r = Math.max(0, Math.min(radius, height / 2));
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}

/**
 * Utilitaires globaux
 */
const DiooUtils = {
    /**
     * Formater une date au format français
     * @param {Date} date - Date à formater
     * @returns {string} Date formatée
     */
    formatDate(date = new Date()) {
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    /**
     * Afficher une notification
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (info, success, warning, error)
     */
    showNotification(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Suppression automatique après 3 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    /**
     * Obtenir l'icône pour un type de notification
     * @param {string} type - Type de notification
     * @returns {string} Classe d'icône
     */
    getIconForType(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    },

    /**
     * Vérifier si l'appareil est mobile
     * @returns {boolean} True si mobile
     */
    isMobile() {
        return window.innerWidth <= 768;
    }
};

/**
 * Initialisation de l'application au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    // Créer une instance globale de l'application
    window.diooApp = new DiooApp();
    
    // Exposer les utilitaires globalement
    window.DiooUtils = DiooUtils;
    
    // Initialiser les variables globales de données
    window.dumpData = {
        donnees: [],
        headers: [],
        pageActuelle: 1,
        lignesParPage: 10,
        totalPages: 1,
        estOuverte: false
    };
    
    window.resultsData = {
        donnees: [],
        headers: [],
        pageActuelle: 1,
        lignesParPage: 50,
        totalPages: 1
    };
    
    // Variables pour la sélection de feuille Excel
    window.excelSheetsAnalysis = null;
    window.selectedSheetName = null;
    window.fichierCourant = null;
    window.donneesImportees = null;
    
    console.log('✅ Variables globales initialisées:', {
        dumpData: !!window.dumpData,
        resultsData: !!window.resultsData,
        excelSheetsAnalysis: !!window.excelSheetsAnalysis,
        selectedSheetName: !!window.selectedSheetName
    });

    // ========================================
    // PHASE 3 - INITIALISATION DATABASEMANAGER
    // ========================================
    
    console.log('🔄 Phase 3 - Initialisation DatabaseManager...');
    
    // Fonction d'initialisation asynchrone
    async function initializeDatabaseManager() {
        try {
            await window.DatabaseManager.init();
            console.log('✅ DatabaseManager initialisé avec succès');
            
            // Tenter la migration depuis localStorage
            await window.DatabaseManager.migrateFromLocalStorage();
            console.log('✅ Migration localStorage terminée');
            
            // Afficher les infos de la base
            const info = await window.DatabaseManager.getInfo();
            console.log('📊 Info DatabaseManager:', info);
            
            // Marquer comme prêt
            window.DatabaseManager.ready = true;
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation DatabaseManager:', error);
            console.warn('⚠️ Retour au mode localStorage en cas d\'échec');
            window.DatabaseManager.ready = false;
        }
    }
    
    // Lancer l'initialisation en arrière-plan
    initializeDatabaseManager();

    // ========================================
    // FONCTIONS UTILITAIRES REFACTORISÉES
    // ========================================

    /**
     * Fonction utilitaire pour extraire la structure des données
     * Remplace la logique répétitive dans plusieurs fonctions
     */
    window.extractDataStructure = function(donnees) {
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
    };

    // Vérifier automatiquement le nombre de lignes dans la base
    setTimeout(() => {
        const nombreLignes = compterLignes();
        if (nombreLignes > 0) {
            console.log(`📊 BASE DE DONNÉES: ${nombreLignes} lignes chargées`);
            console.log(`🔍 Pour plus de détails, tapez: dioo.diagnostic()`);
        } else {
            console.log(`📊 BASE DE DONNÉES: Aucune donnée chargée`);
            console.log(`🔍 Chargez un fichier DIOO via la page Chargement`);
        }
    }, 1000);

    // Écouter les événements de changement de page
    document.addEventListener('pageChange', (e) => {
        console.log(`📄 Changement de page détecté:`, e.detail);
    });

    // Initialiser la classe CSS mobile si nécessaire
    if (DiooUtils.isMobile()) {
        document.body.classList.add('mobile-view');
    }
});

/**
 * Gestion des erreurs globales
 */
window.addEventListener('error', (e) => {
    console.error('❌ Erreur dans l\'application DIOO:', e.error);
});

/**
 * Fonctions de gestion des fichiers DIOO
 */

/**
 * Gérer le clic sur le bouton Charger
 */
function gererClicCharger() {
    const chargerBtn = document.getElementById('charger-fichier');
    
    // Si le bouton est dans l'état "loaded", on remet à gris
    if (chargerBtn && chargerBtn.classList.contains('loaded')) {
        console.log('🔄 Remise à zéro du bouton Charger');
        reinitialiserEtats();
        DiooUtils.showNotification('État remis à zéro', 'info');
        return;
    }
    
    // Sinon, lancer le processus de chargement
    chargerFichierDIOO();
}

/**
 * Fonction principale pour charger un fichier DIOO
 * Enchaine toutes les étapes : sélection, import, validation
 */
function chargerFichierDIOO() {
    console.log('🚀 Début du processus de chargement DIOO');
    
    // Réinitialiser les états
    reinitialiserEtats();
    
    // Ouvrir le sélecteur de fichier
    const selecteur = document.getElementById('selecteur-fichier');
    if (selecteur) {
        selecteur.click();
        console.log('📁 Ouverture du sélecteur de fichier DIOO');
    }
}

/**
 * Gestionnaire de sélection de fichier - Version enchainée
 * @param {HTMLInputElement} input - Élément input file
 */
function fichierSelectionne(input) {
    const fichier = input.files[0];
    if (!fichier) {
        reinitialiserEtats();
        return;
    }

    console.log('📄 Fichier sélectionné:', fichier.name);

    // Stocker les informations du fichier
    window.fichierCourant = {
        file: fichier,
        name: fichier.name,
        size: fichier.size,
        type: fichier.type,
        lastModified: new Date(fichier.lastModified)
    };

    // Vérifier si c'est un fichier Excel
    const extension = fichier.name.split('.').pop().toLowerCase();
    if (extension === 'xlsx') {
        console.log('📊 Fichier Excel détecté - Analyse des feuilles...');
        analyserFeuillesExcel();
    } else {
        console.log('📄 Fichier non-Excel - Import direct');
        // Démarrer le processus enchainé directement pour les autres formats
        demarrerProcessusEnchaine();
    }
}

/**
 * Analyser les feuilles d'un fichier Excel avant l'import
 */
async function analyserFeuillesExcel() {
    try {
        console.log('🔍 Début analyse feuilles Excel');
        
        // Afficher un indicateur de chargement
        mettreAJourProgression(10, 'Analyse du fichier Excel', 'Lecture des feuilles disponibles...');
        afficherProgression();
        
        // Lire le fichier
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                console.log('📊 Analyse des feuilles Excel en cours...');
                
                // Analyser les feuilles sans parser le contenu complet
                const sheetsAnalysis = analyzeExcelSheets(e.target.result);
                console.log('✅ Analyse terminée:', sheetsAnalysis);
                
                // Masquer la progression
                masquerProgression();
                
                // Afficher l'interface de sélection
                afficherSelectionFeuille(sheetsAnalysis);
                
            } catch (error) {
                console.error('❌ Erreur lors de l\'analyse des feuilles:', error);
                masquerProgression();
                alert(`Erreur lors de l'analyse du fichier Excel: ${error.message}`);
                reinitialiserEtats();
            }
        };
        
        reader.onerror = function() {
            console.error('❌ Erreur de lecture du fichier');
            masquerProgression();
            alert('Erreur lors de la lecture du fichier.');
            reinitialiserEtats();
        };
        
        // Lire le fichier Excel
        reader.readAsArrayBuffer(window.fichierCourant.file);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'analyse des feuilles Excel:', error);
        masquerProgression();
        alert(`Erreur: ${error.message}`);
        reinitialiserEtats();
    }
}

/**
 * Démarrer le processus enchainé d'import et validation
 */
async function demarrerProcessusEnchaine() {
    try {
        // Afficher la zone de progression
        afficherProgression();
        
        // Allumer la LED verte du bouton Charger juste avant l'import
        const chargerBtn = document.getElementById('charger-fichier');
        if (chargerBtn) {
            chargerBtn.classList.add('completed');
            definirEtatIndicateur('charger-status', 'completed');
        }
        
        // Petite pause pour voir la LED verte
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // ÉTAPE 1: Import des données
        await etapeImportDonnees();
        
        // ÉTAPE 2: Validation et sauvegarde LocalStorage
        await etapeValidation();
        
        // Finalisation
        finaliserProcessus();
        
    } catch (error) {
        console.error('❌ Erreur dans le processus:', error);
        DiooUtils.showNotification(`Erreur: ${error.message}`, 'error');
        reinitialiserEtats();
    }
}

/**
 * Étape 1: Import des données
 */
async function etapeImportDonnees() {
    return new Promise((resolve, reject) => {
        // Mettre à jour l'interface
        mettreAJourProgression(25, 'Import des données', 'Lecture du fichier en cours...');
        definirEtatIndicateur('import-status', 'active');
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                console.log('🔍 DEBUG - Début traitement fichier');
                console.log('🔍 DEBUG - Nom fichier:', window.fichierCourant.name);
                console.log('🔍 DEBUG - Taille données:', e.target.result?.byteLength || e.target.result?.length);
                
                // Traitement du fichier
                let donnees;
                const extension = window.fichierCourant.name.split('.').pop().toLowerCase();
                console.log('🔍 DEBUG - Extension détectée:', extension);
                
                switch (extension) {
                    case 'json':
                        console.log('🔍 DEBUG - Parsing JSON...');
                        donnees = JSON.parse(e.target.result);
                        break;
                    case 'csv':
                        console.log('🔍 DEBUG - Parsing CSV...');
                        donnees = parseCSV(e.target.result);
                        break;
                    case 'xlsx':
                        console.log('🔍 DEBUG - Parsing XLSX avec feuille sélectionnée...');
                        console.log('🔍 DEBUG - Feuille sélectionnée:', window.selectedSheetName);
                        donnees = parseXLSX(e.target.result, window.selectedSheetName);
                        console.log('🔍 DEBUG - Résultat parseXLSX:', donnees);
                        break;
                    default:
                        console.log('🔍 DEBUG - Format non reconnu, traitement par défaut');
                        donnees = { contenu: e.target.result };
                }

                console.log('✅ Import réussi:', donnees);
                console.log('🔍 DEBUG - Structure données:', {
                    hasDonnees: !!donnees?.donnees,
                    isArray: Array.isArray(donnees?.donnees),
                    length: donnees?.donnees?.length || 0,
                    hasHeaders: !!donnees?.headers
                });
                
                // Sauvegarder les données traitées
                window.donneesImportees = donnees;
                
                // Ajouter au dump d'import
                const requeteTemplate = `INSERT INTO dioo_temp_import (fichier, donnees, timestamp) VALUES (?, ?, ?)`;
                const valeursImport = [
                    window.fichierCourant.name,
                    `[${Array.isArray(donnees.donnees) ? donnees.donnees.length : 0} lignes de données]`,
                    new Date().toISOString()
                ];
                const requeteComplete = construireRequeteSQL(requeteTemplate, valeursImport);
                
                ajouterAuImportDump(requeteComplete, donnees, 'Import', {
                    fichier: window.fichierCourant.name,
                    taille: window.fichierCourant.file.size,
                    type: extension,
                    nombreLignes: Array.isArray(donnees.donnees) ? donnees.donnees.length : 'N/A'
                });
                
                // Marquer l'import comme terminé
                mettreAJourProgression(50, 'Import terminé', 'Données importées avec succès');
                definirEtatIndicateur('import-status', 'completed');
                
                setTimeout(() => resolve(donnees), 500);
                
            } catch (error) {
                reject(new Error(`Erreur lors de l'import: ${error.message}`));
            }
        };

        reader.onerror = function() {
            reject(new Error('Erreur de lecture du fichier'));
        };

        // Lire le fichier selon son type
        if (window.fichierCourant.name.endsWith('.xlsx')) {
            reader.readAsArrayBuffer(window.fichierCourant.file);
        } else if (window.fichierCourant.type.startsWith('text/') || 
                   window.fichierCourant.name.endsWith('.json') || 
                   window.fichierCourant.name.endsWith('.csv')) {
            reader.readAsText(window.fichierCourant.file);
        } else {
            reader.readAsArrayBuffer(window.fichierCourant.file);
        }
    });
}

/**
 * Étape 2: Validation et sauvegarde LocalStorage
 */
async function etapeValidation() {
    return new Promise((resolve) => {
        // Mettre à jour l'interface
        mettreAJourProgression(75, 'Validation des données', 'Sauvegarde en cours...');
        definirEtatIndicateur('validation-status', 'active');
        
        // Préparer les données pour localStorage
        const donneesAuStockage = {
            fichier: {
                nom: window.fichierCourant.name,
                taille: window.fichierCourant.size,
                type: window.fichierCourant.type,
                dateImport: new Date().toISOString()
            },
            donnees: window.donneesImportees,
            metadata: {
                nombreLignes: Array.isArray(window.donneesImportees?.donnees) ? window.donneesImportees.donnees.length : 0,
                colonnes: window.donneesImportees?.headers || [],
                version: 'v0.000-stable-extract-viewer-database'
            }
        };
        
        try {
            // Sauvegarder en localStorage
            localStorage.setItem('dioo_donnees', JSON.stringify(donneesAuStockage));
            
            console.log('✅ Données sauvegardées en localStorage');
            
            // Ajouter au dump de validation
            const requeteValidationTemplate = `UPDATE dioo_donnees SET validated = ?, metadata = ? WHERE fichier = ?`;
            const valeursValidation = [
                true,
                donneesAuStockage.metadata,
                donneesAuStockage.fichier.nom
            ];
            const requeteValidationComplete = construireRequeteSQL(requeteValidationTemplate, valeursValidation);
            
            ajouterAuImportDump(requeteValidationComplete, donneesAuStockage, 'Validation', {
                fichier: donneesAuStockage.fichier.nom,
                nombreLignes: donneesAuStockage.metadata.nombreLignes,
                colonnes: donneesAuStockage.metadata.colonnes.length,
                dateValidation: donneesAuStockage.fichier.dateImport
            });
            
            // Marquer la validation comme terminée
            setTimeout(() => {
                definirEtatIndicateur('validation-status', 'completed');
                mettreAJourProgression(100, 'Validation terminée', 'Données sauvegardées avec succès');
                resolve();
            }, 500);
            
        } catch (error) {
            console.error('❌ Erreur localStorage:', error);
            DiooUtils.showNotification('Erreur de sauvegarde localStorage', 'warning');
            resolve(); // On continue même si localStorage échoue
        }
    });
}

/**
 * Finaliser le processus
 */
function finaliserProcessus() {
    setTimeout(() => {
        masquerProgression();
        DiooUtils.showNotification(`Fichier ${window.fichierCourant.name} traité avec succès`, 'success');
        
        // Mettre le bouton dans l'état "loaded" (bleu avec LED verte)
        const chargerBtn = document.getElementById('charger-fichier');
        if (chargerBtn) {
            // Retirer l'état "completed" temporaire et ajouter "loaded"
            chargerBtn.classList.remove('completed');
            chargerBtn.classList.add('loaded');
            definirEtatIndicateur('charger-status', 'completed'); // LED verte
        }
        
        // Initialiser la section Dump avec les données importées
        console.log('🚨 CHARGEMENT - Vérification window.donneesImportees:', !!window.donneesImportees);
        console.log('🚨 CHARGEMENT - window.donneesImportees:', window.donneesImportees);
        
        if (window.donneesImportees) {
            console.log('🚨 CHARGEMENT - Appel initialiserDump avec:', window.donneesImportees);
            initialiserDump(window.donneesImportees);
            
            // Afficher les informations Excel si disponibles
            if (window.donneesImportees.ongletUtilise) {
                DiooUtils.showNotification(`Données chargées depuis l'onglet ${window.donneesImportees.ongletUtilise}: ${window.donneesImportees.feuilleActive}`, 'info');
            }
            if (window.donneesImportees.dateExtrait) {
                DiooUtils.showNotification(`Date extraite: ${window.donneesImportees.dateExtrait}`, 'info');
            }
        }
        
        // Fermer automatiquement les sections dump et overview après l'import
        fermerSectionsApresImport();
    }, 1000);
}

/**
 * Effacer les données de la base
 */
function effacerDonnees() {
    console.log('🗑️ DÉBUT - Fonction effacerDonnees() appelée [REFACTORISÉE]');
    
    // Vérifier l'état avec StorageManager
    const stats = StorageManager.getStats();
    console.log('🔍 AVANT EFFACEMENT:', stats);
    
    if (!stats.donnees.exists && !stats.summary.exists) {
        DiooUtils.showNotification('Aucune donnée à effacer', 'info');
        console.log('ℹ️ Aucune donnée à effacer');
        return;
    }
    
    // Confirmer l'action
    if (!confirm('⚠️ Êtes-vous sûr de vouloir effacer toutes les données de la base ?\n\nCette action est irréversible.')) {
        console.log('❌ Effacement annulé par l\'utilisateur');
        return;
    }
    
    console.log('🗑️ Effacement des données confirmé par l\'utilisateur');
    
    try {
        // Effacement avec StorageManager
        const report = StorageManager.clearAll();
        console.log('📊 Rapport d\'effacement:', report);
        
        if (report.success) {
            // Effacer les dumps en mémoire
            console.log('🗑️ Effacement des dumps en mémoire...');
            if (window.insertionDump) {
                window.insertionDump = [];
                mettreAJourDumpInsertion();
            }
            if (window.importDump) {
                window.importDump = [];
                mettreAJourImportDump();
            }
            
            // Réinitialiser tous les états de l'interface
            console.log('🔄 Réinitialisation des états de l\'interface...');
            reinitialiserEtats();
            
            // Vider le dump si affiché
            if (window.dumpData) {
                console.log('🗑️ Réinitialisation du dump...');
                window.dumpData.donnees = [];
                window.dumpData.headers = [];
                window.dumpData.pageActuelle = 1;
                
                // Mettre à jour l'affichage du dump
                const overviewContent = document.getElementById('overview-content');
                if (overviewContent) {
                    overviewContent.innerHTML = '<p class="dump-empty">Aucune donnée à afficher</p>';
                }
            }
            
            // Vérification finale avec StorageManager
            const statsApres = StorageManager.getStats();
            console.log('🔍 APRÈS EFFACEMENT:', statsApres);
            
            // Notification de succès
            DiooUtils.showNotification('Données effacées avec succès', 'success');
            console.log('✅ SUCCÈS - Toutes les données ont été effacées');
            
        } else {
            throw new Error('Échec de l\'effacement des données');
        }
        
    } catch (error) {
        console.error('❌ ERREUR lors de l\'effacement:', error);
        console.error('❌ Stack trace:', error.stack);
        DiooUtils.showNotification('Erreur lors de l\'effacement des données', 'error');
    }
}

/**
 * Formater la taille du fichier
 * @param {number} bytes - Taille en octets
 * @returns {string} Taille formatée
 */
function formatTailleFichier(bytes) {
    if (bytes === 0) return '0 octets';
    
    const k = 1024;
    const tailles = ['octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tailles[i];
}

/**
 * Parser CSV simple (pour démo)
 * @param {string} csvText - Contenu CSV
 * @returns {Array} Données parsées
 */
function parseCSV(csvText) {
    const lignes = csvText.split('\n');
    const headers = lignes[0].split(',');
    const donnees = [];
    
    for (let i = 1; i < lignes.length; i++) {
        if (lignes[i].trim()) {
            const valeurs = lignes[i].split(',');
            const objet = {};
            headers.forEach((header, index) => {
                objet[header.trim()] = valeurs[index]?.trim() || '';
            });
            donnees.push(objet);
        }
    }
    
    return { headers, donnees, totalLignes: donnees.length };
}

/**
 * Analyser les feuilles Excel disponibles sans parser le contenu
 * @param {ArrayBuffer} arrayBuffer - Contenu du fichier Excel
 * @returns {Object} Liste des feuilles avec analyse des noms
 */
function analyzeExcelSheets(arrayBuffer) {
    try {
        console.log('🔍 DEBUG analyzeExcelSheets - Analyse des feuilles Excel');
        
        // Lire le fichier Excel avec SheetJS
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        console.log('📊 Feuilles Excel disponibles:', workbook.SheetNames);
        
        const sheets = workbook.SheetNames.map((sheetName, index) => {
            const monthInfo = detectMonthFromSheetName(sheetName);
            const worksheet = workbook.Sheets[sheetName];
            
            // Compter approximativement les lignes (sans parser complètement)
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
            const rowCount = range.e.r - range.s.r;
            
            return {
                index: index,
                name: sheetName,
                displayName: sheetName,
                monthInfo: monthInfo,
                estimatedRows: rowCount,
                isRecommended: monthInfo.detected || index === 1 // Recommander si mois détecté ou onglet 2
            };
        });
        
        // Trier par recommandation puis par index
        sheets.sort((a, b) => {
            if (a.isRecommended && !b.isRecommended) return -1;
            if (!a.isRecommended && b.isRecommended) return 1;
            return a.index - b.index;
        });
        
        return {
            sheets: sheets,
            totalSheets: sheets.length,
            workbook: workbook // Garder le workbook pour l'import final
        };
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'analyse des feuilles Excel:', error);
        throw new Error(`Erreur lors de l'analyse du fichier Excel: ${error.message}`);
    }
}

/**
 * Détecter le mois depuis le nom d'une feuille Excel
 * @param {string} sheetName - Nom de la feuille
 * @returns {Object} Informations sur le mois détecté
 */
function detectMonthFromSheetName(sheetName) {
    const monthNames = {
        'janvier': { number: 1, short: 'Jan', season: 'Hiver' },
        'jan': { number: 1, short: 'Jan', season: 'Hiver' },
        'février': { number: 2, short: 'Fév', season: 'Hiver' },
        'fevrier': { number: 2, short: 'Fév', season: 'Hiver' },
        'fév': { number: 2, short: 'Fév', season: 'Hiver' },
        'fev': { number: 2, short: 'Fév', season: 'Hiver' },
        'mars': { number: 3, short: 'Mar', season: 'Printemps' },
        'mar': { number: 3, short: 'Mar', season: 'Printemps' },
        'avril': { number: 4, short: 'Avr', season: 'Printemps' },
        'avr': { number: 4, short: 'Avr', season: 'Printemps' },
        'mai': { number: 5, short: 'Mai', season: 'Printemps' },
        'juin': { number: 6, short: 'Jun', season: 'Été' },
        'jun': { number: 6, short: 'Jun', season: 'Été' },
        'juillet': { number: 7, short: 'Jul', season: 'Été' },
        'jul': { number: 7, short: 'Jul', season: 'Été' },
        'août': { number: 8, short: 'Aoû', season: 'Été' },
        'aout': { number: 8, short: 'Aoû', season: 'Été' },
        'septembre': { number: 9, short: 'Sep', season: 'Automne' },
        'sep': { number: 9, short: 'Sep', season: 'Automne' },
        'octobre': { number: 10, short: 'Oct', season: 'Automne' },
        'oct': { number: 10, short: 'Oct', season: 'Automne' },
        'novembre': { number: 11, short: 'Nov', season: 'Automne' },
        'nov': { number: 11, short: 'Nov', season: 'Automne' },
        'décembre': { number: 12, short: 'Déc', season: 'Hiver' },
        'decembre': { number: 12, short: 'Déc', season: 'Hiver' },
        'déc': { number: 12, short: 'Déc', season: 'Hiver' },
        'dec': { number: 12, short: 'Déc', season: 'Hiver' }
    };
    
    const englishMonths = {
        'january': { number: 1, short: 'Jan', season: 'Hiver' },
        'february': { number: 2, short: 'Feb', season: 'Hiver' },
        'march': { number: 3, short: 'Mar', season: 'Printemps' },
        'april': { number: 4, short: 'Apr', season: 'Printemps' },
        'may': { number: 5, short: 'May', season: 'Printemps' },
        'june': { number: 6, short: 'Jun', season: 'Été' },
        'july': { number: 7, short: 'Jul', season: 'Été' },
        'august': { number: 8, short: 'Aug', season: 'Été' },
        'september': { number: 9, short: 'Sep', season: 'Automne' },
        'october': { number: 10, short: 'Oct', season: 'Automne' },
        'november': { number: 11, short: 'Nov', season: 'Automne' },
        'december': { number: 12, short: 'Dec', season: 'Hiver' }
    };
    
    const allMonths = { ...monthNames, ...englishMonths };
    
    const lowerSheetName = sheetName.toLowerCase();
    
    // Chercher les mois dans le nom de la feuille
    for (const [monthKey, monthInfo] of Object.entries(allMonths)) {
        if (lowerSheetName.includes(monthKey)) {
            // Extraire l'année si possible
            const yearMatch = sheetName.match(/20\d{2}/);
            const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
            
            return {
                detected: true,
                month: monthInfo.number,
                monthName: monthKey.charAt(0).toUpperCase() + monthKey.slice(1),
                monthShort: monthInfo.short,
                season: monthInfo.season,
                year: year,
                fullDate: `${monthInfo.short} ${year}`,
                originalText: sheetName
            };
        }
    }
    
    // Chercher des patterns numériques (MM/YYYY, MM-YYYY, etc.)
    const numericPatterns = [
        /(\d{1,2})[\/\-_\s]+(20\d{2})/,  // MM/YYYY, MM-YYYY, etc.
        /(20\d{2})[\/\-_\s]+(\d{1,2})/,  // YYYY/MM, YYYY-MM, etc.
        /(\d{1,2})[\/\-_\s]+(\d{1,2})[\/\-_\s]+(20\d{2})/ // MM/DD/YYYY
    ];
    
    for (const pattern of numericPatterns) {
        const match = sheetName.match(pattern);
        if (match) {
            let month, year;
            if (pattern.source.includes('20\\d{2}.*\\d{1,2}')) {
                // YYYY/MM format
                year = parseInt(match[1]);
                month = parseInt(match[2]);
            } else {
                // MM/YYYY format
                month = parseInt(match[1]);
                year = parseInt(match[2]);
            }
            
            if (month >= 1 && month <= 12) {
                const monthInfo = Object.values(monthNames).find(m => m.number === month);
                return {
                    detected: true,
                    month: month,
                    monthName: Object.keys(monthNames).find(key => monthNames[key].number === month),
                    monthShort: monthInfo.short,
                    season: monthInfo.season,
                    year: year,
                    fullDate: `${monthInfo.short} ${year}`,
                    originalText: sheetName
                };
            }
        }
    }
    
    return {
        detected: false,
        originalText: sheetName,
        suggestion: 'Aucun mois détecté dans le nom de la feuille'
    };
}

/**
 * Parser Excel (.xlsx) en utilisant SheetJS
 * @param {ArrayBuffer} arrayBuffer - Contenu du fichier Excel
 * @param {string} selectedSheetName - Nom de la feuille sélectionnée
 * @returns {Object} Données parsées
 */
function parseXLSX(arrayBuffer, selectedSheetName = null) {
    try {
        console.log('🔍 DEBUG parseXLSX - Début parsing Excel');
        console.log('🔍 DEBUG parseXLSX - Type arrayBuffer:', typeof arrayBuffer);
        console.log('🔍 DEBUG parseXLSX - Taille arrayBuffer:', arrayBuffer?.byteLength);
        
        // Lire le fichier Excel avec SheetJS
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        console.log('🔍 DEBUG parseXLSX - Workbook créé:', !!workbook);
        
        console.log(`📊 Feuilles Excel disponibles: ${workbook.SheetNames.join(', ')}`);
        
        // Utiliser la feuille sélectionnée ou la logique par défaut
        let targetSheetName;
        let targetSheetIndex;
        
        if (selectedSheetName && workbook.SheetNames.includes(selectedSheetName)) {
            targetSheetName = selectedSheetName;
            targetSheetIndex = workbook.SheetNames.indexOf(selectedSheetName);
            console.log(`📋 Utilisation de la feuille sélectionnée: ${targetSheetName} (index ${targetSheetIndex})`);
        } else {
            // Logique par défaut : prendre l'onglet 2 si disponible, sinon l'onglet 1
            targetSheetIndex = workbook.SheetNames.length > 1 ? 1 : 0;
            targetSheetName = workbook.SheetNames[targetSheetIndex];
            console.log(`📋 Utilisation de la feuille par défaut: ${targetSheetName} (index ${targetSheetIndex})`);
        }
        
        const worksheet = workbook.Sheets[targetSheetName];
        
        // Extraire une date du nom de l'onglet avec RegexPatterns
        const dateExtrait = RegexPatterns.extractExcelDate(targetSheetName);
        if (dateExtrait) {
            console.log(`📅 Date extraite du nom de l'onglet: ${dateExtrait}`);
        }
        
        // Convertir en JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
            return { 
                headers: [], 
                donnees: [], 
                totalLignes: 0, 
                feuilles: workbook.SheetNames,
                feuilleActive: targetSheetName,
                dateExtrait: dateExtrait
            };
        }
        
        // Première ligne = headers
        const headersOriginaux = jsonData[0] || [];
        console.log('📋 Headers originaux:', headersOriginaux);
        
        // Définir les colonnes à conserver avec leurs variations possibles
        const colonnesRequises = {
            'D*': {
                nouveauNom: 'Dx',
                variations: ['D*', 'D', 'Dx', 'Application ID', 'ID']
            },
            'App. Name': {
                nouveauNom: 'App Appli',
                variations: ['App. Name', 'App Name', 'Application Name', 'Appli Name', 'Name']
            },
            'App. Code': {
                nouveauNom: 'App Code',
                variations: ['App. Code', 'App Code', 'Application Code', 'Code', 'App_Code']
            },
            'Operator/Department': {
                nouveauNom: 'Operator/Department',
                variations: ['Operator/Department', 'Operator', 'Department', 'Owner', 'Team']
            },
            'Business criticality': {
                nouveauNom: 'Business criticality',
                variations: ['Business criticality', 'Business Criticality', 'Criticality', 'Critical', 'Priority']
            },
            'Functional monitoring (BSM)': {
                nouveauNom: 'Functional monitoring (BSM)',
                variations: ['Functional monitoring (BSM)', 'Functional monitoring', 'Functional Monitoring', 'Monitoring', 'BSM', 'Monitored']
            },
            'In HCC': {
                nouveauNom: 'In HCC',
                variations: ['In HCC', 'HCC', 'In_HCC', 'HCC Status']
            },
            'HCC eligibility': {
                nouveauNom: 'HCC eligibility',
                variations: ['HCC eligibility', 'HCC Eligibility', 'HCC_eligibility', 'Eligible HCC', 'HCC Eligible', 'HCC eligibility AV (Added Value)', 'HCC eligibility AV']
            }
        };
        
        console.log('🔍 Recherche des colonnes dans les headers:', headersOriginaux);
        
        // Trouver les indices des colonnes requises avec recherche flexible
        const indicesColonnes = {};
        const headersFiltrés = [];
        
        Object.keys(colonnesRequises).forEach(clePrincipale => {
            const config = colonnesRequises[clePrincipale];
            let indexTrouve = -1;
            let nomTrouve = '';
            
            // Essayer chaque variation
            for (const variation of config.variations) {
                const index = headersOriginaux.findIndex(header => 
                    header && header.toString().trim().toLowerCase() === variation.toLowerCase()
                );
                if (index !== -1) {
                    indexTrouve = index;
                    nomTrouve = headersOriginaux[index];
                    break;
                }
            }
            
            if (indexTrouve !== -1) {
                indicesColonnes[clePrincipale] = indexTrouve;
                headersFiltrés.push(config.nouveauNom);
                console.log(`✅ Colonne trouvée: "${nomTrouve}" -> "${config.nouveauNom}" (index ${indexTrouve})`);
            } else {
                console.warn(`⚠️ Colonne non trouvée pour "${clePrincipale}". Variations cherchées:`, config.variations);
                console.warn(`⚠️ Headers disponibles:`, headersOriginaux);
            }
        });
        
        // S'assurer que tous les headers requis sont présents, même si les colonnes sont manquantes
        const tousLesHeaders = Object.keys(colonnesRequises).map(cle => colonnesRequises[cle].nouveauNom);
        const headersFinaux = [...new Set([...headersFiltrés, ...tousLesHeaders])];
        
        console.log('📋 Headers filtrés:', headersFiltrés);
        console.log('📋 Headers finaux (avec colonnes manquantes):', headersFinaux);
        console.log('📋 Indices des colonnes:', indicesColonnes);
        
        const donnees = [];
        
        // Convertir les données en objets avec seulement les colonnes requises
        for (let i = 1; i < jsonData.length; i++) {
            const ligne = jsonData[i];
            if (ligne && ligne.some(cell => cell !== undefined && cell !== '')) {
                const objet = {};
                let hasData = false;
                
                Object.keys(colonnesRequises).forEach(clePrincipale => {
                    const config = colonnesRequises[clePrincipale];
                    const index = indicesColonnes[clePrincipale];
                    
                    if (index !== undefined) {
                        const valeur = ligne[index] || '';
                        objet[config.nouveauNom] = valeur;
                        if (valeur !== '') hasData = true;
                    } else {
                        // Ajouter la colonne avec une valeur par défaut si elle n'existe pas
                        objet[config.nouveauNom] = '';
                        console.log(`⚠️ Colonne "${config.nouveauNom}" ajoutée avec valeur vide (colonne manquante dans Excel)`);
                    }
                });
                
                // N'ajouter la ligne que si elle contient des données
                if (hasData) {
                    donnees.push(objet);
                }
            }
        }
        
        console.log(`📊 Données filtrées: ${donnees.length} lignes avec ${headersFiltrés.length} colonnes`);
        
        const result = {
            headers: headersFinaux,
            donnees,
            totalLignes: donnees.length,
            feuilles: workbook.SheetNames,
            feuilleActive: targetSheetName,
            ongletUtilise: targetSheetIndex + 1,
            dateExtrait: dateExtrait
        };
        
        console.log('🔍 DEBUG parseXLSX - Résultat final:', result);
        console.log('🔍 DEBUG parseXLSX - Nombre de données retournées:', result.donnees?.length);
        
        return result;
        
    } catch (error) {
        console.error('❌ Erreur lors du parsing Excel:', error);
        throw new Error(`Erreur lors de la lecture du fichier Excel: ${error.message}`);
    }
}

/**
 * Fonctions utilitaires pour les états et la progression
 */

/**
 * Réinitialiser tous les états
 */
function reinitialiserEtats() {
    console.log('🧹 DÉBUT - Réinitialisation des états');
    
    // Réinitialiser les indicateurs d'état
    console.log('🔄 Réinitialisation des indicateurs d\'état...');
    definirEtatIndicateur('charger-status', 'inactive');
    definirEtatIndicateur('import-status', 'inactive');
    definirEtatIndicateur('validation-status', 'inactive');
    
    // Réinitialiser le bouton principal
    console.log('🔄 Réinitialisation du bouton charger...');
    const chargerBtn = document.getElementById('charger-fichier');
    if (chargerBtn) {
        chargerBtn.classList.remove('completed', 'active', 'loaded');
        console.log('✅ Bouton charger réinitialisé');
    } else {
        console.log('⚠️ Bouton charger non trouvé');
    }
    
    // Masquer la progression
    console.log('🔄 Masquage de la progression...');
    masquerProgression();
    
    // Masquer la section Overview
    console.log('🔄 Masquage de la section Overview...');
    const overviewSection = document.getElementById('overview-section');
    if (overviewSection) {
        overviewSection.style.display = 'none';
        console.log('✅ Section Overview masquée');
    } else {
        console.log('⚠️ Section Overview non trouvée');
    }
    
    // Masquer la section Dump d'insertion
    console.log('🔄 Masquage de la section Dump d\'insertion...');
    const insertionDumpSection = document.getElementById('insertion-dump-section');
    if (insertionDumpSection) {
        insertionDumpSection.style.display = 'none';
        console.log('✅ Section Dump d\'insertion masquée');
    } else {
        console.log('⚠️ Section Dump d\'insertion non trouvée');
    }
    
    // Masquer la section Dump d'import/validation
    console.log('🔄 Masquage de la section Dump d\'import/validation...');
    const importDumpSection = document.getElementById('import-dump-section');
    if (importDumpSection) {
        importDumpSection.style.display = 'none';
        console.log('✅ Section Dump d\'import/validation masquée');
    } else {
        console.log('⚠️ Section Dump d\'import/validation non trouvée');
    }
    
    // Réinitialiser les données Dump
    console.log('🔄 Réinitialisation des données Dump...');
    window.dumpData = {
        donnees: [],
        headers: [],
        pageActuelle: 1,
        lignesParPage: 10,
        totalPages: 1,
        estOuverte: false
    };
    console.log('✅ Données Dump réinitialisées');
    
    // Réinitialiser les données de résultats
    window.resultsData = {
        donnees: [],
        headers: [],
        pageActuelle: 1,
        lignesParPage: 50,
        totalPages: 1
    };
    
    // Réinitialiser le dump d'insertion
    console.log('🔄 Réinitialisation du dump d\'insertion...');
    window.insertionDump = [];
    mettreAJourDumpInsertion();
    console.log('✅ Dump d\'insertion réinitialisé');
    
    // Réinitialiser le dump d'import/validation
    console.log('🔄 Réinitialisation du dump d\'import/validation...');
    window.importDump = [];
    mettreAJourImportDump();
    console.log('✅ Dump d\'import/validation réinitialisé');
    
    // Réinitialiser le sélecteur
    console.log('🔄 Réinitialisation du sélecteur de fichier...');
    const selecteur = document.getElementById('selecteur-fichier');
    if (selecteur) {
        selecteur.value = '';
        console.log('✅ Sélecteur de fichier réinitialisé');
    } else {
        console.log('⚠️ Sélecteur de fichier non trouvé');
    }
    
    // Nettoyer les données globales
    console.log('🔄 Nettoyage des données globales...');
    delete window.fichierCourant;
    delete window.donneesImportees;
    console.log('✅ Données globales nettoyées');
    
    console.log('✅ SUCCÈS - États réinitialisés complètement');
}

/**
 * Définir l'état d'un indicateur
 * @param {string} indicatorId - ID de l'indicateur
 * @param {string} state - État: 'inactive', 'active', 'completed'
 */
function definirEtatIndicateur(indicatorId, state) {
    const indicator = document.getElementById(indicatorId);
    if (!indicator) return;
    
    // Supprimer tous les états
    indicator.classList.remove('inactive', 'active', 'completed');
    
    // Ajouter le nouvel état
    indicator.classList.add(state);
    
    console.log(`🔄 Indicateur ${indicatorId}: ${state}`);
}

/**
 * Afficher la zone de progression
 */
function afficherProgression() {
    const progressInfo = document.getElementById('progress-info');
    if (progressInfo) {
        progressInfo.style.display = 'block';
    }
}

/**
 * Masquer la zone de progression
 */
function masquerProgression() {
    const progressInfo = document.getElementById('progress-info');
    if (progressInfo) {
        progressInfo.style.display = 'none';
    }
}

/**
 * Mettre à jour la barre de progression
 * @param {number} pourcentage - Pourcentage de progression (0-100)
 * @param {string} titre - Titre de l'étape
 * @param {string} description - Description de l'étape
 */
function mettreAJourProgression(pourcentage, titre, description) {
    const progressFill = document.getElementById('progress-fill');
    const progressTitle = document.getElementById('progress-title');
    const progressDescription = document.getElementById('progress-description');
    
    if (progressFill) {
        progressFill.style.width = `${pourcentage}%`;
    }
    
    if (progressTitle) {
        progressTitle.textContent = titre;
    }
    
    if (progressDescription) {
        progressDescription.textContent = description;
    }
    
    console.log(`📊 Progression: ${pourcentage}% - ${titre}`);
}

/**
 * Gestion de la section Dump
 */

// Variables globales pour la pagination
window.dumpData = {
    donnees: [],
    headers: [],
    pageActuelle: 1,
    lignesParPage: 10,
    totalPages: 1,
    estOuverte: false
};

/**
 * Basculer l'affichage de la section Dump
 */
function toggleOverviewSection() {
    const content = document.getElementById('overview-content');
    const led = document.getElementById('overview-led');
    const arrow = document.getElementById('overview-arrow');
    
    if (!content) return;
    
    window.dumpData.estOuverte = !window.dumpData.estOuverte;
    
    if (window.dumpData.estOuverte) {
        content.classList.remove('collapsed');
        if (led) led.classList.add('active');
        if (arrow) arrow.classList.add('rotated');
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        content.classList.add('collapsed');
        if (led) led.classList.remove('active');
        if (arrow) arrow.classList.remove('rotated');
        content.style.maxHeight = '0';
    }
    
    console.log(`📋 Section Overview: ${window.dumpData.estOuverte ? 'ouverte' : 'fermée'}`);
}

// Fonction de compatibilité pour l'ancienne section Dump
function toggleDumpSection() {
    toggleOverviewSection();
}

/**
 * Basculer l'affichage de la section Dump d'insertion
 */
function toggleInsertionDumpSection() {
    const content = document.getElementById('insertion-dump-content');
    const led = document.getElementById('insertion-dump-led');
    const arrow = document.getElementById('insertion-dump-arrow');
    
    if (!content) return;
    
    const isOpen = content.style.display !== 'none';
    
    if (!isOpen) {
        content.style.display = 'block';
        if (led) led.classList.add('active');
        if (arrow) arrow.classList.add('rotated');
        console.log('📋 Section Dump d\'insertion: ouverte');
    } else {
        content.style.display = 'none';
        if (led) led.classList.remove('active');
        if (arrow) arrow.classList.remove('rotated');
        console.log('📋 Section Dump d\'insertion: fermée');
    }
}

/**
 * Ajouter une requête d'insertion au dump
 */
function ajouterAuDumpInsertion(requeteSQL, donnees, identifiant) {
    console.log('📋 Ajout au dump d\'insertion:', identifiant);
    console.log('📋 Requête SQL complète:', requeteSQL);
    
    // Initialiser le stockage des insertions si nécessaire
    if (!window.insertionDump) {
        window.insertionDump = [];
    }
    
    // Créer l'entrée d'insertion
    const insertion = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        requete: requeteSQL, // Requête déjà complète avec les vraies valeurs
        donnees: donnees,
        identifiant: identifiant
    };
    
    // Ajouter au début de la liste (plus récent en premier)
    window.insertionDump.unshift(insertion);
    
    // Limiter à 50 insertions maximum
    if (window.insertionDump.length > 50) {
        window.insertionDump = window.insertionDump.slice(0, 50);
    }
    
    // Mettre à jour l'affichage
    mettreAJourDumpInsertion();
    
    // Afficher automatiquement la section si c'est la première insertion
    if (window.insertionDump.length === 1) {
        const section = document.getElementById('insertion-dump-section');
        if (section) {
            section.style.display = 'block';
        }
    }
}

/**
 * Mettre à jour l'affichage du dump d'insertion
 */
function mettreAJourDumpInsertion() {
    const countElement = document.getElementById('insertion-count');
    const listElement = document.getElementById('insertion-dump-list');
    const emptyElement = document.getElementById('insertion-dump-empty');
    
    if (!window.insertionDump) {
        window.insertionDump = [];
    }
    
    // Mettre à jour le compteur
    if (countElement) {
        countElement.textContent = window.insertionDump.length;
    }
    
    // Mettre à jour la liste
    if (listElement) {
        if (window.insertionDump.length === 0) {
            // Afficher l'état vide
            if (emptyElement) {
                emptyElement.style.display = 'block';
            }
            listElement.innerHTML = '<div class="dump-empty" id="insertion-dump-empty"><p>Aucune requête d\'insertion</p><p class="dump-empty-hint">Les requêtes d\'insertion apparaîtront ici</p></div>';
        } else {
            // Masquer l'état vide et afficher les insertions
            if (emptyElement) {
                emptyElement.style.display = 'none';
            }
            
            const html = window.insertionDump.map(insertion => `
                <div class="insertion-item">
                    <div class="insertion-header">
                        <span>Insertion #${insertion.identifiant}</span>
                        <span class="insertion-timestamp">${insertion.timestamp}</span>
                    </div>
                    <div class="insertion-query">${insertion.requete}</div>
                    <div class="insertion-data">${JSON.stringify(insertion.donnees, null, 2)}</div>
                </div>
            `).join('');
            
            listElement.innerHTML = html;
        }
    }
}

/**
 * Effacer le dump d'insertion
 */
function effacerDumpInsertion() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les requêtes d\'insertion ?')) {
        console.log('🗑️ Effacement du dump d\'insertion');
        window.insertionDump = [];
        mettreAJourDumpInsertion();
        DiooUtils.showNotification('Dump d\'insertion effacé', 'success');
    }
}

/**
 * Basculer l'affichage de la section Dump d'import/validation
 */
function toggleImportDumpSection() {
    const content = document.getElementById('import-dump-content');
    const led = document.getElementById('import-dump-led');
    const arrow = document.getElementById('import-dump-arrow');
    
    if (!content) return;
    
    const isOpen = content.style.display !== 'none';
    
    if (!isOpen) {
        content.style.display = 'block';
        if (led) led.classList.add('active');
        if (arrow) arrow.classList.add('rotated');
        console.log('📋 Section Dump d\'import/validation: ouverte');
    } else {
        content.style.display = 'none';
        if (led) led.classList.remove('active');
        if (arrow) arrow.classList.remove('rotated');
        console.log('📋 Section Dump d\'import/validation: fermée');
    }
}

/**
 * Formater une valeur pour l'affichage SQL
 */
function formaterValeurSQL(valeur) {
    if (valeur === null || valeur === undefined) {
        return 'NULL';
    }
    if (typeof valeur === 'string') {
        // Utiliser RegexPatterns pour échapper les guillemets
        return `'${RegexPatterns.escapeSQLQuotes(valeur)}'`;
    }
    if (typeof valeur === 'number') {
        return valeur.toString();
    }
    if (typeof valeur === 'boolean') {
        return valeur ? 'TRUE' : 'FALSE';
    }
    if (typeof valeur === 'object') {
        // Pour les objets/arrays, les convertir en JSON et échapper
        return `'${RegexPatterns.escapeSQLQuotes(JSON.stringify(valeur))}'`;
    }
    return `'${RegexPatterns.escapeSQLQuotes(String(valeur))}'`;
}

/**
 * Construire une requête SQL complète avec les vraies valeurs
 */
function construireRequeteSQL(template, valeurs) {
    // Utiliser RegexPatterns pour remplacer les placeholders
    let index = 0;
    return template.replace(RegexPatterns.SQL_PLACEHOLDER, () => {
        if (index < valeurs.length) {
            return formaterValeurSQL(valeurs[index++]);
        }
        return '?';
    });
}

/**
 * Ajouter une requête d'import/validation au dump
 */
function ajouterAuImportDump(requeteSQL, donnees, etape, details = {}) {
    console.log('📋 Ajout au dump d\'import/validation:', etape);
    console.log('📋 Requête SQL complète:', requeteSQL);
    
    // Initialiser le stockage des requêtes d'import si nécessaire
    if (!window.importDump) {
        window.importDump = [];
    }
    
    // Créer l'entrée d'import
    const importEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        etape: etape,
        requete: requeteSQL, // Requête déjà complète avec les vraies valeurs
        donnees: donnees,
        details: details
    };
    
    // Ajouter au début de la liste (plus récent en premier)
    window.importDump.unshift(importEntry);
    
    // Limiter à 100 requêtes maximum
    if (window.importDump.length > 100) {
        window.importDump = window.importDump.slice(0, 100);
    }
    
    // Mettre à jour l'affichage
    mettreAJourImportDump();
    
    // Afficher automatiquement la section si c'est la première requête
    if (window.importDump.length === 1) {
        const section = document.getElementById('import-dump-section');
        if (section) {
            section.style.display = 'block';
        }
    }
}

/**
 * Mettre à jour l'affichage du dump d'import/validation
 */
function mettreAJourImportDump() {
    const countElement = document.getElementById('import-dump-count');
    const listElement = document.getElementById('import-dump-list');
    const emptyElement = document.getElementById('import-dump-empty');
    
    if (!window.importDump) {
        window.importDump = [];
    }
    
    // Mettre à jour le compteur
    if (countElement) {
        countElement.textContent = window.importDump.length;
    }
    
    // Mettre à jour la liste
    if (listElement) {
        if (window.importDump.length === 0) {
            // Afficher l'état vide
            if (emptyElement) {
                emptyElement.style.display = 'block';
            }
            listElement.innerHTML = '<div class="dump-empty" id="import-dump-empty"><p>Aucune requête d\'import/validation</p><p class="dump-empty-hint">Les requêtes d\'import et validation apparaîtront ici</p></div>';
        } else {
            // Masquer l'état vide et afficher les requêtes
            if (emptyElement) {
                emptyElement.style.display = 'none';
            }
            
            const html = window.importDump.map(entry => {
                const etapeColor = entry.etape === 'Import' ? '#4ecdc4' : '#ffa726';
                const donneesStr = Array.isArray(entry.donnees) ? 
                    `${entry.donnees.length} lignes` : 
                    JSON.stringify(entry.donnees, null, 2);
                
                return `
                    <div class="insertion-item">
                        <div class="insertion-header">
                            <span style="color: ${etapeColor};">${entry.etape}</span>
                            <span class="insertion-timestamp">${entry.timestamp}</span>
                        </div>
                        <div class="insertion-query">${entry.requete}</div>
                        <div class="insertion-data">
                            <strong>Données:</strong> ${donneesStr}
                            ${entry.details && Object.keys(entry.details).length > 0 ? 
                                `<br><strong>Détails:</strong> ${JSON.stringify(entry.details, null, 2)}` : 
                                ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            listElement.innerHTML = html;
        }
    }
}

/**
 * Effacer le dump d'import/validation
 */
function effacerImportDump() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les requêtes d\'import/validation ?')) {
        console.log('🗑️ Effacement du dump d\'import/validation');
        window.importDump = [];
        mettreAJourImportDump();
        DiooUtils.showNotification('Dump d\'import/validation effacé', 'success');
    }
}

/**
 * Initialiser la section Dump avec les données
 * @param {Object} donnees - Données importées
 */
function initialiserDump(donnees) {
    console.log('🚨 CHARGEMENT - Début initialiserDump');
    console.log('🚨 CHARGEMENT - Données reçues:', donnees);
    console.log('🚨 CHARGEMENT - Type des données:', typeof donnees);
    console.log('🚨 CHARGEMENT - Structure:', {
        hasDonnees: !!donnees?.donnees,
        isArray: Array.isArray(donnees?.donnees),
        length: donnees?.donnees?.length || 0,
        hasHeaders: !!donnees?.headers
    });
    
    if (!donnees || !donnees.donnees || !Array.isArray(donnees.donnees)) {
        console.error('❌ CHARGEMENT - Aucune donnée valide pour le dump');
        console.error('❌ CHARGEMENT - Données reçues:', donnees);
        return;
    }
    
    // Stocker les données
    window.dumpData.donnees = donnees.donnees;
    window.dumpData.headers = donnees.headers || [];
    window.dumpData.pageActuelle = 1;
    window.dumpData.totalPages = Math.ceil(donnees.donnees.length / window.dumpData.lignesParPage);
    
    // Afficher la section
    const overviewSection = document.getElementById('overview-section');
    if (overviewSection) {
        overviewSection.style.display = 'block';
    }
    
    // Générer le tableau
    genererTableauDump();
    
    // Mettre à jour les contrôles
    mettreAJourControlesNavigation();
    
    console.log(`📊 Dump initialisé: ${donnees.donnees.length} lignes, ${window.dumpData.totalPages} pages`);
}

/**
 * Générer le tableau HTML avec les données de la page actuelle
 */
function genererTableauDump() {
    console.log('🚨 CHARGEMENT - Début genererTableauDump');
    console.log('🚨 CHARGEMENT - window.dumpData:', window.dumpData);
    console.log('🚨 CHARGEMENT - Nombre de données:', window.dumpData?.donnees?.length || 0);
    console.log('🚨 CHARGEMENT - Headers:', window.dumpData?.headers || []);
    
    const thead = document.getElementById('dump-thead');
    const tbody = document.getElementById('dump-tbody');
    const tableContainer = document.querySelector('.dump-table-container');
    const emptyState = document.getElementById('dump-empty');
    
    console.log('🚨 CHARGEMENT - Éléments DOM:', {
        thead: !!thead,
        tbody: !!tbody,
        tableContainer: !!tableContainer,
        emptyState: !!emptyState
    });
    
    if (!thead || !tbody) {
        console.error('❌ CHARGEMENT - Éléments DOM manquants');
        return;
    }
    
    // Vérifier s'il y a des données
    if (window.dumpData.donnees.length === 0) {
        if (tableContainer) tableContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    
    // Générer les en-têtes
    thead.innerHTML = '';
    const headerRow = document.createElement('tr');
    
    if (window.dumpData.headers.length > 0) {
        window.dumpData.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header || 'Colonne';
            th.title = header;
            headerRow.appendChild(th);
        });
    } else {
        // Générer des en-têtes par défaut si pas d'headers
        const premiereLigne = window.dumpData.donnees[0];
        if (premiereLigne && typeof premiereLigne === 'object') {
            Object.keys(premiereLigne).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                th.title = key;
                headerRow.appendChild(th);
            });
        }
    }
    
    thead.appendChild(headerRow);
    
    // Générer les lignes de données pour la page actuelle
    tbody.innerHTML = '';
    const debut = (window.dumpData.pageActuelle - 1) * window.dumpData.lignesParPage;
    const fin = Math.min(debut + window.dumpData.lignesParPage, window.dumpData.donnees.length);
    
    for (let i = debut; i < fin; i++) {
        const donnee = window.dumpData.donnees[i];
        const row = document.createElement('tr');
        
        if (typeof donnee === 'object' && donnee !== null) {
            // Utiliser les headers ou les clés de l'objet
            const cles = window.dumpData.headers.length > 0 ? window.dumpData.headers : Object.keys(donnee);
            
            cles.forEach(cle => {
                const td = document.createElement('td');
                const valeur = donnee[cle];
                td.textContent = valeur !== null && valeur !== undefined ? String(valeur) : '';
                td.title = td.textContent;
                row.appendChild(td);
            });
        } else {
            // Donnée simple
            const td = document.createElement('td');
            td.textContent = String(donnee);
            td.title = td.textContent;
            row.appendChild(td);
        }
        
        tbody.appendChild(row);
    }
    
    // Mettre à jour les informations
    const lignesAffichees = document.getElementById('lignes-affichees');
    const totalLignes = document.getElementById('total-lignes');
    
    if (lignesAffichees) {
        lignesAffichees.textContent = fin - debut;
    }
    if (totalLignes) {
        totalLignes.textContent = window.dumpData.donnees.length;
    }
}

/**
 * Mettre à jour les contrôles de navigation
 */
function mettreAJourControlesNavigation() {
    const currentPageInput = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const firstBtn = document.getElementById('first-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const lastBtn = document.getElementById('last-page');
    
    if (currentPageInput) {
        currentPageInput.value = window.dumpData.pageActuelle;
        currentPageInput.max = window.dumpData.totalPages;
    }
    
    if (totalPagesSpan) {
        totalPagesSpan.textContent = window.dumpData.totalPages;
    }
    
    // État des boutons
    const estPremierePage = window.dumpData.pageActuelle === 1;
    const estDernierePage = window.dumpData.pageActuelle === window.dumpData.totalPages;
    
    if (firstBtn) firstBtn.disabled = estPremierePage;
    if (prevBtn) prevBtn.disabled = estPremierePage;
    if (nextBtn) nextBtn.disabled = estDernierePage;
    if (lastBtn) lastBtn.disabled = estDernierePage;
}

/**
 * Navigation - Aller à la première page
 */
function allerPremierePage() {
    if (window.dumpData.pageActuelle > 1) {
        window.dumpData.pageActuelle = 1;
        genererTableauDump();
        mettreAJourControlesNavigation();
    }
}

/**
 * Navigation - Page précédente
 */
function pagePrecedente() {
    if (window.dumpData.pageActuelle > 1) {
        window.dumpData.pageActuelle--;
        genererTableauDump();
        mettreAJourControlesNavigation();
    }
}

/**
 * Navigation - Page suivante
 */
function pageSuivante() {
    if (window.dumpData.pageActuelle < window.dumpData.totalPages) {
        window.dumpData.pageActuelle++;
        genererTableauDump();
        mettreAJourControlesNavigation();
    }
}

/**
 * Navigation - Aller à la dernière page
 */
function allerDernierePage() {
    if (window.dumpData.pageActuelle < window.dumpData.totalPages) {
        window.dumpData.pageActuelle = window.dumpData.totalPages;
        genererTableauDump();
        mettreAJourControlesNavigation();
    }
}

/**
 * Navigation - Aller à une page spécifique
 * @param {number} page - Numéro de page
 */
function allerALaPage(page) {
    const pageNum = parseInt(page);
    if (pageNum >= 1 && pageNum <= window.dumpData.totalPages) {
        window.dumpData.pageActuelle = pageNum;
        genererTableauDump();
        mettreAJourControlesNavigation();
    } else {
        // Remettre la valeur correcte si invalide
        const currentPageInput = document.getElementById('current-page');
        if (currentPageInput) {
            currentPageInput.value = window.dumpData.pageActuelle;
        }
    }
}

/*===============================================
  FONCTIONS MONITORING
===============================================*/

/**
 * Wrapper synchrone pour calculerConsolidation (appelé depuis HTML)
 */
function calculerConsolidation() {
    calculerConsolidationAsync().catch(error => {
        console.error('❌ Erreur calculerConsolidation:', error);
        DiooUtils.showNotification(`Erreur: ${error.message}`, 'error');
    });
}

/**
 * Calculer la consolidation des données (version async)
 */
async function calculerConsolidationAsync() {
    console.log('🧮 Début du calcul de consolidation [SQL.js NATIF]');
    
    // Vérifier que DatabaseManager est prêt
    if (!window.DatabaseManager.isInitialized()) {
        console.error('❌ DatabaseManager non initialisé');
        DiooUtils.showNotification('Base de données non initialisée. Veuillez recharger la page.', 'error');
        return;
    }
    
    try {
        // Marquer le début du calcul
        definirEtatIndicateur('calcul-status', 'active');
        
        console.log('🚀 Calculs de consolidation avec SQL.js natif');
        
        // 🎯 RÉVOLUTION: Calculs directs avec SQL natif !
        // Afficher la section des requêtes SQL
        afficherSectionRequetesSQL();
        
        // Effectuer les calculs avec des vraies requêtes SQL
        const resultats = await effectuerCalculsConsolidationSQL();
        
        // Sauvegarder dans Dioo_Summary
        sauvegarderDansHistorique(resultats);
        
        // Afficher les résultats
        afficherResultatsConsolidation(resultats);
        
        // Marquer comme terminé
        definirEtatIndicateur('calcul-status', 'completed');
        
        DiooUtils.showNotification('Calculs de consolidation terminés avec succès', 'success');
        
    } catch (error) {
        console.error('❌ Erreur dans le calcul de consolidation:', error);
        DiooUtils.showNotification(`Erreur: ${error.message}`, 'error');
        definirEtatIndicateur('calcul-status', 'inactive');
    }
}

/**
 * Effectuer les calculs de consolidation selon les critères
 */
function effectuerCalculsConsolidation(donnees) {
    // Extraire les données selon la structure localStorage
    let lignes, headers, dateExtrait;
    
    if (donnees.donnees && donnees.donnees.donnees) {
        // Structure localStorage: { donnees: { donnees: [...], headers: [...] } }
        lignes = donnees.donnees.donnees;
        headers = donnees.donnees.headers || [];
        dateExtrait = donnees.donnees.dateExtrait || new Date().toISOString().split('T')[0];
    } else if (Array.isArray(donnees.donnees)) {
        // Structure directe: { donnees: [...], headers: [...] }
        lignes = donnees.donnees;
        headers = donnees.headers || [];
        dateExtrait = donnees.dateExtrait || new Date().toISOString().split('T')[0];
    } else {
        throw new Error('Structure de données non reconnue');
    }
    
    console.log(`📊 Analyse de ${lignes.length} lignes avec headers:`, headers);
    
    // Trouver les indices des colonnes nécessaires
    const indices = trouverIndicesColonnes(headers);
    console.log('🔍 Indices des colonnes:', indices);
    
            // Filtrer les lignes critiques avec Dx égal à 'DP' exactement
    const lignesCritiques = lignes.filter(ligne => {
        const dValue = ligne[indices.d] || '';
        const businessCriticality = ligne[indices.businessCriticality] || '';
        
        return dValue.toString().toUpperCase() === 'DP' && 
               businessCriticality.toString().toUpperCase() === 'CRITICAL';
    });
    
            console.log(`✅ ${lignesCritiques.length} applications critiques trouvées (Dx = DP exactement et Business criticality = Critical)`);
    
    // Effectuer les calculs
    const totalCritiques = lignesCritiques.length;
    
    // BSM - Monitored in BSM
    const monitoredBSM = lignesCritiques.filter(ligne => {
        const functionalMonitoring = ligne[indices.functionalMonitoring] || '';
        return functionalMonitoring.toString().toUpperCase() === 'YES';
    }).length;
    
    // BSM - Still To Be Monitored
    const stillToMonitor = lignesCritiques.filter(ligne => {
        const inHCC = ligne[indices.inHCC] || '';
        return inHCC.toString().toUpperCase() === 'NO';
    }).length;
    
    // HCC - Confirmed Not Required in BSM
    const notRequiredBSM = lignesCritiques.filter(ligne => {
        const functionalMonitoring = ligne[indices.functionalMonitoring] || '';
        const hccEligibility = ligne[indices.hccEligibility] || '';
        return functionalMonitoring.toString().toUpperCase() === 'NO' && 
               hccEligibility.toString().toUpperCase() === 'NO';
    }).length;
    
    // HCC - Monitored in HCC
    const monitoredHCC = lignesCritiques.filter(ligne => {
        const inHCC = ligne[indices.inHCC] || '';
        return inHCC.toString().toUpperCase() === 'YES';
    }).length;
    
    // HCC - Confirmed not required in HCC
    const notRequiredHCC = lignesCritiques.filter(ligne => {
        const inHCC = ligne[indices.inHCC] || '';
        const hccEligibility = ligne[indices.hccEligibility] || '';
        return inHCC.toString().toUpperCase() === 'NO' && 
               hccEligibility.toString().toUpperCase() === 'NO';
    }).length;
    
    // Calculer les pourcentages
    const pctNotRequiredBSM = totalCritiques > 0 ? Math.round((notRequiredBSM / totalCritiques) * 100) : 0;
    const pctMonitoredHCC = totalCritiques > 0 ? Math.round((monitoredHCC / totalCritiques) * 100) : 0;
    const pctNotRequiredHCC = totalCritiques > 0 ? Math.round((notRequiredHCC / totalCritiques) * 100) : 0;
    
    // Calculer les données par section DP*
    const sectionsDP = calculerSectionsDP(lignesCritiques, indices, lignes);
    
    const resultats = {
        date: dateExtrait,
        totalCritiques,
        monitoredBSM,
        stillToMonitor,
        notRequiredBSM,
        pctNotRequiredBSM,
        monitoredHCC,
        pctMonitoredHCC,
        notRequiredHCC,
        pctNotRequiredHCC,
        sectionsDP,
        timestamp: new Date().toISOString()
    };
    
    console.log('📈 Résultats des calculs:', resultats);
    return resultats;
}

/**
 * Calculer les données par section DP*
 */
function calculerSectionsDP(lignesCritiques, indices, toutesLesLignes) {
    const sections = ['DPA', 'DPB', 'DPC', 'DPP', 'DPS'];
    const resultats = {};
    
    // Critical Business Services = nombre total de lignes dans la table
    const criticalBusinessServices = toutesLesLignes.length;
    
                    // Still to be onboarded = lignes DP* + Critical + Functional monitoring (BSM) = YES
    // (utilise LIKE 'DP%' selon le fichier SQL)
    const stillToOnboard = toutesLesLignes.filter(ligne => {
        const dValue = ligne[indices.d] || '';
        const businessCriticality = ligne[indices.businessCriticality] || '';
        const functionalMonitoring = ligne[indices.functionalMonitoring] || '';
        
        return dValue.toString().toUpperCase().startsWith('DP') && 
               businessCriticality.toString().toUpperCase() === 'CRITICAL' &&
               functionalMonitoring.toString().toUpperCase() === 'YES';
    }).length;
    
    resultats['dp'] = {
        criticalBusinessServices: criticalBusinessServices,
        stillToOnboard: stillToOnboard,
        percentage: criticalBusinessServices > 0 ? Math.round((stillToOnboard / criticalBusinessServices) * 100) : 0
    };
    
    console.log(`📊 DP: ${criticalBusinessServices} lignes totales (Critical Business Services), ${stillToOnboard} Still to onboard DP* (${resultats['dp'].percentage}%)`);
    
    // Calcul pour les autres sections DPx
    sections.forEach(prefixe => {
        // Filtrer les lignes qui commencent par ce préfixe ET sont critiques
        const lignesSection = toutesLesLignes.filter(ligne => {
            const dValue = ligne[indices.d] || '';
            const businessCriticality = ligne[indices.businessCriticality] || '';
            return dValue.toString().toUpperCase().startsWith(prefixe) &&
                   businessCriticality.toString().toUpperCase() === 'CRITICAL';
        });
        
        // Calculer les monitored pour cette section
        const monitored = lignesSection.filter(ligne => {
            const functionalMonitoring = ligne[indices.functionalMonitoring] || '';
            return functionalMonitoring.toString().toUpperCase() === 'YES';
        }).length;
        
        resultats[prefixe.toLowerCase()] = {
            total: lignesSection.length,
            monitored: monitored
        };
        
        console.log(`📊 ${prefixe}: ${lignesSection.length} total, ${monitored} monitored`);
    });
    
    return resultats;
}

/**
 * Trouver les indices des colonnes dans les headers
 */
function trouverIndicesColonnes(headers) {
    const mappings = {
        'd': ['Dx', 'D*', 'D', 'Application ID'],
        'appAppli': ['App Appli', 'App. Name', 'App Name', 'Application Name'],
        'appCode': ['App Code', 'App. Code', 'App Code', 'Application Code'],
        'businessCriticality': ['Business criticality', 'Business Criticality', 'Criticality'],
        'functionalMonitoring': ['Functional monitoring (BSM)', 'Functional monitoring', 'Functional Monitoring'],
        'inHCC': ['In HCC', 'HCC'],
        'hccEligibility': ['HCC eligibility', 'HCC Eligibility', 'HCC eligibility AV (Added Value)', 'HCC eligibility AV']
    };
    
    const indices = {};
    
    Object.keys(mappings).forEach(key => {
        const possibleNames = mappings[key];
        let index = -1;
        
        for (const name of possibleNames) {
            index = headers.findIndex(header => 
                header && header.toString().trim().toLowerCase() === name.toLowerCase()
            );
            if (index !== -1) break;
        }
        
        indices[key] = index;
        if (index === -1) {
            console.warn(`⚠️ Colonne "${key}" non trouvée. Noms recherchés:`, possibleNames);
        }
    });
    
    return indices;
}

/**
 * Sauvegarder les résultats dans l'historique
 */
function sauvegarderDansHistorique(resultats) {
    try {
        const historique = JSON.parse(localStorage.getItem('dioo_summary') || '[]');
        
        // Vérifier si une entrée existe déjà pour cette date
        const indexExistant = historique.findIndex(entry => entry.date === resultats.date);
        
        if (indexExistant !== -1) {
            // Mettre à jour l'entrée existante
            historique[indexExistant] = resultats;
            console.log('📝 Mise à jour de l\'entrée existante pour la date:', resultats.date);
        } else {
            // Ajouter une nouvelle entrée
            historique.push(resultats);
            console.log('📝 Nouvelle entrée ajoutée à l\'historique pour la date:', resultats.date);
        }
        
        // Garder seulement les 10 dernières entrées
        const historiqueLimit = historique.slice(-10);
        
        localStorage.setItem('dioo_summary', JSON.stringify(historiqueLimit));
        console.log('💾 Historique sauvegardé dans localStorage');
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde dans l\'historique:', error);
    }
}

/**
 * Afficher les résultats de consolidation
 */
function afficherResultatsConsolidation(resultats) {
    // Afficher les sections DP*
    const sections = ['dp', 'dpa', 'dpb', 'dpc', 'dpp', 'dps'];
    
    sections.forEach(section => {
        const sectionElement = document.getElementById(`${section}-section`);
        if (sectionElement) {
            sectionElement.style.display = 'block';
        }
    });
    
    // Mettre à jour les valeurs pour chaque section DP*
    mettreAJourSectionDP(resultats);
    
    // Créer les graphiques pour chaque section
    creerGraphiquesDP(resultats);
    
    console.log('✨ Résultats affichés avec succès');
}

/**
 * Mettre à jour les sections DP* avec les données
 */
function mettreAJourSectionDP(resultats) {
    // Mise à jour spéciale pour la section DP
    const dpData = resultats.sectionsDP?.dp;
    if (dpData) {
        const criticalElement = document.getElementById('critical-business-services');
        const alreadyElement = document.getElementById('already-onboarded');
        const onboardElement = document.getElementById('still-to-onboard');
        
        if (criticalElement) criticalElement.textContent = dpData.criticalBusinessServices;
        if (alreadyElement) alreadyElement.textContent = dpData.alreadyOnboarded;
        if (onboardElement) onboardElement.textContent = dpData.stillToOnboard;
    }
    
    // Mise à jour pour les autres sections DPx
    const sections = ['dpa', 'dpb', 'dpc', 'dpp', 'dps'];
    
    sections.forEach(section => {
        const sectionData = resultats.sectionsDP?.[section] || { total: 0, monitored: 0 };
        
        // Mettre à jour les valeurs
        const totalElement = document.getElementById(`${section}-total`);
        const monitoredElement = document.getElementById(`${section}-monitored`);
        
        if (totalElement) totalElement.textContent = sectionData.total;
        if (monitoredElement) monitoredElement.textContent = sectionData.monitored;
    });
}

/**
 * Créer les graphiques pour les sections DP*
 */
function creerGraphiquesDP(resultats) {
    // Créer le graphique spécial pour DP
    const dpData = resultats.sectionsDP?.dp;
    if (dpData) {
        creerGraphiqueSection('dp', dpData);
    }
    
    // Créer les graphiques pour les autres sections DPx
    const sections = ['dpa', 'dpb', 'dpc', 'dpp', 'dps'];
    
    sections.forEach(section => {
        const sectionData = resultats.sectionsDP?.[section] || { total: 0, monitored: 0 };
        creerGraphiqueSection(section, sectionData);
    });
    
    // Créer les nouveaux graphiques BSM et HCC
    creerGraphiquesBSMHCC(resultats);
}

/**
 * Créer un graphique pour une section DP*
 */
function creerGraphiqueSection(section, data) {
    const ctx = document.getElementById(`${section}-chart`);
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    // Détruire le graphique existant s'il y en a un
    if (window[`${section}Chart`]) {
        window[`${section}Chart`].destroy();
    }
    
    if (section === 'dp') {
        // Graphique spécial pour DP : camembert à 2 couches
        const totalCritiques = data.criticalBusinessServices;
        const alreadyOnboarded = data.alreadyOnboarded;
        const stillToOnboard = data.stillToOnboard;
        
        // Calculer les pourcentages pour la couche interne
        const alreadyPct = totalCritiques > 0 ? Math.round((alreadyOnboarded / totalCritiques) * 100) : 0;
        const stillPct = totalCritiques > 0 ? Math.round((stillToOnboard / totalCritiques) * 100) : 0;
        
        // Enregistrer le plugin datalabels pour ce graphique
        if (typeof ChartDataLabels !== 'undefined') {
            Chart.register(ChartDataLabels);
            console.log('Plugin ChartDataLabels enregistré');
        } else {
            console.warn('Plugin ChartDataLabels non disponible');
        }
        
        window[`${section}Chart`] = new Chart(chartCtx, {
            type: 'doughnut',
            data: {
                labels: [
                    `Critical Business Services: ${totalCritiques}`,
                    `Already onboarded: ${alreadyOnboarded} (${alreadyPct}%)`,
                    `Still to be onboarded: ${stillToOnboard} (${stillPct}%)`
                ],
                datasets: [
                    // Couronne externe : Critical Business Services (bleu)
                    {
                        data: [totalCritiques],
                        backgroundColor: ['rgba(63, 182, 255, 0.8)'],  // Bleu pour Critical
                        borderColor: ['rgba(63, 182, 255, 1)'],
                        borderWidth: 3,
                        cutout: '60%'  // Couronne externe de 60% à 100%
                    },
                    // Couronne interne : Already + Still (vert/orange)
                    {
                        data: [alreadyOnboarded, stillToOnboard],
                        backgroundColor: [
                            'rgba(46, 204, 113, 0.8)',   // Vert pour Already onboarded
                            'rgba(255, 193, 7, 0.8)'     // Orange pour Still to onboard
                        ],
                        borderColor: [
                            'rgba(46, 204, 113, 1)',
                            'rgba(255, 193, 7, 1)'
                        ],
                        borderWidth: 3,
                        cutout: '25%'  // Couronne interne de 25% à 55%
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'start',
                        labels: {
                            generateLabels: function(chart) {
                                const labels = [];
                                
                                // Légende pour la couronne externe (Critical - sans valeur)
                                labels.push({
                                    text: 'Critical Business Services',
                                    fillStyle: 'rgba(63, 182, 255, 0.8)',
                                    strokeStyle: 'rgba(63, 182, 255, 1)',
                                    lineWidth: 3,
                                    fontColor: 'rgba(63, 182, 255, 1)'
                                });
                                
                                // Légendes pour la couronne interne (sans valeurs)
                                labels.push({
                                    text: 'Already onboarded',
                                    fillStyle: 'rgba(46, 204, 113, 0.8)',
                                    strokeStyle: 'rgba(46, 204, 113, 1)',
                                    lineWidth: 3,
                                    fontColor: 'rgba(46, 204, 113, 1)'
                                });
                                
                                labels.push({
                                    text: 'Still to be onboarded',
                                    fillStyle: 'rgba(255, 193, 7, 0.8)',
                                    strokeStyle: 'rgba(255, 193, 7, 1)',
                                    lineWidth: 3,
                                    fontColor: 'rgba(255, 193, 7, 1)'
                                });
                                
                                return labels;
                            },
                            font: {
                                size: 10
                            },
                            padding: 6
                        }
                    },
                    datalabels: typeof ChartDataLabels !== 'undefined' ? {
                        display: true,
                        formatter: function(value, context) {
                            const datasetIndex = context.datasetIndex;
                            const dataIndex = context.dataIndex;
                            
                            if (datasetIndex === 0) {
                                // Couronne externe : Critical Business Services
                                return totalCritiques;
                            } else {
                                // Couronne interne : Already + Still avec pourcentages
                                if (dataIndex === 0) {
                                    return `${alreadyOnboarded}\n(${alreadyPct}%)`;
                                } else {
                                    return `${stillToOnboard}\n(${stillPct}%)`;
                                }
                            }
                        },
                        color: 'white',
                        font: {
                            size: function(context) {
                                const datasetIndex = context.datasetIndex;
                                return datasetIndex === 0 ? 16 : 13;  // Police plus grosse
                            },
                            weight: 'bold'
                        },
                        textAlign: 'center',
                        anchor: 'center',
                        align: 'center'
                    } : false
                },
                // Plugin personnalisé pour dessiner les labels si datalabels n'est pas disponible
                plugins: typeof ChartDataLabels === 'undefined' ? [{
                    id: 'customLabels',
                    afterDatasetsDraw: function(chart) {
                        const ctx = chart.ctx;
                        ctx.save();
                        
                        chart.data.datasets.forEach((dataset, datasetIndex) => {
                            const meta = chart.getDatasetMeta(datasetIndex);
                            
                            meta.data.forEach((element, index) => {
                                const centerX = element.x;
                                const centerY = element.y;
                                
                                let text;
                                let fontSize;
                                
                                if (datasetIndex === 0) {
                                    // Couronne externe : Critical Business Services
                                    text = totalCritiques.toString();
                                    fontSize = 16;
                                } else {
                                    // Couronne interne : Already + Still avec pourcentages
                                    if (index === 0) {
                                        text = `${alreadyOnboarded}\n(${alreadyPct}%)`;
                                    } else {
                                        text = `${stillToOnboard}\n(${stillPct}%)`;
                                    }
                                    fontSize = 13;
                                }
                                
                                ctx.fillStyle = 'white';
                                ctx.font = `bold ${fontSize}px Arial`;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                
                                // Gérer les retours à la ligne
                                const lines = text.split('\n');
                                const lineHeight = fontSize * 1.2;
                                const totalHeight = lines.length * lineHeight;
                                
                                lines.forEach((line, lineIndex) => {
                                    const y = centerY - (totalHeight / 2) + (lineIndex * lineHeight) + (lineHeight / 2);
                                    ctx.fillText(line, centerX, y);
                                });
                            });
                        });
                        
                        ctx.restore();
                    }
                }] : [],
                tooltip: {
                        callbacks: {
                            label: function(context) {
                                const datasetIndex = context.datasetIndex;
                                const dataIndex = context.dataIndex;
                                
                                if (datasetIndex === 0) {
                                    // Couronne externe : Critical Business Services
                                    return [`Critical Business Services:`, `${totalCritiques} applications`];
                                } else {
                                    // Couronne interne : Already + Still
                                    if (dataIndex === 0) {
                                        return [`Already onboarded:`, `${alreadyOnboarded} applications`, `(${alreadyPct}% of Critical)`];
                                    } else {
                                        return [`Still to be onboarded:`, `${stillToOnboard} applications`, `(${stillPct}% of Critical)`];
                                    }
                                }
                            }
                        },
                        displayColors: true,
                        bodySpacing: 4,
                        titleSpacing: 4,
                        cornerRadius: 6,
                        bodyFont: {
                            size: 12
                        },
                        titleFont: {
                            size: 13,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    } else {
        // Graphique standard pour les autres sections DPx
        window[`${section}Chart`] = new Chart(chartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Monitored', 'Not Monitored'],
                datasets: [{
                    data: [data.monitored, data.total - data.monitored],
                    backgroundColor: [
                        'rgba(63, 182, 255, 0.8)',
                        'rgba(255, 193, 7, 0.8)'
                    ],
                    borderColor: [
                        'rgba(63, 182, 255, 1)',
                        'rgba(255, 193, 7, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            // Police de chaque légende de la couleur de son segment
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const dataset = data.datasets[0];
                                        const backgroundColor = dataset.backgroundColor[i];
                                        const borderColor = dataset.borderColor[i];
                                        
                                        // Calculer le pourcentage
                                        const total = dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = Math.round((dataset.data[i] / total) * 100);
                                        
                                        return {
                                            text: `${label}: ${dataset.data[i]} (${percentage}%)`,
                                            fillStyle: backgroundColor,
                                            strokeStyle: borderColor,
                                            lineWidth: 2,
                                            hidden: false,
                                            index: i,
                                            fontColor: borderColor  // Couleur du texte = couleur du segment
                                        };
                                    });
                                }
                                return [];
                            },
                            font: {
                                size: 11
                            },
                            padding: 8
                        }
                    }
                }
            }
        });
    }
}

/**
 * Créer les graphiques BSM et HCC
 */
function creerGraphiquesBSMHCC(resultats) {
    const totalCritiques = resultats.totalCritiques || 0;
    const monitoredBSM = resultats.monitoredBSM || 0;
    const notRequiredBSM = resultats.notRequiredBSM || 0;
    const monitoredHCC = resultats.monitoredHCC || 0;
    const notRequiredHCC = resultats.notRequiredHCC || 0;
    
    // Calcul des valeurs pour "Critical eligible onboarded"
    const criticalEligibleBSM = totalCritiques - monitoredBSM - notRequiredBSM;
    const criticalEligibleHCC = totalCritiques - monitoredHCC - notRequiredHCC;
    
    // Ligne 1: BSM
    creerPetitCamembert('monitored-bsm-chart', 
        ['Monitored', 'Not Monitored'], 
        [monitoredBSM, notRequiredBSM],
        ['rgba(63, 182, 255, 0.8)', 'rgba(255, 193, 7, 0.8)']);
    
    creerPetitCamembert('not-required-bsm-chart', 
        ['Not Required', 'Required'], 
        [notRequiredBSM, totalCritiques - notRequiredBSM],
        ['rgba(63, 182, 255, 0.8)', 'rgba(255, 193, 7, 0.8)']);
    
    creerPetitCamembert('critical-eligible-bsm-chart', 
        ['Eligible', 'Others'], 
        [Math.max(0, criticalEligibleBSM), totalCritiques - Math.max(0, criticalEligibleBSM)],
        ['rgba(63, 182, 255, 0.8)', 'rgba(255, 193, 7, 0.8)']);
    
    // Ligne 2: HCC
    creerPetitCamembert('onboarded-hcc-chart', 
        ['Onboarded', 'Not Onboarded'], 
        [monitoredHCC, notRequiredHCC],
        ['rgba(63, 182, 255, 0.8)', 'rgba(255, 193, 7, 0.8)']);
    
    creerPetitCamembert('not-required-hcc-chart', 
        ['Not Required', 'Required'], 
        [notRequiredHCC, totalCritiques - notRequiredHCC],
        ['rgba(63, 182, 255, 0.8)', 'rgba(255, 193, 7, 0.8)']);
    
    creerPetitCamembert('critical-eligible-hcc-chart', 
        ['Eligible', 'Others'], 
        [Math.max(0, criticalEligibleHCC), totalCritiques - Math.max(0, criticalEligibleHCC)],
        ['rgba(63, 182, 255, 0.8)', 'rgba(255, 193, 7, 0.8)']);
}

/**
 * Créer un petit camembert avec style identique au camembert principal
 */
function creerPetitCamembert(canvasId, labels, data, colors) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    // Détruire le graphique existant s'il y en a un
    if (window[`${canvasId}Chart`]) {
        window[`${canvasId}Chart`].destroy();
    }
    
    window[`${canvasId}Chart`] = new Chart(chartCtx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.8', '1')),
                borderWidth: 2  // Même épaisseur que le camembert principal
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        // Police de chaque légende de la couleur de son segment
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const backgroundColor = dataset.backgroundColor[i];
                                    const borderColor = dataset.borderColor[i];
                                    
                                    return {
                                        text: `${label}: ${dataset.data[i]}`,
                                        fillStyle: backgroundColor,
                                        strokeStyle: borderColor,
                                        lineWidth: 2,
                                        hidden: false,
                                        index: i,
                                        fontColor: borderColor  // Couleur du texte = couleur du segment
                                    };
                                });
                            }
                            return [];
                        },
                        font: {
                            size: 9  // Taille réduite pour les petits camemberts
                        },
                        padding: 4
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.parsed / total) * 100);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Anciennes fonctions BSM/HCC supprimées - remplacées par les sections DP*

/**
 * Basculer l'affichage d'une section
 */
function toggleSection(contentId) {
    const content = document.getElementById(contentId);
    const ledId = contentId.replace('-content', '-led');
    const arrowId = contentId.replace('-content', '-arrow');
    const led = document.getElementById(ledId);
    const arrow = document.getElementById(arrowId);
    
    if (content && content.classList.contains('expanded')) {
        // Fermer la section
        content.classList.remove('expanded');
        if (led) led.classList.remove('active');
        if (arrow) arrow.classList.remove('rotated');
    } else {
        // Ouvrir la section
        if (content) content.classList.add('expanded');
        if (led) led.classList.add('active');
        if (arrow) arrow.classList.add('rotated');
    }
}

/**
 * Afficher les détails d'une entrée d'historique
 */
function afficherDetailEntry(date) {
    try {
        const historique = JSON.parse(localStorage.getItem('dioo_summary') || '[]');
        const entry = historique.find(e => e.date === date);
        
        if (entry) {
            const details = `
Date: ${entry.date}
Total d'applications critiques: ${entry.totalCritiques}
Monitored in BSM: ${entry.monitoredBSM}
Still To Be Monitored: ${entry.stillToMonitor}
Confirmed Not Required in BSM: ${entry.notRequiredBSM} (${entry.pctNotRequiredBSM}%)
Monitored in HCC: ${entry.monitoredHCC} (${entry.pctMonitoredHCC}%)
Confirmed Not Required in HCC: ${entry.notRequiredHCC} (${entry.pctNotRequiredHCC}%)
            `;
            
            DiooUtils.showNotification(details, 'info');
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'affichage des détails:', error);
        DiooUtils.showNotification('Erreur lors de l\'affichage des détails', 'error');
    }
}

/**
 * Afficher les 10 premières lignes de la table dans la console
 */
function afficher10PremiersLignes() {
    const donnees = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
    
    let lignes, headers;
    
    if (donnees.donnees && donnees.donnees.donnees && Array.isArray(donnees.donnees.donnees)) {
        lignes = donnees.donnees.donnees;
        headers = donnees.donnees.headers || [];
    } else if (donnees.donnees && Array.isArray(donnees.donnees)) {
        lignes = donnees.donnees;
        headers = donnees.headers || [];
    } else {
        console.log('❌ Aucune donnée trouvée dans la base');
        return null;
    }
    
    const premiersLignes = lignes.slice(0, 10);
    
    console.log('📊 Headers:', headers);
    console.log('📋 10 premières lignes:', premiersLignes);
    console.log(`📈 Total: ${lignes.length} lignes dans la base`);
    
    return {
        headers: headers,
        lignes: premiersLignes,
        total: lignes.length
    };
}

/*===============================================
  FONCTIONS DATABASE
===============================================*/

/**
 * Toggle des sections de la page DataBase
 */
function toggleDatabaseSection(contentId) {
    const content = document.getElementById(contentId);
    const sectionId = contentId.replace('-content', '');
    const led = document.getElementById(`${sectionId}-led`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    if (content && led && arrow) {
        const isExpanded = content.style.display === 'block';
        
        if (isExpanded) {
            content.style.display = 'none';
            led.classList.remove('active');
            arrow.textContent = '▼';
        } else {
            content.style.display = 'block';
            led.classList.add('active');
            arrow.textContent = '▲';
        }
    }
}

/**
 * Wrapper synchrone pour executeQuery (appelé depuis HTML)
 */
function executeQuery(queryType) {
    executeQueryAsync(queryType).catch(error => {
        console.error('❌ Erreur executeQuery:', error);
        afficherErreur(`Erreur: ${error.message}`);
    });
}

/**
 * Exécuter une requête prédéfinie (version async)
 */
async function executeQueryAsync(queryType) {
    console.log(`🔍 DataBase - Exécution de la requête prédéfinie: ${queryType} [SQL.js NATIF]`);
    
    // Vérifier que DatabaseManager est prêt
    if (!window.DatabaseManager.isInitialized()) {
        console.error('❌ DataBase - DatabaseManager non initialisé');
        afficherErreur('Base de données non initialisée. Veuillez recharger la page.');
        return;
    }
    
    // Récupération des données pour compatibilité avec certains cas
    let lignes = [], headers = [];
    try {
        const donnees = await window.DatabaseManager.getDonnees();
        const extracted = extractDataStructure(donnees);
        lignes = extracted.lignes;
        headers = extracted.headers;
        console.log(`📊 Données récupérées: ${lignes.length} lignes, ${headers.length} colonnes`);
    } catch (error) {
        console.log('⚠️ Pas de données existantes, création structure vide');
        lignes = [];
        headers = ['Dx', 'App Appli', 'App Code', 'Operator/Department', 'Business criticality', 'Functional monitoring (BSM)', 'In HCC', 'HCC eligibility'];
    }
    
    // Gestion spéciale pour l'ajout de ligne aléatoire sans données
    if (!lignes || lignes.length === 0) {
        if (queryType === 'ajouter_ligne_aleatoire') {
            console.log('🎲 Création structure de base pour ajout ligne aléatoire');
            headers = ['Dx', 'App Appli', 'App Code', 'Operator/Department', 'Business criticality', 'Functional monitoring (BSM)', 'In HCC', 'HCC eligibility'];
            lignes = [];
        } else {
            console.error('❌ DataBase - Aucune donnée disponible');
            afficherErreur('Aucune donnée disponible. Veuillez d\'abord charger un fichier.');
            return;
        }
    }
    
    console.log(`✅ DataBase - Données prêtes: ${lignes.length} lignes, ${headers.length} colonnes`);
    
    let resultats = [];
    let titre = '';
    
    try {
        console.log(`🔄 DataBase - Traitement de la requête: ${queryType}`);
        
        switch (queryType) {
            case 'info_tables':
                console.log('📊 DataBase - Informations sur les tables [SQL.js NATIF]');
                titre = 'Informations sur les tables de la base';
                
                try {
                    // 🚀 Vraie requête SQLite pour lister les tables
                    const sqlInfoTables = "SELECT name FROM sqlite_master WHERE type='table'";
                    const tables = await window.DatabaseManager.executeQuery(sqlInfoTables);
                    
                    // Obtenir les statistiques de chaque table
                    resultats = [];
                    for (const table of tables) {
                        const tableName = table.name;
                        const countResult = await window.DatabaseManager.executeQuery(`SELECT COUNT(*) as count FROM ${tableName}`);
                        const count = countResult[0].count;
                        
                        // Obtenir les colonnes
                        const columnsResult = await window.DatabaseManager.executeQuery(`PRAGMA table_info(${tableName})`);
                        const columnCount = columnsResult.length;
                        
                        resultats.push({
                            'Nom de la table': tableName,
                            'Nombre de lignes': count,
                            'Nombre de colonnes': columnCount,
                            'Stockage': 'SQLite (SQL.js)',
                            'Type': tableName === 'dioo_donnees' ? 'Données principales' : 
                                   tableName === 'dioo_summary' ? 'Consolidation' : 'Métadonnées'
                        });
                    }
                    
                    const rawDataInfoTables = {
                        requete_sql: sqlInfoTables,
                        engine: 'SQL.js natif',
                        tables_trouvees: tables,
                        resultats: resultats,
                        timestamp: new Date().toISOString()
                    };
                    afficherDetailsRequete(sqlInfoTables, 'Informations tables SQL.js', rawDataInfoTables);
                    
                    console.log(`✅ DataBase - Informations collectées pour ${resultats.length} tables SQLite`);
                } catch (error) {
                    console.error('❌ Erreur SQL info_tables:', error);
                    afficherErreur(`Erreur SQL: ${error.message}`);
                    return;
                }
                break;
                
            case 'total_lignes':
                console.log('📊 DataBase - Calcul du total des lignes [SQL.js NATIF]');
                titre = 'Total des lignes';
                
                try {
                    // 🚀 Exécution directe SQL.js - Plus de parsing custom !
                    const sqlTotalLignes = 'SELECT COUNT(*) as count FROM dioo_donnees';
                    resultats = await window.DatabaseManager.executeQuery(sqlTotalLignes);
                    
                    // Adapter le format pour compatibilité affichage
                    resultats = [{ 'Nombre de lignes': resultats[0].count }];
                    
                    const rawDataTotalLignes = {
                        requete_sql: sqlTotalLignes,
                        engine: 'SQL.js natif',
                        resultats: resultats,
                        timestamp: new Date().toISOString()
                    };
                    afficherDetailsRequete(sqlTotalLignes, 'Total des lignes SQL.js', rawDataTotalLignes);
                    
                    console.log(`✅ DataBase - Total calculé via SQL.js: ${resultats[0]['Nombre de lignes']} lignes`);
                } catch (error) {
                    console.error('❌ Erreur SQL total_lignes:', error);
                    afficherErreur(`Erreur SQL: ${error.message}`);
                    return;
                }
                break;
                
            case 'premieres_lignes':
                console.log('📊 DataBase - Affichage des premières lignes [SQL.js NATIF]');
                titre = 'Premières lignes de la table';
                
                try {
                    // 🚀 Exécution directe SQL.js - Plus de parsing custom !
                    const sqlPremieres = 'SELECT * FROM dioo_donnees LIMIT 10';
                    resultats = await window.DatabaseManager.executeQuery(sqlPremieres);
                    
                    console.log(`✅ DataBase - ${resultats.length} premières lignes récupérées via SQL.js`);
                    
                    // Afficher les détails avec le résultat brut
                    const rawData = {
                        requete_sql: sqlPremieres,
                        engine: 'SQL.js natif',
                        resultats: resultats,
                        nombre_resultats: resultats.length,
                        timestamp: new Date().toISOString()
                    };
                    afficherDetailsRequete(sqlPremieres, 'Premières lignes SQL.js', rawData);
                } catch (error) {
                    console.error('❌ Erreur SQL premieres_lignes:', error);
                    afficherErreur(`Erreur SQL: ${error.message}`);
                    return;
                }
                break;
                
            case 'criticites':
                console.log('📊 DataBase - Analyse des criticités');
                titre = 'Répartition des criticités';
                
                // Afficher les détails de la requête SQL équivalente
                const sqlCriticites = 'SELECT "Business criticality", COUNT(*) AS count FROM dioo_donnees GROUP BY "Business criticality" ORDER BY count DESC;';
                const rawDataCriticites = {
                    lignes_brutes: lignes.slice(0, 10),
                    headers: headers,
                    nombre_lignes_total: lignes.length
                };
                // Afficher d'abord sans les résultats traités
                afficherDetailsRequete(sqlCriticites, 'Répartition des criticités', rawDataCriticites);
                const indices = trouverIndicesColonnes(headers);
                console.log('🔍 DataBase - Indices trouvés:', indices);
                
                if (indices.businessCriticality === -1) {
                    console.error('❌ DataBase - Colonne Business Criticality non trouvée');
                    throw new Error('Colonne Business Criticality non trouvée dans les données');
                }
                
                const criticites = {};
                
                lignes.forEach((ligne, index) => {
                    const criticite = ligne[indices.businessCriticality] || 'Non défini';
                    criticites[criticite] = (criticites[criticite] || 0) + 1;
                    if (index < 5) { // Log des 5 premières lignes pour debug
                        console.log(`🔍 DataBase - Ligne ${index}: criticité = "${criticite}"`);
                    }
                });
                
                console.log('📊 DataBase - Criticités trouvées:', criticites);
                
                resultats = Object.entries(criticites).map(([criticite, count]) => ({
                    'Business Criticality': criticite,
                    'Nombre': count
                }));
                
                // Mettre à jour les données brutes avec les résultats traités
                rawDataCriticites.resultats_traites = resultats;
                rawDataCriticites.criticites_trouvees = criticites;
                break;
                
            case 'prefixes_dp':
                titre = 'Préfixes DP*';
                
                // Afficher les détails de la requête SQL équivalente
                const sqlPrefixes = 'SELECT SUBSTR("Dx", 1, 3) AS prefixe, COUNT(*) AS count FROM dioo_donnees WHERE "Dx" LIKE "DP%" GROUP BY prefixe ORDER BY count DESC;';
                const indicesDP = trouverIndicesColonnes(headers);
                const lignesDPPrefixes = lignes.filter(ligne => {
                    const dValue = ligne[indicesDP.d] || '';
                    return dValue.toString().toUpperCase().startsWith('DP');
                });
                const rawDataPrefixes = {
                    lignes_brutes: lignesDPPrefixes.slice(0, 10),
                    headers: headers,
                    nombre_lignes_total: lignes.length,
                    nombre_lignes_dp: lignesDPPrefixes.length
                };
                afficherDetailsRequete(sqlPrefixes, 'Préfixes DP*', rawDataPrefixes);
                const prefixes = {};
                
                lignes.forEach(ligne => {
                    const dValue = ligne[indicesDP.d] || '';
                    if (dValue.toString().toUpperCase().startsWith('DP')) {
                        const prefix = dValue.toString().substring(0, 3).toUpperCase();
                        prefixes[prefix] = (prefixes[prefix] || 0) + 1;
                    }
                });
                
                resultats = Object.entries(prefixes).map(([prefix, count]) => ({
                    'Préfixe': prefix,
                    'Nombre': count
                }));
                
                // Mettre à jour les données brutes avec les résultats traités
                rawDataPrefixes.resultats_traites = resultats;
                rawDataPrefixes.prefixes_trouves = prefixes;
                break;
                
            case 'vue_ensemble':
                titre = 'Vue d\'ensemble des données';
                
                // Afficher les détails de la requête SQL équivalente
                const sqlVueEnsemble = 'SELECT COUNT(*) AS total_lignes, COUNT(DISTINCT "Business criticality") AS criticites_uniques, COUNT(DISTINCT "Dx") AS identifiants_uniques FROM dioo_donnees;';
                const rawDataVueEnsemble = {
                    lignes_brutes: lignes.slice(0, 10),
                    headers: headers,
                    nombre_lignes_total: lignes.length
                };
                afficherDetailsRequete(sqlVueEnsemble, 'Vue d\'ensemble', rawDataVueEnsemble);
                
                const indicesVue = trouverIndicesColonnes(headers);
                const totalLignes = lignes.length;
                const lignesDPVue = lignes.filter(ligne => {
                    const dValue = ligne[indicesVue.d] || '';
                    return dValue.toString().toUpperCase().startsWith('DP');
                }).length;
                const lignesCritical = lignes.filter(ligne => {
                    const criticite = ligne[indicesVue.businessCriticality] || '';
                    return criticite.toString().toUpperCase() === 'CRITICAL';
                }).length;
                const lignesDPCritical = lignes.filter(ligne => {
                    const dValue = ligne[indicesVue.d] || '';
                    const criticite = ligne[indicesVue.businessCriticality] || '';
                    return dValue.toString().toUpperCase().startsWith('DP') && 
                           criticite.toString().toUpperCase() === 'CRITICAL';
                }).length;
                
                resultats = [{
                    'Métrique': 'Total des lignes',
                    'Valeur': totalLignes
                }, {
                    'Métrique': 'Lignes DP*',
                    'Valeur': lignesDPVue
                }, {
                    'Métrique': 'Lignes Critical',
                    'Valeur': lignesCritical
                }, {
                    'Métrique': 'Lignes DP* + Critical',
                    'Valeur': lignesDPCritical
                }];
                
                // Mettre à jour les données brutes avec les résultats traités
                rawDataVueEnsemble.resultats_traites = resultats;
                rawDataVueEnsemble.statistiques = {
                    totalLignes,
                    lignesDP: lignesDPVue,
                    lignesCritical,
                    lignesDPCritical
                };
                break;
                
            case 'ajouter_ligne_aleatoire':
                console.log('🎲 DÉBUT - Cas ajouter_ligne_aleatoire atteint');
                console.log('📊 DataBase - Ajout d\'une ligne aléatoire');
                console.log(`🔍 Headers disponibles: ${headers.length} colonnes`);
                console.log(`🔍 Lignes actuelles: ${lignes.length}`);
                
                titre = 'Ligne aléatoire ajoutée';
                
                try {
                    // Vérifier que nous avons des headers
                    if (!headers || headers.length === 0) {
                        console.error('❌ Aucun header disponible pour générer une ligne');
                        throw new Error('Aucune structure de données disponible');
                    }
                    
                    // Afficher les détails de la requête SQL équivalente
                    const sqlAjouterLigne = `INSERT INTO dioo_donnees (${headers.map(h => `"${h}"`).join(', ')}) VALUES (${headers.map(() => '?').join(', ')});`;
                    console.log(`🔧 Requête SQL générée: ${sqlAjouterLigne}`);
                    
                    // Générer une ligne aléatoire
                    console.log('🎲 Génération de la ligne aléatoire...');
                    const nouvelleLigne = genererLigneAleatoire(headers);
                    console.log('🎲 Ligne générée:', nouvelleLigne);
                    console.log(`🎲 Longueur ligne générée: ${nouvelleLigne.length}`);
                    
                    // Vérifier que la ligne a la bonne longueur
                    if (nouvelleLigne.length !== headers.length) {
                        console.error(`❌ Erreur: ligne générée (${nouvelleLigne.length}) ne correspond pas aux headers (${headers.length})`);
                        throw new Error('Erreur de génération de ligne');
                    }
                    
                    // Ajouter la ligne aux données
                    console.log('💾 Ajout de la ligne aux données...');
                    lignes.push(nouvelleLigne);
                    console.log(`✅ Ligne ajoutée. Nouveau total: ${lignes.length}`);
                    
                    // Sauvegarder dans SQLite
                    console.log('💾 Sauvegarde dans SQLite...');
                    await sauvegarderDonneesModifiees(lignes, headers);
                    console.log('✅ Sauvegarde terminée');
                    
                    // Ajouter au dump d'insertion
                    console.log('📋 Ajout au dump d\'insertion...');
                    const sqlTemplate = `INSERT INTO dioo_donnees (${headers.map(h => `"${h}"`).join(', ')}) VALUES (${headers.map(() => '?').join(', ')})`;
                    const sqlComplete = construireRequeteSQL(sqlTemplate, nouvelleLigne);
                    ajouterAuDumpInsertion(sqlComplete, nouvelleLigne, nouvelleLigne[0]);
                    
                    // Afficher les détails de la requête
                    console.log('🔍 Affichage des détails de la requête...');
                    afficherDetailsRequete(sqlComplete, 'Ajout ligne aléatoire', {
                        ligne_ajoutee: nouvelleLigne,
                        nouveau_total: lignes.length,
                        identifiant: nouvelleLigne[0],
                        headers: headers
                    });
                    
                    // Préparer les résultats
                    resultats = [{
                        'Action': 'Ligne ajoutée',
                        'Identifiant': nouvelleLigne[0],
                        'Total lignes': lignes.length,
                        'Colonnes': headers.length
                    }];
                    
                    console.log(`✅ SUCCÈS - Ligne aléatoire ajoutée. Nouveau total: ${lignes.length}`);
                    
                } catch (error) {
                    console.error('❌ ERREUR lors de l\'ajout de ligne aléatoire:', error);
                    console.error('❌ Stack trace:', error.stack);
                    
                    afficherErreur(`Erreur lors de l'ajout de ligne: ${error.message}`);
                    return;
                }
                break;
                
            default:
                afficherErreur(`Type de requête non reconnu: ${queryType}`);
                return;
        }
        
        console.log(`📋 DataBase - Affichage des résultats: ${resultats.length} éléments`);
        console.log('🔍 DataBase - Résultats à afficher:', resultats);
        afficherResultats(resultats, titre);
        
    } catch (error) {
        console.error('❌ DataBase - Erreur lors de l\'exécution de la requête:', error);
        console.error('❌ DataBase - Stack trace:', error.stack);
        afficherErreur(`Erreur: ${error.message}`);
    }
}

/**
 * Wrapper synchrone pour executeCustomQuery (appelé depuis HTML)
 */
function executeCustomQuery() {
    executeCustomQueryAsync().catch(error => {
        console.error('❌ Erreur executeCustomQuery:', error);
        afficherErreur(`Erreur: ${error.message}`);
    });
}

/**
 * Exécuter une requête personnalisée (version async)
 */
async function executeCustomQueryAsync() {
    console.log('🔍 DataBase - Début exécution requête personnalisée [SQL.js NATIF]');
    
    const queryInput = document.getElementById('custom-query-input');
    if (!queryInput) {
        console.error('❌ DataBase - Élément custom-query-input non trouvé dans le DOM');
        afficherErreur('Erreur: Élément de saisie non trouvé.');
        return;
    }
    
    const query = queryInput.value.trim();
    console.log(`🔍 DataBase - Requête SQL.js: "${query}" (${query.length} caractères)`);
    
    if (!query) {
        console.log('⚠️ DataBase - Requête vide');
        afficherErreur('Veuillez entrer une requête SQL.');
        return;
    }
    
    // Vérifier que DatabaseManager est prêt
    if (!window.DatabaseManager.isInitialized()) {
        console.error('❌ DataBase - DatabaseManager non initialisé');
        afficherErreur('Base de données non initialisée. Veuillez recharger la page.');
        return;
    }
    
    console.log(`✅ DataBase - Exécution directe avec SQL.js (plus de parsing custom)`);
    
    try {
        const timestamp = new Date().toISOString();
        console.log(`⏰ DataBase - Exécution SQL.js à ${timestamp}`);
        
        // 🚀 RÉVOLUTION: Exécution directe avec SQL.js - Plus de parsing custom !
        console.log(`🚨 CUSTOM_QUERY - Exécution DIRECTE via SQL.js natif`);
        const resultats = await window.DatabaseManager.executeQuery(query);
        console.log(`✅ CUSTOM_QUERY - SQL.js natif: ${resultats.length} résultats`);
        
        // Structure simplifiée - Plus d'analyse custom obsolète
        const rawDataCustomQuery = {
            requete_sql: query,
            engine: 'SQL.js natif (SQLite WebAssembly)',
            resultats: resultats,
            nombre_resultats: resultats.length,
            timestamp: timestamp,
            database_info: await window.DatabaseManager.getInfo()
        };
        
        // Affichage des détails et résultats
        afficherDetailsRequete(query, 'SQL.js natif', rawDataCustomQuery);
        
        const titreAvecTimestamp = `SQL.js natif (${new Date().toLocaleTimeString()})`;
        afficherResultats(resultats, titreAvecTimestamp);
        
    } catch (error) {
        console.error('❌ DataBase - Erreur SQL.js natif:', error);
        
        // 🎯 Erreurs SQL précises de SQLite (plus d'erreurs custom vagues)
        let errorMessage = error.message;
        if (errorMessage.includes('syntax error')) {
            errorMessage = '❌ Erreur de syntaxe SQL. Vérifiez votre requête.';
        } else if (errorMessage.includes('no such table')) {
            errorMessage = '❌ Table inexistante. Tables disponibles: dioo_donnees, dioo_summary, dioo_metadata';
        } else if (errorMessage.includes('no such column')) {
            errorMessage = '❌ Colonne inexistante. Utilisez PRAGMA table_info(dioo_donnees) pour voir les colonnes.';
        } else if (errorMessage.includes('ambiguous column name')) {
            errorMessage = '❌ Nom de colonne ambigu. Spécifiez la table (ex: dioo_donnees.Dx)';
        }
        
        console.error('❌ DataBase - Erreur SQL détaillée:', errorMessage);
        afficherErreur(`Erreur SQL: ${errorMessage}`);
    }
}

// ✅ FONCTION SUPPRIMÉE: executerFiltreSimple() - Remplacée par SQL.js natif

// ✅ FONCTION SUPPRIMÉE: filtrerLignesAvecWhere() - Remplacée par SQL.js natif

/**
 * Trouver l'index d'une colonne par son nom
 */
function trouverIndexColonne(headers, nomColonne) {
    return headers.findIndex(header => 
        header.toLowerCase().includes(nomColonne.toLowerCase())
    );
}

/**
 * Afficher les résultats dans la section résultats
 */
function afficherResultats(resultats, titre) {
    // Identifier la source de l'appel
    const stack = new Error().stack;
    const sourceInfo = stack.split('\n')[2] || 'Source inconnue';
    
    console.log(`📋 DataBase - afficherResultats appelée avec titre: "${titre}"`);
    console.log(`📋 DataBase - Source de l'appel: ${sourceInfo}`);
    console.log(`📋 DataBase - Nombre de résultats: ${resultats ? resultats.length : 'undefined'}`);
    console.log(`🔍 DEBUG - Type des résultats:`, typeof resultats, Array.isArray(resultats));
    console.log(`🔍 DEBUG - Résultats reçus:`, resultats);
    
    // Analyser chaque résultat pour les caractères spéciaux
    if (resultats && resultats.length > 0) {
        resultats.forEach((ligne, index) => {
            console.log(`🔍 DEBUG - Ligne ${index}:`, ligne);
            Object.entries(ligne).forEach(([colonne, valeur]) => {
                const valeurStr = String(valeur);
                const hasSpecialChars = /[^\x20-\x7E]/.test(valeurStr);
                const isEmpty = valeurStr === '' || valeurStr === 'undefined' || valeurStr === 'null';
                
                if (isEmpty) {
                    console.log(`⚠️ DEBUG - ${colonne}: VIDE (${valeurStr})`);
                } else if (hasSpecialChars) {
                    console.log(`🚨 DEBUG - ${colonne}: CARACTÈRES SPÉCIAUX détectés: "${valeurStr}"`);
                } else {
                    console.log(`✅ DEBUG - ${colonne}: OK "${valeurStr}"`);
                }
            });
        });
    }
    
    const resultsDiv = document.getElementById('query-results');
    const resultsSection = document.getElementById('results-section');
    const resultsLed = document.getElementById('results-led');
    const resultsContent = document.getElementById('results-content');
    
    console.log(`🔍 DataBase - Éléments DOM trouvés:`, {
        resultsDiv: !!resultsDiv,
        resultsSection: !!resultsSection,
        resultsLed: !!resultsLed,
        resultsContent: !!resultsContent
    });
    
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
    console.log('🔍 DataBase - Premier résultat:', resultats[0]);
    
    // Activer la section résultats
    resultsContent.style.display = 'block';
    resultsLed.classList.add('active');
    document.getElementById('results-arrow').classList.add('rotated');
    
    // Vérifier si on a besoin de pagination (plus de 50 résultats)
    if (resultats.length > 50) {
        console.log('📄 DataBase - Activation de la pagination pour', resultats.length, 'résultats');
        const colonnes = Object.keys(resultats[0]);
        initialiserPaginationResultats(resultats, colonnes);
    } else {
        // Affichage normal sans pagination
        console.log('📄 DataBase - Affichage direct sans pagination');
        
        // Masquer les contrôles de pagination
        const controlsDiv = document.getElementById('results-controls');
        if (controlsDiv) {
            controlsDiv.style.display = 'none';
        }
        
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
            resultats.forEach((ligne, ligneIndex) => {
                console.log(`🔍 DEBUG - Génération ligne ${ligneIndex}:`, ligne);
                html += '<tr>';
                colonnes.forEach(colonne => {
                    const valeur = ligne[colonne] || '';
                    const valeurStr = String(valeur);
                    const hasSpecialChars = /[^\x20-\x7E]/.test(valeurStr);
                    
                    console.log(`🔍 DEBUG - Cellule [${ligneIndex}][${colonne}]: "${valeurStr}" (${valeurStr.length} car.)`);
                    
                    if (hasSpecialChars) {
                        console.log(`🚨 DEBUG - Caractères spéciaux détectés dans [${ligneIndex}][${colonne}]`);
                        // Nettoyer les caractères spéciaux pour l'affichage
                        const valeurNettoyee = valeurStr.replace(/[^\x20-\x7E]/g, '?');
                        html += `<td title="Caractères spéciaux détectés">${valeurNettoyee}</td>`;
                    } else {
                        html += `<td>${valeurStr}</td>`;
                    }
                });
                html += '</tr>';
            });
            html += '</tbody></table>';
            
            console.log(`✅ DEBUG - HTML généré (${html.length} caractères):`, html.substring(0, 500) + '...');
        }
        
        resultsDiv.innerHTML = html;
    }
}

/**
 * Afficher un message d'erreur
 */
function afficherErreur(message) {
    const resultsDiv = document.getElementById('query-results');
    const resultsContent = document.getElementById('results-content');
    const resultsLed = document.getElementById('results-led');
    
    // Activer la section résultats
    resultsContent.style.display = 'block';
    resultsLed.classList.add('active');
    document.getElementById('results-arrow').classList.add('rotated');
    
    resultsDiv.innerHTML = `<div class="error-message">${message}</div>`;
}

/**
 * Afficher les détails d'une requête dans la section pliable
 */
function afficherDetailsRequete(sqlQuery, type = 'Requête prédéfinie', rawResult = null) {
    console.log(`🔍 Affichage des détails de requête: "${sqlQuery}" (${type})`);
    
    const querySent = document.getElementById('query-sent');
    const queryTimestamp = document.getElementById('query-timestamp');
    const queryType = document.getElementById('query-type');
    
    if (querySent && queryTimestamp && queryType) {
        querySent.textContent = sqlQuery;
        queryTimestamp.textContent = new Date().toLocaleString();
        queryType.textContent = type;
        
        // Toujours afficher le contenu brut du résultat
        const queryInfo = document.getElementById('query-info');
        if (queryInfo) {
            // Chercher ou créer la section de résultat brut
            let rawResultDiv = document.getElementById('raw-result-section');
            if (!rawResultDiv) {
                rawResultDiv = document.createElement('div');
                rawResultDiv.id = 'raw-result-section';
                rawResultDiv.style.marginTop = '15px';
                rawResultDiv.style.padding = '10px';
                rawResultDiv.style.backgroundColor = 'rgba(163,177,199,0.05)';
                rawResultDiv.style.borderRadius = '5px';
                rawResultDiv.style.border = '1px solid rgba(163,177,199,0.2)';
                queryInfo.appendChild(rawResultDiv);
            }
            
            let rawResultHTML = `
                <div class="summary-header" onclick="toggleRawResultSection()" style="background: rgba(163,177,199,0.05); padding: 8px 15px; cursor: pointer; border-radius: 5px; margin-bottom: 10px;">
                    <div class="section-title">
                        <div class="led-indicator" id="raw-result-led"></div>
                        <h5 style="margin: 0; font-size: 14px;">Contenu brut du résultat</h5>
                    </div>
                    <div class="arrow-indicator" id="raw-result-arrow">
                        ▼
                    </div>
                </div>
                <div class="summary-content" id="raw-result-content" style="display: none;">
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <button onclick="effacerContenuBrut()" class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" title="Effacer le contenu">Effacer</button>
                        <button onclick="copierContenuBrut()" class="btn" style="padding: 6px 12px; font-size: 12px; background: #4ecdc4; color: white;" title="Copier dans le presse-papier">Copier</button>
                    </div>
            `;
            
            if (rawResult !== null) {
                // Afficher le résultat brut complet
                rawResultHTML += '<div id="contenu-brut-container" style="background: rgba(0,0,0,0.1); padding: 10px; border-radius: 3px; font-family: monospace; font-size: 11px; max-height: 300px; overflow-y: auto;">';
                rawResultHTML += '<pre id="contenu-brut-pre" style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">';
                rawResultHTML += JSON.stringify(rawResult, null, 2);
                rawResultHTML += '</pre>';
                rawResultHTML += '</div>';
            } else {
                rawResultHTML += '<div style="color: #ff6b6b; font-style: italic;">Aucun résultat brut disponible</div>';
            }
            
            // Fermer la div du contenu pliable
            rawResultHTML += '</div>';
            
            rawResultDiv.innerHTML = rawResultHTML;
        }
        
        // Afficher et ouvrir la section des détails de requête
        const queryDetailsSection = document.getElementById('query-details-content');
        const queryDetailsLed = document.getElementById('query-details-led');
        const queryDetailsArrow = document.getElementById('query-details-arrow');
        
        if (queryDetailsSection && queryDetailsLed && queryDetailsArrow) {
            queryDetailsSection.style.display = 'block';
            queryDetailsLed.classList.add('active');
            queryDetailsArrow.textContent = '▲';
        }
        
        console.log('✅ Détails de requête affichés avec contenu brut');
    } else {
        console.error('❌ Impossible de trouver les éléments DOM pour les détails de requête');
    }
}

// ✅ FONCTION SUPPRIMÉE: creerRequeteSQLJS() - Remplacée par SQL.js natif

/**
 * Fonction de diagnostic rapide pour vérifier les données
 */
function diagnosticRapide() {
    console.log('🔍 DIAGNOSTIC RAPIDE - Vérification des données');
    
    const donnees = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
    console.log('📊 Données brutes:', donnees);
    
    let lignes, headers;
    let nombreLignes = 0;
    
    if (donnees.donnees && donnees.donnees.donnees) {
        lignes = donnees.donnees.donnees;
        headers = donnees.donnees.headers || [];
        nombreLignes = lignes.length;
        console.log(`✅ Structure imbriquée: ${nombreLignes} lignes, ${headers.length} colonnes`);
    } else if (Array.isArray(donnees.donnees)) {
        lignes = donnees.donnees;
        headers = donnees.headers || [];
        nombreLignes = lignes.length;
        console.log(`✅ Structure directe: ${nombreLignes} lignes, ${headers.length} colonnes`);
    } else {
        console.log('❌ Aucune donnée trouvée dans localStorage');
        return { lignes: 0, headers: 0, status: 'Aucune donnée chargée' };
    }
    
    // Vérifier aussi les métadonnées
    const metadata = donnees.metadata || {};
    const fichierInfo = donnees.fichier || {};
    
    console.log('📋 Headers:', headers);
    console.log('📋 Première ligne:', lignes[0]);
    console.log(`📊 RÉSULTAT: ${nombreLignes} lignes dans la base de données`);
    
    return {
        lignes: nombreLignes,
        headers: headers.length,
        status: nombreLignes > 0 ? 'OK' : 'Base vide',
        premiereligne: lignes[0],
        headers_list: headers,
        fichier: fichierInfo,
        metadata: metadata,
        message: `La base contient ${nombreLignes} lignes de données`
    };
}

/**
 * Fonction simple pour obtenir juste le nombre de lignes
 */
function compterLignes() {
    // Utiliser StorageManager et extractDataStructure
    const donnees = StorageManager.getDonnees();
    const { lignes } = extractDataStructure(donnees);
    
    return lignes ? lignes.length : 0;
}

/**
 * Générer une ligne aléatoire avec identifiant incrémental
 */
function genererLigneAleatoire(headers) {
    console.log('🎲 Génération d\'une ligne aléatoire...');
    console.log('🔍 Headers disponibles:', headers);
    
    const ligne = [];
    
    // Obtenir le prochain numéro d'incrément
    const compteurRand = obtenirProchainCompteurRand();
    
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        
        if (i === 0) {
            // Premier champ : identifiant incrémental "Rand_XXX"
            const identifiant = `Rand_${compteurRand.toString().padStart(3, '0')}`;
            ligne.push(identifiant);
            console.log(`🏷️ Identifiant généré: ${identifiant}`);
        } else {
            // Autres champs : valeurs aléatoires basées sur le nom de la colonne
            const valeurAleatoire = genererValeurAleatoire(header);
            ligne.push(valeurAleatoire);
        }
    }
    
    console.log('✅ Ligne aléatoire générée:', ligne);
    return ligne;
}

/**
 * Obtenir le prochain compteur pour les identifiants Rand_XXX
 */
function obtenirProchainCompteurRand() {
    // Utiliser StorageManager pour incrémenter le compteur
    const compteur = StorageManager.incrementRandCounter();
    
    console.log(`🔢 Prochain compteur Rand via StorageManager: ${compteur}`);
    return compteur;
}

/**
 * Générer une valeur aléatoire basée sur le nom de la colonne
 */
function genererValeurAleatoire(nomColonne) {
    const nomLower = nomColonne.toLowerCase();
    
    // Valeurs spécifiques selon le type de colonne
    if (nomLower.includes('criticality') || nomLower.includes('critical')) {
        const criticites = ['Critical', 'High', 'Medium', 'Low'];
        return criticites[Math.floor(Math.random() * criticites.length)];
    }
    
    if (nomLower.includes('monitoring') || nomLower.includes('monitor')) {
        return Math.random() > 0.5 ? 'YES' : 'NO';
    }
    
    if (nomLower.includes('hcc')) {
        return Math.random() > 0.5 ? 'YES' : 'NO';
    }
    
    if (nomLower.includes('eligibility') || nomLower.includes('eligible')) {
        return Math.random() > 0.5 ? 'YES' : 'NO';
    }
    
    if (nomLower.includes('dx') || nomLower.includes('d*') || nomLower.includes('id') || nomLower.includes('identifier')) {
        const prefixes = ['DP', 'DA', 'DB', 'DC', 'DD'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const numero = Math.floor(Math.random() * 9999) + 1;
        return `${prefix}${numero.toString().padStart(4, '0')}`;
    }
    
    if (nomLower.includes('operator') || nomLower.includes('department')) {
        const departments = ['IT Operations', 'Network Services', 'Security Team', 'Database Admin', 'System Admin', 'DevOps Team'];
        return departments[Math.floor(Math.random() * departments.length)];
    }
    
    if (nomLower.includes('app appli') || nomLower.includes('appli')) {
        const noms = ['Service Alpha', 'Application Beta', 'System Gamma', 'Module Delta', 'Component Epsilon', 'Portal Web', 'API Gateway', 'Database Service'];
        return noms[Math.floor(Math.random() * noms.length)];
    }
    
    if (nomLower.includes('app code') || nomLower.includes('code')) {
        const codes = ['SRV001', 'APP002', 'SYS003', 'MOD004', 'CMP005', 'WEB006', 'API007', 'DB008'];
        return codes[Math.floor(Math.random() * codes.length)];
    }
    
    if (nomLower.includes('name') || nomLower.includes('nom')) {
        const noms = ['Service Alpha', 'Application Beta', 'System Gamma', 'Module Delta', 'Component Epsilon'];
        return noms[Math.floor(Math.random() * noms.length)];
    }
    
    if (nomLower.includes('status') || nomLower.includes('état')) {
        const statuts = ['Active', 'Inactive', 'Pending', 'Completed'];
        return statuts[Math.floor(Math.random() * statuts.length)];
    }
    
    if (nomLower.includes('date')) {
        const maintenant = new Date();
        const dateAleatoire = new Date(maintenant.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        return dateAleatoire.toISOString().split('T')[0];
    }
    
    if (nomLower.includes('number') || nomLower.includes('count') || nomLower.includes('nb')) {
        return Math.floor(Math.random() * 100) + 1;
    }
    
    // Valeur par défaut : texte aléatoire
    const textesAleatoires = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit'];
    return textesAleatoires[Math.floor(Math.random() * textesAleatoires.length)];
}

/**
 * Sauvegarder les données modifiées dans localStorage
 */
async function sauvegarderDonneesModifiees(lignes, headers) {
    console.log('💾 Sauvegarde des données modifiées [SQL.js NATIF]...');
    console.log(`💾 Lignes à sauvegarder: ${lignes.length}`);
    console.log(`💾 Headers à sauvegarder: ${headers.length}`);
    
    try {
        // 🚀 Sauvegarde directe avec DatabaseManager - Plus de localStorage !
        console.log('💾 Sauvegarde directe via DatabaseManager SQL.js');
        const success = await window.DatabaseManager.setDonnees(lignes, headers);
        
        if (success) {
            console.log(`✅ ${lignes.length} lignes sauvegardées via SQL.js`);
            
            // Vérification avec DatabaseManager
            const stats = await window.DatabaseManager.getStats();
            console.log(`✅ Vérification SQL.js: ${stats.donnees.dataLength} lignes en base`);
        } else {
            throw new Error('Échec de la sauvegarde via DatabaseManager');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde SQL.js:', error);
        console.error('❌ Stack trace:', error.stack);
        throw error;
    }
}

/**
 * Basculer l'affichage de la section contenu brut
 */
function toggleRawResultSection() {
    console.log('🔄 Toggle de la section contenu brut');
    
    const content = document.getElementById('raw-result-content');
    const led = document.getElementById('raw-result-led');
    const arrow = document.getElementById('raw-result-arrow');
    
    if (!content || !led || !arrow) {
        console.error('❌ Éléments de la section contenu brut non trouvés');
        return;
    }
    
    const isVisible = content.style.display !== 'none';
    
    if (isVisible) {
        // Fermer la section
        content.style.display = 'none';
        led.style.background = '#888'; // LED grise
        led.classList.remove('active');
        arrow.textContent = '▼';
        console.log('📁 Section contenu brut fermée');
    } else {
        // Ouvrir la section
        content.style.display = 'block';
        led.style.background = '#4ecdc4'; // LED verte
        led.classList.add('active');
        arrow.textContent = '▲';
        console.log('📂 Section contenu brut ouverte');
    }
}

/**
 * Effacer le contenu brut du résultat
 */
function effacerContenuBrut() {
    console.log('🗑️ Effacement du contenu brut du résultat');
    
    const contenuBrutPre = document.getElementById('contenu-brut-pre');
    const contenuBrutContainer = document.getElementById('contenu-brut-container');
    
    if (contenuBrutPre) {
        contenuBrutPre.textContent = '';
        console.log('✅ Contenu brut effacé');
    }
    
    if (contenuBrutContainer) {
        contenuBrutContainer.innerHTML = '<div style="color: #888; font-style: italic; text-align: center; padding: 20px;">Contenu effacé</div>';
        console.log('✅ Container mis à jour avec message d\'effacement');
    }
}

/**
 * Copier le contenu brut dans le presse-papier
 */
function copierContenuBrut() {
    console.log('📋 Copie du contenu brut dans le presse-papier');
    
    const contenuBrutPre = document.getElementById('contenu-brut-pre');
    
    if (!contenuBrutPre) {
        console.error('❌ Élément contenu-brut-pre non trouvé');
        alert('Erreur: Contenu non trouvé');
        return;
    }
    
    const contenu = contenuBrutPre.textContent;
    
    if (!contenu || contenu.trim() === '') {
        console.log('⚠️ Contenu vide, rien à copier');
        alert('Aucun contenu à copier');
        return;
    }
    
    // Utiliser l'API Clipboard moderne si disponible
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contenu)
            .then(() => {
                console.log('✅ Contenu copié dans le presse-papier via Clipboard API');
                alert('Contenu copié dans le presse-papier !');
            })
            .catch(err => {
                console.error('❌ Erreur lors de la copie via Clipboard API:', err);
                // Fallback vers la méthode traditionnelle
                copierAvecFallback(contenu);
            });
    } else {
        // Fallback pour les navigateurs plus anciens
        copierAvecFallback(contenu);
    }
}

/**
 * Méthode de fallback pour copier le contenu
 */
function copierAvecFallback(contenu) {
    console.log('📋 Utilisation de la méthode de fallback pour la copie');
    
    try {
        // Créer un élément textarea temporaire
        const textarea = document.createElement('textarea');
        textarea.value = contenu;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        // Sélectionner et copier
        textarea.select();
        textarea.setSelectionRange(0, 99999); // Pour mobile
        
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
            console.log('✅ Contenu copié dans le presse-papier via fallback');
            alert('Contenu copié dans le presse-papier !');
        } else {
            console.error('❌ Échec de la copie via fallback');
            alert('Erreur lors de la copie');
        }
    } catch (err) {
        console.error('❌ Erreur lors de la copie via fallback:', err);
        alert('Erreur lors de la copie: ' + err.message);
    }
}

/**
 * Fonctions de pagination pour les résultats de la page DataBase
 */

function initialiserPaginationResultats(resultats, headers) {
    console.log('📄 Initialisation pagination résultats:', resultats.length, 'lignes');
    
    window.resultsData.donnees = resultats;
    window.resultsData.headers = headers || [];
    window.resultsData.pageActuelle = 1;
    window.resultsData.totalPages = Math.ceil(resultats.length / window.resultsData.lignesParPage);
    
    // Afficher les contrôles si plus d'une page
    const controlsDiv = document.getElementById('results-controls');
    if (controlsDiv) {
        controlsDiv.style.display = window.resultsData.totalPages > 1 ? 'flex' : 'none';
    }
    
    // Mettre à jour les contrôles
    mettreAJourControlesNavigationResultats();
    
    // Générer la première page
    genererTableauResultatsPagine();
}

function genererTableauResultatsPagine() {
    const debut = (window.resultsData.pageActuelle - 1) * window.resultsData.lignesParPage;
    const fin = Math.min(debut + window.resultsData.lignesParPage, window.resultsData.donnees.length);
    
    const resultatsPage = window.resultsData.donnees.slice(debut, fin);
    
    console.log(`📄 Génération page ${window.resultsData.pageActuelle}: lignes ${debut}-${fin}`);
    
    // Utiliser la fonction existante mais avec les données paginées
    const resultsDiv = document.getElementById('query-results');
    if (!resultsDiv || resultatsPage.length === 0) return;
    
    // Créer le HTML du tableau
    let html = `<div class="results-count">${window.resultsData.donnees.length} résultat(s) trouvé(s) - Page ${window.resultsData.pageActuelle}/${window.resultsData.totalPages}</div>`;
    
    if (resultatsPage.length > 0) {
        const colonnes = Object.keys(resultatsPage[0]);
        
        html += '<table class="results-table">';
        html += '<thead><tr>';
        colonnes.forEach(colonne => {
            html += `<th>${colonne}</th>`;
        });
        html += '</tr></thead>';
        
        html += '<tbody>';
        resultatsPage.forEach((ligne) => {
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
    
    // Mettre à jour les informations
    mettreAJourControlesNavigationResultats();
}

function mettreAJourControlesNavigationResultats() {
    const currentPageInput = document.getElementById('results-current-page');
    const totalPagesSpan = document.getElementById('results-total-pages');
    const lignesAfficheesSpan = document.getElementById('results-lignes-affichees');
    const totalLignesSpan = document.getElementById('results-total-lignes');
    
    if (currentPageInput) currentPageInput.value = window.resultsData.pageActuelle;
    if (totalPagesSpan) totalPagesSpan.textContent = window.resultsData.totalPages;
    
    const debut = (window.resultsData.pageActuelle - 1) * window.resultsData.lignesParPage;
    const fin = Math.min(debut + window.resultsData.lignesParPage, window.resultsData.donnees.length);
    
    if (lignesAfficheesSpan) lignesAfficheesSpan.textContent = fin - debut;
    if (totalLignesSpan) totalLignesSpan.textContent = window.resultsData.donnees.length;
    
    // Gérer l'état des boutons
    const firstBtn = document.getElementById('results-first-page');
    const prevBtn = document.getElementById('results-prev-page');
    const nextBtn = document.getElementById('results-next-page');
    const lastBtn = document.getElementById('results-last-page');
    
    if (firstBtn) firstBtn.disabled = window.resultsData.pageActuelle === 1;
    if (prevBtn) prevBtn.disabled = window.resultsData.pageActuelle === 1;
    if (nextBtn) nextBtn.disabled = window.resultsData.pageActuelle === window.resultsData.totalPages;
    if (lastBtn) lastBtn.disabled = window.resultsData.pageActuelle === window.resultsData.totalPages;
}

function allerPremierePageResultats() {
    window.resultsData.pageActuelle = 1;
    genererTableauResultatsPagine();
}

function pagePrecedenteResultats() {
    if (window.resultsData.pageActuelle > 1) {
        window.resultsData.pageActuelle--;
        genererTableauResultatsPagine();
    }
}

function pageSuivanteResultats() {
    if (window.resultsData.pageActuelle < window.resultsData.totalPages) {
        window.resultsData.pageActuelle++;
        genererTableauResultatsPagine();
    }
}

function allerDernierePageResultats() {
    window.resultsData.pageActuelle = window.resultsData.totalPages;
    genererTableauResultatsPagine();
}

function allerALaPageResultats(numeroPage) {
    const page = parseInt(numeroPage);
    if (page >= 1 && page <= window.resultsData.totalPages) {
        window.resultsData.pageActuelle = page;
        genererTableauResultatsPagine();
    }
}

/**
 * Exposition de l'API pour le débogage
 */
window.dioo = {
    navigateTo: (page) => window.diooApp?.navigateToPage(page),
    getState: () => window.diooApp?.getAppState(),
    reset: () => window.diooApp?.reset(),
    version: 'v0.000-stable-extract-viewer-database',
    // Nouvelles fonctions
    diagnostic: diagnosticRapide,
    compterLignes: compterLignes,
    effacerDonnees: effacerDonnees,
    testEffacement: () => {
        console.log('🧪 TEST - Avant effacement:', compterLignes(), 'lignes');
        effacerDonnees();
        setTimeout(() => {
            console.log('🧪 TEST - Après effacement:', compterLignes(), 'lignes');
        }, 100);
    },
    ajouterLigneAleatoire: () => {
        console.log('🧪 TEST - Ajout ligne aléatoire via API');
        console.log('🧪 Nombre de lignes avant:', compterLignes());
        executeQuery('ajouter_ligne_aleatoire');
        setTimeout(() => {
            console.log('🧪 Nombre de lignes après:', compterLignes());
        }, 1000);
    },
    testBouton: () => {
        console.log('🧪 TEST DIRECT - Simulation clic bouton');
        const bouton = document.querySelector('button[onclick="executeQuery(\'ajouter_ligne_aleatoire\')"]');
        if (bouton) {
            console.log('✅ Bouton trouvé:', bouton);
            bouton.click();
        } else {
            console.error('❌ Bouton non trouvé');
        }
    },
    genererLigne: genererLigneAleatoire,
    chargerFichier: chargerFichierDIOO,
    gererClicCharger: gererClicCharger,
    reinitialiser: reinitialiserEtats,
    getLocalStorage: () => JSON.parse(localStorage.getItem('dioo_donnees') || '{}'),
    // Fonctions Dump
    toggleDump: toggleDumpSection,
    getDumpData: () => window.dumpData,
    // Fonctions Monitoring
    calculerConsolidation: calculerConsolidation,
    getSummary: () => JSON.parse(localStorage.getItem('dioo_summary') || '[]'),
    toggleSection: toggleSection,
    // Fonctions DataBase
    toggleDatabaseSection: toggleDatabaseSection,
    executeQuery: executeQuery,
    executeCustomQuery: executeCustomQuery,
    // creerRequeteSQLJS: creerRequeteSQLJS, // DEPRECATED - Utiliser SQLParser.createSQLJSQuery()
    testCustomQuery: () => {
        console.log('🧪 Test de la requête personnalisée');
        const queryInput = document.getElementById('custom-query-input');
        if (queryInput) {
            console.log('✅ Élément trouvé, valeur actuelle:', queryInput.value);
            executeCustomQuery();
        } else {
            console.error('❌ Élément custom-query-input non trouvé');
        }
    },
    testSQLJS: (query) => {
        const donnees = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
        let headers = [];
        if (donnees.donnees && donnees.donnees.headers) {
            headers = donnees.donnees.headers;
        }
        return creerRequeteSQLJS(query || 'SELECT COUNT(*) FROM dioo_donnees;', headers);
    },
    // Utilitaires
    afficher10Lignes: afficher10PremiersLignes,
    debugLocalStorage: () => {
        const donnees = JSON.parse(localStorage.getItem('dioo_donnees') || '{}');
        console.log('🔍 Debug localStorage:', donnees);
        console.log('🔍 Clés disponibles:', Object.keys(donnees));
        if (donnees.donnees) {
            console.log('🔍 Type de donnees.donnees:', typeof donnees.donnees, Array.isArray(donnees.donnees));
            if (donnees.donnees.donnees) {
                console.log('🔍 Type de donnees.donnees.donnees:', typeof donnees.donnees.donnees, Array.isArray(donnees.donnees.donnees));
            }
        }
        return donnees;
    },
    // Fonctions de gestion du contenu brut
    toggleRawResultSection: toggleRawResultSection,
    effacerContenuBrut: effacerContenuBrut,
    copierContenuBrut: copierContenuBrut
};

/*===============================================
  FONCTIONS AFFICHAGE REQUÊTES SQL
===============================================*/

/**
 * Afficher la section des requêtes SQL
 */
function afficherSectionRequetesSQL() {
    const section = document.getElementById('sql-queries-section');
    if (section) {
        section.style.display = 'block';
        // Vider la liste des requêtes précédentes
        viderListeRequetesSQL();
    }
}

/**
 * Vider la liste des requêtes SQL
 */
function viderListeRequetesSQL() {
    const liste = document.getElementById('sql-query-list');
    if (liste) {
        liste.innerHTML = '<p class="no-queries">Calcul en cours...</p>';
    }
}

/**
 * Ajouter une requête SQL à l'affichage
 */
function ajouterRequeteSQL(titre, requete, resultat = null, erreur = null) {
    const liste = document.getElementById('sql-query-list');
    if (!liste) return;
    
    // Supprimer le message "aucune requête"
    const noQueries = liste.querySelector('.no-queries');
    if (noQueries) {
        noQueries.remove();
    }
    
    const timestamp = new Date().toLocaleTimeString();
    
    const queryItem = document.createElement('div');
    queryItem.className = 'sql-query-item';
    
    let resultHtml = '';
    if (erreur) {
        resultHtml = `<div class="sql-query-error">❌ Erreur: ${erreur}</div>`;
    } else if (resultat !== null) {
        if (typeof resultat === 'number') {
            resultHtml = `<div class="sql-query-result">✅ Résultat: ${resultat}</div>`;
        } else if (Array.isArray(resultat)) {
            resultHtml = `<div class="sql-query-result">✅ ${resultat.length} ligne(s) retournée(s)</div>`;
        } else {
            resultHtml = `<div class="sql-query-result">✅ Exécutée avec succès</div>`;
        }
    }
    
    queryItem.innerHTML = `
        <div class="sql-query-header">
            <div class="sql-query-title">${titre}</div>
            <div class="sql-query-time">${timestamp}</div>
        </div>
        <div class="sql-query-code">${requete}</div>
        ${resultHtml}
    `;
    
    liste.appendChild(queryItem);
    
    // Scroll vers le bas pour voir la nouvelle requête
    liste.scrollTop = liste.scrollHeight;
}

/**
 * Effectuer les calculs de consolidation avec SQL natif
 */
async function effectuerCalculsConsolidationSQL() {
    console.log('🎯 Calculs de consolidation avec requêtes SQL natives');
    
    try {
        // 1. Compter le total d'applications critiques
        const queryTotalCritiques = `
            SELECT COUNT(*) as total 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = 'DP' 
            AND UPPER("Operator/Department") like 'DP%'
            AND UPPER("Business criticality") = 'CRITICAL'        `;
        
        const totalCritiques = await executerRequeteSQL('Total Applications Critiques', queryTotalCritiques);
        
        // 2. BSM - Monitored in BSM
        const queryMonitoredBSM = `
            SELECT COUNT(*) as count 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = 'DP' 
            AND UPPER("Business criticality") = 'CRITICAL'
            AND UPPER("Operator/Department") like 'DP%'
            AND UPPER("Functional monitoring (BSM)") = 'YES'
        `;
        
        const monitoredBSM = await executerRequeteSQL('BSM - Monitored', queryMonitoredBSM);
        
        // 3. BSM - Still To Be Monitored
        const queryStillToMonitor = `
            SELECT COUNT(*) as count 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = 'DP' 
            AND UPPER("Business criticality") = 'CRITICAL'
            AND UPPER("Operator/Department") like 'DP%'
            AND UPPER("In HCC") = 'NO'
        `;
        
        const stillToMonitor = await executerRequeteSQL('BSM - Still To Monitor', queryStillToMonitor);
        
        // 4. HCC - Confirmed Not Required in BSM
        const queryNotRequiredBSM = `
            SELECT COUNT(*) as count 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = 'DP' 
            AND UPPER("Business criticality") = 'CRITICAL'
            AND UPPER("Operator/Department") like 'DP%'
            AND UPPER("Functional monitoring (BSM)") = 'NO'
            AND UPPER("HCC eligibility") = 'NO'
        `;
        
        const notRequiredBSM = await executerRequeteSQL('HCC - Not Required BSM', queryNotRequiredBSM);
        
        // 5. HCC - Monitored in HCC
        const queryMonitoredHCC = `
            SELECT COUNT(*) as count 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = 'DP' 
            AND UPPER("Operator/Department") like 'DP%'
            AND UPPER("Business criticality") = 'CRITICAL'
            AND UPPER("In HCC") = 'YES'
        `;
        
        const monitoredHCC = await executerRequeteSQL('HCC - Monitored', queryMonitoredHCC);
        
        // 6. HCC - Confirmed not required in HCC
        const queryNotRequiredHCC = `
            SELECT COUNT(*) as count 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = 'DP' 
            AND UPPER("Operator/Department") like 'DP%'
            AND UPPER("Business criticality") = 'CRITICAL'
            AND UPPER("In HCC") = 'NO'
            AND UPPER("HCC eligibility") = 'NO'
        `;
        
        const notRequiredHCC = await executerRequeteSQL('HCC - Not Required', queryNotRequiredHCC);
        
        // Calculer les sections DP avec SQL
        const sectionsDP = await calculerSectionsDPSQL();

        // Calculer le total de toutes les sections DP pour le pourcentage
        const totalSectionsDP = Object.values(sectionsDP).reduce((sum, section) => sum + section.total, 0);

        
        // Calculer les pourcentages
        const pctSectionsDP = totalCritiques > 0 ? Math.round((stillToMonitor / totalCritiques) * 100) : 0;
        const pctNotRequiredBSM = totalCritiques > 0 ? Math.round((notRequiredBSM / totalCritiques) * 100) : 0;
        const pctMonitoredHCC = totalCritiques > 0 ? Math.round((monitoredHCC / totalCritiques) * 100) : 0;
        const pctNotRequiredHCC = totalCritiques > 0 ? Math.round((notRequiredHCC / totalCritiques) * 100) : 0;
        
        // Calculer "Already onboarded" = BSM Monitored
        const alreadyOnboarded = monitoredBSM;
        
        // Créer la structure attendue pour la section DP principale
        const dpPrincipal = {
            criticalBusinessServices: totalCritiques,
            alreadyOnboarded: alreadyOnboarded,
            stillToOnboard: stillToMonitor
        };
        
        // Ajouter la section DP principale aux sections
        sectionsDP.dp = dpPrincipal;
        
        const resultats = {
            date: new Date().toISOString().split('T')[0],
            totalCritiques,
            alreadyOnboarded,
            monitoredBSM,
            stillToMonitor,
            notRequiredBSM,
            pctNotRequiredBSM,
            monitoredHCC,
            notRequiredHCC,
            pctMonitoredHCC,
            pctNotRequiredHCC,
            pctSectionsDP,
            totalSectionsDP,
            sectionsDP: sectionsDP
        };
        
        console.log('✅ Calculs de consolidation SQL terminés:', resultats);
        return resultats;
        
    } catch (error) {
        console.error('❌ Erreur dans les calculs SQL:', error);
        ajouterRequeteSQL('ERREUR', 'Calculs de consolidation', null, error.message);
        throw error;
    }
}

/**
 * Exécuter une requête SQL et afficher le résultat
 */
async function executerRequeteSQL(titre, requete) {
    try {
        const results = await window.DatabaseManager.executeQuery(requete);
        const valeur = results[0] ? (results[0].total || results[0].count || 0) : 0;
        
        ajouterRequeteSQL(titre, requete, valeur);
        return valeur;
        
    } catch (error) {
        ajouterRequeteSQL(titre, requete, null, error.message);
        throw error;
    }
}

/**
 * Calculer les sections DP avec SQL
 */
async function calculerSectionsDPSQL() {
    const sections = {};
    
    // Pour chaque section DP (DP1, DP2, DP3, DP4, DP5)
    const dpTypes = ['DP1', 'DP2', 'DP3', 'DP4', 'DP5'];
    
    for (const dpType of dpTypes) {
        // Compter le total pour ce type DP
        const queryTotal = `
            SELECT COUNT(*) as count 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = '${dpType}' 
            AND UPPER("Business criticality") = 'CRITICAL'
        `;
        
        // Compter les monitored pour ce type DP
        const queryMonitored = `
            SELECT COUNT(*) as count 
            FROM dioo_donnees 
            WHERE UPPER("Dx") = '${dpType}' 
            AND UPPER("Business criticality") = 'CRITICAL'
            AND UPPER("Functional monitoring (BSM)") = 'YES'
        `;
        
        try {
            const total = await executerRequeteSQL(`Section ${dpType} - Total`, queryTotal);
            const monitored = await executerRequeteSQL(`Section ${dpType} - Monitored`, queryMonitored);
            
            // Mapper vers les noms de sections attendus (dpa, dpb, etc.)
            let sectionKey;
            switch(dpType) {
                case 'DP1': sectionKey = 'dpa'; break;
                case 'DP2': sectionKey = 'dpb'; break;
                case 'DP3': sectionKey = 'dpc'; break;
                case 'DP4': sectionKey = 'dpp'; break;
                case 'DP5': sectionKey = 'dps'; break;
                default: sectionKey = dpType.toLowerCase();
            }
            sections[sectionKey] = { total, monitored };
            
        } catch (error) {
            console.error(`Erreur calcul section ${dpType}:`, error);
            let sectionKey;
            switch(dpType) {
                case 'DP1': sectionKey = 'dpa'; break;
                case 'DP2': sectionKey = 'dpb'; break;
                case 'DP3': sectionKey = 'dpc'; break;
                case 'DP4': sectionKey = 'dpp'; break;
                case 'DP5': sectionKey = 'dps'; break;
                default: sectionKey = dpType.toLowerCase();
            }
            sections[sectionKey] = { total: 0, monitored: 0 };
        }
    }
    
    return sections;
}

// ========================================
// GESTION DE LA SÉLECTION DE FEUILLE EXCEL
// ========================================

/**
 * Afficher l'interface de sélection de feuille Excel
 * @param {Object} sheetsAnalysis - Analyse des feuilles Excel
 */
function afficherSelectionFeuille(sheetsAnalysis) {
    console.log('📋 Affichage sélection de feuille:', sheetsAnalysis);
    
    window.excelSheetsAnalysis = sheetsAnalysis;
    
    const sheetSection = document.getElementById('sheet-selection-section');
    const sheetList = document.getElementById('sheet-list');
    
    // Vider la liste précédente
    sheetList.innerHTML = '';
    
    // Créer les éléments de feuille
    sheetsAnalysis.sheets.forEach((sheet, index) => {
        const sheetItem = document.createElement('div');
        sheetItem.className = 'sheet-item';
        sheetItem.dataset.sheetName = sheet.name;
        
        // Marquer comme recommandé si c'est le cas
        if (sheet.isRecommended && index === 0) {
            sheetItem.classList.add('selected');
            window.selectedSheetName = sheet.name;
            document.getElementById('confirm-sheet-btn').disabled = false;
        }
        
        let monthBadge = '';
        if (sheet.monthInfo.detected) {
            monthBadge = `<span class="sheet-month">${sheet.monthInfo.fullDate}</span>`;
        }
        
        sheetItem.innerHTML = `
            <div class="sheet-name">${sheet.displayName}</div>
            <div class="sheet-info">
                <span class="sheet-rows">${sheet.estimatedRows} lignes</span>
                ${monthBadge}
            </div>
        `;
        
        // Ajouter l'événement de clic
        sheetItem.addEventListener('click', () => selectionnerFeuille(sheet.name));
        
        sheetList.appendChild(sheetItem);
    });
    
    // Afficher la section et l'ouvrir par défaut
    sheetSection.style.display = 'block';
    
    // Activer la LED et ouvrir la section
    definirEtatIndicateur('sheet-selection-led', 'active');
    
    // S'assurer que la section est ouverte
    const content = document.getElementById('sheet-selection-content');
    const arrow = document.getElementById('sheet-selection-arrow');
    if (content && arrow) {
        content.style.display = 'block';
        arrow.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
}

/**
 * Sélectionner une feuille Excel
 * @param {string} sheetName - Nom de la feuille
 */
function selectionnerFeuille(sheetName) {
    console.log('📋 Sélection de la feuille:', sheetName);
    
    // Désélectionner toutes les feuilles
    document.querySelectorAll('.sheet-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Sélectionner la feuille cliquée
    const selectedItem = document.querySelector(`[data-sheet-name="${sheetName}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
        window.selectedSheetName = sheetName;
        document.getElementById('confirm-sheet-btn').disabled = false;
    }
}


/**
 * Confirmer la sélection de feuille et démarrer l'import
 */
function confirmerSelectionFeuille() {
    if (!window.selectedSheetName) {
        alert('Veuillez sélectionner une feuille.');
        return;
    }
    
    console.log('✅ Confirmation sélection feuille:', window.selectedSheetName);
    
    // Masquer la section de sélection
    document.getElementById('sheet-selection-section').style.display = 'none';
    
    // Démarrer l'import avec la feuille sélectionnée
    demarrerProcessusEnchaine();
}

/**
 * Annuler la sélection de feuille
 */
function annulerSelectionFeuille() {
    console.log('❌ Annulation sélection feuille');
    
    // Réinitialiser les variables
    window.excelSheetsAnalysis = null;
    window.selectedSheetName = null;
    window.fichierCourant = null;
    
    // Masquer la section
    document.getElementById('sheet-selection-section').style.display = 'none';
    
    // Réinitialiser le sélecteur de fichier
    document.getElementById('selecteur-fichier').value = '';
}

/**
 * Fermer automatiquement les sections dump et overview après l'import
 */
function fermerSectionsApresImport() {
    console.log('📁 Fermeture automatique des sections après import');
    
    // Fermer la section dump si elle est ouverte
    const dumpContent = document.getElementById('import-dump-content');
    const dumpArrow = document.getElementById('import-dump-arrow');
    if (dumpContent && dumpArrow && dumpContent.style.display !== 'none') {
        dumpContent.style.display = 'none';
        dumpArrow.innerHTML = '<i class="fas fa-chevron-down"></i>';
        console.log('📁 Section dump fermée');
    }
    
    // Fermer la section overview si elle est ouverte
    const overviewContent = document.getElementById('overview-content');
    const overviewArrow = document.getElementById('overview-arrow');
    if (overviewContent && overviewArrow && overviewContent.style.display !== 'none') {
        overviewContent.style.display = 'none';
        overviewArrow.innerHTML = '<i class="fas fa-chevron-down"></i>';
        console.log('📁 Section overview fermée');
    }
}