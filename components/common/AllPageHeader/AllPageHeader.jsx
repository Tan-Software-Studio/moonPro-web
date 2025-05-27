"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import {
  serFilterTime,
  setQuickBuy,
} from "@/app/redux/CommonUiData";
import FilterMemescope from "../filter/FilterMemescope";
import { baseIcon, ethereum, logo, solana } from "@/app/Images";
import RightModalOpenSetting from "@/components/Settings/RightModalOpenSetting";
import { IoSettingsOutline } from "react-icons/io5";
import { setGlobalBuyAmt, setOpenOrderSetting } from "@/app/redux/states";
import { useTranslation } from "react-i18next";
import { ChevronDown, List, Eye, LayoutGrid, Search } from "lucide-react";
const AllPageHeader = ({ HeaderData, duration, FilterData, localFilterTime, setLocalFilterTime, setFilterValues, filterValues, onApply, onReset, }) => {
  const filterPopupRef = useRef(null);
  const dexesPopupRef = useRef(null);
  const { t, ready } = useTranslation();
  const tredingPage = t("tredingPage");
  const holdingsPageLang = t("holdings");
  const pathname = usePathname();
  const pathData = pathname === "/memescope";
  const holdingsPage = pathname.split("/")[1] === "holdings";
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [open, setOpen] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [presist, setPresist] = useState("P1");
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside

  // order setting popup flag
  const isRightModalOpenSetting = useSelector((state) => state?.AllStatesData?.openOrderSetting);

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
    // dispatch(setFilterTime(option));
  };
  const handleDexesPopup = () => {
    setIsDexesPopup((prev) => !prev);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
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
  const chcekBoxStyle =
    "appearance-none w-4 h-4 border border-gray-400 rounded-sm bg-transparent flex items-center justify-center checked:bg-[#3e9fd6] checked:border-[#3e9fd6] checked:after:content-['✔'] checked:after:text-xs";
  return (
    <div
      className={`text-white relative bg-[#08080E] md:flex justify-between items-start lg:items-center pt-[18px] py-[6.3px] px-3 md:px-4 border-b-[1px] ${borderColor} pb-5 transition-all duration-500 ease-in-out 
        ${isScrolled && pathData === false && "-translate-y-full opacity-0 "}`}
    >
      {/* pagename + description */}
      <div className={`text-white xl:flex items-center gap-[8px]`}>
        <div className="flex gap-2 items-center">
          {/* <Image
            src={HeaderData?.newPairsIcon?.menuIcon}
            alt="newPairsIcon"
            className="my-auto h-[28px] w-[28px] md:h-[32px] md:w-[32px] object-contain"
          /> */}
          <h2 className=" text-[#FFFFFF] font-[700] text-[20px] md:text-[20px] tracking-wider">
            {HeaderData?.newPairsIcon?.headTitle}
          </h2>
        </div>
        {/* <div className="flex xl:items-center ">
          <div className="bg-[#6E6E6E] rounded-full w-[6px] h-[6px] xl:block hidden"></div>
          <p className="text-[#6E6E6E] text-sm ml-2 font-normal">
            {HeaderData?.newPairsIcon?.discription}
          </p>
        </div> */}
      </div>
      {/* filter + buy etc button */}
      <div className="flex flex-wrap lg:items-center md:justify-end gap-2 overflow-x-auto md:mt-0 mt-5">
        {duration && (
          <div
            // w-[348px]
            className={`flex `}
          >
            {HeaderData?.timeDuration?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(option)}
                className={`py-2 px-3 text-sm  font-semibold hover:bg-[#1F73FC]/[30%] rounded-md ${option === localFilterTime &&
                  " !text-[#1F73FC]"
                  } transition duration-300 text-[#edebe5]`}
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
              className="flex items-center justify-center gap-2 px-[10px] md:px-[17.5px] py-[9px] font-semibold border text-white border-[#1F73FC] hover:bg-[#11265B] bg-transparent text-xs rounded-[10px] transition duration-300"
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
              setFilterValues={setFilterValues}
              filterValues={filterValues}
              onApply={onApply}
              onReset={onReset}
            />
          </div>
        )}
        {/*{HeaderData?.Advanced && (
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
        )}*/}
        {!holdingsPage && (
          <div className="flex gap-2 items-center ">

            <div className="">
              {/* Display Button */}
              {pathname.startsWith("/memescope") && (
                <button
                  onClick={() => setIsDisplayOpen(!isDisplayOpen)}
                  className="flex items-center px-4 py-1.5 bg-[#1f1f25] rounded-full text-sm font-semibold text-white hover:bg-[#2b2b33] transition"
                >
                  <List size={16} className="mr-2" />
                  Display
                  <ChevronDown size={16} className="ml-2" />
                </button>
              )}

              {/* Dropdown Panel */}
              {isDisplayOpen && (
                <div className="absolute right-44 mt-2 w-[320px] bg-[#1a1a1a] border border-gray-700 text-white rounded-md shadow-lg !z-50">
                  <div className="p-4 space-y-4">
                    {/* Metrics Section */}
                    <div>
                      <p className="text-sm font-semibold mb-2">Metrics</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="py-2 px-3 bg-[#2a2a2a] rounded text-xs text-center">MC 77K <br /> Small</div>
                        <div className="py-2 px-3 bg-[#444] rounded text-xs text-center font-bold">MC 77K <br /> Large</div>
                      </div>
                    </div>

                    {/* Quick Buy Section */}
                    <div>
                      <p className="text-sm font-semibold mb-2">Quick Buy</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["Small", "Large", "Mega"].map((size) => (
                          <div
                            key={size}
                            className="py-2 px-2 bg-[#2a2a2a] rounded text-center text-xs font-medium"
                          >
                            <span className="block text-blue-400">⚡</span>
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Toggle Features */}
                    <div className="border-t border-gray-600 pt-4 space-y-3 text-sm">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                        <Search size={16} />
                        Show Search Bar
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                        <Eye size={16} />
                        Show Hidden Tokens
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                        <LayoutGrid size={16} />
                        Circle Images
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                        <div className="w-4 h-1 bg-gray-400 rounded-full" />
                        Progress Bar
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                        Spaced Tables
                      </div>
                    </div>

                    {/* Customize Rows */}
                    <div className="border-t border-gray-600 pt-4">
                      <p className="text-sm font-semibold mb-2">Customize rows</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Market Cap", "Volume", "TX", "Socials", "Holders", "Pro Traders", "Dev Migrations",
                          "Top 10 Holders", "Dev Holding", "Snipers", "Insiders", "Bundlers", "Dex Paid",
                        ].map((item) => (
                          <span
                            key={item}
                            className="bg-[#2a2a2a] px-2 py-1 rounded text-xs cursor-pointer hover:bg-[#3b3b3b]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => dispatch(setOpenOrderSetting(true))}
                className="flex items-center justify-center gap-2 px-3 text-[#ecf6fd] text-xs rounded-[4px] transition duration-300"
              >
                <IoSettingsOutline className="text-base" />
                {/* <span className=" font-normal hidden md:block">
                  {tredingPage?.mainHeader?.ordersetting?.ordersetting}
                </span> */}
              </button>
            </div>
            <RightModalOpenSetting
              ordersettingLang={tredingPage?.mainHeader?.ordersetting}
              isOpen={isRightModalOpenSetting}
              onClose={() => dispatch(setOpenOrderSetting(false))}
              tredingPage={tredingPage}
              setPresist={setPresist}
              presist={presist}
            />

            {/* <div className="flex items-center mr-2 space-x-2 px-5 py-2 bg-[#1a1a1a] rounded-full text-white text-sm font-medium w-fit">

              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a4 4 0 00-4-4H5a2 2 0 00-2 2v12a2 2 0 002 2h8a4 4 0 004-4v-2M9 13h6" />
              </svg>

              <span>1</span>

              <Image src={solana} width={20} height={20} alt="solana" />

              <span>0</span>

              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div> */}

            <div className=" inline-block" >
              {/* Wallet Button */}
              <div
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                className="flex items-center mr-2 space-x-2 px-5 py-2 bg-[#1a1a1a] rounded-full text-[#ecf6fd] text-sm font-medium cursor-pointer"
              >
                {/* Wallet Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a4 4 0 00-4-4H5a2 2 0 00-2 2v12a2 2 0 002 2h8a4 4 0 004-4v-2M9 13h6" />
                </svg>
                <span>1</span>

                {/* Solana Icon */}
                <Image src={solana} width={20} height={20} alt="solana" />
                <span>0</span>

                {/* Dropdown Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {open && (
                <div
                  ref={dropdownRef}
                  className="absolute right-20 mt-2 w-96 bg-[#1a1a1a] border border-gray-700 text-white rounded-md shadow-lg z-50"
                >
                  {/* Wallet List */}
                  {[
                    { name: "Moon Pro Main", status: "Off", address: "BEsA4", balance: 0, toggle: 0, active: true },
                    { name: "Wallet", status: "Off", address: "8cYVF", balance: 0, toggle: 0, active: false }
                  ].map((wallet, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 ${wallet.active ? "bg-[#1a1a1a]" : ""}`}
                    >
                      {/* Checkbox and wallet info */}
                      <div className="flex items-center gap-2 w-1/2">
                        <input
                          type="checkbox"
                          className="form-checkbox text-orange-400 bg-transparent border-gray-600"
                          checked={wallet.active}
                          readOnly
                        />
                        <div>
                          <span className={`text-sm font-semibold ${wallet.active ? "text-orange-400" : ""}`}>
                            {wallet.name}
                          </span>
                          <p className="text-xs text-gray-400">{wallet.status} · {wallet.address}</p>
                        </div>
                      </div>

                      {/* Solana balance */}
                      <div className="flex items-center gap-1">
                        <Image src={solana} width={16} height={16} alt="solana" />
                        <span className="text-sm">0</span>
                      </div>

                      {/* Toggle section */}
                      <div className="flex items-center gap-1">
                        <div className="w-10 h-5 bg-gray-600 rounded-full flex items-center px-1">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm">0</span>
                      </div>
                    </div>
                  ))}

                  {/* Add Wallet */}
                  <div className="border-t border-gray-700 px-4 py-2 text-sm hover:bg-gray-800 cursor-pointer">
                    + Add Wallet
                  </div>
                </div>
              )}
            </div>

            {/* <div className={`flex border ${borderColor} rounded-lg`}>
              <div className="w-[87px] px-[17.5px] py-1 text-center flex items-center justify-center text-xs rounded-s-md border-r-[0.5px] border-r-[#26262e] bg-[#1F1F1F] text-white gap-1 uppercase font-bold">
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
            </div> */}

            <div className="flex items-center rounded-full py-1 bg-[#141414] border border-[#26262e] text-white text-xs overflow-hidden w-fit">
              {/* Left section: Quick Buy */}
              <div className="px-4 py-1 bg-[#1F1F1F] font-semibold text-[#f4fcff">
                Quick Buy
              </div>

              {/* Middle section: Amount input */}
              <div className="px-2 py-1 text-gray-400 font-medium">
                <div className="">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="bg-transparent text-gray-400 text-xs w-8 outline-none"
                    value={quickBuy}
                    onChange={handleInputChange}
                  />
                </div>

              </div>

              {/* Right section: Solana + value */}
              <div className="flex items-center gap-1 px-3 py-1 border-l border-[#26262e] cursor-pointer" onClick={() => dispatch(setOpenOrderSetting(true))}>
                <Image src={solana} width={16} height={16} alt="solana" />
                <span className="text-white text-xs">{presist}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
export default AllPageHeader;
