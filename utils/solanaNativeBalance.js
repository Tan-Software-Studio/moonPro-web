const {
  getAccount,
  getMint,
  getOrCreateAssociatedTokenAccount,
} = require("@solana/spl-token");

const { PublicKey, Connection } = require("@solana/web3.js");

async function getSolanaBalanceAndPrice(wallet) {
  try {
    const connection = new Connection(
      `${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}`,
      "confirmed"
    );
    const userPublicKey = new PublicKey(wallet);
    const bal = await connection.getBalance(userPublicKey);
    return (await (bal / 1000000000)) || 0;
  } catch (error) {
    console.log("🚀 ~ getSolanaBalanceAndPrice ~ error:", error?.message);
    return 0;
  }
}

const getSoalanaTokenBalance = async (walletAddress, tokenMintAddress) => {
  // Create a connection to the Solana cluster
  try {
    const connection = new Connection(
      `${process.env.NEXT_PUBLIC_SOLANA_RPC_URL}`,
      "confirmed"
    );
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletPublicKey,
      tokenMintPublicKey,
      walletPublicKey
    );

    const accountInfo = await getAccount(connection, tokenAccount.address);
    const mintInfo = await getMint(connection, tokenMintPublicKey);
    const balance = Number(accountInfo.amount) / 10 ** mintInfo.decimals;
    return balance;
  } catch (error) {
    console.log("🚀 ~ getSoalanaTokenBalance ~ error:", error?.message);
    return 0;
  }
};

async function getSolanaTokenDecimals(token, connection) {
  try {
    const tokenAddress = new PublicKey(token);
    // Fetch mint info of the token
    const mintInfo = await getMint(connection, tokenAddress);

    // Get the decimals
    return mintInfo.decimals;
  } catch (error) {
    console.log("🚀 ~ getSolanaTokenDecimals ~ error:", error?.message);
  }
}

export {
  getSolanaBalanceAndPrice,
  getSoalanaTokenBalance,
  getSolanaTokenDecimals,
};
