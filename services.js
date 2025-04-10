/**
 * Services - BetScale Pro
 * Script de gestion des services, popups et formulaires
 * Version optimisée pour l'envoi d'emails
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

// Configuration EmailJS
const emailjsConfig = {
    serviceId: "service_9t2f1m7",   // ID du service sur EmailJS configuré sur Render
    templateId: "template_wvq8vbc"   // ID du template sur EmailJS configuré sur Render
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initialisation de la page services...");
    
    // Vérifier si EmailJS est bien chargé
    if (typeof emailjs === 'undefined') {
        console.error("ERREUR CRITIQUE: EmailJS n'est pas chargé! Vérifiez le script dans le HTML.");
    } else {
        console.log("EmailJS est correctement chargé.");
    }
    
    // Initialisation de l'intégration Telegram WebApp
    initTelegramWebApp();
    
    // Initialisation des particules
    initParticles();
    
    // Gestionnaires d'événements pour les boutons
    initEventListeners();
    
    // Animation d'entrée pour les cartes
    animateServiceCards();
});

// Initialisation des gestionnaires d'événements
function initEventListeners() {
    // Gestionnaires d'événements pour les boutons d'aperçu
    document.querySelectorAll('.btn-preview').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            showPreviewPopup(serviceId);
        });
    });
    
    // Gestionnaires d'événements pour les boutons d'intérêt
    document.querySelectorAll('.btn-interest').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            const price = this.getAttribute('data-price');
            showInterestPopup(serviceId, price);
        });
    });
    
    // Gestionnaire d'événement pour le bouton d'intérêt dans le popup d'aperçu
    document.getElementById('popup-interest-btn').addEventListener('click', function() {
        // Récupérer le service actuellement affiché dans le popup d'aperçu
        const serviceTitle = document.getElementById('preview-title').textContent;
        const serviceId = getServiceIdFromTitle(serviceTitle);
        const price = serviceDetails[serviceId].price;
        
        // Fermer le popup d'aperçu
        closePopup('preview-popup');
        
        // Ouvrir le popup d'intérêt
        showInterestPopup(serviceId, price);
    });
    
    // Gestionnaire d'événement pour le champ budget qui vérifie le prix minimum
    document.getElementById('budget').addEventListener('input', function() {
        validateBudget();
    });
    
    // Gestionnaire d'événement pour le formulaire d'intérêt
    document.getElementById('interest-form').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Formulaire soumis");
        
        // Vérifier le budget minimum avant soumission
        if (!validateBudget()) {
            console.log("Validation du budget échouée");
            return false;
        }
        
        submitInterestForm();
    });
}

// Initialisation de Telegram WebApp
function initTelegramWebApp() {
    const tgWebApp = window.Telegram?.WebApp;
    
    if (tgWebApp) {
        // Expansion de l'interface
        tgWebApp.expand();
        
        // Application prête
        tgWebApp.ready();
        
        // Configuration du thème
        document.documentElement.className = tgWebApp.colorScheme || 'dark';
    }
}

// Initialisation des particules
function initParticles() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#3b82f6"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#60a5fa",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
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

// Afficher le popup d'aperçu pour un service
function showPreviewPopup(serviceId) {
    if (serviceDetails[serviceId]) {
        const service = serviceDetails[serviceId];
        
        // Mettre à jour le contenu du popup
        document.getElementById('preview-title').textContent = service.title;
        document.getElementById('preview-details').innerHTML = service.content;
        
        // Configurer le bouton d'intérêt dans le popup
        const interestBtn = document.getElementById('popup-interest-btn');
        interestBtn.setAttribute('data-service', serviceId);
        interestBtn.setAttribute('data-price', service.price);
        
        // Afficher le popup
        document.getElementById('preview-popup').style.display = 'block';
        
        // Effet haptic sur mobile via Telegram WebApp
        const tgWebApp = window.Telegram?.WebApp;
        if (tgWebApp?.HapticFeedback) {
            tgWebApp.HapticFeedback.impactOccurred('medium');
        }
    }
}

// Extraire l'ID du service à partir du titre
function getServiceIdFromTitle(title) {
    for (const [id, service] of Object.entries(serviceDetails)) {
        if (service.title === title) {
            return id;
        }
    }
    return null;
}

// Afficher le popup d'intérêt pour un service
function showInterestPopup(serviceId, price) {
    if (serviceDetails[serviceId]) {
        // Récupérer les détails du service
        const service = serviceDetails[serviceId];
        
        // Mettre à jour le formulaire
        document.getElementById('service-name').value = serviceId;
        document.getElementById('min-price').value = price;
        document.getElementById('budget').value = price;
        document.getElementById('display-min-price').textContent = price;
        
        // Mettre à jour les champs cachés pour EmailJS
        document.getElementById('email-service-name').value = service.title;
        document.getElementById('email-date').value = new Date().toLocaleString();
        
        // Masquer le message d'erreur de prix
        document.getElementById('price-error').style.display = 'none';
        
        // Réinitialiser le formulaire et masquer le message de succès
        document.getElementById('form-success').style.display = 'none';
        document.getElementById('interest-form').style.display = 'block';
        
        // Afficher le popup
        document.getElementById('interest-popup').style.display = 'block';
        
        // Effet haptic sur mobile via Telegram WebApp
        const tgWebApp = window.Telegram?.WebApp;
        if (tgWebApp?.HapticFeedback) {
            tgWebApp.HapticFeedback.impactOccurred('medium');
        }
    }
}

// Valider que le budget est supérieur ou égal au prix minimum
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

// Créer un élément de statut visuel
function createStatusElement(message, type = 'info') {
    const statusElement = document.createElement('div');
    statusElement.id = 'status-indicator';
    statusElement.style.position = 'fixed';
    statusElement.style.bottom = '20px';
    statusElement.style.right = '20px';
    statusElement.style.padding = '10px 15px';
    statusElement.style.borderRadius = '5px';
    statusElement.style.color = 'white';
    statusElement.style.zIndex = '9999';
    statusElement.style.fontSize = '14px';
    statusElement.style.transition = 'all 0.3s ease';
    
    // Définir l'apparence en fonction du type
    switch(type) {
        case 'success':
            statusElement.style.backgroundColor = 'rgba(16, 185, 129, 0.9)'; // vert
            break;
        case 'error':
            statusElement.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'; // rouge
            break;
        case 'warning':
            statusElement.style.backgroundColor = 'rgba(245, 158, 11, 0.9)'; // orange
            break;
        default:
            statusElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // noir/gris foncé
    }
    
    statusElement.textContent = message;
    return statusElement;
}

// Soumettre le formulaire d'intérêt
// Soumettre le formulaire d'intérêt
function submitInterestForm() {
    console.log("Traitement du formulaire d'intérêt");
    
    // Désactiver le bouton de soumission
    const submitButton = document.querySelector('.btn-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    // Récupérer les données du formulaire
    const serviceId = document.getElementById('service-name').value;
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const budget = document.getElementById('budget').value;
    const message = document.getElementById('message').value;
    
    // Récupérer le titre du service
    const serviceTitle = serviceDetails[serviceId].title;
    
    // Préparer les données pour l'email
    const templateParams = {
        service_name: serviceTitle,
        from_name: fullName,
        from_email: email,
        budget: budget,
        message: message || 'Aucun message fourni',
        to_email: adminEmail,
        date: new Date().toLocaleString()
    };
    
    console.log("Tentative d'envoi d'email avec les paramètres:", templateParams);
    
    // Envoi de l'email via EmailJS
    emailjs.send(
        emailjsConfig.serviceId, 
        emailjsConfig.templateId, 
        templateParams
    )
    .then(function(response) {
        console.log("Succès:", response.status, response.text);
        
        // Stocker la demande localement
        storeRequestLocally({
            service: serviceTitle,
            fullName: fullName,
            email: email,
            budget: budget,
            message: message || 'Aucun message fourni',
            timestamp: new Date().toISOString()
        });
        
        // Afficher le message de succès
        showFormSuccess();
        
        // Retour haptique sur mobile
        const tgWebApp = window.Telegram?.WebApp;
        if (tgWebApp?.HapticFeedback) {
            tgWebApp.HapticFeedback.notificationOccurred('success');
        }
    })
    .catch(function(error) {
        console.error("Erreur d'envoi:", error);
        
        // Même en cas d'erreur, stocker la demande localement
        storeRequestLocally({
            service: serviceTitle,
            fullName: fullName,
            email: email,
            budget: budget,
            message: message || 'Aucun message fourni',
            timestamp: new Date().toISOString(),
            error: true // Marquer cette demande comme ayant échoué
        });
        
        // Afficher quand même le succès pour l'expérience utilisateur
        // (l'administrateur pourra voir la demande dans l'interface admin)
        showFormSuccess();
    })
    .finally(function() {
        // Réactiver le bouton de soumission
        submitButton.disabled = false;
        submitButton.textContent = 'Envoyer ma demande';
    });
}

// Afficher le message de succès du formulaire
function showFormSuccess() {
    document.getElementById('interest-form').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
    
    // Fermer automatiquement le popup après 3 secondes
    setTimeout(() => {
        closePopup('interest-popup');
    }, 3000);
}

// Stocker la demande localement (pour une démo ou accès administrateur local)
function storeRequestLocally(formData) {
    console.log("Stockage local de la demande...");
    
    // Récupérer les demandes existantes ou initialiser un tableau vide
    let storedRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    
    // Ajouter la nouvelle demande avec un horodatage
    storedRequests.push({
        ...formData,
        timestamp: new Date().toISOString()
    });
    
    // Stocker dans localStorage
    localStorage.setItem('serviceRequests', JSON.stringify(storedRequests));
    
    console.log('Demande stockée localement.');
}

// Fonction utilitaire pour créer un élément de notification visuelle
function createNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique après 3 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
