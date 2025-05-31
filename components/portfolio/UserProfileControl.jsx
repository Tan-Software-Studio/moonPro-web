"use client";
import { profileImage } from "@/app/Images";
import Image from "next/image";
import React, { useState } from "react";
import { FaShare, FaCopy } from "react-icons/fa";
import { BiCheckDouble } from "react-icons/bi";
import { useSelector } from "react-redux";
import ActivityTable from "@/components/profile/ActivityTable";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import ActivePosition from "@/components/profile/ActivePosition";
import TopHundredHolding from "../profile/TopHundredHolding";

const UserProfileControl = () => {
  const [isActive, setIsActive] = useState("All");
  const [leftTableTab, setLeftTableTab] = useState("Active position");
  const [rightTableTab, setRightTableTab] = useState("Activity");
  const [copied, setCopied] = useState(false);

  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance);

  const currentTabData = useSelector(
    (state) => state?.setPnlData?.PnlData || []
  );

  const totalValue = currentTabData.reduce((acc, item) => { 
    const value = item?.activeQtyHeld  * item?.current_price
    return acc + value
  }, 0)

  const UnrealizedPNL = currentTabData.reduce((acc, item) => {
    const pnl = item?.activeQtyHeld * (item.current_price - item.averageBuyPrice)
    return acc + pnl
  }, 0)


  const handleCopy = (mintAddress) => {
    setCopied(true);
    if (mintAddress) {
      const formattedAddress = mintAddress;
      navigator.clipboard
        ?.writeText(formattedAddress)
        .then(() => { })
        .catch((err) => {
          console.error("Failed to copy: ", err?.message);
        });
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <>
      <div className=" ">
        <div className="  grid grid-cols-1 lg:grid-cols-7 md:border-l-0 border border-gray-800 backdrop-blur-sm overflow-hidden">
          {/* Balance Section */}
          <div className="p-4 bg-[#12121A] border-b lg:border-b-0 lg:border-r border-gray-800 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">
                Balance
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
                <p className="text-base font-semibold tracking-wider text-white">{`$${Number(totalValue).toFixed(5)}`}</p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">Unrealized PNL</p>
                </div>
                <p className={`text-base font-semibold tracking-wider ${UnrealizedPNL >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {`${UnrealizedPNL < 0 ? "-$" : "$"}${Math.abs(UnrealizedPNL).toFixed(5)}`}
                </p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">Available Balance</p>
                </div>
                <p className="text-base font-semibold tracking-wider text-emerald-500">{`SOL${Number(nativeTokenbalance).toFixed(5) || 0}`}</p>
              </div>
            </div>
          </div>

          {/* PnL Section */}
          <div className="p-4 bg-[#12121A] border-b lg:border-b-0 lg:border-r border-gray-800 lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">
                {"PnL Analysis"}
              </h3>
            </div>
            <div className="flex mt-24 items-center justify-center">
              <div className="text-base text-gray-400">Chart will load here..</div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="bg-[#12121A]  p-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">
                {"Performance"}
              </h3>
            </div>

            <div className="">
              <div className="flex justify-between items-center pt-2 border-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">Total PnL</p>
                </div>
                <p className="text-red-400 text-sm font-semibold">---</p>
              </div>

              <div className="flex justify-between items-center py-3 border-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">Total Transactions</p>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-slate-300">---</span>
                  <span className="text-emerald-400 mx-1">---</span>
                  <span className="text-red-400">---</span>
                </div>
              </div>

              {/* Performance Distribution */}
              <div className=" ">
                {[
                  { color: "bg-emerald-500", label: ">500%", value: "---", textColor: "text-emerald-400" },
                  { color: "bg-emerald-400", label: "100% - 500%", value: "---", textColor: "text-emerald-300" },
                  { color: "bg-emerald-300", label: "0% - 200%", value: "---", textColor: "text-emerald-200" },
                  { color: "bg-red-400", label: "0 - -50%", value: "---", textColor: "text-red-400" },
                  { color: "bg-red-500", label: "<-50%", value: "---", textColor: "text-red-500" },
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

        {/* Table Section */}

        <div className="w-full grid lg:grid-cols-2 border-b border-gray-800 overflow-x-auto ">
          {/* left side table tab */}
          <div className="border-r border-gray-800">
            <div className="flex gap-1 px-4 border-b border-gray-800 overflow-x-auto">
              {["Active position",].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftTableTab(tab)}
                  className={`px-2 py-3 text-sm font-medium  tracking-wider transition-all duration-200 flex-shrink-0 ${leftTableTab == tab
                    ? "border-b-[1px] border-white text-white "
                    : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {leftTableTab == "Active position" &&
              <div className="">
                <ActivePosition />
              </div>
            }
            {/* {leftTableTab == "Top 100" &&
              <div className="">
                <TopHundredHolding />
              </div>
            } */}
          </div>

          {/* right side table tab */}
          <div>
            <div className="flex gap-1 px-4 border-b border-gray-800 overflow-x-auto">
              {["Activity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightTableTab(tab)}
                  className={`px-2 py-3 text-sm font-medium  tracking-wider transition-all duration-200 flex-shrink-0 ${rightTableTab === tab
                    ? "border-b-[1px] border-white text-white "
                    : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <ActivityTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileControl;
