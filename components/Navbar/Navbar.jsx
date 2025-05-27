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
import { logo, walletBalance } from "@/app/Images";
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
import { FaRegStar, FaWallet } from "react-icons/fa";
import Setting from "./popup/Setting";
import AccountSecurity from "./popup/AccountSecurity";
import Watchlist from "./popup/Watchlist";
import { useTranslation } from "react-i18next";
import SolDeposit from "./popup/SolDeposit";
import ReferralCodePopup from "./login/RefferalPopup";
import axios from "axios";
import { fetchMemescopeData } from "@/app/redux/memescopeData/Memescope";
import {
  setFilterTime,
  setLoading,
} from "@/app/redux/trending/solTrending.slice";
import RecoveryKey from "./login/RecoveryKey";
import { decodeData } from "@/utils/decryption/decryption";
const URL = process.env.NEXT_PUBLIC_BASE_URLS;
const Navbar = () => {
  const [mounted, setMounted] = useState(false);

  // dropdown popup
  const [isSettingPopup, setIsSettingPopup] = useState(false);
  const [isAccountPopup, setIsAccountPopup] = useState(false);
  const [isWatchlistPopup, setIsWatchlistPopup] = useState(false);
  const [isSolDepositPopup, setIsSolDepositPopup] = useState(false);
  const [solPhrase, setSolPhrase] = useState("");
  const [openRecovery, setOpenRecovery] = useState(false);
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
        const decodeKey = await decodeData(
          res?.data?.data?.seedPhrases?.solana
        );
        setSolPhrase(decodeKey);
        setOpenRecovery(true);
      })
      .catch((err) => {
        console.log("🚀 ~ handleToGetSolanaPk ~ err:", err);
      });
  }
  // login signup
  // const [isLoginPopup, setIsLoginPopup] = useState(false);
  const isLoginPopup = useSelector(
    (state) => state?.AllStatesData?.isRegLoginPopup
  );
  // referral add popup
  const isReffaralCode = useSelector(
    (state) => state?.AllStatesData?.referralPopupAfterLogin
  );
  const authName = useSelector(
    (state) => state?.AllStatesData?.isRegisterOrLogin
  );
  // const [authName, setAuthName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // X===================X Use selectors X===================X //
  const nativeTokenbalance = useSelector(
    (state) => state?.AllStatesData?.solNativeBalance
  );
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );
  const isEnabled = useSelector((state) => state?.AllStatesData?.isEnabled);

  const dropdownRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();
  const navbar = t("navbar");
  const dispatch = useDispatch();
  const pathname = usePathname();

  const path =
    pathname === "/settings" ||
    pathname === "/copytrade" ||
    pathname === "/transfer-funds";

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
      .catch((err) => { });
  }
  useEffect(() => {
    fetchData();
    dispatch(fetchMemescopeData());
    // fetchSolPrice();
  }, []);
  // update and get solana balance
  useEffect(() => {
    if (solWalletAddress) {
      dispatch(fetchSolanaNativeBalance(solWalletAddress));
    }
  }, [solWalletAddress]);

  useEffect(() => {
    setMounted(true);

    // set SolWalletAddress
    dispatch(setSolWalletAddress());

    // Click out side for closing dropdown of profile
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <div className=" flex items-center gap-2  ">
              {/* Search bar */}
              <div
                className={`md:flex items-center  border ${isSidebarOpen ? "ml-1 " : "ml-5 gap-2"
                  } border-[#333333] ${isSidebarOpen && path ? "mx-0 lg:mx-0 md:mx-0" : " "
                  } rounded-lg h-8 px-2 bg-[#191919] hidden `}
                onClick={() => dispatch(setIsSearchPopup(true))}
              >
                <LuSearch className="h-4 w-4 text-[#A8A8A8]" />
                <input
                  className={` ${isSidebarOpen ? "w-0" : "w-12"
                    } w-56 bg-transparent outline-none text-[#404040] text-sm font-thin placeholder-[#6E6E6E] bg-[#141414] placeholder:text-xs `}
                  placeholder={navbar?.profile?.search}
                />
              </div>

              {solWalletAddress && (
                <div
                  onClick={() => setIsSolDepositPopup(!isSolDepositPopup)}
                  className={`flex items-center cursor-pointer gap-3 rounded-lg h-8 px-2 bg-[#1A1A1A]   `}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={walletBalance}
                      alt="solana"
                      height={30}
                      width={30}
                      className="rounded-full"
                    />
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
              )}

              {/* Only sm search bar */}
              <div
                onClick={() => dispatch(setIsSearchPopup(true))}
                className="cursor-pointer md:hidden block"
              >
                <LuSearch size={24} />
              </div>

              {/* Notifications */}
              {mounted && solWalletAddress && (
                <div
                  onClick={() => dispatch(setIsEnabled(!isEnabled))}
                  className="cursor-pointer relative"
                >
                  <RiNotification4Line size={24} />
                  <div className="w-2 h-2 rounded-full bg-[#ED1B24] absolute right-[0.6px] top-[0.6px]"></div>
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
                      <div className="absolute md:right-5 right-0 mt-2 border-[1px] border-[#404040] w-72 bg-[#141414] shadow-[#000000CC] rounded-md shadow-lg z-50">
                        <Link
                          onClick={() => setIsProfileOpen(false)}
                          href="/profile?"
                          className=""
                        >
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
                        <div
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsWatchlistPopup(true);
                          }}
                          className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <FaRegStar className="text-xl" />
                          {navbar?.profile?.watchList}
                        </div>
                        <div
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsSettingPopup(true);
                          }}
                          className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <IoSettingsOutline className="text-xl" />
                          {navbar?.profile?.setting}
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
        {isLoginPopup && (
          <LoginPopup isLoginPopup={isLoginPopup} authName={authName} />
        )}

        {isSettingPopup && <Setting setIsSettingPopup={setIsSettingPopup} />}

        {isAccountPopup && (
          <AccountSecurity
            setIsAccountPopup={setIsAccountPopup}
            handlePhrase={handleToGetSolanaPhrase}
          />
        )}

        {isWatchlistPopup && (
          <Watchlist setIsWatchlistPopup={setIsWatchlistPopup} />
        )}

        {isSolDepositPopup && (
          <SolDeposit
            isOpen={isSolDepositPopup}
            onClose={setIsSolDepositPopup}
          />
        )}
        {openRecovery && solPhrase && (
          <RecoveryKey
            PK={solPhrase}
            setPK={setSolPhrase}
            setOpenRecovery={setOpenRecovery}
            flag={true}
          />
        )}
      </AnimatePresence>
      {isReffaralCode && <ReferralCodePopup />}
    </>
  );
};

export default Navbar;
