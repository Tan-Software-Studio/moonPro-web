"use client";
import React, { useEffect, useState } from "react";
import { PiWallet } from "react-icons/pi";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import axios from "axios";
import axiosInstance from "@/apiInstance/axiosInstance";

const WalletScan = ({
  wallettrackerPage,
  isOpen,
  onClose,
  walletChartData,
}) => {
  const [activeTab, setActiveTab] = useState("Active Position");
  const [copiedIndex, setCopiedIndex] = useState(null);

  

  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL

  if (!isOpen) return null;

  const handleCopy = (address, index) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
 
  // async function getData() {
  //   await axiosInstance.get(`${baseUrl}transactions/PNLSolana/${solWalletAddress}`).then((response) => {
  //     console.log("response", response)
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }


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

  

  const currentTabData = tabData[activeTab] || [];


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 "
      onClick={onClose}
    >
      <motion.div
        className="bg-[#08080E] text-white rounded-xl w-full max-w-7xl shadow-2xl border border-gray-800 mx-auto flex flex-col overflow-hidden"
        style={{
          height: '90vh',
          maxHeight: '900px',
          minHeight: '400px' // Ensure minimum height for small screens
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Header - Fixed */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800 backdrop-blur-sm flex-wrap gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 flex-wrap min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">
              {walletChartData?.walletName || "Wallet Analysis"}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/60 rounded-full border border-slate-600/30">
              <span className="text-slate-300 font-mono text-sm">
                <span className="hidden sm:inline">
                  {walletChartData?.walletAddress || "No address"}
                </span>
                <span className="sm:hidden">
                  {walletChartData?.walletAddress ?
                    (walletChartData.walletAddress.length > 11
                      ? `${walletChartData.walletAddress.slice(0, 6)}...${walletChartData.walletAddress.slice(-5)}`
                      : walletChartData.walletAddress)
                    : "No address"
                  }
                </span>
              </span>
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-white transition-colors duration-200 text-xl p-2 flex-shrink-0"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Stats Grid */}
          <div className="mx-4 mt-4 grid grid-cols-1 lg:grid-cols-3 border border-gray-800 backdrop-blur-sm overflow-hidden">
            {/* Balance Section */}
            <div className="p-4 border-b lg:border-b-0 lg:border-r border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-slate-200 text-base font-medium">
                  {wallettrackerPage?.top?.balance?.balance || "Balance"}
                </h3>
              </div>

              <div className="">
                <div className="py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-gray-400">Total Value</p>
                    <Infotip
                      body="The current total market value of all assets held in the wallet. This includes both realized and unrealized gains/losses."
                    />
                  </div>
                  <p className="text-base font-semibold tracking-wider text-white">$293.2K</p>
                </div>

                <div className="py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-gray-400">Unrealized PNL</p>
                    <Infotip
                      body={wallettrackerPage?.top?.balance?.unrealizedpnltool || "Unrealized profit and loss"}
                    />
                  </div>
                  <p className="text-base font-semibold tracking-wider text-red-400">-$20.2K</p>
                </div>

                <div className="py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-gray-400">Available Balance</p>
                    <Infotip
                      body={wallettrackerPage?.top?.balance?.avabalancetool || "Available balance for trading"}
                    />
                  </div>
                  <p className="text-base font-semibold tracking-wider text-emerald-400">$10.94K</p>
                </div>
              </div>
            </div>

            {/* PnL Section */}
            <div className="p-4 border-b lg:border-b-0 lg:border-r border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-slate-200 text-base font-medium">
                  {wallettrackerPage?.top?.pnl || "PnL Analysis"}
                </h3>
              </div>
              <div className="flex mt-24 items-center justify-center">
                <div className="text-base text-gray-400">Chart will load here..</div>
              </div>
            </div>

            {/* Performance Section */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-slate-200 text-base font-medium">
                  {wallettrackerPage?.top?.performance?.performance || "Performance"}
                </h3>
              </div>

              <div className="">
                <div className="flex justify-between items-center pt-2 border-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400">Total PnL</p>
                    <Infotip
                      body={wallettrackerPage?.top?.performance?.totalpnltool || "Total profit and loss"}
                    />
                  </div>
                  <p className="text-red-400 text-sm font-semibold">-$20.2K</p>
                </div>

                <div className="flex justify-between items-center py-3 border-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400">Total Transactions</p>
                    <Infotip
                      body={wallettrackerPage?.top?.performance?.totaltxtool || "Total number of transactions"}
                    />
                  </div>
                  <div className="text-xs font-mono">
                    <span className="text-slate-300">$293.2K</span>
                    <span className="text-emerald-400 mx-1">$293.2K</span>
                    <span className="text-red-400">/ $293.2K</span>
                  </div>
                </div>

                {/* Performance Distribution */}
                <div className=" ">
                  {[
                    { color: "bg-emerald-500", label: ">500%", value: "1", textColor: "text-emerald-400" },
                    { color: "bg-emerald-400", label: "100% - 500%", value: "3", textColor: "text-emerald-300" },
                    { color: "bg-emerald-300", label: "0% - 200%", value: "7", textColor: "text-emerald-200" },
                    { color: "bg-red-400", label: "0 - -50%", value: "2", textColor: "text-red-400" },
                    { color: "bg-red-500", label: "<-50%", value: "12", textColor: "text-red-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 ${item.color} rounded-full`}></span>
                        <p className="text-xs text-slate-400">{item.label}</p>
                      </div>
                      <p className={`text-sm font-medium ${item.textColor}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Performance Bar */}
                <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
                  <div className="flex h-full">
                    <div className="bg-emerald-500" style={{ width: "4%" }}></div>
                    <div className="bg-emerald-400" style={{ width: "12%" }}></div>
                    <div className="bg-emerald-300" style={{ width: "28%" }}></div>
                    <div className="bg-red-400" style={{ width: "8%" }}></div>
                    <div className="bg-red-500" style={{ width: "48%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Table Section */}
          <div className="mx-4 mb-4   flex flex-col border border-t-0 border-gray-800 backdrop-blur-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-800 overflow-x-auto">
              {Object.keys(tabData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 text-sm font-medium transition-all duration-200 flex-shrink-0 ${activeTab === tab
                    ? "border-b-[1px] border-white text-white "
                    : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                    }`}
                >
                  {tab}
                  {tabData[tab] && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab ? "bg-blue-500" : "bg-slate-600"
                      }`}>
                      {tabData[tab].length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-auto max-h-[400px]">
              {currentTabData.length > 0 ? (
                <div className="min-w-full">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 border-b bg-[#08080E] border-gray-800 z-10">
                      <tr>
                        <th className="p-4 text-slate-300 font-medium">
                          {wallettrackerPage?.bottom?.activeposition?.token || "Token"}
                        </th>
                        <th className="p-4 text-slate-300 font-medium">
                          {wallettrackerPage?.bottom?.activeposition?.bought || "Bought"}
                        </th>
                        <th className="p-4 text-slate-300 font-medium">
                          {wallettrackerPage?.bottom?.activeposition?.sold || "Sold"}
                        </th>
                        <th className="p-4 text-slate-300 font-medium">
                          {wallettrackerPage?.bottom?.activeposition?.remaining || "Remaining"}
                        </th>
                        <th className="p-4 text-slate-300 font-medium">
                          {wallettrackerPage?.bottom?.activeposition?.pnl || "PnL"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTabData.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors duration-200"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src="https://pro.wavebot.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FfirstUserIcon.d2b80e4c.png&w=64&q=75"
                                alt="Token Icon"
                                className="w-10 h-10 rounded-md object-cover"
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-white">{item.token}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]">
                                    {item.address}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(item.address, index)}
                                    className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded transition-colors duration-200"
                                  >
                                    {copiedIndex === index ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3 text-slate-400 hover:text-slate-200" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-white">{item.bought}</p>
                            <p className="text-xs text-slate-400">2.13B CIPHER</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-white">{item.sold}</p>
                            <p className="text-xs text-slate-400">2.13B CIPHER</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-white">{item.remaining}</p>
                            <p className="text-xs text-slate-400">2.13B CIPHER</p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-semibold px-2 py-1 rounded-full text-sm ${item.pnl.includes("-")
                                ? "text-red-400 bg-red-900/20"
                                : "text-emerald-400 bg-emerald-900/20"
                                }`}
                            >
                              {item.pnl}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                    <PiWallet className="text-slate-400 text-2xl" />
                  </div>
                  <p className="text-slate-400 text-lg mb-2">No data available</p>
                  <p className="text-slate-500 text-sm">
                    {activeTab} information will appear here when available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletScan;