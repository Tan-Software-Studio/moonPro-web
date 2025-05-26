"use client";
import { ethereum, Swaps, tableIcon } from "@/app/Images";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
// import toast from "react-hot-toast";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import { useSelector } from "react-redux";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";

const NewPaitTBody = ({ data, loading }) => {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const copyAddress = (address, index, e) => {
    e.stopPropagation();
    navigator?.clipboard?.writeText(address);
    setCopied(index);
    // toast.success("address copied successfully");
    setTimeout(() => {
      setCopied(null); 
    }, 3000);
  };

  const quickBuy = useSelector((state) => state?.AllthemeColorData?.quickBuy);

  function formatNumber(number) {
    if (number >= 1e9) {
      return (number / 1e9).toFixed(1) + "B"; // Billion
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(1) + "M"; // Million
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(1) + "K"; // Thousand
    } else {
      return number; // If less than 1000
    }
  }
  const chainName = useSelector(
    (state) => state.AllthemeColorData?.selectToken
  );
  const SkeletonData = Array(20).fill(null);
  const SkeletonInnerData =
    chainName !== "Solana" ? Array(9).fill(null) : Array(8).fill(null);

  return (
    <>
      {loading ? (
        <>
          {SkeletonData.map((_, ind) => (
            <tbody key={ind} className="text-center">
              <tr className={` ${ind % 2 === 0 && "bg-[#16171c]"} w-full`}>
                {SkeletonInnerData.map((_, ind) => (
                  <td key={ind} className="whitespace-nowrap px-2 py-4">
                    <div className="w-full h-[32px] rounded bg-gray-700 animate-pulse"></div>
                  </td>
                ))}
              </tr>
            </tbody>
          ))}
        </>
      ) : (
        <>
          {data.map((row, ind) => (
            <tbody key={ind} className="text-center ">
              <tr
                className={` hover:bg-[#24262e] ${
                  ind % 2 === 0 && "bg-[#16171c]"
                } cursor-pointer`}
                onClick={() => {
                  router.push(
                    `/tradingview/solana?tokenaddress=${
                      row.Trade?.Currency?.MintAddress
                        ? row.Trade?.Currency?.MintAddress
                        : row.Trade?.Currency?.SmartContract
                    }&symbol=${row?.Trade?.Currency?.Symbol}`
                  );
                }}
              >
                {/* Column 1: Icon and Pair Info */}
                <td className="whitespace-nowrap px-6 py-4 w-40">
                  <div className="flex  gap-3 !text-left">
                    <Image
                      src={tableIcon}
                      alt="newPairsIcon"
                      className="w-8 md:w-9 h-8 md:h-9 xl:w-10 xl:h-10 rounded-full"
                      width={50}
                      height={50}
                    />
                    <div>
                      <p>
                        <span className="text-white font-bold text-[16px]">
                          {row?.Trade?.Currency?.Symbol.length >= 12
                            ? `${row?.Trade?.Currency?.Symbol.slice(0, 12)}...`
                            : row?.Trade?.Currency?.Symbol}
                          &nbsp;
                        </span>
                        <span className="font-thin text-[16px] text-[#9b9999]">
                          /
                        </span>
                        <span className="text-[15px] text-[#9b9999]">
                          {" "}
                          {row?.Trade?.Side?.Currency?.Symbol.length >= 12
                            ? `${row?.Trade?.Side?.Currency?.Symbol.slice(
                                0,
                                12
                              )}...`
                            : row?.Trade?.Side?.Currency?.Symbol}
                          &nbsp;
                        </span>
                      </p>
                      {/* Pair Info */}
                      <div className="flex gap-2 items-center mt-1">
                        <span className="font-thin text-white">44s</span>
                        {row.Trade?.Currency?.MintAddress ? (
                          <>
                            <span
                             onClick={(e) =>
                              copyAddress(
                                row.Trade?.Currency?.MintAddress
                                  ? row.Trade?.Currency?.MintAddress
                                  : row.Trade?.Currency?.SmartContract,
                                ind,
                                e
                              )
                            }
                            className="text-[#9b9999]">
                              {" "}
                              {row.Trade?.Currency?.MintAddress?.slice(0, 5)}...
                              {row.Trade?.Currency?.MintAddress?.slice(-3)}{" "}
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                             onClick={(e) =>
                              copyAddress(
                                row.Trade?.Currency?.MintAddress
                                  ? row.Trade?.Currency?.MintAddress
                                  : row.Trade?.Currency?.SmartContract,
                                ind,
                                e
                              )
                            }
                            className="text-[#9b9999]">
                              {" "}
                              {row.Trade?.Currency?.SmartContract?.slice(0, 5)}
                              ...
                              {row.Trade?.Currency?.SmartContract?.slice(
                                -3
                              )}{" "}
                            </span>
                          </>
                        )}
                        <span
                          onClick={(e) =>
                            copyAddress(
                              row.Trade?.Currency?.MintAddress
                                ? row.Trade?.Currency?.MintAddress
                                : row.Trade?.Currency?.SmartContract,
                              ind,
                              e
                            )
                          }
                        >
                          {copied === ind ? (
                            <IoMdDoneAll size={17} className="text-[#3f756d] cursor-pointer" />
                          ) : (
                            <BiSolidCopy className="text-[#6B6B6D] cursor-pointer" />
                          )}
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 2: Time */}
                <td className="whitespace-nowrap px-6 py-4 text-[15px] text-center">44s</td>

                {/* Column 3: Liquidity */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid  text-center">
                    <div className="flex justify-center gap-1.5">
                      <Image
                        src={ethereum}
                        alt="ethereumIcon"
                        className="my-auto w-5 h-5"
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
                  <div className="grid text-center">
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
                        <p className="mt-0.5 text-[16px]">3</p>
                        <p className="mt-0.5">
                          <span className="text-[#3E9FD6]">2</span>
                          <span className="text-[#828282]"> / </span>
                          <span className="text-[#F0488B]">1</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 7: Volume */}
                <td className="whitespace-nowrap px-6 py-4 text-[16px] text-center">
                  ${formatNumber(row?.usd)}
                </td>

                {/* Column 8: Holders */}
                <td className="whitespace-nowrap px-6 py-4 text-[16px] text-center">
                  {row?.traders ? row?.traders : row.buyers}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-center  gap-2 text-[#828282]">
                    <div className="grid text-start">
                      <div
                        className={`flex flex-col text-start opacity-75 ${
                          false ? "text-white" : "text-[#828282]"
                        }`}
                      >
                        {false ? (
                          <CiCircleCheck size={20} className="text-[#3aeeeb]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={20}
                            className="text-[#7a3e3e]"
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
                          <CiCircleCheck size={20} className="text-[#3aeeeb]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={20}
                            className="text-[#7a3e3e]"
                          />
                        )}
                        <div className="mt-1">
                          <div>Contract</div>
                          <div>Renounced</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid  text-start">
                      <div
                        className={`flex flex-col text-start opacity-75 ${
                          false ? "text-white" : "text-[#828282]"
                        }`}
                      >
                        {false ? (
                          <CiCircleCheck size={20} className="text-[#3aeeeb]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={20}
                            className="text-[#7a3e3e]"
                          />
                        )}
                        <div className="mt-1">
                          <div>Locked</div>
                          <div>Liquidity</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid text-start">
                      <div
                        className={`flex flex-col text-start opacity-75 ${
                          true ? "text-white" : "text-[#828282]"
                        }`}
                      >
                        {true ? (
                          <CiCircleCheck size={20} className="text-[#3aeeeb]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={20}
                            className="text-[#7a3e3e]"
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

                {/* Column 10: Quick Buy Button */}
                <td className="whitespace-nowrap  w-44 px-6  py-4">
                  <button className="border border-[#3E9FD6] rounded-lg py-1.5 px-7 bg-[#16171D]">
                    {(() => {
                      const quickBuyStr = String(quickBuy).trim(); // Convert to string

                      if (!quickBuyStr || quickBuyStr === "0") return `$0`; // Handle empty or zero

                      // Handle decimal numbers separately
                      if (quickBuyStr.includes(".")) {
                        const [integerPart, decimalPart] =
                          quickBuyStr.split(".");
                        const formattedDecimal = decimalPart.slice(0, 4); // Take up to 4 digits after decimal

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

                    {/* ${row?.Trade?.price_last.toFixed(2)} */}
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </>
      )}
    </>
  );
};

export default NewPaitTBody;
