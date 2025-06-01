"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import FilterMemescope from "../filter/FilterMemescope";
import { solana } from "@/app/Images";
import RightModalOpenSetting from "@/components/Settings/RightModalOpenSetting";
import { IoSettingsOutline } from "react-icons/io5";
import { setGlobalBuyAmt, setOpenOrderSetting, setSolWalletAddress } from "@/app/redux/states";
import { useTranslation } from "react-i18next";
import { ChevronDown, List, Eye, LayoutGrid, Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { LuWalletMinimal } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa";
import { showToastLoader } from "../toastLoader/ToastLoder";
const AllPageHeader = ({ HeaderData, duration, FilterData, localFilterTime, setLocalFilterTime, setFilterValues, filterValues, onApply, onReset, setSelectedMetric, selectedMetric, setSearchbar, searchbar, setShowCircle, showCircle, setShowMarketCap, showMarketCap, showVolume, setShowVolume, showSocials, setShowSocials, setShowHolders, showHolders, setshowHolders10, showHolders10, setProgerssBar, progerssBar }) => {
  const filterPopupRef = useRef(null);
  const dexesPopupRef = useRef(null);
  const { t } = useTranslation();
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
  const displayPanelRef = useRef(null);
  const displayButtonRef = useRef(null);

  // const [presist, setPresist] = useState("P1");
  const buttonRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [allWallets, setAllWallets] = useState([]);

  // Close dropdown when clicking outside

  // order setting popup flag
  const isRightModalOpenSetting = useSelector(
    (state) => state?.AllStatesData?.openOrderSetting
  );
  const presist = useSelector((state) => state?.AllStatesData?.presetActive);

  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  const quickBuy = useSelector((state) => state?.AllStatesData?.globalBuyAmt);
  const handleInputChange = (event) => {
    let value = event.target.value;

    // Allow only numbers and a single dot
    if (!/^\d*\.?\d*$/.test(value)) return;

    // Remove dot for digit count check
    const digitCount = value.replace('.', '');

    // Only allow if total digits (excluding dot) are <= 10
    if (digitCount.length <= 10) {
      dispatch(setGlobalBuyAmt(value));
    }
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(wallet.wallet || "BEsA4G");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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


  const getAllWallets = async (e) => {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return 0;
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}user/getAllWallets`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const wallets = response?.data?.data?.wallets?.walletAddressSOL;
      setAllWallets(wallets);

      setWalletAddresses(response?.data?.data?.wallets?.walletAddressSOL);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllWallets();
  }, []);

  // Utility function to toggle or set values in localStorage and component state
  const toggleSetting = (key, currentValue, setState, newValue = null) => {
    const settings = JSON.parse(localStorage.getItem("DisplaySettings")) || {};

    // If newValue is explicitly provided (e.g., for string settings), use it; otherwise toggle the boolean
    const updatedValue = newValue !== null ? newValue : !currentValue;

    const updatedSettings = {
      ...settings,
      [key]: updatedValue,
    };

    localStorage.setItem("DisplaySettings", JSON.stringify(updatedSettings));
    setState(updatedValue);
  };

  // Toggle functions for boolean settings
  const toggleSearchbar = () => {
    toggleSetting("searchbar", searchbar, setSearchbar);
  };

  const toggleShowCircle = () => {
    toggleSetting("showCircle", showCircle, setShowCircle);
  };

  const toggleProgerssBar = () => {
    toggleSetting("showProgessBar", progerssBar , setProgerssBar)
  }

  const mktShowHide = () => {
    toggleSetting("showMarketCap", showMarketCap, setShowMarketCap);
  };

  const volumeShowHide = () => {
    toggleSetting("showVolume", showVolume, setShowVolume);
  };

  const socialsShowHide = () => {
    toggleSetting("showSocials", showSocials, setShowSocials);
  };

  const holderShowHide = () => {
    toggleSetting("showHolders", showHolders, setShowHolders);
  };

  const holderShowHide10 = () => {
    toggleSetting("showHolders10", showHolders10, setshowHolders10);
  };

  // Function for updating a string setting (like a selected metric)
  const handleMetricChange = (newMetric) => {
    toggleSetting("selectedMetric", selectedMetric, setSelectedMetric, newMetric);
  };


  const handlePrimary = async (walletIndex, loopIndex) => {
    console.log("===<><>", walletIndex, loopIndex);
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return 0;
    try {
      showToastLoader("Switching wallet", "switch-toast");
      await axios
        .put(
          `${baseUrl}user/makeSolWalletPrimary`,
          {
            index: walletIndex,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        )
        .then(async (res) => {
          const findXPrimaryIndex = await walletAddresses.findIndex(
            (item) => item?.primary
          );
          setWalletAddresses((pre) => {
            const preArr = [...pre];
            if (findXPrimaryIndex !== -1) preArr[findXPrimaryIndex].primary = false;
            preArr[loopIndex].primary = true;
            return preArr;
          });
          localStorage.setItem(
            "walletAddress",
            res?.data?.data?.wallet?.wallet
          );
          toast.success("Primary wallet switched", {
            id: "switch-toast",
            duration: 2000,
          });
          dispatch(setSolWalletAddress());
        })
        .catch((err) => {
          console.log("🚀 ~ ).then ~ err:", err?.message);
        });
    } catch (error) {
      console.error(error);
      toast.error("Primary not wallet switched", {
        id: "switch-toast",
        duration: 2000,
      });
    }
  };

    useEffect(() => {
    const handleClickOutsideDisplay = (event) => {
      if (
        displayPanelRef.current &&
        !displayPanelRef.current.contains(event.target) &&
        displayButtonRef.current &&
        !displayButtonRef.current.contains(event.target)
      ) {
        setIsDisplayOpen(false);
      }
    };

    if (isDisplayOpen) {
      document.addEventListener('mousedown', handleClickOutsideDisplay);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDisplay);
    };
  }, [isDisplayOpen]);

  // --- Effect to close Wallet dropdown on outside click ---
  useEffect(() => {
    const handleClickOutsideWallet = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutsideWallet);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideWallet);
    };
  }, [open]);


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
      <div className="flex flex-wrap lg:items-center md:justify-end gap-2 overflow-x-auto md:mt-0">
        {duration && (
          <div
            // w-[348px]
            className={`flex `}
          >
            {HeaderData?.timeDuration?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(option)}
                className={`py-2 px-3 text-sm  font-semibold hover:bg-[#1F73FC]/[30%] rounded-md ${option === localFilterTime && " !text-[#1F73FC]"
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
                ref={displayButtonRef}>
                  <List size={16} className="mr-2" />
                  Display
                  <ChevronDown size={16} className="ml-2" />
                </button>
              )}

              {/* Dropdown Panel */}
              {isDisplayOpen && (
                <div className="absolute right-44 mt-2 w-[320px] bg-[#18181a] border border-gray-700 text-white rounded-md shadow-xl !z-[9999]" ref={displayPanelRef} >
                  <div className="p-4 space-y-4">

                    {/* Metrics */}
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-2">Metrics</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          className={`py-2 px-3 rounded border border-[#323642] ${selectedMetric === '12' ? 'bg-[#323642] text-white font-bold' : ' text-gray-300'
                            }`}
                          onClick={() => handleMetricChange('12')}
                        >
                          MC 77K <br /> Small
                        </button>
                        <button
                          className={`py-2 px-3 rounded border border-[#323642] ${selectedMetric === '20' ? 'bg-[#323642] text-white font-bold' : ' text-gray-300'
                            }`}
                          onClick={() => handleMetricChange('20')}
                        >
                          MC 77K <br /> Large
                        </button>
                      </div>
                    </div>


                    {/* Quick Buy */}
                    {/* <div>
                      <p className="text-xs text-gray-400 font-semibold mb-2">Quick Buy</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {["Small", "Large", "Mega"].map((size) => (
                          <button
                            key={size}
                            className="bg-[#1f1f1f] py-2 px-2 rounded text-center font-medium hover:bg-[#2a2a2a]"
                          >
                            <div className="text-blue-400">⚡</div>
                            {size}
                          </button>
                        ))}
                      </div>
                    </div> */}

                    {/* Toggles */}
                    <div className="border-t border-gray-700 pt-4 space-y-3 text-sm">
                      <div
                        className="flex items-center gap-2 cursor-pointer font-semibold"
                        onClick={() => toggleSearchbar(prev => !prev)}
                      >
                        {searchbar ? <Search size={16} /> : <BsFillSearchHeartFill />}
                        {searchbar ? 'Hide Search Bar' : 'Show Search Bar'}
                      </div>

                      <div className="flex items-center gap-2 cursor-pointer font-semibold" onClick={() => toggleShowCircle(prev => !prev)}>
                        {showCircle ? <LayoutGrid size={16} /> : <FaRegCircle />}
                        {showCircle ? 'Square Image' : 'Circle Imange'}
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer font-semibold" onClick={()=> toggleProgerssBar(prev => !prev)}>
                        <div className="w-4 h-1 bg-gray-400 rounded-full" />
                        {progerssBar ? "Progress Bar Ring" : "Progress Bar Line"}
                      </div>
                    </div>

                    {/* Customize Rows */}
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-xs text-gray-400 font-semibold mb-2">Customize rows</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Market Cap", "Volume", "Socials", "Holders",
                          "Top 10 Holders",
                        ].map((item) => {
                          const isActive =
                            (item === "Market Cap" && showMarketCap) ||
                            (item === "Volume" && showVolume) ||
                            (item === "Socials" && showSocials) ||
                            (item === "Holders" && showHolders) ||
                            (item === "Top 10 Holders" && showHolders10);

                          return (
                            <button
                              key={item}
                              className={`${isActive ? "bg-[#282b32]" : "border border-[#282b32] text-gray-500"} text-xs px-2 py-1 rounded cursor-pointer hover:bg-[#2a2a2a]`}
                              onClick={() => {
                                if (item === "Market Cap") {
                                  mktShowHide();
                                } else if (item === "Volume") {
                                  volumeShowHide();
                                } else if (item === "Socials") {
                                  socialsShowHide();
                                } else if (item === "Holders") {
                                  holderShowHide();
                                } else if (item === "Top 10 Holders") {
                                  holderShowHide10();
                                }
                              }}
                            >
                              {item}
                            </button>
                          );
                        })}
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
            />

            <div className=" inline-block">
              {/* Wallet Button */}
              <div
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                className="flex items-center mr-2 space-x-2 px-5 py-2 bg-[#1a1a1a] rounded-full text-[#ecf6fd] text-sm font-medium cursor-pointer"
              >
                {/* Wallet Icon */}
                <LuWalletMinimal size={20} />
                <span>1</span>

                {/* Solana Icon */}
                <Image src={solana} width={20} height={20} alt="solana" />
                <span>0</span>

                {/* Dropdown Icon */}
                <FaAngleDown size={20} />
              </div>

              {open && (
                <div
                  ref={dropdownRef}
                  className="absolute right-20 mt-2 w-96 max-h-80 overflow-y-auto bg-[#18181a] border border-gray-700 text-white rounded-md shadow-lg z-50"
                >

                  {/* Wallet List */}
                  {allWallets.map((wallet, idx) => {
                    // Move state and handler inside the map for each wallet


                    const handleCopy = async (e) => {
                      e.stopPropagation();
                      try {
                        await navigator.clipboard.writeText(wallet.wallet || "BEsA4G");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
                      } catch (err) {
                        console.error('Failed to copy: ', err);
                      }
                    };

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 hover:bg-[#2a2a2a] ${wallet.active ? "bg-[#18181a]" : ""
                          }`}
                      >
                        {/* Checkbox and wallet info */}
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border border-gray-500 bg-transparent checked:bg-[#ff8f1b] checked:border-[#ff8f1b] focus:ring-2 focus:ring-[#ff8f1b] focus:ring-opacity-50"
                            checked={wallet.primary}
                            onChange={() => handlePrimary(wallet.index, idx)}
                          />
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-medium ${wallet.primary ? "text-orange-400" : "text-white"
                                }`}
                            >
                              {idx === 0 ? "Moon Pro Main" : "Wallet"}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <span>·</span>
                              <span>{wallet.wallet?.slice(0, 5) || "BEsA4"}</span>
                              <button
                                className="w-4 h-4 flex items-center justify-center text-xs transition-colors duration-200 hover:bg-gray-600 rounded"
                                onClick={handleCopy}
                                title={copied ? "Copied!" : "Copy wallet address"}
                              >
                                {copied ? (
                                  // Check mark icon
                                  <IoCheckmarkDone />

                                ) : (
                                  // Copy icon
                                  <IoCopyOutline />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right side - Add your balance and toggle sections here */}
                        <div className="flex items-center gap-4">
                          {/* Solana balance */}
                          <div className="flex items-center gap-2">
                            <Image
                              src={solana}
                              width={16}
                              height={16}
                              alt="solana"
                            />
                            <span className="text-sm font-medium">0</span>
                          </div>

                          
                        </div>
                      </div>
                    );
                  })}
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
              <div className="px-2 py-1 font-semibold text-[#f4fcff">
                Quick Buy
              </div>

              {/* Middle section: Amount input */}
              <div className="px-2 py-1 text-[#777f94] font-medium">
                <div className="">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="bg-transparent text-[#777f94] text-xs w-8 outline-none"
                    value={quickBuy}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Right section: Solana + value */}
              <div
                className="flex items-center gap-1 px-3 py-1 border-l border-[#26262e] cursor-pointer"
                onClick={() => dispatch(setOpenOrderSetting(true))}
              >
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
