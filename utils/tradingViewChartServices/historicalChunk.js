let historicalChunk = null;

function setHistoricalChunkAndConnectBars(newChunk) {
    if (!newChunk || newChunk.length === 0) return;

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

module.exports = { setHistoricalChunkAndConnectBars }