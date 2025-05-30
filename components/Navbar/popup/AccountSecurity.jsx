import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose, IoCopyOutline, IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { profileImage } from "@/app/Images";
import { PiShare } from "react-icons/pi";
import { FaCaretDown, FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { lang } from "@/app/contsants/lang";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { setSolWalletAddress } from "@/app/redux/states";
import { updatePnlTableData } from "@/app/redux/holdingDataSlice/holdingData.slice";

const AccountSecurity = ({ setIsAccountPopup, handlePhrase, userDetails }) => {
  const [language, setLanguage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accountPopupLng = t("accountPopup");

  const solWalletAddress = useSelector((state) => state?.AllStatesData?.solWalletAddress);

  const { i18n } = useTranslation();

  const referralLink = `https://moonpro.wavebot.app/referral/${userDetails?.referralId || ""}`;

  async function handleLanguageSelector(item) {
    await i18n.changeLanguage(item?.code);
    setLanguage(item);
    setIsModalOpen(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("walletAddress");
    dispatch(setSolWalletAddress());
    router.replace("/trending");
    setIsProfileOpen(false);
    googleLogout();
  };

  const truncateId = (id, startChars = 4, endChars = 4) => {
    if (!id) return "N/A";
    if (id.length <= startChars + endChars) return id;
    return `${id.substring(0, startChars)}...${id.substring(id.length - endChars)}`;
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
    const shareText = `Join me on MoonPro and start earning rewards! Use my referral link: ${referralLink}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(referralLink);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent("Join me on MoonPro!")}`,
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
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center !z-[999999999999999]"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="LanguagePopup-lg xl:w-[700px] lg:w-[650px] md:w-[90%] w-[95%] bg-[#08080E] rounded-md !z-[999999999999999] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="">
            <div className="flex items-center justify-between lg:px-4 px-3 py-3">
              <div className="text-lg font-medium text-white">Account and Security</div>
              <div onClick={() => setIsAccountPopup(false)} className="cursor-pointer">
                <IoClose size={18} />
              </div>
            </div>

            <div className="px-4 py-4 border-b-[1px] border-[#404040]">
              <div className="flex items-start gap-3">
                <Image
                  src={userDetails?.profileImage || profileImage}
                  alt="profile image"
                  height={40}
                  width={40}
                  className="w-[40px] h-[40px] rounded-md bg-orange-400 object-cover"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-1">
                    {userDetails?.email || userDetails?.username || "N/A"}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[#A8A8A8] mb-1">
                    <div className="flex items-center gap-1">
                      <span>User ID:</span>
                      <span>{truncateId(userDetails?._id || userDetails?.userId)}</span>
                      {copiedUserId ? (
                        <FaCheck className="text-green-400 text-xs" />
                      ) : (
                        <IoCopyOutline
                          className="cursor-pointer text-xs hover:text-white transition-colors"
                          onClick={() => copyToClipboard(userDetails?._id || userDetails?.userId || "", "userId")}
                          title="Copy User ID"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <div className="text-[#A8A8A8] mb-1">Rewards Level</div>
                    <div className="text-white font-medium">{userDetails?.rewardsLevel || "Wood"} 🏆</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#A8A8A8] mb-1">Last Login</div>
                    <div className="text-white font-medium">{formatTimeAgo(userDetails?.lastLogin)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#A8A8A8] mb-1">Referral Code</div>
                    <div className="text-white font-medium cursor-pointer flex items-center gap-1">
                      <span>{userDetails?.referralId || "N/A"}</span>
                      {userDetails?.referralId && (
                        <>
                          {copiedReferral ? (
                            <FaCheck className="text-green-400 text-xs" />
                          ) : (
                            <IoCopyOutline
                              className="cursor-pointer text-xs hover:text-white transition-colors"
                              onClick={() => copyToClipboard(userDetails.referralId, "referral")}
                              title="Copy Referral Code"
                            />
                          )}
                          <div className="relative">
                            <PiShare
                              className="cursor-pointer text-xs hover:text-white transition-colors ml-1"
                              onClick={() => setIsShareModalOpen(!isShareModalOpen)}
                              title="Share Referral Link"
                            />

                            {isShareModalOpen && (
                              <div className="absolute top-full right-0 mt-2 w-48 bg-[#08080E] border border-[#404040] rounded-lg shadow-lg shadow-black/50 z-50">
                                <div className="p-2">
                                  <div className="text-white text-xs font-medium mb-2 px-2">Share on:</div>

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
                                    onClick={() => shareOnPlatform("facebook")}
                                    className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                  >
                                    <span>📘</span>
                                    <span>Facebook</span>
                                  </button>

                                  <button
                                    onClick={() => shareOnPlatform("linkedin")}
                                    className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                  >
                                    <span>💼</span>
                                    <span>LinkedIn</span>
                                  </button>

                                  <button
                                    onClick={() => shareOnPlatform("whatsapp")}
                                    className="w-full flex items-center gap-2 px-2 py-2 text-xs text-[#A8A8A8] hover:bg-[#2a2a2a] hover:text-white rounded transition-colors"
                                  >
                                    <span>💬</span>
                                    <span>WhatsApp</span>
                                  </button>

                                  <button
                                    onClick={() => shareOnPlatform("telegram")}
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
                                        copyToClipboard(referralLink, "referral");
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

            <div className="px-4 py-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium mb-1">Recovery Key</div>
                  <div className="text-[#6E6E6E] text-xs">
                    Access your seed phrase to export your accounts. DO NOT SHARE!
                  </div>
                </div>
                <button
                  onClick={() => handlePhrase()}
                  className="px-4 py-2 text-xs border border-[#ED1B24] text-[#ED1B24] hover:bg-[#ED1B24] hover:text-white rounded transition-all duration-300 w-[140px]"
                >
                  View Recovery Key
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium mb-1">Language</div>
                  <div className="text-[#6E6E6E] text-xs">Change the application language</div>
                </div>

                <div className="relative">
                  <div
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#A8A8A8] border border-[#404040] rounded cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition w-[140px]"
                    onClick={() => setIsModalOpen(!isModalOpen)}
                  >
                    <Image alt="lang" src={language.img} className="w-[16px] h-[16px] rounded-full" />
                    <span className="uppercase">{language?.lang || "English"}</span>
                    <FaCaretDown className="text-[#A8A8A8] ml-auto" />
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
                            <div className="flex items-center gap-2">
                              <div className="w-[16px] h-[16px] overflow-hidden rounded-full">
                                <Image alt="lang" src={item.img} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs text-[#A8A8A8]">{item.lang}</span>
                            </div>
                            {isSelected && (
                              <div className="flex items-center justify-center text-[#3b37fe]">
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

              <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium mb-1">Wallets</div>
                  <div className="text-[#6E6E6E] text-xs">Add or manage your external wallet accounts</div>
                </div>

                <Link
                  onClick={() => {
                    setIsAccountPopup(false);
                    dispatch(updatePnlTableData("portfolio"));
                  }}
                  href="/portfolio"
                  className="px-3 py-2 flex items-center gap-2 text-xs border border-[#404040] rounded cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition-all text-[#A8A8A8] w-[140px] justify-center"
                >
                  <IoWalletOutline size={14} />
                  <span>Manage Wallets</span>
                </Link>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium mb-1">Rewards</div>
                  <div className="text-[#6E6E6E] text-xs">Earn free SOL. Visit the rewards page to get started</div>
                </div>

                <Link
                  onClick={() => setIsAccountPopup(false)}
                  href="/referral"
                  className="px-4 py-2 flex items-center gap-2 text-xs border border-[#404040] rounded cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition-all text-[#A8A8A8] w-[140px] justify-center"
                >
                  <span>📈</span>
                  <span>Earn Rewards</span>
                </Link>
              </div>

              {/* <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium mb-1">Yields</div>
                  <div className="text-[#6E6E6E] text-xs">
                    Earn passive income through Yields. Visit the Yields page to start earning
                  </div>
                </div>

                <button className="px-4 py-2 flex items-center gap-2 text-xs border border-[#404040] rounded cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition-all text-[#A8A8A8] w-[140px] justify-center">
                  <span>🔗</span>
                  <span>Enable Yield</span>
                </button>
              </div> */}

              <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
                <div className="flex-1">
                  <div className="text-[#ED1B24] text-sm font-medium mb-1">Log Out</div>
                  <div className="text-[#ED1B24] text-xs">Log out of your account</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs border border-[#ED1B24] text-[#ED1B24] hover:bg-[#ED1B24] hover:text-white rounded transition-all duration-300 w-[140px]"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {isShareModalOpen && <div className="fixed inset-0 z-40" onClick={() => setIsShareModalOpen(false)} />}
    </>
  );
};

export default AccountSecurity;
