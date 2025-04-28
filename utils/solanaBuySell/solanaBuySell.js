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
import { addSolanaTransaction } from "../transaction/transaction";
const GET_SOL_QUOTE = process.env.NEXT_PUBLIC_SOLANA_QUOTE_URL;
const GET_SOL_SWAP = process.env.NEXT_PUBLIC_SOLANA_SWAP_URL;
// handler to buy solana tokens
const buySolanaTokens = async (
  toToken,
  amt,
  slipTolerance = 2000,
  priorityFee = 0.0015,
  address,
  isConnected,
  setLoaderSwap,
  walletProvider,
  setTokenBalance
) => {
  // console.log("🚀 ~ toToken:", toToken)
  // console.log("🚀 ~ amt:", amt)
  // console.log("🚀 ~ slipTolerance:", slipTolerance)
  // console.log("🚀 ~ priorityFee:", priorityFee)
  // console.log("🚀 ~ address:", address)
  // console.log("🚀 ~ isConnected:", isConnected)
  // console.log("🚀 ~ setLoaderSwap:", setLoaderSwap)
  // console.log("🚀 ~ walletProvider:", walletProvider)
  // console.log("🚀 ~ setTokenBalance:", setTokenBalance)
  try {
    if (!isConnected) {
      return toast.error("Wallet is not connected !", {
        position: "top-right",
      });
    }
    if (amt <= 0) {
      return toast.error("Invalid amount !", {
        position: "top-right",
      });
    }
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      "confirmed"
    );
    const balanceOfNative = await getSolanaBalanceAndPrice(address, connection);
    if (balanceOfNative <= amt || balanceOfNative <= 0) {
      return toast.error("Insuficient balance + gas !", {
        position: "top-right",
      });
    }
    setLoaderSwap(true);
    const provider = walletProvider;
    const amountInLam = await ethers.parseUnits(amt.toString(), 9);
    const response = await axios.get(`${GET_SOL_QUOTE}`, {
      params: {
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: toToken,
        amount: amountInLam,
        slippageBps: slipTolerance,
      },
    });
    const quoteResponse = await response?.data;
    const priorityFeeInLamports = priorityFee * 1000000000;
    const response2 = await axios.post(
      `${GET_SOL_SWAP}`,
      {
        quoteResponse: quoteResponse,
        userPublicKey: new PublicKey(address),
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: priorityFeeInLamports,
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

    let transaction =await VersionedTransaction.deserialize(swapTransactionBuf);
    // Sign the transaction using the wallet
    transaction = await provider.signTransaction(transaction);

    // Execute the transaction
    const rawTransaction = transaction.serialize();
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
      setLoaderSwap(false);
      toast.success("Transaction Successfull!", {
        position: "top-right",
      });
      const tokenBalanceUpdate = await getSoalanaTokenBalance(address, toToken);
      setTokenBalance(tokenBalanceUpdate);
      // await addSolanaTransaction(
      //   address,
      //   toToken,
      //   "So11111111111111111111111111111111111111112",
      //   amt,
      //   5,
      //   "meet desai",
      //   "buy"
      // );
    }
    return;
  } catch (error) {
    console.error("Signing failed:", error?.message);
    setLoaderSwap(false);
    return toast.error("Transaction failed OR Token not tradable !", {
      position: "top-right",
    });
  }
};

