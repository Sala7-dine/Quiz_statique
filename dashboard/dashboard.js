import {
    loadGames, 
    getAverageScoreByTheme, 
    getGamesCountByTheme, 
    getTopPlayers, 
    getGeneralStats, 
    getRecentGames 
} from './stats.js';

function initDashboard() {
    loadAllStats();
}

function loadAllStats() {
    displayGeneralStats();
    displayThemeAverages();
    displayThemeCounts();
    displayTopPlayers();
    displayRecentGames();

    createThemeChart();
    createProgressChart();
}

// Afficher les statistiques générales
function displayGeneralStats() {
    const stats = getGeneralStats();
    
    document.getElementById('total-games').textContent = stats.totalGames;
    document.getElementById('average-score').textContent = stats.averageScore.toFixed(1);
    document.getElementById('best-score').textContent = stats.bestScore;
    document.getElementById('total-time').textContent = formatTime(stats.totalPlayTime);

}

// Afficher les scores moyens par thématique
function displayThemeAverages() {
    const averages = getAverageScoreByTheme();
    const container = document.getElementById('theme-averages');
    
    if (averages.length === 0 || averages.every(avg => avg.totalGames === 0)) {
        container.innerHTML = '<div class="no-data">Aucune donnée disponible</div>';
        return;
    }

    container.innerHTML = averages
        .map(avg => `
            <div class="theme-card ${avg.theme.toLowerCase()}">
                <div class="theme-name">${avg.theme}</div>
                <div class="theme-value">${avg.average.toFixed(1)}</div>
                <div class="theme-detail">${avg.totalGames} partie(s)</div>
            </div>
        `).join('');
}

// Afficher le nombre de parties par thématique
function displayThemeCounts() {
    const counts = getGamesCountByTheme();
    const container = document.getElementById('theme-counts');
    
    if (counts.every(count => count.count === 0)) {
        container.innerHTML = '<div class="no-data">Aucune partie jouée</div>';
        return;
    }

    container.innerHTML = counts
        .map(count => `
            <div class="theme-card ${count.theme.toLowerCase()}">
                <div class="theme-name">${count.theme}</div>
                <div class="theme-value">${count.count}</div>
                <div class="theme-detail">partie(s) jouée(s)</div>
            </div>
        `).join('');
}

// Afficher le top 3 des joueurs
function displayTopPlayers() {
    const topPlayers = getTopPlayers();
    const container = document.getElementById('top-players');
    
    if (topPlayers.length === 0) {
        container.innerHTML = '<div class="no-data">Aucun joueur enregistré</div>';
        return;
    }

    container.innerHTML = topPlayers
        .map((player, index) => `
            <div class="player-rank">
                <div class="rank-position rank-${index + 1}">${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">${player.pseudo}</div>
                    <div class="player-stats">
                        ${player.gamesPlayed} partie(s) • 
                        Meilleur: ${player.bestScore}
                    </div>
                </div>
                <div class="player-score">${player.averageScore.toFixed(1)}</div>
            </div>
        `).join('');
}

// Afficher les dernières parties
function displayRecentGames() {
    const recentGames = getRecentGames();
    const container = document.getElementById('recent-games');
    
    if (recentGames.length === 0) {
        container.innerHTML = '<div class="no-data">Aucune partie récente</div>';
        return;
    }

    container.innerHTML = recentGames
        .map(game => `
            <div class="game-item">
                <div class="game-info">
                    <div class="game-theme">${game.themeName}</div>
                    <div class="game-details">
                        ${game.pseudo} • 
                        ${game.date ? new Date(game.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </div>
                </div>
                <div class="game-score">${game.score}</div>
            </div>
        `).join('');
}

// Créer le graphique de répartition par thématique
function createThemeChart() {
    const counts = getGamesCountByTheme();
    const ctx = document.getElementById('themeChart').getContext('2d');
    
    // Couleurs pour chaque thématique
    const colors = {
        'JavaScript': 'hsl(45, 93%, 47%)',
        'HTML': 'hsl(0, 72%, 51%)',
        'CSS': 'hsl(262, 83%, 58%)'
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: counts.map(count => count.theme),
            datasets: [{
                data: counts.map(count => count.count),
                backgroundColor: counts.map(count => colors[count.theme] || 'hsl(215, 20%, 65%)'),
                borderWidth: 2,
                borderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
                            return `${context.label}: ${context.parsed} parties (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Créer le graphique de progression des scores
function createProgressChart() {
    const games = loadGames();
    
    if (games.length === 0) {
        const ctx = document.getElementById('progressChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Aucune donnée'],
                datasets: [{
                    label: 'Score',
                    data: [0],
                    borderColor: 'hsl(215, 20%, 65%)',
                    backgroundColor: 'hsl(215, 20%, 65%, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return;
    }
    
    // Trier les parties par date
    const sortedGames = games
        .filter(game => game.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Grouper par thématique
    const themes = {1: 'JavaScript', 2: 'HTML', 3: 'CSS'};
    const themeColors = {
        'JavaScript': 'hsl(45, 93%, 47%)',
        'HTML': 'hsl(0, 72%, 51%)',
        'CSS': 'hsl(262, 83%, 58%)'
    };
    
    const datasets = [];
    
    Object.keys(themes).forEach(themeId => {
        const themeGames = sortedGames.filter(game => game.theme == themeId);
        if (themeGames.length > 0) {
            datasets.push({
                label: themes[themeId],
                data: themeGames.map(game => game.score),
                borderColor: themeColors[themes[themeId]],
                backgroundColor: themeColors[themes[themeId]] + '20',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            });
        }
    });
    
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedGames.map((game, index) => `Partie ${index + 1}`),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const gameIndex = context[0].dataIndex;
                            const game = sortedGames[gameIndex];
                            return new Date(game.date).toLocaleDateString('fr-FR');
                        },
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} points`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...sortedGames.map(g => g.score)) + 2,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Progression dans le temps'
                    }
                }
            }
        }
    });
}

// Formater le temps en HH:MM:SS
function formatTime(totalSeconds) {
    if (!totalSeconds) return '00:00:00';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}



// Json
const jsonResult = {
    players : loadGames(),
    games : getGamesCountByTheme(),
    statistics : getGeneralStats()
};

document.getElementById("exportBtn").addEventListener("click", () => {

    const jsonData = JSON.stringify({ ...jsonResult }, null, 2);

    // Créer un blob
    const blob = new Blob([jsonData], { type: "application/json" });

    // Créer un lien de téléchargement temporaire
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jsonResult.json";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Csv
const csvResult = [
    getGeneralStats()
];

function convertirEnCSV(data) {
    const enTetes = Object.keys(data[0]);
    const lignes = data.map(obj => enTetes.map(cle => obj[cle]).join(","));
    return [enTetes.join(","), ...lignes].join("\n");
}

document.getElementById("exportCsvBtn").addEventListener("click", () => {
    const csvData = convertirEnCSV(csvResult);

    // Créer un blob
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "csvResult.csv";
    document.body.appendChild(a);
    a.click();


    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});




document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
