let sellItems = [];
let callbacks = [];

function addSellItems(sellItem) {
    sellItems.push(sellItem);
    const averageSellPrice = sellItems.length > 0
        ? sellItems.reduce((sum, item) => sum + (item || 0), 0) / sellItems.length
        : 0;    
    callbacks.forEach((callback) => callback(averageSellPrice));
}

function subscribeSellItems(callback) {
    callbacks.push(callback);
    return () => {
        callbacks = callbacks.filter((cb) => cb !== callback);
    };
}

function clearSellItems() {
    sellItems = [];
    callbacks.array.forEach(callback => callback(sellItems));
}

module.exports = { addSellItems, subscribeSellItems, clearSellItems }