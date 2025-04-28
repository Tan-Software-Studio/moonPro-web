const { default: axios } = require("axios");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;
async function addSolanaTransaction(
  walletAddress,
  toAddress,
  fromAddress,
  amount,
  value,
  tx,
  type
) {
  const userId = await localStorage.getItem("userId");
  await axios({
    url: `${BASE_URL}wavePro/transaction/addTransaction`,
    method: "post",
    data: {
      user: userId,
      walletAddress,
      chain: "solana",
      toAddress,
      fromAddress,
      amount,
      value,
      tx,
      type,
    },
  })
    .then((res) => {})
    .catch((err) => {
      console.log("🚀 ~ err:", err?.message);
    });
}

module.exports = { addSolanaTransaction };
