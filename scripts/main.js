/**
 * Application YesData Frequentation - Script principal
 * Gestion de la navigation et interactions utilisateur
 */

class YesDataApp {
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
        console.log('✅ Application YesData Frequentation initialisée avec succès - Style YesData');
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
        
        const currentPageName = pageNames[this.currentPage] || 'YesData Frequentation';
        document.title = `${currentPageName} - YesData Frequentation`;
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
🚀 Application YesData Frequentation v1.0.0 - Style YesData Futuriste
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
     * Initialiser le menu canvas cylindrique - Style YesData
     */
    initCanvasMenu() {
        this.drawCylMenu();
        window.addEventListener('resize', () => this.drawCylMenu());
    }

    /**
     * Dessiner le menu cylindrique - Inspiré du projet YesData
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
const YesDataUtils = {
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
     * Afficher une notification - CAPTURE AUTOMATIQUE DES ERREURS DANS LE DUMP
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (info, success, warning, error)
     */
    showNotification(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        // CAPTURE AUTOMATIQUE: Si c'est une erreur, l'ajouter au dump avec détails techniques
        if (type === 'error') {
            const timestamp = new Date().toISOString();
            const stackTrace = new Error().stack;
            
            // Ajouter directement au dump avec tous les détails techniques
            ajouterRequeteSQL(
                '🚨 NOTIFICATION ERREUR FUGACE',
                `Erreur capturée automatiquement depuis notification`,
                `Timestamp: ${timestamp}, Type: ${type}, Stack: ${stackTrace ? stackTrace.substring(0, 300) : 'N/A'}`,
                message
            );
            
            // Log détaillé pour debug
            console.error('🔍 ERREUR CAPTURÉE DANS DUMP:', {
                message: message,
                type: type,
                timestamp: timestamp,
                stack: stackTrace
            });
        }
        
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.innerHTML = `
            <div class="toast-content">
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
        
        // Suppression automatique après 3 secondes (mais reste dans le dump)
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
    window.yesDataApp = new YesDataApp();
    
    // Exposer les utilitaires globalement
    window.YesDataUtils = YesDataUtils;
    
    // Fonctions de diagnostic accessibles depuis la console
    window.diagnostiquerErreurs = diagnostiquerErreurs;
    
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
    
    console.log('✅ Variables globales initialisées:', {
        dumpData: !!window.dumpData,
        resultsData: !!window.resultsData
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
            console.log(`🔍 Pour plus de détails, tapez: yesdata.diagnostic()`);
        } else {
            console.log(`📊 BASE DE DONNÉES: Aucune donnée chargée`);
            console.log(`🔍 Chargez un fichier de ventes WinPharma via la page Chargement`);
        }
    }, 1000);

    // Écouter les événements de changement de page
    document.addEventListener('pageChange', (e) => {
        console.log(`📄 Changement de page détecté:`, e.detail);
    });

    // Initialiser la classe CSS mobile si nécessaire
    if (YesDataUtils.isMobile()) {
        document.body.classList.add('mobile-view');
    }
});

/**
 * Gestion des erreurs globales
 */
window.addEventListener('error', (e) => {
    console.error('❌ Erreur dans l\'application YesData Frequentation:', e.error);
});

/**
 * Fonctions de gestion des fichiers de ventes WinPharma
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
        YesDataUtils.showNotification('État remis à zéro', 'info');
        return;
    }
    
    // Sinon, lancer le processus de chargement
    chargerFichierWinPharma();
}

/**
 * Fonction principale pour charger un fichier de ventes WinPharma
 * Enchaine toutes les étapes : sélection, import, validation
 */
function chargerFichierWinPharma() {
    console.log('🚀 Début du processus de chargement fichier WinPharma');
    
    // Réinitialiser les états
    reinitialiserEtats();
    
    // Ouvrir le sélecteur de fichier
    const selecteur = document.getElementById('selecteur-fichier');
    if (selecteur) {
        selecteur.click();
        console.log('📁 Ouverture du sélecteur de fichier WinPharma');
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

    // Démarrer le processus enchainé
    demarrerProcessusEnchaine();
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
        YesDataUtils.showNotification(`Erreur: ${error.message}`, 'error');
        
        // Ajouter l'erreur au dump pour qu'elle reste visible
        ajouterErreurAuDump('Erreur de traitement', error.message);
        
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
        
        // TRACE IMPORT: Début du processus
        const timestampImportDebut = new Date().toISOString();
        ajouterRequeteSQL(
            '🚀 IMPORT - Début du processus',
            `-- DÉBUT IMPORT WinPharma à ${timestampImportDebut}`,
            `Fichier: ${window.fichierCourant.name}`,
            null
        );
        
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                console.log('🔍 DEBUG - Début traitement fichier');
                console.log('🔍 DEBUG - Nom fichier:', window.fichierCourant.name);
                console.log('🔍 DEBUG - Taille données:', e.target.result?.byteLength || e.target.result?.length);
                
                // Traitement du fichier
                let donnees;
                const extension = window.fichierCourant.name.split('.').pop().toLowerCase();
                console.log('🔍 DEBUG - Extension détectée:', extension);
                
                try {
                    switch (extension) {
                        case 'json':
                            console.log('🔍 DEBUG - Parsing JSON...');
                            try {
                                donnees = JSON.parse(e.target.result);
                            } catch (jsonError) {
                                ajouterRequeteSQL(
                                    '❌ IMPORT - Erreur parsing JSON',
                                    `-- Erreur lors du parsing JSON: ${jsonError.message}`,
                                    `Fichier: ${window.fichierCourant.name}, Position erreur: ${jsonError.message.includes('position') ? jsonError.message : 'N/A'}`,
                                    jsonError.message
                                );
                                throw jsonError;
                            }
                            break;
                        case 'csv':
                            console.log('🔍 DEBUG - Parsing CSV...');
                            try {
                                // Détecter la taille du fichier pour choisir la méthode de traitement
                                const fileSizeBytes = e.target.result?.length || 0;
                                const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
                                const lineCount = (e.target.result.match(/\n/g) || []).length;
                                
                                console.log(`📊 Analyse fichier CSV: ${fileSizeMB}MB, ~${lineCount} lignes`);
                                
                                // Si le fichier est volumineux (>2MB ou >5000 lignes), utiliser le traitement par paquets
                                if (fileSizeBytes > 2097152 || lineCount > 5000) { // 2MB ou 5000 lignes
                                    console.log('📦 Fichier volumineux détecté - Traitement par paquets activé');
                                    
                                    ajouterRequeteSQL(
                                        '📦 IMPORT - Traitement par paquets activé',
                                        `-- Fichier volumineux: ${fileSizeMB}MB, ~${lineCount} lignes`,
                                        `Traitement par paquets de 1000 lignes pour éviter les erreurs de quota`,
                                        null
                                    );
                                    
                                    // Mettre à jour l'interface pour indiquer le traitement par paquets
                                    mettreAJourProgression(15, 'Traitement par paquets', `Fichier volumineux (${fileSizeMB}MB) - Traitement optimisé`);
                                    
                                    donnees = await parseCSVByBatches(e.target.result, 1000, (progress) => {
                                        // Callback de progression
                                        const progressPercent = 15 + (progress.progress * 0.3); // 15% à 45%
                                        mettreAJourProgression(
                                            progressPercent, 
                                            `Paquet ${progress.batchIndex}/${progress.totalBatches}`, 
                                            `${progress.totalProcessed}/${progress.totalLines} lignes traitées (${progress.progress}%)`
                                        );
                                        
                                        console.log(`📦 Paquet ${progress.batchIndex}/${progress.totalBatches}: ${progress.batchSize} lignes, Total: ${progress.totalProcessed}/${progress.totalLines} (${progress.progress}%)`);
                                        
                                        return Promise.resolve();
                                    });
                                    
                                    console.log(`✅ Traitement par paquets terminé: ${donnees.totalLignes} lignes en ${donnees.totalBatches} paquets`);
                                    
                                } else {
                                    console.log('📄 Fichier de taille normale - Traitement standard');
                                    donnees = parseCSV(e.target.result);
                                }
                                
                            } catch (csvError) {
                                ajouterRequeteSQL(
                                    '❌ IMPORT - Erreur parsing CSV',
                                    `-- Erreur lors du parsing CSV: ${csvError.message}`,
                                    `Fichier: ${window.fichierCourant.name}, Taille: ${e.target.result?.length || 0} caractères`,
                                    csvError.message
                                );
                                throw csvError;
                            }
                            break;
                        case 'xlsx':
                            console.log('🔍 DEBUG - Parsing XLSX...');
                            try {
                                donnees = parseXLSX(e.target.result);
                                console.log('🔍 DEBUG - Résultat parseXLSX:', donnees);
                            } catch (xlsxError) {
                                ajouterRequeteSQL(
                                    '❌ IMPORT - Erreur parsing Excel',
                                    `-- Erreur lors du parsing Excel: ${xlsxError.message}`,
                                    `Fichier: ${window.fichierCourant.name}, Taille: ${e.target.result?.byteLength || 0} bytes`,
                                    xlsxError.message
                                );
                                throw xlsxError;
                            }
                            break;
                        default:
                            const formatError = `Format de fichier non supporté: ${extension}`;
                            ajouterRequeteSQL(
                                '❌ IMPORT - Format non supporté',
                                `-- Format de fichier non reconnu: .${extension}`,
                                `Fichier: ${window.fichierCourant.name}, Formats supportés: CSV, XLSX, JSON`,
                                formatError
                            );
                            throw new Error(formatError);
                    }
                } catch (parseError) {
                    // Erreur déjà tracée dans les catch spécifiques
                    throw parseError;
                }

                console.log('✅ Import réussi:', donnees);
                console.log('🔍 DEBUG - Structure données:', {
                    hasDonnees: !!donnees?.donnees,
                    isArray: Array.isArray(donnees?.donnees),
                    length: donnees?.donnees?.length || 0,
                    hasHeaders: !!donnees?.headers
                });
                
                // Validation des données importées
                try {
                    if (!donnees) {
                        throw new Error('Aucune donnée retournée par le parser');
                    }
                    
                    if (!donnees.donnees || !Array.isArray(donnees.donnees)) {
                        throw new Error('Structure de données invalide: propriété "donnees" manquante ou non-array');
                    }
                    
                    if (donnees.donnees.length === 0) {
                        throw new Error('Fichier vide: aucune ligne de données trouvée');
                    }
                    
                    if (!donnees.headers || !Array.isArray(donnees.headers) || donnees.headers.length === 0) {
                        throw new Error('En-têtes manquants ou invalides');
                    }
                    
                } catch (validationError) {
                    ajouterRequeteSQL(
                        '❌ IMPORT - Validation données échouée',
                        `-- Erreur de validation post-parsing: ${validationError.message}`,
                        `Fichier: ${window.fichierCourant.name}, Structure reçue: ${JSON.stringify(Object.keys(donnees || {})).substring(0, 100)}`,
                        validationError.message
                    );
                    throw validationError;
                }
                
                // TRACE IMPORT: Parsing réussi
                const nbLignesImport = Array.isArray(donnees?.donnees) ? donnees.donnees.length : 0;
                const formatImport = donnees?.format || extension.toUpperCase();
                ajouterRequeteSQL(
                    '📊 IMPORT - Parsing réussi',
                    `-- Fichier parsé avec succès: ${formatImport}`,
                    `${nbLignesImport} lignes importées`,
                    null
                );
                
                if (donnees?.headers) {
                    ajouterRequeteSQL(
                        '🏷️ IMPORT - Colonnes détectées',
                        `-- Colonnes: [${donnees.headers.join(', ')}]`,
                        null,
                        null
                    );
                }
                
                // Sauvegarder les données traitées avec vérification
                try {
                    if (!window) {
                        throw new Error('Objet window non disponible');
                    }
                    
                    window.donneesImportees = donnees;
                    
                    // Vérification de la sauvegarde
                    if (!window.donneesImportees || window.donneesImportees !== donnees) {
                        throw new Error('Échec de la sauvegarde des données dans window.donneesImportees');
                    }
                    
                } catch (saveError) {
                    ajouterRequeteSQL(
                        '❌ IMPORT - Erreur sauvegarde données',
                        `-- Erreur lors de la sauvegarde en mémoire: ${saveError.message}`,
                        `Tentative de sauvegarde de ${nbLignesImport} lignes`,
                        saveError.message
                    );
                    throw saveError;
                }
                
                // Import terminé - pas d'ajout au dump (réservé aux erreurs uniquement)
                
                // TRACE IMPORT: Finalisation
                const timestampImportFin = new Date().toISOString();
                const dureeImport = new Date(timestampImportFin) - new Date(timestampImportDebut);
                ajouterRequeteSQL(
                    '🎯 IMPORT - Processus terminé',
                    `-- FIN IMPORT à ${timestampImportFin} (durée: ${dureeImport}ms)`,
                    `${nbLignesImport} lignes importées avec succès`,
                    null
                );
                
                // Marquer l'import comme terminé
                mettreAJourProgression(50, 'Import terminé', 'Données importées avec succès');
                definirEtatIndicateur('import-status', 'completed');
                
                setTimeout(() => resolve(donnees), 500);
                
            } catch (error) {
                const errorMsg = `Erreur lors de l'import: ${error.message}`;
                
                // TRACE IMPORT: Erreur détaillée
                const timestampErreurImport = new Date().toISOString();
                ajouterRequeteSQL(
                    '❌ IMPORT - Erreur critique',
                    `-- EXCEPTION IMPORT à ${timestampErreurImport}`,
                    `Type: ${error.constructor.name}, Message: ${error.message}`,
                    error.message
                );
                
                ajouterRequeteSQL(
                    '🔍 IMPORT - Diagnostic erreur',
                    `-- Stack trace: ${error.stack ? error.stack.substring(0, 200) : 'N/A'}`,
                    `Fichier: ${window.fichierCourant ? window.fichierCourant.name : 'N/A'}`,
                    null
                );
                
                // Mise à jour interface
                definirEtatIndicateur('import-status', 'error');
                mettreAJourProgression(25, 'Erreur d\'import', error.message);
                
                YesDataUtils.showNotification(errorMsg, 'error');
                ajouterErreurAuDump('Import de données', errorMsg);
                reject(new Error(errorMsg));
            }
        };

        reader.onerror = function(event) {
            const errorMsg = 'Erreur de lecture du fichier';
            
            // TRACE IMPORT: Erreur de lecture
            const timestampErreurLecture = new Date().toISOString();
            ajouterRequeteSQL(
                '❌ IMPORT - Erreur lecture fichier',
                `-- ERREUR FileReader à ${timestampErreurLecture}`,
                `Fichier: ${window.fichierCourant ? window.fichierCourant.name : 'N/A'}, Taille: ${window.fichierCourant ? window.fichierCourant.size : 'N/A'}`,
                errorMsg
            );
            
            ajouterRequeteSQL(
                '🔍 IMPORT - Détails erreur lecture',
                `-- Event: ${event ? JSON.stringify(event).substring(0, 100) : 'N/A'}`,
                `Type fichier: ${window.fichierCourant ? window.fichierCourant.type : 'N/A'}`,
                null
            );
            
            // Mise à jour interface
            definirEtatIndicateur('import-status', 'error');
            mettreAJourProgression(10, 'Erreur de lecture', errorMsg);
            
            YesDataUtils.showNotification(errorMsg, 'error');
            ajouterErreurAuDump('Lecture de fichier', errorMsg);
            reject(new Error(errorMsg));
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
        
        // EFFACER LE DUMP ET COMMENCER UN NOUVEAU TRAÇAGE
        effacerDumpSQL();
        
        // TRACE 1: Début de validation avec contexte complet
        const timestampDebut = new Date().toISOString();
        ajouterRequeteSQL(
            '🔍 VALIDATION - Début du processus',
            `-- DÉBUT VALIDATION WinPharma à ${timestampDebut}`,
            `Processus: ${window.fichierCourant ? window.fichierCourant.name : 'Fichier non défini'}`,
            null
        );
        
        // TRACE 1.1: Vérification des prérequis
        const prerequisOK = !!(window.fichierCourant && window.donneesImportees);
        ajouterRequeteSQL(
            '✅ VALIDATION - Vérification prérequis',
            `-- Prérequis: fichierCourant=${!!window.fichierCourant}, donneesImportees=${!!window.donneesImportees}`,
            prerequisOK ? 'Tous les prérequis sont OK' : 'ERREUR: Prérequis manquants',
            prerequisOK ? null : 'Prérequis manquants pour la validation'
        );
        
        if (!prerequisOK) {
            const erreurPrerequis = 'Prérequis manquants: ' + 
                (!window.fichierCourant ? 'fichierCourant manquant ' : '') +
                (!window.donneesImportees ? 'donneesImportees manquant' : '');
            ajouterRequeteSQL(
                '❌ VALIDATION - Échec prérequis',
                `-- ERREUR: ${erreurPrerequis}`,
                null,
                erreurPrerequis
            );
        }
        
        // TRACE 2: Analyse détaillée du fichier
        let infoFichier;
        try {
            infoFichier = {
                nom: window.fichierCourant.name,
                taille: window.fichierCourant.size,
                type: window.fichierCourant.type,
                extension: window.fichierCourant.name.split('.').pop().toLowerCase(),
                lastModified: window.fichierCourant.file ? new Date(window.fichierCourant.file.lastModified).toISOString() : 'N/A'
            };
            
            ajouterRequeteSQL(
                '📁 VALIDATION - Analyse du fichier',
                `-- Fichier: ${infoFichier.nom}`,
                `Taille: ${infoFichier.taille} bytes, Type: ${infoFichier.type}, Extension: ${infoFichier.extension}`,
                null
            );
            
            ajouterRequeteSQL(
                '📅 VALIDATION - Métadonnées fichier',
                `-- Dernière modification: ${infoFichier.lastModified}`,
                `Fichier analysé avec succès`,
                null
            );
            
        } catch (error) {
            ajouterRequeteSQL(
                '❌ VALIDATION - Erreur analyse fichier',
                `-- ERREUR lors de l'analyse du fichier: ${error.message}`,
                null,
                error.message
            );
            infoFichier = { nom: 'ERREUR', taille: 0, type: 'ERREUR', extension: 'ERREUR' };
        }
        
        // TRACE 3: Analyse détaillée des données importées
        let nbLignes, nbColonnes, formatDetecte, donneesValides = true;
        let erreursAnalyse = [];
        
        try {
            // Vérification de l'existence des données
            if (!window.donneesImportees) {
                erreursAnalyse.push('window.donneesImportees est null/undefined');
                donneesValides = false;
            }
            
            // Analyse du format
            formatDetecte = window.donneesImportees?.format || 'Format non spécifié';
            ajouterRequeteSQL(
                '🔍 VALIDATION - Détection format',
                `-- Format détecté: ${formatDetecte}`,
                window.donneesImportees?.separator ? `Séparateur: ${window.donneesImportees.separator}` : 'Séparateur non spécifié',
                null
            );
            
            // Analyse des lignes
            if (window.donneesImportees?.donnees) {
                if (Array.isArray(window.donneesImportees.donnees)) {
                    nbLignes = window.donneesImportees.donnees.length;
                    ajouterRequeteSQL(
                        '📊 VALIDATION - Analyse lignes',
                        `-- Nombre de lignes: ${nbLignes}`,
                        nbLignes > 0 ? `${nbLignes} lignes de données trouvées` : 'ATTENTION: Aucune ligne de données',
                        nbLignes === 0 ? 'Fichier vide ou mal parsé' : null
                    );
                } else {
                    erreursAnalyse.push('donnees n\'est pas un tableau');
                    nbLignes = 0;
                    donneesValides = false;
                }
            } else {
                erreursAnalyse.push('Propriété donnees manquante');
                nbLignes = 0;
                donneesValides = false;
            }
            
            // Analyse des colonnes
            if (window.donneesImportees?.headers) {
                if (Array.isArray(window.donneesImportees.headers)) {
                    nbColonnes = window.donneesImportees.headers.length;
                    ajouterRequeteSQL(
                        '🏷️ VALIDATION - Analyse colonnes',
                        `-- Nombre de colonnes: ${nbColonnes}`,
                        nbColonnes > 0 ? `${nbColonnes} colonnes détectées` : 'ATTENTION: Aucune colonne',
                        nbColonnes === 0 ? 'Headers vides' : null
                    );
                    
                    // Détail des colonnes
                    const colonnesStr = window.donneesImportees.headers.join(', ');
                    ajouterRequeteSQL(
                        '📋 VALIDATION - Structure des colonnes',
                        `-- Colonnes: [${colonnesStr}]`,
                        `Structure analysée avec succès`,
                        null
                    );
                } else {
                    erreursAnalyse.push('headers n\'est pas un tableau');
                    nbColonnes = 0;
                    donneesValides = false;
                }
            } else {
                erreursAnalyse.push('Propriété headers manquante');
                nbColonnes = 0;
                donneesValides = false;
            }
            
            // Résumé de l'analyse
            ajouterRequeteSQL(
                donneesValides ? '✅ VALIDATION - Analyse données OK' : '❌ VALIDATION - Analyse données ÉCHEC',
                `-- Résumé: Format=${formatDetecte}, Lignes=${nbLignes}, Colonnes=${nbColonnes}`,
                donneesValides ? 'Données valides pour traitement' : `Erreurs: ${erreursAnalyse.join(', ')}`,
                donneesValides ? null : erreursAnalyse.join('; ')
            );
            
        } catch (error) {
            ajouterRequeteSQL(
                '❌ VALIDATION - Erreur analyse données',
                `-- EXCEPTION lors de l'analyse: ${error.message}`,
                `Stack: ${error.stack?.substring(0, 100)}...`,
                error.message
            );
            donneesValides = false;
            nbLignes = 0;
            nbColonnes = 0;
            formatDetecte = 'ERREUR';
        }
        
        // TRACE 4: Adaptation format WinPharma
        let donneesAdaptees = window.donneesImportees;
        
        if (formatDetecte === 'CSV WinPharma') {
            ajouterRequeteSQL(
                '🔄 VALIDATION - Adaptation format WinPharma',
                `-- Adaptation des données au format WinPharma`,
                `Format source détecté: ${formatDetecte}`,
                null
            );
            
            // Adapter la structure pour WinPharma
            donneesAdaptees = {
                ...window.donneesImportees,
                format: 'CSV WinPharma',
                structure: 'ventes_pharmacie',
                colonnesWinPharma: window.donneesImportees?.headers || [],
                typesDonnees: {
                    'Date': 'date',
                    'Heure': 'time', 
                    'Dossier': 'string',
                    'Type': 'string',
                    'Operateur': 'number',
                    'Client': 'string',
                    'Montant': 'decimal',
                    'Dif./EnCom., EUR': 'decimal'
                }
            };
            
            ajouterRequeteSQL(
                '✅ VALIDATION - Format WinPharma adapté',
                `-- Structure adaptée pour les ventes de pharmacie`,
                `Colonnes WinPharma: ${donneesAdaptees.colonnesWinPharma.join(', ')}`,
                null
            );
        }
        
        // Préparer les données pour localStorage avec structure WinPharma
        let donneesAuStockage = {
            fichier: {
                nom: infoFichier.nom,
                taille: infoFichier.taille,
                type: infoFichier.type,
                dateImport: timestampDebut,
                formatSource: 'WinPharma'
            },
            donnees: donneesAdaptees,
            metadata: {
                nombreLignes: nbLignes,
                nombreColonnes: nbColonnes,
                format: formatDetecte,
                structure: 'ventes_pharmacie',
                colonnes: donneesAdaptees?.headers || [],
                colonnesWinPharma: donneesAdaptees?.colonnesWinPharma || [],
                typesDonnees: donneesAdaptees?.typesDonnees || {},
                version: 'v1.0.0-winpharma-frequentation'
            }
        };
        
        try {
            // TRACE 5: Préparation sauvegarde localStorage
            ajouterRequeteSQL(
                '💾 VALIDATION - Préparation localStorage',
                `-- Préparation des données pour localStorage (clé: winpharma_ventes)`,
                `Données à sauvegarder: ${Object.keys(donneesAuStockage).join(', ')}`,
                null
            );
            
            // Vérification de la disponibilité de localStorage
            let localStorageDisponible = false;
            try {
                localStorage.setItem('test_validation', 'test');
                localStorage.removeItem('test_validation');
                localStorageDisponible = true;
                ajouterRequeteSQL(
                    '✅ VALIDATION - Test localStorage',
                    `-- localStorage disponible et fonctionnel`,
                    null,
                    null
                );
            } catch (testError) {
                ajouterRequeteSQL(
                    '❌ VALIDATION - Test localStorage ÉCHEC',
                    `-- localStorage non disponible: ${testError.message}`,
                    null,
                    testError.message
                );
                throw new Error(`localStorage non disponible: ${testError.message}`);
            }
            
            // Sérialisation JSON avec vérification de taille
            let donneesJson, tailleJson;
            try {
                ajouterRequeteSQL(
                    '🔄 VALIDATION - Sérialisation JSON',
                    `-- Début sérialisation des données`,
                    `Lignes à sérialiser: ${nbLignes}, Colonnes: ${nbColonnes}`,
                    null
                );
                
                // Gestion spéciale pour les fichiers traités par paquets
                if (donneesAdaptees.processedInBatches) {
                    ajouterRequeteSQL(
                        '📦 VALIDATION - Mode paquets détecté',
                        `-- Fichier traité par paquets: ${donneesAdaptees.totalBatches} paquets de ${donneesAdaptees.batchSize} lignes`,
                        `Mode optimisé pour gros fichiers - Sauvegarde allégée`,
                        null
                    );
                    
                    // Pour les gros fichiers, on sauvegarde seulement les métadonnées et un échantillon
                    const echantillonTaille = Math.min(100, donneesAdaptees.donnees.length);
                    const donneesEchantillon = donneesAdaptees.donnees.slice(0, echantillonTaille);
                    
                    donneesAuStockage = {
                        fichier: {
                            nom: infoFichier.nom,
                            taille: infoFichier.taille,
                            type: infoFichier.type,
                            dateImport: timestampDebut,
                            formatSource: 'WinPharma',
                            processedInBatches: true,
                            totalBatches: donneesAdaptees.totalBatches,
                            batchSize: donneesAdaptees.batchSize
                        },
                        donnees: donneesEchantillon, // Seulement un échantillon
                        metadata: {
                            nombreLignes: nbLignes,
                            nombreColonnes: nbColonnes,
                            format: formatDetecte,
                            structure: 'ventes_pharmacie',
                            colonnes: donneesAdaptees?.headers || [],
                            colonnesWinPharma: donneesAdaptees?.colonnesWinPharma || [],
                            typesDonnees: donneesAdaptees?.typesDonnees || {},
                            version: 'v1.0.0-winpharma-frequentation',
                            processedInBatches: true,
                            echantillonTaille: echantillonTaille,
                            totalLignesOriginales: donneesAdaptees.totalLignes
                        }
                    };
                    
                    ajouterRequeteSQL(
                        '💾 VALIDATION - Sauvegarde optimisée',
                        `-- Sauvegarde allégée: métadonnées + échantillon de ${echantillonTaille} lignes`,
                        `Total original: ${donneesAdaptees.totalLignes} lignes, Sauvegardé: ${echantillonTaille} lignes`,
                        null
                    );
                    
                } else {
                    // Traitement normal pour les petits fichiers
                    const tailleEstimee = JSON.stringify(donneesAuStockage).length;
                    const tailleMo = (tailleEstimee / (1024 * 1024)).toFixed(2);
                    
                    ajouterRequeteSQL(
                        '📊 VALIDATION - Taille estimée',
                        `-- Taille JSON estimée: ${tailleEstimee} bytes (${tailleMo} MB)`,
                        tailleEstimee > 10485760 ? 'ATTENTION: Fichier volumineux (>10MB)' : 'Taille acceptable',
                        null
                    );
                    
                    // Limite de sécurité localStorage (généralement 5-10MB)
                    if (tailleEstimee > 10485760) { // 10MB
                        ajouterRequeteSQL(
                            '⚠️ VALIDATION - Fichier volumineux détecté',
                            `-- ALERTE: Taille ${tailleMo}MB > 10MB (limite localStorage)`,
                            `Risque élevé d'échec de sauvegarde - Quota localStorage dépassé`,
                            `Fichier trop volumineux (${tailleMo}MB) - Limite localStorage dépassée`
                        );
                        
                        ajouterRequeteSQL(
                            '💡 VALIDATION - Actions recommandées IMMÉDIATEMENT',
                            `-- SOLUTIONS POUR CONTINUER:`,
                            `1. STOP: Utilisez un fichier plus petit (<5MB)
2. DIVISER: Coupez votre fichier CSV en plusieurs parties
3. FILTRER: Gardez seulement les lignes récentes (ex: dernier mois)
4. COLONNES: Supprimez les colonnes non essentielles du CSV
5. TEST: Créez un fichier de 100-1000 lignes pour tester`,
                            `Solutions concrètes pour résoudre le problème de taille`
                        );
                        
                        ajouterErreurAuDump('Fichier trop volumineux', `Le fichier WinPharma (${tailleMo}MB) va échouer car il dépasse la limite localStorage (5-10MB max). Utilisez un fichier plus petit ou divisez-le.`);
                    }
                }
                
                donneesJson = JSON.stringify(donneesAuStockage);
                tailleJson = new Blob([donneesJson]).size;
                
                ajouterRequeteSQL(
                    '✅ VALIDATION - Sérialisation OK',
                    `-- JSON généré: ${tailleJson} bytes (${(tailleJson / (1024 * 1024)).toFixed(2)} MB)`,
                    `Sérialisation réussie`,
                    null
                );
                
            } catch (jsonError) {
                const errorMsg = `Erreur sérialisation JSON: ${jsonError.message}`;
                ajouterRequeteSQL(
                    '❌ VALIDATION - Erreur sérialisation JSON',
                    `-- ERREUR JSON.stringify: ${jsonError.message}`,
                    `Type: ${jsonError.constructor.name}, Stack: ${jsonError.stack ? jsonError.stack.substring(0, 100) : 'N/A'}`,
                    jsonError.message
                );
                ajouterErreurAuDump('Sérialisation JSON', errorMsg);
                YesDataUtils.showNotification(errorMsg, 'error');
                throw new Error(errorMsg);
            }
            
            // Sauvegarde effective
            try {
                ajouterRequeteSQL(
                    '💾 VALIDATION - Sauvegarde en cours',
                    `-- localStorage.setItem('winpharma_ventes', ...) - ${tailleJson} bytes`,
                    null,
                    null
                );
                
                localStorage.setItem('winpharma_ventes', donneesJson);
                
                // Vérification de la sauvegarde
                const verification = localStorage.getItem('winpharma_ventes');
                if (verification && verification.length === donneesJson.length) {
                    ajouterRequeteSQL(
                        '✅ VALIDATION - Sauvegarde vérifiée',
                        `-- Données sauvegardées et vérifiées (${tailleJson} bytes)`,
                        `Fichier: ${infoFichier.nom}, Lignes: ${nbLignes}, Vérification: OK`,
                        null
                    );
                } else {
                    throw new Error('Vérification de sauvegarde échouée');
                }
                
            } catch (saveError) {
                const errorMsg = `Erreur sauvegarde localStorage: ${saveError.message}`;
                ajouterRequeteSQL(
                    '❌ VALIDATION - Erreur sauvegarde localStorage',
                    `-- ERREUR localStorage.setItem: ${saveError.message}`,
                    `Type: ${saveError.constructor.name}, Taille tentée: ${tailleJson} bytes`,
                    saveError.message
                );
                
                // Diagnostic spécifique selon le type d'erreur
                if (saveError.message.includes('quota') || saveError.message.includes('storage') || saveError.name === 'QuotaExceededError') {
                    const tailleMB = (tailleJson / (1024 * 1024)).toFixed(2);
                    
                    ajouterRequeteSQL(
                        '💾 VALIDATION - Diagnostic quota localStorage',
                        `-- QUOTA LOCALSTORAGE DÉPASSÉ - Fichier trop volumineux`,
                        `Taille fichier: ${tailleMB}MB, Limite navigateur: 5-10MB max`,
                        `Fichier trop volumineux (${tailleMB}MB) pour localStorage`
                    );
                    
                    ajouterRequeteSQL(
                        '💡 VALIDATION - Solutions recommandées',
                        `-- SOLUTIONS POUR FICHIERS VOLUMINEUX:`,
                        `1. Diviser le fichier en plusieurs parties plus petites (<5MB)
2. Utiliser un fichier avec moins de lignes pour les tests
3. Filtrer les données avant import (garder seulement les colonnes nécessaires)
4. Compresser les données avant stockage`,
                        `Solutions disponibles pour gérer les gros fichiers`
                    );
                    
                    ajouterErreurAuDump('Fichier trop volumineux', `Le fichier WinPharma (${tailleMB}MB) dépasse la limite de stockage du navigateur (5-10MB max). Utilisez un fichier plus petit ou divisez-le en plusieurs parties.`);
                } else {
                    ajouterErreurAuDump('Sauvegarde localStorage', errorMsg);
                }
                
                YesDataUtils.showNotification(errorMsg, 'error');
                throw saveError;
            }
            
            console.log('✅ Données sauvegardées en localStorage');
            
            // TRACE 7: Génération requête SQL adaptée WinPharma
            try {
                ajouterRequeteSQL(
                    '🔧 VALIDATION - Début génération SQL WinPharma',
                    `-- Génération des requêtes pour structure WinPharma`,
                    null,
                    null
                );
                
                // Créer la table WinPharma si nécessaire
                const createTableWinPharma = `
                    CREATE TABLE IF NOT EXISTS winpharma_ventes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        date_vente DATE,
                        heure_vente TIME,
                        dossier VARCHAR(50),
                        type_operation VARCHAR(100),
                        operateur INTEGER,
                        client VARCHAR(255),
                        montant DECIMAL(10,2),
                        difference_encom DECIMAL(10,2),
                        fichier_source VARCHAR(255),
                        date_import DATETIME,
                        validated BOOLEAN DEFAULT FALSE
                    )
                `;
                
                ajouterRequeteSQL(
                    '🏗️ VALIDATION - Création table WinPharma',
                    createTableWinPharma,
                    `Table adaptée aux ventes de pharmacie`,
                    null
                );
                
                // Requête de validation adaptée
                const requeteValidationTemplate = `UPDATE winpharma_ventes SET validated = ?, metadata = ? WHERE fichier_source = ?`;
                const metadataJson = JSON.stringify(donneesAuStockage.metadata);
            const valeursValidation = [
                true,
                    metadataJson,
                donneesAuStockage.fichier.nom
            ];
                
                ajouterRequeteSQL(
                    '📋 VALIDATION - Template SQL',
                    requeteValidationTemplate,
                    `Template préparé avec 3 paramètres`,
                    null
                );
                
                ajouterRequeteSQL(
                    '📊 VALIDATION - Valeurs SQL',
                    `-- Valeur 1 (validated): ${valeursValidation[0]}`,
                    `Valeur 2 (metadata): ${metadataJson.substring(0,100)}${metadataJson.length > 100 ? '...' : ''}`,
                    null
                );
                
                ajouterRequeteSQL(
                    '📁 VALIDATION - Fichier cible',
                    `-- Valeur 3 (fichier): "${valeursValidation[2]}"`,
                    `Fichier à valider dans la base`,
                    null
                );
                
                // Construction de la requête complète
                let requeteValidationComplete;
                try {
                    requeteValidationComplete = construireRequeteSQL(requeteValidationTemplate, valeursValidation);
                    ajouterRequeteSQL(
                        '✅ VALIDATION - Construction SQL OK',
                        `-- Requête construite avec succès`,
                        `Longueur: ${requeteValidationComplete.length} caractères`,
                        null
                    );
                } catch (constructError) {
                    ajouterRequeteSQL(
                        '❌ VALIDATION - Erreur construction SQL',
                        `-- ERREUR construireRequeteSQL: ${constructError.message}`,
                        null,
                        constructError.message
                    );
                    throw constructError;
                }
                
                // TRACE 8: Requête SQL complète
                ajouterRequeteSQL(
                    '📝 VALIDATION - Requête SQL finale',
                    requeteValidationComplete.substring(0, 500) + (requeteValidationComplete.length > 500 ? '...' : ''),
                    `Validation du fichier ${infoFichier.nom}`,
                    null
                );
                
            } catch (sqlError) {
                const errorMsg = `Erreur génération SQL: ${sqlError.message}`;
                ajouterRequeteSQL(
                    '❌ VALIDATION - Erreur génération SQL',
                    `-- EXCEPTION génération SQL: ${sqlError.message}`,
                    `Type: ${sqlError.constructor.name}, Stack: ${sqlError.stack ? sqlError.stack.substring(0, 100) : 'N/A'}`,
                    sqlError.message
                );
                ajouterErreurAuDump('Génération SQL', errorMsg);
                YesDataUtils.showNotification(errorMsg, 'error');
                throw sqlError;
            }
            
                            // TRACE 8.5: Génération requêtes d'insertion WinPharma
                if (donneesAdaptees?.donnees && Array.isArray(donneesAdaptees.donnees)) {
                    ajouterRequeteSQL(
                        '📊 VALIDATION - Génération insertions WinPharma',
                        `-- Génération de ${donneesAdaptees.donnees.length} requêtes INSERT`,
                        null,
                        null
                    );
                    
                    // Générer quelques exemples d'insertion
                    const exemplesInsertion = donneesAdaptees.donnees.slice(0, 3);
                    exemplesInsertion.forEach((ligne, index) => {
                        const insertTemplate = `
                            INSERT INTO winpharma_ventes 
                            (date_vente, heure_vente, dossier, type_operation, operateur, client, montant, difference_encom, fichier_source, date_import) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        
                        const valeurs = [
                            ligne.Date || null,
                            ligne.Heure || null,
                            ligne.Dossier || null,
                            ligne.Type || null,
                            ligne.Operateur || null,
                            ligne.Client || null,
                            ligne.Montant || null,
                            ligne['Dif./EnCom., EUR'] || null,
                            donneesAuStockage.fichier.nom,
                            timestampDebut
                        ];
                        
                        ajouterRequeteSQL(
                            `💾 VALIDATION - Exemple insertion ${index + 1}`,
                            insertTemplate.trim(),
                            `Valeurs: [${valeurs.map(v => v ? `"${v}"` : 'NULL').join(', ')}]`,
                            null
                        );
                    });
                    
                    if (donneesAdaptees.donnees.length > 3) {
                        ajouterRequeteSQL(
                            '📊 VALIDATION - Insertions restantes',
                            `-- ... et ${donneesAdaptees.donnees.length - 3} autres requêtes INSERT similaires`,
                            `Total: ${donneesAdaptees.donnees.length} lignes à insérer`,
                            null
                        );
                    }
                }
                
                                // Validation terminée - pas d'ajout au dump (réservé aux erreurs uniquement)
            
            // TRACE 10: Finalisation
            setTimeout(() => {
                const timestampFin = new Date().toISOString();
                const duree = new Date(timestampFin) - new Date(timestampDebut);
                
                ajouterRequeteSQL(
                    '🎯 VALIDATION - Finalisation',
                    `-- Début finalisation du processus`,
                    null,
                    null
                );
                
                // Mise à jour de l'interface
                try {
                definirEtatIndicateur('validation-status', 'completed');
                    ajouterRequeteSQL(
                        '✅ VALIDATION - LED mise à jour',
                        `-- LED validation passée en 'completed'`,
                        null,
                        null
                    );
                } catch (ledError) {
                    ajouterRequeteSQL(
                        '❌ VALIDATION - Erreur LED',
                        `-- ERREUR mise à jour LED: ${ledError.message}`,
                        null,
                        ledError.message
                    );
                }
                
                // Mise à jour de la progression
                try {
                mettreAJourProgression(100, 'Validation terminée', 'Données sauvegardées avec succès');
                    ajouterRequeteSQL(
                        '✅ VALIDATION - Progression mise à jour',
                        `-- Progression mise à 100%`,
                        null,
                        null
                    );
                } catch (progressError) {
                    ajouterRequeteSQL(
                        '❌ VALIDATION - Erreur progression',
                        `-- ERREUR mise à jour progression: ${progressError.message}`,
                        null,
                        progressError.message
                    );
                }
                
                // Résumé final WinPharma
                ajouterRequeteSQL(
                    '🎯 VALIDATION - Processus WinPharma terminé avec succès',
                    `-- FIN VALIDATION WINPHARMA à ${timestampFin} (durée: ${duree}ms)`,
                    `Fichier: ${infoFichier.nom}, Lignes: ${nbLignes}, Taille: ${tailleJson} bytes, Structure: ventes_pharmacie`,
                    null
                );
                
                // Statistiques WinPharma
                if (donneesAdaptees?.donnees) {
                    const stats = {
                        totalVentes: donneesAdaptees.donnees.length,
                        montantTotal: donneesAdaptees.donnees.reduce((sum, ligne) => {
                            const montant = parseFloat(ligne.Montant) || 0;
                            return sum + montant;
                        }, 0),
                        operateursUniques: [...new Set(donneesAdaptees.donnees.map(l => l.Operateur).filter(Boolean))].length,
                        typesOperations: [...new Set(donneesAdaptees.donnees.map(l => l.Type).filter(Boolean))].length
                    };
                    
                    ajouterRequeteSQL(
                        '📊 VALIDATION - Statistiques WinPharma',
                        `-- Statistiques des ventes de pharmacie`,
                        `Ventes: ${stats.totalVentes}, Montant total: ${stats.montantTotal.toFixed(2)}€, Opérateurs: ${stats.operateursUniques}, Types: ${stats.typesOperations}`,
                        null
                    );
                }
                
                resolve();
            }, 500);
            
        } catch (error) {
            // TRACE 11: Gestion d'erreur détaillée
            const timestampErreur = new Date().toISOString();
            const dureeAvantErreur = new Date(timestampErreur) - new Date(timestampDebut);
            
            ajouterRequeteSQL(
                '❌ VALIDATION - ERREUR CRITIQUE',
                `-- EXCEPTION à ${timestampErreur} (après ${dureeAvantErreur}ms)`,
                `Type: ${error.constructor.name}, Message: ${error.message}`,
                null
            );
            
            // Détails de l'erreur
            ajouterRequeteSQL(
                '🔍 VALIDATION - Détails erreur',
                `-- Message: ${error.message}`,
                `Stack: ${error.stack ? error.stack.substring(0, 200) + '...' : 'Stack non disponible'}`,
                error.message
            );
            
            // État du système au moment de l'erreur
            ajouterRequeteSQL(
                '📊 VALIDATION - État système',
                `-- localStorage disponible: ${typeof Storage !== 'undefined'}`,
                `window.fichierCourant: ${!!window.fichierCourant}, window.donneesImportees: ${!!window.donneesImportees}`,
                null
            );
            
            // Mise à jour de l'interface en cas d'erreur
            try {
                definirEtatIndicateur('validation-status', 'error');
                mettreAJourProgression(75, 'Erreur de validation', error.message);
                ajouterRequeteSQL(
                    '⚠️ VALIDATION - Interface mise à jour',
                    `-- LED passée en erreur, progression arrêtée`,
                    null,
                    null
                );
            } catch (uiError) {
                ajouterRequeteSQL(
                    '❌ VALIDATION - Erreur interface',
                    `-- Impossible de mettre à jour l'interface: ${uiError.message}`,
                    null,
                    uiError.message
                );
            }
            
            // Notifications
            console.error('❌ Erreur validation complète:', error);
            YesDataUtils.showNotification(`Erreur de validation: ${error.message}`, 'error');
            ajouterErreurAuDump('Validation complète', error.message);
            
            // Résumé d'échec WinPharma
            ajouterRequeteSQL(
                '💥 VALIDATION - Processus WinPharma échoué',
                `-- ÉCHEC VALIDATION WINPHARMA à ${timestampErreur}`,
                `Durée avant échec: ${dureeAvantErreur}ms, Format: ${formatDetecte}, Structure: ventes_pharmacie`,
                error.message
            );
            
            // Diagnostic spécifique WinPharma
            if (formatDetecte === 'CSV WinPharma') {
                ajouterRequeteSQL(
                    '🔍 VALIDATION - Diagnostic WinPharma',
                    `-- Diagnostic spécifique au format WinPharma`,
                    `Colonnes attendues: Date, Heure, Dossier, Type, Operateur, Client, Montant`,
                    null
                );
            }
            
            resolve(); // On continue même si la validation échoue
        }
    });
}

