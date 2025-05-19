"use client";
import {
  holdings,
  logo,
  logotext,
  memescope,
  trending,
  leaderboard,
  referral,
  profile,
  setting,
  walletTrackerWhiteImg,
  proWallet,
} from "@/app/Images";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  setIsLargeScreen,
  setIsSidebarOpen,
  setIsSmallScreen,
} from "@/app/redux/CommonUiData";
import { subscribeToTrendingTokens, subscribeToWalletTracker } from "@/websocket/walletTracker";
import { useTranslation } from "react-i18next";
const Sidebar = () => {
  const { t } = useTranslation();
  const sidebarPage = t("sidebar");
  const pathname = usePathname();
  // get solana wallet address from redux
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const router = useRouter();

  const chainName = useSelector(
    (state) => state.AllthemeColorData?.selectToken
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
      pathname: `/holdings`,
      pagename: sidebarPage?.holdings,
      tag: "New",
      img: holdings,
      size: "",
    },
    {
      id: 6,
      pathname: `/leaderboard`,
      pagename: sidebarPage?.leaderboard,
      img: leaderboard,
      size: "",
    },
    {
      id: 7,
      pathname: `/referral`,
      pagename: sidebarPage?.referral,
      img: referral,
      size: "",
    },
    {
      id: 9,
      pathname: `/wallet-tracker`,
      pagename: sidebarPage?.wallettracker,
      img: walletTrackerWhiteImg,
      size: "w-5 h-5",
    },
    {
      id: 10,
      pathname: `/trader-board`,
      pagename: sidebarPage?.prowallets,
      img: proWallet,
      size: "w-5 h-5",
    },
  ];

  const sidebar = [
    {
      id: 16,
      pathname: "/settings",
      pagename: sidebarPage?.settings,
      img: setting,
      size: "w-5 h-5",
    },
    {
      id: 17,
      pathname: "/profile",
      pagename: "Profile",
      img: profile,
      size: "w-5 h-5",
    },
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

  // start websocket for wallet tracking
  useEffect(() => {
    if (solWalletAddress) {
      subscribeToWalletTracker(solWalletAddress);
    }
  }, [solWalletAddress]);

  // subscribe to trending token
  useEffect(() => {
    subscribeToTrendingTokens();
  }, []);


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
        className={`sidebar ${(isSidebarOpen && isLargeScreen) ||
          (isSidebarOpen && isSmallScreenData)
          ? `w-full md:w-[192.4px]`
          : " hidden md:block md:w-[64px]"
          } transition-all duration-1000 ease-in-out h-full z-50 fixed top-0 left-0 bg-[#08080E] border-r-[1px] border-r-[#404040]`}
      >
        {/* logo + text */}
        <div className="flex  py-[17.8px] px-2 md:px-[2.4px] items-center justify-between md:justify-center text-[#B5B7DA] w-full">
          {isSidebarOpen ? (
            <>
              <Image
                onClick={() => {
                  dispatch(setIsSidebarOpen(!isSidebarOpen));
                }}
                alt="logotext"
                src={logotext}
                className={`cursor-pointer h-[25px] w-[140px]`}
              />
              <div
                className={`md:hidden flex items-center justify-center cursor-pointer border-[1px] border-[#2e2e2e] rounded-md md:order-1 order-2`}
                onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
              >
                <RxCross2 className="text-[30px] text-[#fdf5f5] p-[2px]" />
              </div>
            </>
          ) : (
            <Image
              onClick={() => {
                dispatch(setIsSidebarOpen(!isSidebarOpen));
              }}
              alt="full-logo"
              src={logo}
              className="cursor-pointer  w-[40px] h-[25px]"
            />
          )}
        </div>
        {/* Munu */}
        <div className="mt-[48px]">
          <ul className={`flex flex-col gap-6 mt-6`}>
            {sidebardata?.map((data) => (
              <div
                key={data.id}
                className={`font-[400] p-2 text-[14px] mx-3 cursor-pointer text-[#ffffff] ${data.pathname === pathname
                  ? `${isSidebarOpen
                    ? "!rounded-md bg-[#11265B]"
                    : "rounded-full bg-gradient"
                  } border-[1px] border-[#0E43BD]`
                  : "text-[#ffffff]"
                  } 
                  `}
                onClick={() => {
                  router.push(data?.pathname);
                  isMobileScreenData && dispatch(setIsSidebarOpen(false));
                }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 flex items-center relative`}>
                    <Image
                      src={data.img}
                      alt={data.pagename}
                      className={` mx-auto ${data.size}`}
                    />
                  </div>
                  <span
                    className={`items-center justify-between flex-grow font-[400] text-nowrap ${(isSidebarOpen && isLargeScreen) ||
                      (isSidebarOpen && isSmallScreenData)
                      ? "block"
                      : "hidden"
                      }
                        ${selectToken == "Solana" &&
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
            ))}
          </ul>
        </div>
        <ul className="bottom-7 md:absolute w-full">
          {sidebar?.map((data) => (
            <li
              key={data.id}
              className={`font-[400] mt-6 p-2 mx-3 text-[14px] cursor-pointer text-[#ebe8e8]  ${data.pathname == pathname
                ? "text-[#00FFFF] bg-gradient bg-[#11265B] border-2 border-[#0E43BD] rounded-md"
                : "text-[#ffffff]"
                } 
                ${data.pagename === "Profile" ? "md:hidden" : "block "}
                ${data.pagename === "Transfer-Funds" ? "md:hidden" : "block "} 
                ${data.pathname == `/memescope/solana` && chainName !== "Solana"
                  ? "hidden"
                  : "block"
                } 
                `}
              onClick={() =>
                isMobileScreenData && dispatch(setIsSidebarOpen(false))
              }
            >
              <Link href={data.pathname} className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center relative">
                  {data.pathname === pathname ? (
                    <Image
                      src={data.colorImg}
                      alt={data.pagename}
                      className={` mx-auto ${data.size}  `}
                    />
                  ) : (
                    <Image
                      src={data.img}
                      alt={data.pagename}
                      className={` mx-auto ${data.size}  `}
                    />
                  )}
                </div>

                <span
                  className={`flex items-center justify-between flex-grow ${(isSidebarOpen && isLargeScreen) ||
                    (isSidebarOpen && isSmallScreenData)
                    ? "block"
                    : "hidden"
                    }`}
                >
                  {data.pagename}
                  <FaAngleRight className={`md:hidden mr-[18px]`} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
