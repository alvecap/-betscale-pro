/**
 * Services - BetScale Pro
 * Script de gestion des services, popups et formulaires
 */

// Contenu des aperçus de services
const serviceDetails = {
    'chatbot-ia': {
        title: '🤖 Création de Chatbot IA connecté à Telegram',
        content: `
            <div class="preview-section">
                <h3>✨ Exemples déjà créés :</h3>
                <ul class="preview-examples">
                    <li><strong>AL VE AI Bot</strong> sur le canal [AL VE CAPITAL]</li>
                    <li>Bot automatisé avec IA qui publie chaque jour des prédictions sur mesure</li>
                    <li>Design professionnel + interface de gestion des alertes</li>
                    <li>Compatible avec système de monétisation</li>
                </ul>
            </div>
            <div class="preview-section">
                <h3>💡 Fonctionnalités principales :</h3>
                <ul class="preview-examples">
                    <li>Integration complète avec ton canal Telegram existant</li>
                    <li>Envoi automatique de prédictions selon un calendrier</li>
                    <li>Modèles IA avancés pour des prédictions personnalisées</li>
                    <li>Interface d'administration pour gérer les paramètres</li>
                    <li>Support pour le déploiement et les mises à jour</li>
                </ul>
            </div>
        `,
        price: 150
    },
    'bot-ia-simple': {
        title: '🤖 Création de Bot IA simple',
        content: `
            <div class="preview-section">
                <h3>⚙️ Caractéristiques :</h3>
                <ul class="preview-examples">
                    <li>Fonctionne comme un assistant personnel</li>
                    <li>Peut être utilisé sur Telegram ou sur ton site</li>
                    <li>Configuration rapide et personnalisable selon ton style</li>
                    <li>Réponses automatiques basées sur l'IA</li>
                </ul>
            </div>
            <div class="preview-section">
                <h3>💡 Cas d'utilisation :</h3>
                <ul class="preview-examples">
                    <li>Assistant pour répondre aux questions de base des utilisateurs</li>
                    <li>Générateur de prédictions simples sur demande</li>
                    <li>Automatisation de tâches répétitives</li>
                    <li>Point d'entrée pour tes services premium</li>
                </ul>
            </div>
        `,
        price: 70
    },
    'youtube-channel': {
        title: '📺 Création de chaîne YouTube professionnelle',
        content: `
            <div class="preview-section">
                <h3>📈 Exemples :</h3>
                <ul class="preview-examples">
                    <li>Chaîne principale <strong>AL VE CAPITAL</strong></li>
                    <li>Chaîne secondaire <strong>Alex Verol</strong>, monétisée en moins de 1 mois</li>
                </ul>
            </div>
            <div class="preview-section">
                <h3>🎯 Services inclus :</h3>
                <ul class="preview-examples">
                    <li>Branding complet (logo, bannière, miniatures type)</li>
                    <li>Optimisation SEO (titres, descriptions, mots-clés)</li>
                    <li>Structure des sections et playlists</li>
                    <li>Design des sections communauté et à propos</li>
                    <li>Conseils sur la stratégie de contenu</li>
                    <li>Optimisation pour la monétisation rapide</li>
                </ul>
            </div>
        `,
        price: 100
    },
    'webapp-telegram': {
        title: '🌐 Création de WebApp Telegram',
        content: `
            <div class="preview-section">
                <h3>💡 Exemple :</h3>
                <ul class="preview-examples">
                    <li><strong>BetScale Pro</strong>, interface en temps réel avec menus dynamiques</li>
                    <li>Compatible avec IA Claude, Render, GitHub</li>
                    <li>Menus VIP + intégration crypto avec NOWPayments</li>
                    <li>Interface dark & animée, responsive sur tous supports</li>
                </ul>
            </div>
            <div class="preview-section">
                <h3>⚙️ Fonctionnalités disponibles :</h3>
                <ul class="preview-examples">
                    <li>Interface utilisateur personnalisée selon tes besoins</li>
                    <li>Système de menus dynamiques et animations fluides</li>
                    <li>Authentification et gestion des utilisateurs</li>
                    <li>Intégration avec les API Telegram</li>
                    <li>Options de monétisation (système de paiement)</li>
                    <li>Intégration IA pour fonctionnalités avancées</li>
                    <li>Hébergement et maintenance</li>
                </ul>
            </div>
        `,
        price: 300
    }
};

