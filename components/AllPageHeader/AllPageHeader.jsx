"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

const AllPageHeader = ({ HeaderData }) => {
  const [inputValue, setInputValue] = useState("0");
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
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
    <div
      className={`text-white flex justify-between pt-[18px] py-[6.3px] px-4 border-b-[1px] border-l-[1px] ${borderColor} pb-5`}
    >
      <div>
        <div className="flex gap-2 items-center">
          <Image
            src={HeaderData?.newPairsIcon?.menuIcon}
            alt="newPairsIcon"
            className="my-auto"
          />
          <h2 className="text-[#3E9FD6] font-semibold text-base">
            {HeaderData?.newPairsIcon?.headTitle}
          </h2>
        </div>
        <p className="text-[#84858E] text-xs mt-1">
          {HeaderData?.newPairsIcon?.discription}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex justify-center items-center gap-2 px-[17.5px] py-[9px] border border-[#3A3A54] rounded-md bg-[#16171D] text-xs text-[#A5A5A7]">
          <Image
            src={HeaderData?.Filter?.menuIcon}
            alt="newPairsIcon"
            className="my-auto"
          />
          {HeaderData?.Filter?.menuTitle}
        </div>
        <div className="flex justify-center items-center gap-2 px-[17.5px] py-[9px] border border-[#3A3A54] rounded-md bg-[#16171D] text-xs text-[#A5A5A7]">
          <Image
            src={HeaderData?.Advanced?.menuIcon}
            alt="newPairsIcon"
            className="my-auto"
          />
          {HeaderData?.Advanced?.menuTitle}
        </div>
        <div className="flex">
          <span className="w-[87px] px-[17.5px] py-[9px] text-center flex items-center justify-center text-xs border rounded-s-md border-[#3A3A54] bg-[#1D1C24] text-[#A5A5A7] gap-2">
            <Image
              src={HeaderData?.Buy?.menuIcon}
              alt={HeaderData?.Buy?.menuTitle}
              className="my-auto"
            />
            {HeaderData?.Buy?.menuTitle}
          </span>
          <input
            type="number"
            className="w-[87px] px-[17.5px] py-[9px] flex text-center justify-center text-xs bg-[#16171D] border border-[#3A3A54] text-[#6CC4F4] rounded-e-lg placeholder-gray-400"
            placeholder={HeaderData?.Buy?.placeHolder}
            step="0.01"
            // value="0"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-center items-center gap-2 px-[9px] py-[9px] border border-[#3A3A54] rounded-md bg-[#16171D] text-xs text-[#A5A5A7]">
          <Image
            src={HeaderData?.coin?.menuIcon}
            alt="newPairsIcon"
            className="my-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default AllPageHeader;
