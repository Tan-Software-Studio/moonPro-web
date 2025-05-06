import { solana } from "@/app/Images";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const Setting = ({ setIsSettingPopup }) => {
  const [isActive, setIsActive] = useState("Quick buy");

  const settingData = [
    {
      id: 1,
      title: "Slippage",
      description:
        "How much less tokens you&apos;re willing to receive from a trade due to price volatility.",
      isPercent: "%",
    },
    {
      id: 2,
      title: "Max Gas Limit",
      description:
        "The maximum amount of gas you are willing to offer for ANY transaction. We highly recommend that you refrain from adjusting this setting.",
      isPercent: "",
    },
    {
      id: 3,
      title: "Priority Fee",
      description:
        'Extra "tip" to have your transaction completed faster. The higher the priority fee, the higher the chance of getting your transaction processed sooner.',
      isPercent: "",
    },
    {
      id: 4,
      title: "Mev Protection",
      description:
        "Enable this for protection against sandwich attacks from MEV bots and save on gas fees in the event of a failed transaction.",
      isPercent: "",
    },
    {
      id: 5,
      title: "Bribery Amount",
      description:
        "Set an additional bribe amount on top of your priority fee for the block builder to place your transaction as soon as possible.",
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
              Setting
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
              "Quick buy",
              "Quick sell",
              "Approve",
              "Auto buy",
              "Auto sell",
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
                <div>Customize</div>
                <div className="text-[#6E6E6E] ">
                  Customize your Quick Buy buttons with your own preset amounts.
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
                    <Image src={solana} alt="solana" width={20} height={20} />
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
                Cancel
              </button>
              <button
                onClick={() => setIsSettingPopup(false)}
                className="py-2 px-5 border-[1px] border-[#1F73FC] text-white bg-[#1F73FC] hover:opacity-80 rounded-md transition-all duration-500 ease-in-out "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Setting;
