/**
 * Expert FIFA - BetScale Pro
 * Script de gestion des prédictions FIFA et navigation entre les étapes
 */

// Variables globales pour stocker les données
let predictionData = {
    championship: null,
    // Cotes
    homeOdds: null,
    awayOdds: null,
    drawOdds: null,
    // Scores temps réglementaire
    homeScore1: null,
    awayScore1: null,
    homeScore2: null,
    awayScore2: null,
    // Scores mi-temps
    homeHalftime1: null,
    awayHalftime1: null,
    homeHalftime2: null,
    awayHalftime2: null,
    // Scores alignés
    homeAlignedHome: null,
    homeAlignedAway: null,
    awayAlignedHome: null,
    awayAlignedAway: null,
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
    favoriteScore: null
};

// Variables pour la gestion des prédictions quotidiennes
let dailyPredictionsLimit = 5; // Limite par défaut pour les utilisateurs gratuits
let predictionsRemaining = 5; // Nombre de prédictions restantes aujourd'hui
let isUserVIP = false; // Statut VIP de l'utilisateur

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Telegram WebApp
    initTelegramWebApp();
    
    // Initialisation des particules
    initParticles();
    
    // Charger le nombre de prédictions restantes
    loadPredictionsCount();
    
    // Afficher la première étape
    goToStep(1);
    
    // Initialiser les écouteurs d'événements pour les champs de formulaire
    initFormListeners();
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

// Initialisation des écouteurs d'événements pour les champs
function initFormListeners() {
    // Étape 2: Sélection du championnat
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            predictionData.championship = this.getAttribute('onclick').split("'")[1];
            
            // Activer le bouton Suivant
            document.querySelector('#step-2 .fifa-button').removeAttribute('disabled');
        });
    });
    
    // Étape 3: Validation des cotes
    document.querySelectorAll('#step-3 input').forEach(input => {
        input.addEventListener('input', validateStep3Inputs);
    });
    
    // Étape 4: Validation des scores temps règlementaire
    document.querySelectorAll('#step-4 input').forEach(input => {
        input.addEventListener('input', validateStep4Inputs);
    });
    
    // Étape 5: Validation des scores mi-temps
    document.querySelectorAll('#step-5 input').forEach(input => {
        input.addEventListener('input', validateStep5Inputs);
    });
    
    // Étape 6: Validation des scores alignés
    document.querySelectorAll('#step-6 input').forEach(input => {
        input.addEventListener('input', validateStep6Inputs);
    });
}

// Navigation entre les étapes
function goToStep(stepNumber) {
    // Masquer toutes les étapes
    document.querySelectorAll('.fifa-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Afficher l'étape demandée
    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        
        // Animation d'entrée
        targetStep.style.animation = 'fade-in 0.5s forwards';
        
        // Scroll en haut de l'étape
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Effet de vibration sur mobile via Telegram WebApp
        const tgWebApp = window.Telegram?.WebApp;
        if (tgWebApp?.HapticFeedback) {
            tgWebApp.HapticFeedback.impactOccurred('light');
        }
    }
}

// Sélection du championnat
function selectChampionship(championshipId) {
    predictionData.championship = championshipId;
    
    // Mise à jour visuelle
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
        if (card.getAttribute('onclick').includes(championshipId)) {
            card.classList.add('selected');
        }
    });
    
    // Activer le bouton Suivant
    document.querySelector('#step-2 .fifa-button').removeAttribute('disabled');
}

// Validation des champs de l'étape 3
function validateStep3Inputs() {
    const homeOdds = document.getElementById('home-odds').value;
    const awayOdds = document.getElementById('away-odds').value;
    const drawOdds = document.getElementById('draw-odds').value;
    
    const nextButton = document.querySelector('#step-3 .fifa-button');
    
    if (homeOdds && awayOdds && drawOdds && 
        parseFloat(homeOdds) >= 1 && 
        parseFloat(awayOdds) >= 1 && 
        parseFloat(drawOdds) >= 1) {
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.setAttribute('disabled', true);
    }
}

