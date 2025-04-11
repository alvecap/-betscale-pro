/**
 * Services - BetScale Pro
 * Script de gestion des services, popups et formulaires
 * Version sécurisée pour l'envoi d'emails via EmailJS
 */

// Contenu des aperçus de services
const serviceDetails = {
    'chatbot-ia': {
        title: '🤖 Création de Chatbot IA connecté à Telegram',
        content: `
            <div class="preview-section">
                <h3>🎯 « Un bon canal Telegram t'attire du monde. Un bot IA qui l'alimente tous les jours t'enrichit en silence. »</h3>
                <div class="preview-why">
                    <h4>💡 Pourquoi c'est puissant :</h4>
                    <ul class="preview-examples">
                        <li>Tu automatises l'envoi de prédictions, de messages ou de contenu premium</li>
                        <li>Ton canal devient <strong>vivant, régulier, et autonome</strong></li>
                        <li>Tu n'as plus besoin d'intervenir : <strong>le bot bosse pour toi</strong></li>
                    </ul>
                </div>
            </div>
            <div class="preview-section">
                <h4>🧠 Ce que tu obtiens :</h4>
                <ul class="preview-examples">
                    <li>Un bot connecté directement à ton canal</li>
                    <li>Envoi <strong>automatique de prédictions personnalisées</strong></li>
                    <li>Fonctionne avec <strong>ChatGPT, Claude ou IA mixte</strong></li>
                    <li>Peut envoyer : des scores exacts, des conseils, des alertes, etc.</li>
                    <li>Possibilité d'ajouter des fonctions VIP (via abonnement)</li>
                </ul>
            </div>
            <div class="preview-section">
                <h4>🧪 Exemple concret :</h4>
                <ul class="preview-examples">
                    <li>🔗 Bot : <strong>AL VE AI BOT</strong></li>
                    <li>💥 Connecté au canal <strong>AL VE CAPITAL Officiel</strong> → +65 000 abonnés</li>
                    <li>🎯 Il envoie tous les jours des prédictions intelligentes <strong>sans aucune action manuelle</strong></li>
                </ul>
            </div>
        `,
        price: 150
    },
    'bot-ia-simple': {
        title: '🤖 Création de Bot IA simple',
        content: `
            <div class="preview-section">
                <h3>🚀 « Pas besoin d'un studio pour démarrer un business. Un simple bot bien configuré peut devenir ton premier employé. »</h3>
                <div class="preview-why">
                    <h4>💡 Pourquoi c'est lunaire :</h4>
                    <ul class="preview-examples">
                        <li>Tu as ton propre assistant IA sur Telegram</li>
                        <li>Tu peux le programmer pour :</li>
                        <li>Répondre à tes questions</li>
                        <li>Générer des prédictions à la demande</li>
                        <li>Réagir à des mots-clés précis</li>
                    </ul>
                </div>
            </div>
            <div class="preview-section">
                <h4>🧠 Ce que tu obtiens :</h4>
                <ul class="preview-examples">
                    <li>Un bot autonome, 100% personnalisable</li>
                    <li>Facile à déployer et simple à utiliser</li>
                    <li>Parfait pour tester des projets ou lancer une micro-communauté</li>
                </ul>
            </div>
            <div class="preview-section">
                <h4>🧪 Exemple d'utilisation :</h4>
                <ul class="preview-examples">
                    <li>Tu tapes "🔥 VIP du jour" → Il t'envoie une prédiction</li>
                    <li>Tu tapes "Mes stratégies" → Il te répond avec des conseils</li>
                    <li>Tu ajoutes un bouton « Start » pour l'activer à tout moment</li>
                </ul>
            </div>
        `,
        price: 70
    },
    'youtube-channel': {
        title: '📺 Création de chaîne YouTube professionnelle',
        content: `
            <div class="preview-section">
                <h3>🎬 « Une chaîne YouTube bien pensée n'a pas besoin de chance pour réussir. Elle attire, fidélise, et monétise naturellement. »</h3>
                <div class="preview-why">
                    <h4>💡 Pourquoi tu dois le faire :</h4>
                    <ul class="preview-examples">
                        <li>Tu gagnes en <strong>visibilité</strong>, <strong>crédibilité</strong>, et <strong>revenus passifs</strong></li>
                        <li>Une chaîne bien structurée = monétisation + abonnés + audience fidèle</li>
                        <li>Tu gagnes du temps car <strong>tout est optimisé dès le départ</strong></li>
                    </ul>
                </div>
            </div>
            <div class="preview-section">
                <h4>🧠 Ce que tu obtiens :</h4>
                <ul class="preview-examples">
                    <li>Création de A à Z : titre, logo, bannière, à propos, playlists, tags</li>
                    <li>Accompagnement pour choisir ton angle rentable</li>
                    <li>Mise en place d'un branding cohérent + conseils SEO</li>
                    <li>Option vidéo pilote (si besoin)</li>
                </ul>
            </div>
            <div class="preview-section">
                <h4>🧪 Exemples concrets :</h4>
                <ul class="preview-examples">
                    <li>📺 <strong>Chaîne principale</strong> : <strong>AL VE CAPITAL</strong> → +65 000 abonnés</li>
                    <li>📈 <strong>Chaîne secondaire</strong> : <strong>Alex Verol</strong> → Monétisée en <strong>moins d'1 mois</strong></li>
                </ul>
            </div>
        `,
        price: 100
    },
    'webapp-telegram': {
        title: '🌐 Création de WebApp Telegram',
        content: `
            <div class="preview-section">
                <h3>🌌 « Si une chaîne YouTube attire l'attention, une WebApp IA transforme tes idées en empire. »</h3>
                <div class="preview-why">
                    <h4>💡 Pourquoi c'est une machine à cash :</h4>
                    <ul class="preview-examples">
                        <li>Tu proposes un espace interactif, stylé et utile</li>
                        <li>Tu peux y intégrer : IA, prédictions, accès VIP, outils premium, etc.</li>
                        <li>C'est <strong>100% contrôlé par toi</strong> : plus de dépendance aux plateformes</li>
                    </ul>
                </div>
            </div>
            <div class="preview-section">
                <h4>🧠 Ce que tu obtiens :</h4>
                <ul class="preview-examples">
                    <li>WebApp responsive, fluide, sombre et animée</li>
                    <li>Menus cliquables etc comme cette WebApp</li>
                    <li>Intégration IA + paiement crypto pour encaisser tes gains</li>
                    <li>Hébergement sur GitHub / Render</li>
                </ul>
            </div>
            <div class="preview-section">
                <h4>🧪 Exemple de réussite :</h4>
                <ul class="preview-examples">
                    <li>💻 <strong>BetScale Pro</strong> – l'une des seules WebApp IA de paris sportifs en mode Hamster Combat</li>
                    <li>✨ Interface clean, intuitive, avec design futuriste</li>
                    <li>💼 Intègre tes stratégies VIP + tes outils exclusifs</li>
                </ul>
            </div>
        `,
        price: 300
    }
};

