

let bookTickerSocket;
let tradesSocket;
let markPrice;
let chartSocket;

const aster_dex_url = `wss://fstream.asterdex.com/ws/`;

// orderbook socket
export function connectBookTicker(symbol, setOrders) {

    bookTickerSocket = new WebSocket(`${aster_dex_url}${symbol}@bookTicker`);

    bookTickerSocket.onopen = () => console.log(`✅ Depth WS connected to: ${symbol}`);
    bookTickerSocket.onerror = (error) => console.error("❌ Depth WS error:", error);
    bookTickerSocket.onclose = (event) => console.warn("⚠️ Depth WS closed:", event);



    bookTickerSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data) {
            setOrders(data)
        }
    };

}
// trades socket
export function connectTrades(selectedToken, setTrades) {
    const symbol = selectedToken?.toLowerCase();
    tradesSocket = new WebSocket(`${aster_dex_url}${symbol}@aggTrade`);

    tradesSocket.onopen = () => console.log(`✅ Trades WS connected to: ${symbol}`);
    tradesSocket.onerror = (error) => console.error("❌ Trades WS error:", error);
    tradesSocket.onclose = (event) => console.warn("⚠️ Trades WS closed:", event);

    tradesSocket.onmessage = (event) => {
        const newTrade = JSON.parse(event.data);
        setTrades(prev => [newTrade, ...prev.slice(0, 49)]);
    };
}
// live index and market price
export function connetMarkPrice(selectedToken, setSelectedToken) {
    const symbol = selectedToken.toLowerCase();
    markPrice = new WebSocket(`wss://fstream.asterdex.com/ws/${symbol}@markPrice`);

    markPrice.onopen = () => console.log(`markPrice WS connected to: ${symbol}`);
    markPrice.onerror = (error) => console.error("❌ Mark WS error:", error);
    markPrice.onclose = (event) => console.warn("⚠️ Mark WS closed:", event);

    markPrice.onmessage = (event) => {
        const currentTradeData = JSON.parse(event.data);
        setSelectedToken(prev => ({
            ...prev,
            markPrice: currentTradeData?.p,
            indexPrice: currentTradeData?.i,
            lastFundingRate: currentTradeData?.r,
        }));
    };
}
// Chart socket 
export function disconnectBookTicker() {
    if (bookTickerSocket) bookTickerSocket.close()
    bookTickerSocket = null;
}
export function disconnectTrades() {
    if (tradesSocket) tradesSocket.close()
    tradesSocket = null;
}

export function disconnectMarkPrice() {
    if (markPrice) markPrice.close()
    markPrice = null;
}
