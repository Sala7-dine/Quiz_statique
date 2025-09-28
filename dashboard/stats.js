const themes = [
  {
    id: 1,
    titre: "JavaScript",
    description: "Testez vos connaissances en JavaScript : syntaxe, fonctions et objets."
  },
  {
    id: 2,
    titre: "html",
    description: "Un quiz sur la structure HTML."
  },
  {
    id: 3,
    titre: "css",
    description: "Mesurez vos compétences logiques et CSS."
  }
];

// obtenir un thème par ID
function getThemeById(id) {
    return themes.find(theme => theme.id === id);
}


// Charger les parties depuis localStorage
export function loadGames() {
    const games = localStorage.getItem('quizHistory');
    // console.log(games);
    return games ? JSON.parse(games) : [];
}

// Calculer le score moyen par thématique en utilisant filter et reduce
export function getAverageScoreByTheme() {
    const games = loadGames();
    return themes.map(theme => {
        const themeGames = games.filter(game => game.theme === theme.id);
        
        if (themeGames.length === 0) {
            return {
                theme: theme.titre,
                themeId: theme.id,
                average: 0,
                totalGames: 0,
                description: theme.description
            };
        }

        const totalScore = themeGames.reduce((sum, game) => sum + game.score, 0);
        return {
            theme: theme.titre,
            themeId: theme.id,
            average: Math.round((totalScore / themeGames.length) * 100) / 100,
            totalGames: themeGames.length,
            description: theme.description
        };
    });
}

// Compter les parties par thématique en utilisant filter
export function getGamesCountByTheme() {
    const games = loadGames();
    return themes.map(theme => ({
        theme: theme.titre,
        themeId: theme.id,
        count: games.filter(game => game.theme === theme.id).length,
        description: theme.description
    }));
}

// Obtenir le top 3 des joueurs
export function getTopPlayers() {
    const games = loadGames();
    // Regrouper par pseudo avec reduce
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

    // calculer moyenne et trier
    return Object.values(playerStats)
        .map(player => ({
            ...player,
            averageScore: Math.round((player.totalScore / player.gamesPlayed) * 100) / 100
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 3); // Top 3
}

console.log(getTopPlayers());

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
        .map(game => {
            const theme = getThemeById(game.theme);
            return {
                ...game,
                themeName: theme ? theme.titre : 'Inconnu'
            };
        });
}

// Exporter les thèmes pour les autres modules
export { themes };