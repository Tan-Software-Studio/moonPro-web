"use client";
import {
  holdings,
  logo,
  logotext,
  memescope,
  trending,
  referral,
} from "@/app/Images";
import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  setIsLargeScreen,
  setIsSidebarOpen,
  setIsSmallScreen,
} from "@/app/redux/CommonUiData";
import {
  subscribeToTrendingTokens,
  subscribeToWalletTracker,
} from "@/websocket/walletTracker";
import { useTranslation } from "react-i18next";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  fetchPerformanceHistory,
  fetchPNLData,
  fetchPNLDataHistory,
} from "@/app/redux/holdingDataSlice/holdingData.slice";
import AISignalsButton from "../Navbar/ai-signalBtn/AiSignalBtn";
import { setIsChartByDefault } from "@/app/redux/memescopeData/Memescope";
import { IoClose } from "react-icons/io5";
import { fetchAiSignalData } from "@/app/redux/AiSignalDataSlice/AiSignal.slice";

const Sidebar = () => {
  const { t } = useTranslation();
  const sidebarPage = t("sidebar");
  const pathname = usePathname();
  // get solana wallet address from redux
  const activeSolWalletAddress = useSelector(
    (state) => state?.userData?.activeSolanaWallet
  );
  const selectToken = useSelector(
    (state) => state?.AllthemeColorData?.selectToken
  );

  const dispatch = useDispatch();
  const sidebardata = [
    {
      id: 1,
      pathname: `/trending`,
      pagename: sidebarPage?.trending,
      img: trending,
      size: "",
    },
    {
      id: 3,
      pathname: `/memescope/solana`,
      pagename: sidebarPage?.memescope,
      img: memescope,
      size: "",
    },
    {
      id: 4,
      pathname: `/portfolio`,
      pagename: sidebarPage?.holdings,
      tag: "New",
      img: holdings,
      size: "",
    },
    // {
    //   id: 6,
    //   pathname: `/leaderboard`,
    //   pagename: sidebarPage?.leaderboard,
    //   img: leaderboard,
    //   size: "",
    // },
    {
      id: 7,
      pathname: `/referral`,
      pagename: sidebarPage?.referral,
      img: referral,
      size: "",
    },
    // {
    //   id: 9,
    //   pathname: `/wallet-tracker`,
    //   pagename: sidebarPage?.wallettracker,
    //   img: walletTrackerWhiteImg,
    //   size: "w-5 h-5",
    // },
  ];

  const isLargeScreen = useSelector(
    (state) => state?.AllthemeColorData?.isLargeScreen
  );
  // console.log("🚀 ~ Sidebar ~ isLargeScreen:2222222222222222222", isLargeScreen) // true , true
  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );
  const isLargeScreenData = window.innerWidth >= 1440;
  const isSmallScreenData = useMediaQuery({ query: "(max-width: 1024px)" });
  const isMobileScreenData = useMediaQuery({ query: "(max-width: 425px)" });

  useEffect(() => {
    subscribeToWalletTracker();
    subscribeToTrendingTokens();
    dispatch(fetchAiSignalData());
    dispatch(setIsChartByDefault());
  }, []);

  useEffect(() => {
    if (activeSolWalletAddress?.wallet) {
      dispatch(fetchPNLData(activeSolWalletAddress?.wallet));
      dispatch(fetchPNLDataHistory(activeSolWalletAddress?.wallet));
      dispatch(fetchPerformanceHistory(activeSolWalletAddress?.wallet));
    }
  }, [activeSolWalletAddress?.wallet]);

  useEffect(() => {
    setIsLargeScreen(isLargeScreenData);

    dispatch(setIsSidebarOpen(isLargeScreenData));
    dispatch(setIsSmallScreen(isSmallScreenData));

    isSmallScreenData && dispatch(setIsSidebarOpen(false));
    isLargeScreenData && dispatch(setIsSidebarOpen(true));
  }, [isLargeScreenData, isLargeScreen, isSmallScreenData]);

  return (
    <>
      <div
        className={`sidebar ${
          (isSidebarOpen && isLargeScreen) ||
          (isSidebarOpen && isSmallScreenData)
            ? `w-full md:w-[192.4px]`
            : " hidden md:block md:w-[64px]"
        } transition-all duration-1000 ease-in-out h-full overflow-x-hidden z-50 fixed top-0 left-0 bg-[#08080E] border-r-[1px] border-r-[#404040]`}
      >
        {/* logo + text */}
        <div className="flex  py-[17.8px] px-2 md:px-[2.4px]  items-center gap-3 justify-between md:justify-center text-[#B5B7DA] w-full">
          {isSidebarOpen ? (
            <>
              <Link href="/trending">
                <Image
                  alt="logotext"
                  src={`${process.env.NEXT_PUBLIC_SIDE_BIG_SCREEN}`}
                  height={40}
                  width={120}
                  className={`cursor-pointer`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = logotext;
                  }}
                  unoptimized
                />
              </Link>
            </>
          ) : (
            <Link href="/trending">
              <Image
                alt="full-logo"
                src={`${process.env.NEXT_PUBLIC_NAV_LOGO}`}
                width={40}
                height={35}
                className="cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = logo;
                }}
                unoptimized
              />
            </Link>
          )}
          <div
            className={`md:hidden flex items-center justify-center cursor-pointer border-[1px] border-[#2e2e2e] rounded-md  `}
            onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
          >
            <IoClose className="text-[30px] text-[#fdf5f5] p-[2px]" />
          </div>
        </div>

        {/* Munu */}
        <div className="relative hidden lg:block z-[]">
          {isSidebarOpen ? (
            <button
              onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
              className="bg-[#11265B]/[30] rounded-full h-[30px] w-[30px]  transition-colors duration-200 absolute -right-4 -top-2 "
            >
              <FaAngleLeft size={15} className="text-white/[30] " />
            </button>
          ) : (
            <button
              onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
              className="bg-[#11265B]/[30] rounded-full h-[30px] w-[30px]  transition-colors duration-200 absolute -right-4 -top-2"
            >
              <FaAngleRight size={15} className="text-white/[30] " />
            </button>
          )}
        </div>
        <div className="md:mt-[38px]">
          <ul className={`flex flex-col gap-6 mt-6`}>
            <div className="flex items-center md:px-0 px-4 md:ml-3">
              <div
                className="md:w-fit w-full rounded-md"
                onClick={() => {
                  isMobileScreenData && dispatch(setIsSidebarOpen(false));
                }}
              >
                <AISignalsButton />
              </div>
            </div>
            {sidebardata?.map((data) => (
              <Link key={data.id} href={data?.pathname}>
                <div
                  className={`font-[400] p-2 transition-all border-[1px] border-transparent duration-300 ease-in-out text-[14px] mx-3 cursor-pointer text-[#ffffff] ${
                    data.pathname === pathname
                      ? `${
                          isSidebarOpen
                            ? "!rounded-md bg-[#11265B]"
                            : "rounded-full bg-gradient"
                        } border-[1px] !border-[#0E43BD]`
                      : `text-[#ffffff]   hover:bg-[#11265B] ${
                          isSidebarOpen ? "rounded-md" : "rounded-full"
                        }`
                  } 
                  `}
                  onClick={() => {
                    isMobileScreenData && dispatch(setIsSidebarOpen(false));
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 flex items-center relative`}>
                      <Image
                        src={data.img}
                        alt={data.pagename}
                        className={` mx-auto ${data.size}`}
                        unoptimized
                      />
                    </div>
                    <span
                      className={`items-center justify-between flex-grow font-[400] text-nowrap ${
                        (isSidebarOpen && isLargeScreen) ||
                        (isSidebarOpen && isSmallScreenData)
                          ? "block"
                          : "hidden"
                      }
                        ${
                          selectToken == "Solana" &&
                          pathname === "memescope/solana"
                            ? "hidden"
                            : "flex"
                        }
                       `}
                    >
                      {data.pagename}
                      <FaAngleRight className={`md:hidden mr-[18px]`} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
