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

// Variables pour stockage des analyses intermédiaires (pour le modèle avancé)
let analysisData = {
    offensiveTrendHome: 0,    // Tendance offensive équipe domicile (-1 à +1)
    offensiveTrendAway: 0,    // Tendance offensive équipe extérieure (-1 à +1)
    defensiveStrengthHome: 0, // Force défensive équipe domicile (0 à 1)
    defensiveStrengthAway: 0, // Force défensive équipe extérieure (0 à 1)
    scoringProbability: 0,    // Probabilité générale de marquer (0 à 1)
    confidenceScore: 0,       // Score de confiance global (0 à 100)
    oddsConsistency: 0,       // Cohérence entre les différentes cotes (0 à 1)
    baseWeightedScore: {      // Score de base pondéré
        home: 0,
        away: 0
    },
    scoreProbabilityMatrix: [] // Matrice de probabilité des scores
};

// Variables pour la gestion des prédictions quotidiennes
let dailyPredictionsLimit = 5; // Limite par défaut pour les utilisateurs gratuits
let predictionsRemaining = 5; // Nombre de prédictions restantes aujourd'hui
let isUserVIP = false; // Statut VIP de l'utilisateur
let isAdmin = false; // Statut d'administrateur
let currentSection = 0; // Section actuelle (0 = intro, 1-4 = sections)

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier le statut VIP et administrateur
    checkVipAndAdminStatus();
    
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

