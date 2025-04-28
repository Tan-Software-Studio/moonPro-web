"use client";
import React from "react";
import { useSelector } from "react-redux";
import { eth } from "../../app/Images";
import Image from "next/image";
import { BsPercent } from "react-icons/bs";
import { per } from "../../app/Images";
const QuickSell = () => {
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  return (
    <>
      <div>
        <div>
          <p className={`text-white font-semibold text-xs mb-1 mt-8`}>
            Slippage
          </p>
          <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
            How much less tokens you&apos;re willing to receive from a trade due
            to price volatility.
          </p>
          {/* <input
            type="number"
            className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
            placeholder="Input amount"
          /> */}

          <div
            className="relative 
             items-center"
          >
            <span className="absolute inset-y-6 left-32  flex items-center">
              <Image src={per} alt="percentage" />
            </span>
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />
          </div>

          <div className={`${borderColor} border-b mt-8`} />
        </div>
        <div>
          <p className={`text-white font-semibold text-xs mb-1 mt-8`}>
            Max Gas Limit
          </p>
          <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
            The maximum amount of gas you are willing to offer for ANY
            transaction. We highly recommend that you refrain from adjusting
            this setting.
          </p>
          <input
            type="number"
            className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
            placeholder="Input amount"
          />
          <div className={`${borderColor} border-b mt-8`} />
        </div>
        <div>
          <p className={`text-white font-semibold text-xs mb-1 mt-8`}>
            Priority Fee
          </p>
          <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
            Extra &apos;tip&apos; to have your transaction completed faster. The
            higher the priority fee, the higher the chance of getting your
            transaction processed sooner.
          </p>
          <div
            className="relative 
             items-center"
          >
            <span className="absolute inset-y-6 left-[120px] text-[#A5A5A7] text-xs flex items-center">
              gwei
            </span>
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none  text-xs text-center`}
              placeholder="Input amount"
              value={10.5}
            />
          </div>
          <div className={`${borderColor} border-b mt-8`} />
        </div>{" "}
        <div>
          <div
            className={`text-white gap-2 flex flex-row items-center  font-semibold text-xs mb-1 mt-8`}
          >
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked
              />
              <div
                className={`relative w-9 h-5 mj  rounded-full pe er  peer-checked:after:translate-x-full   after:absolute after:top-[2px] after:start-[2px] after:bg-white   after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-[#34C759]`}
              />
            </label>
            Mev Protection
          </div>
          <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
            Enable this for protection against sandwich attacks from MEV bots
            and save on gas fees in the event of a failed transaction.
          </p>
          <input
            type="number"
            className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
            placeholder="Input amount"
          />
          <div className={`${borderColor} border-b mt-8`} />
        </div>{" "}
        <div>
          <p className={`text-white font-semibold text-xs mb-1 mt-8`}>
            Bribery Amount
          </p>
          <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
            Set an additional bribe amount on top of your priority fee for the
            block builder to place your transaction as soon as possible.
          </p>
          <input
            type="number"
            className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
            placeholder="Input amount"
          />
          <div className={`${borderColor} border-b mt-8`} />
        </div>{" "}
        <div>
          <p className={`text-white font-semibold text-xs mb-1 mt-8`}>
            Customize
          </p>
          <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
            Customize your Quick Buy buttons with your own preset amounts.
          </p>

          <div className={`gap-4 grid md:grid-cols-2 lg:grid-cols-3 xl:flex`}>
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />{" "}
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />{" "}
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />{" "}
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />{" "}
            <input
              type="number"
              className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
              placeholder="Input amount"
            />
          </div>
          <div className={`${borderColor} border-b mt-8`} />
        </div>
        <div className={`mt-6 lgmt-[2rem]`}>
          <button
            className={`border ${borderColor} rounded-full py-2 px-8 bg-[#6A60E8] text-white hover:bg-[#5249d1] transition`}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default QuickSell;
