document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de l'intégration Telegram WebApp
    const tgWebApp = window.Telegram?.WebApp;
    
    if (tgWebApp) {
        // Expansion de l'interface
        tgWebApp.expand();
        
        // Indication que l'application est prête
        tgWebApp.ready();
        
        // Récupération des données utilisateur
        const user = tgWebApp.initDataUnsafe?.user;
        console.log('Telegram user:', user);
        
        // Configuration du thème
        document.documentElement.className = tgWebApp.colorScheme || 'dark';
        
        // Adaptation de la taille au MainButton si présent
        if (tgWebApp.MainButton?.isVisible) {
            document.body.style.paddingBottom = '80px';
        }
    }

    // Initialisation des particules
    particlesJS.load('particles-js', 'assets/particles.json', function() {
        console.log('particles.js loaded - callback');
    });
    
    // Gestion des animations lors du défilement
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });
    
    // Observation des éléments à animer
    document.querySelectorAll('.card, .feature-card').forEach(el => {
        observer.observe(el);
    });
    
    // Ajout d'effets sonores sur les boutons (optionnel)
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            // Effet visuel de clic
            this.classList.add('button-clicked');
            setTimeout(() => {
                this.classList.remove('button-clicked');
            }, 200);
            
            // Si dans Telegram, on peut utiliser hapticFeedback
            if (tgWebApp?.HapticFeedback) {
                tgWebApp.HapticFeedback.impactOccurred('medium');
            }
        });
    });
});