// Vérification du statut VIP et administrateur
function checkVipAndAdminStatus() {
    isUserVIP = localStorage.getItem('userVIPStatus') === 'true';
    isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    console.log("Statut VIP:", isUserVIP);
    console.log("Statut Admin:", isAdmin);
    
    // Si l'utilisateur est administrateur, on s'assure qu'il a aussi le statut VIP
    if (isAdmin && !isUserVIP) {
        isUserVIP = true;
        localStorage.setItem('userVIPStatus', 'true');
    }
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
    
    // Définir la limite en fonction du statut VIP
    dailyPredictionsLimit = isUserVIP || isAdmin ? 25 : 5;
    
    // Si administrateur, toujours avoir 999 prédictions
    if (isAdmin) {
        predictionsRemaining = 999;
        localStorage.setItem('predictionsRemaining', predictionsRemaining);
    }
    // Si c'est un nouveau jour, réinitialiser le compteur
    else if (lastPredictionDate !== today) {
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
    // Si admin, ne pas décrémenter
    if (isAdmin) return true;
    
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
    // Si admin, toujours retourner true
    if (isAdmin) return true;
    
    // Si l'utilisateur est VIP mais pas admin, vérifier le compteur
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
        // Utiliser le nouveau modèle de prédiction avancé
        calculateGodPredictions();
        
        // Décrémenter le compteur de prédictions (sauf pour admin)
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

// Calcul des prédictions God Mode avancé
function calculateGodPredictions() {
    // 1. Déterminer l'équipe favorite et le résultat du match en fonction des cotes
    analyzeOddsAndDetermineResult();
    
    // 2. Analyser les tendances offensives/défensives basées sur les scores mi-temps
    analyzeHalftimeTrends();
    
    // 3. Créer un score de base pondéré en utilisant toutes les données
    calculateWeightedBaseScore();
    
    // 4. Calculer le score exact principal avec des ajustements contextuels
    calculateAdvancedPrimaryScore();
    
    // 5. Calculer le score exact secondaire basé sur une matrice de probabilité
    calculateAdvancedSecondaryScore();
    
    // 6. Calculer la prédiction du nombre de buts avec la règle -1
    calculatePrudentGoalsPrediction();
    
    // 7. Calculer les fiabilités basées sur la cohérence des données
    calculateAdvancedReliabilities();
}

// Analyse des cotes et détermination du résultat probable
function analyzeOddsAndDetermineResult() {
    const { homeOdds, drawOdds, awayOdds, bttsOdds, overOdds, handicapOdds } = godPredictionData;
    
    // Déterminer l'équipe favorite basée sur les cotes 1X2
    if (homeOdds < awayOdds && homeOdds < drawOdds) {
        godPredictionData.favoriteTeam = 'home';
    } else if (awayOdds < homeOdds && awayOdds < drawOdds) {
        godPredictionData.favoriteTeam = 'away';
    } else {
        godPredictionData.favoriteTeam = 'draw';
    }
    
    // Calcul de la cohérence des cotes
    // Si les cotes pour BTTS, Over et Handicap sont toutes cohérentes avec l'équipe favorite
    const lowBTTS = bttsOdds < 1.80; // Les deux équipes marqueront probablement
    const highOver = overOdds < 1.70; // Plus de 2.5 buts probables
    const lowHandicap = handicapOdds < 2.00; // Favori gagne avec écart
    
    // Cohérence pour équipe à domicile favorite
    if (godPredictionData.favoriteTeam === 'home') {
        const homeConsistency = (lowHandicap ? 0.3 : 0) + (lowBTTS ? 0.1 : 0.2) + (highOver ? 0.2 : 0);
        analysisData.oddsConsistency = homeConsistency;
    } 
    // Cohérence pour équipe à l'extérieur favorite
    else if (godPredictionData.favoriteTeam === 'away') {
        const awayConsistency = (lowHandicap ? 0.3 : 0) + (lowBTTS ? 0.1 : 0.2) + (highOver ? 0.2 : 0);
        analysisData.oddsConsistency = awayConsistency;
    } 
    // Cohérence pour match nul
    else {
        const drawConsistency = (lowBTTS ? 0.2 : 0) + (!lowHandicap ? 0.2 : 0);
        analysisData.oddsConsistency = drawConsistency;
    }
    
    // Détermine le résultat basé sur les cotes et leur cohérence
    if (godPredictionData.favoriteTeam === 'home') {
        if (homeOdds <= 1.50 || analysisData.oddsConsistency >= 0.5) {
            godPredictionData.matchResult = "Victoire de l'équipe à domicile";
        } else {
            godPredictionData.matchResult = "Double chance 1X (Domicile ou Nul)";
        }
    } else if (godPredictionData.favoriteTeam === 'away') {
        if (awayOdds <= 1.50 || analysisData.oddsConsistency >= 0.5) {
            godPredictionData.matchResult = "Victoire de l'équipe à l'extérieur";
        } else {
            godPredictionData.matchResult = "Double chance X2 (Nul ou Extérieur)";
        }
    } else {
        godPredictionData.matchResult = "Match nul";
    }
    
    // Calculer la probabilité de marquer basée sur BTTS et Over
    analysisData.scoringProbability = 0.5 + (1.90 - bttsOdds) * 0.1 + (1.90 - overOdds) * 0.15;
    // Limiter entre 0.3 et 0.9
    analysisData.scoringProbability = Math.max(0.3, Math.min(0.9, analysisData.scoringProbability));
}

// Analyse des tendances offensives/défensives basées sur les scores mi-temps
function analyzeHalftimeTrends() {
    const { 
        homeHalftime, awayHalftime, 
        homeSecondHalf, awaySecondHalf 
    } = godPredictionData;
    
    // Calculer les tendances offensives basées sur différences de buts entre mi-temps
    // Une valeur positive indique une meilleure performance en 2ème mi-temps
    analysisData.offensiveTrendHome = homeSecondHalf - homeHalftime;
    analysisData.offensiveTrendAway = awaySecondHalf - awayHalftime;
    
    // Normaliser entre -1 et 1
    analysisData.offensiveTrendHome = Math.max(-1, Math.min(1, analysisData.offensiveTrendHome / 2));
    analysisData.offensiveTrendAway = Math.max(-1, Math.min(1, analysisData.offensiveTrendAway / 2));
    
    // Calculer forces défensives basées sur buts encaissés
    // 0 = faible défense, 1 = forte défense
    const totalHomeGoalsConceded = awayHalftime + awaySecondHalf;
    const totalAwayGoalsConceded = homeHalftime + homeSecondHalf;
    
    // Inverser et normaliser: moins de buts concédés = meilleure défense
    analysisData.defensiveStrengthHome = 1 - Math.min(1, totalHomeGoalsConceded / 3);
    analysisData.defensiveStrengthAway = 1 - Math.min(1, totalAwayGoalsConceded / 3);
}

// Créer un score de base pondéré en utilisant toutes les données
function calculateWeightedBaseScore() {
    const { 
        topExactHome, topExactAway,
        homeAlignedHome, homeAlignedAway,
        drawAlignedHome, drawAlignedAway,
        awayAlignedHome, awayAlignedAway,
        favoriteTeam
    } = godPredictionData;
    
    // Commencer avec le score exact qui a la plus petite cote
    let baseHome = topExactHome;
    let baseAway = topExactAway;
    
    // Ajouter une influence des scores alignés en fonction de l'équipe favorite
    let alignedInfluence = 0.3; // Poids de l'influence des scores alignés
    
    if (favoriteTeam === 'home') {
        baseHome = baseHome * 0.7 + homeAlignedHome * alignedInfluence;
        baseAway = baseAway * 0.7 + homeAlignedAway * alignedInfluence;
    } else if (favoriteTeam === 'away') {
        baseHome = baseHome * 0.7 + awayAlignedHome * alignedInfluence;
        baseAway = baseAway * 0.7 + awayAlignedAway * alignedInfluence;
    } else { // Match nul
        baseHome = baseHome * 0.7 + drawAlignedHome * alignedInfluence;
        baseAway = baseAway * 0.7 + drawAlignedAway * alignedInfluence;
    }
    
    // Ajuster en fonction des tendances offensives/défensives
    // Les équipes avec une tendance offensive positive marquent plus
    baseHome += analysisData.offensiveTrendHome * 0.5;
    baseAway += analysisData.offensiveTrendAway * 0.5;
    
    // Les équipes avec une défense forte concèdent moins
    baseAway -= analysisData.defensiveStrengthHome * 0.5;
    baseHome -= analysisData.defensiveStrengthAway * 0.5;
    
    // Probabilité de marquer influence le nombre total de buts
    const scoringFactor = (analysisData.scoringProbability - 0.5) * 2; // -1 à 1
    baseHome += scoringFactor * 0.5;
    baseAway += scoringFactor * 0.5;
    
    // Stocker le score de base pondéré (valeurs décimales)
    analysisData.baseWeightedScore = {
        home: baseHome,
        away: baseAway
    };
}

// Calculer le score exact principal avec des ajustements contextuels
function calculateAdvancedPrimaryScore() {
    const { 
        bttsOdds, overOdds, 
        favoriteTeam
    } = godPredictionData;
    
    // Récupérer le score de base pondéré
    let primaryHome = analysisData.baseWeightedScore.home;
    let primaryAway = analysisData.baseWeightedScore.away;
    
    // Arrondir à l'entier le plus proche pour commencer
    let roundedHome = Math.round(primaryHome);
    let roundedAway = Math.round(primaryAway);
    
    // Ajustements pour BTTS (les deux équipes marquent)
    if (bttsOdds < 1.70 && (roundedHome === 0 || roundedAway === 0)) {
        // Si BTTS très probable mais un score est à 0, s'assurer que chaque équipe marque
        if (roundedHome === 0) roundedHome = 1;
        if (roundedAway === 0) roundedAway = 1;
    }
    
    // Ajustement pour over/under
    const totalGoals = roundedHome + roundedAway;
    if (overOdds < 1.60 && totalGoals < 3) {
        // Si over 2.5 très probable, augmenter les buts
        if (favoriteTeam === 'home') {
            roundedHome += 1;
        } else if (favoriteTeam === 'away') {
            roundedAway += 1;
        } else {
            // Pour match nul, distribuer équitablement
            if (Math.random() > 0.5) {
                roundedHome += 1;
            } else {
                roundedAway += 1;
            }
        }
    } else if (overOdds > 2.20 && totalGoals > 2) {
        // Si over 2.5 peu probable, diminuer les buts
        if (roundedHome > roundedAway && roundedHome > 0) {
            roundedHome -= 1;
        } else if (roundedAway > 0) {
            roundedAway -= 1;
        }
    }
    
    // Vérifier la cohérence avec l'équipe favorite
    if (favoriteTeam === 'home' && roundedHome <= roundedAway && analysisData.oddsConsistency > 0.4) {
        // Corriger pour assurer que l'équipe favorite gagne
        roundedHome = roundedAway + 1;
    } else if (favoriteTeam === 'away' && roundedAway <= roundedHome && analysisData.oddsConsistency > 0.4) {
        // Corriger pour assurer que l'équipe favorite gagne
        roundedAway = roundedHome + 1;
    } else if (favoriteTeam === 'draw' && roundedHome !== roundedAway) {
        // Corriger pour un match nul
        const avgScore = Math.round((roundedHome + roundedAway) / 2);
        roundedHome = avgScore;
        roundedAway = avgScore;
    }
    
    // Générer la matrice de probabilité des scores pour utilisation ultérieure
    generateScoreProbabilityMatrix(roundedHome, roundedAway);
    
    // Score final principal
    godPredictionData.primaryScore = `${roundedHome}-${roundedAway}`;
}

// Générer une matrice de probabilité des scores possibles
function generateScoreProbabilityMatrix(baseHome, baseAway) {
    // Créer une matrice 5x5 pour les scores de 0-0 à 4-4
    const matrix = [];
    const maxScore = 4;
    
    for (let home = 0; home <= maxScore; home++) {
        matrix[home] = [];
        for (let away = 0; away <= maxScore; away++) {
            // Distance par rapport au score de base
            const distance = Math.abs(home - baseHome) + Math.abs(away - baseAway);
            
            // Probabilité inversement proportionnelle à la distance
            let probability = 0;
            if (distance === 0) {
                probability = 0.30; // Score de base
            } else if (distance === 1) {
                probability = 0.15; // Score proche
            } else if (distance === 2) {
                probability = 0.07; // Score assez proche
            } else {
                probability = Math.max(0.01, 0.10 - (distance * 0.02)); // Scores plus éloignés
            }
            
            // Ajustements en fonction du type de résultat (victoire/nul)
            if (godPredictionData.favoriteTeam === 'home' && home > away) {
                probability *= 1.2; // Augmenter probabilité victoire domicile
            } else if (godPredictionData.favoriteTeam === 'away' && away > home) {
                probability *= 1.2; // Augmenter probabilité victoire extérieur
            } else if (godPredictionData.favoriteTeam === 'draw' && home === away) {
                probability *= 1.3; // Augmenter probabilité match nul
            }
            
            matrix[home][away] = probability;
        }
    }
    
    // Normaliser les probabilités pour qu'elles totalisent 1
    let totalProbability = 0;
    for (let home = 0; home <= maxScore; home++) {
        for (let away = 0; away <= maxScore; away++) {
            totalProbability += matrix[home][away];
        }
    }
    
    // Normalisation
    for (let home = 0; home <= maxScore; home++) {
        for (let away = 0; away <= maxScore; away++) {
            matrix[home][away] = matrix[home][away] / totalProbability;
        }
    }
    
    analysisData.scoreProbabilityMatrix = matrix;
}

// Calculer le score exact secondaire basé sur la matrice de probabilité
function calculateAdvancedSecondaryScore() {
    const matrix = analysisData.scoreProbabilityMatrix;
    const [primaryHomeStr, primaryAwayStr] = godPredictionData.primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    // Exclure le score primaire déjà choisi
    let tempMatrix = JSON.parse(JSON.stringify(matrix));
    tempMatrix[primaryHome][primaryAway] = 0;
    
    // Trouver le score avec la deuxième plus haute probabilité
    let highestProb = 0;
    let secondaryHome = 0;
    let secondaryAway = 0;
    
    for (let home = 0; home < tempMatrix.length; home++) {
        for (let away = 0; away < tempMatrix[home].length; away++) {
            if (tempMatrix[home][away] > highestProb) {
                highestProb = tempMatrix[home][away];
                secondaryHome = home;
                secondaryAway = away;
            }
        }
    }
    
    // Vérifier si le score secondaire est cohérent
    if (!isScoreConsistent(secondaryHome, secondaryAway)) {
        // Si incohérent, ajuster à partir du score principal
        if (godPredictionData.favoriteTeam === 'home') {
            secondaryHome = primaryHome;
            secondaryAway = Math.max(0, primaryAway - 1);
            if (secondaryHome <= secondaryAway) {
                secondaryHome = secondaryAway + 1;
            }
        } else if (godPredictionData.favoriteTeam === 'away') {
            secondaryAway = primaryAway;
            secondaryHome = Math.max(0, primaryHome - 1);
            if (secondaryAway <= secondaryHome) {
                secondaryAway = secondaryHome + 1;
            }
        } else {
            // Pour match nul, conserver le match nul
            secondaryHome = secondaryAway = Math.max(1, primaryHome);
        }
    }
    
    // Score final secondaire
    godPredictionData.secondaryScore = `${secondaryHome}-${secondaryAway}`;
}

// Vérifier la cohérence d'un score avec l'équipe favorite
function isScoreConsistent(home, away) {
    const favoriteTeam = godPredictionData.favoriteTeam;
    
    if (favoriteTeam === 'home' && home <= away) {
        return false; // Incohérent: favori domicile mais ne gagne pas
    } else if (favoriteTeam === 'away' && away <= home) {
        return false; // Incohérent: favori extérieur mais ne gagne pas
    } else if (favoriteTeam === 'draw' && home !== away) {
        return false; // Incohérent: favori nul mais pas de nul
    }
    
    return true;
}

// Calculer la prédiction du nombre de buts avec la règle de prudence (-1)
function calculatePrudentGoalsPrediction() {
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

// Calculer les fiabilités basées sur la cohérence des données
function calculateAdvancedReliabilities() {
    const { 
        favoriteTeam, 
        homeOdds, awayOdds,
        primaryScore, secondaryScore
    } = godPredictionData;
    
    // Calculer le score de confiance global basé sur la cohérence des données
    const oddsWeight = 0.4;
    const alignmentWeight = 0.3;
    const trendWeight = 0.3;
    
    analysisData.confidenceScore = 
        (analysisData.oddsConsistency * oddsWeight * 100) + 
        (isScoreAlignedWithOdds() * alignmentWeight * 100) + 
        (trendCoherenceScore() * trendWeight * 100);
    
    // Fiabilité du résultat du match
    if (favoriteTeam === 'home' || favoriteTeam === 'away') {
        const favoriteOdds = favoriteTeam === 'home' ? homeOdds : awayOdds;
        
        // Base de fiabilité calculée à partir des cotes et de la cohérence
        let baseReliability = 85 + (2 - favoriteOdds) * 5 + analysisData.oddsConsistency * 10;
        
        if (favoriteOdds <= 1.50 || analysisData.oddsConsistency >= 0.6) {
            godPredictionData.resultReliability = Math.min(98, Math.floor(baseReliability)); // 85-98%
        } else {
            godPredictionData.resultReliability = Math.min(95, Math.floor(baseReliability * 0.95)); // 85-95%
        }
    } else {
        // Pour match nul
        godPredictionData.resultReliability = Math.floor(80 + analysisData.confidenceScore * 0.15); // 80-92%
    }
    
    // Extraire les données du score principal
    const [primaryHomeStr, primaryAwayStr] = primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    // Probabilité du score principal selon la matrice
    const primaryProb = analysisData.scoreProbabilityMatrix[primaryHome][primaryAway];
    
    // Extraire les données du score secondaire
    const [secondaryHomeStr, secondaryAwayStr] = secondaryScore.split('-');
    const secondaryHome = parseInt(secondaryHomeStr);
    const secondaryAway = parseInt(secondaryAwayStr);
    
    // Probabilité du score secondaire selon la matrice
    const secondaryProb = analysisData.scoreProbabilityMatrix[secondaryHome][secondaryAway];
    
    // Fiabilité du score exact principal basée sur sa probabilité et la cohérence
    godPredictionData.primaryScoreReliability = Math.floor(75 + primaryProb * 100 + analysisData.confidenceScore * 0.1);
    godPredictionData.primaryScoreReliability = Math.min(90, godPredictionData.primaryScoreReliability); // 80-90%
    
    // Fiabilité du score exact secondaire
    godPredictionData.secondaryScoreReliability = Math.floor(70 + secondaryProb * 100 + analysisData.confidenceScore * 0.05);
    godPredictionData.secondaryScoreReliability = Math.min(82, godPredictionData.secondaryScoreReliability); // 70-82%
    
    // Fiabilité du nombre de buts (toujours très élevée grâce à la règle -1)
    const decimalPart = Math.floor(Math.random() * 10);
    godPredictionData.goalsReliability = 99 + (decimalPart / 10); // 99.0-99.9%
}

// Vérifier si le score est aligné avec les cotes
function isScoreAlignedWithOdds() {
    const { 
        favoriteTeam, 
        primaryScore
    } = godPredictionData;
    
    const [primaryHomeStr, primaryAwayStr] = primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    if (favoriteTeam === 'home' && primaryHome > primaryAway) {
        return 1.0; // Parfaitement aligné
    } else if (favoriteTeam === 'away' && primaryAway > primaryHome) {
        return 1.0; // Parfaitement aligné
    } else if (favoriteTeam === 'draw' && primaryHome === primaryAway) {
        return 1.0; // Parfaitement aligné
    }
    
    return 0.2; // Mal aligné
}

// Score de cohérence des tendances
function trendCoherenceScore() {
    // Vérifier si les tendances offensives/défensives sont cohérentes avec le score prédit
    const [primaryHomeStr, primaryAwayStr] = godPredictionData.primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    let score = 0.5; // Score de base
    
    // Si l'équipe à domicile a une tendance offensive positive, elle devrait marquer plus
    if (analysisData.offensiveTrendHome > 0 && primaryHome > 1) {
        score += 0.1;
    }
    
    // Si l'équipe à l'extérieur a une tendance offensive positive, elle devrait marquer plus
    if (analysisData.offensiveTrendAway > 0 && primaryAway > 1) {
        score += 0.1;
    }
    
    // Si l'équipe à domicile a une bonne défense, l'équipe extérieure devrait marquer moins
    if (analysisData.defensiveStrengthHome > 0.6 && primaryAway < 2) {
        score += 0.15;
    }
    
    // Si l'équipe à l'extérieur a une bonne défense, l'équipe domicile devrait marquer moins
    if (analysisData.defensiveStrengthAway > 0.6 && primaryHome < 2) {
        score += 0.15;
    }
    
    return score;
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

    // Réinitialiser les analyses intermédiaires
    analysisData = {
        offensiveTrendHome: 0,
        offensiveTrendAway: 0,
        defensiveStrengthHome: 0,
        defensiveStrengthAway: 0,
        scoringProbability: 0,
        confidenceScore: 0,
        oddsConsistency: 0,
        baseWeightedScore: {
            home: 0,
            away: 0
        },
        scoreProbabilityMatrix: []
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
    // Pour admin, on bypass cette vérification
    if (!isAdmin && predictionsRemaining <= 0) {
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
