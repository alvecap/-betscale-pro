/**
 * BetScale Pro - Script principal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est administrateur
    const isAdmin = checkAdminAccess();

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

    // Configuration des particules
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
    
    // Animation d'entrée pour les cartes
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Mise à jour des boutons VIP pour l'administrateur
    if (isAdmin) {
        updateVipButtonsForAdmin();
    }
    
    // Effet de clic sur les boutons
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
    
    // Animation continues des icônes
    const iconEls = document.querySelectorAll('.card-icon');
    iconEls.forEach(icon => {
        setInterval(() => {
            icon.classList.add('pulse');
            setTimeout(() => {
                icon.classList.remove('pulse');
            }, 1000);
        }, 3000 + Math.random() * 2000);
    });
    
    // Animation du titre
    const highlight = document.querySelector('.highlight');
    
    setInterval(() => {
        highlight.style.textShadow = '0 0 15px rgba(255, 193, 7, 0.8)';
        setTimeout(() => {
            highlight.style.textShadow = '0 0 10px rgba(255, 193, 7, 0.5)';
        }, 700);
    }, 3000);
    
    // Animation spéciale pour les badges VIP
    const vipBadges = document.querySelectorAll('.card-badge.vip');
    vipBadges.forEach(badge => {
        setInterval(() => {
            badge.style.transform = 'scale(1.1)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 300);
        }, 2000);
    });
});

// Vérification administrateur
function checkAdminAccess() {
    // Vérifier d'abord si déjà défini dans localStorage
    if (localStorage.getItem('userVIPStatus') === 'true' && localStorage.getItem('isAdmin') === 'true') {
        console.log("Statut admin déjà activé");
        return true;
    }

    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp && tgWebApp.initDataUnsafe?.user) {
        const username = tgWebApp.initDataUnsafe.user.username;
        // Vérifier si l'utilisateur est l'administrateur
        if (username === "alve08") {
            // Attribuer le statut VIP automatiquement
            localStorage.setItem('userVIPStatus', 'true');
            localStorage.setItem('isAdmin', 'true');
            // Donner un nombre élevé de prédictions
            localStorage.setItem('predictionsRemaining', '999');
            console.log("Accès administrateur accordé");
            return true;
        }
    }
    
    // Option de développement - décommenter pour tester localement
    // localStorage.setItem('userVIPStatus', 'true');
    // localStorage.setItem('isAdmin', 'true');
    // localStorage.setItem('predictionsRemaining', '999');
    // console.log("Mode développement: accès admin activé");
    // return true;
    
    return false;
}

// Mise à jour des boutons VIP pour l'admin
function updateVipButtonsForAdmin() {
    const vipButtons = document.querySelectorAll('.btn-card.lock');
    vipButtons.forEach(button => {
        button.classList.remove('lock');
        button.removeAttribute('onclick');
        button.textContent = 'Accéder';
        
        // Créer des liens href en fonction du type de carte
        const cardTitle = button.parentElement.querySelector('h3').textContent.trim();
        
        if (cardTitle === 'God Mode') {
            button.setAttribute('href', 'god-mode.html');
        } else if (cardTitle === 'Outils Premium') {
            button.setAttribute('href', '#premium-tools');  // À remplacer par le vrai lien
        } else if (cardTitle === 'Stratégies & Failles') {
            button.setAttribute('href', '#strategies');  // À remplacer par le vrai lien
        }
        
        // Convertir le bouton en lien <a>
        const newLink = document.createElement('a');
        for (let i = 0; i < button.attributes.length; i++) {
            const attr = button.attributes[i];
            newLink.setAttribute(attr.name, attr.value);
        }
        newLink.textContent = button.textContent;
        newLink.classList = button.classList;
        
        button.parentNode.replaceChild(newLink, button);
    });
}

// Fonctions pour gestion du popup VIP
function showVipOffer() {
    document.getElementById('vip-popup').style.display = 'block';
    
    // Effet haptic sur mobile
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp?.HapticFeedback) {
        tgWebApp.HapticFeedback.impactOccurred('medium');
    }
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Redirection vers la page de paiement
function redirectToPayment() {
    // Pour l'instant, simuler un paiement réussi
    alert('Redirection vers le système de paiement...');
    
    // Dans une implémentation réelle, vous redirigeriez vers NOWPayments
    // window.location.href = "URL_DE_PAIEMENT";
    
    // Si intégration avec Telegram:
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp && tgWebApp.openLink) {
        // tgWebApp.openLink("URL_DE_PAIEMENT");
    }
}
