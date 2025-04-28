"use client";
import { bitcoinIcon } from "@/app/Images";
import Image from "next/image";
import { React, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import { IoOpenOutline } from "react-icons/io5";
import { PiCopySimpleFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { sellSolanaTokensQuickSellHandler } from "@/utils/solanaBuySell/solanaBuySell";
import LoaderPopup from "../LoaderPopup/LoaderPopup";

const HolderDataTable = ({ data, img, loading }) => {
  const dispatch = useDispatch();

  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("solana");

  const bigLoader = useSelector((state) => state?.AllStatesData?.bigLoader);

  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  const handleCopy = (token, index) => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        setCopied(index); // Set the index of the copied token
        // toast.success(`Token copied to clipboard!`);

        setTimeout(() => {
          setCopied(null);
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy token.");
      });
  };
  const [copied, setCopied] = useState(false);

  const SkeletonData = Array(20).fill(null);
  const SkeletonInnerData = Array(6).fill(null);

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
            <tbody key={ind} className={`text-center border-b ${borderColor}`}>
              <tr className={``}>
                {/* Column 1: Icon and Token */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3 ">
                    <Image
                      src={row.logo ? row.logo : img}
                      alt="newPairsIcon"
                      className="w-8 md:w-9 h-8 md:h-9 xl:w-10 xl:h-10 rounded-full"
                      width={50}
                      height={50}
                    />
                    <div className={`flex gap-3 items-center`}>
                      <p>
                        <span className="text-white font-bold text-[16px]">
                          {row.symbol}
                        </span>
                      </p>
                      <span
                        onClick={() =>
                          handleCopy(
                            row.token_address ? row.token_address : row.mint,
                            ind
                          )
                        }
                      >
                        {copied === ind ? (
                          <IoMdDoneAll className="h-3.5 w-3.5 text-[#3f756d] cursor-pointer" />
                        ) : (
                          <BiSolidCopy className="h-3.5 w-3.5 text-[#6B6B6D] cursor-pointer" />
                        )}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Column 2: Invested */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-center items-center gap-1.5">
                    {/* <Image
                        src={img}
                        alt="newPairsIcon"
                        className="my-auto w-5 h-5"
                      /> */}
                    <p className="flex items-center">
                      <span className="text-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {parseFloat(
                          row.balance_formatted
                            ? row.balance_formatted
                            : row.amount
                        ).toFixed(5)}
                      </span>
                    </p>
                  </div>
                </td>

                {/* Column 4: pnl in usd */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid place-content-center text-start">
                    {row?.pnlAmountUsd > 0 ? (
                      <p className={`text-[16px] text-[#3E9FD6]`}>
                        ${Number(row?.pnlAmountUsd || 0).toFixed(5)}
                      </p>
                    ) : (
                      <p className={`text-[16px] text-[#F0488B]`}>
                        ${Number(row?.pnlAmountUsd || 0).toFixed(5)}
                      </p>
                    )}
                  </div>
                </td>

                {/* Column 5:  P&L in % */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid place-content-center text-start">
                    <div className="flex gap-1.5">
                      <div className="space-y-1">
                        {row?.pnl >= 0 ? (
                          <p className="mt-0.5 text-[#3E9FD6] font-thin text-[16px]">
                            +{Number(row?.pnl ? row?.pnl : 0).toFixed(2)}%
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[#F0488B] font-thin text-[16px]">
                            {Number(row?.pnl ? row?.pnl : 0).toFixed(2)}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 10: Quick Buy Button */}
                <td className="whitespace-nowrap px-6  py-4">
                  <div className={`flex gap-3 justify-center `}>
                    {/* <IoOpenOutline
                      className={`text-[#6B6B6D] h-4 w-4 mt-1 cursor-pointer`}
                    /> */}

                    <button
                      className="border border-[#1F73FC] rounded-lg py-1 px-[30px] bg-[#16171D] hover:bg-[#11265B] text-[#ffffff] transition-all duration-300 ease-in-out"
                      onClick={(e) =>
                        sellSolanaTokensQuickSellHandler(
                          row.token_address ? row.token_address : row?.mint,
                          address,
                          isConnected,
                          walletProvider,
                          e,
                          dispatch
                        )
                      }
                    >
                      {"Sell"}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ))}
        </>
      )}
      {bigLoader == true && <LoaderPopup />}
    </>
  );
};

export default HolderDataTable;
