let latestHistoricalBar = null;
let currentResolution = null;

function setNewLatestHistoricalBar(bar, newResolution) {
    if (currentResolution !== newResolution) {
        latestHistoricalBar = null;
        currentResolution = newResolution;
    }
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
    currentResolution = null;
};

module.exports = { setNewLatestHistoricalBar, getLatestHistoricalBar, clearLatestHistoricalBar }