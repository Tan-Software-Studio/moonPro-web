let historicalChunk = null;
let currentResolution = null;

function setHistoricalChunkAndConnectBars(newChunk, newResolution) {
    if (!newChunk || newChunk.length === 0) return;

    if (currentResolution !== newResolution) {
        historicalChunk = null;
        currentResolution = newResolution;
    }

    if (!historicalChunk) {
        historicalChunk = newChunk;
    } else {
        const firstBarInLatestChunk = historicalChunk[0];
        const lastIndex = newChunk.length - 1;

        newChunk[lastIndex] = {
            ...newChunk[lastIndex],
            close: firstBarInLatestChunk?.open
        };

        historicalChunk = newChunk;
    }
}

function clearChunk() {
    historicalChunk = null;
    currentResolution = null;
}

module.exports = { setHistoricalChunkAndConnectBars, clearChunk }