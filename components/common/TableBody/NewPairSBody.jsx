/* eslint-disable @next/next/no-img-element */
import { Swaps, solana } from "@/app/Images";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import { humanReadableFormat, UpdateTime } from "@/utils/calculation";
import { buySolanaTokensQuickBuyHandler } from "@/utils/solanaBuySell/solanaBuySell";
import LoaderPopup from "../LoaderPopup/LoaderPopup";
import { getSolanaBalanceAndPrice } from "@/utils/solanaNativeBalance";

const NewPairSBody = ({ data, loading }) => {
  const router = useRouter();
  const pathname = usePathname();
  const getNetwork = pathname.split("/")[2];
  const dispatch = useDispatch();
  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance)
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const bigLoader = useSelector((state) => state?.AllStatesData?.bigLoader);

  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const selectToken = useSelector(
    (state) => state?.AllthemeColorData?.selectToken
  );
  const SkeletonData = Array(20).fill(null);
  const SkeletonInnerData =
    selectToken === "Solana" ? Array(8).fill(null) : Array(9).fill(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // Update every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // This runs once when the component mounts

  async function getSolanaBalance() {
    const solBalance = await getSolanaBalanceAndPrice(solWalletAddress);
    setNativeTokenbalance(solBalance);
  }
  useEffect(() => {
    if (solWalletAddress) {
      getSolanaBalance();
    }
  }, [solWalletAddress]);
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
          {data?.slice(0, 100).map((row, ind) => (
            <tbody key={ind} className="text-center">
              <tr
                className={`hover:bg-[#24262e] ${ind % 2 === 0 && "bg-[#16171c]"
                  } cursor-pointer`}
                onClick={() => {
                  // Navigate to the trading view with query parameters
                  router.push(
                    `/tradingview/${getNetwork}?tokenaddress=${row?.address}&symbol=${row?.symbol}`
                  );
                  localStorage.setItem("silectChainName", getNetwork);
                }}
              >
                {/* Column 1: Icon and Pair Info */}
                <td className="whitespace-nowrap pl-6 py-3 w-60">
                  <div className="flex items-center gap-3 w-60 !text-left">
                    <img
                      key={row?.img} // Ensure the key updates with the image
                      src={
                        row?.img
                          ? row?.img
                          : "https://superstorefinder.net/support/wp-content/uploads/2018/01/blue_loading.gif"
                      }
                      alt="tokenImg"
                      className="w-8 md:w-9 h-8 md:h-9 xl:w-10 xl:h-10 rounded-full"
                    />
                    <div>
                      <p>
                        <span className="text-white font-bold text-[16px]">
                          {row?.symbol?.length >= 12
                            ? `${row?.symbol.slice(0, 12)}...`
                            : row?.symbol}
                          &nbsp;
                        </span>
                        <span className="font-thin text-[16px] text-[#9b9999]">
                          /
                        </span>
                        <span className="text-[15px] text-[#9b9999]"> SOL</span>
                      </p>

                      <div
                        onClick={(e) => copyAddress(row?.address, ind, e)}
                        className="flex gap-2 items-center mt-1"
                      >
                        <span className="text-[#9b9999]">
                          {" "}
                          {row?.address?.slice(0, 5)}
                          ...
                          {row?.address?.slice(-3)}{" "}
                        </span>
                        <span
                          onClick={(e) => copyAddress(row?.address, ind, e)}
                        >
                          {copied === ind ? (
                            <IoMdDoneAll
                              size={17}
                              className="text-[#3f756d] cursor-pointer"
                            />
                          ) : (
                            <BiSolidCopy className="text-[#9b9999] cursor-pointer" />
                          )}
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 2: Time */}
                <td className="whitespace-nowrap py-3 text-[15px] text-center w-32 text-ellipsis ">
                  {/* {!row?.created_time
                    ? "1s"
                    : UpdateTime(row?.created_time, currentTime)} */}
                  {UpdateTime(row?.created_time, currentTime)}{" "}
                </td>

                {/* Column 3: Liquidity */}
                <td className="whitespace-nowrap py-3 w-32 ">
                  <div className="grid  text-center">
                    <div className="flex justify-center gap-1.5">
                      <Image
                        src={solana}
                        alt="solanaIcon"
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

                {/* Column 5: Market Cap and Price */}
                <td className="whitespace-nowrap  py-3 w-32 ">
                  <p className="text-[16px] font-bold text-center">
                    <span>
                      {row?.MKC ? humanReadableFormat(row?.MKC) : 3000}
                    </span>
                  </p>
                </td>

                {/* Column 6: Swaps */}
                <td className="whitespace-nowrap  py-3 w-32 ">
                  <div className="grid text-center">
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

                <td className="whitespace-nowrap  py-3 text-center text-[16px] w-32 ">
                  {row?.volume ? humanReadableFormat(row?.volume) : `$3000`}
                </td>

                {/* Column 8: Holders */}

                <td className="whitespace-nowrap  py-3 w-60">
                  <div className="flex justify-center gap-2 text-[#828282]">
                    <div className="grid  text-start">
                      <div
                        className={`flex flex-col text-start opacity-75 ${true ? "text-white" : "text-[#828282]"
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
                          <div>Mint Auth</div>
                          <div>Disabled</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid  text-start ">
                      <div
                        className={`flex flex-col text-start opacity-75 ${true ? "text-white" : "text-[#828282]"
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
                          <div>Freeze Auth</div>
                          <div>Disabled</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid  text-start text-white">
                      <div
                        className={`flex flex-col text-start opacity-75 ${true ? "text-white" : "text-[#828282]"
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
                          <div>LP</div>
                          <div>Burned</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid  text-start text-white">
                      <div
                        className={`flex flex-col text-start opacity-75 ${true ? "text-white" : "text-[#828282]"
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
                          <div>Top 10</div>
                          <div>Holders</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                {/* Column 10: Quick Buy Button */}
                <td className="whitespace-nowrap py-3 w-32 md:px-0 px-6 ">
                  <button
                    className="border border-[#3E9FD6] rounded-lg py-1 px-[30px] bg-[#16171D] hover:text-black hover:bg-[#3E9FD6] transition-all duration-300 ease-in-out"
                    onClick={(e) => {
                      buySolanaTokensQuickBuyHandler(
                        row?.address,
                        quickBuy,
                        solWalletAddress,
                        nativeTokenbalance,
                        e,
                        row?.address,
                        dispatch
                      );
                    }}
                  >
                    {quickBuy
                      ? `${quickBuy.length > 6
                        ? `${quickBuy.slice(0, 7)}...`
                        : quickBuy
                      }`
                      : 0}
                  </button>
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

export default NewPairSBody;
