"use client";
import React, { useState } from "react";
import { GrCaretDown, GrCaretUp } from "react-icons/gr";
import { IoReload, IoSettingsOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import Infotip from "@/components/common/Tooltip/Infotip.jsx"
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx"

const RightModalOpenSetting = ({ ordersettingLang, isOpen, onClose }) => {
  const [presist, setPresist] = useState("P1");
  const [activeTab, setActiveTab] = useState("buy");
  const [isMev, setIsMev] = useState(true);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9999998] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={`fixed top-14 bottom-5 rounded-md transition-all duration-500 ease-in-out xl:w-[20%] lg:w-[30%]  w-full bg-[#08080e] z-[9999999] border border-[#191919] ${
          isOpen ? "right-0" : "-right-full"
        }`}
      >
        <div className="bg-[#1F1F1F] flex items-center justify-between py-[13px] px-[16px]">
          <div className="flex items-center gap-[8px]">
            <IoSettingsOutline className="text-[#F6F6F6] text-[16px]" />
            <h1 className="text-[14px] font-[700] text-[#F6F6F6]">
              {ordersettingLang?.ordersetting}
            </h1>
          </div>
          <RxCross1
            className="text-[#6E6E6E] text-[16px] cursor-pointer"
            onClick={() => onClose()}
          />
        </div>
        <div className="p-[16px]">
          <div className="border-[0.5px] border-[#4D4D4D] bg-transparent rounded-[8px] flex items-center justify-between mb-[8px]">
            <h1 className="text-[#D6EBFE] text-[12px] font-[500] rounded-l-[8px] bg-[#1F1F1F] px-[16px] py-[13px] flex items-center justify-center whitespace-nowrap">
              {ordersettingLang?.quantity}
            </h1>
            <input
              type="number"
              className="bg-transparent w-full text-white text-right outline-none text-[14px] h-[40px] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance]:textfield"
            />
            <div className="px-4">
              <img
                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                className="w-[30px] h-[18px] rounded-full bg-cover"
                alt=""
              />
            </div>
          </div>
          <div className="my-[16px] flex items-center border-[0.5px] border-[#404040] rounded-[4px]">
            {["P1", "P2", "P3", "P4", "P5"].map((item, index) => {
              return (
                <Tooltip
                  key={index + 1}
                  body={`Preset ${
                    index + 1
                  }: Save your trade settings such as quantity, slippage, and fees.`}
                >
                  <button
                    onClick={() => setPresist(item)}
                    className={`w-full py-[10px] text-[#F6F6F6] font-[700] text-[12px] border-r-[0.5px] border-r-[#404040] duration-300 ease-in-out ${
                      presist == item
                        ? activeTab == "buy"
                          ? "bg-[#1F73FC]"
                          : "bg-[#ED1B24]"
                        : "bg-transparent"
                    }`}
                  >
                    {item}
                  </button>
                </Tooltip>
              );
            })}
          </div>
          <div className="flex items-center bg-[#1f1f1f] md:rounded-[8px]">
            <button
              className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-500 outline-none ${
                activeTab === "buy"
                  ? "bg-[#1F73FC] text-[#F6F6F6]"
                  : "bg-transparent text-[#6E6E6E]"
              }`}
              onClick={() => {
                setActiveTab("buy");
              }}
            >
              {ordersettingLang?.buy}
            </button>
            <button
              className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-300 ${
                activeTab === "sell"
                  ? "bg-[#ED1B24] text-[#F6F6F6]"
                  : "bg-transparent text-[#6E6E6E]"
              }`}
              onClick={() => {
                setActiveTab("sell");
              }}
            >
              {ordersettingLang?.sell}
            </button>
          </div>
          <div
            className={`my-[16px] px-[10px] flex items-center gap-[8px] cursor-pointer ${
              activeTab == "buy" ? "text-[#1F73FC]" : "text-[#ED1B24]"
            }`}
          >
            <IoReload className={`text-[16px]`} />
            <h1 className="text-[12px] font-[400]">
              {ordersettingLang?.resetprest}
            </h1>
          </div>
          <div className="bg-transparent rounded-[8px] flex items-center justify-between border-[0.5px] border-[#404040] my-[16px]">
            <div className="text-[#A8A8A8] select-none rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center justify-center gap-1">
              <h1>Slippage</h1>
              <Infotip body={ordersettingLang?.sllippagetooltip} />
            </div>
            <input
              type="number"
              className="bg-transparent p-[11px] text-start w-full text-white outline-none text-[14px] h-[40px] 
                               [&::-webkit-inner-spin-button]:appearance-none 
                               [&::-webkit-outer-spin-button]:appearance-none 
                               [&::-moz-appearance]:textfield"
            />
            <div className="flex flex-col px-3">
              <GrCaretUp className="text-[11px] cursor-pointer" />
              <GrCaretDown className="text-[11px] cursor-pointer" />
            </div>
          </div>
          <div className="bg-transparent rounded-[8px] flex items-center justify-between border-[0.5px] border-[#4D4D4D] mb-[8px]">
            <div className="text-[#A8A8A8] rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center justify-center whitespace-nowrap gap-1">
              <h1>Priority Fee</h1>
              <Infotip body={ordersettingLang?.priorityfeetooltip} />
            </div>
            <input
              type="number"
              className="bg-transparent w-full text-white text-right outline-none text-[14px] h-[40px] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance]:textfield"
            />
            <div className="px-4">
              <img
                src="https://cryptologos.cc/logos/solana-sol-logo.png"
                className="w-[30px] h-[18px] rounded-full bg-cover"
                alt=""
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-[8px] my-[16px]">
            <div className="flex items-center gap-1">
              <h1 className="text-[#F6F6F6] text-[14px] font-[500]">
                MEV Protection
              </h1>
              <Infotip body={ordersettingLang?.mevtooltip} />
            </div>
            <div
              onClick={() => setIsMev(!isMev)}
              className={`flex ${
                isMev
                  ? `${activeTab == "buy" ? "bg-[#278BFE]" : "bg-[#ed1819]"}`
                  : "bg-[#4D4D4D]"
              } w-[36px] h-[20px] items-center cursor-pointer pl-[3px] rounded-[1000px] transition-all duration-300`}
            >
              <div
                className={`w-[12px] h-[12px] bg-white rounded-full shadow-md transform transition-all duration-300 
      ${isMev ? "translate-x-[18px]" : "translate-x-0 "}`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightModalOpenSetting;
