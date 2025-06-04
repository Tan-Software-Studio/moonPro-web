function pnlPercentage(currentPrice, buyPrice) {
    return (((currentPrice - buyPrice) / buyPrice) * 100).toFixed(2)
}

function realizedPnl(buyPrice, sellPrice, qty) {

    // ((item.qty * item.buyPrice) - (item.qty * item.sellPrice)).toFixed(5)
    ((qty * buyPrice) - (qty * sellPrice))
}

export {
    pnlPercentage,
    realizedPnl
}