"use client";
import { React, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { PiSquaresFourFill } from "react-icons/pi";
import menu from "../../public/assets/Copytrading/option.png";
import Image from "next/image";
import { useSelector } from "react-redux";

const CopyTradeSearch = () => {
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
      <div
        className={`text-white gap-2 flex justify-end items-center ${isScrolled && "backdrop-blur-3xl"
          }`}
      >
        <div className="flex  items-center gap-2 border border-[#3A3A54] rounded-lg py-[8.5px] px-4 bg-transparent">
          <LuSearch className="text-[#A8A8A8]" />
          <input
            className="w-24 md:w-auto bg-transparent outline-none text-white placeholder-gray-400 text-xs"
            placeholder="Strategy or Username"
          />
        </div>

        <div className="flex gap-2 ">
          <div className="rounded p-1.5 bg-[#6CC4F4] cursor-pointer">
            <PiSquaresFourFill className="text-black h-5 w-5" />
          </div>
          {/* <div className="p-2 cursor-pointer">
            <Image src={menu} alt="menu" className="h-4 w-4" />
          </div>   */}
          <Image
            src={menu}
            alt="menu"
            className=" px-2 py-2 h-8 w-9 mr-5 md:mr-0 cursor-pointer"
          // width={40}
          // height={30}
          />
        </div>
      </div>
    </>
  );
};

export default CopyTradeSearch;