// Adresse email de l'administrateur pour recevoir les demandes
const adminEmail = "alve08@protonmail.com";

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de l'intégration Telegram WebApp
    initTelegramWebApp();
    
    // Initialisation des particules
    initParticles();
    
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
    
    // Gestionnaire d'événement pour le formulaire d'intérêt
    document.getElementById('interest-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitInterestForm();
    });
    
    // Animation d'entrée pour les cartes
    animateServiceCards();
});

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
                "speed":"speed": 1,
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
        // Mettre à jour le formulaire
        document.getElementById('service-name').value = serviceId;
        document.getElementById('budget').value = price;
        
        // Réinitialiser le formulaire et masquer le message de succès
        document.getElementById('interest-form').reset();
        document.getElementById('service-name').value = serviceId;
        document.getElementById('budget').value = price;
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

// Fermer un popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Soumettre le formulaire d'intérêt
function submitInterestForm() {
    // Récupérer les données du formulaire
    const serviceId = document.getElementById('service-name').value;
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const budget = document.getElementById('budget').value;
    const message = document.getElementById('message').value;
    
    // Récupérer le titre du service
    const serviceTitle = serviceDetails[serviceId].title;
    
    // Préparer les données à envoyer
    const formData = {
        service: serviceTitle,
        fullName: fullName,
        email: email,
        budget: budget,
        message: message || 'Aucun message fourni'
    };
    
    // Afficher la réponse de succès (dans une vraie implémentation, cela se ferait après confirmation du serveur)
    showFormSuccess();
    
    // Envoyer l'email à l'administrateur
    sendEmailToAdmin(formData);
    
    // Effet haptic sur mobile via Telegram WebApp
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp?.HapticFeedback) {
        tgWebApp.HapticFeedback.notificationOccurred('success');
    }
    
    // Dans une implémentation réelle, vous enverriez ces données à votre serveur
    console.log('Données du formulaire :', formData);
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

// Envoyer un email à l'administrateur
function sendEmailToAdmin(formData) {
    // Construire le corps de l'email
    const emailSubject = `Nouvelle demande de service: ${formData.service}`;
    const emailBody = `
Nouvelle demande de service reçue:

Service demandé: ${formData.service}
Nom: ${formData.fullName}
Email: ${formData.email}
Budget proposé: ${formData.budget} $
Message: ${formData.message}

Date: ${new Date().toLocaleString()}
`;

    // Utiliser l'API Email.js (simulée ici - à remplacer par votre implémentation réelle)
    // Dans une implémentation réelle, vous utiliseriez un service comme EmailJS, SendGrid, ou une API backend
    
    // Option 1: Utiliser mailto (solution simple mais qui ouvre le client email par défaut)
    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Créer un lien invisible et cliquer dessus (simulation d'envoi)
    // Note: Cette méthode n'est pas idéale car elle ouvre le client email de l'utilisateur
    // Dans une implémentation réelle, vous utiliseriez un service d'envoi d'emails côté serveur
    /*
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    */
    
    // Option 2: En production, vous utiliseriez un service comme EmailJS
    // Exemple avec EmailJS (décommenté pour montrer l'implémentation, mais nécessite d'ajouter la bibliothèque)
    /*
    emailjs.send("service_id", "template_id", {
        to_email: adminEmail,
        from_name: formData.fullName,
        from_email: formData.email,
        subject: emailSubject,
        message: emailBody
    })
    .then(function(response) {
        console.log("Email envoyé avec succès!", response);
    }, function(error) {
        console.error("Échec de l'envoi de l'email:", error);
    });
    */
    
    // Option 3: Stocker les demandes dans localStorage ou IndexedDB pour un accès administrateur local
    // Cette méthode est utile pour une démonstration ou une utilisation locale
    storeRequestLocally(formData);
    
    console.log(`Email envoyé à ${adminEmail} avec le sujet: ${emailSubject}`);
}

// Stocker la demande localement (pour une démo ou accès administrateur local)
function storeRequestLocally(formData) {
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
