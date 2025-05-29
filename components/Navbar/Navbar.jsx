"use client";
import React, { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { IoMenu, IoSettingsOutline } from "react-icons/io5";
import { setIsSidebarOpen } from "@/app/redux/CommonUiData";
import { logo, walletBalance, Solana, usdc } from "@/app/Images";
import {
  fetchSolanaNativeBalance,
  openCloseLoginRegPopup,
  setIsEnabled,
  setIsSearchPopup,
  setLoginRegPopupAuth,
  setSolanaLivePrice,
  setSolWalletAddress,
} from "@/app/redux/states";
import { PiUserBold, PiUserLight } from "react-icons/pi";
import LoginPopup from "./login/LoginPopup";
import { RiLogoutBoxLine, RiNotification4Line } from "react-icons/ri";
import { googleLogout } from "@react-oauth/google";
import { MdLockOutline } from "react-icons/md";
import { FaCopy, FaRegStar, FaWallet } from "react-icons/fa";
import Setting from "./popup/Setting";
import AccountSecurity from "./popup/AccountSecurity";
import Watchlist from "./popup/Watchlist";
import { useTranslation } from "react-i18next";
import ReferralCodePopup from "./login/RefferalPopup";
import axios from "axios";
import { fetchMemescopeData } from "@/app/redux/memescopeData/Memescope";
import { setFilterTime, setLoading } from "@/app/redux/trending/solTrending.slice";
import RecoveryKey from "./login/RecoveryKey";
import { decodeData } from "@/utils/decryption/decryption";
import ExchangePopup from "./popup/ExchangePopup";
import { fetchUserData } from "@/app/redux/userDataSlice/UserData.slice";
const URL = process.env.NEXT_PUBLIC_BASE_URLS;
const Navbar = () => {
  const [mounted, setMounted] = useState(false);

  // dropdown popup
  const [isSettingPopup, setIsSettingPopup] = useState(false);
  const [isAccountPopup, setIsAccountPopup] = useState(false);
  const [isWatchlistPopup, setIsWatchlistPopup] = useState(false);
  const [isSolDepositPopup, setIsSolDepositPopup] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [solPhrase, setSolPhrase] = useState("");
  const [openRecovery, setOpenRecovery] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
  // handle to get phrase of solana
  async function handleToGetSolanaPhrase() {
    const token = localStorage.getItem("token");
    if (!token) {
      return toast.error("Please login.");
    }
    await axios({
      url: `${baseUrl}user/getSolanaPhrase`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        // const decryptPK = await decrypt(res?.data?.data?.solanaPk, FE_SEC);
        // console.log("🚀 ~ .then ~ decryptPK:", decryptPK);
        setIsAccountPopup(false);
        const decodeKey = await decodeData(res?.data?.data?.seedPhrases?.solana);
        setSolPhrase(decodeKey);
        setOpenRecovery(true);
      })
      .catch((err) => {
        console.log("🚀 ~ handleToGetSolanaPk ~ err:", err);
      });
  }
  // login signup
  // const [isLoginPopup, setIsLoginPopup] = useState(false);
  const isLoginPopup = useSelector((state) => state?.AllStatesData?.isRegLoginPopup);
  // referral add popup
  const isReffaralCode = useSelector((state) => state?.AllStatesData?.referralPopupAfterLogin);
  const authName = useSelector((state) => state?.AllStatesData?.isRegisterOrLogin);
  // const [authName, setAuthName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userDetails = useSelector((state) => state?.userData?.userDetails);

  // X===================X Use selectors X===================X //
  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance);
  const solWalletAddress = useSelector((state) => state?.AllStatesData?.solWalletAddress);
  const isSidebarOpen = useSelector((state) => state?.AllthemeColorData?.isSidebarOpen);
  const isEnabled = useSelector((state) => state?.AllStatesData?.isEnabled);

  const dropdownRef = useRef(null);
  const walletDropdownRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();
  const navbar = t("navbar");
  const dispatch = useDispatch();
  const pathname = usePathname();

  const path = pathname === "/settings" || pathname === "/copytrade" || pathname === "/transfer-funds";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("walletAddress");
    dispatch(setSolWalletAddress());
    router.replace("/trending");
    setIsProfileOpen(false);
    googleLogout();
  };
  async function fetchData() {
    dispatch(setLoading(true));
    await axios
      .get(`${URL}findallTrendingToken`)
      .then((response) => {
        const rawData = response?.data?.data;
        const formattedData = {
          "1m": rawData?.["1+min"]?.tokens || [],
          "5m": rawData?.["5+min"]?.tokens || [],
          "30m": rawData?.["30+min"]?.tokens || [],
          "1h": rawData?.["1+hr"]?.tokens || [],
        };
        dispatch(setFilterTime(formattedData));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.log("🚀 ~ awaitaxios.get ~ error:", error);
        dispatch(setLoading(false));
      });
  }
  async function fetchSolPrice() {
    await axios({
      method: "get",
      url: `https://pro-api.solscan.io/v2.0/token/price?address=So11111111111111111111111111111111111111112`,
      headers: {
        token: process.env.NEXT_PUBLIC_SOLANAPRO_TOKEN,
      },
    })
      .then((res) => {
        const price = res?.data?.data[res?.data?.data?.length - 1]?.price;
        dispatch(setSolanaLivePrice(price));
      })
      .catch((err) => {});
  }
  useEffect(() => {
    fetchData();
    dispatch(fetchMemescopeData());
    // fetchSolPrice();
  }, []);
  useEffect(() => {
    if (solWalletAddress) {
      dispatch(fetchSolanaNativeBalance(solWalletAddress));
    }
  }, [solWalletAddress]);

  useEffect(() => {
    if (!userDetails?.email) {
      dispatch(fetchUserData());
    }
  }, [solWalletAddress]);

  useEffect(() => {
    setMounted(true);

    dispatch(setSolWalletAddress());

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target)) {
        setIsWalletDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopyAddress = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(solWalletAddress);
      setToastMessage("SOL address copied to clipboard");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to copy address:", err);
      setToastMessage("Failed to copy address");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleOpenDeposit = (depositType = "general", amount = null) => {
    setIsWalletDropdownOpen(false);
    // dispatch(setDepositData({ type: depositType, amount: amount }));
    setIsSolDepositPopup(true);
  };

  return (
    <>
      <div
        className={`backdrop-blur-3xl bg-[#08080E] transition-all duration-500 px-3 md:px-[8px] ease-in-out border-b-[1px] border-b-[#404040]`}
      >
        <div className="transition-all duration-500 ease-in-out sm:mr-2">
          <div className="flex items-center sm:gap-2 py-2 md:justify-end justify-between  sm:mx-4 md:mx-0">
            <div className={`md:hidden w-10 h-auto`}>
              <Image src={logo} alt="logo" className="w-full h-full" />
            </div>
            <div className=" flex items-center gap-2 ">
              {/* Search bar */}
              <div
                className={`md:flex items-center  border ${isSidebarOpen ? "ml-1 " : "ml-5 gap-2"} border-[#333333] ${
                  isSidebarOpen && path ? "mx-0 lg:mx-0 md:mx-0" : " "
                } rounded-lg h-8 px-2 bg-[#191919] hidden `}
                onClick={() => dispatch(setIsSearchPopup(true))}
              >
                <LuSearch className="h-4 w-4 text-[#A8A8A8]" />
                <input
                  className={` ${
                    isSidebarOpen ? "w-0" : "w-12"
                  } w-56 bg-transparent outline-none text-[#404040] text-sm font-thin placeholder-[#6E6E6E] bg-[#141414] placeholder:text-xs `}
                  placeholder={navbar?.profile?.search}
                />
              </div>

              {/* Only sm search bar */}
              <div onClick={() => dispatch(setIsSearchPopup(true))} className="cursor-pointer md:hidden block">
                <LuSearch size={24} />
              </div>

              {mounted && solWalletAddress && (
                <button
                  onClick={() => handleOpenDeposit("deposit")}
                  className="px-3 py-1.5 bg-[#11265B] hover:bg-[#5856EB] text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Deposit
                </button>
              )}

              {/* Watchlist */}
              {mounted && solWalletAddress && (
                <div onClick={() => setIsWatchlistPopup(true)} className="cursor-pointer">
                  <FaRegStar size={24} className="text-white transition-colors" />
                </div>
              )}

              {/* Notifications */}
              {mounted && solWalletAddress && (
                <div onClick={() => dispatch(setIsEnabled(!isEnabled))} className="cursor-pointer relative">
                  <RiNotification4Line size={24} />
                  <div className="w-2 h-2 rounded-full bg-[#ED1B24] absolute right-[0.6px] top-[0.6px]"></div>
                </div>
              )}

              {solWalletAddress && (
                <div className={`relative`} ref={walletDropdownRef}>
                  <div
                    onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                    className={`flex items-center cursor-pointer gap-3 rounded-lg h-8 px-2 bg-[#1A1A1A] hover:bg-[#252525] transition-colors`}
                  >
                    <div className="flex items-center gap-2">
                      <Image src={Solana} alt="solana" height={30} width={30} className="rounded-full" />
                      <div>{Number(nativeTokenbalance).toFixed(5) || 0}</div>
                    </div>

                    <div className="sm:flex  hidden items-center gap-3">
                      <FaWallet className="h-4 w-4 text-[#FFFFFF]" />
                      <div className={` text-[#A8A8A8] text-sm font-thin `}>
                        {solWalletAddress?.toString()?.slice(0, 4)}...
                        {solWalletAddress?.toString()?.slice(-4)}
                      </div>
                    </div>
                  </div>

                  {isWalletDropdownOpen && (
                    <div className="absolute right-0 mt-2 border-[1px] border-[#404040] w-64 bg-[#1A1A1A] shadow-xl rounded-lg z-50">
                      <div className="p-4">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-xs text-[#898989]">Total Value</div>
                            <div className="flex items-center gap-2 cursor-pointer ">
                              <div
                                className="flex items-center gap-1 text-xs text-[#898989] hover:bg-[#404040] p-1 rounded-md"
                                onClick={handleCopyAddress}
                              >
                                <button className="flex items-center gap-1 rounded text-xs transition-colors">
                                  <FaCopy className="w-3 h-3" />
                                </button>
                                <span>Solana</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-white mb-2">
                            ${(Number(nativeTokenbalance) * 200).toFixed(2)}
                          </div>
                        </div>

                        <div
                          className="flex items-center justify-between mb-3 cursor-pointer hover:bg-[#252525] p-1.5 rounded-lg transition-colors"
                          onClick={() => handleOpenDeposit("balance", Number(nativeTokenbalance))}
                        >
                          <div className="flex items-center gap-2">
                            <Image src={Solana} alt="solana" width={20} height={20} className="rounded-full" />
                            <span className="text-lg font-semibold text-white">
                              {Number(nativeTokenbalance).toFixed(5)}
                            </span>
                          </div>

                          <div className="text-[#666666] text-lg">⇄</div>

                          <div className="flex items-center gap-2">
                            <Image src={usdc} alt="usdc" width={20} height={20} className="rounded-full" />
                            <span className="text-lg font-semibold text-white">0</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenDeposit("deposit")}
                            className="flex-1 rounded-md bg-[#11265B] hover:bg-[#5856EB] text-white py-2.5 px-4 text-sm font-medium transition-colors"
                          >
                            Deposit
                          </button>
                          <button className="flex-1 bg-[#374151] hover:bg-[#4B5563] text-white py-2.5 px-4 rounded-md text-sm font-medium transition-colors">
                            Withdraw
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile */}
              <div className="flex items-center gap-2 ">
                {solWalletAddress ? (
                  <div className=" " ref={dropdownRef}>
                    <div onClick={() => setIsProfileOpen((prev) => !prev)}>
                      <PiUserBold size={26} className={`cursor-pointer`} />
                    </div>

                    {isProfileOpen && (
                      <div className="absolute md:right-5 right-0 mt-2 border-[1px] border-[#404040] w-50 bg-[#141414] shadow-[#000000CC] rounded-md shadow-lg z-50">
                        <Link onClick={() => setIsProfileOpen(false)} href="/profile?" className="">
                          <div className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md">
                            <PiUserLight className="text-xl" />
                            {navbar?.profile?.myProfile}
                          </div>
                        </Link>

                        <div
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsAccountPopup(true);
                          }}
                          className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <MdLockOutline className="text-xl" />
                          {navbar?.profile?.account}
                        </div>

                        <hr className="border-gray-700 my-1" />
                        <div
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-800 hover:text-white flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <RiLogoutBoxLine size={16} />
                          {navbar?.profile?.logout}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        dispatch(openCloseLoginRegPopup(true));
                        dispatch(setLoginRegPopupAuth("login"));
                      }}
                      className="px-5 py-1 bg-[#1F1F1F] border-[1px] border-[#1F1F1F]  rounded-md cursor-pointer"
                    >
                      {navbar?.profile?.login}
                    </div>
                    <div
                      onClick={() => {
                        dispatch(openCloseLoginRegPopup(true));
                        dispatch(setLoginRegPopupAuth("signup"));
                      }}
                      className="border-[1px] border-[#0E43BD] rounded-md cursor-pointer bg-[#11265B] px-5 py-1 "
                    >
                      {navbar?.profile?.signup}
                    </div>
                  </>
                )}
              </div>

              {/* Hamburger menu */}
              <div
                className={`md:hidden flex items-center justify-center cursor-pointer border-[1px] border-[#2e2e2e] rounded-md  `}
                onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
              >
                <IoMenu className="text-[30px] text-[#fdf5f5] p-[2px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLoginPopup && <LoginPopup isLoginPopup={isLoginPopup} authName={authName} />}

        {isSettingPopup && <Setting setIsSettingPopup={setIsSettingPopup} />}

        {isAccountPopup && (
          <AccountSecurity setIsAccountPopup={setIsAccountPopup} handlePhrase={handleToGetSolanaPhrase} />
        )}

        {isWatchlistPopup && <Watchlist setIsWatchlistPopup={setIsWatchlistPopup} />}

        {isSolDepositPopup && <ExchangePopup isOpen={isSolDepositPopup} onClose={setIsSolDepositPopup} />}
        {openRecovery && solPhrase && (
          <RecoveryKey PK={solPhrase} setPK={setSolPhrase} setOpenRecovery={setOpenRecovery} flag={true} />
        )}
      </AnimatePresence>
      {isReffaralCode && <ReferralCodePopup />}

      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#2A2A2A] border border-[#404040] text-white px-4 py-2 rounded-lg shadow-lg z-[70] flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm">{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className="ml-2 text-[#666666] hover:text-white">
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
