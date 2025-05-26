/* eslint-disable @next/next/no-img-element */
import { Swaps, baseIcon } from "@/app/Images";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";

const NewPairBaseBody = ({ data, loading }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const pathname = usePathname();
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
          {data
            ?.slice(0, 100)
            .filter((row) => row?.Arguments[1]?.Value?.string)
            .map((row, ind) => (
              <tbody key={ind} className="text-center">
                <tr
                  className={`hover:bg-[#24262e] ${
                    ind % 2 === 0 && "bg-[#16171c]"
                  } cursor-pointer`}
                  onClick={() => {
                    router.push(
                      `/tradingview/solana?tokenaddress=${row?.Receipt?.ContractAddress}&symbol=${row?.Arguments[1]?.Value?.string}`
                    );
                  }}
                >
                  {/* Column 1: Icon and Pair Info */}
                  <td className="whitespace-nowrap px-6 py-4  w-40">
                    <div className="flex  gap-3 !text-left">
                      <img
                        key={row?.Img} // Ensure the key updates with the image
                        src={
                          row?.Img
                            ? row?.Img
                            : "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg"
                        }
                        alt="tokenImg"
                        className="w-8 md:w-9 h-8 md:h-9 xl:w-10 xl:h-10 rounded-full"
                      />
                      <div>
                        <p>
                          <span className={`text-white font-bold text-[16px] `}>
                            {row?.Arguments[1]?.Value?.string.length >= 12
                              ? `${row?.Arguments[1]?.Value?.string.slice(
                                  0,
                                  12
                                )}...`
                              : row?.Arguments[1]?.Value?.string}
                            &nbsp;
                          </span>
                          <span className="font-thin text-[16px] text-[#9b9999]">
                            /
                          </span>
                          <span className="text-[15px] text-[#9b9999]">
                            {" "}
                            WETH
                          </span>
                        </p>
                        <div 
                          onClick={(e) =>
                            copyAddress(row?.Receipt?.ContractAddress, ind, e)
                          }
                        className="flex gap-2 items-center mt-1">
                          <span className="text-[#9b9999]">
                            {" "}
                            {row?.Receipt?.ContractAddress?.slice(0, 5)}
                            ...
                            {row?.Receipt?.ContractAddress?.slice(-3)}{" "}
                          </span>
                          <span
                            onClick={(e) =>
                              copyAddress(row?.Receipt?.ContractAddress, ind, e)
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
                    {/* {formatTime(timeDiffs[ind])} */}4s
                  </td>

                  {/* Column 3: Liquidity */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="grid  text-center">
                      <div className="flex justify-center gap-1.5">
                        <Image
                          src={baseIcon}
                          alt="baseIcon"
                          className="my-auto w-5 h-5"
                        />
                        <p>
                          <span className="text-[16px]">
                            {row?.liquidity ? row?.liquidity.toFixed(2) : "60"}
                          </span>
                          <span className="text-[#666873] text-[15px]">
                            {" "}
                            /{" "}
                            {row?.solliquidity
                              ? row?.solliquidity.toFixed(2)
                              : "15"}
                            K
                          </span>
                        </p>
                      </div>
                      {/* <p className="text-[#3E9FD6] mt-1">+28.3%</p> */}
                    </div>
                  </td>

                  {/* Column 4: Initial Liquidity */}
                  {/* <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-center items-center gap-1.5">
                    <Image
                      src={solana}
                      alt="newPairsIcon"
                      className="my-auto w-5 h-5"
                    />
                    <p>
                      <span className="text-[16px]">60&nbsp;</span>
                      <span className="font-thin text-[16px] text-[#9b9999]">
                        /&nbsp;
                      </span>
                      <span className="text-[15px] text-[#666873] ">$40k</span>
                    </p>
                  </div>
                </td> */}

                  {/* Column 5: Market Cap and Price */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="grid text-center">
                      {/* <p>$399.000</p>
                    <p className="text-[#828282]">$0.0075</p> */}
                      <p className="text-[16px] font-bold">
                        <span>$</span>
                        <span>{row?.MKC ? row?.MKC : "3000"}</span>
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
                            {row?.buyer ? row?.buyer + row?.sellers : "4"}
                          </p>

                          <p className="mt-0.5">
                            <span className="text-[#3E9FD6]">
                              {row?.buyer ? row?.buyer : "2"}
                            </span>
                            <span className="text-[#828282]"> / </span>
                            <span className="text-[#F0488B]">
                              {row?.sellers ? row?.sellers : "2"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 7: Volume */}

                  <td className="whitespace-nowrap px-6 py-4 text-[16px] text-center">
                    ${row?.volume ? row?.volume : 3000}
                  </td>

                  {/* Column 7: Holders */}
                  <td className="whitespace-nowrap px-6 py-4 text-center">{100}</td>

                  {/* Column 8: Audit Results */}
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
                              className="text-[#7a3e3e]"
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
                              className="text-[#7a3e3e]"
                            />
                          )}
                          <div className="mt-1">
                            <div className="capitalize">contract</div>
                            <div className="capitalize">Renounced</div>
                          </div>
                        </div>
                      </div>
                      <div className="grid  text-start text-[#74757c]">
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
                              className="text-[#7a3e3e]"
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

                  {/* Column 10: Quick Buy Button */}
                  <td className="whitespace-nowrap w-44 px-2  py-4">
                    <button className="border border-[#3E9FD6] rounded-lg py-1 px-[30px] bg-[#16171D] ">
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

export default NewPairBaseBody;
