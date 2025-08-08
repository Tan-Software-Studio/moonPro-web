import { solana } from "@/app/Images";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";

const Setting = ({ setIsSettingPopup }) => {
  const [isActive, setIsActive] = useState("Quick buy");

  const { t } = useTranslation();
  const accountPopupLng = t("accountPopup");


  const settingData = [
    {
      id: 1,
      title: accountPopupLng?.setting?.slippage,
      description: accountPopupLng?.setting?.slippageDesc,
      isPercent: "%",
    },
    {
      id: 2,
      title: accountPopupLng?.setting?.maxGasLimit,
      description: accountPopupLng?.setting?.maxGasLimitDesc,
      isPercent: "",
    },
    {
      id: 3,
      title: accountPopupLng?.setting?.priorityFee,
      description: accountPopupLng?.setting?.priorityFeeDesc,
      isPercent: "",
    },
    {
      id: 4,
      title: accountPopupLng?.setting?.mevProtections,
      description:
        accountPopupLng?.setting?.mevProtectionDesc,
      isPercent: "",
    },
    {
      id: 5,
      title: accountPopupLng?.setting?.briberyamount,
      description:
        accountPopupLng?.setting?.briberyamountDesc,
      isPercent: "",
    },
  ];

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsSettingPopup(false)}
      className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center !z-[999999999999999]"
    >
      <motion.div
        key="modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="LanguagePopup-lg xl:w-[1100px] lg:w-[1000px]   bg-[#08080E] rounded-md !z-[999999999999999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          <div className="flex items-center justify-between sm:px-5 px-3 py-2">
            <div className="md:text-2xl sm:text-xl text-lg sm:font-bold font-semibold text-white ">
              {accountPopupLng?.setting?.Setting}
            </div>
            <div
              onClick={() => setIsSettingPopup(false)}
              className="cursor-pointer"
            >
              <IoClose size={20} />
            </div>
          </div>

          <div className="bg-[#1F1F1F] border-t-[1px] border-t-[#404040] flex overflow-x-auto  items-center gap-4 w-full px-5">
            {[
              accountPopupLng?.setting?.quickbuy,
              accountPopupLng?.setting?.quickSell,
              accountPopupLng?.setting?.approve,
              accountPopupLng?.setting?.autoBuy,
              accountPopupLng?.setting?.autosell,
            ].map((item, index) => (
              <div
                onClick={() => setIsActive(item)}
                key={index}
                className={`${
                  isActive == item
                    ? "border-b-[1px] border-[#1F73FC] text-[#1F73FC] "
                    : "text-[#A8A8A8] border-b-[1px] border-transparent "
                } py-3 transition-all sm:text-base text-sm duration-500 cursor-pointer ease-in-out sm:font-semibold`}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="sm:px-6 px-3 md:h-full h-[500px]  overflow-y-auto ">
            {settingData.map(({ id, title, description, isPercent }) => (
              <div key={id}>
                <div className="flex sm:flex-row flex-col sm:items-center my-5  justify-between">
                  <div>
                    <div>{title}</div>
                    <div className="text-[#6E6E6E] text-sm font-normal">
                      {description}
                    </div>
                  </div>
                  <div>
                    <div className="border border-[#404040] flex items-center gap-2 w-28 h-9 rounded-lg px-2 bg-[#08080E]">
                      <input
                        type="number"
                        className="bg-transparent text-white w-full outline-none text-right "
                        placeholder="0"
                      />
                      {isPercent && (
                        <div className="  text-white">{isPercent}</div>
                      )}
                    </div>
                  </div>
                </div>
                <hr className="border-[#1A1A1A] border-b-[1px]  w-full" />
              </div>
            ))}
            <div className="flex items-center my-5  justify-between">
              <div>
                <div>{accountPopupLng?.setting?.Customize}</div>
                <div className="text-[#6E6E6E] ">
                  {accountPopupLng?.setting?.CustomizeDesc}
                </div>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-5 sm:grid-cols-3 grid-cols-1">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="border border-[#404040] flex items-center gap-2 w-full h-9 rounded-lg px-2 bg-[#08080E]"
                  >
                    <input
                      type="number"
                      className="bg-transparent text-white w-full outline-none text-right"
                      placeholder="0"
                    />
                    <Image
                      src={solana}
                      alt="solana"
                      width={20}
                      height={20}
                      unoptimized
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="py-5 sm:px-5 px-3">
            <div className="flex gap-2 items-center justify-end">
              <button
                onClick={() => setIsSettingPopup(false)}
                className="py-2 px-5 border-[1px] border-[#ED1B24] text-[#ED1B24] hover:bg-[#ED1B24] hover:text-[#FFFFFF] rounded-md transition-all duration-500 ease-in-out "
              >
                {accountPopupLng?.setting?.cancel}
              </button>
              <button
                onClick={() => setIsSettingPopup(false)}
                className="py-2 px-5 border-[1px] border-[#1F73FC] text-white bg-[#1F73FC] hover:opacity-80 rounded-md transition-all duration-500 ease-in-out "
              >
                {accountPopupLng?.setting?.save}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Setting;
