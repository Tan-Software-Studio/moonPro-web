let latestHistoricalBar = null;

function setNewLatestHistoricalBar(bar) {
    const convertedTime = bar?.time;
    if (!latestHistoricalBar) {
        latestHistoricalBar = bar;
    } else {
        if (convertedTime > latestHistoricalBar?.time) {
            latestHistoricalBar = bar;
        }
    }
};

function getLatestHistoricalBar() {
    return latestHistoricalBar;
}

function clearLatestHistoricalBar() {
    latestHistoricalBar = null;
};

module.exports = { setNewLatestHistoricalBar, getLatestHistoricalBar, clearLatestHistoricalBar }