"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GrCaretDown, GrCaretUp } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import { VscDebugRestart } from "react-icons/vsc";
import Image from "next/image";
import { solana } from "@/app/Images";
import { useDispatch, useSelector } from "react-redux";
import { setPresetActive, setPreSetOrderSetting } from "@/app/redux/states";
import { debouncing } from "@/utils/debouncing";
const RightModalOpenSetting = ({
  ordersettingLang,
  isOpen,
  onClose,
  tredingPage,
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("buy");
  const [saveLoaderFlag, setSaveLoaderFlag] = useState(false);
  const [slippageForDisplay, setSlippageForDisplay] = useState();
  const [priorityForDisplay, setPriorityForDisplay] = useState();
  const [preSetData, setPreSetData] = useState({
    P1: {
      buy: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
      sell: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
    },
    P2: {
      buy: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
      sell: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
    },
    P3: {
      buy: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
      sell: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
    },
    P4: {
      buy: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
      sell: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
    },
    P5: {
      buy: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
      sell: {
        slippage: 40,
        priorityFee: 0.001,
        mev: false,
      },
    },
  });
  // presetActive like P1 P2 and all
  const presist = useSelector((state) => state?.AllStatesData?.presetActive);
  // onchange function for priorityFee
  function updatePreSetPriorityFeeSetting(target) {
    let { value } = target;
    if (!value || value < 0.0001) {
      value = 0.0001;
    }
    setPriorityForDisplay(value);
    setPreSetData((pre) => {
      const updated = {
        ...pre,
        [presist]: {
          ...pre[presist],
          [activeTab]: {
            ...pre?.[presist]?.[activeTab],
            priorityFee: parseFloat(value),
          },
        },
      };
      return updated;
    });
  }
  // onchange function for slippage
  function updatePreSetSlippageSetting(target) {
    let { value } = target;
    if (!value || value < 20) {
      value = 20;
    }
    setSlippageForDisplay(value);
    setPreSetData((pre) => {
      const updated = {
        ...pre,
        [presist]: {
          ...pre[presist],
          [activeTab]: {
            ...pre?.[presist]?.[activeTab],
            slippage: parseFloat(value),
          },
        },
      };
      return updated;
    });
  }
  // make debounce for priority fee
  const debounsUpdatePreSetPriorityFeeSetting = useCallback(
    debouncing(updatePreSetPriorityFeeSetting, 700),
    [presist, activeTab]
  );
  // make debounce for slippage
  const debounsUpdatePreSetSlippageSetting = useCallback(
    debouncing(updatePreSetSlippageSetting, 700),
    [presist, activeTab]
  );
  // update mev
  function updateMEV(value) {
    setPreSetData((pre) => {
      const updated = {
        ...pre,
        [presist]: {
          ...pre[presist],
          [activeTab]: {
            ...pre?.[presist]?.[activeTab],
            mev: value,
          },
        },
      };
      return updated;
    });
  }
  // handleReset for selected preset
  async function handleReset() {
    await setPreSetData((pre) => {
      const update = {
        ...pre,
        [presist]: {
          buy: {
            slippage: 40,
            priorityFee: 0.001,
            mev: false,
          },
          sell: {
            slippage: 40,
            priorityFee: 0.001,
            mev: false,
          },
        },
      };
      localStorage.setItem("preSetAllData", JSON.stringify(update));
      dispatch(setPreSetOrderSetting(update));
      return update;
    });
    setSlippageForDisplay(40);
    setPriorityForDisplay(0.001);
  }

  // save function
  function savePresetData() {
    setSaveLoaderFlag(true);
    localStorage.setItem("preSetAllData", JSON.stringify(preSetData));
    dispatch(setPreSetOrderSetting(preSetData));
    setTimeout(() => {
      setSaveLoaderFlag(false);
    }, 500);
    onClose();
  }
  useEffect(() => {
    setSlippageForDisplay(preSetData?.[presist]?.[activeTab]?.slippage);
    setPriorityForDisplay(preSetData?.[presist]?.[activeTab]?.priorityFee);
  }, [presist, activeTab]);
  useEffect(() => {
    const preSetFromLocalStorage = JSON.parse(
      localStorage.getItem("preSetAllData")
    );
    const preSetActiveFLag = localStorage.getItem("preSetSettingActive");
    if (preSetFromLocalStorage) {
      setPreSetData(preSetFromLocalStorage);
    } else {
      localStorage.setItem("preSetAllData", JSON.stringify(preSetData));
    }
    if (preSetActiveFLag) {
      dispatch(setPresetActive(preSetActiveFLag));
    }
  }, []);
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9999998] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={`flex flex-col justify-between fixed top-0 !z-[99999999981] h-svh bottom-5 transition-all duration-500 ease-in-out xl:w-[20%] lg:w-[30%]  w-full bg-[#08080e] border border-[#191919] ${isOpen ? "right-0" : "-right-full"
          }`}
      >
        <div>
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
            <div className="flex items-center bg-[#1f1f1f] rounded-[8px]">
              <button
                className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-500 outline-none ${activeTab === "buy"
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
                className={`flex-1 py-2 rounded-[8px] h-full text-[14px] font-[400] ease-in-out duration-300 ${activeTab === "sell"
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
            <div className="my-[16px] flex items-center border-[0.5px] border-[#404040] rounded-[4px]">
              {["P1", "P2", "P3", "P4", "P5"].map((item, index) => {
                return (
                  <Tooltip
                    key={index + 1}
                    body={`Preset ${index + 1
                      }: Save your trade settings such as quantity, slippage, and fees.`}
                  >
                    <button
                      onClick={() => {
                        dispatch(setPresetActive(item));
                        localStorage.setItem("preSetSettingActive", item);
                      }}
                      className={`w-full py-[10px] text-[#F6F6F6] font-[700] text-[12px] border-r-[0.5px] border-r-[#404040] duration-300 ease-in-out ${presist == item
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
            {/* qty */}
            {/* <div className="border-[0.5px] border-[#4D4D4D] bg-transparent rounded-[8px] flex items-center justify-between my-[16px]">
              <h1 className="text-[#D6EBFE] text-[12px] font-[500] rounded-l-[8px] bg-[#1F1F1F] px-[16px] py-[13px] flex items-center justify-center whitespace-nowrap">
                {ordersettingLang?.quantity}
              </h1>
              <input
                type="number"
                name="qty"
                value={preSetData?.[presist]?.[activeTab]?.qty}
                onChange={(e) => updatePreSetSetting(e?.target)}
                className="bg-transparent w-full text-white text-right outline-none text-[14px] h-[40px] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance]:textfield"
              />
              <div className={`${activeTab == "buy" ? "px-4" : "pr-3"}`}>
                {activeTab == "buy" &&
                  <Image
                    src={solana}
                    className="w-[30px] h-[18px] rounded-full bg-cover"
                    alt=""
                  />
                }
              </div>
            </div> */}
            {/* slippage */}
            <div className="bg-transparent rounded-[8px] flex items-center justify-between border-[0.5px] border-[#404040] my-[16px]">
              <div className="text-[#A8A8A8] select-none rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center justify-center gap-1">
                <h1>Slippage</h1>
                <Infotip body={ordersettingLang?.sllippagetooltip} />
              </div>
              <input
                type="number"
                name="slippage"
                value={slippageForDisplay}
                onChange={(e) => {
                  setSlippageForDisplay(e?.target?.value);
                  debounsUpdatePreSetSlippageSetting({
                    name: e?.target?.name,
                    value: Math.min(Number(e?.target?.value), 100),
                  });
                }}
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
            {/* priority fee */}
            <div className="bg-transparent rounded-[8px] flex items-center justify-between border-[0.5px] border-[#4D4D4D] mb-[8px]">
              <div className="text-[#A8A8A8] rounded-l-[8px] bg-[#1F1F1F] h-[40px] px-4 flex items-center justify-center whitespace-nowrap gap-1">
                <h1>Priority Fee</h1>
                <Infotip body={ordersettingLang?.priorityfeetooltip} />
              </div>
              <input
                type="number"
                name="priorityFee"
                value={priorityForDisplay}
                onChange={(e) => {
                  setPriorityForDisplay(e?.target?.value);
                  debounsUpdatePreSetPriorityFeeSetting({
                    name: e?.target?.name,
                    value: Math.min(Number(e?.target?.value), 1),
                  });
                }}
                className="bg-transparent w-full text-white text-right outline-none text-[14px] h-[40px] [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-moz-appearance]:textfield"
              />
              <div className={`px-4`}>
                <Image
                  src={solana}
                  className="w-[30px] h-[18px] rounded-full bg-cover"
                  alt=""
                />
              </div>
            </div>
            {/* MEV */}
            <div className="flex items-center justify-between gap-[8px] my-[16px]">
              <div className="flex items-center gap-1">
                <h1 className="text-[#F6F6F6] text-[14px] font-[500]">
                  MEV Protection
                </h1>
                <Infotip body={ordersettingLang?.mevtooltip} />
              </div>
              <div
                onClick={() => {
                  updateMEV(!preSetData?.[presist]?.[activeTab]?.mev);
                }}
                className={`flex ${preSetData?.[presist]?.[activeTab]?.mev
                    ? `${activeTab == "buy" ? "bg-[#278BFE]" : "bg-[#ed1819]"}`
                    : "bg-[#4D4D4D]"
                  } w-[36px] h-[20px] items-center cursor-pointer pl-[3px] rounded-[1000px] transition-all duration-300`}
              >
                <div
                  className={`w-[12px] h-[12px] bg-white rounded-full shadow-md transform transition-all duration-300 
      ${preSetData?.[presist]?.[activeTab]?.mev
                      ? "translate-x-[18px]"
                      : "translate-x-0 "
                    }`}
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full">
            <div className="text-[#8a8a8a] flex items-center gap-2 text-[12px] mx-[7px] my-[3px]">
              <p>NOTE:-</p>
              <p>Min Slippage = 20</p>,<p>Min Priority Fee = 0.0001</p>
            </div>
            <div className="flex justify-between border-t border-gray-500 py-3 px-4 bg-[#16171c]">
              <button
                className="text-gray-200 gap-2 text-xs flex items-center"
                onClick={() => handleReset()}
              >
                <VscDebugRestart />
                {tredingPage?.mainHeader?.filter?.reset || "Reset"}
              </button>
              <button
                onClick={() => savePresetData()}
                className="bg-[#11265B] !font-semibold h-[36px] !px-8 border-2 border-[#0E43BD] rounded-md text-white text-grey-0 text-xs"
              >
                {saveLoaderFlag ? "saved" : "save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default RightModalOpenSetting;
