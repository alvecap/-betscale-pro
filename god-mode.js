/**
 * God Mode - BetScale Pro
 * Script de gestion des prédictions avancées et navigation entre les sections
 * Version améliorée avec corrections des calculs de prédiction
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
    favoriteTeam: null, // "home", "away", ou "draw"
    favoriteStrength: null // Intensité de la préférence (0-1)
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
    expectedGoals: {          // xG calculés pour le match
        home: 0,
        away: 0
    },
    scoreProbabilityMatrix: [], // Matrice de probabilité des scores
    scoreThresholds: {        // Seuils pour les types de scores
        low: 1.5,             // Peu de buts
        medium: 2.5,          // Nombre de buts moyen
        high: 3.5             // Beaucoup de buts
    }
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
        // Utiliser le modèle de prédiction amélioré
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

// Calcul des prédictions God Mode amélioré
function calculateGodPredictions() {
    // 1. Analyser les cotes et déterminer le favori
    analyzeOddsAndDetermineFavorite();
    
    // 2. Calculer la probabilité de buts pour chaque équipe (Expected Goals)
    calculateExpectedGoals();
    
    // 3. Analyser les tendances offensives/défensives
    analyzeTeamTrends();
    
    // 4. Générer la matrice de probabilité des scores
    generateScoreProbabilityMatrix();
    
    // 5. Sélectionner les scores exacts les plus probables
    selectExactScores();
    
    // 6. Déterminer le résultat du match (1, X, 2) ou double chance (1X, X2)
    determineMatchResult();
    
    // 7. Calculer la prédiction du nombre de buts avec la règle -1 but (correctement)
    calculateCorrectGoalsPrediction();
    
    // 8. Calculer les fiabilités des prédictions
    calculatePredictionReliabilities();
}

// Analyse des cotes et détermination du favori
function analyzeOddsAndDetermineFavorite() {
    const { homeOdds, drawOdds, awayOdds } = godPredictionData;
    
    // Calculer l'écart entre les cotes pour déterminer la force de la préférence
    let oddsGap = 0;
    
    // Déterminer l'équipe favorite et l'écart des cotes
    if (homeOdds <= awayOdds && homeOdds <= drawOdds) {
        godPredictionData.favoriteTeam = 'home';
        oddsGap = Math.min(awayOdds - homeOdds, drawOdds - homeOdds);
    } else if (awayOdds <= homeOdds && awayOdds <= drawOdds) {
        godPredictionData.favoriteTeam = 'away';
        oddsGap = Math.min(homeOdds - awayOdds, drawOdds - awayOdds);
    } else {
        godPredictionData.favoriteTeam = 'draw';
        oddsGap = Math.min(homeOdds - drawOdds, awayOdds - drawOdds);
    }
    
    // Normaliser l'écart des cotes pour obtenir la force du favori (0-1)
    // Plus l'écart est grand, plus le favori est fort
    godPredictionData.favoriteStrength = Math.min(1, oddsGap / 2);
    
    // Calculer la cohérence des cotes spéciales avec le favori
    analyzeSpecialOddsConsistency();
}

// Analyse de la cohérence des cotes spéciales
function analyzeSpecialOddsConsistency() {
    const { favoriteTeam, bttsOdds, overOdds, handicapOdds } = godPredictionData;
    
    // Variables pour la cohérence
    let consistencyScore = 0;
    const lowBTTS = bttsOdds < 1.80; // Les deux équipes marqueront probablement
    const highBTTS = bttsOdds > 2.20; // Les deux équipes ne marqueront probablement pas
    const lowOver = overOdds < 1.80; // Plus de 2.5 buts très probables
    const highOver = overOdds > 2.20; // Plus de 2.5 buts peu probables
    const lowHandicap = handicapOdds < 2.20; // Favori gagne avec écart probable
    
    // Ajuster le niveau de scoring attendu en fonction des cotes
    if (lowOver) {
        analysisData.scoreThresholds.medium = 2.5; // Standard
        analysisData.scoreThresholds.high = 3.5;
    } else if (highOver) {
        analysisData.scoreThresholds.medium = 1.5; // Moins de buts attendus
        analysisData.scoreThresholds.high = 2.5;
    } else {
        analysisData.scoreThresholds.medium = 2.0; // Valeur intermédiaire
        analysisData.scoreThresholds.high = 3.0;
    }
    
    // Cohérence pour équipe à domicile favorite
    if (favoriteTeam === 'home') {
        // Une équipe à domicile favorite est généralement cohérente avec:
        // - Un handicap bas (victoire avec écart)
        // - BTTS bas si forte défense, BTTS élevé si faible défense
        // - Over bas (beaucoup de buts)
        consistencyScore = lowHandicap ? 0.3 : 0;
        consistencyScore += (lowOver) ? 0.3 : 0;
        
        // BTTS dépend du contexte - à affiner plus tard
        consistencyScore += 0.2;
    } 
    // Cohérence pour équipe à l'extérieur favorite
    else if (favoriteTeam === 'away') {
        // Une équipe à l'extérieur favorite est généralement cohérente avec:
        // - Un handicap bas (victoire avec écart)
        // - BTTS peut être haut ou bas
        // - Over souvent bas (beaucoup de buts)
        consistencyScore = lowHandicap ? 0.3 : 0;
        consistencyScore += (lowOver) ? 0.3 : 0;
        consistencyScore += 0.2;
    } 
    // Cohérence pour match nul
    else {
        // Un match nul favori est généralement cohérent avec:
        // - Un handicap élevé (pas de victoire avec écart)
        // - BTTS souvent bas (peu de buts de chaque côté)
        // - Over souvent élevé (peu de buts au total)
        consistencyScore = (!lowHandicap) ? 0.3 : 0;
        consistencyScore += (highOver) ? 0.3 : 0;
        consistencyScore += (highBTTS) ? 0.2 : 0;
    }
    
    // Ajuster la cohérence en fonction du BTTS
    if (favoriteTeam === 'home' || favoriteTeam === 'away') {
        // Pour une équipe favorite, un BTTS élevé est moins cohérent
        // avec une victoire franche
        if (lowBTTS && godPredictionData.favoriteStrength > 0.5) {
            consistencyScore += 0.2;
        }
    }
    
    // Stocker la cohérence des cotes
    analysisData.oddsConsistency = consistencyScore;
    
    // Calculer la probabilité de buts basée sur les cotes
    const bttsEffect = (2.0 - Math.min(2.0, bttsOdds)) * 0.15;
    const overEffect = (2.0 - Math.min(2.0, overOdds)) * 0.2;
    analysisData.scoringProbability = 0.5 + bttsEffect + overEffect;
    
    // Limiter entre 0.3 et 0.9
    analysisData.scoringProbability = Math.max(0.3, Math.min(0.9, analysisData.scoringProbability));
}

// Calcul des Expected Goals (xG) pour chaque équipe
function calculateExpectedGoals() {
    const {
        homeOdds, awayOdds, drawOdds,
        bttsOdds, overOdds,
        favoriteTeam, favoriteStrength
    } = godPredictionData;
    
    // Convertir les cotes en probabilités implicites
    const homeProb = 1 / homeOdds;
    const awayProb = 1 / awayOdds;
    const drawProb = 1 / drawOdds;
    
    // Base xG à partir des cotes principales
    let baseHomeXG = 1.2 * homeProb + 0.8 * (1 - awayProb);
    let baseAwayXG = 1.2 * awayProb + 0.8 * (1 - homeProb);
    
    // Ajuster xG en fonction de BTTS et Over/Under
    const bttsEffect = 2.0 - Math.min(2.0, bttsOdds);
    const overEffect = 2.0 - Math.min(2.0, overOdds);
    
    // Probabilité que les deux équipes marquent augmente les xG
    if (bttsOdds < 2.0) {
        baseHomeXG += bttsEffect * 0.2;
        baseAwayXG += bttsEffect * 0.2;
    }
    
    // Probabilité de plus de 2.5 buts augmente le total des xG
    if (overOdds < 2.0) {
        const totalXGBoost = overEffect * 0.5;
        // Répartir le boost en fonction du favori
        if (favoriteTeam === 'home') {
            baseHomeXG += totalXGBoost * 0.6;
            baseAwayXG += totalXGBoost * 0.4;
        } else if (favoriteTeam === 'away') {
            baseHomeXG += totalXGBoost * 0.4;
            baseAwayXG += totalXGBoost * 0.6;
        } else {
            baseHomeXG += totalXGBoost * 0.5;
            baseAwayXG += totalXGBoost * 0.5;
        }
    }
    
    // Ajuster en fonction de la force du favori
    if (favoriteTeam === 'home') {
        baseHomeXG += favoriteStrength * 0.5;
        baseAwayXG -= favoriteStrength * 0.3;
    } else if (favoriteTeam === 'away') {
        baseAwayXG += favoriteStrength * 0.5;
        baseHomeXG -= favoriteStrength * 0.3;
    }
    
    // Limiter les valeurs à des plages réalistes (0.3 à 3.0)
    analysisData.expectedGoals = {
        home: Math.max(0.3, Math.min(3.0, baseHomeXG)),
        away: Math.max(0.3, Math.min(3.0, baseAwayXG))
    };
}

// Analyse des tendances offensives/défensives
function analyzeTeamTrends() {
    const { 
        homeHalftime, awayHalftime, 
        homeSecondHalf, awaySecondHalf,
        homeAlignedHome, homeAlignedAway,
        drawAlignedHome, drawAlignedAway,
        awayAlignedHome, awayAlignedAway,
        topExactHome, topExactAway,
        favoriteTeam
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
    
    // Créer un score de base pondéré en utilisant toutes les données
    createWeightedBaseScore();
}

// Création d'un score de base pondéré
function createWeightedBaseScore() {
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
    
    // Importance variable des scores alignés en fonction de la cohérence des cotes
    const alignmentWeight = 0.25 + (analysisData.oddsConsistency * 0.2);
    
    // Ajouter une influence des scores alignés en fonction de l'équipe favorite
    if (favoriteTeam === 'home') {
        baseHome = baseHome * (1 - alignmentWeight) + homeAlignedHome * alignmentWeight;
        baseAway = baseAway * (1 - alignmentWeight) + homeAlignedAway * alignmentWeight;
    } else if (favoriteTeam === 'away') {
        baseHome = baseHome * (1 - alignmentWeight) + awayAlignedHome * alignmentWeight;
        baseAway = baseAway * (1 - alignmentWeight) + awayAlignedAway * alignmentWeight;
    } else { // Match nul
        baseHome = baseHome * (1 - alignmentWeight) + drawAlignedHome * alignmentWeight;
        baseAway = baseAway * (1 - alignmentWeight) + drawAlignedAway * alignmentWeight;
    }
    
    // Ajuster en fonction des tendances offensives
    baseHome += analysisData.offensiveTrendHome * 0.3;
    baseAway += analysisData.offensiveTrendAway * 0.3;
    
    // Ajuster en fonction des défenses
    baseAway -= analysisData.defensiveStrengthHome * 0.4;
    baseHome -= analysisData.defensiveStrengthAway * 0.4;
    
    // Ajuster en fonction des expectedGoals calculés
    const xgWeight = 0.3;
    baseHome = baseHome * (1 - xgWeight) + analysisData.expectedGoals.home * xgWeight;
    baseAway = baseAway * (1 - xgWeight) + analysisData.expectedGoals.away * xgWeight;
    
    // Stocker le score de base pondéré (valeurs décimales)
    analysisData.baseWeightedScore = {
        home: Math.max(0, baseHome),
        away: Math.max(0, baseAway)
    };
}

// Génération de la matrice de probabilité des scores
function generateScoreProbabilityMatrix() {
    // Paramètres de base pour la distribution des scores
    const homeBase = analysisData.baseWeightedScore.home;
    const awayBase = analysisData.baseWeightedScore.away;
    
    // Créer une matrice 7x7 pour les scores de 0-0 à 6-6
    const maxScore = 6;
    const matrix = Array(maxScore + 1).fill().map(() => Array(maxScore + 1).fill(0));
    
    // Distributions de probabilité pour chaque équipe
    // Utiliser une distribution de Poisson modifiée
    for (let home = 0; home <= maxScore; home++) {
        for (let away = 0; away <= maxScore; away++) {
            // Calculer la probabilité en fonction de la distance aux valeurs attendues
            let homeDist = Math.abs(home - homeBase);
            let awayDist = Math.abs(away - awayBase);
            
            // Facteur de distance combinée
            let combinedDistance = Math.sqrt(homeDist * homeDist + awayDist * awayDist);
            
            // Probabilité de base - diminue avec la distance
            let probability = Math.exp(-combinedDistance * 1.5);
            
            // Ajustements supplémentaires en fonction du résultat et des cotes
            if (godPredictionData.favoriteTeam === 'home' && home > away) {
                probability *= (1 + godPredictionData.favoriteStrength * 0.5);
            } else if (godPredictionData.favoriteTeam === 'away' && away > home) {
                probability *= (1 + godPredictionData.favoriteStrength * 0.5);
            } else if (godPredictionData.favoriteTeam === 'draw' && home === away) {
                probability *= (1 + godPredictionData.favoriteStrength * 0.7);
            }
            
            // Réduction pour les scores très élevés
            if (home + away > 6) {
                probability *= 0.8;
            }
            
            // Ajustement pour les scores typiques
            if (home === 1 && away === 1) probability *= 1.2; // 1-1 est commun
            if (home === 0 && away === 0) probability *= 1.1; // 0-0 est assez commun
            if (home === 2 && away === 1) probability *= 1.3; // 2-1 est très commun
            if (home === 1 && away === 2) probability *= 1.1; // 1-2 est commun
            if (home === 2 && away === 0) probability *= 1.2; // 2-0 est commun
            if (home === 0 && away === 2) probability *= 1.1; // 0-2 est assez commun
            
            // Cohérence avec BTTS
            if ((home > 0 && away > 0) && godPredictionData.bttsOdds < 1.8) {
                probability *= 1.3; // Renforcer les scores où les deux équipes marquent si BTTS probable
            }
            if ((home === 0 || away === 0) && godPredictionData.bttsOdds > 2.2) {
                probability *= 1.3; // Renforcer les clean sheets si BTTS improbable
            }
            
            // Cohérence avec Over/Under
            const totalGoals = home + away;
            if (totalGoals > 2 && godPredictionData.overOdds < 1.8) {
                probability *= 1.3; // Renforcer les scores avec beaucoup de buts si Over probable
            }
            if (totalGoals < 3 && godPredictionData.overOdds > 2.2) {
                probability *= 1.3; // Renforcer les scores avec peu de buts si Over improbable
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

// Sélection des scores exacts les plus probables
function selectExactScores() {
    const matrix = analysisData.scoreProbabilityMatrix;
    const maxScore = matrix.length - 1;
    
    // Trouver le score avec la plus haute probabilité
    let highestProb = 0;
    let primaryHome = 0;
    let primaryAway = 0;
    
    for (let home = 0; home <= maxScore; home++) {
        for (let away = 0; away <= maxScore; away++) {
            if (matrix[home][away] > highestProb) {
                highestProb = matrix[home][away];
                primaryHome = home;
                primaryAway = away;
            }
        }
    }
    
    // Vérifier si le score est cohérent avec l'équipe favorite
    const isFavoriteConsistent = isScoreConsistentWithFavorite(primaryHome, primaryAway);
    
    // Si non cohérent et favori fort, ajuster le score
    if (!isFavoriteConsistent && godPredictionData.favoriteStrength > 0.4) {
        const adjustedScore = adjustScoreForFavorite(primaryHome, primaryAway);
        primaryHome = adjustedScore.home;
        primaryAway = adjustedScore.away;
    }
    
    // Définir le score primaire
    godPredictionData.primaryScore = `${primaryHome}-${primaryAway}`;
    
    // Créer une copie de la matrice pour le score secondaire
    const tempMatrix = JSON.parse(JSON.stringify(matrix));
    
    // Exclure le score primaire déjà choisi
    tempMatrix[primaryHome][primaryAway] = 0;
    
    // Trouver le score avec la deuxième plus haute probabilité
    highestProb = 0;
    let secondaryHome = 0;
    let secondaryAway = 0;
    
    for (let home = 0; home <= maxScore; home++) {
        for (let away = 0; away <= maxScore; away++) {
            if (tempMatrix[home][away] > highestProb) {
                highestProb = tempMatrix[home][away];
                secondaryHome = home;
                secondaryAway = away;
            }
        }
    }
    
    // Vérifier si le score secondaire maintient le même résultat que le primaire
    const primaryResult = getResultType(primaryHome, primaryAway);
    const secondaryResult = getResultType(secondaryHome, secondaryAway);
    
    // Si les résultats diffèrent et que le secondaire n'est pas cohérent avec le favori,
    // chercher un score alternatif avec le même résultat que le primaire
    if (primaryResult !== secondaryResult && 
        !isScoreConsistentWithFavorite(secondaryHome, secondaryAway) &&
        godPredictionData.favoriteStrength > 0.3) {
        
        // Créer un score secondaire plausible basé sur le score primaire
        const alternativeScore = createPlausibleAlternativeScore(primaryHome, primaryAway, primaryResult);
        secondaryHome = alternativeScore.home;
        secondaryAway = alternativeScore.away;
    }
    
    // Définir le score secondaire
    godPredictionData.secondaryScore = `${secondaryHome}-${secondaryAway}`;
}

// Vérifier si un score est cohérent avec l'équipe favorite
function isScoreConsistentWithFavorite(home, away) {
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

// Ajuster un score pour être cohérent avec l'équipe favorite
function adjustScoreForFavorite(home, away) {
    const favoriteTeam = godPredictionData.favoriteTeam;
    const favoriteStrength = godPredictionData.favoriteStrength;
    
    // Score ajusté par défaut
    let adjustedHome = home;
    let adjustedAway = away;
    
    if (favoriteTeam === 'home' && home <= away) {
        // Ajuster pour victoire à domicile
        const gap = Math.ceil(favoriteStrength * 2); // Écart basé sur la force du favori
        adjustedHome = away + gap;
    } else if (favoriteTeam === 'away' && away <= home) {
        // Ajuster pour victoire à l'extérieur
        const gap = Math.ceil(favoriteStrength * 2);
        adjustedAway = home + gap;
    } else if (favoriteTeam === 'draw' && home !== away) {
        // Ajuster pour match nul
        // Choisir une valeur moyenne arrondie
        const avgScore = Math.round((home + away) / 2);
        adjustedHome = avgScore;
        adjustedAway = avgScore;
    }
    
    return { home: adjustedHome, away: adjustedAway };
}

// Obtenir le type de résultat (victoire domicile, nul, victoire extérieur)
function getResultType(home, away) {
    if (home > away) return 'home';
    if (away > home) return 'away';
    return 'draw';
}

// Créer un score alternatif plausible avec le même résultat
function createPlausibleAlternativeScore(primaryHome, primaryAway, resultType) {
    let newHome = primaryHome;
    let newAway = primaryAway;
    
    // Ajuster en fonction du type de résultat tout en gardant le même vainqueur
    if (resultType === 'home') {
        // Victoire à domicile - options typiques: 2-0, 2-1, 3-1, 1-0
        const options = [
            {home: 2, away: 0},
            {home: 2, away: 1},
            {home: 3, away: 1},
            {home: 1, away: 0}
        ];
        // Éviter de choisir le même score que le primaire
        const validOptions = options.filter(opt => 
            opt.home !== primaryHome || opt.away !== primaryAway);
        
        if (validOptions.length > 0) {
            // Choisir une option aléatoire
            const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
            newHome = randomOption.home;
            newAway = randomOption.away;
        } else {
            // Fallback: incrémenter légèrement le score tout en maintenant la victoire
            newHome = primaryHome + 1;
        }
    } else if (resultType === 'away') {
        // Victoire à l'extérieur - options typiques: 0-1, 1-2, 1-3, 0-2
        const options = [
            {home: 0, away: 1},
            {home: 1, away: 2},
            {home: 1, away: 3},
            {home: 0, away: 2}
        ];
        const validOptions = options.filter(opt => 
            opt.home !== primaryHome || opt.away !== primaryAway);
        
        if (validOptions.length > 0) {
            const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
            newHome = randomOption.home;
            newAway = randomOption.away;
        } else {
            // Fallback
            newAway = primaryAway + 1;
        }
    } else {
        // Match nul - options typiques: 0-0, 1-1, 2-2
        const options = [
            {home: 0, away: 0},
            {home: 1, away: 1},
            {home: 2, away: 2}
        ];
        const validOptions = options.filter(opt => 
            opt.home !== primaryHome || opt.away !== primaryAway);
        
        if (validOptions.length > 0) {
            const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
            newHome = randomOption.home;
            newAway = randomOption.away;
        } else {
            // Fallback
            newHome = newAway = Math.max(0, primaryHome) + 1;
        }
    }
    
    return { home: newHome, away: newAway };
}

// Déterminer le résultat du match
function determineMatchResult() {
    const { 
        favoriteTeam, 
        favoriteStrength,
        homeOdds, 
        drawOdds, 
        awayOdds,
        primaryScore
    } = godPredictionData;
    
    // Analyser les probabilités basées sur les cotes
    const homeWinProb = 1 / homeOdds;
    const drawProb = 1 / drawOdds;
    const awayWinProb = 1 / awayOdds;
    
    // Seuil pour déterminer si préférer une victoire directe ou double chance
    // Adapter le seuil en fonction de l'écart des cotes et la cohérence
    const thresholdForDirectWin = 0.4 + (analysisData.oddsConsistency * 0.2);
    
    // Déterminer le résultat en fonction du favori et de sa force
    if (favoriteTeam === 'home') {
        if (homeWinProb >= thresholdForDirectWin || favoriteStrength >= 0.5) {
            godPredictionData.matchResult = "Victoire de l'équipe à domicile";
        } else {
            godPredictionData.matchResult = "Double chance 1X (Domicile ou Nul)";
        }
    } else if (favoriteTeam === 'away') {
        if (awayWinProb >= thresholdForDirectWin || favoriteStrength >= 0.5) {
            godPredictionData.matchResult = "Victoire de l'équipe à l'extérieur";
        } else {
            godPredictionData.matchResult = "Double chance X2 (Nul ou Extérieur)";
        }
    } else {
        godPredictionData.matchResult = "Match nul";
    }
    
    // Cas spécial: s'il y a un écart très mince entre les favoris, recommander double chance
    const minOdds = Math.min(homeOdds, drawOdds, awayOdds);
    const secondMinOdds = [homeOdds, drawOdds, awayOdds].sort((a, b) => a - b)[1];
    
    if (secondMinOdds - minOdds < 0.3 && favoriteStrength < 0.3) {
        // Les deux meilleures options sont proches, recommander double chance
        if (minOdds === homeOdds && secondMinOdds === drawOdds) {
            godPredictionData.matchResult = "Double chance 1X (Domicile ou Nul)";
        } else if (minOdds === awayOdds && secondMinOdds === drawOdds) {
            godPredictionData.matchResult = "Double chance X2 (Nul ou Extérieur)";
        } else if (minOdds === drawOdds) {
            if (secondMinOdds === homeOdds) {
                godPredictionData.matchResult = "Double chance 1X (Domicile ou Nul)";
            } else {
                godPredictionData.matchResult = "Double chance X2 (Nul ou Extérieur)";
            }
        }
    }
}

// Calcul de la prédiction du nombre de buts (CORRIGÉ)
function calculateCorrectGoalsPrediction() {
    // Extraire le score principal
    const [primaryHomeStr, primaryAwayStr] = godPredictionData.primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    // Calculer le total de buts
    const totalGoals = primaryHome + primaryAway;
    
    // CORRECTION: Appliquer la règle -1 but correctement
    let adjustedGoals = totalGoals - 1;
    
    // Si le total des buts est déjà 0 ou 1, conserver +0.5 comme minimum
    if (adjustedGoals < 0) {
        adjustedGoals = 0;
    }
    
    // Formater la prédiction (format paris sportifs)
    godPredictionData.goalsPrediction = `+${adjustedGoals}.5 buts`;
}

// Calcul des fiabilités des prédictions
function calculatePredictionReliabilities() {
    const { 
        favoriteTeam, 
        favoriteStrength,
        homeOdds, 
        awayOdds,
        primaryScore, 
        secondaryScore,
        bttsOdds,
        overOdds
    } = godPredictionData;
    
    // Calculer le score de confiance global basé sur la cohérence des données
    const oddsWeight = 0.4;
    const alignmentWeight = 0.3;
    const trendWeight = 0.3;
    
    // Score de cohérence des tendances
    const trendCoherence = calculateTrendCoherenceScore();
    
    // Score de cohérence entre scores et cotes
    const scoreAlignment = isScorePrimaryAlignedWithOdds();
    
    analysisData.confidenceScore = 
        (analysisData.oddsConsistency * oddsWeight * 100) + 
        (scoreAlignment * alignmentWeight * 100) + 
        (trendCoherence * trendWeight * 100);
    
    // Fiabilité du résultat du match (85-98%)
    let resultBase = 85;
    
    // Augmenter la fiabilité en fonction de divers facteurs
    // 1. Cohérence des cotes (jusqu'à +3%)
    resultBase += Math.round(analysisData.oddsConsistency * 3);
    
    // 2. Force du favori (jusqu'à +5%)
    resultBase += Math.round(favoriteStrength * 5);
    
    // 3. Score de confiance global (jusqu'à +5%)
    resultBase += Math.round(analysisData.confidenceScore * 0.05);
    
    // 4. Réduire pour double chance (qui est intrinsèquement plus fiable)
    if (godPredictionData.matchResult.includes("Double chance")) {
        resultBase += 3;
    }
    
    // Plafonner à 98%
    godPredictionData.resultReliability = Math.min(98, resultBase);

    // Fiabilité des scores exacts
    // Extraire les scores pour calculer les probabilités
    const [primaryHomeStr, primaryAwayStr] = primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    const [secondaryHomeStr, secondaryAwayStr] = secondaryScore.split('-');
    const secondaryHome = parseInt(secondaryHomeStr);
    const secondaryAway = parseInt(secondaryAwayStr);
    
    // Probabilités selon la matrice
    const primaryProb = analysisData.scoreProbabilityMatrix[primaryHome][primaryAway] || 0;
    const secondaryProb = analysisData.scoreProbabilityMatrix[secondaryHome][secondaryAway] || 0;
    
    // Base de fiabilité plus réaliste (65-85% pour primary, 60-75% pour secondary)
    const primaryBase = 65;
    const secondaryBase = 60;
    
    // Calculer fiabilités basées sur probabilités et cohérence
    godPredictionData.primaryScoreReliability = Math.min(85, Math.round(primaryBase + (primaryProb * 100) + (analysisData.confidenceScore * 0.1)));
    godPredictionData.secondaryScoreReliability = Math.min(75, Math.round(secondaryBase + (secondaryProb * 100) + (analysisData.confidenceScore * 0.05)));
    
    // Fiabilité du nombre de buts - haute mais variable selon cohérence
    const goalsBase = 95;
    
    // Facteurs influençant la fiabilité du nombre de buts
    // 1. Cohérence entre over/under et le total des buts
    const overUnderCoherence = calculateOverUnderCoherence();
    
    // 2. Un boost fixe puisque la règle -1 est prudente
    const safetyBoost = 3;
    
    // 3. Variation décimale pour un effet visuel (99.1-99.9%)
    const decimalPart = Math.floor(Math.random() * 9) + 1;
    
    // Calculer la fiabilité finale pour les buts
    let goalsReliability = goalsBase + (overUnderCoherence * 1.5) + safetyBoost;
    
    // Plafonner à 99.9%
    goalsReliability = Math.min(99.9, Math.max(goalsReliability, 99.0));
    
    // Formater avec une décimale
    godPredictionData.goalsReliability = parseFloat(goalsReliability.toFixed(1));
}

// Vérifier si le score principal est aligné avec les cotes
function isScorePrimaryAlignedWithOdds() {
    const { 
        favoriteTeam,
        primaryScore
    } = godPredictionData;
    
    const [primaryHomeStr, primaryAwayStr] = primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    
    // Déterminer le type de résultat du score
    const scoreResult = getResultType(primaryHome, primaryAway);
    
    // Vérifier l'alignement avec le favori
    if (favoriteTeam === scoreResult) {
        return 1.0; // Parfaitement aligné
    } else if (
        (favoriteTeam === 'home' && scoreResult === 'draw') ||
        (favoriteTeam === 'away' && scoreResult === 'draw') ||
        (favoriteTeam === 'draw' && (scoreResult === 'home' || scoreResult === 'away'))
    ) {
        return 0.5; // Partiellement aligné (nul vs victoire)
    }
    
    return 0.2; // Mal aligné
}

// Calculer le score de cohérence des tendances
function calculateTrendCoherenceScore() {
    // Vérifier si les tendances offensives/défensives sont cohérentes avec le score prédit
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

// Calculer la cohérence entre over/under et le total des buts
function calculateOverUnderCoherence() {
    const { overOdds, primaryScore } = godPredictionData;
    
    // Extraire le total des buts du score principal
    const [primaryHomeStr, primaryAwayStr] = primaryScore.split('-');
    const primaryHome = parseInt(primaryHomeStr);
    const primaryAway = parseInt(primaryAwayStr);
    const totalGoals = primaryHome + primaryAway;
    
    // Vérifier cohérence avec over 2.5
    if (overOdds < 1.8 && totalGoals > 2) {
        return 1.0; // Très cohérent: over probable + score avec beaucoup de buts
    } else if (overOdds > 2.2 && totalGoals < 3) {
        return 1.0; // Très cohérent: over improbable + score avec peu de buts
    } else if (overOdds < 2.0 && totalGoals >= 2) {
        return 0.7; // Assez cohérent
    } else if (overOdds > 2.0 && totalGoals <= 3) {
        return 0.7; // Assez cohérent
    }
    
    return 0.4; // Peu cohérent
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
        favoriteTeam: null,
        favoriteStrength: null
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
        expectedGoals: {
            home: 0,
            away: 0
        },
        scoreProbabilityMatrix: [],
        scoreThresholds: {
            low: 1.5,
            medium: 2.5,
            high: 3.5
        }
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

// Fonction pour le retour haptique via Telegram
function hapticFeedback(type) {
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
            default:
                tgWebApp.HapticFeedback.impactOccurred('medium');
        }
    }
}
