"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose, IoCopyOutline, IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { PiShare } from "react-icons/pi";
import { FaCaretDown, FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { lang } from "@/app/contsants/lang";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { setSolWalletAddress } from "@/app/redux/states";
import { updatePnlTableData } from "@/app/redux/holdingDataSlice/holdingData.slice";
import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import {
  makeUserEmptyOnLogout,
  resetActiveWalletAddress,
} from "@/app/redux/userDataSlice/UserData.slice";
import EditReferralCode from "./EditReferralCode";
import getPointsToNextTitle from "@/components/referral/getPointsToNextTitle";
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL;
const AccountSecurity = ({ setIsAccountPopup, handlePhrase, userDetails }) => {
  const [language, setLanguage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const { t } = useTranslation();

  const navbar = t("navbar");
  const dispatch = useDispatch();
  const router = useRouter();
  const { i18n } = useTranslation();

  const referralLink = `${WEB_URL}/referral/${userDetails?.referralId || ""}`;
  const { currentTitle } = getPointsToNextTitle(userDetails);

  const getDisplayName = () => {
    if (userDetails?.phantomAddress) {
      return userDetails.phantomAddress;
    }
    return userDetails?.email;
  };

  const getAvatarInitial = () => {
    const displayName = getDisplayName();
    if (displayName === "N/A") return "N";
    return displayName[0]?.toUpperCase() || "N";
  };

  async function handleLanguageSelector(item) {
    await i18n.changeLanguage(item?.code);
    setLanguage(item);
    setIsModalOpen(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("walletAddress");
    dispatch(setSolWalletAddress());
    dispatch(resetActiveWalletAddress());
    dispatch(makeUserEmptyOnLogout());
    setIsAccountPopup(false);

    router.replace("/trending");
    googleLogout();
  };

  const truncateId = (id, startChars = 4, endChars = 4) => {
    if (!id) return "N/A";
    if (id.length <= startChars + endChars) return id;
    return `${id.substring(0, startChars)}...${id.substring(
      id.length - endChars
    )}`;
  };

  const formatTimeAgo = (date) => {
    if (!date) return "N/A";
    const now = new Date();
    const loginDate = new Date(date);
    const diffTime = Math.abs(now - loginDate);

    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "1d";
    if (diffDays < 30) return `${diffDays}d`;
    if (diffMonths < 12) return `${diffMonths}mo`;
    return `${diffYears}y`;
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "userId") {
        setCopiedUserId(true);
        setTimeout(() => setCopiedUserId(false), 2000);
      } else if (type === "referral") {
        setCopiedReferral(true);
        setTimeout(() => setCopiedReferral(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareOnPlatform = (platform) => {
    const shareText = `Join me on NexaPro and start earning rewards! Use my referral link: ${referralLink}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(referralLink);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(
        "Join me on NexaPro!"
      )}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
      setIsShareModalOpen(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on MoonPro!",
          text: "Start earning rewards with my referral link",
          url: referralLink,
        });
        setIsShareModalOpen(false);
      } catch (err) {
        console.log("Native share cancelled or failed");
      }
    } else {
      copyToClipboard(referralLink, "referral");
      setIsShareModalOpen(false);
    }
  };

  useEffect(() => {
    // Change languge state
    const langLocal = lang.find((item) => item?.code == i18n.language);
    setLanguage(langLocal);
  }, []);

  return (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsAccountPopup(false)}
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center !z-[999999999999999] p-2 sm:p-4"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[700px] bg-[#08080E] rounded-md !z-[999999999999999] md:max-h-[95vh] max-h-[70vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="">
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-[#404040]">
              <div className="text-base sm:text-lg font-medium text-white truncate">
                {navbar?.acountandsecurity?.acountandsecurity}
              </div>
              <div
                onClick={() => setIsAccountPopup(false)}
                className="cursor-pointer p-1"
              >
                <IoClose size={18} />
              </div>
            </div>

            <div className="px-3 sm:px-4 py-4 border-b-[1px] border-[#404040]">
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className="w-[40px] h-[40px] flex justify-center items-center font-bold rounded-md bg-orange-400 flex-shrink-0">
                  {getAvatarInitial()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium mb-2 truncate">
                    {getDisplayName()}
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-6 text-xs">
                    <div className="text-center sm:text-left">
                      <div className="text-[#A8A8A8] mb-1 text-[10px] sm:text-xs">
                        {navbar?.acountandsecurity?.level1}
                      </div>
                      <div className="text-white font-medium text-xs">
                        {currentTitle} 🏆
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-[#A8A8A8] mb-1 text-[10px] sm:text-xs">
                        {navbar?.acountandsecurity?.level2}
                      </div>
                      <div className="text-white font-medium text-xs">
                        {formatTimeAgo(userDetails?.lastLogin)}
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-[#A8A8A8] mb-1 text-[10px] sm:text-xs flex items-center gap-2">
                        <div>{navbar?.acountandsecurity?.level3}</div>
                        {!userDetails?.referralEdit ? (
                          <div>
                            <EditReferralCode />
                          </div>
                        ) : null}
                      </div>
                      <div className="text-white font-medium cursor-pointer flex items-center justify-center sm:justify-start gap-1 text-xs">
                        <span className="truncate max-w-[60px] sm:max-w-none">
                          {userDetails?.referralId || "N/A"}
                        </span>
                        {userDetails?.referralId && (
                          <>
                            {copiedReferral ? (
                              <FaCheck className="text-green-400 text-xs flex-shrink-0" />
                            ) : (
                              <IoCopyOutline
                                className="cursor-pointer text-xs hover:text-white transition-colors flex-shrink-0"
                                onClick={() =>
                                  copyToClipboard(
                                    userDetails.referralId,
                                    "referral"
                                  )
                                }
                                title="Copy Referral Code"
                              />
                            )}
                            <div className="relative">
                              <PiShare
                                className="cursor-pointer text-xs hover:text-white transition-colors ml-1 flex-shrink-0"
                                onClick={() =>
                                  setIsShareModalOpen(!isShareModalOpen)
                                }
                                title="Share Referral Link"
                              />

                              {isShareModalOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#08080E] border border-[#404040] rounded-lg shadow-lg shadow-black/50 z-50">
                                  <div className="p-2">
                                    <div className="text-white text-xs font-medium mb-2 px-2">
                                      Share on:
                                    </div>

                                    {navigator.share && (
                                      <button
                                        onClick={handleNativeShare}
                                        className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                      >
                                        <PiShare size={14} />
                                        <span>Share...</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => shareOnPlatform("twitter")}
                                      className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                    >
                                      <span>🐦</span>
                                      <span>Twitter</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        shareOnPlatform("facebook")
                                      }
                                      className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                    >
                                      <span>📘</span>
                                      <span>Facebook</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        shareOnPlatform("linkedin")
                                      }
                                      className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                    >
                                      <span>💼</span>
                                      <span>LinkedIn</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        shareOnPlatform("whatsapp")
                                      }
                                      className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                    >
                                      <span>💬</span>
                                      <span>WhatsApp</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        shareOnPlatform("telegram")
                                      }
                                      className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                    >
                                      <span>✈️</span>
                                      <span>Telegram</span>
                                    </button>

                                    <button
                                      onClick={() => shareOnPlatform("reddit")}
                                      className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                    >
                                      <span>🔗</span>
                                      <span>Reddit</span>
                                    </button>

                                    <div className="border-t border-[#404040] mt-2 pt-2">
                                      <button
                                        onClick={() => {
                                          copyToClipboard(
                                            referralLink,
                                            "referral"
                                          );
                                          setIsShareModalOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                      >
                                        <IoCopyOutline size={14} />
                                        <span>Copy Link</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 sm:px-4 py-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium mb-1">
                    {navbar?.acountandsecurity?.recoveryKey}
                  </div>
                  <div className="text-[#6E6E6E] text-xs">
                    {navbar?.acountandsecurity?.msg2}
                  </div>
                </div>
                <button
                  onClick={() => handlePhrase()}
                  className="px-3 py-2 text-xs border border-[#ED1B24] text-[#ED1B24] hover:bg-[#ED1B24] hover:text-white rounded transition-all duration-300 w-full sm:w-[140px] text-center"
                >
                  {navbar?.acountandsecurity?.recoveryKey}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-[#1A1A1A]">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium mb-1">
                    {navbar?.acountandsecurity?.language}
                  </div>
                  <div className="text-[#6E6E6E] text-xs">
                    {navbar?.acountandsecurity?.msg3}
                  </div>
                </div>

                <div className="relative w-full sm:w-[140px]">
                  <div
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#A8A8A8] border border-[#404040] rounded cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition w-full"
                    onClick={() => setIsModalOpen(!isModalOpen)}
                  >
                    <Image
                      alt="lang"
                      src={language.img}
                      className="w-[16px] h-[16px] rounded-full flex-shrink-0"
                      unoptimized
                    />
                    <span className="uppercase flex-1 truncate">
                      {language?.lang || "English"}
                    </span>
                    <FaCaretDown className="text-[#A8A8A8] flex-shrink-0" />
                  </div>

                  {isModalOpen && (
                    <div className="absolute z-50 h-[200px] overflow-y-auto mt-2 w-full right-0 bg-[#08080E] border border-[#404040] rounded-lg shadow-lg shadow-black/50">
                      {lang.map((item) => {
                        const isSelected = i18n.language === item.code;
                        return (
                          <div
                            key={item.code}
                            onClick={() => handleLanguageSelector(item)}
                            className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all hover:bg-[#2a2a2a]`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className="w-[16px] h-[16px] overflow-hidden rounded-full flex-shrink-0">
                                <Image
                                  alt="lang"
                                  src={item.img}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              </div>
                              <span className="text-xs text-[#A8A8A8] truncate">
                                {item.lang}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="flex items-center justify-center text-[#3b37fe] flex-shrink-0">
                                <FaCheck size={10} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-[#1A1A1A]">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium mb-1">
                    {navbar?.acountandsecurity?.wallets}
                  </div>
                  <div className="text-[#6E6E6E] text-xs">
                    {navbar?.acountandsecurity?.msg4}
                  </div>
                </div>

                <Link
                  onClick={() => {
                    setIsAccountPopup(false);
                    dispatch(updatePnlTableData("portfolio"));
                  }}
                  href="/portfolio"
                  className="px-3 py-2 flex items-center gap-2 text-xs border border-[#404040] rounded cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition-all text-[#A8A8A8] w-full sm:w-[140px] justify-center"
                >
                  <IoWalletOutline size={14} />
                  <span className="truncate">
                    {navbar?.acountandsecurity?.manageWallets}
                  </span>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-[#1A1A1A]">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium mb-1">
                    {navbar?.acountandsecurity?.rewards}
                  </div>
                  <div className="text-[#6E6E6E] text-xs">
                    {navbar?.acountandsecurity?.msg5}
                  </div>
                </div>

                <Link
                  onClick={() => setIsAccountPopup(false)}
                  href="/referral"
                  className="px-3 py-2 flex items-center gap-2 text-xs border border-[#404040] rounded cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition-all text-[#A8A8A8] w-full sm:w-[140px] justify-center"
                >
                  <span>📈</span>
                  <span className="truncate">
                    {navbar?.acountandsecurity?.earnRewards}
                  </span>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-t border-[#1A1A1A]">
                <div className="flex-1 min-w-0">
                  <div className="text-[#ED1B24] text-sm font-medium mb-1">
                    {navbar?.acountandsecurity?.logOut}
                  </div>
                  <div className="text-[#ED1B24] text-xs">
                    {navbar?.acountandsecurity?.msg1}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs border border-[#ED1B24] text-[#ED1B24] hover:bg-[#ED1B24] hover:text-white rounded transition-all duration-300 w-full sm:w-[140px] text-center"
                >
                  {navbar?.acountandsecurity?.logOut}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsShareModalOpen(false)}
        />
      )}
    </>
  );
};

export default AccountSecurity;
