import { barchart, discord, docs, twitter, solana, bitcoinIcon, eth, Solana, articlefill } from "@/app/Images";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOpenOrderSetting, setSolWalletAddress } from "@/app/redux/states";
import RightModalOpenSetting from "../Settings/RightModalOpenSetting";
import { LuWalletMinimal } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa";
import { IoCheckmarkDone, IoCopyOutline } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { showToastLoader } from "../common/toastLoader/ToastLoder";
import PnLTrackerPopup from "./PnLTrackerPopup";
// import { fetchAllWalletBalances } from "@/app/redux/userDataSlice/UserData.slice";

const Footer = () => {
  const dispatch = useDispatch();
  const borderColor = useSelector((state) => state?.AllthemeColorData?.borderColor);
  const isRightModalOpenSetting = useSelector((state) => state?.yourSliceName?.isRightModalOpenSetting);
  const tredingPage = useSelector((state) => state?.yourSliceName?.tredingPage);

  const presetActive = useSelector((state) => state?.AllStatesData?.presetActive);

  const isLargeScreen = useSelector((state) => state?.AllthemeColorData?.isLargeScreen);
  const isSmallScreenData = useSelector((state) => state?.AllthemeColorData?.isSmallScreen);
  const isSidebarOpen = useSelector((state) => state?.AllthemeColorData?.isSidebarOpen);

  // Get wallet balances from Redux using the correct structure from your example
  const userDetails = useSelector((state) => state?.userDataSlice?.userDetails || state?.userData?.userDetails);
  // const reduxWallets = userDetails?.walletAddressSOL || [];
  // const isLoadingBalances = useSelector(
  //   (state) => state?.userDataSlice?.balancesLoading || state?.userData?.balancesLoading
  // );

  const [open, setOpen] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(null);
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [allWallets, setAllWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPnLPopupOpen, setIsPnLPopupOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  const handlePresetClick = () => {
    dispatch(setOpenOrderSetting(true));
  };

  const handlePnLTrackerClick = () => {
    setIsPnLPopupOpen(!isPnLPopupOpen);
  };

  const getPresetDisplayName = (preset) => {
    if (!preset) return "PRESET 1";

    const presetNumber = preset.replace("P", "");
    return `PRESET ${presetNumber}`;
  };

  // Format wallet address to show first 4 and last 4 characters
  const formatWalletAddress = (address) => {
    if (!address) return "BEsA4...B2K5";
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // FIXED: Get wallet balance - simplified and more reliable
  const getWalletBalance = (walletAddress) => {
    if (!walletAddress || !reduxWallets.length) return "0";

    const wallet = reduxWallets.find((w) => w.wallet === walletAddress);
    return wallet?.balance !== undefined ? parseFloat(wallet.balance).toFixed(4) : "0";
  };

  // FIXED: Get primary wallet balance
  const getPrimaryWalletBalance = () => {
    const primaryWallet = reduxWallets.find((w) => w.primary);
    return primaryWallet?.balance !== undefined ? parseFloat(primaryWallet.balance).toFixed(4) : "0";
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

  // Use Redux data if available, otherwise fallback to local state
  // const walletsToShow = reduxWallets.length > 0 ? reduxWallets : allWallets;

  useEffect(() => {
    getAllWallets();
  }, []);

  // ADDED: Effect to fetch balances when component mounts or wallets change
  // useEffect(() => {
  //   if (reduxWallets.length > 0) {
  //     // Check if balances are missing or outdated
  //     const needsBalanceUpdate = reduxWallets.some(
  //       (wallet) => wallet.balance === undefined || !wallet.lastUpdated || Date.now() - wallet.lastUpdated > 60000 // 1 minute cache
  //     );

  //     if (needsBalanceUpdate) {
  //       dispatch(fetchAllWalletBalances(reduxWallets));
  //     }
  //   }
  // }, [reduxWallets, dispatch]);

  const handlePrimary = async (walletIndex, loopIndex) => {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return 0;
    try {
      showToastLoader("Switching primary wallet", "switch-toast");
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
          const findXPrimaryIndex = await walletAddresses.findIndex((item) => item?.primary);
          setWalletAddresses((pre) => {
            const preArr = [...pre];
            if (findXPrimaryIndex !== -1) preArr[findXPrimaryIndex].primary = false;
            preArr[loopIndex].primary = true;
            return preArr;
          });

          // Also update allWallets if using fallback
          // if (reduxWallets.length === 0) {
          //   setAllWallets((pre) => {
          //     const preArr = [...pre];
          //     const primaryIndex = preArr.findIndex((item) => item?.primary);
          //     if (primaryIndex !== -1) preArr[primaryIndex].primary = false;
          //     preArr[loopIndex].primary = true;
          //     return preArr;
          //   });
          // }
          localStorage.setItem("walletAddress", res?.data?.data?.wallet?.wallet);
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

  const getFooterPadding = () => {
    if ((isSidebarOpen && isLargeScreen) || (isSidebarOpen && isSmallScreenData)) {
      return "md:pl-48";
    }
    return "md:pl-[64px]";
  };

  // Handle external links
  const handleDiscordClick = () => {
    window.open("https://discord.gg/", "_blank");
  };

  const handleTwitterClick = () => {
    window.open("https://twitter.com/", "_blank");
  };

  const handleDocsClick = () => {
    window.open("https://gitbook.org", "_blank");
  };

  // ADDED: Refresh balances function
  // const handleRefreshBalances = () => {
  //   if (reduxWallets.length > 0) {
  //     dispatch(fetchAllWalletBalances(reduxWallets));
  //   }
  // };

  return (
    <>
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0F] border-t ${borderColor}  py-1 ${getFooterPadding()}`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePresetClick}
              className="flex items-center space-x-1.5 bg-[#151c3c] px-2 py-1.5 ml-1 rounded-md text-[#4c6eff] text-xs font-medium transition-colors duration-200 border border-[#6366F1]/20"
            >
              <span className="text-[11px] font-bold">⚡</span>
              <span className="font-semibold tracking-wide">{getPresetDisplayName(presetActive)}</span>
            </button>

            <div className="flex items-center space-x-1">
              <div className="relative inline-block">
                <div
                  ref={buttonRef}
                  onClick={() => setOpen(!open)}
                  className="flex items-center space-x-2 px-3 py-1 bg-[#1a1a1a] rounded-full text-[#ecf6fd] text-sm font-medium cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                >
                  <LuWalletMinimal size={16} />
                  {/* <span>{walletsToShow.length}</span> */}
                  <span>1</span>

                  <Image src={solana} width={16} height={16} alt="solana" />
                  {/* <span className={isLoadingBalances ? "opacity-50" : ""}>
                    {isLoadingBalances ? "..." : getPrimaryWalletBalance()}
                  </span> */}
                  <span>0</span>

                  <FaAngleDown size={14} />
                </div>

                {open && (
                  <div
                    ref={dropdownRef}
                    className="absolute bottom-full left-0 mb-2 w-96 max-h-80 overflow-y-auto bg-[#18181a] border border-gray-700 text-white rounded-md shadow-lg z-50"
                  >
                    {/* ADDED: Refresh button in dropdown */}
                    {/* <div className="p-2 border-b border-gray-700">
                      <button
                        // onClick={handleRefreshBalances}
                        disabled={isLoadingBalances}
                        className="w-full px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm disabled:opacity-50"
                      >
                        {isLoadingBalances ? "Refreshing..." : "Refresh Balances"}
                      </button>
                    </div> */}

                    {allWallets.map((wallet, idx) => {
                      const handleCopy = async (e) => {
                        e.stopPropagation();
                        try {
                          await navigator.clipboard.writeText(wallet.wallet || "BEsA4G");
                          setCopiedWallet(wallet.wallet);
                          setTimeout(() => setCopiedWallet(null), 2000);
                        } catch (err) {
                          console.error("Failed to copy: ", err);
                        }
                      };

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 hover:bg-[#2a2a2a] ${
                            wallet.active ? "bg-[#18181a]" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border border-gray-500 bg-transparent checked:bg-[#ff8f1b] checked:border-[#ff8f1b] focus:ring-2 focus:ring-[#ff8f1b] focus:ring-opacity-50"
                              checked={wallet.primary}
                              onChange={() => handlePrimary(wallet.index, idx)}
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 text-sm">
                                <span className={`font-medium ${wallet.primary ? "text-orange-400" : "text-white"}`}>
                                  {idx === 0 ? "Moon Pro Main" : "Wallet"}
                                </span>
                                <span className="text-gray-400">{formatWalletAddress(wallet.wallet)}</span>
                                <button
                                  className="w-4 h-4 flex items-center justify-center text-xs transition-colors duration-200 hover:bg-gray-600 rounded"
                                  onClick={handleCopy}
                                  title={copiedWallet === wallet.wallet ? "Copied!" : "Copy wallet address"}
                                >
                                  {copiedWallet === wallet.wallet ? <IoCheckmarkDone /> : <IoCopyOutline />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Image src={solana} width={16} height={16} alt="solana" />
                              <span className="text-sm font-medium">0</span>
                              {/* FIXED: Use the corrected balance function */}
                              {/* <span className={`text-sm font-medium ${isLoadingBalances ? "opacity-50" : ""}`}>
                                {isLoadingBalances ? "..." : getWalletBalance(wallet.wallet)}
                              </span> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                className="flex items-center space-x-2 bg-[#1F2937] hover:bg-[#374151] px-2 py-1.5 rounded-md text-gray-300 hover:text-white text-xs font-medium transition-all duration-200 border border-gray-600/30"
                onClick={handlePnLTrackerClick}
              >
                <Image src={barchart} alt="barchart" height={16} width={16} className="rounded-sm opacity-80" />
                <span className="font-medium">PnL Tracker</span>
              </button>

              <div className="h-6 w-px bg-gray-600/50"></div>

              {/* Commented out crypto prices as requested */}
              {/* 
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-orange-400 font-medium">
                  <Image src={bitcoinIcon} alt="bitcoinIcon" height={16} width={16} className="rounded-full" />
                  <span>$106.0K</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-400 font-medium">
                  <Image src={eth} alt="eth" height={16} width={16} className="rounded-full" />
                  <span>$262.0</span>
                </div>
                <div className="flex items-center space-x-1 text-green-400 font-medium">
                  <Image src={Solana} alt="Solana" height={16} width={16} className="rounded-full" />
                  <span>$164.91</span>
                </div>
              </div>
              */}
            </div>
          </div>

          <div className="flex items-center space-x-4"></div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Connection is stable</span>
            </div>

            <div className="h-6 w-px bg-gray-600/50"></div>

            <div className="flex items-center space-x-1">
              <button className="text-gray-400 hover:text-white transition-colors" onClick={handleDiscordClick}>
                <Image src={discord} alt="discord" height={20} width={20} className="rounded-full" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors" onClick={handleTwitterClick}>
                <Image src={twitter} alt="twitter" height={20} width={20} className="rounded-full" />
              </button>
              <button className="flex text-gray-400 hover:text-white transition-colors" onClick={handleDocsClick}>
                Docs
              </button>
            </div>
          </div>
        </div>
      </footer>

      <RightModalOpenSetting
        ordersettingLang={tredingPage?.mainHeader?.ordersetting}
        isOpen={isRightModalOpenSetting}
        onClose={() => dispatch(setOpenOrderSetting(false))}
        tredingPage={tredingPage}
      />

      <PnLTrackerPopup isOpen={isPnLPopupOpen} onClose={() => setIsPnLPopupOpen(false)} />
    </>
  );
};

export default Footer;