// quick buy handler
const buySolanaTokensQuickBuyHandler = async (
  toToken,
  walletProvider,
  address,
  isConnected,
  amt,
  e,
  dispatch
) => {
  try {
    e && e.stopPropagation();

    if (!isConnected) {
      return toast.error("Wallet is not connected !", {
        position: "top-right",
      });
    }
    if (amt <= 0 || !amt) {
      return toast.error("Invalid amount !", {
        position: "top-right",
      });
    }
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      "confirmed"
    );
    const balanceOfNative = await getSolanaBalanceAndPrice(address, connection);
    if (balanceOfNative <= amt || balanceOfNative <= 0) {
      return toast.error("Insuficient balance + gas !", {
        position: "top-right",
      });
    }
    const provider = walletProvider;
    const amountInLam = await ethers.parseUnits(amt.toString(), 9);
    const response = await axios.get(`${GET_SOL_QUOTE}`, {
      params: {
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: toToken,
        amount: amountInLam,
        slippageBps: 1000,
      },
    });
    const quoteResponse = await response?.data;

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

    let transaction = await VersionedTransaction.deserialize(
      swapTransactionBuf
    );

    // Sign the transaction using the wallet
    transaction = await provider.signTransaction(transaction);
    dispatch(setBigLoader(true));

    // Hide loader before the wallet approval

    // Execute the transaction
    const rawTransaction = transaction.serialize();

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
    return toast.error("Transaction failed OR Token not tradable !", {
      position: "top-right",
    });
  }
};
// quick buy handler
const buySolanaTokensQuickBuyHandlerCopyTrading = async (
  toToken,
  walletProvider,
  address,
  isConnected,
  e,
  dispatch
) => {
  try {
    e && e.stopPropagation();

    if (!isConnected) {
      return toast.error("Wallet is not connected !", {
        position: "top-right",
      });
    }
    const amt = await localStorage.getItem("copyBuySol");
    if (amt <= 0 || !amt) {
      return toast.error("Invalid amount !", {
        position: "top-right",
      });
    }
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      "confirmed"
    );
    const balanceOfNative = await getSolanaBalanceAndPrice(address, connection);
    if (balanceOfNative <= amt || balanceOfNative <= 0) {
      return toast.error("Insuficient balance + gas !", {
        position: "top-right",
      });
    }
    const provider = walletProvider;
    const amountInLam = await ethers.parseUnits(amt.toString(), 9);
    const response = await axios.get(`${GET_SOL_QUOTE}`, {
      params: {
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: toToken,
        amount: amountInLam,
        slippageBps: 1000,
      },
    });
    const quoteResponse = await response?.data;

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

    let transaction = await VersionedTransaction.deserialize(
      swapTransactionBuf
    );

    // Sign the transaction using the wallet
    transaction = await provider.signTransaction(transaction);
    dispatch(setBigLoader(true));

    // Hide loader before the wallet approval

    // Execute the transaction
    const rawTransaction = transaction.serialize();

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
    return toast.error("Transaction failed OR Token not tradable !", {
      position: "top-right",
    });
  }
};
// handler to sell solana tokens
const sellSolanaTokens = async (
  fromToken,
  amt,
  slipTolerance = 2000,
  priorityFee = 0.0015,
  address,
  isConnected,
  setLoaderSwap,
  walletProvider,
  setTokenBalance,
  tokenBalance
) => {
  // console.log("🚀 ~ fromToken:", fromToken);
  // console.log("🚀 ~ amt:", amt);
  // console.log("🚀 ~ slipTolerance:", slipTolerance);
  // console.log("🚀 ~ priorityFee:", priorityFee);
  // console.log("🚀 ~ address:", address);
  // console.log("🚀 ~ isConnected:", isConnected);
  // console.log("🚀 ~ setLoaderSwap:", setLoaderSwap);
  // console.log("🚀 ~ walletProvider:", walletProvider);
  // console.log("🚀 ~ setTokenBalance:", setTokenBalance);
  // console.log("🚀 ~ tokenBalance:", tokenBalance);
  try {
    if (!isConnected) {
      return toast.error("Wallet is not connected !", {
        position: "top-right",
      });
    }
    if (tokenBalance < amt || tokenBalance <= 0) {
      return toast.error("Insuficient balance + gas !", {
        position: "top-right",
      });
    }
    if (amt <= 0) {
      return toast.error("Invalid amount !", {
        position: "top-right",
      });
    }

    // Convert the message to a Uint8Array
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      "confirmed"
    );

    setLoaderSwap(true);
    const provider = walletProvider;
    const decimal = await getSolanaTokenDecimals(fromToken, connection);
    const amountInLam = await ethers.parseUnits(amt.toString(), decimal);
    const response = await axios.get(`${GET_SOL_QUOTE}`, {
      params: {
        inputMint: fromToken,
        outputMint: "So11111111111111111111111111111111111111112",
        amount: amountInLam,
        slippageBps: slipTolerance,
      },
    });

    const quoteResponse = await response.data;
    const priorityFeeInLamports = priorityFee * 1000000000;
    const response2 = await axios.post(
      `${GET_SOL_SWAP}`,
      {
        quoteResponse: quoteResponse,
        userPublicKey: new PublicKey(address),
        prioritizationFeeLamports: {
          priorityLevelWithMaxLamports: {
            maxLamports: priorityFeeInLamports,
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

    // get the latest block hash
    // Execute the transaction
    const rawTransaction = await transaction.serialize();
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
      const tokenBalanceUpdate = await getSoalanaTokenBalance(
        address,
        fromToken
      );
      setTokenBalance(tokenBalanceUpdate || 0);
    }
    setLoaderSwap(false);
    return;
  } catch (error) {
    console.error("Signing failed:", error?.message);
    setLoaderSwap(false);
    return toast.error("Transaction failed OR Token not tradable.", {
      position: "top-right",
    });
  }
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