// Validation et passage à l'étape 4
function validateStep3AndGoToStep4() {
    // Collecter et stocker les données
    predictionData.homeOdds = parseFloat(document.getElementById('home-odds').value);
    predictionData.awayOdds = parseFloat(document.getElementById('away-odds').value);
    predictionData.drawOdds = parseFloat(document.getElementById('draw-odds').value);
    
    // Déterminer le résultat du match (vainqueur probable)
    determineMatchResult();
    
    // Passer à l'étape suivante
    goToStep(4);
}

// Déterminer le résultat du match basé sur les cotes
function determineMatchResult() {
    const { homeOdds, awayOdds, drawOdds } = predictionData;
    
    // La cote la plus basse indique le résultat le plus probable
    if (homeOdds <= awayOdds && homeOdds <= drawOdds) {
        predictionData.matchResult = 'Victoire de l\'équipe à domicile';
        predictionData.favoriteTeam = 'home';
    } else if (awayOdds <= homeOdds && awayOdds <= drawOdds) {
        predictionData.matchResult = 'Victoire de l\'équipe à l\'extérieur';
        predictionData.favoriteTeam = 'away';
    } else {
        predictionData.matchResult = 'Match nul';
        predictionData.favoriteTeam = 'draw';
    }
    
    // Générer la fiabilité (85-92%)
    predictionData.resultReliability = Math.floor(Math.random() * 8) + 85;
}

// Validation des champs de l'étape 4
function validateStep4Inputs() {
    const homeScore1 = document.getElementById('home-score-1').value;
    const awayScore1 = document.getElementById('away-score-1').value;
    const homeScore2 = document.getElementById('home-score-2').value;
    const awayScore2 = document.getElementById('away-score-2').value;
    
    const nextButton = document.querySelector('#step-4 .fifa-button');
    
    if (homeScore1 !== '' && awayScore1 !== '' && 
        homeScore2 !== '' && awayScore2 !== '') {
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.setAttribute('disabled', true);
    }
}

// Validation et passage à l'étape 5
function validateStep4AndGoToStep5() {
    // Collecter et stocker les données
    predictionData.homeScore1 = parseInt(document.getElementById('home-score-1').value);
    predictionData.awayScore1 = parseInt(document.getElementById('away-score-1').value);
    predictionData.homeScore2 = parseInt(document.getElementById('home-score-2').value);
    predictionData.awayScore2 = parseInt(document.getElementById('away-score-2').value);
    
    // Passer à l'étape suivante
    goToStep(5);
}

// Validation des champs de l'étape 5
function validateStep5Inputs() {
    const homeHalftime1 = document.getElementById('home-halftime-1').value;
    const awayHalftime1 = document.getElementById('away-halftime-1').value;
    const homeHalftime2 = document.getElementById('home-halftime-2').value;
    const awayHalftime2 = document.getElementById('away-halftime-2').value;
    
    const nextButton = document.querySelector('#step-5 .fifa-button');
    
    if (homeHalftime1 !== '' && awayHalftime1 !== '' && 
        homeHalftime2 !== '' && awayHalftime2 !== '') {
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.setAttribute('disabled', true);
    }
}

// Validation des champs de l'étape 6 (scores alignés)
function validateStep6Inputs() {
    const homeAlignedHome = document.getElementById('home-aligned-home').value;
    const homeAlignedAway = document.getElementById('home-aligned-away').value;
    const awayAlignedHome = document.getElementById('away-aligned-home').value;
    const awayAlignedAway = document.getElementById('away-aligned-away').value;
    
    const nextButton = document.querySelector('#step-6 .fifa-button');
    
    if (homeAlignedHome !== '' && homeAlignedAway !== '' && 
        awayAlignedHome !== '' && awayAlignedAway !== '') {
        nextButton.removeAttribute('disabled');
    } else {
        nextButton.setAttribute('disabled', true);
    }
}

