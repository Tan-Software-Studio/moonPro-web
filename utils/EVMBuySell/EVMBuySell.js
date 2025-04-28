import toast from "react-hot-toast";
import { ethers } from "ethers";
import axios from "axios";
import { getNativeTokenBalanceEvm, getTokenBalance } from "../EVM/getBalances";
import ERC20ABI from "../../abi/approve-abi.json";

// handler to buy evm tokens
async function buyEvmTokens(
  buyToken,
  amt,
  slippage,
  providerE,
  isConnected,
  address,
  network,
  setLoaderSwap,
  setTokenBalance
) {
  try {
    if (!isConnected) {
      return toast.error("Wallet not connected.", {
        position: "top-center",
      });
    }
    if (!providerE) {
      return toast.error("Wallet not connected.", {
        position: "top-center",
      });
    }
    if (!amt || amt < 0) {
      return toast.error("Invalid amount.", {
        position: "top-center",
      });
    }
    // const providerE = await new ethers.BrowserProvider(provider);
    const totalBalanceEth = await getNativeTokenBalanceEvm(address, providerE);
    if (totalBalanceEth <= amt) {
      return toast.error("insufficient Find + Gas.", {
        position: "top-center",
      });
    }
    setLoaderSwap(true);
    // Convert the input amount to the correct unit
    const amount = ethers.parseUnits(amt.toString(), 18);
    // Initialize the provider and signer
    const signer = await providerE.getSigner();
    // Fetch the swap route from KyberSwap's API
    const swapRoute = await axios({
      url: `https://aggregator-api.kyberswap.com/${network}/api/v1/routes`,
      method: "get",
      params: {
        tokenIn: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        tokenOut: buyToken,
        amountIn: amount.toString(),
      },
    });
    const swapRouteData = await swapRoute?.data?.data?.routeSummary;
    // Encode the transaction data based on the route information
    const encodeResponse = await axios({
      url: `https://aggregator-api.kyberswap.com/${network}/api/v1/route/build`,
      method: "post",
      data: {
        routeSummary: swapRouteData,
        sender: address,
        recipient: address,
        slippageTolerance: slippage,
      },
    });

    const encodedSwapData = await encodeResponse?.data?.data?.data;
    const routerContract = await encodeResponse?.data?.data?.routerAddress;

    // Execute the swap transaction
    const executeSwapTx = await signer.sendTransaction({
      data: encodedSwapData,
      from: address,
      to: routerContract,
      value: amount,
    });

    // Wait for the transaction to be mined

    const executeSwapTxReceipt = await executeSwapTx.wait();
    const transactionDetails = await executeSwapTxReceipt.getTransaction();

    if (transactionDetails?.hash) {
      toast.success("Transaction Successfull!", {
        position: "top-center",
      });
      setLoaderSwap(false);
    } else {
      toast.error("Transaction Faield!", {
        position: "top-center",
      });
      setLoaderSwap(false);
    }
    const tokenBalanceUpdate = await getTokenBalance(
      buyToken,
      address,
    );
    setTokenBalance(tokenBalanceUpdate?.tokenBalance);
    return;
  } catch (error) {
    console.log("🚀 ~ error:", error?.message);
    toast.error("Transaction Faield!", {
      position: "top-center",
    });
    setLoaderSwap(false);
  }
}
// handler to sell evm tokens
async function sellEvmTokens(
  sellToken,
  amt,
  slippage,
  providerE,
  isConnected,
  address,
  network,
  decimals,
  setLoaderSwap,
  tokenBalance,
  setTokenBalance
) {
  try {
    if (!isConnected) {
      return toast.error("Wallet not connected.", {
        position: "top-center",
      });
    }
    if (!providerE) {
      return toast.error("Wallet not connected.", {
        position: "top-center",
      });
    }
    if (!amt || amt < 0) {
      return toast.error("Invalid amount.", {
        position: "top-center",
      });
    }
    if (tokenBalance <= amt) {
      return toast.error("insufficient Find + Gas.", {
        position: "top-center",
      });
    }
    setLoaderSwap(true);
    const amount = await ethers.parseUnits(amt.toString(), Number(decimals));
    // Initialize the provider and signer
    const signer = await providerE.getSigner();
    // Fetch the swap route from KyberSwap's API
    const swapRoute = await axios({
      url: `https://aggregator-api.kyberswap.com/${network}/api/v1/routes`,
      method: "get",
      params: {
        tokenIn: sellToken,
        tokenOut: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amountIn: amount.toString(),
      },
    });
    const swapRouteData = await swapRoute?.data?.data?.routeSummary;
    // Encode the transaction data based on the route information
    const encodeResponse = await axios({
      url: `https://aggregator-api.kyberswap.com/${network}/api/v1/route/build`,
      method: "post",
      data: {
        routeSummary: swapRouteData,
        sender: address,
        recipient: address,
        slippageTolerance: slippage,
      },
    });

    const encodedSwapData = await encodeResponse?.data?.data?.data;
    const routerContract = await encodeResponse?.data?.data?.routerAddress;
    const tokenContract = await new ethers.Contract(
      sellToken,
      ERC20ABI,
      signer
    );
    const approvalTx = await tokenContract.approve(
      routerContract,
      encodeResponse?.data?.data?.amountIn
    );
    const approvalTxReceipt = await approvalTx.wait();
    if (!approvalTxReceipt) {
      setLoaderSwap(false);
      return toast.success("Transaction does not approve!", {
        position: "top-center",
      });
    }
    // Execute the swap transaction
    const executeSwapTx = await signer.sendTransaction({
      data: encodedSwapData,
      from: address,
      to: routerContract,
    });

    // Wait for the transaction to be mined
    const executeSwapTxReceipt = await executeSwapTx.wait();
    const transactionDetails = await executeSwapTxReceipt.getTransaction();

    if (transactionDetails?.hash) {
      toast.success("Transaction Successfull!", {
        position: "top-center",
      });
      setLoaderSwap(false);
    } else {
      toast.error("Transaction Faield!", {
        position: "top-center",
      });
      setLoaderSwap(false);
    }
    const tokenBalanceUpdate = await getTokenBalance(
      sellToken,
      address,
      providerE
    );
    setTokenBalance(tokenBalanceUpdate?.tokenBalance);
    return;
  } catch (error) {
    console.log("🚀 ~ error:", error?.message);
    toast.error("Transaction Faield!", {
      position: "top-center",
    });
    setLoaderSwap(false);
    return;
  }
}

export { buyEvmTokens, sellEvmTokens };
