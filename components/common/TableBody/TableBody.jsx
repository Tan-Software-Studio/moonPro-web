/* eslint-disable @next/next/no-img-element */
"use client";
import { Lightning } from "@/app/Images";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { IoMdDoneAll } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline, IoSearchSharp } from "react-icons/io5";
import {
  humanReadableFormat,
  UpdateTime,
  UpdateTimeViaUTCWithCustomTime,
} from "@/utils/calculation";
import { buySolanaTokensQuickBuyHandler } from "@/utils/solanaBuySell/solanaBuySell";
import LoaderPopup from "../LoaderPopup/LoaderPopup";
import { PiCopyThin } from "react-icons/pi";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import Link from "next/link";
import { MdOutlineLanguage } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import NoData from "../NoData/noData";
import TrendingImage from "./TrendingImage";
import { setActiveChartToken } from "@/app/redux/chartDataSlice/chartData.slice";
import { toNumber } from "@/utils/basicFunctions";

const TableBody = ({ isLoading, data, img, isTimeCreated, BASE_URL }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const activeSolWalletAddress = useSelector(
    (state) => state?.userData?.activeSolanaWallet
  );
  // solana live price
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );
  const router = useRouter();

  const getNetwork = pathname.split("/")[2];

  const bigLoader = useSelector((state) => state?.AllStatesData?.bigLoader);

  const quickBuy = useSelector((state) => state?.AllStatesData?.globalBuyAmt);

  const copyAddress = (address, index, e) => {
    e.stopPropagation();
    navigator?.clipboard?.writeText(address);
    setCopied(index);
    // toast.success("address copied successfully");
    setTimeout(() => {
      setCopied(null);
    }, 3000); // Reset after 3 seconds
  };

  const SkeletonData = Array(20).fill(null);
  // const SkeletonInnerData =
  //   chainName !== "Solana" ? Array(9).fill(null) : Array(8).fill(null);
  const SkeletonInnerData = Array(isTimeCreated ? 8 : 7).fill(null);
  async function navigateToChartScreen(row) {
    dispatch(setActiveChartToken({ symbol: row?.symbol, img: row?.img }));
    router.push(`/meme/${row?.address}`);
    localStorage.setItem("silectChainName", getNetwork);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {isLoading ? (
        <tbody className="text-center">
          {SkeletonData.map((_, ind) => (
            <tr
              key={ind}
              className={` ${ind % 2 === 0 && "bg-[#16171ca4]"} w-full`}
            >
              {SkeletonInnerData.map((_, ind) => (
                <td key={ind} className="whitespace-nowrap px-2 py-4">
                  <div className="w-full h-[32px] rounded bg-[#191919] animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      ) : data?.length > 0 ? (
        <>
          {data?.map((row, ind) => {
            const { time, isRecent } = UpdateTimeViaUTCWithCustomTime(
              row?.dbCreatedAt,
              currentTime
            );
            return (
              <tbody key={ind} className="text-start geist">
                <tr
                  className={`group border-b border-b-[#1A1A1A] hover:bg-[#1A1A1A] cursor-pointer`}
                  onClick={() => navigateToChartScreen(row)}
                >
                  {/* Column 1: Icon and Pair Info */}
                  <td className="whitespace-nowrap w-60 md:px-6 px-3 py-2 ">
                    <div className="flex items-center gap-3 !text-left">
                      <TrendingImage
                        key={`${row?.address}-${ind}`}
                        name={row?.name}
                        address={row?.address}
                        url={BASE_URL}
                      />
                      <div className="">
                        <div className="flex items-center justify-center gap-[10px]">
                          <div className="flex flex-col gap-2">
                            {/* token name and copy address */}
                            <div className="flex items-center gap-1">
                              <div
                                className={`text-[#F6F6F6] text-[15px] font-[400] md:text-[15px] md:font-[500] uppercase`}
                              >
                                {row?.symbol?.length >= 12
                                  ? `${row?.symbol.slice(0, 12)}...`
                                  : row?.symbol || "Token"}
                              </div>

                              <div
                                className={`text-[#6E6E6E] text-[15px] font-[400] lowercase`}
                              >
                                {row?.name?.length >= 12
                                  ? `${row?.name.slice(0, 12)}...`
                                  : row?.name || "Trending token"}
                              </div>
                              <div
                                onClick={(e) =>
                                  copyAddress(row?.address, ind, e)
                                }
                                className="text-sm "
                              >
                                {copied === ind ? (
                                  <IoMdDoneAll className="text-[#F6F6F6] cursor-pointer" />
                                ) : (
                                  <PiCopyThin className="text-[#F6F6F6] cursor-pointer" />
                                )}
                              </div>

                              {isTimeCreated && isRecent && (
                                <div className="bg-[#1d73fc] text-white text-xs font-normal px-1 py-0.5 rounded-md">
                                  New
                                </div>
                              )}
                            </div>
                            {/* time, social links and ai */}

                            <div className={`flex items-center gap-[8px]`}>
                              <div
                                className={`text-[#4CAF50] text-[15px] font-medium`}
                              >
                                {UpdateTime(row?.date, currentTime)}
                              </div>

                              <div className="flex gap-2">
                                {row?.offchainData?.extensions?.telegram && (
                                  <Link
                                    href={
                                      row?.offchainData?.extensions?.telegram
                                    }
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FaTelegramPlane
                                      size={16}
                                      className="text-[#6E6E6E] hover:text-[#ffffff]"
                                    />
                                  </Link>
                                )}

                                {(row?.offchainData?.extensions?.twitter ||
                                  row?.offchainData?.twitter) && (
                                  <Link
                                    href={
                                      row?.offchainData?.extensions?.twitter ||
                                      row?.offchainData?.twitter
                                    }
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FaXTwitter
                                      size={16}
                                      className="text-[#6E6E6E] hover:text-[#ffffff]"
                                    />
                                  </Link>
                                )}

                                {row?.offchainData?.extensions?.website && (
                                  <Link
                                    href={
                                      row?.offchainData?.extensions?.website
                                    }
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MdOutlineLanguage
                                      size={16}
                                      className="text-[#6E6E6E] hover:text-[#ffffff]"
                                    />
                                  </Link>
                                )}
                              </div>

                              <Link
                                href={`https://www.pump.news/en/${row.address}-solana`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="text-[10px] h-[17px] w-[17px] border border-[#4CAF50] text-[#ffffff] rounded-md flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#409143] to-[#093d0c] shadow-[0_0_4px_rgba(76,255,80,0.4)]">
                                  AI
                                </div>
                              </Link>
                              <Link
                                href={`https://x.com/search?q=${row.address}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IoSearchSharp color="#BBBBBC" size={19} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {isTimeCreated && (
                    <td className="whitespace-nowrap w-32 py-2 md:px-6 px-3 text-[#4CAF50] text-[15px] font-medium">
                      {time}
                    </td>
                  )}

                  {/* Column 2: Market Cap and Price */}
                  <td className="whitespace-nowrap w-32 py-2 md:px-6 px-3">
                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="text-[15px] font-medium">
                          <span>{humanReadableFormat(row?.marketCap)}</span>
                        </p>
                      </div>
                      <p
                        className={`text-[12px] font-medium ${
                          row?.Percentage < 0
                            ? "text-[#ED1B24]"
                            : "text-[#21CB6B]"
                        }`}
                      >
                        {`${row?.Percentage > 0 ? "+" : ""}${Number(
                          row?.Percentage || 0
                        ).toFixed(2)}`}
                        {"%"}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Liquidity */}
                  <td className="whitespace-nowrap w-32 py-2 md:px-6 px-3">
                    <span className="text-white text-[15px] font-medium">
                      {humanReadableFormat(row?.liquidity || 0)}
                    </span>
                  </td>

                  {/* Column 4: Volume */}
                  <td className="whitespace-nowrap w-32 text-[15px] py-2 md:px-6 px-3">
                    {humanReadableFormat(row?.traded_volume)}
                  </td>

                  {/* Column 5: Swaps */}
                  <td className="whitespace-nowrap w-32 py-2 md:px-6 px-3">
                    <p className="mt-0.5 text-[15px] font-medium">
                      {row?.buys + row?.sells}
                    </p>

                    <div className="flex  gap-1.5">
                      <p className="mt-0.5">
                        <span className="text-[#21CB6B]">
                          {row?.buys ? row?.buys : 0}
                        </span>
                        <span className="text-[#828282]"> / </span>
                        <span className="text-[#ED1B24]">
                          {row?.sells ? row?.sells : 0}
                        </span>
                      </p>
                    </div>
                  </td>

                  {/* Column 8: Holders */}
                  {/* <td className="whitespace-nowrap px-6 py-4 text-[16px]">
                    {data[ind]?.tradesCountWithUniqueTraders}
                  </td> */}
                  <td className="whitespace-nowrap w-60 py-3 flex justify-center z-0">
                    <div
                      className={`flex  gap-2 ${
                        !row.mint_authority ? "text-white" : "text-[#828282]"
                      }`}
                    >
                      <Tooltip
                        body={
                          "The token can’t be minted anymore — no one can create new tokens."
                        }
                      >
                        <div className="grid  text-start">
                          <div className="flex flex-col text-start opacity-75">
                            {!row.mint_authority ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#21CB6B]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#ED1B24]"
                              />
                            )}
                            <div className="mt-1">
                              <div>Mint Auth</div>
                              <div>Disabled</div>
                            </div>
                          </div>
                        </div>
                      </Tooltip>

                      <Tooltip body={"No one can freeze token transfers."}>
                        <div className="grid  text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              !row.freeze_authority
                                ? "text-white"
                                : "text-[#828282]"
                            }`}
                          >
                            {!row.freeze_authority ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#21CB6B]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#ED1B24]"
                              />
                            )}
                            <div className="mt-1">
                              <div>Freeze Auth</div>
                              <div>Disabled</div>
                            </div>
                          </div>
                        </div>
                      </Tooltip>

                      <Tooltip
                        body={
                          "Liquidity Pool tokens were burned — this helps lock the liquidity in place."
                        }
                      >
                        <div className="grid  text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              true ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {true ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#21CB6B]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#ED1B24]"
                              />
                            )}
                            <div className="mt-1">
                              <div>LP</div>
                              <div>Burned</div>
                            </div>
                          </div>
                        </div>
                      </Tooltip>

                      <Tooltip
                        body={
                          "% owned by top 10 holders. Green check if top 10 holders hold less than 15%"
                        }
                      >
                        <div className="grid  text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              row?.top10Holder ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {row?.top10Holder ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#21CB6B]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#ED1B24]"
                              />
                            )}
                            <div className="mt-1">
                              <div>Top 10</div>
                              <div>Holders</div>
                            </div>
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  </td>

                  {/* Column 6: Quick Buy Button */}
                  <td className="whitespace-nowrap w-32 py-2 place-items-center">
                    <button
                      className={`text-[#111111] font-bold rounded-[20px] py-2 ${
                        quickBuy > 0 ? "px-2" : "px-3"
                      } bg-[#1d73fc] hover:bg-[#438bff] transition-all duration-300 ease-in-out flex items-center justify-center`}
                      onClick={(e) =>
                        buySolanaTokensQuickBuyHandler(
                          solanaLivePrice,
                          row?.address,
                          quickBuy,
                          activeSolWalletAddress?.wallet || solWalletAddress,
                          activeSolWalletAddress?.balance || 0,
                          e,
                          row?.programAddress
                            ? row?.programAddress
                            : "uiendiahasygasds",
                          dispatch,
                          row?.current_price,
                          {
                            name: row?.name,
                            symbol: row?.symbol,
                            img: row?.img || null,
                          },
                          toNumber(row?.liquidity || 0)
                        )
                      }
                    >
                      <span>
                        <Image src={Lightning} alt="" />
                      </span>
                      <span>
                        {quickBuy > 0
                          ? `${
                              quickBuy.length > 6
                                ? `Buy ${quickBuy.slice(0, 7)}... SOL`
                                : `Buy ${quickBuy} SOL`
                            }`
                          : `Buy`}
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </>
      ) : (
        <tbody>
          <tr>
            <td colSpan={isTimeCreated ? 8 : 7}>
              <div className="flex flex-col  h-[70vh] w-full items-center justify-center mt-5">
                <NoData />
              </div>
            </td>
          </tr>
        </tbody>
      )}
      {bigLoader == true && <LoaderPopup />}
    </>
  );
};

export default TableBody;