// Configuration EmailJS (les valeurs seront injectées via Render)
const emailjsConfig = {
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.EMAILJS_PUBLIC_KEY
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initialisation de la page services...");
    
    // Vérification des dépendances
    if (typeof emailjs === 'undefined') {
        console.error("EmailJS n'est pas chargé - vérifiez le script dans le HTML");
        showStatusMessage("Erreur: EmailJS non chargé", 'error');
    } else {
        // Initialiser EmailJS avec la clé publique
        emailjs.init(emailjsConfig.publicKey)
            .then(() => {
                console.log("EmailJS initialisé avec succès");
            })
            .catch(error => {
                console.error("Erreur d'initialisation EmailJS:", error);
                showStatusMessage("Erreur d'initialisation EmailJS", 'error');
            });
    }
    
    // Initialisation des autres composants
    initTelegramWebApp();
    initParticles();
    initEventListeners();
    animateServiceCards();
});

// Initialisation des gestionnaires d'événements
function initEventListeners() {
    // Boutons d'aperçu
    document.querySelectorAll('.btn-preview').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            showPreviewPopup(serviceId);
        });
    });
    
    // Boutons d'intérêt
    document.querySelectorAll('.btn-interest').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            const price = this.getAttribute('data-price');
            showInterestPopup(serviceId, price);
        });
    });
    
    // Bouton d'intérêt dans le popup d'aperçu
    document.getElementById('popup-interest-btn').addEventListener('click', function() {
        const serviceTitle = document.getElementById('preview-title').textContent;
        const serviceId = getServiceIdFromTitle(serviceTitle);
        const price = serviceDetails[serviceId].price;
        closePopup('preview-popup');
        showInterestPopup(serviceId, price);
    });
    
    // Validation du budget
    document.getElementById('budget').addEventListener('input', validateBudget);
    
    // Soumission du formulaire
    document.getElementById('interest-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateBudget()) {
            submitInterestForm();
        }
    });
    
    // Boutons de fermeture des popups
    document.querySelectorAll('.close-popup').forEach(button => {
        button.addEventListener('click', function() {
            const popupId = this.closest('.popup').id;
            closePopup(popupId);
        });
    });
}

