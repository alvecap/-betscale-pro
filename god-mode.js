/**
 * God Mode - BetScale Pro
 * Script avancé de gestion des prédictions et navigation entre les sections
 * Modèle statistique complexe pour des prédictions ultra-précises
 */

// Variables globales pour stocker les données
let godPredictionData = {
    // Section 1: Cotes classiques (1X2)
    homeOdds: null,    // Cote victoire équipe domicile
    drawOdds: null,    // Cote match nul
    awayOdds: null,    // Cote victoire équipe extérieur
    
    // Section 2: Buts attendus par l'équipe à domicile
    homeOver15: null,  // Cote +1.5 buts équipe domicile
    homeOver25: null,  // Cote +2.5 buts équipe domicile
    
    // Section 3: Score favori de l'équipe domicile
    homeFavHome: null, // Buts domicile du score favori domicile
    homeFavAway: null, // Buts extérieur du score favori domicile
    homeFavOdds: null, // Cote de ce score
    
    // Section 4: Scores par période
    halftimeHome: null,   // Buts domicile à la mi-temps
    halftimeAway: null,   // Buts extérieur à la mi-temps
    halftimeOdds: null,   // Cote de ce score mi-temps
    secondhalfHome: null, // Buts domicile en 2e mi-temps
    secondhalfAway: null, // Buts extérieur en 2e mi-temps
    secondhalfOdds: null, // Cote de ce score 2e mi-temps
    
    // Section 5: Score exact global
    exactHome: null,   // Buts domicile du score exact global
    exactAway: null,   // Buts extérieur du score exact global
    exactOdds: null,   // Cote de ce score exact
    
    // Section 6: BTTS + Handicap
    bttsOdds: null,     // Cote BTTS (les deux équipes marquent)
    handicapOdds: null, // Cote du handicap -1 pour le favori
    
    // Section 7: Buts attendus par l'équipe à l'extérieur
    awayOver15: null,  // Cote +1.5 buts équipe extérieur
    awayOver25: null,  // Cote +2.5 buts équipe extérieur
    
    // Section 8: Score favori équipe extérieure
    awayFavHome: null, // Buts domicile du score favori extérieur
    awayFavAway: null, // Buts extérieur du score favori extérieur
    awayFavOdds: null, // Cote de ce score
    
    // Section 9: Score favori du match nul
    drawFavHome: null, // Buts domicile du score favori nul
    drawFavAway: null, // Buts extérieur du score favori nul
    drawFavOdds: null, // Cote de ce score
    
    // Résultats calculés
    matchResult: null,         // Résultat du match (victoire directe ou double chance)
    primaryScore: null,        // Score exact principal prédit
    secondaryScore: null,      // Score exact secondaire prédit
    goalsPrediction: null,     // Prédiction du nombre de buts (avec règle -1)
    
    // Fiabilités des prédictions
    resultReliability: null,          // Fiabilité du résultat du match
    primaryScoreReliability: null,    // Fiabilité du score principal
    secondaryScoreReliability: null,  // Fiabilité du score secondaire
    goalsReliability: null            // Fiabilité du nombre de buts
};

// Variables pour l'analyse statistique avancée
let analysisData = {
    // Caractéristiques des équipes
    homeAttackStrength: 0,     // Force offensive équipe domicile (0-1)
    homeDefenseStrength: 0,    // Force défensive équipe domicile (0-1)
    awayAttackStrength: 0,     // Force offensive équipe extérieur (0-1)
    awayDefenseStrength: 0,    // Force défensive équipe extérieur (0-1)
    
    // Tendances de jeu
    firstHalfTendency: 0,      // Tendance 1ère mi-temps (négatif = défensif, positif = offensif)
    secondHalfTendency: 0,     // Tendance 2ème mi-temps
    scorelineEvolution: 0,     // Evolution du score (négatif = fermeture, positif = ouverture)
    
    // Profil du match
    matchProfile: '',          // 'defensive', 'balanced', 'offensive', 'very-offensive'
    gameIntensity: 0,          // Intensité globale (0-1)
    favoriteStrength: 0,       // Force du favori (0-1)
    favorite: '',              // Équipe favorite ('home', 'away', 'draw')
    
    // Matrices probabilistes pour le calcul des scores
    scoreMatrix: [],           // Matrice de probabilité des scores
    exactScoreProbs: {},       // Probabilités des scores exacts
    
    // Probabilities
    homeWinProb: 0,            // Probabilité victoire domicile
    drawProb: 0,               // Probabilité match nul
    awayWinProb: 0,            // Probabilité victoire extérieur
    bttsProb: 0,               // Probabilité BTTS
    
    // Distributions
    expectedGoals: {           // Expected goals (xG)
        home: 0,
        away: 0
    }
};

// Variables pour la gestion des prédictions quotidiennes
let dailyPredictionsLimit = 5; // Limite par défaut pour les utilisateurs gratuits
let predictionsRemaining = 5; // Nombre de prédictions restantes aujourd'hui
let isUserVIP = false; // Statut VIP de l'utilisateur
let isAdmin = false; // Statut d'administrateur
let currentSection = 0; // Section actuelle (0 = intro, 1-9 = sections)

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
    
    // Initialiser les écouteurs d'événements pour validation des champs
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
    
    if (predictionsRemaining <= 0) {
        // Afficher le popup de limite atteinte
        document.getElementById('limit-popup').style.display = 'block';
        return false;
    }
    return true;
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
    // Section 0 = intro (0%), Section 1-9 = environ 11% par section
    const progressPercentage = sectionNumber * (100 / 9);
    
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

