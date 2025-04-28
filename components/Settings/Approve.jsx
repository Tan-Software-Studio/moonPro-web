"use client";
import React from "react";
import { useSelector } from "react-redux";

const Approve = () => {
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  return (
    <>
      <div>
        <div>
          <div
            className={`text-white gap-2 flex flex-row items-center font-semibold text-xs mb-1 mt-8`}
          >
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked
              />
              <div
                className={` relative w-9 h-5 bg-[#909090]  rounded-full  peer-checked:after:translate-x-full   after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-[#34C759]`}
              />
            </label>
            Auto Approve
          </div>
          <p className={`text-[#A5A5A7] font-normal text-xs mb-4`}>
            FF Enable this to automatically approve selling your tokens with 1
            click
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
          <input
            type="number"
            className={`mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-[#A5A5A7] text-xs text-center`}
            placeholder="Input amount"
          />
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

export default Approve;
