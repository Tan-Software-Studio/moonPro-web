"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActivityTable from "@/components/profile/ActivityTable";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import ActivePosition from "@/components/profile/ActivePosition";
import { CiSearch } from "react-icons/ci";
import History from "../profile/History";
import TopHundred from "../profile/TopHundred";
import { useTranslation } from "react-i18next";
import RealizedPnLChart from "./PNLChart";
import Image from "next/image";
import NoData from "../common/NoData/noData";
import { getSolanaBalanceAndPrice } from "@/utils/solanaNativeBalance";

const UserProfileControl = ({ 
  walletAddress, 
  handleShowPnlCard, 
  handleShowPnlHistoricalCard,
  pnlData,
  pnlDataHistory,
  performance
}) => {
  const { t, i18n } = useTranslation();
  const portfolio = t("portfolio", { returnObjects: true });
  const [leftTableTab, setLeftTableTab] = useState(portfolio?.activePosition);
  const [rightTableTab, setRightTableTab] = useState(portfolio?.activity);
  const [activePositionSearchQuery, setActivePositionSearchQuery] =
    useState("");
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [mobileActiveTab, setMobileActiveTab] = useState(
    portfolio?.activePosition
  );
  const loading = pnlData.loading;


  // total value calculation
  const totalValue = pnlData.reduce((acc, item) => {
    const value =
      (item?.activeQtyHeld - item?.quantitySold) * item?.current_price;
    return acc + value;
  }, 0);

  // unrealized pnl calculation
  const UnrealizedPNL = pnlData.reduce((acc, item) => {
    const pnl =
      (item?.activeQtyHeld - item?.quantitySold) *
      (item.current_price - item.averageBuyPrice);
    return acc + pnl;
  }, 0);

  // search active position
  const hasSearch = activePositionSearchQuery.trim() !== "";
  const filteredData = pnlData.filter(
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
  const filteredActivePosition = hasSearch ? filteredData : pnlData;

  const performanceData = [
    {
      color: "bg-emerald-500",
      label: ">500%",
      value: "---",
      textColor: "text-emerald-400",
      rangeId: 500,
    },
    {
      color: "bg-emerald-400",
      label: "100% - 500%",
      value: "---",
      textColor: "text-emerald-300",
      rangeId: 200,
    },
    {
      color: "bg-emerald-300",
      label: "0% - 200%",
      textColor: "text-emerald-200",
      rangeId: 0,
    },
    {
      color: "bg-red-400",
      label: "0 - -50%",
      value: "---",
      textColor: "text-red-400",
      rangeId: -50,
    },
    {
      color: "bg-red-500",
      label: "<-50%",
      value: "---",
      textColor: "text-red-500",
      rangeId: null,
    },
  ];
  const counts = performanceData.map((item) => {
    const match = performance?.performance?.find((p) => p._id === item.rangeId);
    return match ? match.count : 0;
  });

  const totalCount = counts.reduce((sum, c) => sum + c, 0) || 1;
  const percentages = counts.map((count) => (count / totalCount) * 100);

  useEffect(() => {
    const updatedPortfolio = t("portfolio", { returnObjects: true });
    setLeftTableTab(updatedPortfolio?.activePosition);
    setRightTableTab(updatedPortfolio?.activity);
    setMobileActiveTab(updatedPortfolio?.activePosition);
  }, [i18n.language]);

  return (
    <>
      <div className=" ">
        <div className="  grid grid-cols-1 lg:grid-cols-7 md:border-l-0 border border-gray-800 backdrop-blur-sm overflow-hidden">
          {/* Balance Section */}
          <div className="p-4 bg-[#12121A] border-b lg:border-b-0 lg:border-r border-gray-800 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">
                {portfolio?.Balance}
              </h3>
            </div>

            <div className="">
              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">
                    {portfolio?.totalValue}
                  </p>
                  <Infotip body="The current total market value of all assets held in the wallet. This includes both realized and unrealized gains/losses." />
                </div>
                <p className="text-base font-semibold tracking-wider text-white">{`$${Number(
                  totalValue
                ).toFixed(5)}`}</p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">
                    {portfolio?.unrealizedPNL}
                  </p>
                </div>
                <p
                  className={`text-base font-semibold tracking-wider ${
                    UnrealizedPNL >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {`${UnrealizedPNL < 0 ? "-$" : "$"}${Math.abs(
                    UnrealizedPNL
                  ).toFixed(5)}`}
                </p>
              </div>

              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-400">
                    {portfolio?.availableBalance}
                  </p>
                </div>
                <p className="text-base font-semibold tracking-wider text-emerald-500">
                  SOL{" "}
                  {`${
                    Number(getSolanaBalanceAndPrice(walletAddress) || 0).toFixed(5) || 0
                  }`}
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
            {loading ? (
              <div
                className="snippet flex justify-center items-center mt-24   "
                data-title=".dot-spin"
              >
                <div className="stage">
                  <div className="dot-spin"></div>
                </div>
              </div>
            ) : performance?.chartPnlHistory?.length > 0 ? (
              <div className="flex items-center justify-center mt-[50px] h-[200px]">
                <RealizedPnLChart data={performance?.chartPnlHistory} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-10 text-center">
                <NoData />
              </div>
            )}
          </div>

          {/* Performance Section */}
          <div className="bg-[#12121A]  p-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-slate-200 text-base font-medium">
                {portfolio?.perfomance}
              </h3>
            </div>
            <div className="">
              <div className="flex justify-between items-center pt-2 border-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">Total PnL</p>
                </div>
                <p
                  className={`${
                    performance?.totalPNL >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }  text-sm font-semibold`}
                >
                  ${Number(performance?.totalPNL).toFixed(5) || 0}
                </p>
              </div>

              <div className="flex justify-between items-center py-3 border-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">Total Transactions</p>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-slate-300">
                    {Number(
                      (performance?.buys || 0) + (performance?.sells || 0)
                    )}
                  </span>
                  <span className="text-emerald-400 mx-1">
                    {performance?.buys || 0}{" "}
                  </span>
                  <span className="text-red-400">
                    {performance?.sells || 0}
                  </span>
                </div>
              </div>

              <div className=" ">
                {performanceData.map((item, index) => {
                  const performanceMatch = performance?.performance?.find(
                    (p) => p._id === item.rangeId
                  );
                  const value = performanceMatch ? performanceMatch.count : 0;
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 ${item.color} rounded-full`}
                        ></span>
                        <p className="text-xs text-slate-400">{item.label}</p>
                      </div>
                      <p className={`text-sm font-medium ${item.textColor}`}>
                        {value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div className="flex h-full">
                  {performanceData.map((item, idx) => (
                    <div
                      key={idx}
                      className={item.color}
                      style={{ width: `${percentages[idx]}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}

        <div className="w-full border-b border-gray-800 overflow-x-auto">
          {/* Desktop: Two-column layout */}
          <div className="hidden xl:grid xl:grid-cols-2">
            {/* Left side table tab */}
            <div div className="border-r border-gray-800">
              <div className="flex items-center border-b border-gray-800 justify-between overflow-x-auto px-4">
                <div className="flex gap-1">
                  {[
                    portfolio?.activePosition,
                    portfolio?.history,
                    portfolio?.top100,
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLeftTableTab(tab)}
                      className={`px-2 py-3 text-sm font-medium tracking-wider transition-all duration-200 flex-shrink-0 ${
                        leftTableTab === tab
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
                    <div className="w-full flex items-center gap-2 md:w-72 border border-gray-800 h-8 px-2 rounded-lg bg-gray-900  ">
                      <div>
                        <CiSearch size={20} />
                      </div>
                      <input
                        type="search"
                        onChange={(e) =>
                          setActivePositionSearchQuery(e.target.value)
                        }
                        placeholder={portfolio?.search}
                        className="w-full text-sm bg-transparent  focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
              {leftTableTab === portfolio?.activePosition && (
                <div>
                  <ActivePosition
                    walletAddress={walletAddress}
                    filteredActivePosition={filteredActivePosition}
                    activePositionSearchQuery={activePositionSearchQuery}
                    handleShowPnlCard={handleShowPnlCard}
                  />
                </div>
              )}
              {leftTableTab === portfolio?.history && (
                <div>
                  <History handleShowPnlHistoricalCard={handleShowPnlHistoricalCard}/>
                </div>
              )}
              {leftTableTab === portfolio?.top100 && (
                <div>
                  <TopHundred handleShowPnlHistoricalCard={handleShowPnlHistoricalCard}/>
                </div>
              )}
            </div>

            {/* Right side table tab */}
            <div>
              <div className="flex items-center border-b border-gray-800 justify-between overflow-x-auto px-4">
                <div className="flex gap-1 items-center overflow-x-auto">
                  {[portfolio?.activity].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setRightTableTab(tab)}
                      className={`px-2 py-3 text-sm font-medium tracking-wider transition-all duration-200 flex-shrink-0 ${
                        rightTableTab === tab
                          ? "border-b-[1px] border-white text-white"
                          : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="w-full flex items-center gap-2 md:w-72 border border-gray-800 h-8 px-2 rounded-lg bg-gray-900">
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
              <ActivityTable activitySearchQuery={activitySearchQuery} walletAddress={walletAddress} />
            </div>
          </div>

          {/* Mobile/Tablet: Tab-based view */}
          <div className="xl:hidden">
            {/* Tab Navigation */}
            <div className="flex items-center border-b border-gray-800 justify-between overflow-x-auto sm:px-4 px-2">
              <div className="flex gap-1">
                {[
                  portfolio?.activePosition,
                  portfolio?.activity,
                  portfolio?.history,
                  portfolio?.top100,
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMobileActiveTab(tab)}
                    className={`px-2 sm:py-3 py-2 sm:text-sm text-xs font-medium sm:tracking-wider transition-all duration-200 flex-shrink-0 ${
                      mobileActiveTab === tab
                        ? "border-b-[1px] border-white text-white"
                        : "text-slate-400 hover:text-slate-200 border-b-[1px] border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
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
            </div>

            {/* Tab Content */}
            {mobileActiveTab == portfolio?.activePosition && (
              <div>
                <ActivePosition
                  filteredActivePosition={filteredActivePosition}
                  activePositionSearchQuery={activePositionSearchQuery}
                />
              </div>
            )}
            {mobileActiveTab == portfolio?.activity && (
              <div>
                <ActivityTable activitySearchQuery={activitySearchQuery} />
              </div>
            )}
            {mobileActiveTab === portfolio?.history && (
              <div>
                <History />
              </div>
            )}
            {mobileActiveTab === portfolio?.top100 && (
              <div>
                <TopHundred />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileControl;