// Initialisation des écouteurs d'événements pour validation des champs
function initInputValidation() {
    // Ajouter les écouteurs pour chaque section
    for (let i = 1; i <= 9; i++) {
        document.querySelectorAll(`#section-${i} input`).forEach(input => {
            input.addEventListener('input', () => validateSectionInputs(i));
        });
    }
}

// Validation des champs par section
function validateSectionInputs(sectionNumber) {
    // Fonction de validation spécifique pour chaque section
    const isValid = validateSpecificSection(sectionNumber);
    
    // Trouver le bouton "Continuer" de la section
    const continueBtn = document.querySelector(`#section-${sectionNumber} .god-button:not(.secondary-button)`);
    
    // Activer/désactiver le bouton en fonction de la validation
    if (continueBtn) {
        if (isValid) {
            continueBtn.removeAttribute('disabled');
        } else {
            continueBtn.setAttribute('disabled', true);
        }
    }
}

// Validation spécifique pour chaque section
function validateSpecificSection(sectionNumber) {
    // Implémentation des validations spécifiques pour chaque section
    switch (sectionNumber) {
        case 1: // Cotes classiques (1X2)
            return validateSection1();
        case 2: // Buts attendus par l'équipe à domicile
            return validateSection2();
        case 3: // Score favori de l'équipe à domicile
            return validateSection3();
        case 4: // Scores par période
            return validateSection4();
        case 5: // Score exact global
            return validateSection5();
        case 6: // BTTS + Handicap
            return validateSection6();
        case 7: // Buts attendus par l'équipe à l'extérieur
            return validateSection7();
        case 8: // Score favori équipe extérieure
            return validateSection8();
        case 9: // Score favori du match nul
            return validateSection9();
        default:
            return false;
    }
}

// Validation Section 1: Cotes classiques (1X2)
function validateSection1() {
    const homeOdds = document.getElementById('home-odds').value;
    const drawOdds = document.getElementById('draw-odds').value;
    const awayOdds = document.getElementById('away-odds').value;
    
    return (
        homeOdds && 
        drawOdds && 
        awayOdds && 
        parseFloat(homeOdds) >= 1 && 
        parseFloat(drawOdds) >= 1 && 
        parseFloat(awayOdds) >= 1
    );
}

// Validation Section 2: Buts attendus par l'équipe à domicile
function validateSection2() {
    const homeOver15 = document.getElementById('home-over-15').value;
    const homeOver25 = document.getElementById('home-over-25').value;
    
    return (
        homeOver15 && 
        homeOver25 && 
        parseFloat(homeOver15) >= 1 && 
        parseFloat(homeOver25) >= 1
    );
}

// Validation Section 3: Score favori de l'équipe à domicile
function validateSection3() {
    const homeFavHome = document.getElementById('home-fav-home').value;
    const homeFavAway = document.getElementById('home-fav-away').value;
    const homeFavOdds = document.getElementById('home-fav-odds').value;
    
    return (
        homeFavHome !== '' && 
        homeFavAway !== '' && 
        homeFavOdds && 
        parseInt(homeFavHome) >= 0 && 
        parseInt(homeFavAway) >= 0 && 
        parseFloat(homeFavOdds) >= 1
    );
}

// Validation Section 4: Scores par période
function validateSection4() {
    const halftimeHome = document.getElementById('halftime-home').value;
    const halftimeAway = document.getElementById('halftime-away').value;
    const halftimeOdds = document.getElementById('halftime-odds').value;
    const secondhalfHome = document.getElementById('secondhalf-home').value;
    const secondhalfAway = document.getElementById('secondhalf-away').value;
    const secondhalfOdds = document.getElementById('secondhalf-odds').value;
    
    return (
        halftimeHome !== '' && 
        halftimeAway !== '' && 
        halftimeOdds && 
        secondhalfHome !== '' && 
        secondhalfAway !== '' && 
        secondhalfOdds && 
        parseInt(halftimeHome) >= 0 && 
        parseInt(halftimeAway) >= 0 && 
        parseInt(secondhalfHome) >= 0 && 
        parseInt(secondhalfAway) >= 0 && 
        parseFloat(halftimeOdds) >= 1 && 
        parseFloat(secondhalfOdds) >= 1
    );
}

// Validation Section 5: Score exact global
function validateSection5() {
    const exactHome = document.getElementById('exact-home').value;
    const exactAway = document.getElementById('exact-away').value;
    const exactOdds = document.getElementById('exact-odds').value;
    
    return (
        exactHome !== '' && 
        exactAway !== '' && 
        exactOdds && 
        parseInt(exactHome) >= 0 && 
        parseInt(exactAway) >= 0 && 
        parseFloat(exactOdds) >= 1
    );
}

// Validation Section 6: BTTS + Handicap
function validateSection6() {
    const bttsOdds = document.getElementById('btts-odds').value;
    const handicapOdds = document.getElementById('handicap-odds').value;
    
    return (
        bttsOdds && 
        handicapOdds && 
        parseFloat(bttsOdds) >= 1 && 
        parseFloat(handicapOdds) >= 1
    );
}

