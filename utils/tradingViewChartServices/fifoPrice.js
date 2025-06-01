import { getStoredUserMarks } from "./mark"; 

let buyPositiionLine = null;
let exitPositionLine = null;

function calculateFIFOWithLines(trades) {
  let inventory = [];
  let realizedGain = 0;
  let realizedAmount = 0;
  let totalRevenue = 0;

  for (const trade of trades) {
    if (trade.isBuy) {
      inventory.push({ price: trade.price, amount: trade.amount });
    } else {
      let remainingToSell = trade.amount;
      let revenue = trade.price * trade.amount;
      totalRevenue += revenue;

      while (remainingToSell > 0 && inventory.length > 0) {
        let lot = inventory[0];
        let sellAmount = Math.min(lot.amount, remainingToSell);
        let gain = (trade.price - lot.price) * sellAmount;

        realizedGain += gain;
        realizedAmount += sellAmount;

        lot.amount -= sellAmount;
        remainingToSell -= sellAmount;

        if (lot.amount === 0) {
          inventory.shift();
        }
      }
    }
  }

  // ✅ Average Exit Price (realized revenue per unit sold)
  const averageExitPrice = realizedAmount > 0 ? totalRevenue / realizedAmount : 0;

  // ✅ Average Cost Basis (average cost of current remaining inventory)
  const totalInventoryValue = inventory.reduce((sum, lot) => sum + lot.price * lot.amount, 0);
  const totalInventoryAmount = inventory.reduce((sum, lot) => sum + lot.amount, 0);
  const averageCostBasis = totalInventoryAmount > 0 ? totalInventoryValue / totalInventoryAmount : 0;

  return {
    realizedGain: realizedGain.toFixed(4),
    averageExitPrice: averageExitPrice.toFixed(4),
    averageCostBasis: averageCostBasis.toFixed(4),
  };
}

async function setPriceLines(chart) {
  return;
    const userMarks = getStoredUserMarks();
    // console.log('userMarks', userMarks);
    if (userMarks?.length > 0) {
        const fifoPrices = calculateFIFOWithLines(userMarks);
        if (!buyPositiionLine && window.chartReady === true) {
            buyPositiionLine = await chart.chart().createPositionLine();
        } 
        
        if (!exitPositionLine && window.chartReady === true) {
            exitPositionLine = await chart.chart().createPositionLine();
        }
        if (buyPositiionLine) {
            buyPositiionLine
                .setText("Current Average Cost Basis")
                .setQuantity("")
                .setPrice(Number(fifoPrices.averageCostBasis))
                .setQuantityBackgroundColor("#427A2C")
                .setQuantityBorderColor("#427A2C")
                .setBodyBorderColor("#FFFFFF00")
                .setBodyTextColor("#427A2C")
                .setBodyBackgroundColor("#FFFFFF00")
                .setExtendLeft(true)
                .setLineStyle(2)
                .setLineLength(0)
                .setLineColor("#427A2C");
        }
        if (exitPositionLine) {
            exitPositionLine
                .setText("Current Average Exit Price")
                .setQuantity("")
                .setPrice(fifoPrices.averageExitPrice)
                .setQuantityBackgroundColor("#AB5039")
                .setQuantityBorderColor("#AB5039")
                .setBodyBorderColor("#FFFFFF00")
                .setBodyTextColor("#AB5039")
                .setBodyBackgroundColor("#FFFFFF00")
                .setExtendLeft(true)
                .setLineStyle(2)
                .setLineLength(0)
                .setLineColor("#AB5039");
        }
    }
}

module.exports = { setPriceLines };
