/* eslint-disable @next/next/no-img-element */
"use client";
import { Lightning, Swaps } from "@/app/Images";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { IoMdDoneAll } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import { humanReadableFormat, UpdateTime } from "@/utils/calculation";
import { buySolanaTokensQuickBuyHandler } from "@/utils/solanaBuySell/solanaBuySell";
import LoaderPopup from "../LoaderPopup/LoaderPopup";
import {
  fetchSolanaNativeBalance,
  setChartSymbolImage,
} from "@/app/redux/states";
import { PiCopyLight } from "react-icons/pi";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import Link from "next/link";

const TableBody = ({ data, img }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const nativeTokenbalance = useSelector(
    (state) => state?.AllStatesData?.solNativeBalance
  );
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
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
  const SkeletonInnerData = Array(8).fill(null);
  async function navigateToChartScreen(row) {
    await localStorage.setItem("chartTokenImg", row?.img);
    await dispatch(setChartSymbolImage(row?.img));
    router.push(
      `/tradingview/${getNetwork}?tokenaddress=${row?.address}&symbol=${row?.name}`
    );
    localStorage.setItem("silectChainName", getNetwork);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);
  useEffect(() => {
    if (solWalletAddress) {
      dispatch(fetchSolanaNativeBalance(solWalletAddress));
    }
  }, [solWalletAddress]);
  return (
    <>
      {data.length == 0 ? (
        SkeletonData.map((_, ind) => (
          <tbody key={ind} className="text-center">
            <tr className={` ${ind % 2 === 0 && "bg-[#16171ca4]"} w-full`}>
              {SkeletonInnerData.map((_, ind) => (
                <td key={ind} className="whitespace-nowrap px-2 py-4">
                  <div className="w-full h-[32px] rounded bg-[#191919] animate-pulse"></div>
                </td>
              ))}
            </tr>
          </tbody>
        ))
      ) : (
        <>
          {data.map((row, ind) => {
            return (
              <tbody key={ind} className="text-start">
                <tr
                  className={`border-b border-b-[#1A1A1A] hover:bg-[#1A1A1A] cursor-pointer`}
                  onClick={() => navigateToChartScreen(row)}
                >
                  {/* Column 1: Icon and Pair Info */}
                  <td className="whitespace-nowrap W-60 md:px-6 px-3 py-3">
                    <div className="flex items-center gap-3 !text-left">
                      {row?.img ? (
                        <img
                          src={row?.img}
                          alt="Token"
                          className="w-8 md:w-10 h-8 md:h-10 xl:w-12 xl:h-12 rounded-[4px] border border-[#1F73FC]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 md:w-10 h-8 md:h-10 xl:w-12 xl:h-12 rounded-sm flex items-center justify-center bg-[#3b3b49] border border-[#1F73FC]">
                          <span className="text-sm text-white uppercase text-center">
                            {row?.name?.toString()?.slice(0, 1)}
                          </span>
                        </div>
                      )}
                      <div className="">
                        <div className="flex items-center justify-center gap-[10px]">
                          <p>
                            <span className="text-white font-bold text-sm">
                              {/* {row.Trade.Currency.Symbol?.length >= 12
                              ? `${row.Trade.Currency.Symbol.slice(0, 12)}...`
                              : row.Trade.Currency.Symbol} */}
                              {row.name}
                              &nbsp;
                            </span>
                            <span className="font-thin text-[16px] text-[#6E6E6E]">
                              /
                            </span>
                            <span className="text-sm text-[#6E6E6E]">SOL</span>
                          </p>
                          <Link
                            href={`https://www.pump.news/en/${row.address}-solana`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="text-[10px] h-[17px] w-[17px] border border-[#626266] text-[#626266] rounded-md flex items-center justify-center cursor-pointer">
                              AI
                            </div>
                          </Link>
                        </div>
                        <div
                          onClick={(e) => copyAddress(row.address, ind, e)}
                          className="flex gap-2 items-center mt-1"
                        >
                          {/* <span className="font-thin text-white">44s</span> */}
                          <span className="text-[#6E6E6E]">
                            {" "}
                            {row.address?.slice(0, 5)}...
                            {row.address?.slice(-3)}{" "}
                          </span>
                          <span
                            onClick={(e) => copyAddress(row.address, ind, e)}
                          >
                            {copied === ind ? (
                              <IoMdDoneAll
                                size={17}
                                className="text-[#3f756d] cursor-pointer"
                              />
                            ) : (
                              <PiCopyLight className="text-[#6E6E6E] cursor-pointer" />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Time */}
                  <td className="whitespace-nowrap py-3 W-32 text-[15px] md:px-6 px-3">
                    {" "}
                    {/* {formatTime(timeDiffs[ind])} */}
                    {UpdateTime(row?.date, currentTime)}
                  </td>

                  {/* Column 3: Liquidity */}
                  <td className="whitespace-nowrap W-32 py-3 md:px-6 px-3">
                    <div className="grid">
                      <div className="flex  gap-1.5">
                        <Image
                          src={img}
                          alt="newPairsIcon"
                          className="my-auto  w-5 h-5"
                        />
                        <p>
                          {/* <span className="text-[16px]">{row.Trade.Currency.Symbol}</span> */}
                          {row.liquidity}
                          <span className="text-[#6E6E6E] text-[15px]">
                            {" "}
                            / $46k
                          </span>
                        </p>
                      </div>
                      <p
                        className={`text-[15px] mt-2 ${
                          data.length > 0 &&
                          typeof row?.Percentage === "string" &&
                          row?.Percentage.includes("-")
                            ? "text-[#ED1B24]"
                            : "text-[#21CB6B]"
                        }`}
                      >
                        {row?.Percentage}
                      </p>
                    </div>
                  </td>

                  {/* Column 4: Initial Liquidity */}
                  {/* <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex  items-center gap-1.5">
                    <Image
                      src={bitcoinIcon}
                      alt="newPairsIcon"
                      className="my-auto  w-5 h-5"
                    />
                    <p>
                      <span className="text-[16px]">17,43&nbsp;</span>
                      <span className="font-thin text-[16px] text-[#9b9999]">
                        /&nbsp;
                      </span>
                      <span className="text-[15px] text-[#666873] ">$46k</span>
                    </p>
                  </div>
                </td> */}

                  {/* Column 5: Market Cap and Price */}
                  <td className="whitespace-nowrap W-32 py-3 md:px-6 px-3">
                    <div className="grid">
                      <p className="text-[16px] font-bold">
                        <span>{humanReadableFormat(row?.marketCap)}</span>
                      </p>
                      <p className="mt-1">
                        <span className="text-[14px] font-thin text-[#666873]">
                          {row.current_price.toFixed}
                        </span>
                      </p>
                    </div>
                  </td>

                  {/* Column 6: Swaps */}
                  <td className="whitespace-nowrap W-32 py-3 md:px-6 px-3">
                    <div className="grid">
                      <div className="flex  gap-1.5">
                        <Image
                          src={Swaps}
                          alt="newPairsIcon"
                          className="my-auto"
                        />
                        <div>
                          <p className="mt-0.5 text-[16px]">{row?.trades}</p>
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
                      </div>
                    </div>
                  </td>

                  {/* Column 7: Volume */}
                  <td className="whitespace-nowrap W-32 text-[16px] py-3 md:px-6 px-3">
                    {humanReadableFormat(row?.traded_volume)}
                  </td>

                  {/* Column 8: Holders */}
                  {/* <td className="whitespace-nowrap px-6 py-4 text-[16px]">
                    {data[ind]?.tradesCountWithUniqueTraders}
                  </td> */}
                  <td className="whitespace-nowrap W-60 py-3 flex justify-center">
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
                              !row.mint_authority
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

                      <Tooltip body={"Shows if token has 10 holders."}>
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

                  {/* Column 10: Quick Buy Button */}
                  <td className="whitespace-nowrap W-32 py-3 place-items-center">
                    <button
                      className="text-[#1F73FC] rounded-[4px] py-3 px-[30px] hover:bg-[#11265B] transition-all duration-300 ease-in-out flex items-center gap-2"
                      onClick={(e) =>
                        buySolanaTokensQuickBuyHandler(
                          row?.address,
                          quickBuy,
                          solWalletAddress,
                          nativeTokenbalance,
                          e,
                          row?.address,
                          dispatch
                        )
                      }
                    >
                      <span>
                        <Image src={Lightning} alt="" />
                      </span>
                      <span>
                        {quickBuy
                          ? `${
                              quickBuy.length > 6
                                ? `${quickBuy.slice(0, 7)}...`
                                : quickBuy
                            }`
                          : 0}
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </>
      )}
      {bigLoader == true && <LoaderPopup />}
    </>
  );
};

export default TableBody;