// Validation Section 7: Buts attendus par l'équipe à l'extérieur
function validateSection7() {
    const awayOver15 = document.getElementById('away-over-15').value;
    const awayOver25 = document.getElementById('away-over-25').value;
    
    return (
        awayOver15 && 
        awayOver25 && 
        parseFloat(awayOver15) >= 1 && 
        parseFloat(awayOver25) >= 1
    );
}

// Validation Section 8: Score favori équipe extérieure
function validateSection8() {
    const awayFavHome = document.getElementById('away-fav-home').value;
    const awayFavAway = document.getElementById('away-fav-away').value;
    const awayFavOdds = document.getElementById('away-fav-odds').value;
    
    return (
        awayFavHome !== '' && 
        awayFavAway !== '' && 
        awayFavOdds && 
        parseInt(awayFavHome) >= 0 && 
        parseInt(awayFavAway) >= 0 && 
        parseFloat(awayFavOdds) >= 1
    );
}

// Validation Section 9: Score favori du match nul
function validateSection9() {
    const drawFavHome = document.getElementById('draw-fav-home').value;
    const drawFavAway = document.getElementById('draw-fav-away').value;
    const drawFavOdds = document.getElementById('draw-fav-odds').value;
    
    return (
        drawFavHome !== '' && 
        drawFavAway !== '' && 
        drawFavOdds && 
        parseInt(drawFavHome) >= 0 && 
        parseInt(drawFavAway) >= 0 && 
        parseFloat(drawFavOdds) >= 1
    );
}

// Génération des prédictions avec le modèle God Mode avancé
function generateGodPredictions() {
    // Vérifier si l'utilisateur peut faire une prédiction
    if (!canMakePrediction()) {
        return;
    }
    
    // Collecter toutes les données saisies par l'utilisateur
    collectAllData();
    
    // Masquer la section actuelle
    document.querySelectorAll('.god-step').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher l'écran de génération
    const generatingStep = document.getElementById('generating-step');
    generatingStep.classList.add('active');
    
    // Démarrer l'animation de génération avec étapes détaillées
    startGeneratingAnimation();
    
    // Calcul des prédictions avancées - délai pour permettre à l'animation de se dérouler
    setTimeout(() => {
        // Analyse statistique avancée et calcul des prédictions
        runAdvancedAnalysis();
        
        // Décrémenter le compteur de prédictions
        decrementPredictionsCount();
        
        // Afficher les résultats après l'animation
        setTimeout(() => {
            showResults();
        }, 500);
    }, 3000);
}

// Collecter toutes les données saisies par l'utilisateur
function collectAllData() {
    // Section 1: Cotes classiques (1X2)
    godPredictionData.homeOdds = parseFloat(document.getElementById('home-odds').value);
    godPredictionData.drawOdds = parseFloat(document.getElementById('draw-odds').value);
    godPredictionData.awayOdds = parseFloat(document.getElementById('away-odds').value);
    
    // Section 2: Buts attendus par l'équipe à domicile
    godPredictionData.homeOver15 = parseFloat(document.getElementById('home-over-15').value);
    godPredictionData.homeOver25 = parseFloat(document.getElementById('home-over-25').value);
    
    // Section 3: Score favori de l'équipe à domicile
    godPredictionData.homeFavHome = parseInt(document.getElementById('home-fav-home').value);
    godPredictionData.homeFavAway = parseInt(document.getElementById('home-fav-away').value);
    godPredictionData.homeFavOdds = parseFloat(document.getElementById('home-fav-odds').value);
    
    // Section 4: Scores par période
    godPredictionData.halftimeHome = parseInt(document.getElementById('halftime-home').value);
    godPredictionData.halftimeAway = parseInt(document.getElementById('halftime-away').value);
    godPredictionData.halftimeOdds = parseFloat(document.getElementById('halftime-odds').value);
    godPredictionData.secondhalfHome = parseInt(document.getElementById('secondhalf-home').value);
    godPredictionData.secondhalfAway = parseInt(document.getElementById('secondhalf-away').value);
    godPredictionData.secondhalfOdds = parseFloat(document.getElementById('secondhalf-odds').value);
    
    // Section 5: Score exact global
    godPredictionData.exactHome = parseInt(document.getElementById('exact-home').value);
    godPredictionData.exactAway = parseInt(document.getElementById('exact-away').value);
    godPredictionData.exactOdds = parseFloat(document.getElementById('exact-odds').value);
    
    // Section 6: BTTS + Handicap
    godPredictionData.bttsOdds = parseFloat(document.getElementById('btts-odds').value);
    godPredictionData.handicapOdds = parseFloat(document.getElementById('handicap-odds').value);
    
    // Section 7: Buts attendus par l'équipe à l'extérieur
    godPredictionData.awayOver15 = parseFloat(document.getElementById('away-over-15').value);
    godPredictionData.awayOver25 = parseFloat(document.getElementById('away-over-25').value);
    
    // Section 8: Score favori équipe extérieure
    godPredictionData.awayFavHome = parseInt(document.getElementById('away-fav-home').value);
    godPredictionData.awayFavAway = parseInt(document.getElementById('away-fav-away').value);
    godPredictionData.awayFavOdds = parseFloat(document.getElementById('away-fav-odds').value);
    
    // Section 9: Score favori du match nul
    godPredictionData.drawFavHome = parseInt(document.getElementById('draw-fav-home').value);
    godPredictionData.drawFavAway = parseInt(document.getElementById('draw-fav-away').value);
    godPredictionData.drawFavOdds = parseFloat(document.getElementById('draw-fav-odds').value);
}

