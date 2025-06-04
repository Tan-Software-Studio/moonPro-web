"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActivityTable from "@/components/profile/ActivityTable";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import ActivePosition from "@/components/profile/ActivePosition";
import { CiSearch } from "react-icons/ci";
import History from "../profile/History";
import TopHundred from "../profile/TopHundred";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserProfileControl = () => {
  const { t } = useTranslation();
  const portfolio = t('portfolio')
  const [leftTableTab, setLeftTableTab] = useState(portfolio?.activePosition);
  const [rightTableTab, setRightTableTab] = useState(portfolio?.activity);
  const [activePositionSearchQuery, setActivePositionSearchQuery] =
    useState("");
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [performance, setPerformance] = useState([])
  const [mobileActiveTab, setMobileActiveTab] = useState(portfolio?.activePosition);

  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const currentTabData = useSelector(
    (state) => state?.setPnlData?.PnlData || []
  );
  const nativeTokenbalance = useSelector(
    (state) => state?.AllStatesData?.solNativeBalance
  );

  // total value calculation
  const totalValue = currentTabData.reduce((acc, item) => {
    const value = (item?.activeQtyHeld - item?.quantitySold) * item?.current_price;
    return acc + value;
  }, 0);

  // unrealized pnl calculation
  const UnrealizedPNL = currentTabData.reduce((acc, item) => {
    const pnl =
      (item?.activeQtyHeld - item?.quantitySold) * (item.current_price - item.averageBuyPrice);
    return acc + pnl;
  }, 0);


  // search active position
  const hasSearch = activePositionSearchQuery.trim() !== "";
  const filteredData = currentTabData.filter(
    (item) =>
      item?.token
        .toLowerCase()
        ?.includes(activePositionSearchQuery.toLowerCase()) ||
      item?.name
        ?.toLowerCase()
        ?.includes(activePositionSearchQuery.toLowerCase()) ||
      item?.symbol
        ?.toLowerCase()
        ?.includes(activePositionSearchQuery.toLowerCase())
  );
  const filteredActivePosition = hasSearch ? filteredData : currentTabData;
  const backendUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  async function getPerformanceData() {
    const token = localStorage.getItem("token");
    if (!token) return;
    await axios
      .get(`${backendUrl}transactions/PNLPerformance/${solWalletAddress}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        console.log("🚀 ~ getPerformanceData ~ response:", response?.data?.data?.performance)
        setPerformance(response?.data?.data?.performance)
      }).catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    setPerformance([])
    getPerformanceData()
  }, [solWalletAddress])

  return (
    <>
      <div className=" ">
        <div className="  grid grid-cols-1 lg:grid-cols-7 md:border-l-0 border border-gray-800 backdrop-blur-sm overflow-hidden">
          {/* Balance Section */}
          <div className="p-4 bg-[#12121A] border-b lg:border-b-0 lg:border-r border-gray-800 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">{portfolio?.Balance}</h3>
            </div>

            <div className="">
              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">{portfolio?.totalValue}</p>
                  <Infotip body="The current total market value of all assets held in the wallet. This includes both realized and unrealized gains/losses." />
                </div>
                <p className="text-base font-semibold tracking-wider text-white">{`$${Number(
                  totalValue
                ).toFixed(5)}`}</p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">{portfolio?.unrealizedPNL}</p>
                </div>
                <p
                  className={`text-base font-semibold tracking-wider ${UnrealizedPNL >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                >
                  {`${UnrealizedPNL < 0 ? "-$" : "$"}${Math.abs(
                    UnrealizedPNL
                  ).toFixed(5)}`}
                </p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">{portfolio?.availableBalance}</p>
                </div>
                <p className="text-base font-semibold tracking-wider text-emerald-500">
                  SOL {`${Number(nativeTokenbalance).toFixed(5) || 0}`}
                </p>
              </div>
            </div>
          </div>

          {/* PnL Section */}
          <div className="p-4 bg-[#12121A] border-b lg:border-b-0 lg:border-r border-gray-800 lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">
                {portfolio?.pnlAnalysis}
              </h3>
            </div>
            <div className="flex mt-24 items-center justify-center">
              <div className="text-base text-gray-400">{portfolio?.comingSoon}</div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="bg-[#12121A]  p-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">
                {portfolio?.perfomance}
              </h3>
            </div>
            <div className="flex mt-24 items-center justify-center">
              <div className="text-base text-gray-400">{portfolio?.comingSoon}</div>
            </div>

            <div className="">
              <div className="flex justify-between items-center pt-2 border-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">Total PnL</p>
                </div>
                <p className={`${performance?.totalPNL >= 0 ? "text-emerald-400" : "text-red-400"}  text-sm font-semibold`}>{Number(performance?.totalPNL).toFixed(5) || 0}</p>
              </div>

              <div className="flex justify-between items-center py-3 border-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">Total Transactions</p>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-slate-300">{Number(performance?.totalPNL).toFixed(5) || 0} </span>
                  <span className="text-emerald-400 mx-1">{performance?.buys || 0} </span>
                  <span className="text-red-400">{performance?.sells || 0}</span>
                </div>
              </div>

              <div className=" ">
                {[
                  { color: "bg-emerald-500", label: ">500%", value: "---", textColor: "text-emerald-400", rangeId: 500 },
                  { color: "bg-emerald-400", label: "100% - 500%", value: "---", textColor: "text-emerald-300", rangeId: 200 },
                  { color: "bg-emerald-300", label: "0% - 200%", value: "---", textColor: "text-emerald-200", rangeId: 0 },
                  { color: "bg-red-400", label: "0 - -50%", value: "---", textColor: "text-red-400", rangeId: -50 },
                  { color: "bg-red-500", label: "<-50%", value: "---", textColor: "text-red-500", rangeId: null },
                ].map((item, index) => {
                  const performanceMatch = performance?.performance?.find(p => p._id === item.rangeId);
                  const value = performanceMatch ? performanceMatch.count : 0;
                  return (
                    <div key={index} className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 ${item.color} rounded-full`}></span>
                        <p className="text-xs text-slate-400">{item.label}</p>
                      </div>
                      <p className={`text-sm font-medium ${item.textColor}`}>{value}</p>
                    </div>
                  )
                })}
              </div>


              {/* <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-emerald-500" style={{ width: "4%" }}></div>
                  <div className="bg-emerald-400" style={{ width: "12%" }}></div>
                  <div className="bg-emerald-300" style={{ width: "28%" }}></div>
                  <div className="bg-red-400" style={{ width: "8%" }}></div>
                  <div className="bg-red-500" style={{ width: "48%" }}></div>
                </div>
              </div> */}
            </div>
          </div >
        </div >

        {/* Table Section */}

        < div className="w-full border-b border-gray-800 overflow-x-auto" >
          {/* Desktop: Two-column layout */}
          < div className="hidden xl:grid xl:grid-cols-2" >
            {/* Left side table tab */}
            <div div className="border-r border-gray-800" >
              <div className="flex items-center border-b border-gray-800 justify-between overflow-x-auto px-4">
                <div className="flex gap-1">
                  {[portfolio?.activePosition, portfolio?.history, portfolio?.top100].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLeftTableTab(tab)}
                      className={`px-2 py-3 text-sm font-medium tracking-wider transition-all duration-200 flex-shrink-0 ${leftTableTab === tab
                        ? "border-b-[1px] border-white text-white"
                        : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {leftTableTab === portfolio?.activePosition && (
                  <div>
                    <div className="w-full flex items-center gap-2 md:w-72 bg-gray-900 border border-gray-800 rounded-lg p-2">
                      <div>
                        <CiSearch size={20} />
                      </div>
                      <input
                        type="search"
                        onChange={(e) =>
                          setActivePositionSearchQuery(e.target.value)
                        }
                        placeholder={portfolio?.search}
                        className="w-full text-sm bg-gray-900  focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
              {
                leftTableTab === portfolio?.activePosition && (
                  <div>
                    <ActivePosition
                      filteredActivePosition={filteredActivePosition}
                      activePositionSearchQuery={activePositionSearchQuery}
                    />
                  </div>
                )
              }
              {
                leftTableTab === portfolio?.history && (
                  <div>
                    <History
                    />
                  </div>
                )
              }
              {
                leftTableTab === portfolio?.top100 && (
                  <div>
                    <TopHundred
                    />
                  </div>
                )
              }
            </div >

            {/* Right side table tab */}
            < div >
              <div className="flex items-center border-b border-gray-800 justify-between overflow-x-auto px-4">
                <div className="flex gap-1 items-center overflow-x-auto">
                  {[portfolio?.activity].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setRightTableTab(tab)}
                      className={`px-2 py-3 text-sm font-medium tracking-wider transition-all duration-200 flex-shrink-0 ${rightTableTab === tab
                        ? "border-b-[1px] border-white text-white"
                        : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="w-full flex items-center gap-2 md:w-72 bg-gray-900 border border-gray-800 rounded-lg p-2">
                    <div>
                      <CiSearch size={20} />
                    </div>
                    <input
                      type="search"
                      onChange={(e) => setActivitySearchQuery(e.target.value)}
                      placeholder={portfolio?.search}
                      className="w-full bg-gray-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <ActivityTable activitySearchQuery={activitySearchQuery} />
            </div >
          </div >

          {/* Mobile/Tablet: Tab-based view */}
          < div className="xl:hidden" >
            {/* Tab Navigation */}
            < div className="flex items-center border-b border-gray-800 justify-between overflow-x-auto sm:px-4 px-2" >
              <div className="flex gap-1">
                {
                  ["Active Position", "Activity", "History", "Top 100"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMobileActiveTab(tab)}
                      className={`px-2 sm:py-3 py-2 sm:text-sm text-xs font-medium sm:tracking-wider transition-all duration-200 flex-shrink-0 ${mobileActiveTab === tab
                        ? "border-b-[1px] border-white text-white"
                        : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                        }`}
                    >
                      {tab}
                    </button>
                  ))
                }
              </div >
              {/* <div>
                <div className="w-full md:w-72">
                  <input
                    type="search"
                    onChange={(e) =>
                      mobileActiveTab == portfolio?.activePosition
                        ? setActivePositionSearchQuery(e.target.value)
                        : setActivitySearchQuery(e.target.value)
                    }
                    placeholder={portfolio?.search}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg  sm:px-2 sm:py-2 px-1 py-1 text-sm focus:outline-none"
                  />
                </div>
              </div> */}
            </div >

            {/* Tab Content */}
            {
              mobileActiveTab == portfolio?.activePosition && (
                <div>
                  <ActivePosition
                    filteredActivePosition={filteredActivePosition}
                    activePositionSearchQuery={activePositionSearchQuery}
                  />
                </div>
              )
            }
            {
              mobileActiveTab == portfolio?.activity && (
                <div>
                  <ActivityTable activitySearchQuery={activitySearchQuery} />
                </div>
              )
            }
            {
              mobileActiveTab === "History" && (
                <div>
                  <History
                  />
                </div>
              )
            }
            {
              mobileActiveTab === "Top 100" && (
                <div>
                  <TopHundred
                  />
                </div>
              )
            }
          </div >
        </div >
      </div >
    </>
  );
};

export default UserProfileControl;
