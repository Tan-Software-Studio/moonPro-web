"use client";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";

function DataSecurity({
  tragindViewPage,
  activeTab,
  dataAndSecurity,
  dataLoaderForChart,
}) {
  const [isDataSecurity, setIsDataSecurity] = useState(true);
  return (
    <div className="bg-[#08080E] select-none flex flex-col h-fit w-full text-white">
      <div
        className="flex px-[16px] py-[10px] items-center justify-between cursor-pointer bg-[#1F1F1F]"
        onClick={() => setIsDataSecurity(!isDataSecurity)}
      >
        <h1 className="text-white text-[16px] font-medium">{ tragindViewPage?.data}</h1>
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
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 ${
                  activeTab == "buy"
                    ? "bg-[#21cb6b38] border-[#21CB6B]"
                    : "bg-[#ed1b2642] border-[#ED1B247A]"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`${activeTab == "buy" ? "#21CB6B" : "#ED1B247A"}`}
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
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 ${
                  activeTab == "buy"
                    ? "bg-[#21cb6b38] border-[#21CB6B]"
                    : "bg-[#ed1b2642] border-[#ED1B247A]"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`${activeTab == "buy" ? "#21CB6B" : "#ED1B247A"}`}
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
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 ${
                  activeTab == "buy"
                    ? "bg-[#21cb6b38] border-[#21CB6B]"
                    : "bg-[#ed1b2642] border-[#ED1B247A]"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`${activeTab == "buy" ? "#21CB6B" : "#ED1B247A"}`}
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
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 ${
                  activeTab == "buy"
                    ? "bg-[#21cb6b38] border-[#21CB6B]"
                    : "bg-[#ed1b2642] border-[#ED1B247A]"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`${activeTab == "buy" ? "#21CB6B" : "#ED1B247A"}`}
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
                Top 10 Holders
              </p>
              <Infotip body={tragindViewPage?.top10tool} />
            </div>
            <p className="text-[#F6F6F6] text-[12px] font-[500]">
              {" "}
              {dataLoaderForChart ? "------" : dataAndSecurity?.[3]?.value}
            </p>
          </div>{" "}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 ${
                  activeTab == "buy"
                    ? "bg-[#21cb6b38] border-[#21CB6B]"
                    : "bg-[#ed1b2642] border-[#ED1B247A]"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`${activeTab == "buy" ? "#21CB6B" : "#ED1B247A"}`}
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
                Pooled CLOAK
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
                className={`w-4 h-4 border-[1px] ease-in-out duration-200 ${
                  activeTab == "buy"
                    ? "bg-[#21cb6b38] border-[#21CB6B]"
                    : "bg-[#ed1b2642] border-[#ED1B247A]"
                } rounded-full flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={`${activeTab == "buy" ? "#21CB6B" : "#ED1B247A"}`}
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
