"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import SearchPopup from "@/components/common/Search-Popup/SearchPopup";
import Notification from "@/components/Notification/Notification";
import WalletScan from "@/components/walletTrackerNotification/WalletScan";
import { setGlobalBuyAmt } from "./redux/states";
import "../app/i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "@/components/Footer/Footer";
import { PhantomWalletProvider } from "@/app/providers/PhantomWalletProvider";
import Sidebar from "@/components/Sidebar/Sidebar";

const PagesLayout = ({ childrens }) => {
  const dispatch = useDispatch();
  const isLargeScreen = useSelector((state) => state?.AllthemeColorData?.isLargeScreen);
  const isSmallScreenData = useSelector((state) => state?.AllthemeColorData?.isSmallScreen);
  const isSidebarOpen = useSelector((state) => state?.AllthemeColorData?.isSidebarOpen);
  const borderColor = useSelector((state) => state?.AllthemeColorData?.borderColor);
  const hasScrolled = useSelector((state) => state?.AllthemeColorData?.hasTableScroll);
  const isSearchbarPopup = useSelector((state) => state?.AllStatesData?.isSearchPopup);

  useEffect(() => {
    const copyTradeValue = localStorage.getItem("copyBuySol");
    if (copyTradeValue >= 0) {
      dispatch(setGlobalBuyAmt(copyTradeValue));
    } else {
      dispatch(setGlobalBuyAmt(0.1));
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <>
      <PhantomWalletProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <div
            className={`w-full ${(isSidebarOpen && isLargeScreen) || (isSidebarOpen && isSmallScreenData) ? "md:pl-48  " : "md:pl-[66px] lg:pl-[64px]"
              } relative`}
          >
            <div className={` `}>
              <Navbar />
            </div>
            <div className="w-auto relative md:z-20 z-50">
              <Sidebar />
            </div>
            {isSearchbarPopup && (
              <div className="absolute">
                <SearchPopup />
              </div>
            )}
            {/* {isEnabled && <Notification />} */}
            <Notification />
            <WalletScan />

            <div className="w-full  ">{childrens}</div>
            <div className="">
              <Footer />
            </div>
          </div>
        </GoogleOAuthProvider>
      </PhantomWalletProvider>
    </>
  );
};

export default PagesLayout;