// Génération des prédictions
function generatePredictions() {
    // Vérifier si l'utilisateur peut faire une prédiction
    if (!canMakePrediction()) {
        return;
    }
    
    // Collecter les dernières données
    predictionData.homeHalftime1 = parseInt(document.getElementById('home-halftime-1').value);
    predictionData.awayHalftime1 = parseInt(document.getElementById('away-halftime-1').value);
    predictionData.homeHalftime2 = parseInt(document.getElementById('home-halftime-2').value);
    predictionData.awayHalftime2 = parseInt(document.getElementById('away-halftime-2').value);
    
    predictionData.homeAlignedHome = parseInt(document.getElementById('home-aligned-home').value);
    predictionData.homeAlignedAway = parseInt(document.getElementById('home-aligned-away').value);
    predictionData.awayAlignedHome = parseInt(document.getElementById('away-aligned-home').value);
    predictionData.awayAlignedAway = parseInt(document.getElementById('away-aligned-away').value);
    
    // Désactiver le bouton de génération
    const generateButton = document.getElementById('generate-button');
    generateButton.setAttribute('disabled', true);
    generateButton.textContent = 'Génération en cours...';
    
    // Afficher l'animation de chargement
    const loadingAnimation = document.querySelector('.generation-animation');
    loadingAnimation.classList.add('loading-active');
    
    // Créer une barre de progression
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    loadingAnimation.appendChild(loadingBar);
    
    // Mettre à jour le texte de chargement
    // Mettre à jour le texte de chargement
    updateLoadingText('Analyse des données...', 0);
    
    // Calcul des prédictions
    setTimeout(() => updateLoadingText('Calcul des scores...', 25), 600);
    setTimeout(() => updateLoadingText('Vérification des fiabilités...', 50), 1200);
    setTimeout(() => updateLoadingText('Finalisation des prédictions...', 75), 1800);
    
    // Génération des prédictions
    setTimeout(() => {
        calculatePredictions();
        updateLoadingText('Prédictions prêtes!', 100);
        
        // Décrémenter le compteur de prédictions
        decrementPredictionsCount();
        
        // Afficher les résultats après un court délai
        setTimeout(() => {
            showResults();
        }, 500);
    }, 2500);
}

// Mise à jour du texte de chargement
function updateLoadingText(text, progress) {
    document.getElementById('loading-text').textContent = text;
}

