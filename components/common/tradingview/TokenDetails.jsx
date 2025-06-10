"use client";
import React, { useEffect, useState } from "react";
import { Solana, Copy, Telegram, linkedin, NewX } from "@/app/Images";
import Image from "next/image";
import { IoMdDoneAll } from "react-icons/io";
import { formatDecimal } from "@/utils/basicFunctions";
import { useDispatch, useSelector } from "react-redux";
import {
  openCloseLoginRegPopup,
  removeFavouriteToken,
  setChartSymbolImage,
  setFavouriteTokens,
  setIsFaviouriteToken,
} from "@/app/redux/states";
import { CiHeart } from "react-icons/ci";
import {
  PiDiscordLogo,
  PiInstagramLogo,
  PiMessengerLogoLight,
  PiRedditLogo,
  PiShare,
  PiTelegramLogoDuotone,
  PiWhatsappLogo,
} from "react-icons/pi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import { BsCopy, BsTwitterX } from "react-icons/bs";
import { RiFacebookCircleLine } from "react-icons/ri";
import Link from "next/link";
import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
import SquareProgressBar from "../../common/SquareProgressBarcom/SquareProgressBar";
import { pumpfun, telegrams, twitter, website } from "@/app/Images";
import { showToaster, showToasterSuccess } from "@/utils/toaster/toaster.style";

