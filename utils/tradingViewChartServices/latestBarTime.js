let latestBarTime = null;

function setNewLatestBarTime(time) {
    const convertedTime = time / 1000;
    if (!latestBarTime) {
        latestBarTime = convertedTime;
    } else {
        if (convertedTime > latestBarTime) {
            latestBarTime = convertedTime;
        }
    }
};

function getLatestBarTime() {
    return latestBarTime;
}

function clearLatestBarTime() {
    latestBarTime = null;
};

module.exports = { setNewLatestBarTime, getLatestBarTime, clearLatestBarTime }