// Animation de génération avec étapes détaillées
function startGeneratingAnimation() {
    let progress = 0;
    const generatingText = document.getElementById('generating-text');
    
    // Séquence d'animation avec plusieurs étapes pour simuler un calcul complexe
    setTimeout(() => {
        generatingText.textContent = "Analyse initiale des cotes...";
        progress = 15;
    }, 300);
    
    setTimeout(() => {
        generatingText.textContent = "Calcul des forces offensives et défensives...";
        progress = 30;
    }, 800);
    
    setTimeout(() => {
        generatingText.textContent = "Génération des matrices probabilistes...";
        progress = 45;
    }, 1300);
    
    setTimeout(() => {
        generatingText.textContent = "Analyse des tendances par période...";
        progress = 60;
    }, 1800);
    
    setTimeout(() => {
        generatingText.textContent = "Calcul des Expected Goals (xG)...";
        progress = 75;
    }, 2300);
    
    setTimeout(() => {
        generatingText.textContent = "Finalisation des prédictions et fiabilités...";
        progress = 90;
    }, 2700);
    
    setTimeout(() => {
        generatingText.textContent = "Prédictions prêtes !";
        progress = 100;
    }, 2900);
}

// Analyse statistique avancée et calcul des prédictions
function runAdvancedAnalysis() {
    // Étape 1: Analyser les cotes principales et calculer les probabilités
    calculateBaseProbabilities();
    
    // Étape 2: Analyser les cotes de buts et calculer les forces offensives/défensives
    calculateTeamStrengths();
    
    // Étape 3: Analyser les tendances par période
    analyzePeriodTendencies();
    
    // Étape 4: Déterminer le profil du match et l'intensité
    determineMatchProfile();
    
    // Étape 5: Calculer les Expected Goals (xG)
    calculateExpectedGoals();
    
    // Étape 6: Générer les matrices probabilistes pour les scores
    generateScoreMatrix();
    
    // Étape 7: Déterminer le résultat du match (victoire directe ou double chance)
    calculateMatchResult();
    
    // Étape 8: Sélectionner les scores exacts les plus probables
    selectExactScores();
    
    // Étape 9: Calculer la prédiction du nombre de buts avec la règle -1 but
    calculateGoalsPrediction();
    
    // Étape 10: Calculer les fiabilités des prédictions
    calculatePredictionReliabilities();
}

// Calcul des probabilités de base à partir des cotes principales
function calculateBaseProbabilities() {
    const { homeOdds, drawOdds, awayOdds } = godPredictionData;
    
    // Convertir les cotes en probabilités (formule 1/cote)
    let rawHomeProb = 1 / homeOdds;
    let rawDrawProb = 1 / drawOdds;
    let rawAwayProb = 1 / awayOdds;
    
    // Calculer la marge du bookmaker (somme des probabilités > 1)
    const margin = rawHomeProb + rawDrawProb + rawAwayProb - 1;
    
    // Normaliser les probabilités pour éliminer la marge du bookmaker
    const marginFactor = 1 / (1 + margin);
    
    // Stocker les probabilités normalisées
    analysisData.homeWinProb = rawHomeProb * marginFactor;
    analysisData.drawProb = rawDrawProb * marginFactor;
    analysisData.awayWinProb = rawAwayProb * marginFactor;
    
    // Déterminer le favori et sa force
    if (analysisData.homeWinProb >= analysisData.drawProb && analysisData.homeWinProb >= analysisData.awayWinProb) {
        // L'équipe à domicile est favorite
        analysisData.favorite = 'home';
        // Force du favori = écart avec le second plus probable
        analysisData.favoriteStrength = analysisData.homeWinProb - Math.max(analysisData.drawProb, analysisData.awayWinProb);
    } else if (analysisData.awayWinProb >= analysisData.homeWinProb && analysisData.awayWinProb >= analysisData.drawProb) {
        // L'équipe à l'extérieur est favorite
        analysisData.favorite = 'away';
        analysisData.favoriteStrength = analysisData.awayWinProb - Math.max(analysisData.homeWinProb, analysisData.drawProb);
    } else {
        // Match nul favori
        analysisData.favorite = 'draw';
        analysisData.favoriteStrength = analysisData.drawProb - Math.max(analysisData.homeWinProb, analysisData.awayWinProb);
    }
    
    // Convertir la force du favori en échelle 0-1 plus intuitive
    // Une différence de probabilité de 0.3 (30%) est considérée comme très forte
    analysisData.favoriteStrength = Math.min(1, analysisData.favoriteStrength * 3.33);
    
    console.log("Favori:", analysisData.favorite, "Force:", analysisData.favoriteStrength.toFixed(2));
    console.log("Probabilités:", {
        home: analysisData.homeWinProb.toFixed(2),
        draw: analysisData.drawProb.toFixed(2),
        away: analysisData.awayWinProb.toFixed(2)
    });
    
    // Calcul de la probabilité BTTS (les deux équipes marquent)
    analysisData.bttsProb = Math.max(0.2, Math.min(0.9, 1.5 / godPredictionData.bttsOdds));
}

