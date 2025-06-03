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
  convertUTCToLocalTimeString
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
import { humanReadableFormatWithNoDollar, formatDecimal } from "@/utils/basicFunctions";
import { solana } from "@/app/Images";
import { RiExchangeDollarLine } from "react-icons/ri";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";
import { CiFilter } from "react-icons/ci";

const Table = ({ scrollPosition, tokenCA, tvChartRef, solWalletAddress, tokenSupply, currentUsdPrice, currentTabData }) => {
  const { t } = useTranslation();
  const tragindViewPagePage = t("tragindViewPage");
  const dispatch = useDispatch();
  const latestTradesData = useSelector((state) => state.allCharTokenData);
  const [loader, setLoader] = useState(false);
  const [topHoldingData, setTopHoldingData] = useState([]);
  const [topTraderData, setTopTraderData] = useState([]);
  const [holdingsData, setHoldingsData] = useState([]);
  const [activeTab, setActiveTab] = useState("Trades");
  const [top10Percentage, setTop10Percentage] = useState(0);
  const [top25Percentage, setTop25Percentage] = useState(0);
  const [top50Percentage, setTop50Percentage] = useState(0);
  const [totalUsdActive, setTotalUsdActive] = useState(true);
  const [marketCapActive, setMarketCapActive] = useState(true);
  const [ageActive, setAgeActive] = useState(true);
  const [descTimeActive , setdescTimeActive] = useState(true);

  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );

  const toggleTotalUsdActive = () => {
    if (solanaLivePrice === 0) {
      return;
    } 
    setTotalUsdActive((prev) => !prev);
  };

  const toggleMarketCapActive = () => {
    if (tokenSupply === undefined) {
      return;
    } 
    setMarketCapActive((prev) => !prev);
  };

  const onAgeClick = () => {
    if (ageActive) {
      setdescTimeActive((prev) => !prev);
    } else {
      setAgeActive(true);
    }
  };

  const onTimeClick = () => {
    if (!ageActive) {
      setdescTimeActive((prev) => !prev);
    } else {
      setAgeActive(false);
    }
  };

  useEffect(() => {
    if (!topHoldingData) return;

    // Extract balances and sort in descending order
    const balances = topHoldingData?.map((item) =>
      Number(item?.holdings)
    ).sort((a, b) => b - a);
    console.log("balances", balances);

    // Take the top 10, top 49, and top 100 balances
    const top10Balances = balances.slice(0, 9);
    const top25Balances = balances.slice(9, 24);
    const top50Balances = balances.slice(49);

    // Calculate total balance
    const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);

    // Calculate percentages
    const top10Total = top10Balances.reduce((sum, balance) => sum + balance, 0);
    const top25Total = top25Balances.reduce((sum, balance) => sum + balance, 0);
    const top50Total = top50Balances.reduce(
      (sum, balance) => sum + balance,
      0
    );

    setTop10Percentage(
      totalBalance > 0 ? ((top10Total / tokenSupply) * 100).toFixed(0) : 0
    );
    setTop25Percentage(
      totalBalance > 0 ? ((top25Total / tokenSupply) * 100).toFixed(0) : 0
    );
    setTop50Percentage(
      totalBalance > 0 ? ((top50Total / tokenSupply) * 100).toFixed(0) : 0
    );
  }, [topHoldingData, top10Percentage, top25Percentage, top50Percentage]);

  const pathname = usePathname();
  const chainName = pathname.split("/")[2];

  const formatNumber = (amount, addSign = true, addDollar = true) => {
    const absoluteAmount = Math.abs(amount);
    const formattedAmount = absoluteAmount > 1 || absoluteAmount < -1
      ? humanReadableFormatWithNoDollar(absoluteAmount, 2)
      : formatDecimal(absoluteAmount, 1);
    let sign = "";
    if (amount < 0) {
      sign = "-";
    } else if (addSign) {
      sign = "+";
    }

    return `${sign}${addDollar ? "$" : ""}${formattedAmount}`
  };

  const tabList = [
    { name: "Trades" },
    { name: "Positions" },
    { name: "Holders" },
    { name: "Top Traders" },
  ];

  const tableHeader = [
    {
      id: 1,
      title: " ",
    },
    {
      id: 2,
      title: "Wallet",
    },
    // {
    //   id: 3,
    //   title: "SOL Balance"
    // },
    {
      id: 4,
      title: "Bought"
    },

    {
      id: 5,
      title: "Sold"
    },
    {
      id: 6,
      title: "Realized PnL"
    },
    { id: 7, title: "Remaining" },
    // {
    //   id: 8,
    //   title: "Edit",
    // },
  ];

  const TopTradersHeader = [
    {
      id: 1,
      title: " ",
    },
    {
      id: 2,
      title: "Wallet",
    },
    {
      id: 3,
      title: "SOL Balance"
    },
    {
      id: 4,
      title: "Bought"
    },

    {
      id: 5,
      title: "Sold"
    },
    {
      id: 6,
      title: "PnL"
    },
    { id: 7, title: "Remaining" },
    {
      id: 8,
      title: "Edit",
    },
  ];

  const TopTransactionHeader = [
    {
      id: 1,
      title: "Age / Time",
      customHeader: 
      <div className="flex gap-1 items-center justify-center text-[#A8A8A8]">
        <button 
          onClick={onAgeClick}
          className={`flex items-center justify-center gap-1 ${ageActive ? "text-white" : ""}`}
        >
          <p>Age</p>
          {ageActive && (
            descTimeActive ? 
              <FaArrowDownLong size={10} />
            :
              <FaArrowUpLong size={10} />
          )}
        </button>
        <p>/</p>
        <button 
          onClick={onTimeClick}
          className={`flex items-center justify-center gap-1 ${ageActive ? "" : "text-white" }`}
        >
          <p>Time</p>
          {!ageActive && ( 
            descTimeActive ? 
              <FaArrowDownLong size={10} />
            :
              <FaArrowUpLong size={10} />
          )}
        </button>
      </div>
    },
    {
      id: 2,
      title: "Type"
    },
    {
      id: 3,
      title: marketCapActive ? "MC" : "Price",
      onClick: toggleMarketCapActive,
      icon: <RiArrowLeftRightFill className="text-[#A8A8A8]" size={12} />
    },
    {
      id: 4,
      title: "Amount"
    },
    {
      id: 5,
      title: totalUsdActive ? "Total USD" : "Total SOL",
      onClick: toggleTotalUsdActive,
      icon: <RiExchangeDollarLine className={`${totalUsdActive ? 'text-[#21CB6B]' : 'text-[#A8A8A8]'}`} size={15} />
    },
    {
      id: 6,
      title: "Trader"
    },
  ];

  const tableHeaderHolding = [
    {
      id: 1,
      title: "Token"
    },
    { id: 2, title: "Bought" },
    {
      id: 3,
      title: "Sold"
    },
    { id: 4, title: "Remaining" },
    { id: 5, title: "PnL" },
    // {
    //   id: 6,
    //   title: "Actions",
    // },
  ];

  //  Holders api call
  const topHoldersApiCall = async () => {
    const date = new Date();
    const currentTime = date.toISOString();

    // Clone the date to avoid mutating the original
    const lastMonthDate = new Date(date);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonthTime = lastMonthDate.toISOString();
    try {
      setLoader(true);
      const holdingsResponse = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `query TopHolders($token: String, $time_ago: DateTime) {
            Solana {
              BalanceUpdates(
                orderBy: {descendingByField: "BalanceUpdate_balance_maximum"}
                where: {BalanceUpdate: {Currency: {MintAddress: {is: $token}}}, Block: {Time: {before: $time_ago}}}
                limit:{count:50}
              ) {
                BalanceUpdate {
                  Account {
                    Owner
                  }
                  balance: PostBalance(maximum: Block_Slot)
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
      const topOwners = [...new Set(holdingsResponse?.data?.data?.Solana?.BalanceUpdates?.map(item => item?.BalanceUpdate?.Account?.Owner))];
      const buySellDataResponse = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `query TopHolders($token: String, $topOwners: [String!], $from: DateTime, $to: DateTime) {
  Solana(dataset: combined) {
    DEXTradeByTokens(
      where: {
        Trade: {
          Currency: {MintAddress: {is: $token}},
          Account: {Owner: {in: $topOwners}},
        },
        Block: {
          Time: {
            after: $from,
            before: $to
          }
        }
      }
    ) {
      Trade {
        Account {
          Owner
        }
      }
      buy_volume: sum(of: Trade_Side_Amount, if: {Trade: {Side: {Type: {is: buy}}}})
      sell_volume: sum(of: Trade_Side_Amount, if: {Trade: {Side: {Type: {is: sell}}}})
      buy_volume_usd: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: buy}}}})
      sell_volume_usd: sum(of: Trade_Side_AmountInUSD, if: {Trade: {Side: {Type: {is: sell}}}})
      buy_count: count(if: {Trade: {Side: {Type: {is: buy}}}})
      sell_count: count(if: {Trade: {Side: {Type: {is: sell}}}})
    }
  }
}
`,
          variables: {
            token: tokenCA,
            topOwners,
            from: lastMonthTime,
            to: currentTime,
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
      let holdingsData = [];
      if (holdingsResponse?.data?.data?.Solana && buySellDataResponse?.data?.data?.Solana) {
        const holdingBalanceData = holdingsResponse?.data?.data?.Solana?.BalanceUpdates || [];
        const buyAndSellsData = buySellDataResponse?.data?.data?.Solana?.DEXTradeByTokens || [];

        holdingBalanceData.forEach(holdingData => {
          const owner = holdingData?.BalanceUpdate?.Account?.Owner;
          if (!owner) return;

          const buySellOwnerData = buyAndSellsData.find(buyAndSell => {
            return buyAndSell?.Trade?.Account?.Owner === owner;
          });

          if (!buySellOwnerData) return;

          const boughtAmount = Number(buySellOwnerData?.buy_count) || 0;
          const boughtInUsd = Number(buySellOwnerData?.buy_volume_usd) || 0;
          const soldAmount = Number(buySellOwnerData?.sell_count) || 0;
          const soldInUsd = Number(buySellOwnerData?.sell_volume_usd) || 0;

          const realizedPnl = soldInUsd - boughtInUsd;

          const holderData = {
              owner: owner,
              holdings: holdingData?.BalanceUpdate?.balance || 0,
              boughtAmount,
              boughtInSol: buySellOwnerData?.buy_volume || 0,
              boughtInUsd,
              soldAmount,
              soldInSol: buySellOwnerData?.sell_volume || 0,
              soldInUsd,
              realizedPnl
          };

          holdingsData.push(holderData);
        });
      }

      console.log("holdingsData", holdingsData);
      setTopHoldingData(holdingsData);
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

  useEffect(() => {
    setHoldingsData(currentTabData);
  }, [currentTabData])

  useEffect(() => {
    dispatch(fetchTradesData(tokenCA));
    if (tokenSupply === undefined) {
      setMarketCapActive(false);
    }
  }, [tokenCA]);

  useEffect(() => {
      if (tokenSupply === undefined) {
      setMarketCapActive(false);
    } else { 
      setMarketCapActive(true);
    }
  }, [tokenSupply]);

  return (
    <>
      <div
        className={`${
          latestTradesData?.latestTrades?.length > 0 ? "" : ""
        } relative bg-[#141414] md:h-auto h-svh  w-full overflow-hidden`}
      >
        {/* table header */}
        <TabNavigation
          tabList={tabList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          topHoldersApiCall={topHoldersApiCall}
          toptradersApiCall={toptradersApiCall}
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
            {activeTab === "Trades" &&
            latestTradesData?.latestTrades?.length > 0 ? (
              <div className="lg:h-[85vh] h-svh overflow-y-scroll visibleScroll">
                <table className="min-w-[100%] table-auto overflow-y-scroll">
                  <thead className="bg-[#08080E] sticky top-0">
                    <tr className="">
                      {TopTransactionHeader.map((header) => (
                        <th
                          key={header.id}
                          className="px-2 py-3 text-center text-xs font-medium text-[#A8A8A8] whitespace-nowrap leading-4"
                        > 
                        {!header?.customHeader ? 
                        <>
                         <div onClick={header?.onClick} className={`flex items-center gap-1 justify-center ${header?.onClick && "cursor-pointer"}`}>
                            <p>{header.title}</p>
                            {header?.infoTipString && (
                              <Infotip body={header?.infoTipString} />
                            )}
                            {header?.icon && header.icon}
                          </div>
                        </> 
                        : 
                        <>
                          {header?.customHeader}
                        </>
                        }
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {[...latestTradesData?.latestTrades]
                    ?.sort((a, b) => {
                      if (!a?.Block?.Time || !b?.Block?.Time) return 0;
                      const aTime = new Date(a.Block.Time).getTime();
                      const bTime = new Date(b.Block.Time).getTime();
                      return descTimeActive ? bTime - aTime : aTime - bTime;
                    })
                    .map((data, index) => {
                      const isBuy = data?.Trade?.Side?.Type == "buy";
                      let readableTotalPrice = "N/A"
                      if (data?.Trade?.Amount) {
                        const totalUsd = data?.Trade?.Amount * data?.Trade?.PriceInUSD;
                        const solPrice = solanaLivePrice === 0 ? 1 : solanaLivePrice;
                        const totalSol = totalUsd / solPrice;
                        const totalPrice = totalUsdActive ? totalUsd : totalSol;
                        readableTotalPrice = totalPrice >= 1 || totalPrice <= -1
                              ? humanReadableFormatWithNoDollar(totalPrice, 2)
                              : formatDecimal(totalPrice, 1);
                      }
                      const price = data?.Trade?.PriceInUSD
                      const supply = tokenSupply === undefined ? 1 : tokenSupply;
                      const marketCapPrice = price * supply;
                      const showPrice = marketCapActive ? marketCapPrice : price;
                      
                      let readableTime = "N/A"
                      if (data?.Block?.Time) {
                        const utcTime = data.Block.Time;
                        const localTime = convertUTCToLocalTimeString(utcTime);
                        const timeAgo = calculateTimeDifference(utcTime);
                        readableTime = ageActive ? timeAgo : localTime;
                      }
                      return (
                        <tr
                          key={index}
                          className={`capitalize bg-[#08080E] text-[#F6F6F6] font-normal text-xs leading-4 onest border-b border-[#404040]`}
                        >
                          <td className="text-center px-6 py-4">
                            {readableTime}
                          </td>
                          <td className="flex items-center justify-center">
                            <div className={`min-w-8 rounded px-3 py-1.5 text-center ${
                              isBuy? 
                                "text-[#21CB6B]"
                              : "text-[#ed1b26]"
                              }`}>
                              {data?.Trade?.Side?.Type || ""}
                            </div>
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.PriceInUSD
                              ?  showPrice >= 1 || showPrice <= -1
                                  ? "$" + humanReadableFormatWithNoDollar(showPrice, 2)
                                  : "$" + formatDecimal(showPrice, 1)
                              : "N/A"}
                          </td>
                          <td className="text-center px-6 py-4">
                            {data?.Trade?.Amount
                              ? humanReadableFormatWithOutUsd(data.Trade.Amount)
                              : "N/A"}
                          </td>
                          <td className={`text-center px-6 py-4 
                            ${isBuy? 
                              "text-[#21CB6B]"
                            : "text-[#ed1b26]"
                            }`}>
                              <div className="flex items-center justify-center gap-1">
                              {!totalUsdActive && 
                                <Image
                                  src={solana}
                                  width={15}
                                  height={15}
                                  alt="solana"
                                />
                              }
                              <p>{(totalUsdActive ? "$" : "") + readableTotalPrice}</p>
                              </div>
                          </td>
                          <td className="flex items-center justify-center px-6 py-4 text-white text-center gap-2">
                            {data?.Transaction?.Signer
                              ? `${data?.Transaction?.Signer.slice(
                                  0,
                                  3
                                )}...${data?.Transaction?.Signer.slice(
                                  -3
                                )}`
                              : "N/A"}
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
                      {TopTradersHeader.map((header, index) => (
                        <th
                          key={header.id}
                          className="py-3 text-xs font-medium text-[#A8A8A8] whitespace-nowrap leading-4"
                        >
                          <div className={`flex ${index + 1 === tableHeader.length ? 'justify-end pr-3' : 'justify-start'}`}>
                            {header.title}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {topTraderData.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-[#08080E] text-[#F6F6F6] font-normal text-xs leading-4 onest border-b border-[#404040]"
                      >
                        <td className="text-center text-[#707070] px-6 py-4 w-5">
                          {index + 1}
                        </td>
                        <td className="py-3 text-center w-fit whitespace-nowrap flex-start">
                          <div className="flex items-center justify-start gap-2">
                            <a
                              href={`https://solscan.io/account/${data?.Trade?.Account?.Owner}`}
                              target="_blank"
                            >
                              <CiShare1 className="text-[18px]" />
                            </a>
                            {data?.Trade?.Account?.Owner
                              ? `${data?.Trade?.Account?.Owner?.slice(
                                  0,
                                  6
                                )}...${data?.Trade?.Account?.Owner?.slice(
                                  -4
                                )}`
                              : "N/A"}
                          </div>
                        </td>
                         <td>
                            <div className="flex items-center justify-start gap-1">
                              <Image
                                src={solana}
                                width={15}
                                height={15}
                                alt="solana"
                              />
                            <p>0</p>
                            </div>
                        </td>
                        <td>
                            <div className="flex flex-col gap-[2px] h-full justify-start">
                              <p className="text-[#21CB6B] text-sm leading-4">
                                {data?.bought
                                  ? humanReadableFormat(data.bought)
                                  : "N/A"}
                              </p>
                              <p className="text-[#9b9999] text-[11px] leading-[14px]">{`- / 0`}</p>
                            </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-[2px] h-full justify-start">
                            <p className="text-[#ed1b26] text-sm leading-4">
                               {data?.sold ? humanReadableFormat(data.sold) : "N/A"}
                            </p>
                            <p className="text-[#9b9999] text-[11px] leading-[14px]">{`- / 0`}</p>
                          </div>
                        </td>
                        <td>
                          <span className="text-[#21CB6B] font-thin flex justify-start">
                            {"$0(0%)"}  
                          </span>
                        </td>
                        <td className="text-center py-3 pr-4">
                            {data?.volume ? (
                              <>
                                <p className="pb-2">
                                  <div className="flex items-center justify-start gap-2">
                                    {data?.volume ? (
                                      <>
                                        <p className="">
                                          {data?.volume
                                            ? humanReadableFormat(data.volumeUsd)
                                            : "N/A"}
                                        </p>
                                      </>
                                    ) : (
                                      "N/A"
                                    )}
                                    <p className="bg-[#9b99996b] rounded-md px-1 py-[2px]">
                                      {calculateHoldersPercentage(
                                        data?.volume, tokenSupply
                                      )}
                                    </p>
                                  </div>
                                </p>
                                <ProgressBar
                                  completed={Math.floor(
                                    parseFloat(
                                      calculateHoldersPercentage(
                                       data?.volume, tokenSupply
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
                        <td className="text-center">
                          <div className="flex justify-end pr-3">
                            <CiFilter className="text-[15px] text-[#cdc8cd] font-bold" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : activeTab === "Holders" &&
              topHoldingData?.length > 0 ? (
              <>
                <div className="lg:h-[85vh] h-[50vh] md:grid grid-cols-[65%_35%]">
                  <div className="overflow-y-scroll lg:h-[85vh] h-[50vh] border-r-[#4D4D4D] border border-[#4D4D4D] visibleScroll ">
                    <table className=" min-w-[100%] table-auto overflow-y-scroll visibleScroll">
                      <thead className="bg-[#08080E] sticky top-0">
                        <tr className="px-3">
                          {tableHeader.map((header, index) => (
                            <th
                              key={header.id}
                              className="py-3 text-xs font-medium text-[#A8A8A8] whitespace-nowrap leading-4"
                            >
                              <div className={`flex justify-start`}>
                                {header.title}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-transparent">
                        {topHoldingData?.map((data, index) => {
                          const usdHoldings = data?.holdings * currentUsdPrice;
                          const totalPnL = (data?.realizedPnl ?? 0);
                          const pnlPercent = data?.boughtInUsd !== 0 ? ((totalPnL / data?.boughtInUsd) * 100) : 0;
                        return (
                          <tr
                            key={index}
                            className="bg-[#08080E] text-[#F6F6F6] font-normal text-xs leading-4 onest border-b px-3 border-[#404040]"
                          >
                            <td className="text-center text-[#707070] px-6 py-4 w-5">
                              {index + 1}
                            </td>
                            <td className="py-3 text-center w-fit whitespace-nowrap flex-start">
                              <div className="flex items-center justify-start gap-2">
                                <a
                                  href={`https://solscan.io/account/${data?.owner}`}
                                  target="_blank"
                                >
                                  <CiShare1 className="text-[18px]" />
                                </a>
                                {data?.owner
                                  ? `${data?.owner?.slice(
                                      0,
                                      6
                                    )}...${data?.owner?.slice(
                                      -4
                                    )}`
                                  : "N/A"}
                              </div>
                            </td>
                            {/* <td>
                              <div className="flex items-center justify-start gap-1">
                                <Image
                                  src={solana}
                                  width={15}
                                  height={15}
                                  alt="solana"
                                />
                                <p>0</p>
                              </div>
                            </td> */}
                            {/* Bought */}
                            <td>
                              <div className="flex flex-col gap-[2px] h-full justify-start">
                                <p className="text-[#21CB6B] text-sm leading-4">{formatNumber(data?.boughtInUsd || 0, false, true)}</p>
                                <p className="text-[#9b9999] text-[11px] leading-[14px]">{`${data?.boughtAmount}`}</p>
                              </div>
                            </td>
                            {/* Sold */}
                            <td>
                              <div className="flex flex-col gap-[2px] h-full justify-start">
                                <p className="text-[#ed1b26] text-sm leading-4">{formatNumber(data?.soldInUsd || 0, false, true)}</p>
                                <p className="text-[#9b9999] text-[11px] leading-[14px]">{`${data?.soldAmount}`}</p>
                              </div>
                            </td>
                            {/* PnL */}
                            <td>
                              <div className="flex flex-col gap-[2px] h-full justify-start">
                                <p className={`${totalPnL >= 0 ? 'text-[#21CB6B]' : 'text-[#ed1b26]'} text-sm leading-4`}>{formatNumber(totalPnL, false, true)}</p>
                                <p className="text-[#9b9999] text-[11px] leading-[14px]">{`${formatNumber(pnlPercent, true, false) || 0}%`}</p>
                              </div>
                            </td>
                            <td className="text-center py-3 pr-4">
                                {tokenSupply ? (
                                  <>
                                    <p className="pb-2">
                                      <div className="flex items-center justify-start gap-2">
                                        {currentUsdPrice ? (
                                          <>
                                            <p className="">
                                              {humanReadableFormat(
                                                usdHoldings
                                              )}
                                            </p>
                                          </>
                                        ) : (
                                          "N/A"
                                        )}
                                        <p className="bg-[#9b99996b] rounded-md px-1 py-[2px]">
                                          {calculateHoldersPercentage(
                                            data?.holdings,
                                              tokenSupply
                                          )}
                                        </p>
                                      </div>
                                    </p>
                                    <ProgressBar
                                      completed={Math.floor(
                                        parseFloat(
                                          calculateHoldersPercentage(
                                             data?.holdings,
                                              tokenSupply
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
                            {/* <td className="text-center">
                              <div className="flex justify-end pr-3">
                                <CiFilter className="text-[15px] text-[#cdc8cd] font-bold" />
                              </div>
                            </td> */}
                          </tr>
                        )})}
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
                          top49Percentage={top25Percentage}
                          top100Percentage={top50Percentage}
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
                              {top25Percentage}%
                            </span>{" "}
                          </p>
                          <span className="h-2 w-2 ml-1 mt-1 bg-[#facc15]"></span>
                          <p className="text-[#8D93B7] mr-4">
                            Other{" "}
                            <span className="text-white">
                              {top50Percentage}%
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === "Positions" && holdingsData?.length > 0 ? (
              <div className="lg:h-[85vh] h-[50vh] visibleScroll overflow-y-scroll">
                <table className="min-w-full table-auto ">
                  <thead className="bg-[#08080E] sticky top-0">
                    <tr className="">
                      {tableHeaderHolding.map((header) => (
                        <th
                          key={header.id}
                          className={`${header.id === 6 && 'flex justify-end'} px-6 py-3 text-left text-xs font-medium text-[#A8A8A8] leading-4 whitespace-nowrap`}
                        >
                          {header.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-transparent">
                    {holdingsData.map((data, index) => {
                        const usdBought = data?.totalBoughtQty * data?.averageBuyPrice;
                        const usdSold = data?.quantitySold * data?.averageHistoricalSellPrice;
                        const usdHoldings = data?.activeQtyHeld * data?.current_price;
                        const totalPnL = (data?.realizedProfit ?? 0) + usdHoldings - usdBought;
                        const pnlPercent = usdBought !== 0 ? ((totalPnL / usdBought) * 100) : 0;
                      return (
                      <tr
                        key={index}
                        className={`capitalize bg-[#08080E] text-[#F6F6F6] border-[#404040] font-medium text-xs whitespace-nowrap leading-4 border-b onest`}
                      >
                        {/* Token */}
                        <td className="px-6 py-4 flex">
                          <a 
                            href={`/tradingview/solana?tokenaddress=${data?.token}&symbol=${data?.symbol}`}
                            className="group/name hover:opacity-80 flex flex-col sm:flex-row items-start text-xs leading-4 font-semibold h-full justify-start"
                          >
                            <div className="flex items-center">
                              <div className="w-7 h-7 flex-shrink-0 group-hover/image:opacity-80 relative rounded-[4px]">
                              {data?.img ? 
                                <Image 
                                  src={data?.img}
                                  alt={data?.symbol}
                                  width={28}
                                  height={28}
                                  className="w-full h-full object-cover rounded-[4px]"
                                />
                              :
                              <h1 className="absolute inset-0 m-auto w-[28px] h-[28px] rounded-sm text-[12px] border-[1px] border-[#26262e] bg-[#191919] flex items-center justify-center">
                                {data?.symbol?.toString()?.slice(0, 1)}
                              </h1>
                              } 
                              </div>
                              <span className="pl-2 group-hover/name:underline">{data?.symbol}</span>
                            </div>
                          </a>
                        </td>
                        {/* Bought */}
                        <td className="px-6 py-4 items-start">
                          <div className="flex flex-col gap-[2px] h-full justify-center">
                            <p className="text-[#21CB6B] text-sm leading-4">{`${formatNumber(usdBought)}`}</p>
                            <p className="text-[#9b9999] text-[11px] leading-[14px]">{`${formatNumber(data?.totalBoughtQty, false, false)} ${data?.symbol}`}</p>
                          </div>
                        </td>
                        {/* Sold */}
                        <td className="px-6 py-4 items-start">
                          <div className="flex flex-col gap-[2px] h-full justify-center">
                            <p className="text-[#ed1b26] text-sm leading-4">{`${formatNumber(usdSold)}`}</p>
                            <p className="text-[#9b9999] text-[11px] leading-[14px]">{`${formatNumber(data?.quantitySold, false, false)} ${data?.symbol}`}</p>
                          </div>
                        </td>
                        {/* Remaining */}
                        <td className="px-6 py-4 items-start">
                          <div className="flex flex-col gap-[2px] h-full justify-center">
                            <p className="text-sm leading-4">{`${formatNumber(usdHoldings)}`}</p>
                            <p className="text-[#9b9999] text-[11px] leading-[14px]">{`${formatNumber(data?.activeQtyHeld, false, false)} ${data?.symbol}`}</p>
                          </div>
                        </td>
                        {/* PnL */}
                        <td className="px-6 py-4 items-center">
                          <span className={`${totalPnL >= 0 ? "text-[#21CB6B]" : "text-[#ed1b26]"} 
                            font-thin`}
                          >
                            {`${formatNumber(totalPnL)}(${formatNumber(pnlPercent, true, false)}%)`}  
                          </span>
                        </td>
                        {/* Actions */}
                        {/* <td className="whitespace-nowrap px-6 py-4 text-xs font-medium">
                          <div className="flex justify-end items-center h-full w-full">
                            <button className="text-[#ed1b26] hover:text-[#bd3c42] font-bold transition-all duration-200 ease-in-out">
                              {"Sell"}
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <div className="flex w-full flex-col items-center justify-center lg:h-[20vh] h-[80vh] rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    {/* <div
                      className={`text-4xl ${loader ? "animate-bounce" : ""}`}
                    >
                      <Image
                        src="/assets/NoDataImages/qwe.svg"
                        alt="No Data Available"
                        width={100}
                        height={50}
                        className="rounded-lg"
                      />
                    </div> */}
                    <p className="mt-2 text-[15px] text-[#b5b7da] font-bold">
                      {loader ? (
                        "Loading data..."
                      ) : activeTab === "Positions" ? (
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