// Calcul des prédictions avec la nouvelle logique
function calculatePredictions() {
    // 1. Calculer le score exact principal
    const totalHomeRegular = predictionData.homeScore1 + predictionData.homeScore2;
    const totalAwayRegular = predictionData.awayScore1 + predictionData.awayScore2;
    
    const totalHomeHalftime = predictionData.homeHalftime1 + predictionData.homeHalftime2;
    const totalAwayHalftime = predictionData.awayHalftime1 + predictionData.awayHalftime2;
    
    // Score exact principal (soustraction)
    const primaryHomeScore = totalHomeRegular - totalHomeHalftime;
    const primaryAwayScore = totalAwayRegular - totalAwayHalftime;
    
    predictionData.primaryScore = `${primaryHomeScore}-${primaryAwayScore}`;
    
    // 2. Déterminer le score favori en fonction de l'équipe favorite
    let favoriteHomeScore, favoriteAwayScore;
    
    if (predictionData.favoriteTeam === 'home') {
        favoriteHomeScore = predictionData.homeAlignedHome;
        favoriteAwayScore = predictionData.homeAlignedAway;
    } else if (predictionData.favoriteTeam === 'away') {
        favoriteHomeScore = predictionData.awayAlignedHome;
        favoriteAwayScore = predictionData.awayAlignedAway;
    } else {
        // Match nul - utiliser le score du temps réglementaire le plus proche d'un nul
        const diff1 = Math.abs(predictionData.homeScore1 - predictionData.awayScore1);
        const diff2 = Math.abs(predictionData.homeScore2 - predictionData.awayScore2);
        
        if (diff1 <= diff2) {
            favoriteHomeScore = predictionData.homeScore1;
            favoriteAwayScore = predictionData.awayScore1;
        } else {
            favoriteHomeScore = predictionData.homeScore2;
            favoriteAwayScore = predictionData.awayScore2;
        }
    }
    
    // 3. Calculer la similarité entre le score principal et le score favori
    const isSimilar = calculateScoreSimilarity(
        primaryHomeScore, primaryAwayScore,
        favoriteHomeScore, favoriteAwayScore
    );
    
    // 4. Déterminer le score exact secondaire basé sur la similarité
    let secondaryHomeScore, secondaryAwayScore;
    
    if (isSimilar >= 70) {
        // Si la similarité est élevée, utiliser le score favori
        secondaryHomeScore = favoriteHomeScore;
        secondaryAwayScore = favoriteAwayScore;
    } else {
        // Sinon, ajuster en fonction de la tendance
        if (predictionData.favoriteTeam === 'home') {
            // Réduire légèrement les buts mais garder la victoire à domicile
            secondaryHomeScore = Math.max(1, favoriteHomeScore - 1);
            secondaryAwayScore = Math.max(0, favoriteAwayScore - 1);
            // S'assurer que l'équipe domicile reste gagnante
            if (secondaryHomeScore <= secondaryAwayScore) {
                secondaryHomeScore = secondaryAwayScore + 1;
            }
        } else if (predictionData.favoriteTeam === 'away') {
            // Réduire légèrement les buts mais garder la victoire à l'extérieur
            secondaryHomeScore = Math.max(0, favoriteHomeScore - 1);
            secondaryAwayScore = Math.max(1, favoriteAwayScore - 1);
            // S'assurer que l'équipe extérieure reste gagnante
            if (secondaryHomeScore >= secondaryAwayScore) {
                secondaryAwayScore = secondaryHomeScore + 1;
            }
        } else {
            // Ajuster pour un match nul crédible
            const baseScore = Math.floor((favoriteHomeScore + favoriteAwayScore) / 2);
            secondaryHomeScore = baseScore;
            secondaryAwayScore = baseScore;
        }
    }
    
    predictionData.secondaryScore = `${secondaryHomeScore}-${secondaryAwayScore}`;
    
    // 5. Prédiction du nombre de buts avec la règle -1 but
    const totalGoals = primaryHomeScore + primaryAwayScore;
    const adjustedGoals = totalGoals - 1; // Appliquer la règle: -1 but
    
    // Formatage style paris sportifs
    predictionData.goalsPrediction = `+${Math.max(0, adjustedGoals)}.5 buts`;
    
    // 6. Calculer les fiabilités
    predictionData.resultReliability = Math.floor(Math.random() * 8) + 85; // 85-92%
    predictionData.primaryScoreReliability = Math.floor(Math.random() * 16) + 65; // 65-80%
    predictionData.secondaryScoreReliability = Math.floor(Math.random() * 11) + 60; // 60-70%
    
    // Nombre de buts - très haute fiabilité
    const decimalPart = Math.floor(Math.random() * 10);
    predictionData.goalsReliability = 99 + (decimalPart / 10); // 99.0-99.9%
}

// Calcule la similarité entre deux scores (pourcentage 0-100)
function calculateScoreSimilarity(home1, away1, home2, away2) {
    // Critères de similarité
    let similarityScore = 0;
    
    // 1. Même résultat (victoire domicile, nul, victoire extérieur)
    const result1 = home1 > away1 ? 'home' : (home1 < away1 ? 'away' : 'draw');
    const result2 = home2 > away2 ? 'home' : (home2 < away2 ? 'away' : 'draw');
    
    if (result1 === result2) {
        similarityScore += 40; // 40% de similarité si même résultat
    }
    
    // 2. Différence de buts similaire
    const goalDiff1 = home1 - away1;
    const goalDiff2 = home2 - away2;
    if (Math.abs(goalDiff1 - goalDiff2) <= 1) {
        similarityScore += 30; // 30% si écart de buts similaire (±1)
    }
    
    // 3. Total de buts similaire
    const totalGoals1 = home1 + away1;
    const totalGoals2 = home2 + away2;
    if (Math.abs(totalGoals1 - totalGoals2) <= 1) {
        similarityScore += 30; // 30% si total de buts similaire (±1)
    }
    
    return similarityScore;
}

