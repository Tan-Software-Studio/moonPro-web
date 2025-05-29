"use client";
import React, { useState } from "react";
import { PiWallet } from "react-icons/pi";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";

const WalletScan = ({
  wallettrackerPage,
  isOpen,
  onClose,
  walletChartData,
}) => {
  const [activeTab, setActiveTab] = useState("Active Position");
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (address, index) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabData = {
    "Active Position": [
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "+$594.33 (10%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$2,349",
        sold: "$2,349",
        remaining: "$2,349",
        pnl: "-$495 (-11.91%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
    ],
    History: [
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
      {
        token: "CIPHER",
        bought: "$1,200",
        sold: "$1,000",
        remaining: "1.5B ",
        pnl: "+$200 (5%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
    ],
    "Top 100": [
      {
        token: "CIPHER",
        bought: "$5,000",
        sold: "$4,500",
        remaining: "4B ",
        pnl: "+$500 (12%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
    ],
    Activity: [
      {
        token: "CIPHER",
        bought: "$3,000",
        sold: "$2,800",
        remaining: "2.5B ",
        pnl: "-$200 (-3%)",
        address: "6LYqVzVfqpjV...7a4Mpump",
      },
    ],
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 "
      onClick={onClose}
    >
      <motion.div
        className="bg-black text-white rounded-lg w-full max-w-[500px] md:max-w-[1000px] shadow-lg border border-[#404040] mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <PiWallet size={25} className="text-[#1F73FC] text-lg" />
            <h2 className="text-[16px] sm:text-[18px] font-bold">
              {walletChartData?.walletName}
            </h2>
            <span className="text-[#6E6E6E] font-normal text-[12px] sm:text-[14px]">
              <span className="hidden sm:inline">
                {walletChartData?.walletAddress}
              </span>
              <span className="sm:hidden">
                {walletChartData.walletAddress.length > 11
                  ? `${walletChartData.walletAddress.slice(
                      0,
                      6
                    )}...${walletChartData.walletAddress.slice(-5)}`
                  : walletChartData.walletAddress}
              </span>
            </span>
          </div>
          <button
            className="text-gray-400 hover:text-white text-lg sm:text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Balance, PnL, Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#404040] bg-black text-white">
          {/* Balance Section */}
          <div className="border-b md:border-b-0 md:border-r border-[#404040] bg-black">
            <div className="bg-[#1c1c1c] py-2 px-3">
              <h3 className="text-white text-[14px] md:text-[16px] font-medium">
                {wallettrackerPage?.top?.balance?.balance}
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1">
                <p className="text-[10px] md:text-[12px] text-[#A8A8A8]">
                  {wallettrackerPage?.top?.balance?.totalvalue}
                </p>
                <Infotip
                  body={
                    "The current total market value of all assets held in the wallet. This includes both realized and unrealized gains/losses."
                  }
                />
              </div>
              <p className="text-[16px] md:text-[18px] font-bold text-white">
                $293.2K
              </p>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] md:text-[12px] text-[#A8A8A8]">
                    {wallettrackerPage?.top?.balance?.unrealizedpnl}
                  </p>
                  <Infotip
                    body={wallettrackerPage?.top?.balance?.unrealizedpnltool}
                  />
                </div>
                <p className="text-[16px] md:text-[18px] font-bold text-[#ED1B24]">
                  -$20.2K
                </p>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] md:text-[12px] text-[#A8A8A8]">
                    {wallettrackerPage?.top?.balance?.avabalance}
                  </p>
                  <Infotip
                    body={wallettrackerPage?.top?.balance?.avabalancetool}
                  />
                </div>
                <p className="text-[16px] md:text-[18px] font-bold text-white">
                  $10.94K
                </p>
              </div>
            </div>
          </div>

          {/* PnL Section */}
          <div className="border-b md:border-b-0 md:border-r border-[#404040] bg-black">
            <div className="bg-[#1c1c1c] py-2 px-3">
              <h3 className="text-white text-[14px] md:text-[16px] font-medium">
                {wallettrackerPage?.top?.pnl}
              </h3>
            </div>
          </div>

          {/* Performance Section */}
          <div className="bg-black">
            <div className="bg-[#1c1c1c] py-2 px-3">
              <h3 className="text-white text-[14px] md:text-[16px] font-medium">
                {wallettrackerPage?.top?.performance?.performance}
              </h3>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] md:text-[12px] font-light text-[#A8A8A8]">
                    {wallettrackerPage?.top?.performance?.totalpnl}
                  </p>
                  <Infotip
                    body={wallettrackerPage?.top?.performance?.totalpnltool}
                  />
                </div>
                <p className="text-[#ED1B24] text-[14px] md:text-[16px] font-semibold">
                  -$20.2K
                </p>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] md:text-[12px] font-light text-[#A8A8A8]">
                    {wallettrackerPage?.top?.performance?.totaltx}
                  </p>
                  <Infotip
                    body={wallettrackerPage?.top?.performance?.totaltxtool}
                  />
                </div>
                <p className="text-lg font-bold text-green-400 space-x-1">
                  <span className="text-white text-[14px] md:text-[16px] font-normal">
                    $293.2K
                  </span>
                  <span className="text-[#21CB6B] text-[14px] md:text-[16px] font-normal">
                    $293.2K
                  </span>
                  <span className="text-[#ED1B24] font-normal text-[14px] md:text-[16px]">
                    / $293.2K
                  </span>
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 space-y-2">
                {[
                  { color: "bg-green-500", label: ">500%", value: "1" },
                  { color: "bg-green-400", label: "100% - 500%", value: "3" },
                  { color: "bg-green-300", label: "0% - 200%", value: "7" },
                  { color: "bg-red-400", label: "0 - -50%", value: "2" },
                  { color: "bg-red-500", label: "<-50%", value: "12" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 ${item.color} rounded-full`}
                      ></span>
                      <p className="text-[10px] md:text-[12px] font-light text-[#A8A8A8]">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-[14px] md:text-[16px] font-normal text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Performance Bar */}
              <div className="w-full h-2 bg-gray-700 rounded-full mt-2 relative">
                <div
                  className="absolute left-0 h-2 bg-green-500 rounded-l-full"
                  style={{ width: "20%" }}
                ></div>
                <div
                  className="absolute left-[20%] h-2 bg-green-400"
                  style={{ width: "15%" }}
                ></div>
                <div
                  className="absolute left-[35%] h-2 bg-green-300"
                  style={{ width: "10%" }}
                ></div>
                <div
                  className="absolute left-[45%] h-2 bg-red-400"
                  style={{ width: "5%" }}
                ></div>
                <div
                  className="absolute left-[50%] h-2 bg-red-500 rounded-r-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full overflow-hidden border border-[#404040] bg-black text-white">
          {/* Tabs Section */}
          <div className="flex gap-4 border-b border-[#404040] bg-[#1c1c1c] px-4 overflow-x-auto whitespace-nowrap">
            {Object.keys(tabData).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-2 text-sm md:text-base font-bold flex-shrink-0 ${
                  activeTab === tab
                    ? "text-[#1e1f20] border-b-2 border-[#1F73FC]"
                    : "text-[#A8A8A8] font-normal"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Section */}
          <div className="mt-2 max-h-[20vh] overflow-y-auto px-4">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="sticky top-0 bg-black z-10">
                  <tr className="border-b border-[#404040]">
                    <th className="p-2">
                      {wallettrackerPage?.bottom?.activeposition?.token}
                    </th>
                    <th className="p-2">
                      {wallettrackerPage?.bottom?.activeposition?.bought}
                    </th>
                    <th className="p-2">
                      {wallettrackerPage?.bottom?.activeposition?.sold}
                    </th>
                    <th className="p-2">
                      {wallettrackerPage?.bottom?.activeposition?.remaining}
                    </th>
                    <th className="p-2">
                      {wallettrackerPage?.bottom?.activeposition?.pnl}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tabData[activeTab].map((item, index) => (
                    <tr key={index} className="border-b border-[#404040]">
                      <td className="p-2 flex items-center gap-2">
                        <img
                          src="https://pro.wavebot.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FfirstUserIcon.d2b80e4c.png&w=64&q=75"
                          alt="Token Icon"
                          className="w-8 h-8 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm md:text-base">
                            {item.token}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span className="truncate max-w-[100px] md:max-w-[200px]">
                              {item.address}
                            </span>
                            <button
                              onClick={() => handleCopy(item.address, index)}
                              className="flex-shrink-0"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <p className="font-medium text-sm">{item.bought}</p>
                        <p className="text-xs text-[#A8A8A8]">2.13B CIPHER</p>
                      </td>
                      <td className="p-2">
                        <p className="font-medium text-sm">{item.sold}</p>
                        <p className="text-xs text-[#A8A8A8]">2.13B CIPHER</p>
                      </td>
                      <td className="p-2">
                        <p className="font-medium text-sm">{item.remaining}</p>
                        <p className="text-xs text-[#A8A8A8]">2.13B CIPHER</p>
                      </td>
                      <td
                        className={`p-2 text-sm ${
                          item.pnl.includes("-")
                            ? "text-[#ED1B24]"
                            : "text-[#21CB6B]"
                        }`}
                      >
                        {item.pnl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletScan;
