const themes = {1: 'JavaScript', 2: 'HTML', 3: 'CSS'};

export function loadGames() {
    const games = localStorage.getItem('quizHistory');
    return games ? JSON.parse(games) : [];
}

export function getAverageScoreByTheme() {
    const games = loadGames();
    return Object.keys(themes)
        .map(themeId => {
            const themeGames = games.filter(game => game.theme == themeId);
            const themeName = themes[themeId];
            
            if (themeGames.length === 0) {
                return {
                    theme: themeName,
                    average: 0,
                    totalGames: 0
                };
            }

            const totalScore = themeGames.reduce((sum, game) => sum + game.score, 0);
            return {
                theme: themeName,
                average: Math.round((totalScore / themeGames.length) * 100) / 100,
                totalGames: themeGames.length
            };
        });
}

// Compter les parties par thématique
export function getGamesCountByTheme() {
    const games = loadGames();
    return Object.keys(themes)
        .map(themeId => ({
            theme: themes[themeId],
            count: games.filter(game => game.theme == themeId).length
        }));
}

// Obtenir le top 3 des joueurs
export function getTopPlayers() {
    const games = loadGames();

    const playerStats = games.reduce((acc, game) => {
        if (!acc[game.pseudo]) {
            acc[game.pseudo] = {
                pseudo: game.pseudo,
                totalScore: 0,
                gamesPlayed: 0,
                bestScore: 0
            };
        }
        
        acc[game.pseudo].totalScore += game.score;
        acc[game.pseudo].gamesPlayed += 1;
        acc[game.pseudo].bestScore = Math.max(acc[game.pseudo].bestScore, game.score);
        
        return acc;
    }, {});

    // Convertir en tableau, calculer moyenne et trier
    return Object.values(playerStats)
        .map(player => ({
            ...player,
            averageScore: Math.round((player.totalScore / player.gamesPlayed) * 100) / 100
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 3); // Top 3
}

// Obtenir les statistiques générales
export function getGeneralStats() {
    const games = loadGames();
    if (games.length === 0) {
        return {
            totalGames: 0,
            averageScore: 0,
            bestScore: 0,
            totalPlayTime: 0
        };
    }

    const totalScore = games.reduce((sum, game) => sum + game.score, 0);
    const bestScore = games.reduce((max, game) => Math.max(max, game.score), 0);
    const totalTime = games.reduce((sum, game) => sum + (game.time || 0), 0);

    return {
        totalGames: games.length,
        averageScore: Math.round((totalScore / games.length) * 100) / 100,
        bestScore: bestScore,
        totalPlayTime: totalTime
    };
}

// Obtenir les dernières parties (5 dernières)
export function getRecentGames() {
    const games = loadGames();
    return games
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 5)
        .map(game => ({
            ...game,
            themeName: themes[game.theme] || 'Inconnu'
        }));
}