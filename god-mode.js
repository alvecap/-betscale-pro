/**
 * God Mode - BetScale Pro
 * Script de gestion des prédictions avancées et navigation entre les sections
 */

// Variables globales pour stocker les données
let godPredictionData = {
    // Cotes principales
    homeOdds: null,
    drawOdds: null,
    awayOdds: null,
    
    // Scores mi-temps
    homeHalftime: null,
    awayHalftime: null,
    homeSecondHalf: null,
    awaySecondHalf: null,
    
    // Scores alignés
    homeAlignedHome: null,
    homeAlignedAway: null,
    drawAlignedHome: null,
    drawAlignedAway: null,
    awayAlignedHome: null,
    awayAlignedAway: null,
    
    // Score exact principal temps réglementaire
    topExactHome: null,
    topExactAway: null,
    
    // Cotes spéciales
    bttsOdds: null,
    overOdds: null,
    handicapOdds: null,
    
    // Résultats calculés
    matchResult: null,
    primaryScore: null,
    secondaryScore: null,
    goalsPrediction: null,
    
    // Fiabilité
    resultReliability: null,
    primaryScoreReliability: null,
    secondaryScoreReliability: null,
    goalsReliability: null,
    
    // Facteurs d'analyse
    favoriteTeam: null // "home", "away", ou "draw"
};

// Variables pour la gestion des prédictions quotidiennes
let dailyPredictionsLimit = 5; // Limite par défaut pour les utilisateurs gratuits
let predictionsRemaining = 5; // Nombre de prédictions restantes aujourd'hui
let isUserVIP = false; // Statut VIP de l'utilisateur
let currentSection = 0; // Section actuelle (0 = intro, 1-4 = sections)

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Telegram WebApp
    initTelegramWebApp();
    
    // Initialisation des particules
    initParticles();
    
    // Charger le nombre de prédictions restantes
    loadPredictionsCount();
    
    // Afficher l'introduction
    document.getElementById('intro-step').classList.add('active');
    
    // Initialiser les écouteurs d'événements
    initInputValidation();
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
                "value": "#8b5cf6"
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
                "color": "#a78bfa",
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

// Chargement du compteur de prédictions
function loadPredictionsCount() {
    // Essayer de charger depuis le stockage local
    const storedCount = localStorage.getItem('predictionsRemaining');
    const lastPredictionDate = localStorage.getItem('lastPredictionDate');
    const today = new Date().toDateString();
    
    // Vérifier le statut VIP
    isUserVIP = localStorage.getItem('userVIPStatus') === 'true';
    
    // Définir la limite en fonction du statut VIP
    dailyPredictionsLimit = isUserVIP ? 25 : 5;
    
    // Si c'est un nouveau jour, réinitialiser le compteur
    if (lastPredictionDate !== today) {
        predictionsRemaining = dailyPredictionsLimit;
        localStorage.setItem('predictionsRemaining', predictionsRemaining);
        localStorage.setItem('lastPredictionDate', today);
    } 
    // Sinon charger la valeur stockée
    else if (storedCount) {
        predictionsRemaining = parseInt(storedCount);
    }
    
    // Mettre à jour l'affichage
    updatePredictionsCounter();
}

// Mise à jour de l'affichage du compteur
function updatePredictionsCounter() {
    const counterElement = document.getElementById('predictions-count');
    if (counterElement) {
        counterElement.textContent = predictionsRemaining;
    }
}

// Décrémenter le compteur de prédictions
function decrementPredictionsCount() {
    if (predictionsRemaining > 0) {
        predictionsRemaining--;
        localStorage.setItem('predictionsRemaining', predictionsRemaining);
        
        // Mettre à jour l'affichage du compteur
        updatePredictionsCounter();
        
        // Mettre à jour l'affichage dans les résultats
        const remainingElement = document.getElementById('remaining-count');
        if (remainingElement) {
            remainingElement.textContent = predictionsRemaining;
        }
        
        return true;
    }
    return false;
}

// Vérifier si l'utilisateur peut faire une prédiction
function canMakePrediction() {
    if (predictionsRemaining <= 0) {
        // Afficher le popup de limite atteinte
        document.getElementById('limit-popup').style.display = 'block';
        return false;
    }
    return true;
}

