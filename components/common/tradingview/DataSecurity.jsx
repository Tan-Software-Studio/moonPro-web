"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import axios from "axios";

function DataSecurity({
  tokenCA,
  pairAddress,
  tokenSymbol,
  tragindViewPage,
  activeTab,
  dataAndSecurity,
  dataLoaderForChart,
  tokenSupply
}) {
  const [isDataSecurity, setIsDataSecurity] = useState(true);
  const [top10holdersPercetnage, setTop10holdersPercetnage] = useState(null);
  const [totalBalance, setTotalBalance] = useState(-1);

  useEffect(() => {
    const init = async () => {
      await topHoldersApiCall();
    };
    init();
  }, []);

  useEffect(() => {
    if (tokenSupply !== undefined && totalBalance !== -1) {
      const top10percentage = ((totalBalance / tokenSupply) * 100).toFixed(2);
      setTop10holdersPercetnage(top10percentage);
    }
  }, [tokenSupply, totalBalance]);

    const topHoldersApiCall = async () => {
      const date = await new Date();
      const currentTime = await date.toISOString();
      try {
        const response = await axios.post(
          "https://streaming.bitquery.io/eap",
          {
            query: `query TopHolders($token: String, $time_ago: DateTime) {
    Solana {
      BalanceUpdates(
        orderBy: {descendingByField: "BalanceUpdate_balance_maximum"}
        where: {BalanceUpdate: {Currency: {MintAddress: {is: $token}}}, Block: {Time: {before: $time_ago}}}
        limit:{count:11}
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
      const pairAddresss = localStorage?.getItem("currentPairAddress");
      const balances = response?.data?.data?.Solana?.BalanceUpdates
        .filter((item) => item?.BalanceUpdate?.Account?.Owner !== pairAddresss)
        .map((item) => Number(item?.BalanceUpdate?.balance))
        .sort((a, b) => b - a)
        .slice(0, 10); // Limit to top 10 balances
      // console.log("balances", balances);
      const sumBalance = balances.reduce((sum, balance) => sum + balance, 0);
      setTotalBalance(sumBalance);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message || error);
      }
    };
  return (
    <div className="bg-[#08080E] select-none flex flex-col h-fit w-full text-white">
      <div
        className="flex px-[16px] py-[10px] items-center justify-between cursor-pointer bg-[#1F1F1F]"
        onClick={() => setIsDataSecurity(!isDataSecurity)}
      >
        <h1 className="text-white text-[16px] font-medium">
          {tragindViewPage?.data}
        </h1>
        <MdOutlineKeyboardArrowRight
          className={`ease-in-out duration-300 text-[19px] ${
            isDataSecurity && "rotate-90"
          }`}
        />
      </div>
      <div
        className={`grid ease-in-out duration-300 origin-top text-white text-[12px] ${
          isDataSecurity
            ? "max-h-[1000px] opacity-100 scale-y-100 border-t-[1px] border-[#4D4D4D]"
            : "max-h-0 opacity-0 scale-y-0"
        }`}
      >
        <div className="2xl:p-6 p-4">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 bg-[#21cb6b38] border-[#21CB6B] rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`#21CB6B`}
                  class="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-[#A8A8A8] text-[12px] font-[500]">
                Mint Authority
              </p>
              <Infotip body={tragindViewPage?.minttool} />
            </div>
            <p className="text-[#F6F6F6] text-[12px] font-[500]">
              {dataLoaderForChart ? "------" : dataAndSecurity?.[0]?.value}
            </p>
          </div>{" "}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 bg-[#21cb6b38] border-[#21CB6B] rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`#21CB6B`}
                  class="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-[#A8A8A8] text-[12px] font-[500]">
                Freeze Authority
              </p>
              <Infotip body={tragindViewPage?.freezetool} />
            </div>
            <p className="text-[#F6F6F6] text-[12px] font-[500]">
              {" "}
              {dataLoaderForChart ? "------" : dataAndSecurity?.[1]?.value}
            </p>
          </div>{" "}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 bg-[#21cb6b38] border-[#21CB6B] rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`#21CB6B`}
                  class="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-[#A8A8A8] text-[12px] font-[500]">LP Burned</p>
              <Infotip body={tragindViewPage?.lptool} />
            </div>
            <p className="text-[#F6F6F6] text-[12px] font-[500]">
              {" "}
              {dataLoaderForChart ? "------" : dataAndSecurity?.[2]?.value}
            </p>
          </div>{" "}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 rounded-full flex items-center justify-center
                  ${top10holdersPercetnage >= 15 ? 
                  "bg-[#ed1b2642] border-[#ED1B247A]" : 
                  "bg-[#21cb6b38] border-[#21CB6B]"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`${top10holdersPercetnage >= 15 ? "#ED1B247A" : "#21CB6B"}`}
                  class="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={top10holdersPercetnage < 15 ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} 
                  />
                </svg>
              </div>
              <p className="text-[#A8A8A8] text-[12px] font-[500]">
                Top 10 Holders
              </p>
              <Infotip body={tragindViewPage?.top10tool} />
            </div>
              <p className={`text-[#F6F6F6] text-[12px] font-[500]`}>              
              {" "}
              {top10holdersPercetnage !== null ? top10holdersPercetnage + "%" : "------"}
            </p>
          </div>{" "}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 bg-[#21cb6b38] border-[#21CB6B] rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`#21CB6B`}
                  class="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-[#A8A8A8] text-[12px] font-[500]">
                {`Pooled ${tokenSymbol}`}
              </p>
              <Infotip body={tragindViewPage?.pooled1} />
            </div>
            <p className="text-[#F6F6F6] text-[12px] font-[500]">
              {dataLoaderForChart ? "------" : dataAndSecurity?.[4]?.value}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 bg-[#21cb6b38] border-[#21CB6B] rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`#21CB6B`}
                  class="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-[#A8A8A8] text-[12px] font-[500]">
                Pooled SOL
              </p>
              <Infotip body={tragindViewPage?.pooled2} />
            </div>
            <p className="text-[#F6F6F6] text-[12px] font-[500]">
              {dataLoaderForChart ? "------" : dataAndSecurity?.[5]?.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataSecurity;
