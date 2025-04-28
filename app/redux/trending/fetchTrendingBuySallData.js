const { default: axios } = require("axios");

const fetchTrendingBuySallData = async (network, min5Timestamp) => {
// console.log("🚀 ~ fetchTrendingBuySallData ~ min5Timestamp:", min5Timestamp)
// console.log("🚀 ~ fetchTrendingBuySallData ~ network:", network)

  const query = `
   query TrendingPairs($network: evm_network, $hr6_timestamp: DateTime) {
  EVM(network: $network) {
    DEXTradeByTokens(
      where: {TransactionStatus: {Success: true} , Block: {Time: {since: $hr6_timestamp}}}
      limit: {count: 50}
      limitBy: {by: Trade_Dex_Pair_SmartContract, count: 1}
    ) {
      Trade {
        Dex {
        ProtocolName
          ProtocolFamily
          SmartContract
          Pair {
            SmartContract
          }
        }
        Currency {
          Name
          SmartContract
          Symbol
        }
        startPrice: PriceInUSD(minimum: Block_Time)
        current_price: PriceInUSD(maximum: Block_Time)
        Side {
          Currency {
            Symbol
            Name
            SmartContract
          }
        }
      }
      makers: count(distinct: Transaction_From)
     buyers: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
     sellers: count(
        distinct: Transaction_From
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      trades: count
      traded_volume: sum(of: Trade_Side_AmountInUSD)
     buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
       sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      buys: count(if: {Trade: {Side: {Type: {is: sell}}}})
      sells: count(if: {Trade: {Side: {Type: {is: buy}}}})
      Block {
        Date(maximum: Block_Time)
        Time(maximum: Block_Time)
      }
    }
  }
}
  `;

  try {
    const response = await axios.post(
      "https://streaming.bitquery.io/graphql",
      {
        query,
        variables: {
          network,
          min5_timestamp: min5Timestamp,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`
        },
      }
    );

    return response.data.data.EVM.DEXTradeByTokens;
  } catch (err) {
    console.error("Error in fetchTrendingBuySallData:", err.response?.data || err.message);
    throw err;
  }
};

export default fetchTrendingBuySallData;
