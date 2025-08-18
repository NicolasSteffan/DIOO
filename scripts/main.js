/**
 * Application DIOO - Script principal
 * Gestion de la navigation et interactions utilisateur
 */

class DiooApp {
    constructor() {
        this.currentPage = 'chargement';
        this.pages = ['chargement', 'monitoring'];
        this.init();
    }

    /**
     * Initialisation de l'application
     */
    init() {
        this.setupEventListeners();
        this.updatePageTitle();
        this.showWelcomeMessage();
        console.log('✅ Application DIOO initialisée avec succès');
    }

    /**
     * Configuration des écouteurs d'événements
     */
    setupEventListeners() {
        // Navigation entre les pages
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetPage = e.currentTarget.dataset.page;
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

        // Log pour débogage
        console.log(`📄 Navigation vers la page: ${pageName}`);

        // Déclencher un événement personnalisé
        this.dispatchPageChangeEvent(pageName);
    }

    /**
     * Masquer toutes les pages
     */
    hideAllPages() {
        this.pages.forEach(pageName => {
            const pageElement = document.getElementById(`${pageName}-page`);
            if (pageElement) {
                pageElement.classList.remove('active');
            }
        });
    }

    /**
     * Afficher une page spécifique
     * @param {string} pageName - Nom de la page à afficher
     */
    showPage(pageName) {
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
            
            // Animation d'entrée
            pageElement.style.opacity = '0';
            setTimeout(() => {
                pageElement.style.opacity = '1';
            }, 50);
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
🚀 Application DIOO v1.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Pages disponibles: ${this.pages.join(', ')}
🎯 Page actuelle: ${this.currentPage}
⌨️ Raccourcis:
   • Alt + 1: Page Chargement
   • Alt + 2: Page Monitoring
   • Échap: Retour à l'accueil
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
            version: '1.0.0',
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
     * Afficher une notification (placeholder pour futures implémentations)
     * @param {string} message - Message à afficher
     * @param {string} type - Type de notification (info, success, warning, error)
     */
    showNotification(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        // Ici, on pourrait implémenter un système de notifications visuelles
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
 * Exposition de l'API pour le débogage
 */
window.dioo = {
    navigateTo: (page) => window.diooApp?.navigateToPage(page),
    getState: () => window.diooApp?.getAppState(),
    reset: () => window.diooApp?.reset(),
    version: '1.0.0'
};