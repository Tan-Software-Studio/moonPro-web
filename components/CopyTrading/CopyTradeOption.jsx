"use client";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CopyTradeOption = () => {
  const [activeBtnIndex, setBtnActiveIndex] = useState(2);

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

  const timeOptions = [
    "Featued",
    "Best Perform",
    "Best Perform",
    "Best Perform",
    "Best Perform",
    "High Win Ratio",
    "High own Funds",
  ];

  return (
    <>
      <div className={`flex   rounded-md bg-[#16171D] border ${borderColor}`}>
        {timeOptions?.map((option, index) => (
          <button
            key={index}
            onClick={() => setBtnActiveIndex(index)}
            className={`py-2 px-4 text-xs text-[#A5A5A7] ${activeBtnIndex === index
              ? "bg-[#6CC4F4] text-black first-of-type:rounded-l-md last-of-type:rounded-r-md"
              : ""
              } ${index < timeOptions?.length - 1 && `border-r ${borderColor}`
              } transition duration-300`}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
};

export default CopyTradeOption;