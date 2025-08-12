import { setPerpsTokenList, setSelectedToken } from "@/app/redux/perpetauls/perpetual.slice";


let tradesSocket;
let orderBookSocket = null;
let marketPriceSocket = null;
let marketPriceSocketAllTokens = null;

const WS_URL = 'wss://api.hyperliquid.xyz/ws';

export function tradesSocketConnect(coin, setTradesData) {
    tradesSocket = new WebSocket(WS_URL);

    tradesSocket.onopen = () => {
        const subMsg = {
            method: "subscribe",
            subscription: {
                type: "trades",
                coin,
            },
        };
        tradesSocket.send(JSON.stringify(subMsg));
        // console.log("✅ tradesSocket connected");
    };

    tradesSocket.onmessage = (event) => {
        const trades = JSON.parse(event.data);
        const newTrades = trades?.data;

        setTradesData(prev => {
            const flatNewTrades = Array.isArray(newTrades) ? newTrades : [newTrades];
            const updated = [...flatNewTrades, ...prev];
            return updated.slice(0, 50);
        });
    };

    tradesSocket.onerror = (err) => {
        console.error("tradesSocket error", err);
    };

    tradesSocket.onclose = () => {
        // console.log("📴 tradesSocket connection closed.");
    };
}


export function orderBookSocketConnect(coin, setBidsData, setAsksData) {
    if (orderBookSocket && orderBookSocket.readyState !== WebSocket.CLOSED) {
        orderBookSocket.close();
    }
    orderBookSocket = new WebSocket(WS_URL);

    orderBookSocket.onopen = () => {
        const subMsg = {
            method: "subscribe",
            subscription: {
                type: "l2Book",
                coin,
            },
        };
        orderBookSocket.send(JSON.stringify(subMsg));
        // console.log("✅ orderBookSocket connected", coin);
    };
    orderBookSocket.onmessage = (event) => {
        const orderBook = JSON.parse(event.data);
        const newOrders = orderBook?.data?.levels;
        if (newOrders?.length === 2) {
            setAsksData(newOrders[0]);
            setBidsData(newOrders[1]);
        }
    };

    orderBookSocket.onerror = (err) => {
        console.error("orderBookSocket error", err);
    };

    orderBookSocket.onclose = () => {
        // console.log("📴 orderBookSocket connection closed.");
    };
}

export function marketPriceSocketConnect(coin, dispatch) {
    marketPriceSocket = new WebSocket(WS_URL);

    marketPriceSocket.onopen = () => {
        const subMsg = {
            method: "subscribe",
            subscription: {
                type: "activeAssetCtx",
                coin,
            },
        };
        marketPriceSocket.send(JSON.stringify(subMsg));
        // console.log("✅ marketPriceSocket connected", coin);
    };
    marketPriceSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const marketPrice = data?.data?.ctx;
        dispatch(setSelectedToken(marketPrice));
    };

    marketPriceSocket.onerror = (err) => {
        console.error("marketPriceSocket error", err);
    };

    marketPriceSocket.onclose = () => {
        // console.log("📴 marketPriceSocket connection close
        // d.");
    };
}

// export function marketPriceSocketConnectAllTokens(tokenList, dispatch) {
//     marketPriceSocketAllTokens = new WebSocket(WS_URL);

//     marketPriceSocketAllTokens.onopen = () => {
//         console.log("✅ marketPriceSocketAllTokens connected to ALL tokens");
//         tokenList.forEach(token => {
//             const subMsg = {
//                 method: "subscribe",
//                 subscription: {
//                     type: "activeAssetCtx",
//                     coin: token.name,
//                 },
//             };
//             marketPriceSocketAllTokens.send(JSON.stringify(subMsg));
//         });
//     };

//     marketPriceSocketAllTokens.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         const marketPrice = data?.data?.ctx;
//         const coin = data?.data?.coin; // <-- confirm this field exists in your actual response

//         if (!coin || !marketPrice) return;
//         dispatch(setPerpsTokenList({ coin, marketPrice }))
//         // setAllTokenList(prevList =>
//         //     prevList.map(token => {
//         //         if (token.name === coin) {
//         //             const updated = {
//         //                 ...token,
//         //                 ...marketPrice,
//         //                 priceChangePercent:
//         //                     ((marketPrice?.markPx - marketPrice?.prevDayPx) /
//         //                         marketPrice?.prevDayPx) *
//         //                     100,
//         //                 priceChangeAbs:
//         //                     marketPrice?.markPx - marketPrice?.prevDayPx,
//         //             };
//         //             return updated;
//         //         }
//         //         return token;
//         //     })
//         // );
//     };

//     marketPriceSocketAllTokens.onerror = err => {
//         console.error("❌ marketPriceSocketAllTokens error", err);
//     };

//     marketPriceSocketAllTokens.onclose = () => {
//         console.log("📴 marketPriceSocketAllTokens connection closed.");
//     };
// }

export function disconnectAllTokens() {
    if (marketPriceSocketAllTokens) {
        marketPriceSocketAllTokens.close();
        marketPriceSocketAllTokens = null;
    }
}


export function disconnectOrderBookSocket() {
    if (orderBookSocket) orderBookSocket.close()
    orderBookSocket = null;
}
export function disconnectTradesSocket() {
    if (tradesSocket) tradesSocket.close()
    tradesSocket = null;
}
export function disconnectMarketPriceSocket() {
    if (marketPriceSocket) marketPriceSocket.close()
    marketPriceSocket = null;
}