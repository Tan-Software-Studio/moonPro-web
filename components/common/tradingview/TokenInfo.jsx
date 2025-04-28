"use client";
import React, { useState } from "react";
import DropDownIcon from "../../../public/assets/Trading/DropDownIcon.svg";
import Image from "next/image";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";

function TokenInfo({ tragindViewPage, tokenInfo, dataLoaderForChart }) {
  const [isTokenInfo, setIsTokenInfo] = useState(true);
  return (
    <div className="bg-[#08080E] select-none flex flex-col h-fit w-full text-white">
      <div
        className="flex px-[16px] py-[10px] items-center justify-between cursor-pointer bg-[#1F1F1F]"
        onClick={() => setIsTokenInfo(!isTokenInfo)}
      >
        <h1 className="text-white text-[16px] font-medium">
          {tragindViewPage?.tokeninfo}
        </h1>
        <MdOutlineKeyboardArrowRight
          className={`ease-in-out duration-300 text-[19px] ${
            isTokenInfo && "rotate-90"
          }`}
        />
      </div>

      <div
        className={`grid ease-in-out duration-300 origin-top text-white text-[12px] ${
          isTokenInfo
            ? "max-h-[1000px] opacity-100 scale-y-100 border-t-[1px] border-[#4D4D4D]"
            : "max-h-0 opacity-0 scale-y-0"
        }`}
      >
        <div className="2xl:p-6 p-4">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex flex-col items-start">
              <h2 className="text-[#A8A8A8] text-[10px] font-[300]">
                {tokenInfo?.[0]?.label}
              </h2>
              <p className="text-[14px] text-[#F6F6F6] font-[700]">
                {dataLoaderForChart ? "------" : tokenInfo?.[0]?.price}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-[#A8A8A8] text-[10px] font-[300]">
                {tokenInfo?.[1]?.label}
              </h2>
              <p className="text-[14px] text-[#F6F6F6] font-[700]">
                {dataLoaderForChart ? "------" : tokenInfo?.[1]?.price}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-[#A8A8A8] text-[10px] font-[300]">
                {tokenInfo?.[2]?.label}
              </h2>
              <p className="text-[14px] text-[#F6F6F6] font-[700]">
                {dataLoaderForChart ? "------" : tokenInfo?.[2]?.price}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between ">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                <h2 className="text-[#A8A8A8] text-[10px] font-[300]">
                  {tokenInfo?.[3]?.label}
                </h2>
                <Infotip body={tragindViewPage?.liqtool} />
              </div>
              <p className="text-[14px] text-[#F6F6F6] font-[700]">
                {dataLoaderForChart ? "------" : tokenInfo?.[3]?.price}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <h2 className="text-[#A8A8A8] text-[10px] font-[300]">
                  {tokenInfo?.[4]?.label}
                </h2>
                <Infotip body={tragindViewPage?.fdvtool} />
              </div>
              <p className="text-[14px] text-[#F6F6F6] font-[700]">
                {dataLoaderForChart ? "------" : tokenInfo?.[4]?.price}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <h2 className="text-[#A8A8A8] text-[10px] font-[300]">
                  {tokenInfo?.[5]?.label}
                </h2>
                <Infotip body={tragindViewPage?.mctool} />
              </div>
              <p className="text-[14px] text-[#F6F6F6] font-[700]">
                {" "}
                {dataLoaderForChart ? "------" : tokenInfo?.[5]?.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenInfo;