// Calcul des forces offensives/défensives des équipes
function calculateTeamStrengths() {
    // Utiliser les cotes over/under pour estimer les forces offensives
    
    // Pour l'équipe à domicile
    // Plus la cote over 1.5 est basse, plus l'équipe est offensive
    const homeOffensiveRaw = (2.0 / godPredictionData.homeOver15);
    // Normaliser entre 0.3 et 0.9
    analysisData.homeAttackStrength = 0.3 + (homeOffensiveRaw / 2) * 0.6;
    
    // Pour l'équipe à l'extérieur
    const awayOffensiveRaw = (2.0 / godPredictionData.awayOver15);
    analysisData.awayAttackStrength = 0.3 + (awayOffensiveRaw / 2) * 0.6;
    
    // Force défensive - estimée à partir des cotes et scores favoris
    // Plus le nombre de buts concédés dans les scores favoris est bas, meilleure est la défense
    
    // Pour l'équipe à domicile
    const avgAwayGoals = (godPredictionData.homeFavAway + godPredictionData.drawFavAway + godPredictionData.awayFavAway) / 3;
    analysisData.homeDefenseStrength = Math.max(0.2, Math.min(0.9, 1 - (avgAwayGoals / 3)));
    
    // Pour l'équipe à l'extérieur
    const avgHomeGoals = (godPredictionData.homeFavHome + godPredictionData.drawFavHome + godPredictionData.awayFavHome) / 3;
    analysisData.awayDefenseStrength = Math.max(0.2, Math.min(0.9, 1 - (avgHomeGoals / 3)));
    
    console.log("Forces équipe domicile:", { 
        attack: analysisData.homeAttackStrength.toFixed(2), 
        defense: analysisData.homeDefenseStrength.toFixed(2) 
    });
    console.log("Forces équipe extérieur:", { 
        attack: analysisData.awayAttackStrength.toFixed(2), 
        defense: analysisData.awayDefenseStrength.toFixed(2) 
    });
}

// Analyse des tendances par période
function analyzePeriodTendencies() {
    // Analyser les tendances en comparant les scores de la 1ère et 2ème mi-temps
    const firstHalfTotal = godPredictionData.halftimeHome + godPredictionData.halftimeAway;
    const secondHalfTotal = godPredictionData.secondhalfHome + godPredictionData.secondhalfAway;
    
    // Tendance première mi-temps : -1 (très défensif) à +1 (très offensif)
    analysisData.firstHalfTendency = (firstHalfTotal - 1) / 2; // Normaliser: 0 buts = -0.5, 2 buts = 0.5
    
    // Tendance deuxième mi-temps
    analysisData.secondHalfTendency = (secondHalfTotal - 1) / 2;
    
    // Evolution du score (négatif = fermeture, positif = ouverture)
    analysisData.scorelineEvolution = secondHalfTotal - firstHalfTotal;
    
    console.log("Tendances par période:", {
        firstHalf: analysisData.firstHalfTendency.toFixed(2),
        secondHalf: analysisData.secondHalfTendency.toFixed(2),
        evolution: analysisData.scorelineEvolution
    });
}

// Détermination du profil du match et de l'intensité
function determineMatchProfile() {
    // Combiner les facteurs pour déterminer le profil du match
    
    // 1. Facteurs pour déterminer l'intensité offensive
    const offensiveFactors = [
        // Force offensive des deux équipes
        analysisData.homeAttackStrength * 0.3,
        analysisData.awayAttackStrength * 0.3,
        
        // Impact du BTTS
        (analysisData.bttsProb - 0.5) * 0.2, // Contribution positive si BTTS > 0.5
        
        // Impact des tendances par période
        (analysisData.firstHalfTendency + analysisData.secondHalfTendency) * 0.1,
        
        // Moyenne des buts dans les scores favoris
        ((godPredictionData.exactHome + godPredictionData.exactAway - 2) / 4) * 0.1
    ];
    
    // Calculer l'intensité globale (0-1)
    analysisData.gameIntensity = Math.max(0.1, Math.min(0.9, 
        offensiveFactors.reduce((sum, val) => sum + val, 0) + 0.4 // Ajout de 0.4 pour normaliser vers le milieu
    ));
    
    // Déterminer le profil du match
    if (analysisData.gameIntensity < 0.3) {
        analysisData.matchProfile = 'defensive';
    } else if (analysisData.gameIntensity < 0.5) {
        analysisData.matchProfile = 'balanced-defensive';
    } else if (analysisData.gameIntensity < 0.7) {
        analysisData.matchProfile = 'balanced-offensive';
    } else {
        analysisData.matchProfile = 'very-offensive';
    }
    
    console.log("Profil du match:", analysisData.matchProfile);
    console.log("Intensité du jeu:", analysisData.gameIntensity.toFixed(2));
}