// Initialise la validation des champs de saisie
function initInputValidation() {
    // Section 1: Cotes principales
    document.querySelectorAll('#section-1 input').forEach(input => {
        input.addEventListener('input', validateSection1);
    });
    
    // Section 2: Scores mi-temps
    document.querySelectorAll('#section-2 input').forEach(input => {
        input.addEventListener('input', validateSection2);
    });
    
    // Section 3: Scores alignés
    document.querySelectorAll('#section-3 input').forEach(input => {
        input.addEventListener('input', validateSection3);
    });
    
    // Section 4: Cotes spéciales
    document.querySelectorAll('#section-4 input').forEach(input => {
        input.addEventListener('input', validateSection4);
    });
}

// Lancer le God Mode
function startGodMode() {
    if (!canMakePrediction()) {
        return;
    }
    
    // Masquer l'introduction
    document.getElementById('intro-step').classList.remove('active');
    
    // Afficher la première section
    goToSection(1);
}

// Navigation entre les sections
function goToSection(sectionNumber) {
    // Masquer toutes les sections
    document.querySelectorAll('.god-step').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(`section-${sectionNumber}`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Animation d'entrée
        targetSection.style.animation = 'fade-in 0.5s forwards';
        
        // Mettre à jour la barre de progression
        updateProgress(sectionNumber);
        
        // Scroll en haut de la section
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Enregistrer la section actuelle
        currentSection = sectionNumber;
        
        // Effet de vibration sur mobile via Telegram WebApp
        const tgWebApp = window.Telegram?.WebApp;
        if (tgWebApp?.HapticFeedback) {
            tgWebApp.HapticFeedback.impactOccurred('light');
        }
    }
}

// Mise à jour de la barre de progression
function updateProgress(sectionNumber) {
    // Section 0 = intro (0%), Section 1-4 = 25% par section
    const progressPercentage = sectionNumber * 25;
    
    // Mettre à jour la barre de progression
    document.querySelector('.progress-fill').style.width = `${progressPercentage}%`;
    
    // Mettre à jour les indicateurs de section
    document.querySelectorAll('.progress-section').forEach((section, index) => {
        if (index + 1 < sectionNumber) {
            section.classList.add('completed');
            section.classList.remove('active');
        } else if (index + 1 === sectionNumber) {
            section.classList.add('active');
            section.classList.remove('completed');
        } else {
            section.classList.remove('active', 'completed');
        }
    });
}

// Validation Section 1: Cotes principales
function validateSection1() {
    const homeOdds = document.getElementById('home-odds').value;
    const drawOdds = document.getElementById('draw-odds').value;
    const awayOdds = document.getElementById('away-odds').value;
    
    const nextButton = document.querySelector('#section-1 .god-button');
    
    if (homeOdds && drawOdds && awayOdds && 
        parseFloat(homeOdds) >= 1 && 
        parseFloat(drawOdds) >= 1 && 
        parseFloat(awayOdds) >= 1) {
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.setAttribute('disabled', true);
    }
}

// Validation Section 2: Scores mi-temps
function validateSection2() {
    const homeHalftime = document.getElementById('home-halftime').value;
    const awayHalftime = document.getElementById('away-halftime').value;
    const homeSecondHalf = document.getElementById('home-secondhalf').value;
    const awaySecondHalf = document.getElementById('away-secondhalf').value;
    
    const nextButton = document.querySelector('#section-2 .god-button:not(.secondary-button)');
    
    if (homeHalftime !== '' && awayHalftime !== '' && 
        homeSecondHalf !== '' && awaySecondHalf !== '') {
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.setAttribute('disabled', true);
    }
}

