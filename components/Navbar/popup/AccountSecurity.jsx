import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose, IoCopyOutline, IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { profileImage } from "@/app/Images";
import { PiShare } from "react-icons/pi";
import { FaCaretDown, FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { lang } from "@/app/contsants/lang";
import { useSelector } from "react-redux";
import Link from "next/link";

const AccountSecurity = ({ setIsAccountPopup, }) => {
  const [language, setLanguage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { t } = useTranslation();
  const accountPopupLng = t("accountPopup");

  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );

  const { i18n } = useTranslation();

  async function handleLanguageSelector(item) {
    await i18n.changeLanguage(item?.code);
    setLanguage(item);
    setIsModalOpen(false);
  }


  useEffect(() => {
    // Change languge state
    const langLocal = lang.find((item) => item?.code == i18n.language);
    setLanguage(langLocal);

  }, []);

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsAccountPopup(false)}
      className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center !z-[999999999999999]"
    >
      <motion.div
        key="modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="LanguagePopup-lg xl:w-[1100px] lg:w-[1000px] md:w-[90%]  w-full bg-[#08080E] rounded-md !z-[999999999999999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          <div className="flex items-center justify-between lg:px-6 px-3 py-2">
            <div className="md:text-2xl sm:text-xl text-lg sm:font-bold font-semibold text-white ">
              {accountPopupLng?.security?.accountSecurity}
            </div>
            <div
              onClick={() => setIsAccountPopup(false)}
              className="cursor-pointer"
            >
              <IoClose size={20} />
            </div>
          </div>
          <div className="sm:px-6 px-3 sm:py-6 py-3 border-b-[1px] border-t-[1px] border-[#404040]">
            <div className="flex lg:flex-row flex-col lg:items-center gap-3 justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={profileImage}
                  alt="profile image"
                  height={50}
                  width={50}
                  className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-md"
                />
                <div>
                  <p>{`example@gmail.com`}</p>
                  <div className="flex items-center gap-1 text-[#A8A8A8] text-sm">
                    <div>{accountPopupLng?.security?.userID} </div>
                    <div>95a2...3f95</div>
                    <div>
                      <IoCopyOutline />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#A8A8A8] text-sm">
                    <div>
                      <IoWalletOutline />
                    </div>
                    <div>{solWalletAddress ? solWalletAddress : "wallet address"}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center sm:flex-nowrap flex-wrap lg:gap-10 gap-3">
                <div>
                  <div className="text-[#A8A8A8] text-sm uppercase">
                    {accountPopupLng?.security?.dayCreated}
                  </div>
                  <div className="text-white font-semibold py-1.5 text-base">
                    23/02/2025
                  </div>
                </div>
                <div>
                  <div className="text-[#A8A8A8] text-sm uppercase">
                    {accountPopupLng?.security?.lastLogin}
                  </div>
                  <div className="text-white font-semibold py-1.5  text-base">
                    1w
                  </div>
                </div>
                <div>
                  <div className="text-[#A8A8A8] text-sm uppercase">
                    {accountPopupLng?.security?.referralLink}   {" "}
                  </div>
                  <div className="border-b-[1px] border-b-[#FFFFFF] py-1.5 gap-1  cursor-pointer text-white flex items-center font-semibold text-base">
                    <div> {accountPopupLng?.security?.setReferralCode}</div>
                    <PiShare />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:px-6 px-3 py-6">
            <div className="flex gap-2 sm:flex-row flex-col sm:items-center my-5  justify-between">
              <div>
                <div>{accountPopupLng?.security?.recoveryKey}</div>
                <div className="text-[#6E6E6E] text-sm font-normal">
                  {accountPopupLng?.security?.DONOTSHARE}
                </div>
              </div>
              <button className="py-2 px-5 border-[1px] border-[#ED1B24] text-[#ED1B24] hover:bg-[#ED1B24] hover:text-[#FFFFFF] rounded-md transition-all duration-500 ease-in-out ">
                {accountPopupLng?.security?.viewrecoveryVey}
              </button>
            </div>
            <hr className="border-[#1A1A1A] border-b-[1px]  w-full" />

            <div className="flex gap-2 sm:flex-row flex-col sm:items-center my-5  justify-between">
              <div>
                <div>{accountPopupLng?.security?.language}</div>
                <div className="text-[#6E6E6E] text-sm font-normal">
                  {accountPopupLng?.security?.changeLanguage}  </div>
              </div>

              {/* Languages */}
              <div className="relative">
                <div
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#A8A8A8] border border-[#404040] rounded-md cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition"
                  onClick={() => setIsModalOpen(!isModalOpen)}
                >
                  <Image
                    alt="lang"
                    src={language.img}
                    className="w-[22px] h-[22px] rounded-full"
                  />
                  <span className="uppercase">{language?.lang || "English"}</span>
                  <FaCaretDown className="text-[#A8A8A8]" />
                </div>

                {isModalOpen && (
                  <div className="absolute z-50 h-[200px] overflow-y-auto mt-2 w-48 right-0  bg-[#08080E] border border-[#404040] rounded-lg shadow-lg shadow-black/50">
                    {lang.map((item) => {
                      const isSelected = i18n.language === item.code;
                      return (
                        <div
                          key={item.code}
                          onClick={() => handleLanguageSelector(item)}
                          className={`flex items-center justify-between px-4 py-1.5 mb-1 rounded-md cursor-pointer transition-all  hover:bg-[#2a2a2a]
                             `}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-[25px] h-[25px] rounded-full">
                              <Image
                                alt="lang"
                                src={item.img}
                                className="w-full h-full  object-cover"
                              />
                            </div>
                            <span className="text-[15px] font-medium text-[#A8A8A8]">
                              {item.lang}
                            </span>
                          </div>
                          {isSelected &&
                            < div
                              className={`flex items-center justify-center text-[#3b37fe]  "
                              }`}
                            >
                              <FaCheck />
                            </div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <hr className="border-[#1A1A1A] border-b-[1px]  w-full" />


            <div className="flex gap-2 sm:flex-row flex-col sm:items-center my-5  justify-between">
              <div>
                <div>{accountPopupLng?.security?.wallets}</div>
                <div className="text-[#6E6E6E] text-sm font-normal">
                  {accountPopupLng?.security?.walletAccounts} </div>
              </div>

              <Link
                onClick={() => setIsAccountPopup(false)}
                href='/portfolio'
                className="py-2 px-5 flex items-center gap-2 border-[#404040] rounded-md cursor-pointer bg-[#1a1a1a] hover:border-[#5a5a5a] transition-all duration-500 ease-in-out ">
                <IoWalletOutline />
                <span>{accountPopupLng?.security?.manageWallets}</span>
              </Link>
            </div>


          </div>
        </div>
      </motion.div>
    </motion.div >
  );
};

export default AccountSecurity;




// <div className="flex sm:flex-row flex-col sm:items-center my-5  justify-between">
// <div>
//   <div>Wallets</div>
//   <div className="text-[#6E6E6E] text-sm font-normal">
//     Add or manage your external wallet accounts
//   </div>
// </div>
// <div>
//   <div className="border border-[#404040] flex items-center gap-2 w-28 h-9 rounded-lg px-2 bg-[#08080E]">
//     <input
//       type="number"
//       className="bg-transparent text-white w-full outline-none text-right "
//       placeholder="0"
//     />
//   </div>
// </div>
// </div>