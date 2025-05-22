"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { CiShare1 } from "react-icons/ci";
import {
  calculateHoldersPercentage,
  calculateTimeDifference,
  humanReadableFormat,
  humanReadableFormatWithOutUsd,
} from "@/utils/calculation";
import Moralis from "moralis";
import { usePathname } from "next/navigation";
import ProgressBar from "@ramonak/react-progress-bar";
import CircularProgressChart from "../common/HolderTableChart/CircularProgressChart.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchTradesData } from "@/app/redux/chartDataSlice/chartData.slice.js";
import TabNavigation from "../common/tradingview/TabNavigation.jsx";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import { useTranslation } from "react-i18next";

const Table = ({ scrollPosition, tokenCA, tvChartRef, solWalletAddress }) => {
  const { t } = useTranslation();
  const tragindViewPagePage = t("tragindViewPage");
  const dispatch = useDispatch();
  const latestTradesData = useSelector((state) => state.allCharTokenData);
  const [loader, setLoader] = useState(false);
  const [topHoldingData, setTopHoldingData] = useState([]);
  const [topTraderData, setTopTraderData] = useState([]);
  const [holdingsData, setHoldingsData] = useState([]);
  const [activeTab, setActiveTab] = useState("Transactions");
  const [top10Percentage, setTop10Percentage] = useState(0);
  const [top49Percentage, setTop49Percentage] = useState(0);
  const [top100Percentage, setTop100Percentage] = useState(0);

  useEffect(() => {
    if (!topHoldingData?.BalanceUpdates) return;

    // Extract balances and sort in descending order
    const balances = topHoldingData.BalanceUpdates.map((item) =>
      Number(item?.BalanceUpdate?.balance)
    ).sort((a, b) => b - a);

    // Take the top 10, top 49, and top 100 balances
    const top10Balances = balances.slice(0, 9);
    const top49Balances = balances.slice(9, 49);
    const top100Balances = balances.slice(49);

    // Calculate total balance
    const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);

    // Calculate percentages
    const top10Total = top10Balances.reduce((sum, balance) => sum + balance, 0);
    const top49Total = top49Balances.reduce((sum, balance) => sum + balance, 0);
    const top100Total = top100Balances.reduce(
      (sum, balance) => sum + balance,
      0
    );

    setTop10Percentage(
      totalBalance > 0 ? ((top10Total / totalBalance) * 100).toFixed(0) : 0
    );
    setTop49Percentage(
      totalBalance > 0 ? ((top49Total / totalBalance) * 100).toFixed(0) : 0
    );
    setTop100Percentage(
      totalBalance > 0 ? ((top100Total / totalBalance) * 100).toFixed(0) : 0
    );
  }, [topHoldingData, top10Percentage, top49Percentage, top100Percentage]);

  const pathname = usePathname();
  const chainName = pathname.split("/")[2];

  const tabList = [
    { name: "Transactions" },
    { name: "Top Holders" },
    { name: "Top Traders" },
    { name: "My Holdings" },
  ];

  const tableHeader = [
    {
      id: 1,
      title: tragindViewPagePage?.table?.topholders?.tableHeaders?.addresses,
    },
    { id: 2, title: "%" },
    {
      id: 3,
      title: tragindViewPagePage?.table?.topholders?.tableHeaders?.value,
    },
  ];

  const TopTradersHeader = [
    {
      id: 1,
      title: tragindViewPagePage?.table?.toptraders?.tableHeaders?.rank,
    },
    {
      id: 2,
      title: tragindViewPagePage?.table?.toptraders?.tableHeaders?.owner,
    },
    {
      id: 3,
      title: tragindViewPagePage?.table?.toptraders?.tableHeaders?.dex,
      infoTipString:
        tragindViewPagePage?.table?.toptraders?.tableHeaders?.dextool,
    },
    {
      id: 4,
      title: tragindViewPagePage?.table?.toptraders?.tableHeaders?.invest,
      infoTipString:
        tragindViewPagePage?.table?.toptraders?.tableHeaders?.investtool,
    },
    {
      id: 5,
      title: tragindViewPagePage?.table?.toptraders?.tableHeaders?.sold,
      infoTipString:
        tragindViewPagePage?.table?.toptraders?.tableHeaders?.soldtool,
    },
    {
      id: 6,
      title: tragindViewPagePage?.table?.toptraders?.tableHeaders?.volume,
      infoTipString:
        tragindViewPagePage?.table?.toptraders?.tableHeaders?.volumetool,
    },
    {
      id: 7,
      title: tragindViewPagePage?.table?.toptraders?.tableHeaders?.exp,
      infoTipString:
        tragindViewPagePage?.table?.toptraders?.tableHeaders?.exptool,
    },
  ];

  const TopTransactionHeader = [
    {
      id: 1,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.time,
    },
    {
      id: 2,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.type,
    },
    {
      id: 5,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.qty,
      infoTipString:
        tragindViewPagePage?.table?.transactions?.tableHeaders?.qtytool,
    },
    {
      id: 6,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.currency,
    },
    {
      id: 7,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.sideqty,
      infoTipString:
        tragindViewPagePage?.table?.transactions?.tableHeaders?.sideqtytool,
    },
    {
      id: 8,
      title:
        tragindViewPagePage?.table?.transactions?.tableHeaders?.sidecurrency,
      infoTipString:
        tragindViewPagePage?.table?.transactions?.tableHeaders
          ?.sidecurrencytool,
    },
    {
      id: 9,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.price,
      infoTipString:
        tragindViewPagePage?.table?.transactions?.tableHeaders?.pricetool,
    },
    {
      id: 10,
      title: `${tragindViewPagePage?.table?.transactions?.tableHeaders?.value} ($)`,
      infoTipString:
        tragindViewPagePage?.table?.transactions?.tableHeaders?.valuetool,
    },
    {
      id: 11,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.pool,
      infoTipString:
        tragindViewPagePage?.table?.transactions?.tableHeaders?.pooltool,
    },
    {
      id: 12,
      title: tragindViewPagePage?.table?.transactions?.tableHeaders?.hash,
      infoTipString:
        tragindViewPagePage?.table?.transactions?.tableHeaders?.hashtool,
    },
  ];

  const tableHeaderHolding = [
    {
      id: 1,
      title: tragindViewPagePage?.table?.myholding?.tableHeaders?.tokenname,
    },
    { id: 2, title: tragindViewPagePage?.table?.myholding?.tableHeaders?.qty },
    {
      id: 3,
      title: tragindViewPagePage?.table?.myholding?.tableHeaders?.remaining,
    },
    { id: 4, title: tragindViewPagePage?.table?.myholding?.tableHeaders?.sold },
    { id: 5, title: tragindViewPagePage?.table?.myholding?.tableHeaders?.pnl },
    {
      id: 6,
      title: tragindViewPagePage?.table?.myholding?.tableHeaders?.quicksell,
    },
  ];

  //  top holders api call
  const topHoldersApiCall = async () => {
    const date = await new Date();
    const currentTime = await date.toISOString();
    try {
      setLoader(true);
      const response = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `query TopHolders($token: String, $time_ago: DateTime) {
  Solana {
    BalanceUpdates(
      orderBy: {descendingByField: "BalanceUpdate_balance_maximum"}
      where: {BalanceUpdate: {Currency: {MintAddress: {is: $token}}}, Block: {Time: {before: $time_ago}}}
      limit:{count:200}
    ) {
      BalanceUpdate {
        Account {
          Owner
        }
        balance: PostBalance(maximum: Block_Slot)
      }
    }
    TokenSupplyUpdates(
      where: {TokenSupplyUpdate: {Currency: {MintAddress: {is: $token}}}}
      limitBy: {count: 1, by: TokenSupplyUpdate_Currency_MintAddress}
      orderBy: {descending: Block_Time}
    ) {
      TokenSupplyUpdate {
        market_cap: PostBalanceInUSD
        totalSupply: PostBalance
      }
    }
    DEXTradeByTokens(
      where: {Trade: {Currency: {MintAddress: {is: $token}}}}
      orderBy: {descending: Block_Time}
      limit:{count:1}
    ) {
      Trade {
        Currency {
          Name
          Symbol
        }
        price:PriceInUSD
      }
    }
  }
}
`,
          variables: {
            token: tokenCA,
            time_ago: currentTime,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`,
          },
        }
      );
      setLoader(false);
      setTopHoldingData(response?.data?.data?.Solana || []);
    } catch (error) {
      setLoader(false);
      console.error("Error:", error.response?.data || error.message || error);
    }
  };
  // top traders api call
  const toptradersApiCall = async () => {
    const date = await new Date();
    const currentTime = await date.toISOString();
    try {
      setLoader(true);
      const response = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `query TopTraders($token: String, $time_ago: DateTime) {
  Solana {
    DEXTradeByTokens(
      orderBy: {descendingByField: "volumeUsd"}
      limit: {count: 50}
      where: {Trade: {Currency: {MintAddress: {is: $token}}}, Transaction: {Result: {Success: true}}, Block: {Time: {before: $time_ago}}}
    ) {
      Trade {
        Account {
          Owner
        }
        Dex {
          ProgramAddress
          ProtocolFamily
          ProtocolName
        }
      }
      bought: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sold: sum(of: Trade_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      volume: sum(of: Trade_Amount)
      volumeUsd: sum(of: Trade_Side_AmountInUSD)
    }
  }
}`,
          variables: {
            token: tokenCA,
            time_ago: currentTime,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`,
          },
        }
      );
      setLoader(false);
      await setTopTraderData(
        response?.data?.data?.Solana?.DEXTradeByTokens || []
      );
    } catch (error) {
      setLoader(false);
      console.error("Error:", error.response?.data || error.message || error);
    }
  };

  // My Holding api Call
  const myHoldingData = async () => {
    setLoader(true);
    if (!Moralis.Core.isStarted) {
      const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      if (!apiKey) throw new Error("API key is missing!");
      await Moralis.start({ apiKey });
    }
    if (chainName == "solana") {
      try {
        const response = await Moralis.SolApi.account.getPortfolio({
          network: "mainnet",
          address: solWalletAddress,
        });
        const res = response.toJSON();
        setHoldingsData(res.tokens);
      } catch (error) {
        console.error("Error fetching token balances and prices:", error);
      } finally {
        setLoader(false);
      }
    }
  };

  // useeffect
  useEffect(() => {
    dispatch(fetchTradesData(tokenCA));
  }, [tokenCA]);

  useEffect(() => {
    if (solWalletAddress) {
      myHoldingData();
    } else {
      setHoldingsData([]);
    }
  }, [solWalletAddress]);

  return (
    <>
      <div
        className={`${
          latestTradesData?.latestTrades?.length > 0 ? "" : ""
        } relative bg-[#141414] w-full overflow-hidden`}
      >
        {/* table header */}
        <TabNavigation
          tabList={tabList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          topHoldersApiCall={topHoldersApiCall}
          toptradersApiCall={toptradersApiCall}
          myHoldingData={myHoldingData}
          tvChartRef={tvChartRef}
        />

        {/* table body */}
        <div
          className={`onest ${
            (activeTab === "Transactions" &&
              latestTradesData?.latestTrades?.length > 0) ||
            topTraderData?.length > 0 ||
            topHoldingData?.BalanceUpdates?.length > 0
              ? "visibleScroll"
              : ""
          } `}
        >
          <div>
            {activeTab === "Transactions" &&
            latestTradesData?.latestTrades?.length > 0 ? (
              <div className="lg:h-[85vh] h-[50vh] overflow-y-scroll visibleScroll">
                <table className="min-w-[100%] table-auto overflow-y-scroll">
                  <thead className="bg-[#08080E] sticky top-0">
                    <tr className="">
                      {TopTransactionHeader.map((header) => (
                        <th
                          key={header.id}
                          className="px-2 py-3 text-center text-xs font-medium text-[#A8A8A8] uppercase whitespace-nowrap leading-4"
                        >
                          <div className="flex items-center gap-1">
                            <p>{header.title}</p>
                            {header?.infoTipString && (
                              <Infotip body={header?.infoTipString} />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {latestTradesData?.latestTrades?.map((data, index) => {
                      const isBuy = data?.Trade?.Side?.Type == "buy";

                      return (
                        <tr
                          key={index}
                          className={`capitalize bg-[#08080E] text-[#F6F6F6] font-normal text-xs leading-4 onest border-b border-[#404040]`}
                        >
                          <td className="text-center px-6 py-4">
                            {data?.Block?.Time
                              ? calculateTimeDifference(data.Block.Time)
                              : "N/A"}
                          </td>
                          <td
                            className={`inline-block min-w-8 rounded px-3 py-1.5 text-white text-center ${
                              isBuy
                                ? "bg-[#21CB6B] bg-opacity-30"
                                : "bg-[#ED1B24] bg-opacity-30"
                            }`}
                          >
                            {data?.Trade?.Side?.Type || ""}
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.Amount
                              ? humanReadableFormatWithOutUsd(data.Trade.Amount)
                              : "N/A"}
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.Currency?.Symbol
                              ? data.Trade.Currency.Symbol
                              : "N/A"}
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.Side?.Amount
                              ? humanReadableFormatWithOutUsd(
                                  data.Trade.Side.Amount
                                )
                              : "N/A"}
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.Side?.Currency?.Symbol
                              ? data.Trade.Side.Currency.Symbol
                              : "N/A"}
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.PriceInUSD
                              ? Number(data.Trade.PriceInUSD).toFixed(5)
                              : "N/A"}
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.Amount
                              ? humanReadableFormat(
                                  data.Trade.Amount * data.Trade.PriceInUSD
                                )
                              : "N/A"}
                          </td>
                          <td className="text-center px-6 py-4 text-white">
                            {data?.Trade?.Market?.MarketAddress
                              ? `${data?.Trade?.Market?.MarketAddress?.slice(
                                  0,
                                  4
                                )}...${data?.Trade?.Market?.MarketAddress?.slice(
                                  -4
                                )}`
                              : "N/A"}
                          </td>
                          <td className="flex items-center justify-center px-6 py-4 font-normal text-white text-[20px]">
                            <a
                              href={`https://solscan.io/tx/${data?.Transaction?.Signature}`}
                              target="_blank"
                            >
                              <CiShare1 className="text-[18px]" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : activeTab === "Top Traders" && topTraderData?.length > 0 ? (
              <div className="lg:h-[85vh] h-[50vh] overflow-y-auto visibleScroll">
                <table className="min-w-[100%] table-auto overflow-y-scroll">
                  <thead className="bg-[#08080E] sticky top-0">
                    <tr className="">
                      {TopTradersHeader.map((header) => (
                        <th
                          key={header.id}
                          className="px-2 py-3 text-center text-xs font-medium text-[#A8A8A8] uppercase leading-4 whitespace-nowrap"
                        >
                          <div className="flex items-center gap-1">
                            <p>{header.title}</p>
                            {header?.infoTipString && (
                              <Infotip body={header?.infoTipString} />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {topTraderData.map((data, index) => (
                      <tr
                        key={index}
                        className="capitalize bg-[#08080E] text-[#F6F6F6] font-normal text-xs leading-4 onest border-b border-[#404040]"
                      >
                        <td className="text-center text-[#707070] px-6 py-4">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 text-center text-white">
                          {data?.Trade?.Account?.Owner
                            ? `${data.Trade.Account.Owner.slice(
                                0,
                                6
                              )}...${data.Trade.Account.Owner.slice(-6)}`
                            : "N/A"}
                        </td>
                        <td className="text-center px-6 py-4">
                          {data?.Trade?.Dex?.ProtocolFamily}
                        </td>
                        <td className="text-center px-6 py-4">
                          {data?.bought
                            ? humanReadableFormat(data.bought)
                            : "N/A"}
                        </td>
                        <td className="text-center px-6 py-4">
                          {data?.sold ? humanReadableFormat(data.sold) : "N/A"}
                        </td>
                        <td className="text-center px-6 py-4">
                          {data?.volume
                            ? humanReadableFormat(data.volumeUsd)
                            : "N/A"}
                        </td>
                        <td className="flex items-center justify-center px-6 py-4 font-normal text-white text-[20px]">
                          <a
                            href={`https://solscan.io/account/${data?.Trade?.Account?.Owner}`}
                            target="_blank"
                          >
                            <CiShare1 className="text-[18px]" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeTab === "Top Holders" &&
              topHoldingData?.BalanceUpdates?.length > 0 ? (
              <>
                <div className="lg:h-[85vh] h-[50vh] md:grid grid-cols-2">
                  <div className="overflow-y-scroll lg:h-[85vh] h-[50vh] border-r-[#4D4D4D] border border-[#4D4D4D] visibleScroll ">
                    <table className=" min-w-[100%] table-auto overflow-y-scroll visibleScroll">
                      <thead className="bg-[#08080E] sticky top-0">
                        <tr className="">
                          {tableHeader.map((header) => (
                            <th
                              key={header.id}
                              className="px-2 py-3 text-center text-xs font-medium text-[#A8A8A8] uppercase whitespace-nowrap leading-4"
                            >
                              {header.title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-transparent">
                        {topHoldingData?.BalanceUpdates.map((data, index) => (
                          <tr
                            key={index}
                            className="capitalize bg-[#08080E] text-[#F6F6F6] font-normal text-xs leading-4 onest border-b border-[#404040]"
                          >
                            <td className="px-6 py-3 text-center w-fit whitespace-nowrap flex-start">
                              {data?.BalanceUpdate?.Account?.Owner
                                ? `${data?.BalanceUpdate?.Account?.Owner?.slice(
                                    0,
                                    6
                                  )}...${data?.BalanceUpdate?.Account?.Owner?.slice(
                                    -6
                                  )}`
                                : "N/A"}
                            </td>
                            <td className="text-center py-3">
                              {topHoldingData?.TokenSupplyUpdates[0]
                                ?.TokenSupplyUpdate?.totalSupply ? (
                                <>
                                  <p className="pb-1">
                                    {calculateHoldersPercentage(
                                      data?.BalanceUpdate?.balance,
                                      topHoldingData?.TokenSupplyUpdates[0]
                                        ?.TokenSupplyUpdate?.totalSupply
                                    )}
                                  </p>
                                  <ProgressBar
                                    completed={Math.floor(
                                      parseFloat(
                                        calculateHoldersPercentage(
                                          data?.BalanceUpdate?.balance,
                                          topHoldingData?.TokenSupplyUpdates[0]
                                            ?.TokenSupplyUpdate?.totalSupply
                                        ).replace("%", "") // Remove "%" before converting to number
                                      )
                                    )}
                                    maxCompleted={100}
                                    transitionDuration="2s"
                                    transitionTimingFunction="ease-in-out"
                                    baseBgColor="#3a415a"
                                    bgColor="#6cc4f4"
                                    height="3px"
                                    borderRadius="10px"
                                    animateOnRender={true}
                                    labelClassName="label-bar"
                                  />
                                </>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="text-center px-6 py-3">
                              {topHoldingData?.DEXTradeByTokens[0]?.Trade
                                ?.price ? (
                                <>
                                  <p className="">
                                    {humanReadableFormat(
                                      data?.BalanceUpdate?.balance *
                                        topHoldingData?.DEXTradeByTokens[0]
                                          ?.Trade?.price
                                    )}
                                  </p>
                                </>
                              ) : (
                                "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div
                      className={`h-full md:flex hidden justify-center  ${
                        scrollPosition >= 20
                          ? "items-center"
                          : `lg:items-start lg:pt-5 items-center`
                      } transition-all duration-500 overflow-y-auto`}
                    >
                      <div className="flex-col">
                        <CircularProgressChart
                          scrollPosition={scrollPosition}
                          top10Percentage={top10Percentage}
                          top49Percentage={top49Percentage}
                          top100Percentage={top100Percentage}
                        />
                        <div className="flex justify-center text-white text-xs gap-2 mt-5 ">
                          <span className="h-2 w-2 ml-1 mt-1 bg-[#3b82f6]"></span>
                          <p className="text-[#8D93B7] mr-4">
                            Top 10{" "}
                            <span className="text-white">
                              {top10Percentage}%
                            </span>
                          </p>
                          <span className="h-2 w-2 ml-1 mt-1 bg-[#a855f7]"></span>
                          <p className="text-[#8D93B7] mr-4">
                            Top 49{" "}
                            <span className="text-white">
                              {top49Percentage}%
                            </span>{" "}
                          </p>
                          <span className="h-2 w-2 ml-1 mt-1 bg-[#facc15]"></span>
                          <p className="text-[#8D93B7] mr-4">
                            Other{" "}
                            <span className="text-white">
                              {top100Percentage}%
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === "My Holdings" && holdingsData?.length > 0 ? (
              <div className="lg:h-[85vh] h-[50vh] visibleScroll overflow-y-scroll">
                <table className="min-w-full table-auto ">
                  <thead className="bg-[#08080E] sticky top-0">
                    <tr className="">
                      {tableHeaderHolding.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-[#A8A8A8] uppercase leading-4 whitespace-nowrap"
                        >
                          {header.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {holdingsData.map((data, index) => (
                      <tr
                        key={index}
                        className={`capitalize bg-[#08080E] text-[#F6F6F6] border-[#404040] font-medium text-xs whitespace-nowrap leading-4 border-b onest`}
                      >
                        <td className="px-6 py-4text-[#3E9FD6]">
                          {data.symbol}
                        </td>
                        <td className="px-6 py-4">{data.amount}</td>
                        <td className="px-6 py-4">
                          <span>{"0.00439"}</span>
                          <br />
                          <span className="text-[#9b9999]">{"8.5K"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="">{"0.00439"}</span>
                          <br />
                          <span className="text-[#9b9999]">{"70M"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#F0488B] font-thin">
                            {"-7.51%"}
                          </span>
                          <br />
                          <span className="text-[#3E9FD6] font-thin">
                            {"+0.051%"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xs font-medium ">
                          <button className="border border-[#3E9FD6] rounded-lg px-6 py-1 bg-[#16171D] hover:bg-[#3E9FD6] hover:text-black transition-all duration-300 ease-in-out">
                            {"Sell"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <div className="flex w-full flex-col items-center justify-center lg:h-[20vh] h-[80vh] rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={`text-4xl ${loader ? "animate-bounce" : ""}`}
                    >
                      <Image
                        src="/assets/NoDataImages/qwe.svg"
                        alt="No Data Available"
                        width={100}
                        height={50}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="mt-2 text-[15px] text-[#b5b7da] font-bold">
                      {loader ? (
                        "Loading data..."
                      ) : activeTab === "My Holdings" ? (
                        !solWalletAddress ? ( // Wallet disconnected condition
                          <p className="text-[12px] md:text-[15px]">
                            {"Please login."}
                          </p>
                        ) : holdingsData?.length === 0 ? (
                          <p className="text-[12px] md:text-[15px]">
                            {"There is no current holdings in your wallet."}
                          </p>
                        ) : null // If wallet is connected and holdings exist, no message
                      ) : (
                        <p>{"No data found"}</p>
                      )}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
