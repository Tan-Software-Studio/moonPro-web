"use client";
import { React, useState } from "react";
import Image from "next/image";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import LoaderPopup from "../LoaderPopup/LoaderPopup";
import { useRouter } from "next/navigation";
import { showToaster } from "@/utils/toaster/toaster.style";
import { setActiveChartToken } from "@/app/redux/chartDataSlice/chartData.slice";

const HolderDataTable = ({ data, img, loading }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const bigLoader = useSelector((state) => state?.AllStatesData?.bigLoader);
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  const [copied, setCopied] = useState(false);
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
        showToaster("Failed to copy token.");
      });
  };
  async function redirectHandler(address, symbol) {
    dispatch(setActiveChartToken({ symbol: symbol, img: null }));
    router.push(
      `/tradingview/solana?tokenaddress=${address}&symbol=${symbol}`
    );
  }

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
            <tbody key={ind} className={`border-b ${borderColor}`}>
              <tr
                className={`cursor-pointer`}
                onClick={() => redirectHandler(row?.mint, row?.symbol)}
              >
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
                      <span onClick={() => handleCopy(row?.mint, ind)}>
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
                        {parseFloat(row.quantity).toFixed(5)}
                      </span>
                    </p>
                  </div>
                </td>

                {/* Column 4: pnl in usd */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid place-content-center text-start">0</div>
                </td>

                {/* Column 5:  P&L in % */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="grid place-content-center text-start">
                    <div className="flex gap-1.5">
                      <div className="space-y-1">0</div>
                    </div>
                  </div>
                </td>

                {/* Column 10: Quick Buy Button */}
                {/* <td className="whitespace-nowrap px-6  py-4">
                  <div className={`flex gap-3 justify-center `}>
                    <button
                      className="border border-[#1F73FC] rounded-lg py-1 px-[30px] bg-[#16171D] hover:bg-[#11265B] text-[#ffffff] transition-all duration-300 ease-in-out"
                    >
                      {"Sell"}
                    </button>
                  </div>
                </td> */}
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
