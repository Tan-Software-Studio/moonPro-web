"use client";
import React, { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  IoMenu,
  IoSettingsOutline,
} from "react-icons/io5";
import { setIsSidebarOpen } from "@/app/redux/CommonUiData";
import { logo } from "@/app/Images";
import {
  setIsEnabled,
  setIsSearchPopup,
  setSolWalletAddress,
} from "@/app/redux/states";
import { PiUserBold, PiUserLight } from "react-icons/pi"; 
import { lang } from "../../app/contsants/lang";
import { useTranslation } from "react-i18next";
import LoginPopup from "./login/LoginPopup";
import { RiLogoutBoxLine, RiNotification4Line } from "react-icons/ri";
import { googleLogout } from "@react-oauth/google";
import { GrLanguage } from "react-icons/gr";
import { MdLockOutline } from "react-icons/md";
import { FaCaretDown, FaRegStar } from "react-icons/fa";
import Setting from "./popup/Setting";
import AccountSecurity from "./popup/AccountSecurity";
import Watchlist from "./popup/Watchlist";
const Navbar = () => {
  const [language, setLanguage] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // dropdown popup
  const [isSettingPopup, setIsSettingPopup] = useState(false);
  const [isAccountPopup, setIsAccountPopup] = useState(false);
  const [isWatchlistPopup, setIsWatchlistPopup] = useState(false)

  // login signup
  const [isLoginPopup, setIsLoginPopup] = useState(false);
  const [authName, setAuthName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // X===================X Use selectors X===================X //
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );
  const isEnabled = useSelector((state) => state?.AllStatesData?.isEnabled);

  const dropdownRef = useRef(null);
  const router = useRouter();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const path =
    pathname === "/settings" ||
    pathname === "/copytrade" ||
    pathname === "/transfer-funds";

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

  async function handleLanguageSelector(item) {
    await i18n.changeLanguage(item?.code);
    await setLanguage(item);
    await setIsModalOpen(false);
  }

  useEffect(() => {
    setMounted(true);

    // set SolWalletAddress 
    dispatch(setSolWalletAddress());

    // Change languge state
    const langLocal = lang.find((item) => item?.code == i18n.language);
    setLanguage(langLocal);

    // Click out side for closing dropdown of profile
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`backdrop-blur-3xl bg-[#08080E] transition-all duration-500 px-3 md:px-[8px] ease-in-out border-b-[1px] border-b-[#404040]`}
      >
        <div className="transition-all duration-500 ease-in-out sm:mr-2">
          <div className="flex items-center sm:gap-2 py-2 md:justify-end justify-between  sm:mx-4 md:mx-0">
            <div className={`md:hidden w-10 h-auto`}>
              <Image src={logo} alt="logo" className="w-full h-full" />
            </div>

            <div className=" flex items-center gap-2  ">
              {/* Search bar */}
              <div
                className={`md:flex items-center  border ${isSidebarOpen ? "ml-1 " : "ml-5 gap-2"
                  } border-[#333333] ${isSidebarOpen && path ? "mx-0 lg:mx-0 md:mx-0" : " "
                  } rounded-lg h-8 px-2 bg-[#191919] hidden `}
                onClick={() => dispatch(setIsSearchPopup(true))}
              >
                <LuSearch className="h-4 w-4 text-[#A8A8A8]" />
                <input
                  className={` ${isSidebarOpen ? "w-0" : "w-12"
                    } w-56 bg-transparent outline-none text-[#404040] text-sm font-thin placeholder-[#6E6E6E] bg-[#141414] placeholder:text-xs `}
                  placeholder="Search"
                />
              </div>



              {/* Languages */}
              <div
                className="cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex items-center text-sm font-light justify-center cursor-pointer py-1 gap-2 px-2 border-[1px] border-[#404040] rounded-md">
                  <Image
                    alt="lang"
                    src={language.img}
                    className="h-[22px] w-[22px] rounded-full"
                  />
                  <div className="uppercase flex items-center gap-1 text-[#A8A8A8]">
                    {" "}
                    {language?.lang ? language.lang.substring(0, 3) : ""}
                    <div><FaCaretDown className="text-base text-[#A8A8A8]" /></div>
                  </div>
                </div>
              </div>

              {/* Only sm search bar */}
              <div
                onClick={() => dispatch(setIsSearchPopup(true))}
                className="cursor-pointer md:hidden block"
              >
                <LuSearch size={24} />
              </div>

              {/* Notifications */}
              {mounted && solWalletAddress && (
                <div
                  onClick={() => dispatch(setIsEnabled(!isEnabled))}
                  className="cursor-pointer relative"
                >
                  <RiNotification4Line size={24} />
                  <div className="w-2 h-2 rounded-full bg-[#ED1B24] absolute right-[0.6px] top-[0.6px]"></div>
                </div>
              )}

              {/* Profile */}
              <div className="flex items-center gap-2 ">
                {solWalletAddress ? (
                  <div className=" " ref={dropdownRef}>
                    <div onClick={() => setIsProfileOpen((prev) => !prev)}>
                      <PiUserBold
                        size={26}
                        className={`cursor-pointer`}
                      />
                    </div>

                    {isProfileOpen && (
                      <div className="absolute md:right-5 right-0 mt-2 border-[1px] border-[#404040] w-72 bg-[#141414] shadow-[#000000CC] rounded-md shadow-lg z-50">
                        <Link
                          onClick={() => setIsProfileOpen(false)}
                          href="/profile?"
                          className=""
                        >
                          <div className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md">
                            <PiUserLight className="text-xl" />
                            My profile
                          </div>
                        </Link>

                        <div
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsAccountPopup(true);
                          }}
                          className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <MdLockOutline className="text-xl" />
                          Account & Security
                        </div>
                        <div
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsWatchlistPopup(true);
                          }}
                          className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <FaRegStar className="text-xl" />
                          My Watchlist
                        </div>
                        <div
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsSettingPopup(true);
                          }}
                          className="px-4 py-2 text-base text-white hover:text-[#1F73FC] flex items-center gap-2 cursor-pointer rounded-md"
                        >
                          <IoSettingsOutline className="text-xl" />
                          Setting
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

              {/* Hamburger menu */}
              <div
                className={`md:hidden flex items-center justify-center cursor-pointer border-[1px] border-[#2e2e2e] rounded-md  `}
                onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
              >
                <IoMenu className="text-[30px] text-[#fdf5f5] p-[2px]" />
              </div>


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
                      className={`cursor-pointer ${i18n.language == item.code && "bg-[#3a37fe2a]"
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
                        className={`flex items-center ${i18n.language == item.code
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

        {isSettingPopup && <Setting setIsSettingPopup={setIsSettingPopup} />}

        {isAccountPopup && (
          <AccountSecurity setIsAccountPopup={setIsAccountPopup} />
        )}

        {isWatchlistPopup &&
          <Watchlist setIsWatchlistPopup={setIsWatchlistPopup} />
        }

      </AnimatePresence>
    </>
  );
};

export default Navbar;
