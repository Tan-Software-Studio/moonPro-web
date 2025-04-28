"use client";
import Image from "next/image";
import React from "react";
import img from "../../../public/assets/New Pairs/tableIcon.png";

import copy from "../../../public/assets//Copytrading/copytrade.png";
import { useSelector } from "react-redux";
import CopyHeader from "@/components/CopyTrading/CopyHeader";

const Copytrade = () => {
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  const data = Array(160).fill(null);


   
  return (
    <>
      <CopyHeader />
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 overflow-y-auto visibleScroll h-screen `}
      >
        {data.map((_, index) => (
          <div
            key={index}
            className={`border ${borderColor} rounded-lg m-4 p-4 `}
          >
            <div className={`flex gap-2 border-b pb-2 ${borderColor}`}>
              <Image src={img} alt="logo" className={`lg:h-14 lg:w-14`} />
              <div className={`mt-1 lg:mt-2 text-[11px] lg:text-xs`}>
                <h4 className={`font-normal`}>ForDrewams</h4>
                <p className={`text-[#767479]`}>@312300</p>
              </div>
              <div className={`ml-auto text-[11px] lg:text-xs`}>
                <p className={` font-normal text-[#767479]`}>Return 1M</p>
                <div className={`flex mt-2 gap-1`}>
                  <Image
                    src={copy}
                    alt="trade"
                    className={`h-3 w-[10.89px] mt-[1.5px]`}
                  />
                  <p className={` font-normal text-[#3E9FD6]`}>27.15%</p>
                </div>
              </div>
            </div>

            <div
              className={`flex justify-between mt-2 text-[11px] lg:text-xs font-normal`}
            >
              <div className={`text-`}>
                <p className={`text-[#767479]`}>Free</p>
                <p className={`text-[#F3F3F3] mt-2`}>10%</p>
                <div className={`mt-2`}>
                  <p className={`text-[#767479]`}>Investors</p>
                  <p className={`text-[#F3F3F3] mt-2`}>25</p>
                </div>
              </div>
              <div>
                <p className={`text-[#767479]`}>Win Ratio</p>
                <p className={`text-[#F3F3F3] mt-2`}>2.49</p>
                <div className={`mt-2`}>
                  <p className={`text-[#767479]`}>Invested</p>
                  <p className={`text-[#F3F3F3] mt-2`}>$26.723</p>
                </div>
              </div>
              <div>
                <p className={`text-[#767479]`}>Drawdown</p>
                <p className={`text-[#F3F3F3] mt-2`}>43%</p>
                <div className={`mt-2`}>
                  <p className={`text-[#767479]`}>Own Funds</p>
                  <p className={`text-[#F3F3F3] mt-2`}>$3.523</p>
                </div>
              </div>
            </div>

            <div className={`border-t mt-2 ${borderColor} `}>
              <div className={`flex items-center justify-between mt-4`}>
                <p className={`border rounded-full p-2 font-normal text-xs`}>
                  10
                </p>
                <button
                  className={`font-normal text-xs px-5 py-1 border-[#CC6BEE] border rounded-lg`}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Copytrade;
