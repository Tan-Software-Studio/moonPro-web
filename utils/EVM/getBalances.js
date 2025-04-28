import { ethers } from "ethers";

const tokenAbi = [
  // balanceOf
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    type: "function",
  },
];
async function getTokenBalance(tokenContractAddress, walletAddress, chain) {
  try {
    const rpc =
      (await chain) == "Base"
        ? process.env.NEXT_PUBLIC_BASE_RPC_URL
        : process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;
    const provider = await new ethers.JsonRpcProvider(rpc);
    const tokenContract = await new ethers.Contract(
      tokenContractAddress,
      tokenAbi,
      provider
    );
    const balance = await tokenContract
      .balanceOf(walletAddress)
      .catch((err) => {
        return 0;
      });
    // Fetch the token decimals
    const decimals = await tokenContract.decimals();
    let bal = (await ethers.formatUnits(balance, decimals)) || 0;
    return {
      tokenBalance: bal || 0,
      decimals: decimals.toString(),
    };
  } catch (error) {
    console.log("🚀 ~ getTokenBalance ~ error:", error?.message);
    return 0;
  }
}

async function getNativeTokenBalanceEvm(walletAddress, provider) {
  try {
    const balanceWei = await provider.getBalance(walletAddress);
    const balance = await ethers.formatEther(balanceWei);

    return balance ? balance : 0;
  } catch (error) {
    console.error("Error fetching balance:", error?.message);
    return 0;
  }
}

export { getTokenBalance, getNativeTokenBalanceEvm };
