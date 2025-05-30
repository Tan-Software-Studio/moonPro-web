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

const UserProfileControl = () => {
  const [isActive, setIsActive] = useState("All");
  const [tableTab, setTableTab] = useState("Active-position");
  const [copied, setCopied] = useState(false);

  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
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
      <div className="overflow-y-scroll h-[95vh]">
        {/* <div className="lg:p-8 p-4 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={profileImage}
                alt="profile"
                height={50}
                width={50}
                className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-md"
              />
              <div>
                <div className="flex items-center gap-2 text-[#A8A8A8] text-xs md:text-sm break-all">
                  <span className="hidden sm:block">{solWalletAddress}</span>
                  <span className="block sm:hidden">{`${solWalletAddress
                    ?.toString()
                    ?.slice(0, 4)}...${solWalletAddress
                      ?.toString()
                      ?.slice(-4)}`}</span>
                  {copied ? (
                    <BiCheckDouble className="text-[20px]" />
                  ) : (
                    <FaCopy
                      onClick={() => handleCopy(solWalletAddress)}
                      className="cursor-pointer flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <div className="bg-[#1A1A1A] p-1 flex items-center rounded-md text-xs md:text-sm">
                {["All", "1D", "7D", "1M"].map((item, index) => (
                  <div
                    onClick={() => setIsActive(item)}
                    className={`px-2 md:px-3 py-1 md:py-2 cursor-pointer rounded-md ${isActive == item ? "bg-[#1F73FC]" : ""
                      }`}
                    key={index}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1 md:gap-2 bg-[#1F73FC] text-white rounded-md px-3 md:px-5 py-1 md:py-2 text-xs md:text-sm">
                <div>Share</div>
                <FaShare />
              </button>
            </div>
          </div>
        </div> */}

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 md:border-l-0 border border-gray-800 backdrop-blur-sm overflow-hidden">
          {/* Balance Section */}
          <div className="p-4 border-b lg:border-b-0 lg:border-r border-gray-800">
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
                <p className="text-base font-semibold tracking-wider text-white">---</p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">Unrealized PNL</p>
                </div>
                <p className="text-base font-semibold tracking-wider text-red-400">---</p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">Available Balance</p>
                </div>
                <p className="text-base font-semibold tracking-wider text-emerald-400">---</p>
              </div>
            </div>
          </div>

          {/* PnL Section */}
          <div className="p-4 border-b lg:border-b-0 lg:border-r border-gray-800">
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
          <div className="p-4">
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
        <div>
          <div className="flex gap-1 px-4 border-b border-gray-800 overflow-x-auto">
            {["Active-position", "Activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTableTab(tab)}
                className={`px-4 py-4 text-sm font-medium tracking-wider transition-all duration-200 flex-shrink-0 ${tableTab === tab
                  ? "border-b-[1px] border-white text-white "
                  : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w-full  py-3 overflow-x-auto">
            {tableTab == "Activity" &&
              <ActivityTable />
            }

            {tableTab == "Active-position" &&
              <ActivePosition />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileControl;
