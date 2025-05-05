"use client";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { IoMenu, IoPersonCircleOutline } from "react-icons/io5";
import { setIsSidebarOpen } from "@/app/redux/CommonUiData";
import { logo } from "@/app/Images";
import {
  setIsEnabled,
  setIsSearchPopup,
  setSolWalletAddress,
} from "@/app/redux/states";
import { PiUserLight } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { lang } from "../../app/contsants/lang";
import { useTranslation } from "react-i18next";
import LoginPopup from "./login/LoginPopup";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaCopy } from "react-icons/fa6";
import { googleLogout } from "@react-oauth/google";
import { GrLanguage } from "react-icons/gr";

const Navbar = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [saveStatus, setSaveStatus] = useState("");
  const [language, setLanguage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const isEnabled = useSelector((state) => state?.AllStatesData?.isEnabled);
  const [mounted, setMounted] = useState(false);

  // login signup

  const [isLoginPopup, setIsLoginPopup] = useState(false);
  const [authName, setAuthName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("walletAddress");
    dispatch(setSolWalletAddress());
    router.push("/");
    setIsProfileOpen(false);
    googleLogout();
    setTimeout(() => {
      setIsLoginPopup(true);
      setAuthName("login");
    }, 1500);
  };

  const path =
    pathname === "/settings" ||
    pathname === "/copytrade" ||
    pathname === "/transfer-funds";

  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );

  async function handleLanguageSelector(item) {
    await i18n.changeLanguage(item?.code);
    await setLanguage(item);
    await setIsModalOpen(false);
  }
  useEffect(() => {
    const langLocal = lang.find((item) => item?.code == i18n.language);
    setLanguage(langLocal);
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
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(setSolWalletAddress());
  }, []);

  return (
    <>
      <div
        className={`backdrop-blur-3xl bg-[#08080E] transition-all duration-500 px-2 md:px-[8px] ease-in-out border-b-[1px] border-b-[#404040]`}
      >
        <div className="transition-all duration-500 ease-in-out sm:mr-2">
          <div className="flex items-center sm:gap-2 py-2 md:justify-between justify-end md:ml-0 ml-16 sm:mx-4 md:mx-0">
            <div className={`fixed start-4 md:hidden w-7 h-[30px]`}>
              <Image src={logo} alt="logo" />
            </div>

            {/* ssearch bar */}
            <div
              className={`md:flex items-center  border ${
                isSidebarOpen ? "ml-1 " : "ml-5 gap-2"
              } border-[#333333] ${
                isSidebarOpen && path ? "mx-0 lg:mx-0 md:mx-0" : " "
              } rounded-lg h-8 px-2 bg-[#191919] hidden `}
              onClick={() => dispatch(setIsSearchPopup(true))}
            >
              <LuSearch className="h-4 w-4 text-[#A8A8A8]" />
              <input
                className={`${
                  saveStatus !== "connected"
                    ? "w-36"
                    : `${isSidebarOpen ? "w-0" : "w-12"}`
                } lg:w-36 xl:w-56 bg-transparent outline-none text-[#989aaa] text-sm font-thin placeholder-gray-400 placeholder:text-xs `}
                placeholder="Search"
                value={searchTerm}
              />
            </div>

            {/* Hamburger menu */}
            <div
              className={`md:hidden flex items-center justify-center cursor-pointer border-[1px] border-[#2e2e2e] rounded-md md:order-1 order-2`}
              onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
            >
              <IoMenu className="text-[30px] text-[#fdf5f5] p-[2px]" />
            </div>

            <div className=" flex items-center sm:gap-2 order-1 md:order-2">
              <div
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex items-center justify-center hover:text-[#1F73FC] cursor-pointer py-1 gap-2 px-2  hover:border-[#1F73FC] border-[1px] rounded-md">
                  <GrLanguage size={20} />
                  <div className="uppercase">
                    {" "}
                    {language?.lang ? language.lang.substring(0, 3) : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ">
                {solWalletAddress ? (
                  <div className="relative">
                    <div onClick={() => setIsProfileOpen((prev) => !prev)}>
                      <IoPersonCircleOutline
                        size={26}
                        className={`md:ml-2 cursor-pointer`}
                      />
                    </div>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#1F1F1F] rounded-md shadow-lg z-50">
                        <div className="px-4 py-2 text-xs text-gray-300">
                          Wallet Address
                        </div>
                        <div className="px-4 py-2 text-sm text-white break-words flex items-center justify-between gap-2">
                          <span className="text-sm">
                            {solWalletAddress?.slice(0, 5)}...
                            {solWalletAddress?.slice(-4)}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(solWalletAddress);
                            }}
                          >
                            <FaCopy size={16} className="text-white" />
                          </button>
                        </div>
                        <hr className="border-gray-700 my-1" />
                        <div
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-800 hover:text-white flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <RiLogoutBoxLine size={16} />
                          Logout
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        setIsLoginPopup(true);
                        setAuthName("login");
                      }}
                      className="px-5 py-1 bg-[#1F1F1F] border-[1px] border-[#1F1F1F]  rounded-md cursor-pointer"
                    >
                      Login
                    </div>
                    <div
                      onClick={() => {
                        setIsLoginPopup(true);
                        setAuthName("signup");
                      }}
                      className="border-[1px] border-[#0E43BD] rounded-md cursor-pointer bg-[#11265B] px-5 py-1 "
                    >
                      Sign up
                    </div>
                  </>
                )}
              </div>
              {mounted && solWalletAddress && (
                <div
                  onClick={() => dispatch(setIsEnabled(!isEnabled))}
                  style={{ cursor: "pointer" }}
                >
                  <IoMdNotificationsOutline size={24} />
                </div>
              )}
              {mounted && solWalletAddress && (
                <Link href="/profile?" className="hidden md:block">
                  <PiUserLight size={24} className={`md:ml-2 cursor-pointer`} />
                </Link>
              )}
            </div>
          </div>

          {/* Show Sm screen only */}
          <div className="pb-3 md:pb-0 ">
            <div
              className={`flex items-center gap-2 border mx-5 border-[#333333] ${
                isSidebarOpen && path ? "mx-0 lg:mx-0 md:mx-0" : " "
              } rounded-lg h-8 px-2 bg-[#3d3d47] md:hidden `}
              onClick={() => dispatch(setIsSearchPopup(true))}
            >
              <LuSearch className="h-4 w-4 text-[#A8A8A8]" />
              <input
                className={`w-12 ${
                  saveStatus !== "connected" ? "w-36" : "w-12"
                } lg:w-36 xl:w-56 bg-transparent outline-none text-[#989aaa] text-sm font-thin placeholder-gray-400 placeholder:text-xs `}
                placeholder="Search"
                value={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoginPopup && (
        <LoginPopup
          isLoginPopup={isLoginPopup}
          authName={authName}
          setIsLoginPopup={setIsLoginPopup}
          setAuthName={setAuthName}
        />
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-[#000000b2] flex items-center justify-center !z-[999999999999999]"
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="LanguagePopup-lg w-[366px] bg-[#08080e]  border border-[#403f45] rounded-[36px] overflow-hidden !z-[999999999999999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center py-[12px] px-[10px] relative ">
                <h1 className="text-[22px]  font-bold">Languages</h1>
                <RxCross1
                  className="text-[16px]  cursor-pointer absolute top-4 right-4 !font-extrabold"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
              <div className="bg-[#403f45] h-[1px]"></div>
              <div className="py-[12px] px-[10px]  h-[500px] overflow-y-auto r">
                {lang.map((item) => {
                  return (
                    <div
                      onClick={() => handleLanguageSelector(item)}
                      key={item.code}
                      className={`cursor-pointer ${
                        i18n.language == item.code && "bg-[#3a37fe2a]"
                      } rounded-[5px] px-4 py-2 flex items-center justify-between mb-[3px]`}
                    >
                      <div className="flex items-center gap-[10px]">
                        <Image
                          alt="lang"
                          src={item.img}
                          className="h-[20px] w-[30px]"
                        />
                        <h1 className="text-[16px] font-[500]">{item.lang}</h1>
                      </div>
                      <div
                        className={`flex items-center ${
                          i18n.language == item.code
                            ? "bg-[#3b37fe]"
                            : "border border-[#c9c9c9]"
                        } justify-center w-[20px] h-[20px]  rounded-full`}
                      >
                        <div className="w-[8px] h-[8px] bg-[#f3f3f3] rounded-full"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default Navbar;
