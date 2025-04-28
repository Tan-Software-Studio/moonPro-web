/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TokenImage from "../URI/TokenImage";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";

function RightSideWallet({ wallettrackerPage }) {
  //  get wallet latest trade from redux
  const walletLatestTrades = useSelector(
    (state) => state?.allCharTokenData?.tradesForWalletTracking
  );

  const [alertWallet, setAlertWallet] = useState([]);

  useEffect(() => {
    if (walletLatestTrades?.length) {
      setAlertWallet((prev) => {
        const updatedData = [...walletLatestTrades, ...prev];
        return updatedData.slice(0, 40);
      });
    }
  }, [walletLatestTrades]);

  const tableHeaders = [
    { title: wallettrackerPage?.wallet },
    { title: wallettrackerPage?.token },
    {
      title: wallettrackerPage?.amount,
      infoTipString: wallettrackerPage?.amounttooltip,
    },
    {
      title: wallettrackerPage?.price,
      infoTipString: wallettrackerPage?.pricetooltip,
    },
    {
      title: wallettrackerPage?.value,
      infoTipString: wallettrackerPage?.valuetooltip,
    },
    { title: wallettrackerPage?.type },
    { title: wallettrackerPage?.action },
  ];

  return (
    <div className="bg-[#0A0A0B] text-white xl:h-[77vh] h-[40vh] overflow-y-scroll overflow-x-auto">
      <div className="min-w-[900px]">
        {" "}
        {/* Ensure horizontal scroll if needed */}
        {/* Header - Fixed on Scroll */}
        <div className="sticky top-0 bg-[#0A0A0B] md:p-2 z-10 border-b border-[#1A1A1A]">
          <div className="grid grid-cols-7 gap-4 text-[#A8A8A8] text-[12px] font-semibold md:py-2 py-2   ">
            {tableHeaders.map((header, index) => (
              <div key={index} className="flex items-center gap-1">
                <p>{header.title}</p>
                {header?.infoTipString && (
                  <Infotip body={header?.infoTipString} />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Table Data */}
        {alertWallet.length === 0 ? (
          <div className="text-center text-[#A8A8A8] py-4 h-[20vh] flex items-center justify-center">
            No Data Available
          </div>
        ) : (
          alertWallet.map((alert, ind) => (
            <div
              key={ind}
              className="grid grid-cols-7 gap-4 items-center md:p-3 p-1 border-b border-[#1A1A1A] hover:bg-[#1A1A1B] transition-all cursor-pointer min-w-[900px]"
            >
              {/* Wallet Name & Address */}
              <div>
                <div className="text-sm font-medium text-[#A8A8A8]">
                  {alert?.tag || "N/A"}
                </div>
                <div
                  className="text-[12px] font-normal text-[#F6F6F6] cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(alert?.Transaction?.Signer);
                  }}
                >
                  {alert?.Transaction?.Signer.length > 11
                    ? `${alert?.Transaction?.Signer.slice(
                        0,
                        6
                      )}...${alert?.Transaction?.Signer.slice(-5)}`
                    : alert?.Transaction?.Signer}
                </div>
              </div>

              {/* Token & Image */}
              <div className="flex items-center gap-2">
                {/* <img src={alert?.TradeCurrency?.Uri} alt={alert?.TradeCurrency?.Uri} className="w-8 h-8 rounded-md" /> */}
                <TokenImage
                  uri={alert?.TradeCurrency?.Uri}
                  symbol={alert.Trade.Currency.Symbol}
                />
                <span className="text-[14px] font-medium">
                  {alert.Trade.Currency.Symbol}
                </span>
              </div>

              {/* Amount */}
              <div className="text-[12px] font-normal">
                {Number(alert?.Trade?.Amount).toFixed(2) || "N/A"}
              </div>

              {/* Price */}
              <div className="text-sm flex items-center gap-1">
                {/* <img src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" alt="sol" className="w-6 h-6 rounded-full" /> */}
                <span className="text-[12px] font-normal">
                  ${Number(alert?.Trade?.PriceInUSD).toFixed(5)}
                </span>
              </div>

              {/* Value */}
              <div className="text-sm flex items-center gap-1">
                {/* <img src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" alt="sol" className="w-6 h-6 rounded-full" /> */}
                <span className="text-[12px] font-normal">
                  ${Number(alert?.Trade?.AmountInUSD).toFixed(5)}
                </span>
              </div>

              {/* Type (Buy/Sell) */}
              <div>
                <span
                  className={`px-3 py-1 rounded-md text-[12px] font-normal text-[#F6F6F6] ${
                    alert?.Trade?.Side?.Type == "buy"
                      ? "bg-[#21CB6B52]"
                      : "bg-[#ED1B2452]"
                  }`}
                >
                  {alert?.Trade?.Side?.Type}
                </span>
              </div>

              {/* Action (Quick Buy - Only for Buy Type) */}
              <div>
                {alert?.Trade?.Side?.Type == "buy" && (
                  <div className="text-[#278BFE] text-[12px] cursor-pointer">
                    Quick buy
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RightSideWallet;
