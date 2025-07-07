"use client";
import { updatePnlTableData } from "@/app/redux/holdingDataSlice/holdingData.slice";
import UserProfileControl from "@/components/portfolio/UserProfileControl";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WalletManagement from "./WalletManagement";
import NoData from "../../components/common/NoData/noData";
import { useTranslation } from "react-i18next";
const metaDataMainName = process.env.NEXT_PUBLIC_METADATA_MAIN_NAME || "Nexa";
const PortfolioMainPage = () => {
  const dispatch = useDispatch();
  const activeSolWalletAddress = useSelector(
    (state) => state?.userData?.activeSolanaWallet
  );
  const activeTab = useSelector((state) => state?.setPnlData?.pnlTableData);
  useEffect(() => {
    document.title = `${metaDataMainName} | Portfolio`;
  }, []);

  const { t } = useTranslation();
  const portfolio = t("portfolio");

  return (
    <>
      {activeSolWalletAddress?.wallet ? (
        <>
          <div className="overflow-y-scroll h-[95vh]">
            <div className="flex items-center gap-5 p-5">
              <div
                className={`text-xl font-bold cursor-pointer ${
                  activeTab == "profile" ? "text-white" : "text-gray-400"
                }`}
                onClick={() => dispatch(updatePnlTableData("profile"))}
              >
                {portfolio?.spots}
              </div>
              <div
                className={`text-xl font-bold cursor-pointer ${
                  activeTab == "portfolio" ? "text-white" : "text-gray-400"
                }`}
                onClick={() => dispatch(updatePnlTableData("portfolio"))}
              >
                {portfolio?.wallets}
              </div>
            </div>

            {activeTab == "profile" && <UserProfileControl />}
            {activeTab == "portfolio" && <WalletManagement />}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-[70vh] w-full items-center justify-center mt-5">
          <NoData
            title={portfolio?.loginRequired}
            description={portfolio?.pleaseLogin}
          />
        </div>
      )}
    </>
  );
};

export default PortfolioMainPage;
