let sell100SellLine = null;
let subscribers = new Set();

function notifySubscribers(value) {
    subscribers.forEach(callback => callback(value));
}

function set100SellLine(value) {
    console.log("setting Sell line", value);
    sell100SellLine = value;
    notifySubscribers(sell100SellLine);
}

function get100SellLine() {
    console.log("getting Sell line", sell100SellLine);
    return sell100SellLine;
} 

function clear100SellLine() {
    sell100SellLine = null;
    notifySubscribers(sell100SellLine);
}

function subscribe100SellLine(callback) {
    subscribers.add(callback);
    callback(sell100SellLine); // Call immediately with current value

    return () => subscribers.delete(callback); // Unsubscribe function
}

module.exports = {
    set100SellLine,
    get100SellLine,
    clear100SellLine,
    subscribe100SellLine,
};