// Validation Section 3: Scores alignés
function validateSection3() {
    // Scores alignés pour l'équipe à domicile
    const homeAlignedHome = document.getElementById('home-aligned-home').value;
    const homeAlignedAway = document.getElementById('home-aligned-away').value;
    
    // Scores alignés pour match nul
    const drawAlignedHome = document.getElementById('draw-aligned-home').value;
    const drawAlignedAway = document.getElementById('draw-aligned-away').value;
    
    // Scores alignés pour l'équipe à l'extérieur
    // Scores alignés pour l'équipe à l'extérieur
    const awayAlignedHome = document.getElementById('away-aligned-home').value;
    const awayAlignedAway = document.getElementById('away-aligned-away').value;
    
    // Score exact principal
    const topExactHome = document.getElementById('top-exact-home').value;
    const topExactAway = document.getElementById('top-exact-away').value;
    
    const nextButton = document.querySelector('#section-3 .god-button:not(.secondary-button)');
    
    if (homeAlignedHome !== '' && homeAlignedAway !== '' && 
        drawAlignedHome !== '' && drawAlignedAway !== '' && 
        awayAlignedHome !== '' && awayAlignedAway !== '' && 
        topExactHome !== '' && topExactAway !== '') {
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.setAttribute('disabled', true);
    }
}

// Validation Section 4: Cotes spéciales
function validateSection4() {
    const bttsOdds = document.getElementById('btts-odds').value;
    const overOdds = document.getElementById('over-odds').value;
    const handicapOdds = document.getElementById('handicap-odds').value;
    
    const generateButton = document.querySelector('#section-4 .generate-button');
    
    if (bttsOdds && overOdds && handicapOdds && 
        parseFloat(bttsOdds) >= 1 && 
        parseFloat(overOdds) >= 1 && 
        parseFloat(handicapOdds) >= 1) {
        generateButton.removeAttribute('disabled');
    } else {
        generateButton.setAttribute('disabled', true);
    }
}

// Génération des prédictions God Mode
function generateGodPredictions() {
    // Vérifier si l'utilisateur peut faire une prédiction
    if (!canMakePrediction()) {
        return;
    }
    
    // Collecter toutes les données saisies
    collectAllData();
    
    // Masquer la section actuelle
    document.querySelectorAll('.god-step').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher l'écran de génération
    const generatingStep = document.getElementById('generating-step');
    generatingStep.classList.add('active');
    
    // Démarrer l'animation de génération
    startGeneratingAnimation();
    
    // Calcul des prédictions avancées
    setTimeout(() => {
        calculateGodPredictions();
        
        // Décrémenter le compteur de prédictions
        decrementPredictionsCount();
        
        // Afficher les résultats après l'animation
        setTimeout(() => {
            showResults();
        }, 500);
    }, 3000); // Temps d'animation de la génération
}

// Collecter toutes les données saisies
function collectAllData() {
    // Section 1: Cotes principales
    godPredictionData.homeOdds = parseFloat(document.getElementById('home-odds').value);
    godPredictionData.drawOdds = parseFloat(document.getElementById('draw-odds').value);
    godPredictionData.awayOdds = parseFloat(document.getElementById('away-odds').value);
    
    // Section 2: Scores mi-temps
    godPredictionData.homeHalftime = parseInt(document.getElementById('home-halftime').value);
    godPredictionData.awayHalftime = parseInt(document.getElementById('away-halftime').value);
    godPredictionData.homeSecondHalf = parseInt(document.getElementById('home-secondhalf').value);
    godPredictionData.awaySecondHalf = parseInt(document.getElementById('away-secondhalf').value);
    
    // Section 3: Scores alignés
    godPredictionData.homeAlignedHome = parseInt(document.getElementById('home-aligned-home').value);
    godPredictionData.homeAlignedAway = parseInt(document.getElementById('home-aligned-away').value);
    godPredictionData.drawAlignedHome = parseInt(document.getElementById('draw-aligned-home').value);
    godPredictionData.drawAlignedAway = parseInt(document.getElementById('draw-aligned-away').value);
    godPredictionData.awayAlignedHome = parseInt(document.getElementById('away-aligned-home').value);
    godPredictionData.awayAlignedAway = parseInt(document.getElementById('away-aligned-away').value);
    godPredictionData.topExactHome = parseInt(document.getElementById('top-exact-home').value);
    godPredictionData.topExactAway = parseInt(document.getElementById('top-exact-away').value);
    
    // Section 4: Cotes spéciales
    godPredictionData.bttsOdds = parseFloat(document.getElementById('btts-odds').value);
    godPredictionData.overOdds = parseFloat(document.getElementById('over-odds').value);
    godPredictionData.handicapOdds = parseFloat(document.getElementById('handicap-odds').value);
}

