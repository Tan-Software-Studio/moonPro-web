"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import img from "../../../public/assets/Profile/Image.png";
import { IoMdDoneAll, IoMdSettings } from "react-icons/io";
import { BiSolidCopy } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { BiSolidEditAlt } from "react-icons/bi";
import { BiX } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import ProgressBar from "@ramonak/react-progress-bar";
import Infotip from "@/components/common/Tooltip/Infotip.jsx"
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx"

const Profile = () => {

  const { address } = useAppKitAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const truncatedInputValue = inputValue.length > 10 ? inputValue.slice(0, 10) + "..." : inputValue;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(`Recent PnL`);
  const border = useSelector((state) => state?.AllthemeColorData?.borderColor);

  const truncatedAddress = useMemo(() => {
    return address ? `${address.slice(0, 5)}...${address.slice(-3)}` : "Please wait...";
  }, [address]);

  const [saveStatus, setSaveStatus] = useState("")
  const [savedWalletMark, setSavedWalletMark] = useState("")
  const [displayValue, setDisplayValue] = useState(truncatedAddress || "Please wait...");

  const tableHeader = [
    { id: 1, title: "Token/Last Active", infoTipString: "The specific token held and the last time it was actively traded or interacted with by the wallet." },
    { id: 2, title: "Unrealized", infoTipString: "Current profit or loss from tokens that are still held and not yet sold." },
    { id: 3, title: "30D Realized Profit", infoTipString: "Net profit or loss from tokens sold in the past 30 days. Realized means the position was closed." },
    { id: 4, title: "Total Profit", infoTipString: "Net profit or loss from tokens sold in the past 30 days. Realized means the position was closed." },
    { id: 5, title: "Balance USD" },
    { id: 6, title: "Position %", infoTipString: "The percentage of the wallet’s total portfolio value allocated to a specific token." },
    { id: 7, title: "Bought/Avg" },
    { id: 8, title: "Sold/Avg" },
    { id: 9, title: "30D TXs", infoTipString: "The number of times this token was bought or sold in the past 30 days." },
    // { id: 10, title: "" },
  ];

  const tableHeaderActivity = [
    { id: 1, title: "Type" },
    { id: 2, title: "Token" },
    { id: 3, title: "Total USD" },
    { id: 4, title: "Amount" },
    { id: 5, title: "Price" },
    { id: 6, title: "Profit" },
    { id: 7, title: "Age" },
    // { id: 8, title: "" },
  ];

  // ---------------------- static data start------------------
  const tableData = [
    // {
    //   id: 1,
    //   token: "ETH",
    //   unrealized: "$1,200",
    //   realizedProfit: "$300",
    //   totalProfit: "$1,500",
    //   balanceUSD: "$5,000",
    //   position: "25%",
    //   boughtAvg: "$1,800",
    //   soldAvg: "$2,000",
    //   txs: 15,
    // },
    // {
    //   id: 2,
    //   token: "BTC",
    //   unrealized: "$2,500",
    //   realizedProfit: "$500",
    //   totalProfit: "$3,000",
    //   balanceUSD: "$10,000",
    //   position: "50%",
    //   boughtAvg: "$45,000",
    //   soldAvg: "$48,000",
    //   txs: 10,
    // },
    // {
    //   id: 3,
    //   token: "ADA",
    //   unrealized: "$900",
    //   realizedProfit: "$200",
    //   totalProfit: "$1,100",
    //   balanceUSD: "$2,500",
    //   position: "20%",
    //   boughtAvg: "$1.10",
    //   soldAvg: "$1.30",
    //   txs: 20,
    // },
    // {
    //   id: 4,
    //   token: "SOL",
    //   unrealized: "$1,800",
    //   realizedProfit: "$400",
    //   totalProfit: "$2,200",
    //   balanceUSD: "$7,000",
    //   position: "30%",
    //   boughtAvg: "$50",
    //   soldAvg: "$55",
    //   txs: 25,
    // },
    // {
    //   id: 5,
    //   token: "BNB",
    //   unrealized: "$700",
    //   realizedProfit: "$100",
    //   totalProfit: "$800",
    //   balanceUSD: "$3,000",
    //   position: "10%",
    //   boughtAvg: "$290",
    //   soldAvg: "$300",
    //   txs: 5,
    // },
    // {
    //   id: 6,
    //   token: "XRP",
    //   unrealized: "$1,100",
    //   realizedProfit: "$300",
    //   totalProfit: "$1,400",
    //   balanceUSD: "$4,500",
    //   position: "18%",
    //   boughtAvg: "$0.90",
    //   soldAvg: "$1.00",
    //   txs: 8,
    // },
    // {
    //   id: 7,
    //   token: "DOT",
    //   unrealized: "$800",
    //   realizedProfit: "$200",
    //   totalProfit: "$1,000",
    //   balanceUSD: "$2,800",
    //   position: "12%",
    //   boughtAvg: "$6",
    //   soldAvg: "$6.50",
    //   txs: 18,
    // },
    // {
    //   id: 8,
    //   token: "DOGE",
    //   unrealized: "$500",
    //   realizedProfit: "$100",
    //   totalProfit: "$600",
    //   balanceUSD: "$1,500",
    //   position: "5%",
    //   boughtAvg: "$0.07",
    //   soldAvg: "$0.08",
    //   txs: 30,
    // },
    // {
    //   id: 9,
    //   token: "MATIC",
    //   unrealized: "$1,300",
    //   realizedProfit: "$400",
    //   totalProfit: "$1,700",
    //   balanceUSD: "$6,000",
    //   position: "20%",
    //   boughtAvg: "$0.90",
    //   soldAvg: "$1.10",
    //   txs: 15,
    // },
    // {
    //   id: 10,
    //   token: "LTC",
    //   unrealized: "$2,000",
    //   realizedProfit: "$500",
    //   totalProfit: "$2,500",
    //   balanceUSD: "$8,000",
    //   position: "35%",
    //   boughtAvg: "$75",
    //   soldAvg: "$80",
    //   txs: 12,
    // },
  ];


  const activityData = [
    // {
    //   id: 1,
    //   type: "Buy",
    //   token: "ETH",
    //   totalUSD: "$1,200",
    //   amount: "0.5 ETH",
    //   price: "$2,400",
    //   profit: "$200",
    //   age: "2 days",
    // },
    // {
    //   id: 2,
    //   type: "Sell",
    //   token: "BTC",
    //   totalUSD: "$4,500",
    //   amount: "0.1 BTC",
    //   price: "$45,000",
    //   profit: "$500",
    //   age: "1 week",
    // },
    // {
    //   id: 3,
    //   type: "Buy",
    //   token: "ADA",
    //   totalUSD: "$1,000",
    //   amount: "1,000 ADA",
    //   price: "$1",
    //   profit: "$100",
    //   age: "5 days",
    // },
    // {
    //   id: 4,
    //   type: "Sell",
    //   token: "SOL",
    //   totalUSD: "$2,000",
    //   amount: "40 SOL",
    //   price: "$50",
    //   profit: "$400",
    //   age: "3 days",
    // },
    // {
    //   id: 5,
    //   type: "Buy",
    //   token: "BNB",
    //   totalUSD: "$1,500",
    //   amount: "5 BNB",
    //   price: "$300",
    //   profit: "$200",
    //   age: "6 days",
    // },
    // {
    //   id: 6,
    //   type: "Sell",
    //   token: "XRP",
    //   totalUSD: "$1,200",
    //   amount: "1,200 XRP",
    //   price: "$1",
    //   profit: "$300",
    //   age: "1 week",
    // },
    // {
    //   id: 7,
    //   type: "Buy",
    //   token: "DOT",
    //   totalUSD: "$800",
    //   amount: "100 DOT",
    //   price: "$8",
    //   profit: "$150",
    //   age: "4 days",
    // },
    // {
    //   id: 8,
    //   type: "Sell",
    //   token: "DOGE",
    //   totalUSD: "$600",
    //   amount: "10,000 DOGE",
    //   price: "$0.06",
    //   profit: "$100",
    //   age: "2 weeks",
    // },
    // {
    //   id: 9,
    //   type: "Buy",
    //   token: "MATIC",
    //   totalUSD: "$1,400",
    //   amount: "1,400 MATIC",
    //   price: "$1",
    //   profit: "$300",
    //   age: "3 days",
    // },
    // {
    //   id: 10,
    //   type: "Sell",
    //   token: "LTC",
    //   totalUSD: "$3,000",
    //   amount: "40 LTC",
    //   price: "$75",
    //   profit: "$500",
    //   age: "5 days",
    // },
  ];
  // ------------------ stetic data End-----------------------------


  const [copied, setCopied] = useState(false);

  const copyAddress = (address) => {
    navigator?.clipboard?.writeText(address);
    setCopied(address);
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setDisplayValue(inputValue || truncatedAddress);
    setSavedWalletMark(inputValue || truncatedAddress)
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (false) { // muje es ki abhi koi jrurat nahi hai
      setInputValue(savedWalletMark || "");
    }
  };

  const handleSaveClick = () => {
    setDisplayValue(inputValue || truncatedAddress);
    setIsEditing(false);
    setSavedWalletMark(inputValue || truncatedAddress)
    localStorage.setItem("wallet_mark", inputValue)
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSaveClick();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  ;




  useEffect(() => {
    setDisplayValue(truncatedAddress);

    const walletName = localStorage.getItem("wallet_mark");
    if (walletName) {
      setSavedWalletMark(walletName)
      setInputValue(walletName || "");
    }



    const status = localStorage.getItem("@appkit/connection_status")
    setSaveStatus(status)

    if (status !== "connected") {
      router.push("/");
    } else {
      router.push('/profile')
    }

  }, [address, truncatedAddress]);


  return (
    <>
      <div className={`xl:mt-8 mx-8 mb-2 overflow-y-scroll h-[90vh]`}>
        <div className="lg:flex justify-between items-center">
          <div className="flex items-center lg:mb-0 mb-4 h-28">
            <span
              className={` bg-black rounded-full object-cover border ${border} `}
            >
              <div className={`w-14 h-14  rounded-full border p-3 ${border}`}>

                <Image src={img} alt="Profile Image" className={``} />
              </div>
            </span>
            <div className="flex flex-col ml-4 mt-1">
              <div className="flex items-center ">
                <div className="flex items-center">
                  {!isEditing ? (
                    <>
                      <p className={`${inputValue == null || inputValue == "" || inputValue == undefined ? "text-[#f6e8f1]" : "text-[#6cc4f4]"} text-[16px] font-medium tracking-wider`}>
                        {savedWalletMark == "" || savedWalletMark == undefined ? displayValue : truncatedInputValue || savedWalletMark}
                      </p>
                      <BiSolidEditAlt
                        size={20}
                        className="ml-2 text-[#6B6B6D] cursor-pointer"
                        onClick={handleEditClick}
                      />
                    </>
                  ) : (
                    <div className="flex items-center border border-white p-1 rounded-md">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder=""
                        className="text-[#f6e8f1] text-[16px] font-medium tracking-wider bg-transparent outline-none px-2 w-28 mr-2"
                        autoFocus
                        onKeyDown={handleKeyDown}
                      />
                      <div className="flex gap-2 items-center justify-center">
                        <div className=" bg-[#393c43] rounded-md">

                          <BiX
                            size={25}
                            className="text-[#fafafa] cursor-pointer"
                            onClick={handleCancelClick}
                          />
                        </div>
                        <div className="bg-[#393c43] rounded-md">

                          <IoMdCheckmark
                            size={23}
                            className="text-[#fafafa] cursor-pointer"
                            onClick={handleSaveClick}
                          />
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center mt-3">
                <p className="text-xs font-normal text-[#f6e8f1] sm:truncate md:hidden block ">
                  {truncatedAddress && truncatedAddress}
                </p>
                <p className="text-xs tracking-wider font-normal text-[#82847f] sm:truncate md:block hidden">
                  {address}
                </p>
                <span
                  className={`${address ? `block` : `hidden`}`}
                  onClick={() => copyAddress(address)}
                >
                  {copied ? (
                    <IoMdDoneAll
                      size={14}
                      className="text-[#3f756d] cursor-pointer ml-2"
                    />
                  ) : (
                    <BiSolidCopy
                      size={14}
                      className="ml-2 text-[#6B6B6D] cursor-pointer"
                    />
                  )}
                </span>

              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              className="text-xs text-black font-normal py-2 px-6 rounded-3xl bg-[#6cc4f4] hover:bg-[#43b9f8]"
              aria-label="Follow"
            >
              Follow
            </button>
            <button
              className="text-xs text-black font-normal py-2 px-6 rounded-3xl bg-[#6cc4f4] hover:bg-[#43b9f8]"
              aria-label="Share"
            >
              Share
            </button>
          </div>
        </div>
        <div className={`grid lg:grid-cols-3 gap-2 mt-8`}>
          <div className={`border ${border} px-4 py-4 `}>
            <div className={`border-b ${border} flex justify-between pb-2`}>
              <div className={``}>
                <div className="flex items-center gap-1"> 
                  <p className={`text-[#8D93B7] text-base font-medium`}>
                    Last 7D PnL
                  </p>
                  <Infotip iconSize={20} body={"The total profit or loss (in % and USD) generated by the wallet over the past 7 days from all trading activities."} />
                </div>
                <p className={`text-white text-4xl font-semibold mt-1`}>{"0%"}</p>
              </div>
              <div>
                <p className={`text-[#8D93B7] text-base font-medium`}>
                  Win Rate
                </p>
                <p className={`text-white text-4xl font-semibold mt-1`}>{"--%"}</p>
              </div>
            </div>
            <div className={`mt-3 border-b ${border} pb-4`}>
              <p className={`text-[#8D93B7] text-xs font-normal`}>{"USD"}</p>
              <p className={`text-white text-xs font-normal mt-2`}>{"$0.00000"}</p>
            </div>{" "}
            <div className={`mt-3 `}>
              <div className="flex items-center gap-1">
                <p className={`text-[#8D93B7] text-xs font-normal`}>{"Liquidity"}</p>
                <Infotip body={"The total value of tokens currently provided as liquidity in DeFi pools by the wallet."}/>
              </div>
              <p className={`text-white text-xs font-normal mt-2`}>{"$0.00000"}</p>
            </div>{" "}
          </div>
          <div className={`border ${border} border ${border} px-4 py-4`}>
            <div className={`flex items-center justify-between pb-5`}>
              <div className="flex items-center gap-1">
                <p className={`text-[#8D93B7] text-base font-medium`}>{"PnL"}</p>
                <Infotip iconSize={20} body={"Summary of your trading performance including profits, costs, and balance metrics."}/>
              </div>
              <div className="flex items-center gap-1">
                <p className={`text-white text-base font-medium `}>
                  {"7D TXs"}
                  <span className="text-[#8D93B7]"> {"0/0"}</span>
                </p>
                <Infotip iconSize={20} body={"The number of token transactions (buys/sells) the wallet executed in the past 7 days."}/>
              </div>
            </div>
            <div className={`space-y-3`}>
              <div className="flex justify-between items-center">
                <p className={`text-[#8D93B7] text-xs font-normal`}>{"Win Rate"}</p>
                <p className={`text-white text-xs font-normal `}>
                  <span className="text-[#F0488B]">{"$0 (--)"} </span>
                </p>
              </div>
              <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <p className={`text-[#8D93B7] text-xs font-normal`}>
                  {" Unrealized Profits"}
                </p>
                <Infotip body={"Estimated gains or losses from tokens still held, based on their current market price and acquisition cost."}/>
              </div>
                <p className={`text-white text-xs font-normal `}>
                  <span className="text-[#F0488B]">{"$0"}</span>
                </p>
              </div>
              <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <p className={`text-[#8D93B7] text-xs font-normal`}>
                  {"7D Total Cost"}
                </p>
                <Infotip body={"The total amount spent on buying tokens in the past 7 days."}/>
              </div>
                <p className={`text-white text-xs font-normal `}>{"$0"}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <p className={`text-[#8D93B7] text-xs font-normal`}>
                    {"7D Token Avg Cost"}
                  </p>
                  <Infotip body={"The average purchase price of tokens acquired within the last 7 days."}/>
                </div>
                <p className={`text-white text-xs font-normal `}>{"$0"}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <p className={`text-[#8D93B7] text-xs font-normal`}>
                    {"7D Token Avg Realized Profits"}
                  </p>
                  <Infotip body={"The average profit or loss made per token that was sold in the past 7 days."}/>
                </div>
                <p className={`text-white text-xs font-normal `}>
                  {" "}
                  <span className="text-[#F0488B]">{"$0"}</span>
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[#8D93B7] text-xs font-normal`}>
                  {"SOL Balance"}
                </p>
                <p className={`text-white text-xs font-normal `}>{"0 SOL ($0)"}</p>
              </div>
            </div>
          </div>
          <div className={`border ${border} border ${border} px-4 py-4`}>
            <div className={`flex items-center justify-between pb-5`}>
              <div className="flex items-center gap-1">
                <p className={`text-[#8D93B7] text-base font-medium`}>
                  {"Distribution (0)"}
                </p>
                <Infotip iconSize={20} body={"Breakdown of positions by profit/loss percentages. Helps visualize how many holdings fall into profit/loss ranges."} />
              </div>
            </div>
            <div className={`space-y-3`}>
              <div className="flex justify-between items-center">
                <p className={`text-[#8D93B7] text-xs font-normal`}>{">"}{"500%"}</p>
                <p className={`text-white text-xs font-normal `}>{"0"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[#8D93B7] text-xs font-normal`}>
                  {"200% ~ 500%"}
                </p>
                <p className={`text-white text-xs font-normal `}>{"0"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[#8D93B7] text-xs font-normal`}>
                  {"0% ~ 200%"}
                </p>
                <p className={`text-white text-xs font-normal `}>{"0"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[#8D93B7] text-xs font-normal`}>{"0% ~ 50%"}</p>
                <p className={`text-white text-xs font-normal `}>{"0"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-[#8D93B7] text-xs font-normal`}>
                  {"< -50%"}
                </p>
                <p className={`text-white text-xs font-normal `}>{"0"}</p>
              </div>
              <div className={``}>
                <ProgressBar
                  // completed={Math.floor(
                  //   chartTokenData?.bondingCurveProgress ?? 0
                  // )}
                  completed={50}
                  maxCompleted={100}
                  transitionDuration="2s"
                  transitionTimingFunction="ease-in-out"
                  baseBgColor="#3a415a"
                  bgColor="#6cc4f4"
                  height="7px"
                  // width="full"
                  borderRadius="10px"
                  animateOnRender={true}
                  labelClassName="label-bar"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`flex md:gap-8 gap-5 text-[#636363] text-xs font-normal md:text-sm border-b ${border} mt-4 `} >
          {["Recent PnL", "Holdings", "Activity"].map((tab) => (
            <p
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer ${activeTab === tab && tab === "Approve"
                ? `border-b pb-8 md:pb-4 text-[#A5A5A7]`
                : ``
                } ${activeTab === tab ? `border-b pb-4 text-[#A5A5A7]` : ``}`}
            >
              {tab}
            </p>
          ))}
        </div>

        {/* <div className="overflow-x-auto w-full  lg:block hidden">
          <table className="min-w-full">
            <thead>
              <tr>
                {(activeTab === "Recent PnL" || activeTab === "Holdings"
                  ? tableHeader
                  : tableHeaderActivity
                ).map((header) => (
                  <th
                    key={header.id}
                    className={`text-[#84858E] py-3 px-6 font-normal text-xs border-b ${border}`}
                  >
                    {header.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <p
            className={`text-[#84858E] text-xs font-normal items-center text-center mt-24`}
          >
            No buying or selling in the last 30 days
          </p>
        </div> */}
        <div className={`overflow-x-auto w-full bg-[#101018] rounded-lg shadow-md  
  ${((activeTab === "Recent PnL" || activeTab === "Holdings") && tableData.length === 0) ||
            (activeTab !== "Recent PnL" && activeTab !== "Holdings" && activityData.length === 0)
            ? "h-[30vh] overflow-hidden"
            : "h-[90vh] overflow-y-scroll"}`}>
          <table className="min-w-full text-left text-sm text-gray-400 ">
            <thead className="bg-[#101018] text-gray-300 sticky top-0">
              <tr>
                {(
                  activeTab === "Recent PnL" || activeTab === "Holdings"
                    ? tableHeader
                    : tableHeaderActivity
                ).map((header) => (
                  <th
                    key={header.id}
                    className="py-4 px-6 font-medium text-xs border-b border-gray-700"
                  >
                    <div className="flex items-center gap-1">
                      <p>{header.title}</p>
                      {header?.infoTipString &&
                        <Infotip body={header.infoTipString}/>
                      }
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(activeTab === "Recent PnL" || activeTab === "Holdings"
                ? tableData
                : activityData
              ).map((row, index) => (
                <tr
                  key={row.id}
                  className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-gray-600 transition-colors duration-200`}
                >
                  {activeTab === "Recent PnL" || activeTab === "Holdings" ? (
                    <>
                      <td className="py-3 px-6 border-b border-gray-700">{row.token}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.unrealized}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.realizedProfit}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.totalProfit}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.balanceUSD}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.position}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.boughtAvg}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.soldAvg}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.txs}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-6 border-b border-gray-700">{row.type}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.token}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.totalUSD}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.amount}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.price}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.profit}</td>
                      <td className="py-3 px-6 border-b border-gray-700">{row.age}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Agar tableData aur activityData dono empty hain tabhi ye message dikhega */}
          {((activeTab === "Recent PnL" || activeTab === "Holdings") && tableData.length === 0) ||
            (activeTab !== "Recent PnL" && activeTab !== "Holdings" && activityData.length === 0) ? (
            <p className="text-gray-500 text-xs font-normal text-center mt-6 flex justify-center items-center h-full">
              No buying or selling in the last 30 days
            </p>
          ) : null}
        </div>

      </div>
    </>
  );
};

export default Profile;