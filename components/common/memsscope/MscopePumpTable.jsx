/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import { PiCopyThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { humanReadableFormat, UpdateTime } from "@/utils/calculation";
import "react-circular-progressbar/dist/styles.css";
import SquareProgressBar from "../../common/SquareProgressBarcom/SquareProgressBar";
import { buySolanaTokensQuickBuyHandler } from "@/utils/solanaBuySell/solanaBuySell";
import LoaderPopup from "../LoaderPopup/LoaderPopup";
import Link from "next/link";
import {
  DH,
  H10,
  MC,
  pumpfun,
  sniper,
  telegrams,
  twitter,
  Users,
  Vol,
  website,
} from "@/app/Images";
import Image from "next/image";
import ChartComponent from "./ChartComponent";
import {
  fetchSolanaNativeBalance,
  setChartSymbolImage,
  setSolanaNativeBalance,
} from "@/app/redux/states";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import { getSolanaBalanceAndPrice } from "@/utils/solanaNativeBalance";

const MscopePumpTable = ({ MemscopeData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoverRow, sethoverRow] = useState(false);
  const nativeTokenbalance = useSelector(
    (state) => state?.AllStatesData?.solNativeBalance
  );
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const bigLoader = useSelector((state) => state?.AllStatesData?.bigLoader);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const quickBuy = useSelector((state) => state?.AllStatesData?.globalBuyAmt);

  const percentages = [
    {
      icon: H10,
      color: "text-[#21CB6B]",
      title: "holdingsPercentage",
      getToolTip: (dynamicValue) =>
        `Top 10 holding is less than 15% at (${dynamicValue}%)`,
    },
    {
      icon: DH,
      color: "text-[#21CB6B]",
      title: "devHoldingsPercentage",
      getToolTip: (dynamicValue) => `Token Developer holds ${dynamicValue}%`,
    },
    {
      icon: sniper,
      color: "text-[#ED1B24]",
      title: "sniper_count",
      getToolTip: (dynamicValue) => `Number of Snipers: ${dynamicValue}`,
    },
  ];
  const socialIcons = [
    { icon: twitter, title: "twitter" },
    { icon: telegrams, title: "telegram" },
    { icon: website, title: "website" },
    { icon: pumpfun, title: "pumpfun" },
  ];

  const copyAddress = (address, index, e) => {
    e.stopPropagation();
    navigator?.clipboard?.writeText(address);
    setCopied(index);
    // toast.success("address copied successfully");
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  const [copied, setCopied] = useState(false);
  async function navigateToChartSreen(block) {
    await localStorage.setItem("chartTokenImg", block?.img);
    await dispatch(setChartSymbolImage(block?.img));
    router.push(
      `/tradingview/solana?tokenaddress=${block?.address}&symbol=${block?.symbol}`
    );
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (solWalletAddress) {
      dispatch(fetchSolanaNativeBalance(solWalletAddress));
    }
  }, [solWalletAddress]);
  return (
    <>
      {MemscopeData.length == 0 ? (
        <div
          className="snippet flex justify-center mt-20   "
          data-title=".dot-spin"
        >
          <div className="stage">
            <div className="dot-spin"></div>
          </div>
        </div>
      ) : (
        <>
          <div className={`h-[78vh] visibleScroll overflow-y-auto`}>
            {MemscopeData?.slice(0, 20)?.map((block, index) => (
              <div
                key={block.id}
                className={`cursor-pointer border-b  md:border-b md:border-r md:border-l-0 md:border-t-0 border-[#26262e] bg-[#08080E] hover:bg-[#6e6e6e1a] ease-in-out duration-200`}
                onClick={() => navigateToChartSreen(block)}
                onMouseEnter={() => sethoverRow(index)}
                onMouseLeave={() => sethoverRow(null)}
              >
                <div className="flex md:space-y-0 px-[16px] py-[10px] md:px-[32px] md:py-[15px] gap-3 justify-center items-center">
                  <div className="flex justify-center items-center">
                    <div className="relative w-[70px] h-[70px]">
                      <SquareProgressBar
                        value={block?.bonding_curv || 0}
                        maxValue={100}
                        trailColor="#7b8085"
                        progressColor={"#4FAFFE"}
                      />

                      <img
                        key={block?.img}
                        src={
                          block?.img
                            ? block?.img
                            : "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg"
                        }
                        alt="Profile"
                        className="absolute inset-0 m-auto w-[64px] h-[64px] rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        {/* token name and copy address */}
                        <div className="flex items-center gap-[2px]">
                          <div
                            className={`text-[#F6F6F6] text-[14px] font-[400] md:text-[16px] md:font-[700] uppercase`}
                          >
                            {block?.symbol?.length >= 12
                              ? `${block?.symbol.slice(0, 12)}...`
                              : block?.symbol}
                          </div>
                          <div className="text-[#6E6E6E] text-[14px] font-[400] md:text-[16px] md:font-[700]">
                            /
                          </div>
                          <div
                            className={`text-[#6E6E6E] text-[16px] font-[400] lowercase`}
                          >
                            {block?.name?.length >= 12
                              ? `${block?.name.slice(0, 12)}...`
                              : block?.name}
                          </div>
                          <div
                            onClick={(e) =>
                              copyAddress(block?.address, index, e)
                            }
                            className="text-sm "
                          >
                            {copied === index ? (
                              <IoMdDoneAll className="text-[#F6F6F6] cursor-pointer" />
                            ) : (
                              <PiCopyThin className="text-[#F6F6F6] cursor-pointer" />
                            )}
                          </div>
                          {/* {block?.replyCount > 0 && (
                            <div className="flex items-center">
                              <span>
                                <MdQuickreply
                                  size={13}
                                  className="text-[#7b8085]"
                                />
                              </span>
                              <span className="text-xs text-[#7b8085]">
                                {block?.replyCount}
                              </span>
                            </div>
                          )} */}
                        </div>
                        {/* time and social links */}
                        <div className={`flex items-center gap-[8px]`}>
                          <div
                            className={`text-[#6E6E6E] text-[14px] font-[400]`}
                          >
                            {UpdateTime(block?.created_time, currentTime)}
                          </div>
                          <div className="text-[#6E6E6E]">|</div>
                          <div className="flex gap-2">
                            {block?.socialIconsLink
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
                              href={`https://www.pump.news/en/${block?.address}-solana`}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="text-[10px] h-[17px] w-[17px] border border-[#4CAF50] text-[#ffffff] rounded-md flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#409143] to-[#093d0c] shadow-[0_0_4px_rgba(76,255,80,0.4)]">
                                AI
                              </div>
                            </Link>
                          </div>
                          <div className="text-[#6E6E6E]">|</div>
                          <Tooltip
                            body={
                              "Represents how far along the token is on its bonding curve. A higher % means more tokens have been bought, pushing the price higher.\nEarly % = cheaper price\nHigher % = more expensive and more demand."
                            }
                          >
                            <div
                              className={`text-[#21CB6B] text-[12px] font-[400]`}
                            >
                              {block?.bonding_curv >= 100
                                ? "100%"
                                : block?.bonding_curv
                                ? `${block?.bonding_curv?.toFixed(2)} %`
                                : "0%"}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                      <div>
                        <div className="w-[60px] h-[60px] relative flex items-center justify-center">
                          <div
                            className={`${
                              hoverRow === index
                                ? "opacity-40 absolute inset-0 flex items-center justify-center"
                                : "opacity-100"
                            } `}
                          >
                            <ChartComponent block={block} />
                          </div>
                          {hoverRow === index && (
                            <button
                              className="absolute z-10 border border-[#1F73FC] rounded-lg bg-[#16171D] py-1 px-5 text-xs hover:bg-[#11265B] transition-all duration-300 ease-in-out"
                              onClick={(e) =>
                                buySolanaTokensQuickBuyHandler(
                                  block?.address,
                                  quickBuy,
                                  solWalletAddress,
                                  nativeTokenbalance,
                                  e,
                                  "6ef8rrecthr5dkzon8nwu78hrvfckubj14m5ubewf6p",
                                  block?.bonding_curv,
                                  dispatch
                                )
                              }
                            >
                              {quickBuy
                                ? `${
                                    quickBuy?.length > 6
                                      ? `${quickBuy.slice(0, 7)}...`
                                      : quickBuy
                                  }`
                                : 0}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex gap-[12px] order-2">
                        <Tooltip
                          body={`Number of Holders: ${
                            block?.holders ? block.holders : 0
                          }`}
                        >
                          <div className="flex items-center gap-[4px]">
                            <Image src={Users} alt="user" />
                            <div className="text-[#F1F0F0] text-xs md:text-[12px] font-400">
                              {block?.holders ? block?.holders : 0}
                            </div>
                          </div>
                        </Tooltip>

                        <Tooltip
                          body={`Volume: ${
                            block?.volume
                              ? humanReadableFormat(block?.volume.toFixed(2))
                              : 0
                          }`}
                        >
                          <div className="flex items-center gap-[4px]">
                            <Image src={Vol} alt="volume" />
                            <div className="text-[#F1F0F0] text-xs md:text-[12px] font-400">
                              {block?.volume
                                ? humanReadableFormat(block?.volume.toFixed(2))
                                : 0}{" "}
                            </div>
                          </div>
                        </Tooltip>

                        <Tooltip
                          body={`Market Cap: ${
                            block?.MKC ? humanReadableFormat(block?.MKC) : 0
                          }`}
                        >
                          <div className="flex items-center gap-[4px]">
                            <Image src={MC} alt="MC" />
                            <div className="text-[#F1F0F0] text-xs md:text-[12px] font-400">
                              {block?.MKC ? humanReadableFormat(block?.MKC) : 0}
                              {/* {humanReadableMarketCap(block?.marketCap)} */}
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                      <div className="flex gap-[8px] order-1">
                        {block?.additionalInfo?.map((item, index) => {
                          const matchedData = percentages.find(
                            (iconItem) => iconItem.title === item.title
                          );
                          return (
                            <Tooltip
                              key={index}
                              body={`${matchedData?.getToolTip(item?.value)}`}
                            >
                              <div
                                className={`flex gap-[4px] items-center font-[400]`}
                              >
                                {matchedData && (
                                  <Image
                                    src={matchedData?.icon}
                                    alt={matchedData?.title}
                                  />
                                )}
                                <div
                                  className={`text-[12px]  ${matchedData?.color}`}
                                >
                                  {matchedData?.title == "sniper_count"
                                    ? item.value
                                    : `${item.value}%`}
                                </div>
                              </div>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {bigLoader == true && <LoaderPopup />}
    </>
  );
};

export default MscopePumpTable;
