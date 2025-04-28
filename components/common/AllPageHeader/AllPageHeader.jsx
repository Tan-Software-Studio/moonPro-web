"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import {
  serFilterTime,
  setFilterTime,
  setQuickBuy,
} from "@/app/redux/CommonUiData";
import FilterMemescope from "../filter/FilterMemescope";
import { baseIcon, ethereum, logo, solana } from "@/app/Images";
import RightModalOpenSetting from "@/components/Settings/RightModalOpenSetting";
import { IoSettingsOutline } from "react-icons/io5";
import { setGlobalBuyAmt } from "@/app/redux/states";
import { useTranslation } from "react-i18next";

const AllPageHeader = ({ HeaderData, duration, FilterData }) => {
  const filterPopupRef = useRef(null);
  const dexesPopupRef = useRef(null);
  const { t, ready } = useTranslation();
  const tredingPage = t("tredingPage");
  const holdingsPageLang = t("holdings");

  const pathname = usePathname();
  const pathData = pathname === "/memescope";
  const holdingsPage = pathname.split("/")[1] === "holdings";

  const dispatch = useDispatch();

  const [isFilterPopup, setIsFilterPopup] = useState(false);
  const [isDexesPopup, setIsDexesPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const filterTime = useSelector(
    (state) => state?.AllthemeColorData?.filterTime
  );

  const [isRightModalOpenSetting, setIsRightModalOpenSetting] = useState(false);

  const [localFilterTime, setLocalFilterTime] = useState(filterTime);

  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  const quickBuy = useSelector((state) => state?.AllStatesData?.globalBuyAmt);

  const handleInputChange = (event) => {
    // setInputValue(event.target.value);
    dispatch(setGlobalBuyAmt(event.target.value));
  };

  const handleButtonClick = (option) => {
    // Dispatch the action and ensure the state updates
    setLocalFilterTime(option);

    dispatch(setFilterTime(option));
  };

  const handleDexesPopup = () => {
    setIsDexesPopup((prev) => !prev);
  };

  useEffect(() => {
    const scrollThreshold = pathname === "/memescope" ? 20 : 30;
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close filter popup if clicked outside
      if (
        filterPopupRef.current &&
        !filterPopupRef.current.contains(event.target) &&
        !event.target.closest("#filterButton")
      ) {
        setIsFilterPopup(false);
      }
      // Close dexes popup if clicked outside
      if (
        dexesPopupRef.current &&
        !dexesPopupRef.current.contains(event.target) &&
        !event.target.closest("#DexesButton")
      ) {
        setIsDexesPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter button
  const handleSidebarToggle = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // ----------Filter Dexes--------

  const defaultOptions = ["Raydium", "Pump.fun", "Moonshot", "Orca", "Meteora"];
  const [selectedOptions, setSelectedOptions] = useState([...defaultOptions]);

  // Apply filters
  const handleCheckboxChangeDefault = (option) => {
    setSelectedOptions((prev) => {
      const updated = prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option];
      return updated;
    });
  };

  // Reset all filters
  const resetButtonDefault = () => {
    setSelectedOptions([...defaultOptions]);
  };

  const chcekBoxStyle =
    "appearance-none w-4 h-4 border border-gray-400 rounded-sm bg-transparent flex items-center justify-center checked:bg-[#3e9fd6] checked:border-[#3e9fd6] checked:after:content-['✔'] checked:after:text-xs";

  return (
    <div
      className={`text-white bg-[#08080E] md:flex justify-between items-start lg:items-center pt-[18px] py-[6.3px] px-6 md:px-4 border-b-[1px] ${borderColor} pb-5 transition-all duration-500 ease-in-out 
        ${isScrolled && pathData === false && "-translate-y-full opacity-0 "}`}
    >
      {/* pagename + description */}
      <div className={`text-white xl:flex items-center gap-[8px] md:pl-4`}>
        <div className="flex gap-2 items-center">
          <Image
            src={HeaderData?.newPairsIcon?.menuIcon}
            alt="newPairsIcon"
            className="my-auto h-[28px] w-[28px] md:h-[32px] md:w-[32px] object-contain"
          />
          <h2 className=" text-[#FFFFFF] font-[700] text-[20px] md:text-[28px] tracking-wider">
            {HeaderData?.newPairsIcon?.headTitle}
          </h2>
        </div>
        <div className="flex xl:items-center ">
          <div className="bg-[#6E6E6E] rounded-full w-[6px] h-[6px] xl:block hidden"></div>
          <p className="text-[#6E6E6E] text-sm ml-2 font-normal">
            {HeaderData?.newPairsIcon?.discription}
          </p>
        </div>
      </div>

      {/* filter + buy etc button */}
      <div className="flex flex-wrap lg:items-center md:justify-end gap-2 overflow-x-auto md:mt-0 mt-5">
        {duration && (
          <div
            // w-[348px]
            className={`flex rounded-md bg-[#1A1A1A] p-1`}
          >
            {HeaderData?.timeDuration?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(option)}
                className={`py-2 px-3 text-xs text-[#A5A5A7] ${
                  option === localFilterTime &&
                  "bg-[#1F73FC] text-white rounded-[4px]"
                } transition duration-300`}
              >
                {/* bg-[#1F73FC] text-white first-of-type:rounded-l-md last-of-type:rounded-r-md */}
                {option}
              </button>
            ))}
          </div>
        )}
        {pathname.includes("/holdings") && (
          <div className="flex w-full gap-1.5 h-full py-1.5 items-center ">
            <input
              type="checkbox"
              name=""
              id=""
              className={`${chcekBoxStyle} cursor-pointer`}
            />
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold leading-[100%] text-gray-300">
                {holdingsPageLang?.mainHeader?.withremainingtokens}
              </div>
            </div>
          </div>
        )}
        {HeaderData?.Filter && !pathname.includes("/holdings") && (
          <div className="">
            <button
              className="flex items-center justify-center gap-2 px-[10px] md:px-[17.5px] py-[9px] border text-white border-[#1F73FC] hover:bg-[#11265B] bg-transparent text-xs rounded-[4px] transition duration-300"
              onClick={() => handleSidebarToggle(0)}
            >
              <Image
                src={HeaderData?.Filter?.menuIcon}
                alt="newPairsIcon"
                className="my-auto"
              />
              {HeaderData?.Filter?.menuTitle}
            </button>

            <FilterMemescope
              data={FilterData}
              isOpen={openDropdown == 0}
              setIsOpen={() => setOpenDropdown(null)}
            />
          </div>
        )}
        {HeaderData?.Advanced && (
          <div>
            <button
              id="DexesButton"
              className="flex justify-center items-center gap-2 px-[10px] md:px-[17.5px] py-[9px] border text-white border-[#1F73FC] hover:bg-[#11265B] bg-transparent text-xs rounded-[4px] transition duration-300"
              onClick={() => handleDexesPopup()}
            >
              <Image
                src={HeaderData?.Advanced?.menuIcon}
                alt="newPairsIcon"
                className="my-auto"
              />
              <span>{HeaderData?.Advanced?.menuTitle}</span>
            </button>
            {isDexesPopup && (
              <div
                ref={dexesPopupRef}
                className={`absolute mt-2 border ${borderColor} rounded-md z-[999] bg-[#191919] fixed  lg:right-20 md:right-7 right-0 overflow-y-scroll shadow-lg shadow-[#581bc8]/30`}
              >
                <div className={`border-b-[1px] ${borderColor}`}>
                  <ul className="space-y-4  p-6 ">
                    {defaultOptions.map((option) => (
                      <li key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          // checked={selectedOptions.includes(option)}
                          onChange={() => handleCheckboxChangeDefault(option)}
                          className={chcekBoxStyle}
                        />
                        <label className="text-sm">{option}</label>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`border-b-[1px] ${borderColor}`}>
                  <div className="px-6 py-4 flex items-center justify-between gap-10">
                    <button
                      onClick={resetButtonDefault}
                      className="text-[#1F73FC] hover:text-[#3f8cf1] text-xs font-bold"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => handleDexesPopup()}
                      className="bg-[#1F73FC] hover:bg-[#3f8cf1] rounded-md font-bold px-5 py-1 text-white text-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!holdingsPage && (
          <div className="flex gap-2 items-center">
            <div>
              <button
                onClick={() => setIsRightModalOpenSetting(true)}
                className="flex items-center justify-center gap-2 px-[10px] md:px-[17.5px] py-[9px] border text-white border-[#1F73FC] hover:bg-[#11265B] bg-transparent text-xs rounded-[4px] transition duration-300"
              >
                <IoSettingsOutline className="text-base" />
                <span className=" font-normal hidden md:block">
                  {tredingPage?.mainHeader?.ordersetting?.ordersetting}
                </span>
              </button>
            </div>
            {
              <RightModalOpenSetting
                ordersettingLang={tredingPage?.mainHeader?.ordersetting}
                isOpen={isRightModalOpenSetting}
                onClose={() => setIsRightModalOpenSetting(false)}
              />
            }
            <div className={`flex border ${borderColor} rounded-lg`}>
              <div className="w-[87px] px-[17.5px] py-2 text-center flex items-center justify-center text-xs rounded-s-md border-r-[0.5px] border-r-[#26262e] bg-[#1F1F1F] text-white gap-1 uppercase font-bold">
                {HeaderData?.Buy?.menuTitle}
              </div>

              <div className="py-2 px-[12px] bg-[#141414] rounded-e-lg  w-fit">
                <div className="flex items-center gap-1 justify-center">
                  <input
                    type="number"
                    className="bg-[#141414] h-full w-[43px] text-[12px] font-[400] text-end rounded-e-lg placeholder-gray-400 outline-none pr-[3px]"
                    placeholder={HeaderData?.Buy?.placeHolder}
                    step="0.01"
                    value={quickBuy}
                    onChange={handleInputChange}
                  />
                  <Image src={solana} width={20} height={20} alt="solana" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPageHeader;
