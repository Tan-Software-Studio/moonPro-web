//final code but go to infinite

"use client";
import { Swaps } from "@/app/Images";
import Image from "next/image";
import React, { useState } from "react";
// import toast from "react-hot-toast";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";

const TrendingEvm = ({ data, img }) => {
  const router = useRouter();

  const pathname = usePathname();

  const [copied, setCopied] = useState(false);
  const getNetwork = pathname.split("/")[2];

  const quickBuy = useSelector((state) => state?.AllthemeColorData?.quickBuy);

  const copyAddress = (address, index, e) => {
    e.stopPropagation();
    navigator?.clipboard?.writeText(address);
    setCopied(index);
    // toast.success("address copied successfully");
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };
  const SkeletonData = Array(20).fill(null);

  const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.abs(now - past) / 1000; // Difference in seconds

    const seconds = Math.floor(diff % 60); // Remaining seconds
    const minutes = Math.floor((diff / 60) % 60); // Remaining minutes
    const hours = Math.floor((diff / 3600) % 24); // Remaining hours
    const days = Math.floor(diff / 86400); // Days

    // Build a readable time string
    let timeString = "";
    if (days > 0) timeString += `${days}d `;
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    timeString += `${seconds}s`;

    return timeString.trim(); // Trim any extra spaces
  };

  const selectToken = useSelector(
    (state) => state?.AllthemeColorData?.selectToken
  );

  function humanReadableFormat(input) {
    let number = Number(input); // Convert input to a number
    if (isNaN(number)) return "N/A"; // Handle invalid numbers

    const units = ["", "K", "M", "B", "T"];
    let unitIndex = 0;

    while (Math.abs(number) >= 1000 && unitIndex < units.length - 1) {
      number /= 1000;
      unitIndex++;
    }

    return `$${number.toFixed(2)}${units[unitIndex]}`;
  }
  const SkeletonInnerData =
    selectToken === "Solana" ? Array(8).fill(null) : Array(9).fill(null);

  return (
    <>
      {data.length == 0 ? (
        SkeletonData.map((_, ind) => (
          <tbody key={ind} className="text-center">
            <tr className={` ${ind % 2 === 0 && "bg-[#16171c]"} w-full`}>
              {SkeletonInnerData.map((_, ind) => (
                <td key={ind} className="whitespace-nowrap px-2 py-4">
                  <div className="w-full h-[32px] rounded bg-gray-700 animate-pulse"></div>
                </td>
              ))}
            </tr>
          </tbody>
        ))
      ) : (
        <>
          {data.map((row, ind) => {
            return (
              <tbody key={ind} className="text-center ">
                <tr
                  className={` hover:bg-[#24262e] ${
                    ind % 2 === 0 && "bg-[#16171c]"
                  } cursor-pointer`}
                  onClick={() => {
                    router.push(
                      `/tradingview/solana?tokenaddress=${row?.Trade?.Side?.Currency?.SmartContract}&symbol=${row.Trade.Side.Currency.Symbol}`
                    );
                  }}
                >
                  {/* Column 1: Symbol and PairInfo */}
                  <td className="whitespace-nowrap px-6 py-4 w-40">
                    <div className="flex items-center gap-3 !text-left">
                      {/* <img
                        src={tokenImage}
                        alt="Token"
                        className="w-8 md:w-10 h-8 md:h-10 xl:w-12 xl:h-12 rounded-full"
                        loading="lazy" // Lazy load images
                      /> */}
                      <div>
                        <p>
                          <span className="text-white font-bold text-[16px]">
                            {row.Trade.Side.Currency.Symbol?.length >= 12
                              ? `${row.Trade.Side.Currency.Symbol.slice(
                                  0,
                                  12
                                )}...`
                              : row.Trade.Side.Currency.Symbol}
                            &nbsp;
                          </span>
                          <span className="font-thin text-[16px] text-[#9b9999]">
                            /
                          </span>
                          <span className="text-[15px] text-[#9b9999]">
                            {" "}
                            WETH{" "}
                          </span>
                        </p>
                        <div 
                         onClick={(e) =>
                          copyAddress(
                            row?.Trade?.Side?.Currency?.SmartContract,
                            ind,
                            e
                          )
                        }
                        className="flex gap-2 items-center mt-1">
                          <span className="text-[#9b9999]">
                            {row?.Trade?.Side?.Currency?.SmartContract ? (
                              <>
                                {row?.Trade?.Side?.Currency?.SmartContract.slice(
                                  0,
                                  5
                                )}
                                ...
                                {row?.Trade?.Side?.Currency?.SmartContract.slice(
                                  -3
                                )}
                              </>
                            ) : (
                              <>
                                {row.Trade.Currency.MintAddress?.slice(0, 3)}...
                                {row.Trade.Currency.MintAddress?.slice(-3)}
                              </>
                            )}
                          </span>
                          <span
                            onClick={(e) =>
                              copyAddress(
                                row?.Trade?.Side?.Currency?.SmartContract,
                                ind,
                                e
                              )
                            }
                          >
                            {copied === ind ? (
                              <IoMdDoneAll size={17} className="text-[#3f756d] cursor-pointer" />
                            ) : (
                              <BiSolidCopy className="text-[#9b9999] cursor-pointer" />
                            )}
                          </span>{" "}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Time */}
                  <td className="whitespace-nowrap px-6 py-4 text-[15px] text-center">
                    {timeAgo(row?.Block?.Time)}
                  </td>

                  {/* Column 3: Liquidity */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="grid  text-center">
                      <div className="flex justify-center gap-1.5">
                        <Image
                          src={img}
                          alt="newPairsIcon"
                          className="my-auto  w-5 h-5"
                        />
                        <p>
                          <span className="text-[16px]">17,439</span>
                          <span className="text-[#666873] text-[15px]">
                            {" "}
                            / $46k
                          </span>
                        </p>
                      </div>
                      <p className="text-[#3E9FD6] text-[15px] mt-2">+28.3%</p>
                    </div>
                  </td>

                  {/* Column 5: Market Cap and Price */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="grid  text-center">
                      <p className="text-[16px] font-bold">
                        <span>$399.000</span>
                      </p>
                      <p className="mt-3">
                        <span className="text-[14px] font-thin text-[#666873]">
                          $0.0075
                        </span>
                      </p>
                    </div>
                  </td>

                  {/* Column 6: Swaps */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="grid  text-center">
                      <div className="flex justify-center gap-1.5">
                        <Image
                          src={Swaps}
                          alt="newPairsIcon"
                          className="my-auto"
                        />
                        <div>
                          <p className="mt-0.5 text-[16px]">
                            {Number(row?.buyers) + Number(row?.sellers)}{" "}
                          </p>
                          <p className="mt-0.5">
                            <span className="text-[#3E9FD6]">
                              {row?.buyers}
                            </span>
                            <span className="text-[#828282]"> / </span>
                            <span className="text-[#F0488B]">
                              {row?.sellers}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 7: Volume */}
                  <td className="whitespace-nowrap px-6 py-4 text-[16px] text-center">
                    {row.buy_volume
                      ? humanReadableFormat(row?.traded_volume)
                      : "N/A"}
                  </td>

                  {/* Column 8: Holders */}
                  <td className="whitespace-nowrap px-6 py-4 text-[16px] text-center">
                    {/* {row?.buys ? humanReadableFormat(row?.buys) : "N/A"} */}
                    {row?.buys}
                  </td>

                  {/* Column 9: Audit Results */}

                  {selectToken === "Base" ? (
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex justify-center gap-2 ">
                        <div className="grid  text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              true ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {true ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#3aeeeb]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#9c4949]"
                              />
                            )}
                            <div className="mt-1 text-white">
                              <div className="capitalize">contract</div>
                              <div className="capitalize">Verified</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid  text-start text-[#74757c]">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              false ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {false ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#3aeeeb]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#9c4949]"
                              />
                            )}
                            <div className="mt-1">
                              <div className="capitalize">contract</div>
                              <div className="capitalize">Renounced</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid text-start text-[#74757c]">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              true ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {true ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#3aeeeb]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#9c4949]"
                              />
                            )}
                            <div className="mt-1">
                              <div className="capitalize">Locked</div>
                              <div className="capitalize">Liquidity</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex justify-center gap-2 text-[#828282]">
                        <div className="grid  text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              false ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {false ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#3aeeeb]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#9c4949]"
                              />
                            )}
                            <div className="mt-1">
                              <div>Contract</div>
                              <div>Verified</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid  text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              true ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {true ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#3aeeeb]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#9c4949]"
                              />
                            )}
                            <div className="mt-1">
                              <div>Contract</div>
                              <div>Renounced</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              false ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {false ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#3aeeeb]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#9c4949]"
                              />
                            )}
                            <div className="mt-1">
                              <div>Locked</div>
                              <div>Liquidity</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid  text-start">
                          <div
                            className={`flex flex-col text-start opacity-75 ${
                              true ? "text-white" : "text-[#828282]"
                            }`}
                          >
                            {true ? (
                              <CiCircleCheck
                                size={20}
                                className="text-[#3aeeeb]"
                              />
                            ) : (
                              <IoCloseCircleOutline
                                size={20}
                                className="text-[#9c4949]"
                              />
                            )}
                            <div className="mt-1">
                              <div>Not Honey</div>
                              <div>Pot</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Column 10: Quick Buy Button */}
                  <td className="whitespace-nowrap w-44 px-6 py-4">
                    <button className="border border-[#3E9FD6] rounded-lg py-1 px-[30px] bg-[#16171D]">
                      {(() => {
                        const quickBuyStr = String(quickBuy).trim();

                        if (!quickBuyStr || quickBuyStr === "0") return `$0`;

                        // Handle decimal numbers separately
                        if (quickBuyStr.includes(".")) {
                          const [integerPart, decimalPart] =
                            quickBuyStr.split(".");
                          const formattedDecimal = decimalPart.slice(0, 4);

                          // Show ellipsis only if total length (integer + '.' + decimals) exceeds 5
                          const fullDecimalDisplay = `${integerPart}.${formattedDecimal}`;
                          return fullDecimalDisplay.length > 5
                            ? `$${fullDecimalDisplay}...`
                            : `$${fullDecimalDisplay}`;
                        }

                        // Handle whole numbers
                        return quickBuyStr.length > 4
                          ? `$${quickBuyStr.slice(0, 4)}...`
                          : `$${quickBuyStr}`;
                      })()}
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </>
      )}
    </>
  );
};

export default TrendingEvm;