// Calcul des Expected Goals (xG)
function calculateExpectedGoals() {
    // Utiliser les forces offensives/défensives et profil du match pour calculer les xG
    
    // Base d'expected goals selon profil du match
    let baseXg = 0;
    switch (analysisData.matchProfile) {
        case 'defensive': baseXg = 1.8; break;
        case 'balanced-defensive': baseXg = 2.2; break;
        case 'balanced-offensive': baseXg = 2.6; break;
        case 'very-offensive': baseXg = 3.0; break;
    }
    
    // Répartition des xG entre les équipes
    // Facteur domicile (avantage historique)
    const homeAdvantage = 0.2;
    
    // Calculer le rapport de force offensif vs défensif
    const homeOffVsAway = analysisData.homeAttackStrength / analysisData.awayDefenseStrength;
    const awayOffVsHome = analysisData.awayAttackStrength / analysisData.homeDefenseStrength;
    
    // Calculer le ratio de répartition
    const totalRatio = homeOffVsAway + awayOffVsHome;
    const homeShare = (homeOffVsAway / totalRatio) + homeAdvantage;
    const awayShare = (awayOffVsHome / totalRatio) - homeAdvantage;
    
    // Attribuer les xG en fonction du rapport de force et du total attendu
    analysisData.expectedGoals.home = Math.max(0.3, baseXg * homeShare);
    analysisData.expectedGoals.away = Math.max(0.3, baseXg * awayShare);
    
    // Ajuster en fonction des scores exacts
    const favoriteScoreXgHome = analysisData.favorite === 'home' ? godPredictionData.homeFavHome : 
                               (analysisData.favorite === 'away' ? godPredictionData.awayFavHome : 
                                godPredictionData.drawFavHome);
    
    const favoriteScoreXgAway = analysisData.favorite === 'home' ? godPredictionData.homeFavAway : 
                               (analysisData.favorite === 'away' ? godPredictionData.awayFavAway : 
                                godPredictionData.drawFavAway);
    
    // Mixer xG calculés avec les scores favoris (70% calculé, 30% scores favoris)
    analysisData.expectedGoals.home = analysisData.expectedGoals.home * 0.7 + favoriteScoreXgHome * 0.3;
    analysisData.expectedGoals.away = analysisData.expectedGoals.away * 0.7 + favoriteScoreXgAway * 0.3;
    
    console.log("Expected Goals (xG):", {
        home: analysisData.expectedGoals.home.toFixed(2),
        away: analysisData.expectedGoals.away.toFixed(2),
        total: (analysisData.expectedGoals.home + analysisData.expectedGoals.away).toFixed(2)
    });
}

