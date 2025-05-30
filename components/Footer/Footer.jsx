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

const Footer = () => {
  const dispatch = useDispatch();
  const borderColor = useSelector((state) => state?.AllthemeColorData?.borderColor);
  const isRightModalOpenSetting = useSelector((state) => state?.yourSliceName?.isRightModalOpenSetting);
  const tredingPage = useSelector((state) => state?.yourSliceName?.tredingPage);

  const isLargeScreen = useSelector((state) => state?.AllthemeColorData?.isLargeScreen);
  const isSmallScreenData = useSelector((state) => state?.AllthemeColorData?.isSmallScreen);
  const isSidebarOpen = useSelector((state) => state?.AllthemeColorData?.isSidebarOpen);

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  useEffect(() => {
    getAllWallets();
  }, []);

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
              <span className="font-semibold tracking-wide">PRESET 1</span>
            </button>

            <div className="flex items-center space-x-1">
              <div className="relative inline-block">
                <div
                  ref={buttonRef}
                  onClick={() => setOpen(!open)}
                  className="flex items-center space-x-2 px-3 py-1 bg-[#1a1a1a] rounded-full text-[#ecf6fd] text-sm font-medium cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                >
                  <LuWalletMinimal size={16} />
                  <span>1</span>

                  <Image src={solana} width={16} height={16} alt="solana" />
                  <span>0</span>

                  <FaAngleDown size={14} />
                </div>

                {open && (
                  <div
                    ref={dropdownRef}
                    className="absolute bottom-full left-0 mb-2 w-96 max-h-80 overflow-y-auto bg-[#18181a] border border-gray-700 text-white rounded-md shadow-lg z-50"
                  >
                    {allWallets.map((wallet, idx) => {
                      const handleCopy = async (e) => {
                        e.stopPropagation();
                        try {
                          await navigator.clipboard.writeText(wallet.wallet || "BEsA4G");
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
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
                              <span
                                className={`text-sm font-medium ${wallet.primary ? "text-orange-400" : "text-white"}`}
                              >
                                {idx === 0 ? "Moon Pro Main" : "Wallet"}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <span className="text-green-400">⚡</span>
                                  <span>{wallet.status || "off"}</span>
                                </span>
                                <span>·</span>
                                <span>{wallet.wallet?.slice(0, 5) || "BEsA4"}</span>
                                <button
                                  className="w-4 h-4 flex items-center justify-center text-xs transition-colors duration-200 hover:bg-gray-600 rounded"
                                  onClick={handleCopy}
                                  title={copied ? "Copied!" : "Copy wallet address"}
                                >
                                  {copied ? <IoCheckmarkDone /> : <IoCopyOutline />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Image src={solana} width={16} height={16} alt="solana" />
                              <span className="text-sm font-medium">0</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                                  wallet.active ? "bg-gray-600" : "bg-gray-700"
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                    wallet.active ? "translate-x-0.5" : "translate-x-5"
                                  }`}
                                />
                              </div>
                              <span className="text-sm font-medium">0</span>
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

              {/* todo: add real btc | eth | sol */}
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
              <button className="text-gray-400 hover:text-white transition-colors">
                <Image src={discord} alt="discord" height={20} width={20} className="rounded-full" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Image src={twitter} alt="twitter" height={20} width={20} className="rounded-full" />
              </button>
              <button className="flex text-gray-400 hover:text-white transition-colors">
                {/* <Image src={articlefill} alt="articleline" height={20} width={20} className="rounded-full" /> */}
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
