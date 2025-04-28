"use client";
import Image from "next/image";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import logo from "../../public/assets/Copytrading/copytradeicon.png";
import coin from "../../public/assets/New Pairs/bitcoin.png";
import CopyTradeSearch from "./CopyTradeSearch";
import CopyTradeOption from "./CopyTradeOption";
import { Copytrading } from "@/app/Images";

const CopyHeader = () => {
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  return (
    <>
      {/* <div
        className={`  z-[999999999] text-white flex justify-between items-center pt-[18px] py-[6.3px] px-4 border-b-[1px] border-l ${borderColor} pb-5 sticky top-[56.5px] ${isScrolled && `backdrop-blur-3xl   `
          }`}
      > */}
      <div
        className={` text-white flex justify-between items-center pt-[18px] py-[6.3px] px-4 border-b-[1px] border-l ${borderColor} pb-5 sticky top-[57.4px] ${isScrolled && `backdrop-blur-3xl  `
          }`}
      >
        {/* Logo and Title Section */}
        <div>
          <div className="flex gap-2 items-center w-[200px] ">
            <Image
             src={Copytrading}
              alt="copytradeicon"
              className="my-auto h-6 w-6 object-contain"
              width={1000} 
              height={1000}
              />
            <h2 className="text-white font-semibold uppercase text-[16px] tracking-wider w-full">
              Copy Trading
            </h2>
          </div>
          <p className="text-[#84858E] text-xs mt-1 md:block hidden">
            Find the best traders and copy their strategies
          </p>
        </div>
        <div className="flex gap-2 items-center overflow-x-auto ">
          {/* Option Component */}
          <div className={`lg:block hidden`}>
            <CopyTradeOption />
          </div>
          {/* Search Component */}
          <div className={`lg:hidden block`}>
            <CopyTradeSearch />
          </div>
          {/* Bitcoin image */}
          {/* <div className="flex items-center gap-2  border border-[#3A3A54] rounded-md text-xs text-[#A5A5A7]">
            <Image src={coin} alt="bitcoin" className="h-4 w-4" />
          </div> */}
          <Image
            src={coin}
            alt="bitcoin"
            className=" px-[7px] py-[7px] border border-[#3A3A54] rounded-md bg-[#16171D]  h-8 w-8 cursor-pointer"
          // width={40}
          // height={40}
          />
        </div>
      </div>
      <div
        className={`text-white  gap-2 flex justify-end items-center pt-[18px] py-[6.3px] px-4 border-b-[1px]  sticky md:top-[140.5px] top-[131px]  border-l ${borderColor} pb-5  ${isScrolled && `backdrop-blur-3xl `
          }`}
      >

        <div className="flex gap-2 items-center overflow-x-auto ">
          {/* Option Component */}
          <div className={`block lg:hidden`}>
            <CopyTradeOption />
          </div>
          {/* Search Component */}
          <div className={`hidden lg:block`}>
            <CopyTradeSearch />
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyHeader;