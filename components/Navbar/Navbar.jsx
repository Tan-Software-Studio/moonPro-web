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
import { logo } from "@/app/Images";
import {
  fetchSolanaNativeBalance,
  setIsEnabled,
  setIsSearchPopup,
  setSolWalletAddress,
} from "@/app/redux/states";
import { PiUserBold, PiUserLight } from "react-icons/pi";
import LoginPopup from "./login/LoginPopup";
import { RiLogoutBoxLine, RiNotification4Line } from "react-icons/ri";
import { googleLogout } from "@react-oauth/google";
import { MdLockOutline } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import Setting from "./popup/Setting";
import AccountSecurity from "./popup/AccountSecurity";
import Watchlist from "./popup/Watchlist";
import { useTranslation } from "react-i18next";
const Navbar = () => {
  const [mounted, setMounted] = useState(false);

  // dropdown popup
  const [isSettingPopup, setIsSettingPopup] = useState(false);
  const [isAccountPopup, setIsAccountPopup] = useState(false);
  const [isWatchlistPopup, setIsWatchlistPopup] = useState(false);

  // login signup
  const [isLoginPopup, setIsLoginPopup] = useState(false);
  const [authName, setAuthName] = useState("");
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
    router.push("/");
    setIsProfileOpen(false);
    googleLogout();
    setTimeout(() => {
      setIsLoginPopup(true);
      setAuthName("login");
    }, 1500);
  };

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
                className={`md:flex items-center  border ${
                  isSidebarOpen ? "ml-1 " : "ml-5 gap-2"
                } border-[#333333] ${
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
              <h1>{nativeTokenbalance}</h1>

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
                        setIsLoginPopup(true);
                        setAuthName("login");
                      }}
                      className="px-5 py-1 bg-[#1F1F1F] border-[1px] border-[#1F1F1F]  rounded-md cursor-pointer"
                    >
                      {navbar?.profile?.login}
                    </div>
                    <div
                      onClick={() => {
                        setIsLoginPopup(true);
                        setAuthName("signup");
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
          <LoginPopup
            isLoginPopup={isLoginPopup}
            authName={authName}
            setIsLoginPopup={setIsLoginPopup}
            setAuthName={setAuthName}
          />
        )}

        {isSettingPopup && <Setting setIsSettingPopup={setIsSettingPopup} />}

        {isAccountPopup && (
          <AccountSecurity setIsAccountPopup={setIsAccountPopup} />
        )}

        {isWatchlistPopup && (
          <Watchlist setIsWatchlistPopup={setIsWatchlistPopup} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
