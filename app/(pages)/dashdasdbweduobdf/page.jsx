"use client";
import { React, useState } from "react";
import { useSelector } from "react-redux";
import QuickSell from "@/components/Settings/QuickSell";
import Approve from "@/components/Settings/Approve";
import AutoBuy from "@/components/Settings/AutoBuy";
import AutoSell from "@/components/Settings/AutoSell";
import toast from "react-hot-toast";
import QuickBuy from "@/components/Settings/QuickBuy";
import { showToaster } from "@/utils/toaster/toaster.style";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(`Quick Buy`);

  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );

  const [copied, setCopied] = useState(false);
  const copyAddress = (address) => {
    navigator?.clipboard?.writeText(address);
    setCopied(address);
    showToaster("Address copied successfully.");
    setTimeout(() => {
      setCopied(null); // Reset after 2 seconds
    }, 600);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Quick Buy":
        return <QuickBuy />;
      case "Quick Sell":
        return <QuickSell />;
      case "Approve":
        return <Approve />; // Replace with your component
      case "Auto-Buy":
        return <AutoBuy />; // Replace with your component
      case "Auto Sell":
        return <AutoSell />; // Replace with your component
      default:
        return null;
    }
  };

  return (
    <div className="mr-4 ml-4 overflow-y-auto h-[95vh]">
      <div
        className={`mt-4 mb-5 text-white font-semibold uppercase text-3xl tracking-wider`}
      >
        <p>Settings</p>
      </div>
      <div
        className={`md:flex flex-1 space-y-4 md:space-y-0 items-center gap-8 bg-[] rounded-2xl p-8 mb-2 border ${borderColor} `}
      >
        <p className={`font-semibold text-sm text-white flex-shrink-0 `}>
          Wave Trading Wallet
        </p>
        {/* <div className="relative w-full  md:w-auto"> */}
        <input
          type="text"
          className={`${
            isSidebarOpen ? `md: truncate` : ``
          } md:block hidden  md:w-96 w-56 px-8 md:px-4 py-1.5 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-center text-xs placeholder:text-xs font-normal cursor-pointer`}
          value={solWalletAddress}
          readOnly
          onClick={() => copyAddress(solWalletAddress)}
        />
        <input
          type="text"
          className={`block md:hidden md:w-96 w-56 px-8 md:px-4 py-1.5 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-center text-xs placeholder:text-xs font-normal cursor-pointer`}
          value={solWalletAddress}
          readOnly
          onClick={() => copyAddress(solWalletAddress)}
        />
        {/* <PiCopySimpleFill
            className={`absolute end-4  top-1/2 transform -translate-y-1/2 text-[#6B6B6D] cursor-pointer`}
          /> */}
        {/* </div> */}
      </div>
      <div
        className={`!w-full bg-[] rounded-2xl p-8 mb-4 border ${borderColor}`}
      >
        <div
          className={`flex md:gap-8 gap-5 text-[#A5A5A7] text-xs md:text-sm border-b  ${borderColor} `}
        >
          {[`Quick Buy`, `Quick Sell`, `Approve`, `Auto-Buy`, `Auto Sell`].map(
            (tab) => (
              <p
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer   ${
                  activeTab === tab && tab == "Approve"
                    ? `border-b pb-8 md:pb-4  text-white`
                    : ``
                } ${activeTab === tab ? `border-b pb-4  text-white` : ``}`}
              >
                {tab}
              </p>
            )
          )}
        </div>
        <div className="mt-">{renderActiveTab()}</div>
        {/* {repeatSections.map((_, index) => (
          <div key={index}>
            <p className={`text-white font-semibold text-xs mb-1 mt-8`}>
              Max Gas Limit
            </p>
            <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
              The maximum amount of gas you are willing to offer for ANY
              transaction. We highly recommend that you refrain from adjusting
              this setting.
            </p>
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />
            <div className={`${borderColor} border-b mt-8`} />
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Settings;