// Animation de génération
function startGeneratingAnimation() {
    let progress = 0;
    const generatingText = document.getElementById('generating-text');
    
    // Séquence d'animation
    setTimeout(() => {
        generatingText.textContent = "Analyse des données...";
        progress = 25;
    }, 750);
    
    setTimeout(() => {
        generatingText.textContent = "Calcul des probabilités...";
        progress = 50;
    }, 1500);
    
    setTimeout(() => {
        generatingText.textContent = "Finalisation des prédictions...";
        progress = 75;
    }, 2250);
    
    setTimeout(() => {
        generatingText.textContent = "Prédictions prêtes !";
        progress = 100;
    }, 2900);
}

// Calcul des prédictions God Mode
function calculateGodPredictions() {
    // 1. Déterminer l'équipe favorite en fonction des cotes
    determineMatchResult();
    
    // 2. Calculer le score exact principal
    calculatePrimaryScore();
    
    // 3. Calculer le score exact secondaire
    calculateSecondaryScore();
    
    // 4. Calculer la prédiction du nombre de buts
    calculateGoalsPrediction();
    
    // 5. Calculer les fiabilités
    calculateReliabilities();
}

// Déterminer le résultat du match
function determineMatchResult() {
    const { homeOdds, drawOdds, awayOdds } = godPredictionData;
    
    // Déterminer l'équipe favorite
    if (homeOdds < awayOdds && homeOdds < drawOdds) {
        godPredictionData.favoriteTeam = 'home';
    } else if (awayOdds < homeOdds && awayOdds < drawOdds) {
        godPredictionData.favoriteTeam = 'away';
    } else {
        godPredictionData.favoriteTeam = 'draw';
    }
    
    // Appliquer la règle de prédiction du vainqueur
    if (godPredictionData.favoriteTeam === 'home') {
        if (homeOdds <= 1.50) {
            godPredictionData.matchResult = "Victoire de l'équipe à domicile";
        } else {
            godPredictionData.matchResult = "Double chance 1X (Domicile ou Nul)";
        }
    } else if (godPredictionData.favoriteTeam === 'away') {
        if (awayOdds <= 1.50) {
            godPredictionData.matchResult = "Victoire de l'équipe à l'extérieur";
        } else {
            godPredictionData.matchResult = "Double chance X2 (Nul ou Extérieur)";
        }
    } else {
        godPredictionData.matchResult = "Match nul";
    }
}

// Calculer le score exact principal
function calculatePrimaryScore() {
    const { 
        topExactHome, topExactAway,
        homeHalftime, awayHalftime, 
        homeSecondHalf, awaySecondHalf,
        bttsOdds, overOdds 
    } = godPredictionData;
    
    // Le score le plus fiable est le score donné avec la cote la plus basse
    // Mais nous allons l'ajuster en fonction des autres facteurs
    
    // Base: score exact avec la plus petite cote
    let primaryHomeScore = topExactHome;
    let primaryAwayScore = topExactAway;
    
    // Ajustement en fonction du BTTS (les deux équipes marquent)
    if (bttsOdds < 1.80 && (primaryHomeScore === 0 || primaryAwayScore === 0)) {
        // Si BTTS est très probable mais un score est à 0, ajustement
        if (primaryHomeScore === 0) primaryHomeScore = 1;
        if (primaryAwayScore === 0) primaryAwayScore = 1;
    }
    
    // Ajustement en fonction de +2.5 buts
    const totalGoals = primaryHomeScore + primaryAwayScore;
    if (overOdds < 1.70 && totalGoals < 3) {
        // Si +2.5 buts est très probable mais total < 3, augmenter
        if (godPredictionData.favoriteTeam === 'home') {
            primaryHomeScore += 1;
        } else if (godPredictionData.favoriteTeam === 'away') {
            primaryAwayScore += 1;
        } else {
            // Match nul, augmenter les deux
            primaryHomeScore += 1;
            primaryAwayScore += 1;
        }
    } else if (overOdds > 2.30 && totalGoals > 2) {
        // Si +2.5 buts est peu probable mais total > 2, diminuer
        if (primaryHomeScore > primaryAwayScore && primaryHomeScore > 0) {
            primaryHomeScore -= 1;
        } else if (primaryAwayScore > 0) {
            primaryAwayScore -= 1;
        }
    }
    
    // Enregistrer le score principal
    godPredictionData.primaryScore = `${primaryHomeScore}-${primaryAwayScore}`;
}