const TokenDetails = ({
  tokenSymbol,
  tokenaddress,
  copied,
  handleCopy,
  TokenDetailsNumberData,
  tokenDetailsMarketCap,
  chartTokenData,
  walletAddress,
  pairAddress,
  tokenImage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopyUrl, setIsCopyUrl] = useState(false);
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(true);

  const socialIcons = [
    { icon: twitter, title: "twitter" },
    { icon: telegrams, title: "telegram" },
    { icon: website, title: "website" },
    { icon: pumpfun, title: "pumpfun" },
  ];

  const dispatch = useDispatch();
  const tokenFavList = useSelector(
    (state) => state?.AllStatesData?.favouriteTokens
  );

  const isFavourite = useSelector(
    (state) => state?.AllStatesData?.isFaviourite
  );

  async function getAndSetImageFromLocalStorage() {
    try {
      const getImageFromLocalStorage = localStorage.getItem("chartTokenImg");
      if (!getImageFromLocalStorage || getImageFromLocalStorage == "null") {
        dispatch(setChartSymbolImage(null));
      } else {
        dispatch(setChartSymbolImage(getImageFromLocalStorage));
      }
    } catch (error) { }
  }
  const token = localStorage.getItem("token");

  async function addToFavouriteHandler() {
    if (!token) {
      return dispatch(openCloseLoginRegPopup(true));
    }
    await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/createTokenFavourite`,
      data: {
        symbol: tokenSymbol || "Unknown",
        name: chartTokenData?.name,
        img: tokenImage,
        tokenAddress: tokenaddress,
        marketCap: tokenDetailsMarketCap,
        // volume: '0',
        Liqudity: TokenDetailsNumberData[1].price,
        pairaddress: pairAddress,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        showToasterSuccess(res?.data?.message);
        dispatch(setIsFaviouriteToken());
        // await dispatch(
        //   setFavouriteTokens([, res?.data?.data])
        // );
        // dispatch(setFavouriteTokens([...tokenFavList, res?.data?.data?.tokenFavorites]))
      })
      .catch((err) => {
        showToaster(err?.res?.data?.message || "Something went wrong");
      });
  }

  // async function checkLikeOrNot() {
  //   if (!token) {
  //     return;
  //   }
  //   await axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/checkTokenFavorite/${tokenaddress}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       dispatch(setIsFaviouriteToken(res?.data?.data?.exists));
  //     })
  //     .catch((err) => { });
  // }

  async function checkLikeOrNot() {
    if (!token) {
      setIsFavouriteLoading(false);
      return;
    }

    setIsFavouriteLoading(true); // show loader while fetching

    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/checkTokenFavorite/${tokenaddress}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        dispatch(setIsFaviouriteToken(res?.data?.data?.exists));
      })
      .catch((err) => { })
      .finally(() => {
        setIsFavouriteLoading(false);
      });
  }

  async function removeFromFavouriteHandler() {
    if (!token) {
      return dispatch(openCloseLoginRegPopup(true));
    }
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/deleteTokenFavorite`,
        {
          data: {
            tokenAddress: tokenaddress,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (res) => {
        showToasterSuccess(res?.data?.message);
        dispatch(setIsFaviouriteToken());
      })
      .catch((err) => {
        showToaster(err?.res?.data?.message || "Something went wrong");
      });
  }

  async function copyUrlOfPage() {
    await navigator.clipboard.writeText(window.location.href);
    setIsCopyUrl(true);
    setTimeout(() => {
      setIsCopyUrl(false);
    }, 2000);
  }

  useEffect(() => {
    checkLikeOrNot();
  }, [isFavourite]);

  useEffect(() => {
    getAndSetImageFromLocalStorage();
  }, []);
  return (
    <div className="bg-transparent border-b-[1px] border-b-[#26262e] w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center ">
        {/* Token Details */}
        <div className="w-full sm:pl-[10px] pl-2 py-2 md:p-3 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex justify-between md:block">
            {/* Token Details */}
            <div className="flex items-center gap-2">
              {/* Token Image */}
              <div className="relative w-[36px] h-[36px] z-0">
                {/* change value to actual bonding curve later on and trail color depending on graduation status */}
                <SquareProgressBar
                  value={chartTokenData?.bondingCurveProgress || 100}
                  maxValue={100}
                  size={36.5}
                  trailColor="#7b8085"
                  progressColor={"#4FAFFE"}
                />
                {tokenImage ? (
                  <img
                    key={tokenImage || Solana}
                    src={
                      tokenImage || Solana
                        ? tokenImage || Solana
                        : "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg"
                    }
                    alt="Profile"
                    className="absolute inset-0 m-auto w-[30px] h-[30px] rounded-sm"
                  />
                ) : (
                  <h1 className="absolute inset-0 m-auto w-[30px] h-[30px] rounded-sm text-[22px] border-[1px] border-[#26262e] bg-[#191919] flex items-center justify-center ">
                    {tokenSymbol?.toString()?.slice(0, 1)}
                  </h1>
                )}
              </div>
              {/* Token Details */}
              <div className="flex flex-col md:mr-5">
                <div className="flex items-center gap-2">
                  <div className="text-white text-base sm:text-lg font-spaceGrotesk">
                    {tokenSymbol?.length > 7
                      ? `${tokenSymbol.slice(0, 5)}...`
                      : tokenSymbol}
                  </div>
                  <div className="text-[#A8A8A8] text-xs md:text-[14px]">
                    {tokenaddress && tokenaddress.length >= 10
                      ? `${tokenaddress.slice(0, 5)}...${tokenaddress.slice(
                        -3
                      )}`
                      : tokenaddress}
                  </div>
                  <div
                    className="flex flex-shrink-0"
                    onClick={() => handleCopy(tokenaddress)}
                  >
                    {copied ? (
                      <IoMdDoneAll className="text-white cursor-pointer" />
                    ) : (
                      <Image
                        src={Copy}
                        alt="Copy"
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        onClick={() => handleCopy(tokenaddress)}
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {chartTokenData?.socialIconsLink
                    ?.filter((item) => item?.uri)
                    .map((item, index) => {
                      const matchedIcon = socialIcons.find(
                        (iconItem) => iconItem.title === item.alt
                      );

                      return (
                        <Link
                          key={index}
                          href={item?.uri}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="grid place-items-center rounded-full">
                            {matchedIcon && (
                              <Image
                                src={matchedIcon?.icon}
                                alt={matchedIcon?.title}
                                className="mx-auto text-white"
                              />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  <Link
                    href={`https://www.pump.news/en/${tokenaddress}-solana`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-[10px] h-[17px] w-[17px] border border-[#4CAF50] text-[#ffffff] rounded-md flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#409143] to-[#093d0c] shadow-[0_0_4px_rgba(76,255,80,0.4)]">
                      AI
                    </div>
                  </Link>
                  <Link
                    href={`https://x.com/search?q=${tokenaddress}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IoSearchSharp color="#BBBBBC" size={19} />
                  </Link>
                </div>
              </div>
            </div>
            {/* Share and Fav Mobile */}
            <div className="flex gap-2 md:hidden">
              <div
                className="h-[36px] w-[36px] bg-[#1F1F1F] rounded-full flex items-center justify-center"
                onClick={() => setIsModalOpen(true)}
              >
                <PiShare className="text-[#F6F6F6] text-[22px]" />
              </div>
              <div className="h-[36px] w-[36px] bg-[#1F1F1F] rounded-full flex items-center justify-center">
                {isFavouriteLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : isFavourite ? (
                  <FaHeart
                    onClick={removeFromFavouriteHandler}
                    className="text-[#1F73FC] text-[18px]"
                  />
                ) : (
                  <CiHeart
                    onClick={addToFavouriteHandler}
                    className="text-[#F6F6F6] text-[22px]"
                  />
                )}
              </div>
            </div>
          </div>
          {/* Numbers */}
          <div className="flex items-center">
            <div className="text-[#52C5FF] flex flex-row items-end justify-end md:items-center gap-1 md:gap-0 md:flex-col md:text-white text-sm md:text-base font-medium mr-4 md:mx-4">
              <p className="text-[#A8A8A8] inline md:hidden text-[10px] font-normal">
                MC
              </p>
              <p className="inline">{tokenDetailsMarketCap}</p>
            </div>
            <div className="p-0 md:p-3 flex items-center">
              <div className="grid grid-cols-4 lg:gap-5 md:gap-4 gap-2">
                {TokenDetailsNumberData?.map((num, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row items-end gap-1 md:gap-0 md:flex-col md:items-start"
                    >
                      {/* <span className="text-[#A8A8A8] text-xs capitalize">
                        {num.label}
                      </span> */}
                      <span className="text-[#A8A8A8] text-xs">
                        <span className="hidden md:inline">{num.label}</span>
                        <span className="inline md:hidden text-[10px]">
                          {num.label === "Market Cap" && "M"}
                          {num.label === "Liquidity" && "L"}
                          {num.label === "Volume" && "V"}
                          {num.label === "Supply" && "S"}
                          {num.label === "Price" && "P"}
                          {num.label === "B.Curve" && "B%"}
                          {/* Add more if you have more labels */}
                        </span>
                      </span>
                      <span
                        className={`${index === 3 ? "text-[#4CAF50]" : "text-white"
                          } text-sm`}
                      >
                        {num?.label == "Price USD"
                          ? formatDecimal(num?.price)
                          : num?.price}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Like Icon */}
              {/* <button className="p-2">
                  <Image
                    src={Like}
                    alt="Like"
                    width={28}
                    height={24}
                    className="sm:w-7 sm:h-6 w-5 h-4"
                  />
                </button> */}
            </div>
          </div>
        </div>
        <div className="items-center justify-between mb-[5px] md:mb-[0px] hidden md:flex">
          <div className="flex items-center md:flex-col">
            {/* <div className="cursor-pointer border-[1px] md:!border-t-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center">
              {isFavourite ? (
                <FaHeart
                  onClick={removeFromFavouriteHandler}
                  className="text-[#1F73FC] text-[18px]"
                />
              ) : (
                <CiHeart
                  onClick={addToFavouriteHandler}
                  className="text-[#F6F6F6] text-[22px]"
                />
              )}
            </div> */}
            <div className="cursor-pointer border-[1px] md:!border-t-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center">
              {isFavouriteLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : isFavourite ? (
                <FaHeart
                  onClick={removeFromFavouriteHandler}
                  className="text-[#1F73FC] text-[18px]"
                />
              ) : (
                <CiHeart
                  onClick={addToFavouriteHandler}
                  className="text-[#F6F6F6] text-[22px]"
                />
              )}
            </div>

            <div className="cursor-pointer border-[1px] md:!border-b-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center">
              <MdKeyboardArrowLeft className="text-[#F6F6F6] text-[22px]" />
            </div>
          </div>
          <div className="flex items-center md:flex-col">
            <div
              className="cursor-pointer border-[1px] md:!border-t-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <PiShare className="text-[#F6F6F6] text-[22px]" />
            </div>
            <div className="cursor-pointer border-[1px] md:!border-b-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center">
              <MdKeyboardArrowRight className="text-[#F6F6F6] text-[22px]" />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-[#0d0d0f] bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#141414] shadow-lg w-full max-w-[480px] rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between py-[12px] px-[24px]">
                <h1 className="text-[22px] font-[700] text-[#F6F6F6]">Share</h1>
                <RxCross1
                  onClick={() => setIsModalOpen(false)}
                  className="text-[16px] text-[#F6F6F6] cursor-pointer"
                />
              </div>
              <div className="bg-[#404040] h-[1.5px]"></div>
              <div className="py-[12px] px-[24px]">
                {/* social icons */}
                <div className="grid grid-cols-4 place-content-between">
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px]">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                      className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BsTwitterX className="text-[25px] text-[#F6F6F6]" />
                    </a>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">X</h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center"
                    >
                      <RiFacebookCircleLine className="text-[25px] text-[#F6F6F6]" />
                    </a>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Facebook
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <a
                      href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                      className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PiRedditLogo className="text-[25px] text-[#F6F6F6]" />
                    </a>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Reddit
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <PiDiscordLogo className="text-[25px] text-[#F6F6F6]" />
                    </div>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Discord
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PiWhatsappLogo className="text-[25px] text-[#F6F6F6]" />
                      </a>
                    </div>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Whatsapp
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center"
                      rel="noopener noreferrer"
                    >
                      <PiTelegramLogoDuotone className="text-[25px] text-[#F6F6F6]" />
                    </a>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Telegram
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <div >
                      <a
                        href={`https://www.facebook.com/dialog/send?link=https://wavepro.com&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center"
                      >
                        <PiMessengerLogoLight className="text-[25px] text-[#F6F6F6]" />
                      </a>
                    </div>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Messenger
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <PiInstagramLogo className="text-[25px] text-[#F6F6F6]" />
                    </div>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Instagram
                    </h1>
                  </div>
                </div>
                <div className="bg-[#404040] h-[1.5px] my-[16px]"></div>
                <div className="my-[16px]">
                  <h1 className="text-[18px] font-[700] text-[#F6F6F6]">
                    Share link
                  </h1>
                  <div className="mt-[8px] flex items-center gap-[12px]">
                    <div className="border-[#404040] border-[1px]  py-[10px] px-[12px] rounded-[8px] flex items-center gap-[8px]">
                      <div className="w-[250px] text-[#6E6E6E] overflow-hidden whitespace-nowrap text-[12px] font-[400]">
                        {window.location.href}
                      </div>
                      {isCopyUrl ? (
                        <IoMdDoneAll className="!text-[12px] cursor-pointer text-[#F6F6F6]" />
                      ) : (
                        <BsCopy
                          className="!text-[12px] cursor-pointer text-[#F6F6F6]"
                          onClick={() => copyUrlOfPage()}
                        />
                      )}
                    </div>
                    <button
                      className="cursor-pointer text-[12px] text-[#F6F6F6] font-[400] bg-[#1F73FC] w-full py-[10px] rounded-[4px] whitespace-nowrap"
                      onClick={() => copyUrlOfPage()}
                    >
                      {isCopyUrl ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenDetails;