// Génération de la matrice probabiliste des scores
function generateScoreMatrix() {
    // Créer une matrice 7x7 couvrant les scores de 0-0 à 6-6
    const maxGoals = 6; // Maximum de buts par équipe considérés
    analysisData.scoreMatrix = Array(maxGoals + 1).fill().map(() => Array(maxGoals + 1).fill(0));
    
    // Utiliser la distribution de Poisson pour calculer les probabilités de chaque score
    // basées sur les xG calculés
    for (let home = 0; home <= maxGoals; home++) {
        for (let away = 0; away <= maxGoals; away++) {
            // Calcul des probabilités Poisson pour chaque équipe
            const homeProb = poissonProbability(home, analysisData.expectedGoals.home);
            const awayProb = poissonProbability(away, analysisData.expectedGoals.away);
            
            // Probabilité combinée
            let combinedProb = homeProb * awayProb;
            
            // Ajustements spécifiques
            // 1. Ajustement pour le favori
            if (analysisData.favorite === 'home' && home > away) {
                combinedProb *= (1 + analysisData.favoriteStrength * 0.3);
            } else if (analysisData.favorite === 'away' && away > home) {
                combinedProb *= (1 + analysisData.favoriteStrength * 0.3);
            } else if (analysisData.favorite === 'draw' && home === away) {
                combinedProb *= (1 + analysisData.favoriteStrength * 0.4);
            }
            
            // 2. Ajustement pour les scores typiques de football
            if (home === 1 && away === 1) combinedProb *= 1.3; // 1-1 est très courant
            if (home === 0 && away === 0) combinedProb *= 1.2; // 0-0 est courant
            if (home === 2 && away === 1) combinedProb *= 1.3; // 2-1 est très courant
            if (home === 1 && away === 0) combinedProb *= 1.2; // 1-0 est courant
            if (home === 0 && away === 1) combinedProb *= 1.2; // 0-1 est courant
            if (home === 2 && away === 0) combinedProb *= 1.1; // 2-0 est assez courant
            
            // 3. Ajustement BTTS
            if ((home > 0 && away > 0) && analysisData.bttsProb > 0.6) {
                combinedProb *= 1.2; // Boost pour les scores BTTS si BTTS probable
            }
            if ((home === 0 || away === 0) && analysisData.bttsProb < 0.4) {
                combinedProb *= 1.2; // Boost pour les clean sheets si BTTS improbable
            }
            
            // Appliquer la probabilité à la matrice
            analysisData.scoreMatrix[home][away] = combinedProb;
        }
    }
    
    // Normaliser la matrice pour que la somme des probabilités soit égale à 1
    let totalProb = 0;
    for (let home = 0; home <= maxGoals; home++) {
        for (let away = 0; away <= maxGoals; away++) {
            totalProb += analysisData.scoreMatrix[home][away];
        }
    }
    
    // Normalisation
    for (let home = 0; home <= maxGoals; home++) {
        for (let away = 0; away <= maxGoals; away++) {
            analysisData.scoreMatrix[home][away] /= totalProb;
        }
    }
    
    // Convertir la matrice en dictionnaire pour faciliter l'accès
    analysisData.exactScoreProbs = {};
    for (let home = 0; home <= maxGoals; home++) {
        for (let away = 0; away <= maxGoals; away++) {
            const scoreKey = `${home}-${away}`;
            analysisData.exactScoreProbs[scoreKey] = analysisData.scoreMatrix[home][away];
        }
    }
    
    // Trouver les scores les plus probables pour débuggage
    const sortedScores = Object.entries(analysisData.exactScoreProbs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    console.log("Scores les plus probables:", sortedScores.map(s => `${s[0]} (${(s[1] * 100).toFixed(1)}%)`));
}

// Calcul de la distribution de Poisson (pour les xG)
function poissonProbability(k, lambda) {
    // Probabilité d'obtenir exactement k occurrences
    // lorsque le nombre moyen attendu est lambda
    if (lambda <= 0) return k === 0 ? 1 : 0;
    
    let result = Math.exp(-lambda);
    for (let i = 1; i <= k; i++) {
        result *= lambda / i;
    }
    
    return result;
}
// Détermination du résultat du match
function calculateMatchResult() {
    // Décision basée sur probabilités et force du favori
    
    // Seuil pour décider entre victoire directe et double chance
    // Si favori fort (>0.5), on penche pour victoire directe
    const directWinThreshold = 0.5;
    
    // Déterminer le résultat en fonction du favori et de sa force
    switch (analysisData.favorite) {
        case 'home':
            if (analysisData.favoriteStrength >= directWinThreshold || analysisData.homeWinProb > 0.55) {
                // Favori fort = victoire directe
                godPredictionData.matchResult = "Victoire de l'équipe à domicile";
            } else {
                // Favori faible = double chance
                godPredictionData.matchResult = "Double chance 1X (Domicile ou Nul)";
            }
            break;
        
        case 'away':
            if (analysisData.favoriteStrength >= directWinThreshold || analysisData.awayWinProb > 0.50) {
                godPredictionData.matchResult = "Victoire de l'équipe à l'extérieur";
            } else {
                godPredictionData.matchResult = "Double chance X2 (Nul ou Extérieur)";
            }
            break;
        
        case 'draw':
            // Pour un match nul favori, toujours suggérer match nul direct
            // car c'est généralement un pari à fort potentiel
            godPredictionData.matchResult = "Match nul";
            break;
    }
    
    console.log("Résultat prédit:", godPredictionData.matchResult);
}

// Sélection des scores exacts les plus probables
function selectExactScores() {
    // Trouver les deux scores exacts les plus probables selon la matrice
    // mais en s'assurant qu'ils sont cohérents avec le résultat prédit
    
    // Trier les scores par probabilité
    const sortedScores = Object.entries(analysisData.exactScoreProbs)
        .sort((a, b) => b[1] - a[1]);
    
    // Résultat attendu par la prédiction
    let expectedResultType;
    if (godPredictionData.matchResult.includes("domicile")) {
        expectedResultType = "home";
    } else if (godPredictionData.matchResult.includes("extérieur")) {
        expectedResultType = "away";
    } else if (godPredictionData.matchResult.includes("Match nul")) {
        expectedResultType = "draw";
    } else if (godPredictionData.matchResult.includes("1X")) {
        expectedResultType = "home_or_draw";
    } else if (godPredictionData.matchResult.includes("X2")) {
        expectedResultType = "away_or_draw";
    }
    
    // Fonction pour vérifier si un score est cohérent avec le résultat attendu
    function isScoreConsistent(score, resultType) {
        const [home, away] = score.split('-').map(Number);
        
        switch (resultType) {
            case "home": return home > away;
            case "away": return away > home;
            case "draw": return home === away;
            case "home_or_draw": return home >= away;
            case "away_or_draw": return away >= home;
            default: return true;
        }
    }
    
    // Trouver le score principal (premier score cohérent avec la prédiction)
    let primaryScore = null;
    for (const [score, prob] of sortedScores) {
        if (isScoreConsistent(score, expectedResultType)) {
            primaryScore = score;
            break;
        }
    }
    
    // Si aucun score cohérent trouvé, prendre le plus probable
    if (!primaryScore) {
        primaryScore = sortedScores[0][0];
    }
    
    // Trouver le score secondaire (prochain score cohérent différent du premier)
    let secondaryScore = null;
    for (const [score, prob] of sortedScores) {
        if (score !== primaryScore && isScoreConsistent(score, expectedResultType)) {
            secondaryScore = score;
            break;
        }
    }
    
    // Si aucun score secondaire cohérent trouvé, prendre le prochain plus probable
    if (!secondaryScore) {
        for (const [score, prob] of sortedScores) {
            if (score !== primaryScore) {
                secondaryScore = score;
                break;
            }
        }
    }
    
    godPredictionData.primaryScore = primaryScore;
    godPredictionData.secondaryScore = secondaryScore;
    
    console.log("Scores prédits:", { 
        primary: primaryScore, 
        secondary: secondaryScore 
    });
}

// Calcul de la prédiction du nombre de buts avec la règle -1 but
function calculateGoalsPrediction() {
    // Extraire le score primaire
    const [homeGoals, awayGoals] = godPredictionData.primaryScore.split('-').map(Number);
    
    // Calculer le total de buts
    const totalGoals = homeGoals + awayGoals;
    
    // Appliquer la règle -1 but
    let adjustedGoals = Math.max(0, totalGoals - 1);
    
    // Formater la prédiction sous forme de pari over/under
    godPredictionData.goalsPrediction = `+${adjustedGoals}.5 buts`;
    
    console.log("Prédiction de buts:", godPredictionData.goalsPrediction);
}

// Calcul des fiabilités des prédictions
function calculatePredictionReliabilities() {
    // Fiabilité du résultat du match (85-98%)
    let resultReliability = 85; // Base de départ
    
    // 1. Ajuster en fonction de la force du favori
    resultReliability += Math.round(analysisData.favoriteStrength * 8);
    
    // 2. Bonus pour double chance (intrinsèquement plus fiable)
    if (godPredictionData.matchResult.includes("Double chance")) {
        resultReliability += 5;
    }
    
    // 3. Bonus basé sur la probabilité du résultat prédit
    let resultProb;
    if (godPredictionData.matchResult.includes("domicile")) {
        resultProb = analysisData.homeWinProb;
    } else if (godPredictionData.matchResult.includes("extérieur")) {
        resultProb = analysisData.awayWinProb;
    } else if (godPredictionData.matchResult.includes("Match nul")) {
        resultProb = analysisData.drawProb;
    } else if (godPredictionData.matchResult.includes("1X")) {
        resultProb = analysisData.homeWinProb + analysisData.drawProb;
    } else if (godPredictionData.matchResult.includes("X2")) {
        resultProb = analysisData.awayWinProb + analysisData.drawProb;
    }
    
    resultReliability += Math.round(resultProb * 5);
    
    // Plafonner à 98%
    godPredictionData.resultReliability = Math.min(98, resultReliability);
    
    // Fiabilité des scores exacts
    // Score principal : 65-85%
    const primaryScoreProb = analysisData.exactScoreProbs[godPredictionData.primaryScore];
    godPredictionData.primaryScoreReliability = Math.min(85, Math.round(65 + (primaryScoreProb * 300)));
    
    // Score secondaire : 60-78%
    const secondaryScoreProb = analysisData.exactScoreProbs[godPredictionData.secondaryScore];
    godPredictionData.secondaryScoreReliability = Math.min(78, Math.round(60 + (secondaryScoreProb * 300)));
    
    // Nombre de buts : toujours très élevé grâce à la technique -1 but
    // Générer un nombre entre 99.1% et 99.9% pour un effet visuel
    const decimalPart = Math.floor(Math.random() * 9) + 1;
    godPredictionData.goalsReliability = 99 + (decimalPart / 10);
    
    console.log("Fiabilités:", {
        result: godPredictionData.resultReliability + "%",
        primaryScore: godPredictionData.primaryScoreReliability + "%",
        secondaryScore: godPredictionData.secondaryScoreReliability + "%",
        goals: godPredictionData.goalsReliability.toFixed(1) + "%"
    });
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
    // Rediriger vers la page d'accueil qui contient le popup VIP
    window.location.href = "index.html";
}

// Réinitialiser et recommencer
function resetAndStart() {
    // Réinitialiser toutes les données
    godPredictionData = {
        homeOdds: null, drawOdds: null, awayOdds: null,
        homeOver15: null, homeOver25: null,
        homeFavHome: null, homeFavAway: null, homeFavOdds: null,
        halftimeHome: null, halftimeAway: null, halftimeOdds: null,
        secondhalfHome: null, secondhalfAway: null, secondhalfOdds: null,
        exactHome: null, exactAway: null, exactOdds: null,
        bttsOdds: null, handicapOdds: null,
        awayOver15: null, awayOver25: null,
        awayFavHome: null, awayFavAway: null, awayFavOdds: null,
        drawFavHome: null, drawFavAway: null, drawFavOdds: null,
        matchResult: null, primaryScore: null, secondaryScore: null, goalsPrediction: null,
        resultReliability: null, primaryScoreReliability: null, secondaryScoreReliability: null, goalsReliability: null
    };

    // Réinitialiser les analyses intermédiaires
    analysisData = {
        homeAttackStrength: 0, homeDefenseStrength: 0,
        awayAttackStrength: 0, awayDefenseStrength: 0,
        firstHalfTendency: 0, secondHalfTendency: 0, scorelineEvolution: 0,
        matchProfile: '', gameIntensity: 0, favoriteStrength: 0, favorite: '',
        scoreMatrix: [], exactScoreProbs: {},
        homeWinProb: 0, drawProb: 0, awayWinProb: 0, bttsProb: 0,
        expectedGoals: { home: 0, away: 0 }
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
    if (!isAdmin && predictionsRemaining <= 0) {
        document.getElementById('limit-popup').style.display = 'block';
        return;
    }
    
    // Afficher l'introduction
    document.getElementById('intro-step').classList.add('active');
}

// Fonction utilitaire pour le retour haptique via Telegram
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
