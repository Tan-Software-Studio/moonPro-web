let latestHistoricalBar = null;

function setNewLatestHistoricalBar(bar) {
    console.log('trying to set new bar', bar);
    const convertedTime = bar?.time;
    if (!latestHistoricalBar) {
        console.log('no bar set yet');
        latestHistoricalBar = bar;
    } else {
        if (convertedTime > latestHistoricalBar?.time) {
            console.log('new bar more latest than old bar');
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