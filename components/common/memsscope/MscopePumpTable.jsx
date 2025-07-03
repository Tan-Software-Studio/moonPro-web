/* eslint-disable @next/next/no-img-element */
import React, { memo, useEffect, useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import { PiCopyThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
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
  telegrams,
  twitter,
  Users,
  Vol,
  website,
} from "@/app/Images";
import Image from "next/image";
import ChartComponent from "./ChartComponent";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import { IoSearchSharp } from "react-icons/io5";
import RoundProgressBar from "@/components/RoundProgressBar/RoundProgressBar";
import SingleLineProgressBar from "@/components/SingleLineProgressBar/SingleLineProgressBar";
import NoData from "../NoData/noData";
import MemescopeImages from "./MemescopeImages";
import { setActiveChartToken } from "@/app/redux/chartDataSlice/chartData.slice";

const MscopePumpTable = ({
  MemscopeData,
  selectedMetric,
  searchbar,
  showCircle,
  setSelectedMetric,
  setShowMarketCap,
  showMarketCap,
  showVolume,
  setShowVolume,
  showSocials,
  setShowSocials,
  showHolders,
  setShowHolders,
  setshowHolders10,
  showHolders10,
  setProgerssBar,
  progerssBar,
  barColor,
  capsuleImg,
  isChartHide,
  dynamicImg,
  url,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoverRow, sethoverRow] = useState(false);
  // solana live price
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const activeSolWalletAddress = useSelector(
    (state) => state?.userData?.activeSolanaWallet
  );
  const bigLoader = useSelector((state) => state?.AllStatesData?.bigLoader);

  const initialLoading = useSelector(
    (state) => state?.allMemescopeData?.initialLoading
  );

  const dispatch = useDispatch();

  const quickBuy = useSelector((state) => state?.AllStatesData?.globalBuyAmt);

  useEffect(() => {
    const defaultSettings = {
      showMarketCap: true,
      showVolume: true,
      showSocials: true,
      showHolders: true,
      showHolders10: true,
      selectedMetric: "12", // this can be a string or number depending on your usage
      showCircle: false,
      searchbar: true,
      progerssBar: true,
    };

    // Get stored settings object from localStorage
    const storedSettings = localStorage.getItem("DisplaySettings");

    let parsedSettings;

    if (storedSettings === null || storedSettings === undefined) {
      // Store defaults if nothing exists
      localStorage.setItem("DisplaySettings", JSON.stringify(defaultSettings));
      parsedSettings = defaultSettings;
    } else {
      parsedSettings = JSON.parse(storedSettings);
    }

    // Apply values to state
    setShowMarketCap(parsedSettings.showMarketCap);
    setShowVolume(parsedSettings.showVolume);
    setShowSocials(parsedSettings.showSocials);
    setShowHolders(parsedSettings.showHolders);
    setshowHolders10(parsedSettings.showHolders10);
    setSelectedMetric(parsedSettings.selectedMetric);
    setProgerssBar(parsedSettings.progerssBar);
  }, []);

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
  ];
  const socialIcons = [
    { icon: twitter, title: "twitter" },
    { icon: telegrams, title: "telegram" },
    { icon: website, title: "website" },
    { icon: pumpfun, title: "pumpfun" },
  ];

  const copyAddress = (address, index, e) => {
    e.stopPropagation();
    e.preventDefault();
    navigator?.clipboard?.writeText(address);
    setCopied(index);
    // toast.success("address copied successfully");
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  const [copied, setCopied] = useState(false);
  function navigateToChartSreen(block) {
    dispatch(setActiveChartToken({ symbol: block?.symbol, img: block?.img }));
  }

  const SkeletonData = Array(8).fill(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {initialLoading ? (
        SkeletonData.map((_, ind) => (
          <div
            key={ind}
            className={` ${ind % 2 === 0 && "bg-[#16171ca4]"} w-full`}
          >
            <div className="whitespace-nowrap py-4 h-[100px] flex justify-between items-center animate-pulse w-full">
              <div className="px-2 w-full">
                <div className="flex items-start gap-2 w-full">
                  <div className="w-[80px] h-[70px] rounded bg-[#191919]"></div>
                  <div className="w-full">
                    <div className="w-[170px] mt-2 h-[12px] rounded-sm bg-[#191919]"></div>
                    <div className="w-[110px] h-[10px] rounded-sm bg-[#191919] mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : MemscopeData.length > 0 ? (
        <>
          <div
            className={`h-svh max-h-svh visibleScroll md:border-r-[1px]  md:border-r-[#26262e]  overflow-y-scroll`}
          >
            {MemscopeData.map((block, index) => (
              <Link key={index + 1} href={`/meme/${block?.address}`}>
                <div
                  className={`cursor-pointer border-b md:border-b md:border-l-0 md:border-t-0 border-[#26262e] bg-[#08080E] hover:bg-[#6e6e6e1a] ease-in-out duration-200`}
                  onClick={() => navigateToChartSreen(block)}
                  onMouseEnter={() => sethoverRow(index)}
                  onMouseLeave={() => sethoverRow(null)}
                >
                  <div className="flex md:space-y-0 px-[16px] py-[10px] md:px-[32px] md:py-[15px] gap-3 justify-center items-center">
                    <div className="flex justify-center items-center">
                      <div className="relative w-[70px] h-[70px]">
                        {showCircle ? (
                          <RoundProgressBar
                            value={block?.bonding_curv || 0}
                            capsuleImg={capsuleImg}
                            maxValue={100}
                            trailColor="#7b8085"
                            progressColor={`${
                              !progerssBar
                                ? barColor
                                : barColor === "#cfc328"
                                ? "#cfc328 "
                                : "#7b8085"
                            }`}
                          />
                        ) : (
                          <SquareProgressBar
                            value={block?.bonding_curv || 0}
                            capsuleImg={capsuleImg}
                            maxValue={100}
                            trailColor="#7b8085"
                            progressColor={`${
                              !progerssBar
                                ? barColor
                                : barColor === "#cfc328"
                                ? "#cfc328 "
                                : "#7b8085"
                            }`}
                          />
                        )}
                        {progerssBar ? (
                          <div className="mt-2">
                            <SingleLineProgressBar
                              value={block?.bonding_curv || 0}
                              maxValue={100}
                              progressColor={barColor}
                            />
                          </div>
                        ) : null}
                        <MemescopeImages
                          showCircle={showCircle}
                          key={`${block?.address}-${index}`}
                          address={block?.address}
                          symbol={block?.symbol}
                          base_url={url}
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

                                  return showSocials ? (
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
                                  ) : null;
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
                              <Link
                                href={`https://x.com/search?q=${block?.address}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IoSearchSharp color="#BBBBBC" size={19} />
                              </Link>
                            </div>
                            {/* <div className="text-[#6E6E6E]">|</div> */}
                            {/* <Tooltip
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
                            </Tooltip> */}
                          </div>
                        </div>
                        <div>
                          <div className="w-[90px] h-[60px] relative flex items-center justify-center">
                            {isChartHide && (
                              <div
                                className={`${
                                  hoverRow === index
                                    ? "opacity-40 absolute inset-0 flex items-center justify-center"
                                    : "opacity-100"
                                } `}
                              >
                                <ChartComponent
                                  candlesticks={block?.candlesticks}
                                />
                              </div>
                            )}
                            {hoverRow === index && (
                              <>
                                <div
                                  className={`absolute ${
                                    index == 0 ? "-top-2" : "-top-12"
                                  } right-44 rounded-md text-[#21CB6B] text-xs font-light border-[1px]  border-[#333333] bg-[#191919]  px-4 py-1 flex items-center justify-between !z-[9] w-fit whitespace-nowrap transition-all duration-100 ease-in-out`}
                                >
                                  <p>Bonding : </p>
                                  {block?.bonding_curv >= 100
                                    ? "100%"
                                    : block?.bonding_curv
                                    ? `${block?.bonding_curv?.toFixed(2)} %`
                                    : "0%"}
                                </div>
                                <button
                                  className="absolute  w-fit whitespace-nowrap rounded-md bg-[#1d73fc] hover:bg-[#438bff] text-[#111111] font-bold py-1 px-5 text-xs transition-all duration-100 ease-in-out"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    buySolanaTokensQuickBuyHandler(
                                      solanaLivePrice,
                                      block?.address,
                                      quickBuy,
                                      activeSolWalletAddress?.wallet ||
                                        solWalletAddress,
                                      activeSolWalletAddress?.balance || 0,
                                      e,
                                      block?.programAddress
                                        ? block?.programAddress
                                        : "dmasudonjfsdg",
                                      dispatch,
                                      block?.current_price,
                                      {
                                        name: block?.name,
                                        symbol: block?.symbol,
                                        img: block?.img || null,
                                      }
                                    );
                                  }}
                                >
                                  {quickBuy > 0
                                    ? `${
                                        quickBuy?.length > 6
                                          ? `${quickBuy.slice(0, 7)}...`
                                          : `${quickBuy} SOL`
                                      }`
                                    : "Buy"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex gap-[12px] order-2">
                          {showHolders ? (
                            block?.holders > 0 ? (
                              <Tooltip
                                body={`Number of Holders: ${block?.holders}`}
                              >
                                <div className="flex items-center gap-[4px]">
                                  <Image src={Users} alt="user" />
                                  <div className="text-[#F1F0F0] text-xs md:text-[12px] font-400">
                                    {block?.holders}
                                  </div>
                                </div>
                              </Tooltip>
                            ) : null
                          ) : null}

                          {showVolume ? (
                            <Tooltip
                              body={`Volume: ${
                                block?.volume
                                  ? humanReadableFormat(
                                      block?.volume.toFixed(2)
                                    )
                                  : 0
                              }`}
                            >
                              <div className="flex items-center gap-[4px]">
                                <Image src={Vol} alt="volume" />
                                <div className="text-[#F1F0F0] text-xs md:text-[12px] font-400">
                                  {block?.volume
                                    ? humanReadableFormat(
                                        block?.volume.toFixed(2)
                                      )
                                    : 0}{" "}
                                </div>
                              </div>
                            </Tooltip>
                          ) : null}

                          {showMarketCap ? (
                            <Tooltip
                              body={`Market Cap: ${
                                block?.MKC ? humanReadableFormat(block?.MKC) : 0
                              }`}
                            >
                              <div className="flex items-center gap-[4px]">
                                <Image
                                  src={MC}
                                  alt="MC"
                                  className={
                                    selectedMetric
                                      ? `w-[${selectedMetric}px] h-[${selectedMetric}px]`
                                      : null
                                  }
                                />
                                <div
                                  className={`text-xs md:font-[400]`}
                                  style={{
                                    color: barColor,
                                    fontSize: `${selectedMetric}px`,
                                  }}
                                >
                                  {block?.MKC
                                    ? humanReadableFormat(block?.MKC)
                                    : 0}
                                </div>
                              </div>
                            </Tooltip>
                          ) : null}
                        </div>
                        <div className="flex gap-[8px] order-1">
                          {block?.additionalInfo?.map((item, index) => {
                            const matchedData = percentages.find(
                              (iconItem) => iconItem.title === item.title
                            );
                            return showHolders10 ? (
                              <Tooltip
                                key={index}
                                body={`${matchedData?.getToolTip(item?.value)}`}
                              >
                                <div className="flex gap-[4px] items-center font-[400]">
                                  {matchedData && (
                                    <Image
                                      src={matchedData?.icon}
                                      alt={matchedData?.title}
                                    />
                                  )}
                                  <div
                                    className={`text-[12px] ${matchedData?.color}`}
                                  >
                                    {matchedData?.title === "sniper_count"
                                      ? item.value
                                      : `${item.value}%`}
                                  </div>
                                </div>
                              </Tooltip>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col  h-[70vh] w-full items-center justify-center mt-5">
          <NoData />
        </div>
      )}
      {bigLoader == true && <LoaderPopup />}
    </>
  );
};

export default memo(MscopePumpTable);