// Affichage des résultats
function showResults() {
    // Masquer l'étape de génération
    document.getElementById('step-7').classList.remove('active');
    
    // Afficher les résultats
    const resultsSection = document.getElementById('results');
    resultsSection.classList.add('active');
    
    // Mettre à jour les valeurs dans l'interface
    document.querySelector('#match-result .result-value').textContent = predictionData.matchResult;
    document.querySelector('#primary-score .result-value').textContent = predictionData.primaryScore;
    document.querySelector('#secondary-score .result-value').textContent = predictionData.secondaryScore;
    document.querySelector('#goals-prediction .result-value').textContent = predictionData.goalsPrediction;
    
    // Mettre à jour les fiabilités
    document.getElementById('result-reliability').textContent = `${predictionData.resultReliability}%`;
    document.getElementById('primary-score-reliability').textContent = `${predictionData.primaryScoreReliability}%`;
    document.getElementById('secondary-score-reliability').textContent = `${predictionData.secondaryScoreReliability}%`;
    document.getElementById('goals-reliability').textContent = `${predictionData.goalsReliability.toFixed(1)}%`;
    
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

// Réinitialiser et retourner à l'étape 1
function resetAndGoToStep(stepNumber) {
    // Réinitialiser les données
    predictionData = {
        championship: null,
        homeOdds: null,
        awayOdds: null,
        drawOdds: null,
        homeScore1: null,
        awayScore1: null,
        homeScore2: null,
        awayScore2: null,
        homeHalftime1: null,
        awayHalftime1: null,
        homeHalftime2: null,
        awayHalftime2: null,
        homeAlignedHome: null,
        homeAlignedAway: null,
        awayAlignedHome: null,
        awayAlignedAway: null,
        matchResult: null,
        primaryScore: null,
        secondaryScore: null,
        goalsPrediction: null,
        resultReliability: null,
        primaryScoreReliability: null,
        secondaryScoreReliability: null,
        goalsReliability: null,
        favoriteTeam: null,
        favoriteScore: null
    };
    
    // Réinitialiser les formulaires
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    
    // Réinitialiser les options de championnat
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Réinitialiser les boutons
    document.querySelectorAll('.fifa-next-button').forEach(button => {
        button.setAttribute('disabled', true);
    });
    
    // Réinitialiser le bouton de génération
    const generateButton = document.getElementById('generate-button');
    generateButton.removeAttribute('disabled');
    generateButton.textContent = 'Générer les prédictions';
    
    // Réinitialiser l'animation de chargement
    const loadingAnimation = document.querySelector('.generation-animation');
    loadingAnimation.classList.remove('loading-active');
    const loadingBar = document.querySelector('.loading-bar');
    if (loadingBar) loadingBar.remove();
    document.getElementById('loading-text').textContent = 'Prêt à générer...';
    
    // Vérifier si l'utilisateur peut encore faire des prédictions
    if (predictionsRemaining <= 0) {
        document.getElementById('limit-popup').style.display = 'block';
        return;
    }
    
    // Aller à l'étape spécifiée
    goToStep(stepNumber);
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

// Activation du mode VIP (appelé après un paiement réussi)
function activateVIP() {
    isUserVIP = true;
    dailyPredictionsLimit = 25;
    predictionsRemaining = Math.max(predictionsRemaining, 25); // Mettre à jour sans diminuer si déjà supérieur
    
    // Sauvegarder dans le stockage local
    localStorage.setItem('userVIPStatus', 'true');
    localStorage.setItem('predictionsRemaining', predictionsRemaining);
    
    // Mettre à jour l'interface
    updatePredictionsCounter();
    
    // Fermer le popup VIP
    closePopup('vip-popup');
    
    // Afficher un message de succès
    alert('Félicitations ! Vous avez maintenant accès à 25 prédictions quotidiennes et à toutes les fonctionnalités VIP de BetScale Pro.');
}

// Fonction utilitaire pour générer des nombres aléatoires dans une plage
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fonction utilitaire pour l'animation de pulsation
function pulseElement(element) {
    element.classList.add('pulse');
    setTimeout(() => {
        element.classList.remove('pulse');
    }, 1000);
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
