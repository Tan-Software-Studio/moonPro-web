import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSolWalletAddress } from "@/app/redux/states";
import { LuWalletMinimal } from "react-icons/lu";
import { IoCheckmarkDone, IoCopyOutline } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { showToastLoader } from "../toastLoader/ToastLoder";
import { updateWalletToPrimary } from "@/app/redux/userDataSlice/UserData.slice";
import { showToaster } from "@/utils/toaster/toaster.style";
import { solana } from "@/app/Images";

const WalletSwapButton = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state?.userData?.userDetails);
  const reduxWallets = userDetails?.walletAddressSOL || [];
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [copiedWallet, setCopiedWallet] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const modalRef = useRef(null); // To reference the parent modal
  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  // Format wallet address to show first 4 and last 4 characters
  const formatWalletAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Get wallet balance from Redux data
  const getWalletBalance = (walletAddress) => {
    if (!walletAddress || !reduxWallets?.length) return "0";
    const wallet = reduxWallets?.find((w) => w.wallet === walletAddress);
    return wallet?.balance !== undefined
      ? parseFloat(wallet.balance).toFixed(4)
      : "0";
  };

  // Handle making a wallet primary
  const handlePrimary = async (walletIndex, loopIndex) => {
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
          localStorage.setItem(
            "walletAddress",
            res?.data?.data?.wallet?.wallet
          );
          toast.success("Primary wallet switched", {
            id: "switch-toast",
            duration: 2000,
          });
          dispatch(updateWalletToPrimary(res?.data?.data?.wallet?.wallet));
          dispatch(setSolWalletAddress());
        })
        .catch((err) => {
          console.log("🚀 ~ ).then ~ err:", err?.message);
        });
    } catch (error) {
      console.error(error);
      showToaster("Primary not wallet switched.");
    }
  };

  // Calculate dropdown position relative to button and modal
  const updateDropdownPosition = () => {
    if (buttonRef.current && modalRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const dropdownWidth = 384; // Approximate width of dropdown (w-96 = 384px)
      const dropdownHeight = 320; // Approximate max-height of dropdown (max-h-80 = 320px)

      // Calculate position relative to the modal
      let top = buttonRect.bottom - modalRect.top + 5; // 5px gap below button, relative to modal
      let left = 0;

      // Adjust if dropdown would extend beyond the bottom of the viewport
      const absoluteTop = buttonRect.bottom + window.scrollY + 5;
      if (absoluteTop + dropdownHeight > windowHeight + window.scrollY) {
        top = buttonRect.top - modalRect.top - dropdownHeight - 5; // Place above button if no space below
      }

      // Adjust if dropdown would extend beyond the right of the viewport
      const absoluteLeft = buttonRect.left + window.scrollX;
      if (absoluteLeft + dropdownWidth > windowWidth + window.scrollX) {
        left = -dropdownWidth;
      }
      
      setDropdownPosition({ top, left });
    }
  };

  // Find the parent modal element
  useEffect(() => {
    if (buttonRef.current) {
      let parent = buttonRef.current.parentElement;
      while (parent) {
        if (parent.classList?.contains('pointer-events-auto')) {
          modalRef.current = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }
  }, []);

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

    // Update position when dropdown opens, window is resized, or modal is dragged
    if (open) {
      updateDropdownPosition();
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition);
      // Listen for modal movement (assuming transform changes trigger a resize-like effect)
      const observer = new MutationObserver(updateDropdownPosition);
      if (modalRef.current) {
        observer.observe(modalRef.current, {
          attributes: true,
          attributeFilter: ['style'],
        });
      }
      return () => {
        observer.disconnect();
      };
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition);
    };
  }, [open]);

  return (
    <div className="relative flex items-center space-x-1 overflow-visible">
      <div>
        <div
          ref={buttonRef}
          onClick={(event) => {
            event.stopPropagation();
            if (!open) {
              updateDropdownPosition();
            }
            setOpen(!open);
          }}
          className="group flex items-center space-x-2 px-2 border border-[#323542] rounded-full text-[#ecf6fd] text-xs font-medium cursor-pointer"
        >
          <LuWalletMinimal size={12} className={`group-hover:text-[#fcfcfc] transition-colors`} />
          <span>{reduxWallets?.length}</span>
        </div>

        {open && (
          <div
            ref={dropdownRef}
            className="absolute w-96 max-h-80 overflow-y-auto bg-[#18181a] border border-gray-700 text-white rounded-md shadow-lg z-[60]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            {reduxWallets?.map((wallet, idx) => {
              const handleCopy = async (e) => {
                e.stopPropagation();
                try {
                  await navigator.clipboard.writeText(
                    wallet.wallet || "BEsA4G"
                  );
                  setCopiedWallet(wallet.wallet);
                  setTimeout(() => setCopiedWallet(null), 2000);
                } catch (err) {
                  console.error("Failed to copy: ", err);
                }
              };

              return (
                <div
                  key={wallet._id || wallet.id || idx}
                  className={`flex items-center justify-between p-3 hover:bg-[#2a2a2a] ${
                    wallet.active ? "bg-[#18181a]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border border-gray-500 bg-transparent checked:bg-[#ff8f1b] checked:border-[#ff8f1b] focus:ring-2 focus:ring-[#ff8f1b] focus:ring-opacity-50"
                      checked={wallet.primary}
                      onChange={() => handlePrimary(wallet?.index, idx)}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`font-medium ${
                            wallet.primary ? "text-orange-400" : "text-white"
                          }`}
                        >
                          {idx === 0 ? "Moon Pro Main" : `Wallet ${idx + 1}`}
                        </span>
                        <span className="text-gray-400">
                          {formatWalletAddress(wallet.wallet)}
                        </span>
                        <button
                          className="w-4 h-4 flex items-center justify-center text-xs transition-colors duration-200 hover:bg-gray-600 rounded"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCopy
                          }}
                          title={
                            copiedWallet === wallet.wallet
                              ? "Copied!"
                              : "Copy wallet address"
                          }
                        >
                          {copiedWallet === wallet.wallet ? (
                            <IoCheckmarkDone />
                          ) : (
                            <IoCopyOutline />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src={solana}
                        width={16}
                        height={16}
                        alt="solana"
                      />
                      <span className="text-sm font-medium">
                        {getWalletBalance(wallet.wallet)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {reduxWallets?.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No wallets found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSwapButton;