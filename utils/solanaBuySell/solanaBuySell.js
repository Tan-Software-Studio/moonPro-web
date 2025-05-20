import {
  getSoalanaTokenBalance,
} from "../solanaNativeBalance";
import toast from "react-hot-toast";
import axios from "axios";
import { fetchSolanaNativeBalance } from "@/app/redux/states";
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
  dispatch
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
      programAddress: programAddress
        ? programAddress
        : "nasdiuasdnasdudhsdjasbhid",
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
          dispatch(fetchSolanaNativeBalance(address))

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
  toToken,
  amt,
  address,
  nativeTokenbalance,
  e,
  programAddress,
  bondingCurv = 0,
  dispatch
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
  const program =
    bondingCurv >= 100 ? toToken : programAddress ? programAddress : toToken;
  await axios({
    url: `${BASE_URL}transactions/solbuy`,
    method: "post",
    data: {
      token: toToken,
      amount: amt,
      slippage: 50,
      priorityFee: 0.0001,
      price: 150,
      programAddress: program,
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
        dispatch(fetchSolanaNativeBalance(address))
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
  e,
  programAddress,
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
      programAddress: programAddress
        ? programAddress
        : "nasdiuasdnasdudhsdjasbhid",
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
        dispatch(fetchSolanaNativeBalance(address))
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
  dispatch
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
  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("User not login!", {
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
    url: `${BASE_URL}transactions/solsell`,
    method: "post",
    data: {
      token: fromToken,
      amount: amt,
      slippage: slipTolerance,
      priorityFee: priorityFee,
      decimal,
      price,
      programAddress: programAddress
        ? programAddress
        : "nasdiuasdnasdudhsdjasbhid",
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
      setTimeout(async () => {
        const [tokenBalanceUpdate, solBalance] = await Promise.all([
          getSoalanaTokenBalance(address, fromToken),
          dispatch(fetchSolanaNativeBalance(address))
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
  buySolanaTokensQuickBuyHandlerCopyTrading,
};