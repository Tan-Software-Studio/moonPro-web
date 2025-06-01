let sellItems = [];
let callbacks = new Set();
let averageSellPrice = 0;


function addSellItems(sellItem) {
    sellItems.push(sellItem);
    averageSellPrice = sellItems.length > 0
    ? sellItems.reduce((sum, item) => sum + (item || 0), 0) / sellItems.length
    : 0;
    callbacks.forEach((callback) => callback(averageSellPrice));
}
function subscribeSellItems(callback) {
    if (!callbacks.has(callback)) {
        callbacks.add(callback);
    } else {
        // console.log('Callback already subscribed.');
    }

    callback(averageSellPrice);

    return () => {
        if (callbacks.delete(callback)) {
            // console.log('Unsubscribed callback.');
        }
    };
}

function clearSellItems() {
    sellItems = [];
    averageSellPrice = 0;
    callbacks.forEach((callback) => callback(averageSellPrice));
}

module.exports = {
    addSellItems,
    subscribeSellItems,
    clearSellItems,
};