/**
 * Finaliser le processus
 */
function finaliserProcessus() {
    setTimeout(() => {
        masquerProgression();
        YesDataUtils.showNotification(`Fichier ${window.fichierCourant.name} traité avec succès`, 'success');
        
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
                YesDataUtils.showNotification(`Données chargées depuis l'onglet ${window.donneesImportees.ongletUtilise}: ${window.donneesImportees.feuilleActive}`, 'info');
            }
            if (window.donneesImportees.dateExtrait) {
                YesDataUtils.showNotification(`Date extraite: ${window.donneesImportees.dateExtrait}`, 'info');
            }
        }
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
        YesDataUtils.showNotification('Aucune donnée à effacer', 'info');
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
            YesDataUtils.showNotification('Données effacées avec succès', 'success');
            console.log('✅ SUCCÈS - Toutes les données ont été effacées');
            
        } else {
            throw new Error('Échec de l\'effacement des données');
        }
        
    } catch (error) {
        console.error('❌ ERREUR lors de l\'effacement:', error);
        console.error('❌ Stack trace:', error.stack);
        YesDataUtils.showNotification('Erreur lors de l\'effacement des données', 'error');
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
    console.log('🔍 DEBUG parseCSV - Début parsing CSV');
    
    const lignes = csvText.split('\n');
    console.log(`🔍 DEBUG parseCSV - Nombre de lignes: ${lignes.length}`);
    
    if (lignes.length === 0) {
        throw new Error('Fichier CSV vide');
    }
    
    // Utiliser point-virgule comme séparateur pour le format WinPharma
    const headersRaw = lignes[0].split(';');
    console.log('🔍 DEBUG parseCSV - Headers bruts:', headersRaw);
    
    // Mapping des colonnes selon les spécifications
    const columnMapping = {
        'Date': 'Date',
        'Heure': 'Heure', 
        'Dossier': 'Dossier',
        'Type': 'Type',
        'Opér.': 'Operateur',
        'Op�r.': 'Operateur', // Support pour l'encodage défaillant
        'Client': 'Client',
        'Mont., EUR': 'Montant',
        'Réglé, EUR': null, // Colonne ignorée
        'R�gl�, EUR': null, // Support pour l'encodage défaillant - colonne ignorée
        'Dif./EnCom., EUR': 'Dif./EnCom., EUR'
    };
    
    // Créer les headers finaux en appliquant le mapping
    const headers = [];
    const headerIndexes = [];
    
    headersRaw.forEach((header, index) => {
        const cleanHeader = header.trim().replace(/"/g, ''); // Nettoyer les guillemets
        const mappedHeader = columnMapping[cleanHeader];
        
        if (mappedHeader !== null) { // null = colonne ignorée
            headers.push(mappedHeader || cleanHeader);
            headerIndexes.push(index);
        }
    });
    
    console.log('🔍 DEBUG parseCSV - Headers finaux:', headers);
    console.log('🔍 DEBUG parseCSV - Index des colonnes utilisées:', headerIndexes);
    
    const donnees = [];
    
    for (let i = 1; i < lignes.length; i++) {
        const ligne = lignes[i].trim();
        if (ligne) {
            // Parser la ligne en tenant compte des guillemets
            const valeurs = parseCSVLine(ligne);
            
            if (valeurs.length > 0) {
            const objet = {};
                
                headerIndexes.forEach((originalIndex, newIndex) => {
                    const header = headers[newIndex];
                    let valeur = valeurs[originalIndex]?.trim() || '';
                    
                    // Nettoyer les guillemets
                    valeur = valeur.replace(/^"|"$/g, '');
                    
                    // Traitement spécial pour les montants (remplacer virgule par point)
                    if (header === 'Montant' || header.includes('EUR')) {
                        valeur = valeur.replace(',', '.');
                    }
                    
                    objet[header] = valeur;
                });
                
            donnees.push(objet);
            }
        }
    }
    
    console.log(`✅ parseCSV - ${donnees.length} lignes parsées avec succès`);
    console.log('🔍 DEBUG parseCSV - Exemple première ligne:', donnees[0]);
    
    return { 
        headers, 
        donnees, 
        totalLignes: donnees.length,
        format: 'CSV WinPharma',
        separator: ';'
    };
}

/**
 * Parse une ligne CSV en tenant compte des guillemets et des points-virgules
 * @param {string} ligne - Ligne CSV à parser
 * @returns {Array} Tableau des valeurs
 */
function parseCSVLine(ligne) {
    const valeurs = [];
    let valeurCourante = '';
    let dansGuillemets = false;
    
    for (let i = 0; i < ligne.length; i++) {
        const char = ligne[i];
        
        if (char === '"') {
            dansGuillemets = !dansGuillemets;
            valeurCourante += char;
        } else if (char === ';' && !dansGuillemets) {
            valeurs.push(valeurCourante);
            valeurCourante = '';
        } else {
            valeurCourante += char;
        }
    }
    
    // Ajouter la dernière valeur
    if (valeurCourante || valeurs.length > 0) {
        valeurs.push(valeurCourante);
    }
    
    return valeurs;
}

/**
 * Parser CSV par paquets pour gérer les gros fichiers
 * @param {string} csvText - Contenu du fichier CSV
 * @param {number} batchSize - Taille des paquets (défaut: 1000)
 * @param {Function} onBatchProcessed - Callback appelé pour chaque paquet traité
 * @returns {Promise<Object>} Données parsées avec métadonnées
 */
async function parseCSVByBatches(csvText, batchSize = 1000, onBatchProcessed = null) {
    console.log('🔍 DEBUG parseCSVByBatches - Début parsing CSV par paquets');
    
    const lignes = csvText.split('\n');
    console.log(`🔍 DEBUG parseCSVByBatches - Nombre total de lignes: ${lignes.length}`);
    
    if (lignes.length === 0) {
        throw new Error('Fichier CSV vide');
    }
    
    // Traiter les headers (même logique que parseCSV)
    const headersRaw = lignes[0].split(';');
    console.log('🔍 DEBUG parseCSVByBatches - Headers bruts:', headersRaw);
    
    const columnMapping = {
        'Date': 'Date',
        'Heure': 'Heure', 
        'Dossier': 'Dossier',
        'Type': 'Type',
        'Opér.': 'Operateur',
        'Op�r.': 'Operateur',
        'Client': 'Client',
        'Mont., EUR': 'Montant',
        'Réglé, EUR': null,
        'R�gl�, EUR': null,
        'Dif./EnCom., EUR': 'Dif./EnCom., EUR'
    };
    
    const headers = [];
    const headerIndexes = [];
    
    headersRaw.forEach((header, index) => {
        const cleanHeader = header.trim().replace(/"/g, '');
        const mappedHeader = columnMapping[cleanHeader];
        
        if (mappedHeader !== null) {
            headers.push(mappedHeader || cleanHeader);
            headerIndexes.push(index);
        }
    });
    
    console.log('🔍 DEBUG parseCSVByBatches - Headers finaux:', headers);
    
    // Traitement par paquets
    const totalDataLines = lignes.length - 1; // Exclure la ligne d'en-tête
    const totalBatches = Math.ceil(totalDataLines / batchSize);
    let totalProcessed = 0;
    let allData = [];
    
    console.log(`📦 Traitement par paquets: ${totalDataLines} lignes en ${totalBatches} paquets de ${batchSize}`);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startLine = 1 + (batchIndex * batchSize); // +1 pour ignorer les headers
        const endLine = Math.min(startLine + batchSize, lignes.length);
        
        console.log(`📦 Traitement paquet ${batchIndex + 1}/${totalBatches}: lignes ${startLine} à ${endLine - 1}`);
        
        const batchData = [];
        
        for (let i = startLine; i < endLine; i++) {
            const ligne = lignes[i].trim();
            if (ligne) {
                const valeurs = parseCSVLine(ligne);
                
                if (valeurs.length > 0) {
                    const objet = {};
                    
                    headerIndexes.forEach((originalIndex, newIndex) => {
                        const header = headers[newIndex];
                        let valeur = valeurs[originalIndex]?.trim() || '';
                        
                        valeur = valeur.replace(/^"|"$/g, '');
                        
                        if (header === 'Montant' || header.includes('EUR')) {
                            valeur = valeur.replace(',', '.');
                        }
                        
                        objet[header] = valeur;
                    });
                    
                    batchData.push(objet);
                }
            }
        }
        
        totalProcessed += batchData.length;
        allData = allData.concat(batchData);
        
        // Callback pour chaque paquet traité
        if (onBatchProcessed) {
            await onBatchProcessed({
                batchIndex: batchIndex + 1,
                totalBatches,
                batchSize: batchData.length,
                totalProcessed,
                totalLines: totalDataLines,
                progress: Math.round((totalProcessed / totalDataLines) * 100)
            });
        }
        
        // Petite pause pour ne pas bloquer l'interface
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    console.log(`✅ parseCSVByBatches - ${totalProcessed} lignes parsées en ${totalBatches} paquets`);
    
    return { 
        headers, 
        donnees: allData, 
        totalLignes: totalProcessed,
        format: 'CSV WinPharma',
        separator: ';',
        processedInBatches: true,
        batchSize,
        totalBatches
    };
}

/**
 * Parser Excel (.xlsx) en utilisant SheetJS
 * @param {ArrayBuffer} arrayBuffer - Contenu du fichier Excel
 * @returns {Object} Données parsées
 */
function parseXLSX(arrayBuffer) {
    try {
        console.log('🔍 DEBUG parseXLSX - Début parsing Excel');
        console.log('🔍 DEBUG parseXLSX - Type arrayBuffer:', typeof arrayBuffer);
        console.log('🔍 DEBUG parseXLSX - Taille arrayBuffer:', arrayBuffer?.byteLength);
        
        // Lire le fichier Excel avec SheetJS
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        console.log('🔍 DEBUG parseXLSX - Workbook créé:', !!workbook);
        
        console.log(`📊 Feuilles Excel disponibles: ${workbook.SheetNames.join(', ')}`);
        
        // Prendre l'onglet 2 si disponible, sinon l'onglet 1
        let targetSheetIndex = 1; // Onglet 2 (index 1)
        let targetSheetName;
        
        if (workbook.SheetNames.length > 1) {
            targetSheetName = workbook.SheetNames[targetSheetIndex];
            console.log(`📋 Utilisation de l'onglet 2: ${targetSheetName}`);
        } else {
            targetSheetIndex = 0;
            targetSheetName = workbook.SheetNames[targetSheetIndex];
            console.log(`📋 Utilisation de l'onglet 1: ${targetSheetName} (onglet 2 non disponible)`);
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
 * Définir l'état d'un indicateur LED (sans icônes)
 * @param {string} indicatorId - ID de l'indicateur
 * @param {string} state - État: 'inactive', 'active', 'completed', 'error'
 */
function definirEtatIndicateur(indicatorId, state) {
    const indicator = document.getElementById(indicatorId);
    if (!indicator) return;
    
    // Supprimer tous les états
    indicator.classList.remove('inactive', 'active', 'completed', 'error');
    
    // Ajouter le nouvel état
    indicator.classList.add(state);
    
    console.log(`🔄 Indicateur LED ${indicatorId}: ${state}`);
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
        content.classList.add('expanded');
        if (led) led.classList.add('active');
        if (arrow) arrow.classList.add('rotated');
    } else {
        content.classList.remove('expanded');
        if (led) led.classList.remove('active');
        if (arrow) arrow.classList.remove('rotated');
    }
    
    console.log(`📋 Section Overview: ${window.dumpData.estOuverte ? 'ouverte' : 'fermée'}`);
}

// Fonction de compatibilité pour l'ancienne section Dump
function toggleDumpSection() {
    toggleOverviewSection();
}

/**
 * Basculer l'affichage de la section Chargement
 */
function toggleChargementSection() {
    const content = document.getElementById('chargement-content');
    const led = document.getElementById('chargement-led');
    const arrow = document.getElementById('chargement-arrow');
    
    if (!content) return;
    
    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
        content.classList.remove('expanded');
        if (led) led.classList.remove('active');
        if (arrow) arrow.classList.remove('rotated');
    } else {
        content.classList.add('expanded');
        if (led) led.classList.add('active');
        if (arrow) arrow.classList.add('rotated');
    }
    
    console.log(`📁 Section Chargement: ${isExpanded ? 'fermée' : 'ouverte'}`);
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
        YesDataUtils.showNotification('Dump d\'insertion effacé', 'success');
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
            listElement.innerHTML = '<div class="dump-empty" id="import-dump-empty"><p>Aucune erreur détectée</p><p class="dump-empty-hint">Toutes les erreurs d\'import, validation et insertion DB apparaîtront ici avec détails techniques</p></div>';
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
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les erreurs ?')) {
        console.log('🗑️ Effacement du dump d\'erreurs');
        
        // Effacer la liste des erreurs
        const liste = document.getElementById('import-dump-list');
        if (liste) {
            liste.innerHTML = '<div class="dump-empty" id="import-dump-empty"><p>Aucune erreur détectée</p><p class="dump-empty-hint">Toutes les erreurs d\'import, validation et insertion DB apparaîtront ici avec détails techniques</p></div>';
        }
        
        // Réinitialiser le compteur
        const countElement = document.getElementById('import-dump-count');
        if (countElement) {
            countElement.textContent = '0';
        }
        
        YesDataUtils.showNotification('Dump d\'erreurs effacé', 'success');
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
        YesDataUtils.showNotification(`Erreur: ${error.message}`, 'error');
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
        YesDataUtils.showNotification('Base de données non initialisée. Veuillez recharger la page.', 'error');
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
        
        // Sauvegarder dans YesData_Summary
        sauvegarderDansHistorique(resultats);
        
        // Afficher les résultats
        afficherResultatsConsolidation(resultats);
        
        // Marquer comme terminé
        definirEtatIndicateur('calcul-status', 'completed');
        
        YesDataUtils.showNotification('Calculs de consolidation terminés avec succès', 'success');
        
    } catch (error) {
        console.error('❌ Erreur dans le calcul de consolidation:', error);
        YesDataUtils.showNotification(`Erreur: ${error.message}`, 'error');
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
        const onboardElement = document.getElementById('still-to-onboard');
        
        if (criticalElement) criticalElement.textContent = dpData.criticalBusinessServices;
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
        // Graphique spécial pour DP : camembert représentant les proportions réelles
        const totalCritiques = data.criticalBusinessServices;
        const stillToOnboard = data.stillToOnboard;
        
        window[`${section}Chart`] = new Chart(chartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Critical Business Services', 'Still to be onboarded'],
                datasets: [{
                    data: [totalCritiques, stillToOnboard], // Valeurs absolues pour proportions correctes
                    backgroundColor: [
                        'rgba(63, 182, 255, 0.8)',    // Bleu pour Critical Business Services
                        'rgba(255, 193, 7, 0.8)'      // Jaune/Orange pour Still to onboard
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
                        display: true,  // Afficher les légendes
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
                                        
                                        // Logique spéciale pour le camembert DP
                                        let text;
                                        if (i === 0) {
                                            // Critical Business Services : pas de pourcentage
                                            text = `${label}: ${dataset.data[i]}`;
                                        } else {
                                            // Still to be onboarded : pourcentage par rapport à Critical Business Services
                                            const criticalBusinessServices = dataset.data[0];
                                            const percentage = criticalBusinessServices > 0 ? Math.round((dataset.data[i] / criticalBusinessServices) * 100) : 0;
                                            text = `${label}: ${dataset.data[i]} (${percentage}%)`;
                                        }
                                        
                                        return {
                                            text: text,
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataIndex === 0) {
                                    // Critical Business Services : pas de pourcentage
                                    return `Critical Business Services: ${totalCritiques}`;
                                } else {
                                    // Still to be onboarded : pourcentage par rapport à Critical Business Services
                                    const percentage = totalCritiques > 0 ? Math.round((stillToOnboard / totalCritiques) * 100) : 0;
                                    return `Still to onboard: ${stillToOnboard} (${percentage}%)`;
                                }
                            }
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
            
            YesDataUtils.showNotification(details, 'info');
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'affichage des détails:', error);
        YesDataUtils.showNotification('Erreur lors de l\'affichage des détails', 'error');
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
 * Effacer complètement le dump SQL
 */
function effacerDumpSQL() {
    const liste = document.getElementById('import-dump-list');
    if (liste) {
        liste.innerHTML = '<div class="dump-empty" id="import-dump-empty"><p>Aucune erreur détectée</p><p class="dump-empty-hint">Toutes les erreurs d\'import, validation et insertion DB apparaîtront ici avec détails techniques</p></div>';
        console.log('🧹 Dump SQL effacé');
    }
    
    // Réinitialiser le compteur
    const countElement = document.getElementById('import-dump-count');
    if (countElement) {
        countElement.textContent = '0';
    }
}

/**
 * Ajouter une erreur au dump pour qu'elle reste visible
 */
function ajouterErreurAuDump(titre, messageErreur) {
    const timestamp = new Date().toLocaleTimeString();
    
    // Ajouter à la section des requêtes SQL comme une erreur persistante
    ajouterRequeteSQL(
        `❌ ${titre}`, 
        `Erreur survenue à ${timestamp}`, 
        null, 
        messageErreur
    );
    
    // Aussi l'ajouter à la section dump d'insertion si elle existe
    const dumpSection = document.getElementById('dump-content');
    if (dumpSection) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dump-error-message';
        errorDiv.innerHTML = `
            <div class="error-header">❌ ${titre} - ${timestamp}</div>
            <div class="error-details">${messageErreur}</div>
        `;
        dumpSection.appendChild(errorDiv);
    }
}

/**
 * Diagnostiquer les erreurs actuelles dans le dump
 */
function diagnostiquerErreurs() {
    console.log('🔍 DIAGNOSTIC ERREURS:');
    
    const liste = document.getElementById('import-dump-list');
    const countElement = document.getElementById('import-dump-count');
    
    console.log('- Liste dump trouvée:', !!liste);
    console.log('- Compteur trouvé:', !!countElement);
    console.log('- Compteur valeur:', countElement?.textContent);
    console.log('- Contenu liste:', liste?.innerHTML?.substring(0, 200));
    
    const erreurs = liste?.querySelectorAll('.error-item');
    console.log('- Nombre d\'erreurs dans DOM:', erreurs?.length || 0);
    
    if (erreurs && erreurs.length > 0) {
        erreurs.forEach((erreur, index) => {
            const titre = erreur.querySelector('.sql-query-title')?.textContent;
            const message = erreur.querySelector('.error-message')?.textContent;
            console.log(`  Erreur ${index + 1}: ${titre} - ${message}`);
        });
    }
    
    return {
        listeExiste: !!liste,
        compteurExiste: !!countElement,
        compteurValeur: countElement?.textContent,
        nombreErreurs: erreurs?.length || 0
    };
}

/**
 * Ajouter une requête SQL à l'affichage - ERREURS UNIQUEMENT
 */
function ajouterRequeteSQL(titre, requete, resultat = null, erreur = null) {
    const liste = document.getElementById('import-dump-list');
    if (!liste) return;
    
    // NOUVELLE LOGIQUE: N'afficher que les erreurs dans le dump
    if (!erreur) {
        // Si ce n'est pas une erreur, ne pas l'afficher dans le dump
        return;
    }
    
    // Supprimer le message "aucune requête" et "aucune erreur détectée"
    const noQueries = liste.querySelector('.no-queries');
    if (noQueries) {
        noQueries.remove();
    }
    
    // Supprimer le message "Aucune erreur détectée" s'il existe
    const noErrors = liste.querySelector('.dump-empty');
    if (noErrors) {
        noErrors.remove();
    }
    
    const timestamp = new Date().toLocaleTimeString();
    const fullTimestamp = new Date().toISOString();
    
    const queryItem = document.createElement('div');
    queryItem.className = 'sql-query-item error-item';
    
    // Détails techniques de l'erreur
    let detailsTechniques = '';
    if (erreur) {
        detailsTechniques = `
            <div class="error-technical-details">
                <div class="error-header">
                    <strong>🔍 DÉTAILS TECHNIQUES DE L'ERREUR</strong>
                </div>
                <div class="error-details">
                    <div><strong>Timestamp complet:</strong> ${fullTimestamp}</div>
                    <div><strong>Message d'erreur:</strong> ${erreur}</div>
                    <div><strong>Contexte:</strong> ${titre}</div>
                    <div><strong>Requête/Action:</strong> ${requete || 'N/A'}</div>
                    <div><strong>Type d'erreur:</strong> ${erreur.includes('localStorage') ? 'Storage' : erreur.includes('JSON') ? 'Sérialisation' : erreur.includes('SQL') ? 'Base de données' : 'Générique'}</div>
                </div>
            </div>
        `;
    }
    
    queryItem.innerHTML = `
        <div class="sql-query-header error-header">
            <div class="sql-query-title">❌ ${titre}</div>
            <div class="sql-query-time">${timestamp}</div>
        </div>
        <div class="sql-query-error">
            <div class="error-message">💥 ${erreur}</div>
            ${detailsTechniques}
        </div>
        ${requete ? `<div class="sql-query-code">Contexte: ${requete}</div>` : ''}
    `;
    
    liste.appendChild(queryItem);
    
    // Afficher automatiquement la section des erreurs
    const section = document.getElementById('import-dump-section');
    if (section) {
        section.style.display = 'block';
        // Ouvrir la section si elle est fermée
        const content = document.getElementById('import-dump-content');
        const arrow = document.getElementById('import-dump-arrow');
        if (content && content.style.display === 'none') {
            content.style.display = 'block';
            if (arrow) arrow.innerHTML = '▼';
        }
    }
    
    // Scroll vers le bas pour voir la nouvelle erreur
    liste.scrollTop = liste.scrollHeight;
    
    // Mettre à jour le compteur d'erreurs
    const countElement = document.getElementById('import-dump-count');
    if (countElement) {
        const currentCount = parseInt(countElement.textContent) || 0;
        countElement.textContent = currentCount + 1;
    }
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
        
        // Créer la structure attendue pour la section DP principale
        const dpPrincipal = {
            criticalBusinessServices: totalCritiques,
            stillToOnboard: stillToMonitor
        };
        
        // Ajouter la section DP principale aux sections
        sectionsDP.dp = dpPrincipal;
        
        const resultats = {
            date: new Date().toISOString().split('T')[0],
            totalCritiques,
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