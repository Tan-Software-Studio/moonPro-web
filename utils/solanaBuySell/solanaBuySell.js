import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import {
  getSoalanaTokenBalance,
  getSolanaBalanceAndPrice,
  getSolanaTokenDecimals,
} from "../solanaNativeBalance";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import axios from "axios";
import { setBigLoader } from "@/app/redux/states";
const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
// handler to buy solana tokens
const buySolanaTokens = async (
  toToken,
  amt,
  slipTolerance = 50,
  priorityFee = 0.0001,
  address,
  setLoaderSwap,
  setTokenBalance,
  setNativeTokenbalance
) => {
  // console.log("🚀 ~ setNativeTokenbalance:", setNativeTokenbalance);
  // console.log("🚀 ~ setTokenBalance:", setTokenBalance);
  // console.log("🚀 ~ priorityFee:", priorityFee);
  // console.log("🚀 ~ slipTolerance:", slipTolerance);
  // console.log("🚀 ~ setLoaderSwap:", setLoaderSwap);
  // console.log("🚀 ~ address:", address);
  // console.log("🚀 ~ amt:", amt);
  // console.log("🚀 ~ toToken:", toToken);
  // return;
  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("User not login!", {
      position: "top-right",
    });
  }
  if (amt <= 0) {
    return toast.error("Invalid amount !", {
      position: "top-right",
    });
  }
  setLoaderSwap(true);
  toast(
    <div className="flex items-center gap-5">
      <div className="loaderPopup"></div>
      <div className="text-white text-sm">Attempting transaction</div>
    </div>,
    {
      id: "saveToast",
      position: "top-center",
      duration: Infinity,
      style: {
        border: "1px solid #4D4D4D",
        color: "#FFFFFF",
        fontSize: "14px",
        letterSpacing: "1px",
        backgroundColor: "#1F1F1F",
      },
    }
  );
  await axios({
    url: `${BASE_URL}transactions/solbuy`,
    method: "post",
    data: {
      token: toToken,
      amount: amt,
      slippage: slipTolerance,
      priorityFee: priorityFee,
      price: 150,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      await toast.success("Transaction successfully", {
        id: "saveToast",
        duration: 3000,
      });
      setLoaderSwap(false);
      setTimeout(async () => {
        const [tokenBalanceUpdate, solBalance] = await Promise.all([
          getSoalanaTokenBalance(address, toToken),
          getSolanaBalanceAndPrice(address),
        ]);
        setTokenBalance(tokenBalanceUpdate);
        setNativeTokenbalance(solBalance);
      }, 5000);
    })
    .catch(async (err) => {
      setLoaderSwap(false);
      console.log("🚀 ~ err:", err?.message);
      await toast.error("Somthing went wrong please try again later.", {
        id: "saveToast",
        duration: 3000,
      });
    });
  return;
};
// quick buy handler
const buySolanaTokensQuickBuyHandler = async (
  toToken,
  amt,
  address,
  nativeTokenbalance,
  setNativeTokenbalance,
  e
) => {
  e && e.stopPropagation();
  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("Please login!", {
      position: "top-right",
    });
  }
  if (amt <= 0) {
    return toast.error("Invalid amount !", {
      position: "top-right",
    });
  }
  if (nativeTokenbalance < amt) {
    return toast.error("insufficient funds !", {
      position: "top-right",
    });
  }
  toast(
    <div className="flex items-center gap-5">
      <div className="loaderPopup"></div>
      <div className="text-white text-sm">Attempting transaction</div>
    </div>,
    {
      id: "saveToast",
      position: "top-center",
      duration: Infinity,
      style: {
        border: "1px solid #4D4D4D",
        color: "#FFFFFF",
        fontSize: "14px",
        letterSpacing: "1px",
        backgroundColor: "#1F1F1F",
      },
    }
  );
  await axios({
    url: `${BASE_URL}transactions/solbuy`,
    method: "post",
    data: {
      token: toToken,
      amount: amt,
      slippage: 50,
      priorityFee: 0.0001,
      price: 150,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      await toast.success("Transaction successfully", {
        id: "saveToast",
        duration: 3000,
      });
      setTimeout(() => {
        const solBalance = getSolanaBalanceAndPrice(address);
        setNativeTokenbalance(solBalance);
      }, 2000);
    })
    .catch(async (err) => {
      await toast.error("Somthing went wrong please try again later.", {
        id: "saveToast",
        duration: 3000,
      });
      console.log("🚀 ~ err:", err?.message);
    });
  return;
};
// quick buy handler
const buySolanaTokensQuickBuyHandlerCopyTrading = async (
  toToken,
  address,
  nativeTokenbalance,
  setNativeTokenbalance,
  e,
  dispatch
) => {
  e && e.stopPropagation();
  const amt = await localStorage.getItem("copyBuySol");
  if (amt <= 0 || !amt) {
    return toast.error("Invalid amount !", {
      position: "top-right",
    });
  }
  if (nativeTokenbalance < amt) {
    return toast.error("insufficient funds !", {
      position: "top-right",
    });
  }
  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("Please login!", {
      position: "top-right",
    });
  }
  if (amt <= 0) {
    return toast.error("Invalid amount !", {
      position: "top-right",
    });
  }
  toast(
    <div className="flex items-center gap-5">
      <div className="loaderPopup"></div>
      <div className="text-white text-sm">Attempting transaction</div>
    </div>,
    {
      id: "saveToast",
      position: "top-center",
      duration: Infinity,
      style: {
        border: "1px solid #4D4D4D",
        color: "#FFFFFF",
        fontSize: "14px",
        letterSpacing: "1px",
        backgroundColor: "#1F1F1F",
      },
    }
  );
  await axios({
    url: `${BASE_URL}transactions/solbuy`,
    method: "post",
    data: {
      token: toToken,
      amount: amt,
      slippage: 50,
      priorityFee: 0.0001,
      price: 150,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      await toast.success("Transaction successfully", {
        id: "saveToast",
        duration: 3000,
      });
      setTimeout(() => {
        const solBalance = getSolanaBalanceAndPrice(address);
        setNativeTokenbalance(solBalance);
      }, 2000);
    })
    .catch(async (err) => {
      await toast.error("Somthing went wrong please try again later.", {
        id: "saveToast",
        duration: 3000,
      });
      console.log("🚀 ~ err:", err?.message);
    });
  return;
};
// handler to sell solana tokens
const sellSolanaTokens = async (
  fromToken,
  amt,
  slipTolerance = 50,
  priorityFee = 0.0001,
  address,
  decimal,
  price,
  setLoaderSwap,
  setTokenBalance,
  setNativeTokenbalance
) => {
  // console.log("🚀 ~ setNativeTokenbalance:", setNativeTokenbalance);
  // console.log("🚀 ~ setTokenBalance:", setTokenBalance);
  // console.log("🚀 ~ setLoaderSwap:", setLoaderSwap);
  // console.log("🚀 ~ price:", price);
  // console.log("🚀 ~ decimal:", decimal);
  // console.log("🚀 ~ address:", address);
  // console.log("🚀 ~ priorityFee:", priorityFee);
  // console.log("🚀 ~ slipTolerance:", slipTolerance);
  // console.log("🚀 ~ amt:", amt);
  // console.log("🚀 ~ fromToken:", fromToken);
  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("User not login!", {
      position: "top-right",
    });
  }
  setLoaderSwap(true)
  toast(
    <div className="flex items-center gap-5">
      <div className="loaderPopup"></div>
      <div className="text-white text-sm">Attempting transaction</div>
    </div>,
    {
      id: "saveToast",
      position: "top-center",
      duration: Infinity,
      style: {
        border: "1px solid #4D4D4D",
        color: "#FFFFFF",
        fontSize: "14px",
        letterSpacing: "1px",
        backgroundColor: "#1F1F1F",
      },
    }
  );
  await axios({
    url: `${BASE_URL}transactions/solsell`,
    method: "post",
    data: {
      token: fromToken,
      amount: amt,
      slippage: slipTolerance,
      priorityFee: priorityFee,
      decimal,
      price,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async () => {
      setLoaderSwap(false)
      await toast.success("Transaction successfully", {
        id: "saveToast",
        duration: 3000,
      });
      setTimeout(async () => {
        const [tokenBalanceUpdate, solBalance] = await Promise.all([
          getSoalanaTokenBalance(address, fromToken),
          getSolanaBalanceAndPrice(address),
        ]);
        setTokenBalance(tokenBalanceUpdate);
        setNativeTokenbalance(solBalance);
      }, 5000);
    })
    .catch(async (err) => {
      setLoaderSwap(false)
      await toast.error("Somthing went wrong please try again later.", {
        id: "saveToast",
        duration: 3000,
      });
      console.log("🚀 ~ err:", err?.message);
    });
  return;
};
// quick sell handler solana
const sellSolanaTokensQuickSellHandler = async (
  fromToken,
  address,
  isConnected,
  walletProvider,
  e,
  dispatch
) => {
  try {
    e && e.stopPropagation();
    return toast.error("Service unavailable!", {
      position: "top-right",
    });
    if (!isConnected) {
      return toast.error("Wallet is not connected !", {
        position: "top-right",
      });
    }
    // Convert the message to a Uint8Array
    const connection = await new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      "confirmed"
    );
    const tokenBalance = await getSoalanaTokenBalance(address, fromToken);
    if (tokenBalance <= 0) {
      return toast.error("You do not have this token in your holdings!", {
        position: "top-right",
      });
    }
    const provider = walletProvider;
    const decimal = await getSolanaTokenDecimals(fromToken, connection);
    const amountInLam = await ethers.parseUnits(
      tokenBalance.toString(),
      decimal
    );
    const response = await axios.get(`${GET_SOL_QUOTE}`, {
      params: {
        inputMint: fromToken,
        outputMint: "So11111111111111111111111111111111111111112",
        amount: amountInLam,
        slippageBps: 1000,
      },
    });

    const quoteResponse = await response.data;
    const response2 = await axios.post(
      `${GET_SOL_SWAP}`,
      {
        quoteResponse: quoteResponse,
        userPublicKey: new PublicKey(address),
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: 1500000,
            global: false,
            priorityLevel: "veryHigh",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const swapResponse = await response2.data;

    const swapTransactionBuf = Buffer.from(
      swapResponse.swapTransaction,
      "base64"
    );

    let transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Sign the transaction using the wallet
    transaction = await provider.signTransaction(transaction);
    dispatch(setBigLoader(true));
    // Hide loader before the wallet approval

    // get the latest block hash
    // Execute the transaction
    const rawTransaction = await transaction.serialize();

    // Show loader again during transaction submission

    const signature = await connection.sendRawTransaction(rawTransaction, {
      maxRetries: 2,
      skipPreflight: true,
    });
    const confirmation = await connection.confirmTransaction(
      { signature },
      "finalized"
    );

    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${JSON.stringify(
          confirmation.value.err
        )}\nhttps://solscan.io/tx/${signature}/`
      );
    } else {
      // console.log(
      //   `Transaction successful: https://solscan.io/tx/${signature}/`
      // );
      toast.success("Transaction Successfull!", {
        position: "top-right",
      });
    }
    dispatch(setBigLoader(false));
    return;
  } catch (error) {
    console.error("Signing failed:", error?.message);
    dispatch(setBigLoader(false));
    return toast.error("Transaction failed OR Token not tradable.", {
      position: "top-right",
    });
  }
};

const getDateMinus24Hours = async (hours) => {
  const date = new Date();
  await date.setHours(date.getHours() - hours); // Subtract 24 hours
  return date.toISOString();
};

export {
  buySolanaTokens,
  sellSolanaTokens,
  getDateMinus24Hours,
  buySolanaTokensQuickBuyHandler,
  sellSolanaTokensQuickSellHandler,
  buySolanaTokensQuickBuyHandlerCopyTrading,
};
