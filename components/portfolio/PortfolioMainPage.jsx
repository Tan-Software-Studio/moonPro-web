"use client";
import { updatePnlTableData } from "@/app/redux/holdingDataSlice/holdingData.slice";
import UserProfileControl from "@/components/portfolio/UserProfileControl";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import WalletManagement from "./WalletManagement";
import { useTranslation } from "react-i18next";

const PortfolioMainPage = () => {
  const dispatch = useDispatch();
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const activeTab = useSelector((state) => state?.setPnlData?.pnlTableData);

  const { t } = useTranslation();
  const portfolio = t('portfolio')

  return (
    <>
      {solWalletAddress ? (
        <>
          <div className="overflow-y-scroll h-[95vh]">
            <div className="flex items-center gap-5 p-5">
              <div
                className={`text-xl font-bold cursor-pointer ${activeTab == "profile" ? "text-white" : "text-gray-400"
                  }`}
                onClick={() => dispatch(updatePnlTableData("profile"))}
              >
                {portfolio?.spots}
              </div>
              <div
                className={`text-xl font-bold cursor-pointer ${activeTab == "portfolio" ? "text-white" : "text-gray-400"
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
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="mb-6 flex flex-col justify-center text-center items-center">
            <Image
              src="/assets/NoDataImages/NoDataImages.svg"
              alt="No Data Available"
              width={24}
              height={24}
              className="text-slate-400 w-28 h-28"
            />
            <h3 className="text-xl font-bold text-white mb-2">
              {portfolio?.loginRequired}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed tracking-wider">
              {portfolio?.pleaseLogin}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioMainPage;