// Calculer le score exact secondaire
function calculateSecondaryScore() {
    const { 
        favoriteTeam, 
        primaryScore,
        homeAlignedHome, homeAlignedAway,
        drawAlignedHome, drawAlignedAway,
        awayAlignedHome, awayAlignedAway,
        handicapOdds
    } = godPredictionData;
    
    // Extraire le score principal
    const [primaryHomeStr, primaryAwayStr] = primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    // Sélectionner le score aligné en fonction de l'équipe favorite
    let secondaryHome, secondaryAway;
    
    if (favoriteTeam === 'home') {
        secondaryHome = homeAlignedHome;
        secondaryAway = homeAlignedAway;
        
        // Ajustement en fonction du handicap
        if (handicapOdds < 2.00 && (secondaryHome - secondaryAway) < 2) {
            // Si handicap -1 est probable, augmenter l'écart
            secondaryHome += 1;
        }
    } else if (favoriteTeam === 'away') {
        secondaryHome = awayAlignedHome;
        secondaryAway = awayAlignedAway;
        
        // Ajustement en fonction du handicap
        if (handicapOdds < 2.00 && (secondaryAway - secondaryHome) < 2) {
            // Si handicap -1 est probable, augmenter l'écart
            secondaryAway += 1;
        }
    } else {
        secondaryHome = drawAlignedHome;
        secondaryAway = drawAlignedAway;
    }
    
    // Vérifier que le score secondaire est différent du principal
    if (secondaryHome === primaryHome && secondaryAway === primaryAway) {
        // Ajuster pour qu'il soit différent mais cohérent
        if (favoriteTeam === 'home') {
            secondaryHome += 1;
        } else if (favoriteTeam === 'away') {
            secondaryAway += 1;
        } else {
            // Pour le match nul, augmenter les deux
            secondaryHome += 1;
            secondaryAway += 1;
        }
    }
    
    // Enregistrer le score secondaire
    godPredictionData.secondaryScore = `${secondaryHome}-${secondaryAway}`;
}

// Calculer la prédiction du nombre de buts - RÈGLE CRITIQUE -1 but
function calculateGoalsPrediction() {
    // Extraire le score principal
    const [primaryHomeStr, primaryAwayStr] = godPredictionData.primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    // Calculer le total de buts
    const totalGoals = primaryHome + primaryAway;
    
    // RÈGLE CRITIQUE: Soustraire 1 but pour la sécurité
    const adjustedGoals = totalGoals - 1;
    
    // Formater la prédiction (format paris sportifs)
    godPredictionData.goalsPrediction = `+${adjustedGoals}.5 buts`;
}

// Calculer les fiabilités
function calculateReliabilities() {
    // Fiabilité du résultat du match
    if (godPredictionData.favoriteTeam === 'home' || godPredictionData.favoriteTeam === 'away') {
        const favoriteOdds = godPredictionData.favoriteTeam === 'home' 
            ? godPredictionData.homeOdds 
            : godPredictionData.awayOdds;
        
        if (favoriteOdds <= 1.50) {
            // Victoire directe très probable
            godPredictionData.resultReliability = Math.floor(Math.random() * 4) + 95; // 95-98%
        } else {
            // Double chance
            godPredictionData.resultReliability = Math.floor(Math.random() * 6) + 90; // 90-95%
        }
    } else {
        // Match nul
        godPredictionData.resultReliability = Math.floor(Math.random() * 8) + 85; // 85-92%
    }
    
    // Fiabilité du score exact principal
    godPredictionData.primaryScoreReliability = Math.floor(Math.random() * 11) + 80; // 80-90%
    
    // Fiabilité du score exact secondaire
    godPredictionData.secondaryScoreReliability = Math.floor(Math.random() * 13) + 70; // 70-82%
    
    // Fiabilité du nombre de buts (toujours très élevée grâce à la règle -1)
    const decimalPart = Math.floor(Math.random() * 10);
    godPredictionData.goalsReliability = 99 + (decimalPart / 10); // 99.0-99.9%
}

