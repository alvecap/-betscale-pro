/**
 * BetScale Pro - Script principal
 * Gestion de l'interface utilisateur, animations et intégration Telegram
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== INITIALISATION TELEGRAM WEBAPP =====
    const tgWebApp = window.Telegram?.WebApp;
    
    if (tgWebApp) {
        // Expansion de l'interface (plein écran)
        tgWebApp.expand();
        
        // Indiquer à Telegram que l'application est prête
        tgWebApp.ready();
        
        // Récupération des données utilisateur
        const user = tgWebApp.initDataUnsafe?.user;
        console.log('Telegram user:', user);
        
        // Configuration du thème basé sur Telegram
        document.documentElement.className = tgWebApp.colorScheme || 'dark';
        
        // Adaptation de la mise en page si le bouton principal est visible
        if (tgWebApp.MainButton?.isVisible) {
            document.body.style.paddingBottom = '80px';
        }
    }

    // ===== CONFIGURATION DES PARTICULES D'ARRIÈRE-PLAN =====
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
    
    // ===== ANIMATIONS D'INTERFACE =====
    
    // Animation d'entrée des cartes (apparition progressive)
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // Définir l'état initial
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Animation d'entrée séquentielle
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100)); // Délai séquentiel pour chaque carte
    });
    
    // ===== GESTION DU POPUP VIP =====
    const popup = document.getElementById('vip-popup');
    const lockButtons = document.querySelectorAll('.btn-card.lock');
    const closePopup = document.querySelector('.close-popup');
    const paymentButton = document.getElementById('payment-button');
    
    // Ouvrir le popup au clic sur un bouton "Activer 🔒"
    lockButtons.forEach(button => {
        button.addEventListener('click', () => {
            popup.style.display = 'block';
            
            // Retour haptique sur mobile si disponible via Telegram
            if (tgWebApp?.HapticFeedback) {
                tgWebApp.HapticFeedback.impactOccurred('medium');
            }
        });
    });
    
    // Fermer le popup via le bouton X
    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });
    
    // Fermer le popup en cliquant en dehors de la fenêtre
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
    
    // Gestion du bouton de paiement (à intégrer avec NOWPayments)
    paymentButton.addEventListener('click', () => {
        // Simulation de redirection vers le système de paiement
        // À remplacer par l'intégration réelle avec NOWPayments
        alert('Redirection vers le système de paiement...');
        
        // Code pour future intégration NOWPayments
        // const paymentUrl = "https://api.nowpayments.io/v1/payment?...";
        // window.location.href = paymentUrl;
        
        // Alternative pour l'intégration Telegram
        if (tgWebApp && tgWebApp.openLink) {
            // Ouvrir un lien externe dans Telegram
            // tgWebApp.openLink(paymentUrl);
        }
    });
    
    // ===== EFFETS VISUELS ET INTERACTIONS =====
    
    // Effet de clic sur tous les boutons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            // Animation visuelle au clic
            this.classList.add('button-clicked');
            setTimeout(() => {
                this.classList.remove('button-clicked');
            }, 200);
            
            // Retour haptique via Telegram si disponible
            if (tgWebApp?.HapticFeedback) {
                tgWebApp.HapticFeedback.impactOccurred('medium');
            }
        });
    });
    
    // Animation subtile des icônes
    const iconElements = document.querySelectorAll('.card-icon');
    iconElements.forEach(icon => {
        // Animation aléatoire et périodique
        setInterval(() => {
            icon.classList.add('pulse');
            setTimeout(() => {
                icon.classList.remove('pulse');
            }, 1000);
        }, 3000 + Math.random() * 2000); // Intervalle aléatoire pour un effet naturel
    });
    
    // Animation du texte "Pro" en surbrillance
    const highlight = document.querySelector('.highlight');
    setInterval(() => {
        // Augmentation de la lueur
        highlight.style.textShadow = '0 0 15px rgba(255, 193, 7, 0.8)';
        setTimeout(() => {
            // Retour à l'état normal
            highlight.style.textShadow = '0 0 10px rgba(255, 193, 7, 0.5)';
        }, 700);
    }, 3000);
    
    // Animation spéciale pour les badges VIP
    const vipBadges = document.querySelectorAll('.card-badge.vip');
    vipBadges.forEach(badge => {
        // Animation de pulsation pour attirer l'attention
        setInterval(() => {
            badge.style.transform = 'scale(1.1)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 300);
        }, 2000);
    });

    // ===== GESTION DES ÉTATS UTILISATEUR =====
    
    // Simulation d'état utilisateur - à remplacer par la logique réelle
    // Pour le moment, tous les utilisateurs sont considérés comme non-VIP
    const isUserVip = false;
    
    // Vérification et mise à jour de l'interface selon le statut VIP
    function updateVipStatus() {
        const vipElements = document.querySelectorAll('.lock');
        
        if (isUserVip) {
            // Si l'utilisateur est VIP, débloquer les fonctionnalités
            vipElements.forEach(el => {
                el.classList.remove('lock');
                el.textContent = 'Accéder';
            });
            
            // Masquer les badges VIP
            document.querySelectorAll('.card-badge.vip').forEach(badge => {
                badge.style.display = 'none';
            });
        }
    }
    
    // Appliquer le statut VIP à l'interface
    updateVipStatus();
    
    // ===== DÉTECTION DE CHANGEMENT D'ORIENTATION (MOBILE) =====
    window.addEventListener('resize', function() {
        // Recalculer la disposition des éléments si nécessaire
        const gridContainer = document.querySelector('.grid-container');
        
        if (window.innerWidth < 768) {
            // Optimisations pour les petits écrans
            gridContainer.style.gridTemplateColumns = '1fr';
        } else {
            // Retour à la disposition normale pour les grands écrans
            gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        }
    });
    
    // ===== INITIALISATION DE LA CONSOLE POUR DÉBOGAGE =====
    console.log('BetScale Pro WebApp initialisée avec succès!');
});
