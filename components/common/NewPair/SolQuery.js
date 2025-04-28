const { default: axios } = require("axios");

const SolQuery = async (mintAddress, time) => {
  const query = `query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Currency: {MintAddress: { is: "${mintAddress}"}}}, Block: {Time: { since: "${time}" }}}
    ) {
      buyers: count(distinct: Transaction_Signer if:{Trade: {Side: {Type: {is: buy}}}})
      sellers: count(distinct:Transaction_Signer if:{Trade: {Side: {Type: {is: sell}}}})
      traded_volume: sum(of: Trade_Side_AmountInUSD)
      buy_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: buy}}}}
      )
      sell_volume: sum(
        of: Trade_Side_AmountInUSD
        if: {Trade: {Side: {Type: {is: sell}}}}
      )
    }
  }
}`;
  try {
    const response = await axios.post(
      "https://streaming.bitquery.io/eap",
      {
        query,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`
        },
      }
    );

    return response?.data?.data?.Solana?.DEXTradeByTokens;
  } catch (err) {
    throw err;
  }
};

export default SolQuery;
