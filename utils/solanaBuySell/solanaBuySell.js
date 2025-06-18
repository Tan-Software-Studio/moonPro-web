import { getSoalanaTokenBalance } from "../solanaNativeBalance";
import toast from "react-hot-toast";
import axios from "axios";
import {
  fetchSolanaNativeBalance,
  fetchUsdcBalance,
  openCloseLoginRegPopup,
} from "@/app/redux/states";
import { addMark } from "@/utils/tradingViewChartServices/mark";
import { getLatestBarTime } from "../tradingViewChartServices/latestBarTime";
import {
  setBuyAndSellCountInPerformance,
  updateHoldingsDataWhileBuySell,
} from "@/app/redux/holdingDataSlice/holdingData.slice";
import { showToaster } from "../toaster/toaster.style";
import { set100SellLine } from "../tradingViewChartServices/firstSell100Percent";
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
  programAddress,
  solanaLivePrice,
  dispatch,
  tokenPrice,
  convertedPrice,
  usdActive,
  marketCapActive,
  metaData
) => {
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
    return dispatch(openCloseLoginRegPopup(true));
  }
  if (amt <= 0) {
    return showToaster("Invalid amount.");
  }
  if (amt < 0.0001) {
    return showToaster("Minimum buy amount is 0.0001 SOL");
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
      amount: Number(amt),
      slippage: slipTolerance,
      priorityFee: priorityFee,
      price: Number(solanaLivePrice),
      tokenPrice: Number(tokenPrice),
      programAddress: programAddress,
      metaData: metaData || null,
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
      dispatch(
        updateHoldingsDataWhileBuySell({
          token: toToken,
          type: "buy",
          amountInDollar: Number(Number(amt) * solanaLivePrice),
          price: Number(tokenPrice),
          name: metaData?.name,
          symbol: metaData?.symbol,
          img: metaData?.img,
          solPrice: Number(solanaLivePrice),
        })
      );
      dispatch(setBuyAndSellCountInPerformance("buy"));
      try {
        addMark(
          getLatestBarTime(),
          true,
          tokenPrice * amt,
          convertedPrice,
          amt,
          usdActive,
          marketCapActive,
          "user"
        );
      } catch (err) {
        console.log("Buy Add Mark error", err);
      }
      setLoaderSwap(false);
      setTimeout(async () => {
        const [tokenBalanceUpdate, solBalance] = await Promise.all([
          getSoalanaTokenBalance(address, toToken),
          dispatch(fetchSolanaNativeBalance(address)),
        ]);
        setTokenBalance(tokenBalanceUpdate);
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
  solanaLivePrice,
  toToken,
  amt,
  address,
  nativeTokenbalance,
  e,
  programAddress,
  dispatch,
  tokenPrice,
  metaData
) => {
  e && e.stopPropagation();
  const token = localStorage.getItem("token");
  if (!token) {
    return dispatch(openCloseLoginRegPopup(true));
  }
  if (amt <= 0) {
    return showToaster("Invalid amount");
  }
  if (nativeTokenbalance < amt) {
    return showToaster("Insufficient funds.");
  }
  if (amt < 0.0001) {
    return showToaster("Minimum buy amount is 0.0001 SOL");
  }
  let slippage = 50;
  let priorityFee = 0.0001;
  const preSetFromLocalStorage = JSON.parse(
    localStorage.getItem("preSetAllData")
  );
  const preSetActiveFLag = localStorage.getItem("preSetSettingActive");
  if (preSetFromLocalStorage) {
    slippage =
      preSetFromLocalStorage?.[preSetActiveFLag || "P1"]?.["buy"]?.slippage;
    priorityFee =
      preSetFromLocalStorage?.[preSetActiveFLag || "P1"]?.["buy"]?.priorityFee;
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
      amount: Number(amt),
      slippage: slippage,
      priorityFee: priorityFee,
      price: Number(solanaLivePrice),
      programAddress: programAddress,
      tokenPrice: tokenPrice,
      metaData: metaData || null,
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
      dispatch(
        updateHoldingsDataWhileBuySell({
          token: toToken,
          type: "buy",
          amountInDollar: Number(Number(amt) * solanaLivePrice),
          price: Number(tokenPrice),
          name: metaData?.name,
          symbol: metaData?.symbol,
          img: metaData?.img,
          solPrice: Number(solanaLivePrice),
        })
      );
      dispatch(setBuyAndSellCountInPerformance("buy"));
      setTimeout(() => {
        dispatch(fetchSolanaNativeBalance(address));
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
  solanaLivePrice,
  toToken,
  address,
  nativeTokenbalance,
  e,
  programAddress,
  dispatch,
  tokenPrice,
  metaData
) => {
  e && e.stopPropagation();
  const amt = await localStorage.getItem("copyBuySol");
  const token = localStorage.getItem("token");
  if (!token) {
    return dispatch(openCloseLoginRegPopup(true));
  }
  if (amt <= 0) {
    return showToaster("Invalid amount.");
  }
  if (nativeTokenbalance < amt) {
    return showToaster("Insufficient funds");
  }
  if (amt < 0.0001) {
    return showToaster("Minimum buy amount is 0.0001 SOL");
  }
  let slippage = 50;
  let priorityFee = 0.0001;
  const preSetFromLocalStorage = JSON.parse(
    localStorage.getItem("preSetAllData")
  );
  const preSetActiveFLag = localStorage.getItem("preSetSettingActive");
  if (preSetFromLocalStorage) {
    slippage =
      preSetFromLocalStorage?.[preSetActiveFLag || "P1"]?.["buy"]?.slippage;
    priorityFee =
      preSetFromLocalStorage?.[preSetActiveFLag || "P1"]?.["buy"]?.priorityFee;
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
      amount: Number(amt),
      slippage: slippage,
      priorityFee: priorityFee,
      price: Number(solanaLivePrice),
      tokenPrice: tokenPrice,
      programAddress: programAddress
        ? programAddress
        : "nasdiuasdnasdudhsdjasbhid",
      metaData: metaData || null,
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
      dispatch(
        updateHoldingsDataWhileBuySell({
          token: toToken,
          type: "buy",
          amountInDollar: Number(Number(amt) * solanaLivePrice),
          price: Number(tokenPrice),
          name: metaData?.name,
          symbol: metaData?.symbol,
          img: metaData?.img,
          solPrice: Number(solanaLivePrice),
        })
      );
      dispatch(setBuyAndSellCountInPerformance("buy"));
      setTimeout(() => {
        dispatch(fetchSolanaNativeBalance(address));
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
  programAddress,
  dispatch,
  recQty,
  convertedPrice,
  usdActive,
  marketCapActive,
  solanaLivePrice,
  metaData,
  isSellFullAmount
) => {
  // console.log("🚀 ~ setTokenBalance:", setTokenBalance);
  // console.log("🚀 ~ setLoaderSwap:", setLoaderSwap);
  // console.log("🚀 ~ price:", price);
  // console.log("🚀 ~ decimal:", decimal);
  // console.log("🚀 ~ address:", address);
  // console.log("🚀 ~ priorityFee:", priorityFee);
  // console.log("🚀 ~ slipTolerance:", slipTolerance);
  // console.log("🚀 ~ amt:", amt);
  // console.log("🚀 ~ fromToken:", fromToken);
  if (amt <= 0) {
    return showToaster("Invalid amount.");
  }
  const token = localStorage.getItem("token");
  if (!token) {
    return dispatch(openCloseLoginRegPopup(true));
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
    url: `${BASE_URL}transactions/solsell`,
    method: "post",
    data: {
      token: fromToken,
      amount: Number(amt),
      slippage: slipTolerance,
      priorityFee: priorityFee,
      decimal,
      price,
      programAddress: programAddress
        ? programAddress
        : "nasdiuasdnasdudhsdjasbhid",
      amountRecInsol: Number(recQty),
      isSellFullAmount,
      solPrice: solanaLivePrice,
      metaData: metaData || null,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async () => {
      setLoaderSwap(false);
      await toast.success("Transaction successfully", {
        id: "saveToast",
        duration: 3000,
      });
      dispatch(
        updateHoldingsDataWhileBuySell({
          token: fromToken,
          type: "sell",
          amountInDollar: Number(Number(amt) * price),
          qty: Number(amt),
          price: Number(price),
          name: metaData?.name,
          symbol: metaData?.symbol,
          img: metaData?.img,
          isSellFullAmount,
          solPrice: Number(solanaLivePrice),
        })
      );
      dispatch(setBuyAndSellCountInPerformance("sell"));
      try {
        addMark(
          getLatestBarTime(),
          false,
          price * amt,
          convertedPrice,
          amt,
          usdActive,
          marketCapActive,
          "user"
        );
      } catch (err) {
        console.log("Sell Add Mark error", err);
      }
      try {
        if (isSellFullAmount) {
          set100SellLine(convertedPrice);
        }
      } catch (err) {
        // console.log("Saving 100 Sell Line", err);
      }
      setTimeout(async () => {
        const [tokenBalanceUpdate, solBalance] = await Promise.all([
          getSoalanaTokenBalance(address, fromToken),
          dispatch(fetchSolanaNativeBalance(address)),
        ]);
        setTokenBalance(tokenBalanceUpdate);
      }, 5000);
    })
    .catch(async (err) => {
      setLoaderSwap(false);
      await toast.error("Somthing went wrong please try again later.", {
        id: "saveToast",
        duration: 3000,
      });
      console.log("🚀 ~ err:", err?.message);
    });
  return;
};

// handle sell function for quick sell from portfolio
const sellSolanaTokensFromPortfolio = async (
  fromToken,
  amt,
  slipTolerance = 50,
  priorityFee = 0.0001,
  address,
  decimal,
  price,
  setLoaderSwap,
  programAddress,
  dispatch,
  recQty,
  solanaLivePrice,
  metaData,
  isSellFullAmount
) => {
  // console.log("🚀 ~ setTokenBalance:", setTokenBalance);
  // console.log("🚀 ~ setLoaderSwap:", setLoaderSwap);
  // console.log("🚀 ~ price:", price);
  // console.log("🚀 ~ decimal:", decimal);
  // console.log("🚀 ~ address:", address);
  // console.log("🚀 ~ priorityFee:", priorityFee);
  // console.log("🚀 ~ slipTolerance:", slipTolerance);
  // console.log("🚀 ~ amt:", amt);
  // console.log("🚀 ~ fromToken:", fromToken);
  if (amt <= 0) {
    return showToaster("Invalid amount.");
  }
  const token = localStorage.getItem("token");
  if (!token) {
    return dispatch(openCloseLoginRegPopup(true));
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
    url: `${BASE_URL}transactions/solsell`,
    method: "post",
    data: {
      token: fromToken,
      amount: Number(amt),
      slippage: slipTolerance,
      priorityFee: priorityFee,
      decimal,
      price: +Number(price).toFixed(8),
      programAddress: programAddress
        ? programAddress
        : "nasdiuasdnasdudhsdjasbhid",
      amountRecInsol: Number(recQty),
      isSellFullAmount,
      solPrice: solanaLivePrice,
      metaData: metaData || null,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async () => {
      setLoaderSwap(false);
      await toast.success("Transaction successfully", {
        id: "saveToast",
        duration: 3000,
      });
      dispatch(
        updateHoldingsDataWhileBuySell({
          token: fromToken,
          type: "sell",
          amountInDollar: Number(Number(amt) * price),
          qty: Number(amt),
          price: Number(price),
          name: metaData?.name,
          symbol: metaData?.symbol,
          img: metaData?.img,
          isSellFullAmount,
          solPrice: Number(solanaLivePrice),
        })
      );
      dispatch(setBuyAndSellCountInPerformance("sell"));
      setTimeout(async () => {
        dispatch(fetchSolanaNativeBalance(address));
      }, 5000);
    })
    .catch(async (err) => {
      setLoaderSwap(false);
      await toast.error("Somthing went wrong please try again later.", {
        id: "saveToast",
        duration: 3000,
      });
      console.log("🚀 ~ err:", err?.message);
    });
  return;
};

const getDateMinus24Hours = async (hours) => {
  const date = new Date();
  await date.setHours(date.getHours() - hours);
  return date.toISOString();
};

// convert SOL to USDC using BUY endpoint
const convertSOLtoUSDC = async (
  amount,
  slippage = 50,
  priorityFee = 0.0001,
  solanaPrice,
  usdcPrice,
  address,
  setLoaderSwap,
  setUsdcBalance,
  dispatch
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("User not login!", {
      position: "top-right",
    });
  }

  if (amount <= 0) {
    return toast.error("Invalid amount!", {
      position: "top-right",
    });
  }

  setLoaderSwap(true);
  toast(
    <div className="flex items-center gap-5">
      <div className="loaderPopup"></div>
      <div className="text-white text-sm">Converting SOL to USDC...</div>
    </div>,
    {
      id: "convertToast",
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

  const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  try {
    await axios({
      url: `${BASE_URL}transactions/solbuy`,
      method: "post",
      data: {
        token: USDC_MINT_ADDRESS,
        amount: Number(amount),
        slippage: slippage,
        priorityFee: priorityFee,
        price: Number(solanaPrice),
        programAddress: "uqhdweudhods",
        tokenPrice: Number(usdcPrice),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await toast.success("SOL to USDC conversion successful!", {
      id: "convertToast",
      duration: 3000,
    });

    setLoaderSwap(false);

    setTimeout(async () => {
      const [usdcBalanceUpdate] = await Promise.all([
        getSoalanaTokenBalance(address, USDC_MINT_ADDRESS),
        dispatch(fetchSolanaNativeBalance(address)),
        dispatch(fetchUsdcBalance(address)),
      ]);
      setUsdcBalance(usdcBalanceUpdate);
    }, 5000);
  } catch (err) {
    setLoaderSwap(false);
    console.log("🚀 ~ convertSOLtoUSDC error:", err?.message);
    await toast.error("Conversion failed. Please try again later.", {
      id: "convertToast",
      duration: 3000,
    });
  }
};

// convert USDC to SOL using SELL endpoint
const convertUSDCtoSOL = async (
  amount,
  amountRecInSol,
  slippage = 50,
  priorityFee = 0.0001,
  usdcPrice,
  address,
  setLoaderSwap,
  setUsdcBalance,
  dispatch
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("User not login!", {
      position: "top-right",
    });
  }

  if (amount <= 0) {
    return toast.error("Invalid amount!", {
      position: "top-right",
    });
  }

  setLoaderSwap(true);
  toast(
    <div className="flex items-center gap-5">
      <div className="loaderPopup"></div>
      <div className="text-white text-sm">Converting USDC to SOL...</div>
    </div>,
    {
      id: "convertToast",
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

  const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  try {
    await axios({
      url: `${BASE_URL}transactions/solsell`,
      method: "post",
      data: {
        token: USDC_MINT_ADDRESS,
        amount: Number(amount),
        slippage: slippage,
        priorityFee: priorityFee,
        decimal: 6, // USDC has 6 decimals
        price: Number(usdcPrice),
        programAddress: "sodsduoshks",
        amountRecInsol: Number(amountRecInSol),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await toast.success("USDC to SOL conversion successful!", {
      id: "convertToast",
      duration: 3000,
    });

    setLoaderSwap(false);

    // Update balances after successful conversion
    setTimeout(async () => {
      const [usdcBalanceUpdate] = await Promise.all([
        getSoalanaTokenBalance(address, USDC_MINT_ADDRESS),
        dispatch(fetchSolanaNativeBalance(address)),
        dispatch(fetchUsdcBalance(address)),
      ]);
      setUsdcBalance(usdcBalanceUpdate);
    }, 5000);
  } catch (err) {
    setLoaderSwap(false);
    console.log("🚀 ~ convertUSDCtoSOL error:", err?.message);
    await toast.error("Conversion failed. Please try again later.", {
      id: "convertToast",
      duration: 3000,
    });
  }
};

export {
  buySolanaTokens,
  sellSolanaTokens,
  sellSolanaTokensFromPortfolio,
  getDateMinus24Hours,
  buySolanaTokensQuickBuyHandler,
  buySolanaTokensQuickBuyHandlerCopyTrading,
  convertSOLtoUSDC,
  convertUSDCtoSOL,
};
