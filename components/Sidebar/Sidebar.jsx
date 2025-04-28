"use client";
import {
  holdings,
  logo,
  logotext,
  memescope,
  trending,
  leaderboard,
  referral,
  recentCalls,
  profile,
  setting,
  alphaPicks,
  walletTrackerWhiteImg,
  proWallet,
} from "@/app/Images";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
import { useAppKitAccount } from "@reown/appkit/react";
import toast from "react-hot-toast";
import { subscribeToWalletTracker } from "@/websocket/walletTracker";
import { subscribeToNewNotifications } from "@/websocket/alphaCalls";
import { fetchAlphaPicksNotificationData } from "@/app/redux/alphaPicksNotification/alphaPicksNotificationData.js";
import { fetchAlphaFollowsData } from "@/app/redux/alphaFollows/alphaFollowsData";
import { useTranslation } from "react-i18next";
const Sidebar = () => {
  const { t, ready } = useTranslation();
    const sidebarPage = t("sidebar");
  const { address, isConnected } = useAppKitAccount();
  const [isHoverId, setisHoverId] = useState();
  const [isHoverIds, setIsHoverIds] = useState();
  const pathname = usePathname();

  const routeChain = pathname.split("/")[2];
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
      pathname: `/trending/${
        routeChain ? routeChain : selectToken.toLowerCase()
      }`,
      pagename: sidebarPage?.trending,
      img: trending,
      size: "",
    },
    {
      id: 2,
      pathname: `/recent-calls`,
      pagename: sidebarPage?.recentcalls,
      img: recentCalls,
      size: "",
    },
    // Only include Memescope if selectedToken is 'solana'
    {
      id: 3,
      pathname: `/memescope/solana`,
      pagename: sidebarPage?.memescope,
      img: memescope,
      size: "",
    },
    {
      id: 4,
      pathname: `/holdings/${
        routeChain ? routeChain : selectToken.toLowerCase()
      }`,
      pagename: sidebarPage?.holdings,
      tag: "New",
      img: holdings,
      size: "",
    },
    // {
    //   id: 5,
    //   pathname: `/copytrade`,
    //   pagename: "Copy Trade",
    //   img: copytrade,
    //   colorImg: copytradeColor,
    //   size: "",
    // },
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
      id: 8,
      pathname: `/alpha-picks`,
      pagename: sidebarPage?.alphapicks,
      img: alphaPicks,
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
    // {
    //   id: 6,
    //   pathname: "/swap",
    //   pagename: "swap",
    //   img: copytrade,
    //   size: "w-6 h-6",
    // },
    // {
    //   id: 8,
    //   pathname: "/transfer-funds",
    //   pagename: "Transfer-Funds",
    //   img: transferfunds,
    //   size: "w-5 h-5",
    // },
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
    // {
    //   id: 18,
    //   pathname: " ",
    //   pagename: "Log out",
    //   // icon: <IoLogOutOutline className="w-6 h-6" />,
    //   img: logout,
    //   size: "w-4 h-4",
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

  // start websocket for wallet tracking
  useEffect(() => {
    if (address) {
      subscribeToWalletTracker(address);
      dispatch(fetchAlphaPicksNotificationData(address));
      dispatch(fetchAlphaFollowsData(address));
      subscribeToNewNotifications(address);
    }
  }, [address]);

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
                className={`font-[400] p-2 text-[14px] mx-3 cursor-pointer text-[#ffffff] ${
                  data.pathname === pathname
                    ? `${
                        isSidebarOpen
                          ? "!rounded-md bg-[#11265B]"
                          : "rounded-full bg-gradient"
                      } border-[1px] border-[#0E43BD]`
                    : "text-[#ffffff]"
                } 
                  `}
                onMouseEnter={() => setisHoverId(data?.id)}
                onMouseLeave={() => setisHoverId()}
                onClick={() => {
                  if (data.pagename == "Holdings") {
                    if (!isConnected) {
                      router.push(data?.pathname);
                      isMobileScreenData && dispatch(setIsSidebarOpen(false));
                      return toast.error("Please connect your wallet.", {
                        position: "top-center",
                        style: { fontSize: "12px" },
                      });
                    }
                  }
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
            ))}
          </ul>
        </div>
        <ul className="bottom-7 md:absolute w-full">
          {sidebar?.map((data) => (
            <li
              key={data.id}
              className={`font-[400] mt-6 p-2 mx-3 text-[14px] cursor-pointer text-[#ebe8e8]  ${
                data.pathname == pathname
                  ? "text-[#00FFFF] bg-gradient bg-[#11265B] border-2 border-[#0E43BD] rounded-md"
                  : "text-[#ffffff]"
              } 
                ${data.pagename === "Profile" ? "md:hidden" : "block "}
                ${data.pagename === "Transfer-Funds" ? "md:hidden" : "block "} 
                ${
                  data.pathname == `/memescope/solana` && chainName !== "Solana"
                    ? "hidden"
                    : "block"
                } 
                `}
              onMouseEnter={() => setIsHoverIds(data?.id)}
              onMouseLeave={() => setIsHoverIds()}
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
                  className={`flex items-center justify-between flex-grow ${
                    (isSidebarOpen && isLargeScreen) ||
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