// Initialisation de Telegram WebApp
function initTelegramWebApp() {
    const tgWebApp = window.Telegram?.WebApp;
    
    if (tgWebApp) {
        tgWebApp.expand();
        tgWebApp.ready();
        document.documentElement.className = tgWebApp.colorScheme || 'dark';
    }
}

// Initialisation des particules
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#3b82f6" },
            shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
            line_linked: { enable: true, distance: 150, color: "#60a5fa", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1, direction: "none", random: false, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// Animation des cartes de service
function animateServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// Afficher un popup d'aperçu
function showPreviewPopup(serviceId) {
    if (serviceDetails[serviceId]) {
        const service = serviceDetails[serviceId];
        document.getElementById('preview-title').textContent = service.title;
        document.getElementById('preview-details').innerHTML = service.content;
        
        const interestBtn = document.getElementById('popup-interest-btn');
        interestBtn.setAttribute('data-service', serviceId);
        interestBtn.setAttribute('data-price', service.price);
        
        document.getElementById('preview-popup').style.display = 'block';
        
        // Feedback haptique
        triggerHapticFeedback('medium');
    }
}

// Afficher un popup d'intérêt
function showInterestPopup(serviceId, price) {
    if (serviceDetails[serviceId]) {
        const service = serviceDetails[serviceId];
        
        // Mise à jour des champs du formulaire
        document.getElementById('service-name').value = serviceId;
        document.getElementById('email-service-name').value = service.title;
        document.getElementById('min-price').value = price;
        document.getElementById('budget').value = price;
        document.getElementById('display-min-price').textContent = price;
        document.getElementById('email-date').value = new Date().toLocaleString();
        
        // Réinitialisation de l'état du formulaire
        document.getElementById('price-error').style.display = 'none';
        document.getElementById('form-success').style.display = 'none';
        document.getElementById('interest-form').style.display = 'block';
        document.querySelector('.btn-submit').disabled = false;
        document.querySelector('.btn-submit').textContent = 'Envoyer ma demande';
        
        // Affichage du popup
        document.getElementById('interest-popup').style.display = 'block';
        
        // Feedback haptique
        triggerHapticFeedback('medium');
    }
}

// Valider le budget
function validateBudget() {
    const budgetField = document.getElementById('budget');
    const minPrice = parseInt(document.getElementById('min-price').value);
    const budget = parseInt(budgetField.value);
    const errorDisplay = document.getElementById('price-error');
    const submitButton = document.querySelector('.btn-submit');
    
    if (budget < minPrice) {
        errorDisplay.style.display = 'flex';
        submitButton.disabled = true;
        budgetField.style.borderColor = 'var(--services-error)';
        return false;
    } else {
        errorDisplay.style.display = 'none';
        submitButton.disabled = false;
        budgetField.style.borderColor = '';
        return true;
    }
}

// Fermer un popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Soumettre le formulaire d'intérêt
async function submitInterestForm() {
    const form = document.getElementById('interest-form');
    const submitButton = document.querySelector('.btn-submit');
    
    // Désactiver le bouton pendant l'envoi
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    try {
        // Préparer les données pour EmailJS
        const formData = {
            service_name: document.getElementById('email-service-name').value,
            from_name: document.getElementById('full-name').value,
            from_email: document.getElementById('email').value,
            budget: document.getElementById('budget').value,
            message: document.getElementById('message').value || 'Aucun message fourni',
            date: document.getElementById('email-date').value
        };
        
        console.log("Envoi des données:", formData);
        
        // Envoyer l'email via EmailJS
        const response = await emailjs.send(
            emailjsConfig.serviceId,
            emailjsConfig.templateId,
            formData
        );
        
        console.log("Email envoyé avec succès:", response);
        
        // Afficher le message de succès
        document.getElementById('interest-form').style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
        
        // Feedback haptique
        triggerHapticFeedback('success');
        
        // Fermer le popup après 3 secondes
        setTimeout(() => {
            closePopup('interest-popup');
        }, 3000);
        
        // Stocker localement pour backup
        storeRequestLocally(formData);
        
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        
        // Afficher un message d'erreur
        showStatusMessage("Erreur d'envoi - réessayez ou contactez-nous", 'error');
        
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = 'Envoyer ma demande';
        
        // Stocker localement en cas d'erreur
        const formData = {
            service_name: document.getElementById('email-service-name').value,
            from_name: document.getElementById('full-name').value,
            from_email: document.getElementById('email').value,
            budget: document.getElementById('budget').value,
            message: document.getElementById('message').value || 'Aucun message fourni',
            date: document.getElementById('email-date').value
        };
        storeRequestLocally(formData);
    }
}

// Stocker la demande localement
function storeRequestLocally(formData) {
    let requests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    requests.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('serviceRequests', JSON.stringify(requests));
    console.log("Demande stockée localement");
}

// Afficher un message de statut
function showStatusMessage(message, type = 'info') {
    // Supprimer l'ancien message s'il existe
    const oldStatus = document.getElementById('status-message');
    if (oldStatus) oldStatus.remove();
    
    // Créer le nouvel élément
    const statusElement = document.createElement('div');
    statusElement.id = 'status-message';
    statusElement.textContent = message;
    
    // Style de base
    statusElement.style.position = 'fixed';
    statusElement.style.bottom = '20px';
    statusElement.style.right = '20px';
    statusElement.style.padding = '12px 20px';
    statusElement.style.borderRadius = '6px';
    statusElement.style.color = 'white';
    statusElement.style.zIndex = '9999';
    statusElement.style.fontSize = '14px';
    statusElement.style.transition = 'all 0.3s ease';
    statusElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Style selon le type
    switch(type) {
        case 'success':
            statusElement.style.backgroundColor = '#10B981';
            break;
        case 'error':
            statusElement.style.backgroundColor = '#EF4444';
            break;
        case 'warning':
            statusElement.style.backgroundColor = '#F59E0B';
            break;
        default:
            statusElement.style.backgroundColor = '#3B82F6';
    }
    
    // Ajouter au DOM
    document.body.appendChild(statusElement);
    
    // Disparaître après 5 secondes
    setTimeout(() => {
        statusElement.style.opacity = '0';
        setTimeout(() => {
            statusElement.remove();
        }, 300);
    }, 5000);
}

// Déclencher un feedback haptique
function triggerHapticFeedback(type = 'light') {
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp?.HapticFeedback) {
        switch(type) {
            case 'light':
                tgWebApp.HapticFeedback.impactOccurred('light');
                break;
            case 'medium':
                tgWebApp.HapticFeedback.impactOccurred('medium');
                break;
            case 'heavy':
                tgWebApp.HapticFeedback.impactOccurred('heavy');
                break;
            case 'success':
                tgWebApp.HapticFeedback.notificationOccurred('success');
                break;
            case 'error':
                tgWebApp.HapticFeedback.notificationOccurred('error');
                break;
        }
    }
}

// Obtenir l'ID du service à partir du titre
function getServiceIdFromTitle(title) {
    for (const [id, service] of Object.entries(serviceDetails)) {
        if (service.title === title) return id;
    }
    return null;
}
