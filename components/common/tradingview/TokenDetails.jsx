"use client";
import React, { useEffect, useState } from "react";
import { Solana, Copy, Telegram, linkedin, NewX } from "@/app/Images";
import Image from "next/image";
import { IoMdDoneAll } from "react-icons/io";
import { decimalConvert } from "@/utils/basicFunctions";
import { useDispatch, useSelector } from "react-redux";
import { removeFavouriteToken, setChartSymbolImage, setFavouriteTokens, setIsFaviouriteToken } from "@/app/redux/states";
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

const TokenDetails = ({
  tokenSymbol,
  tokenaddress,
  copied,
  handleCopy,
  TokenDetailsNumberData,
  chartTokenData,
  walletAddress,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopyUrl, setIsCopyUrl] = useState(false);


  const dispatch = useDispatch();
  const tokenImage = useSelector(
    (state) => state?.AllStatesData?.chartSymbolImage
  );
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
      return toast.error("Please login");
    }
    await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/createTokenFavourite`,
      data: {
        symbol: tokenSymbol || "Unknown",
        name: chartTokenData?.name,
        img: tokenImage,
        tokenAddress: tokenaddress,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      toast.success(res?.data?.message);
      dispatch(setIsFaviouriteToken())
      // await dispatch(
      //   setFavouriteTokens([, res?.data?.data])
      // );
      // dispatch(setFavouriteTokens([...tokenFavList, res?.data?.data?.tokenFavorites]))
    })
      .catch((err) => {
        toast.error(err?.res?.data?.message || "Something went wrong");
      });
  }

  async function checkLikeOrNot() {
    if (!token) {
      return toast.error("Please login");
    }
    await axios.get(`${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/checkTokenFavorite/${tokenaddress}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
    ).then((res) => {
      dispatch(setIsFaviouriteToken(res?.data?.data?.exists))
    })
      .catch((err) => {
      });
  }

  async function removeFromFavouriteHandler() {
    if (!token) {
      return toast.error("Please login");
    }
    await axios.delete(`${process.env.NEXT_PUBLIC_MOONPRO_BASE_URL}user/deleteTokenFavorite`, {
      data: {
        tokenAddress: tokenaddress
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    },
    ).then(async (res) => {
      toast.success(res?.data?.message);
      dispatch(setIsFaviouriteToken())
    })
      .catch((err) => {
        toast.error(err?.res?.data?.message || "Something went wrong");
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
    checkLikeOrNot()
  }, [isFavourite])

  useEffect(() => {
    getAndSetImageFromLocalStorage();

  }, []);
  return (
    <div className="bg-transparent border-b-[1px] border-b-[#26262e] w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
        {/* Token Details */}
        <div className="sm:pl-[10px] p-3 flex items-center sm:gap-4 gap-1">
          {tokenImage ? (
            <img
              src={tokenImage || Solana}
              alt="Token Image"
              className="rounded-lg sm:w-[56px] w-[40px] sm:h-[56px] h-[40px]"
            />
          ) : (
            <h1 className="rounded-lg text-[22px] sm:w-[56px] w-[40px] sm:h-[56px] border-[1px] border-[#26262e] bg-[#191919] flex items-center justify-center  h-[40px]">
              {tokenSymbol?.toString()?.slice(0, 1)}
            </h1>
          )}
          <div className="flex flex-col">
            <div className="flex items-center sm:gap-2 gap-[8px]">
              <div className="text-white font-[700] text-lg sm:text-[28px] font-spaceGrotesk">
                {tokenSymbol}
              </div>
              <div className="text-[#A8A8A8] text-xs md:text-[14px]">
                {tokenaddress && tokenaddress.length >= 10
                  ? `${tokenaddress.slice(0, 5)}...${tokenaddress.slice(-3)}`
                  : tokenaddress}
              </div>
              <div onClick={() => handleCopy(tokenaddress)}>
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
              <Link
                href={`https://www.pump.news/en/${tokenaddress}-solana`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] h-[17px] w-[17px] border border-[#4CAF50] text-[#ffffff] rounded-md flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#409143] to-[#093d0c] shadow-[0_0_4px_rgba(76,255,80,0.4)]">
                  AI
                </div>
              </Link>
            </div>
            <div className="flex gap-3">
              {[Telegram, linkedin, NewX].map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`icon-${index}`}
                  width={20}
                  height={20}
                  className="sm:w-[20px] sm:h-[20px] w-[17px] h-[17px] cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Numbers */}
        <div className="sm:p-[0px] p-3 flex items-center">
          <div className="grid grid-cols-4 lg:gap-6 md:gap-4 gap-2">
            {TokenDetailsNumberData?.map((num, index) => {
              return (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-[#A8A8A8] text-xs uppercase">
                    {num.label}
                  </span>
                  <span className="text-white font-bold text-sm">
                    {num?.label == "Price USD"
                      ? decimalConvert(num?.price)
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
        <div className="flex items-center justify-between mb-[5px] md:mb-[0px] px-3 md:px-[0px]">
          <div className="flex items-center md:flex-col">
            <div
              className="cursor-pointer border-[1px] md:!border-t-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center"
            >
              {isFavourite ? (
                <FaHeart
                  onClick={removeFromFavouriteHandler}
                  className="text-[#1F73FC] text-[20px]" />
              ) : (
                <CiHeart
                  onClick={addToFavouriteHandler}
                  className="text-[#F6F6F6] text-[23px]" />
              )}
            </div>
            <div className="cursor-pointer border-[1px] md:!border-b-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center">
              <MdKeyboardArrowLeft className="text-[#F6F6F6] text-[23px]" />
            </div>
          </div>
          <div className="flex items-center md:flex-col">
            <div
              className="cursor-pointer border-[1px] md:!border-t-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <PiShare className="text-[#F6F6F6] text-[23px]" />
            </div>
            <div className="cursor-pointer border-[1px] md:!border-b-0 border-[#404040] h-[40px] w-[40px] flex items-center justify-center">
              <MdKeyboardArrowRight className="text-[#F6F6F6] text-[23px]" />
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
              className="bg-[#141414] shadow-lg w-[480px] rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between py-[12px] px-[24px]">
                <h1 className="text-[22px] font-[700] text-[#F6F6F6]">Share</h1>
                <RxCross1 onClick={() => setIsModalOpen(false)} className="text-[16px] text-[#F6F6F6] cursor-pointer" />
              </div>
              <div className="bg-[#404040] h-[1.5px]"></div>
              <div className="py-[12px] px-[24px]">
                <h1 className="text-[18px] font-[700] text-[#F6F6F6]">
                  Share to
                </h1>
                {/* social icons */}
                <div className="grid grid-cols-4 place-content-between">
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px]">
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BsTwitterX className="text-[25px] text-[#F6F6F6]" />
                      </a>
                    </div>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">X</h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <RiFacebookCircleLine className="text-[25px] text-[#F6F6F6]" />
                      </a>
                    </div>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Facebook
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <a
                        href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PiRedditLogo className="text-[25px] text-[#F6F6F6]" />
                      </a>
                    </div>
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
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PiTelegramLogoDuotone className="text-[25px] text-[#F6F6F6]" />
                      </a>
                    </div>
                    <h1 className="text-[14px] font-[500] text-[#F6F6F6]">
                      Telegram
                    </h1>
                  </div>
                  <div className="mt-[16px] flex flex-col items-center justify-center gap-[4px] ">
                    <div className="w-[64px] h-[64px] rounded-full bg-[#133D94] flex items-center cursor-pointer justify-center">
                      <a
                        href={`https://www.facebook.com/dialog/send?link=https://wavepro.com&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
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
