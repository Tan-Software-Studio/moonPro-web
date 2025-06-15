function getPointsToNextTitle(user) {
    const points =
        (user?.dailyPoints || 0) +
        (user?.tradePoints || 0) +
        (user?.weeklyPoints || 0) +
        (user?.referralPoints || 0);

    const levels = [
        { min: 0, max: 500, title: "Explorer" },
        { min: 500, max: 2000, title: "Trader" },
        { min: 2000, max: 5000, title: "Voyager" },
        { min: 5000, max: 12000, title: "Prodigy" },
        { min: 12000, max: 25000, title: "Elite" },
        { min: 25000, max: 50000, title: "Master" },
        { min: 50000, max: Infinity, title: "Legend" },
    ];

    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        if (points < level.max) {
            return {
                currentTitle: level.title,
                pointsToNext:
                    level.max === Infinity ? 0 : Math.max(level.max - points, 0),
                nextTitle: levels[i + 1]?.title || "Legend",
                maxLevelComplete: points < 50000 ? true : false,
            };
        }
    }

    localStorage.setItem("Rewards-Level", currentTitle);
    return {
        currentTitle: "Unknown",
        pointsToNext: 0,
        nextTitle: null,
        maxLevelComplete: true,
    };
}

export default getPointsToNextTitle