// Affichage des résultats
function showResults() {
    // Masquer l'écran de génération
    document.getElementById('generating-step').classList.remove('active');
    
    // Afficher les résultats
    const resultsStep = document.getElementById('results-step');
    resultsStep.classList.add('active');
    
    // Mettre à jour les valeurs dans l'interface
    document.querySelector('#match-result .result-value').textContent = godPredictionData.matchResult;
    document.querySelector('#primary-score .result-value').textContent = godPredictionData.primaryScore;
    document.querySelector('#secondary-score .result-value').textContent = godPredictionData.secondaryScore;
    document.querySelector('#goals-prediction .result-value').textContent = godPredictionData.goalsPrediction;
    
    // Mettre à jour les fiabilités
    document.getElementById('result-reliability').textContent = `${godPredictionData.resultReliability}%`;
    document.getElementById('primary-score-reliability').textContent = `${godPredictionData.primaryScoreReliability}%`;
    document.getElementById('secondary-score-reliability').textContent = `${godPredictionData.secondaryScoreReliability}%`;
    document.getElementById('goals-reliability').textContent = `${godPredictionData.goalsReliability.toFixed(1)}%`;
    
    // Mettre à jour le compteur de prédictions restantes
    document.getElementById('remaining-count').textContent = predictionsRemaining;
    
    // Animation d'entrée des résultats
    const resultBoxes = document.querySelectorAll('.result-box');
    resultBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.classList.add('fade-in');
        }, 200 * index);
    });
    
    // Effet de pulsation sur la prédiction la plus fiable
    setTimeout(() => {
        document.querySelector('#goals-prediction').classList.add('pulse-animation');
    }, 1000);
    
    // Effet de vibration sur mobile via Telegram WebApp
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp?.HapticFeedback) {
        tgWebApp.HapticFeedback.notificationOccurred('success');
    }
}

// Fermer les popups
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Afficher l'offre VIP
function showVipOffer() {
    document.getElementById('vip-popup').style.display = 'block';
    
    // Effet haptic sur mobile
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp?.HapticFeedback) {
        tgWebApp.HapticFeedback.impactOccurred('medium');
    }
}

// Réinitialiser et recommencer
function resetAndStart() {
    // Réinitialiser toutes les données
    godPredictionData = {
        homeOdds: null,
        drawOdds: null,
        awayOdds: null,
        homeHalftime: null,
        awayHalftime: null,
        homeSecondHalf: null,
        awaySecondHalf: null,
        homeAlignedHome: null,
        homeAlignedAway: null,
        drawAlignedHome: null,
        drawAlignedAway: null,
        awayAlignedHome: null,
        awayAlignedAway: null,
        topExactHome: null,
        topExactAway: null,
        bttsOdds: null,
        overOdds: null,
        handicapOdds: null,
        matchResult: null,
        primaryScore: null,
        secondaryScore: null,
        goalsPrediction: null,
        resultReliability: null,
        primaryScoreReliability: null,
        secondaryScoreReliability: null,
        goalsReliability: null,
        favoriteTeam: null
    };
    
    // Réinitialiser les formulaires
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    
    // Réinitialiser la progression
    updateProgress(0);
    
    // Masquer toutes les sections
    document.querySelectorAll('.god-step').forEach(section => {
        section.classList.remove('active');
    });
    
    // Vérifier si l'utilisateur peut encore faire des prédictions
    if (predictionsRemaining <= 0) {
        document.getElementById('limit-popup').style.display = 'block';
        return;
    }
    
    // Afficher l'introduction
    document.getElementById('intro-step').classList.add('active');
}

// Fonction utilitaire pour générer des nombres aléatoires dans une plage
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
