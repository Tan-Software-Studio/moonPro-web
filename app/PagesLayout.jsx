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

const PagesLayout = ({ childrens }) => {
  const dispatch = useDispatch();
  const isLargeScreen = useSelector(
    (state) => state?.AllthemeColorData?.isLargeScreen
  );
  const isSmallScreenData = useSelector(
    (state) => state?.AllthemeColorData?.isSmallScreen
  );
  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  const hasScrolled = useSelector(
    (state) => state?.AllthemeColorData?.hasTableScroll
  );
  const isSearchbarPopup = useSelector(
    (state) => state?.AllStatesData?.isSearchPopup
  );
  useEffect(() => {
    const copyTradeValue = localStorage.getItem("copyBuySol");
    if (copyTradeValue > 0) {
      dispatch(setGlobalBuyAmt(copyTradeValue));
    } else {
      dispatch(setGlobalBuyAmt(0.1));
    }
  }, []);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <div
          className={`w-full ${
            (isSidebarOpen && isLargeScreen) ||
            (isSidebarOpen && isSmallScreenData)
              ? "md:pl-48  "
              : "md:pl-[57px]"
          } relative`}
        >
          {/* <div
          className={` w-full ${
            hasScrolled
              ? ` bg-[#101018] backdrop-blur-3xl border-l-[1px] ${borderColor}`
              : `!sticky  top-0 left-0 right-0`
          }`}
        ></div> */}
          <div className={` w-full z-50 !sticky top-0 left-0 right-0`}>
            <Navbar />
          </div>
          {isSearchbarPopup && (
            <div className="absolute">
              <SearchPopup />
            </div>
          )}
          {/* {isEnabled && <Notification />} */}
          <Notification />
          <WalletScan />

          <div className="w-full">{childrens}</div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default PagesLayout;
