/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import NoDataMessage from "@/components/NoDataMessage/NoDataMessage";
import {
  calculatePercentageChange,
  convertToRelativeTime,
  decimalConvert,
} from "@/utils/calculation";
import { setChartSymbolImage, setIsSearchPopup } from "@/app/redux/states";
import { usePathname, useRouter } from "next/navigation";
import { solana } from "@/app/Images";
import Image from "next/image";
import Link from "next/link";

const SearchResultData = ({ searchResult, searchLoader }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRefs = useRef({});
  const pathname = usePathname();
  const getNetwork = pathname.split("/")[2];

  const dispatch = useDispatch();
  const navigate = useRouter();

  const SkeletonData = Array(13).fill(null);
  const SkeletonInnerData = Array(7).fill(null);

  const copyAddress = (address, uniqueId, event) => {
    event.stopPropagation();

    // Copy the address to clipboard
    navigator?.clipboard?.writeText(address);

    // Clear any existing timeout for this unique ID
    if (timeoutRefs.current[uniqueId]) {
      clearTimeout(timeoutRefs.current[uniqueId]);
    }

    // Set the copied state for this unique ID
    setCopied((prev) => ({ ...prev, [uniqueId]: true }));

    // Set a timeout to reset the copied state after 3 seconds
    timeoutRefs.current[uniqueId] = setTimeout(() => {
      setCopied((prev) => {
        const updated = { ...prev };
        delete updated[uniqueId];
        return updated;
      });
    }, 3000);
  };

  function formatNumber(num) {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + "T"; // Trillions
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B"; // Billions
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M"; // Millions
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K"; // Thousands
    } else {
      return num.toString(); // Less than a thousand
    }
  }
  async function navigateToChartView(e) {
    localStorage.setItem("chartTokenImg", e?.img);
    await dispatch(setChartSymbolImage(e?.img));
    // Retrieve existing recent tokens or initialize an empty array
    let recentTokens = JSON.parse(localStorage.getItem("recentTokens")) || [];

    // Remove the token if it already exists (to avoid duplicates)
    recentTokens = recentTokens.filter(
      (token) =>
        token.Trade.Currency.MintAddress !== e.Trade.Currency.MintAddress
    );

    // Add the new token at the beginning
    recentTokens.unshift(e); // Store full object

    // Keep only the last 5 tokens
    if (recentTokens.length > 10) {
      recentTokens = recentTokens.slice(0, 5);
    }

    // Save back to localStorage
    localStorage.setItem("recentTokens", JSON.stringify(recentTokens));

    await dispatch(setIsSearchPopup(false));
    localStorage.setItem("silectChainName", getNetwork);
    localStorage.setItem("chartTokenAddress", e?.Trade?.Currency?.MintAddress);
  }
  return (
    <>
      {searchLoader === true ? (
        <table className="min-w-full !text-xs w-full">
          {SkeletonData.map((_, ind) => (
            <tbody key={ind} className="text-center">
              <tr className={` ${ind % 2 === 0 && "bg-[#16171ca4]"} w-full`}>
                {SkeletonInnerData.map((_, ind) => (
                  <td key={ind} className="whitespace-nowrap px-2 py-4">
                    <div className="w-full h-[32px] rounded bg-[#191919] animate-pulse"></div>
                  </td>
                ))}
              </tr>
            </tbody>
          ))}
        </table>
      ) : searchResult?.length == 0 ? (
        <div className="h-[60vh] flex items-center justify-center w-full">
          <NoDataMessage
            noDataMessage={
              searchResult?.length == 0
                ? "Please enter the proper token name, symbol or address."
                : "Internal Server Error"
            }
          />
        </div>
      ) : (
        searchResult.map((e, ind) => {
          const TokenSupplyUpdate = e.TokenSupplyUpdate;
          const Trade = e.Trade;
          const MarketCap = TokenSupplyUpdate?.totalSupply * Trade?.currentUSD;

          const converted = decimalConvert(Trade?.currentUSD || 0);
          return (
            <>
              <div
                key={ind}
                className="flex flex-col lg:flex-row lg:flex-1 items-center overflow-hidden hover:bg-[#3333339c] bg-[#08080E] cursor-pointer rounded-md border border-[#333333] mb-3 py-[11px] px-3"
                onClick={() => {
                  navigateToChartView(e);
                  navigate.push(
                    `/tradingview/solana?tokenaddress=${
                      e?.Trade?.Currency?.MintAddress
                    }&symbol=${e?.Trade?.Currency?.Symbol || "unknown"}&pair=${
                      e?.Trade?.Market?.MarketAddress
                    }`
                  );
                }}
              >
                <div className="flex flex-1 w-full items-center overflow-hidden">
                  <div className="flex flex-col justify-center shrink-0 gap-2">
                    <Image
                      src={solana}
                      alt="solana"
                      className="w-[15px] lg:w-5 h-[15px] lg:h-5"
                    />
                    {e?.dexImg ? (
                      <img
                        src={e?.dexImg}
                        alt={`${Trade?.Dex?.ProtocolName}`}
                        className="w-[15px] lg:w-5 h-[15px] lg:h-5"
                      />
                    ) : (
                      <span className="text-xs text-gray-700 uppercase w-[15px] lg:w-5 h-[15px] lg:h-5 text-center select-none">
                        {Trade?.Dex?.ProtocolName
                          ? Trade?.Dex?.ProtocolName.charAt(0)
                          : "?"}
                      </span>
                    )}
                  </div>
                  <div className="ml-2 lg:ml-3 shrink-0">
                    <div className="flex w-10 h-10 lg:w-[54px] lg:h-[54px] items-center justify-center border border-dashed rounded-md border-gray-700">
                      {e?.img ? (
                        <img
                          key={ind}
                          src={e?.img}
                          alt={`${Trade?.Currency?.Symbol}`}
                          className="w-10 lg:w-[54px] h-10 lg:h-[54px] rounded-md border border-dashed border-gray-700 text-sm text-gray-700 uppercase"
                        />
                      ) : Trade?.Currency?.Symbol ? (
                        Trade?.Currency?.Symbol?.charAt(0)
                      ) : (
                        "?"
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex flex-col justify-center  lg:flex-row lg:gap-2 relative -top-1">
                      <div className="flex gap-[0.375rem] w-full items-center grow-[2] overflow-hidden">
                        <span className="text-sm text-ellipsis overflow-hidden min-w-[14px] font-semibold whitespace-nowrap">
                          {Trade?.Currency?.Symbol}
                        </span>
                        <span className="text-[#9b9999] text-xs">/</span>
                        <span className="text-sm text-[#9b9999] min-w-[14px]">
                          SOL
                        </span>
                        <span className="text-sm text-ellipsis overflow-hidden min-w-[14px] whitespace-nowrap">
                          {Trade?.Currency?.Name}
                        </span>
                        <Link
                          href={`https://www.pump.news/en/${Trade?.Currency?.MintAddress}-solana`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-[10px] h-[17px] w-[17px] border border-[#4CAF50] text-[#ffffff] rounded-md flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#409143] to-[#093d0c] shadow-[0_0_4px_rgba(76,255,80,0.4)]">
                            AI
                          </div>
                        </Link>
                      </div>
                      <div className="flex lg:ml-auto lg:pl-2 lg:mt-[0.375rem]">
                        <div className="flex gap-3 items-center justify-center">
                          <span className="text-sm font-semibold whitespace-nowrap">
                            {`$ ${converted.main}`}
                            <span
                              className="mx-0.5"
                              style={{ fontSize: "20px", verticalAlign: "sub" }}
                            >
                              {converted.subscript}
                            </span>
                            {converted.decimalNumber}
                          </span>
                          <div className="flex justify-between w-full gap-3">
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                              <span className="text-[#4c544e] text-xs">
                                24h:{" "}
                              </span>
                              <span
                                className={`text-sm font-semibold ml-1 ${
                                  calculatePercentageChange(
                                    Trade?.currentUSD,
                                    Trade?.usd_24h
                                  ) == 0
                                    ? "text[#999999]"
                                    : calculatePercentageChange(
                                        Trade?.currentUSD,
                                        Trade?.usd_24h
                                      ) > 0
                                    ? "text-[#48BB78]"
                                    : "text-[#F56565]"
                                }`}
                              >
                                {`${calculatePercentageChange(
                                  Trade?.currentUSD,
                                  Trade?.usd_24h
                                )} %` || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                              <span className="text-[#4c544e] text-xs">
                                1h:{" "}
                              </span>
                              <span
                                className={`text-sm font-semibold ml-1 ${
                                  calculatePercentageChange(
                                    Trade?.currentUSD,
                                    Trade?.usd_1h
                                  ) == 0
                                    ? "text[#999999]"
                                    : calculatePercentageChange(
                                        Trade?.currentUSD,
                                        Trade?.usd_1h
                                      ) > 0
                                    ? "text-[#48BB78]"
                                    : "text-[#F56565]"
                                }`}
                              >
                                {`${calculatePercentageChange(
                                  Trade?.currentUSD,
                                  Trade?.usd_1h
                                )} %` || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                              <span className="text-[#4c544e] text-xs">
                                5m:{" "}
                              </span>
                              <span
                                className={`text-sm font-semibold ml-1 ${
                                  calculatePercentageChange(
                                    Trade?.currentUSD,
                                    Trade?.usd_5m
                                  ) == 0
                                    ? "text[#999999]"
                                    : calculatePercentageChange(
                                        Trade?.currentUSD,
                                        Trade?.usd_5m
                                      ) > 0
                                    ? "text-[#48BB78]"
                                    : "text-[#F56565]"
                                }`}
                              >
                                {`${calculatePercentageChange(
                                  Trade?.currentUSD,
                                  Trade?.usd_5m
                                )} %` || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[13px] text-[#bfbfbf] hidden lg:block">
                      <div className="flex gap-3">
                        <div className="flex flex-1 items-center gap-3">
                          <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem]">
                            <span className="text-[#B2B2B7] text-xs">
                              Mkt Cap:
                            </span>
                            <span className="text-sm text-[#D5D5DA] ml-1">
                              {` $ ${
                                formatNumber(parseInt(MarketCap)) || null
                              }`}
                            </span>
                          </div>
                          <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem]">
                            <span className="text-[#B2B2B7] text-xs">
                              Liq:{" "}
                            </span>
                            <span className="text-sm text-[#D5D5DA] ml-1">
                              0.000
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-1 items-center gap-3">
                          <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem]">
                            <span className="text-[#B2B2B7] text-xs">
                              24h Vol:{" "}
                            </span>
                            <span className="text-sm text-[#D5D5DA] ml-1">
                              {` $ ${
                                formatNumber(
                                  parseInt(e?.traded_volume_total)
                                ) || null
                              }`}
                            </span>
                          </div>
                          <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem] gap-1">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 512 512"
                              focusable="false"
                              className="chakra-icon custom-1jmtuae"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z"></path>
                            </svg>
                            <span className="text-xs text-[#D5D5DA]">
                              {`${
                                convertToRelativeTime(e?.Block?.createdAt) ||
                                null
                              }`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-[#bfbfbf] block lg:hidden w-full mt-2">
                  <div className="flex flex-col lg:flex-row gap-1 lg:gap-3">
                    <div className="flex flex-1 items-center gap-[0.375rem]">
                      <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem]">
                        <span className="text-[#B2B2B7] text-xs">Mkt Cap:</span>
                        <span className="text-sm text-[#D5D5DA] ml-1">
                          {` $ ${formatNumber(parseInt(MarketCap)) || null}`}
                        </span>
                      </div>
                      <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem]">
                        <span className="text-[#B2B2B7] text-xs">Liq: </span>
                        <span className="text-sm text-[#D5D5DA] ml-1">
                          0.000
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-[0.375rem]">
                      <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem]">
                        <span className="text-[#B2B2B7] text-xs">
                          24h Vol:{" "}
                        </span>
                        <span className="text-sm text-[#D5D5DA] ml-1">
                          {` $ ${
                            formatNumber(parseInt(e?.traded_volume_total)) ||
                            null
                          }`}
                        </span>
                      </div>
                      <div className="flex flex-1 items-center justify-center border border-gray-700 rounded h-6 px-[0.375rem] gap-1">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 512 512"
                          focusable="false"
                          className="chakra-icon custom-1jmtuae"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z"></path>
                        </svg>
                        <span className="text-xs text-[#D5D5DA]">
                          {`${
                            convertToRelativeTime(e?.Block?.createdAt) || null
                          }`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col lg:ml-[60px] gap-[0.625rem] text-[13px] text-[#737373] mt-3 lg:mt-0">
                  <div className="flex justify-between items-center">
                    <span className="md:w-[45px] text-right text-xs opacity-50">
                      Pair:{" "}
                    </span>
                    <div
                      className="flex justify-between items-center gap-0.5"
                      onClick={(event) =>
                        copyAddress(
                          e?.Trade?.Market?.MarketAddress,
                          `${ind}-pairAddress`,
                          event
                        )
                      }
                    >
                      <span className="font-mono ml-1">
                        {e?.Trade?.Market?.MarketAddress
                          ? `${e?.Trade?.Market?.MarketAddress?.slice(
                              0,
                              4
                            )}....${e?.Trade?.Market?.MarketAddress?.slice(-4)}`
                          : `....`}
                      </span>
                      <span>
                        {copied[`${ind}-pairAddress`] ? (
                          <IoMdDoneAll className="text-[#48BB78] cursor-pointer" />
                        ) : (
                          <BiSolidCopy className="text-[#9b9999] cursor-pointer" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="md:w-[45px] text-right text-xs opacity-50">
                      TOKEN:{" "}
                    </span>
                    <div
                      className="flex justify-between items-center gap-0.5"
                      onClick={(event) =>
                        copyAddress(
                          e?.Trade?.Currency?.MintAddress,
                          `${ind}-tokenAddress`,
                          event
                        )
                      }
                    >
                      <span className="font-mono ml-1">
                        {e?.Trade?.Currency?.MintAddress
                          ? `${e?.Trade?.Currency?.MintAddress?.slice(
                              0,
                              4
                            )}....${e?.Trade?.Currency?.MintAddress?.slice(-4)}`
                          : `....`}
                      </span>
                      <span>
                        {copied[`${ind}-tokenAddress`] ? (
                          <IoMdDoneAll className="text-[#48BB78] cursor-pointer" />
                        ) : (
                          <BiSolidCopy className="text-[#9b9999] cursor-pointer" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })
      )}
    </>
  );
};

export default SearchResultData;
