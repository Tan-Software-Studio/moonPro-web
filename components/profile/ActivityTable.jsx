import React, { useEffect, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setChartSymbolImage } from "@/app/redux/states";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { NoDataLogo } from "@/app/Images";

// Truncate long strings
const truncateString = (str, start = 4, end = 4) => {
  if (str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
};

const ActivityTable = ({ activitySearchQuery, walletAddress }) => {
  const [transactionData, setTransactionData] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenImages, setTokenImages] = useState({});
  const [loadingImage, setLoadingImage] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const referral = t("referral");

  async function getData() {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://streaming.bitquery.io/eap",
        {
          query: `
          query WalletActivity($wallet: String!) {
      Solana {
        DEXTradeByTokens(
          where: {
            Trade: {
              Currency: {
                MintAddress: {
                  notIn: [
                    "So11111111111111111111111111111111111111112", 
                    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 
                    "11111111111111111111111111111111"
                  ]
                }
              }
            }, 
            Transaction: {
              Result: { Success: true }, 
              Signer: { is: $wallet }
            }
          },
          limit: { count: 100 },
          limitBy:{count:1,by:Transaction_Signature}
          orderBy: { descending: Block_Time }
        ) {
          Trade {
            Currency {
              Symbol
              Name
              MintAddress
              Uri
            }
            Side {
              Type
              Amount
              AmountInUSD
            }
          }
          Block {
            Time
          }
          Transaction {
            Signature
          }
        }
      }
    }
        `,
          variables: {
            wallet: walletAddress,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STREAM_BITQUERY_API}`,
          },
        }
      );
      setIsLoading(false);
      setTransactionData(response?.data?.data?.Solana?.DEXTradeByTokens);
    } catch (err) {
      setIsLoading(false);
      console.error(
        "🚀 ~ Error fetching Bitquery data:",
        err?.response?.data || err?.message
      );
    }
  }

  const handleCopy = (address, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  useEffect(() => {
    const fetchImages = async () => {
      const imageMap = {};

      setLoadingImage(true);
      await Promise.all(
        transactionData.map(async (item, index) => {
          const uri = item?.Trade?.Currency?.Uri;
          try {
            const res = await fetch(uri);
            const data = await res.json();
            imageMap[data?.symbol] = data?.image;
          } catch (err) {
            console.error("Failed to fetch image metadata:", err);
          }
        })
      );
      setTokenImages(imageMap);
      setLoadingImage(false);
    };

    if (transactionData?.length) fetchImages();
  }, [transactionData]);

  function timeAgo(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    const seconds = Math.floor((now - then) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count}${interval.label[0]}`;
      }
    }

    return "just now";
  }

  const navigateToChartSreen = (item, img) => {
    router.push(
      `/meme/${item?.Trade?.Currency?.MintAddress}`
    );
    localStorage.setItem("chartTokenImg", img);
    dispatch(setChartSymbolImage(img));
  };

  const hasSearch = activitySearchQuery.trim() !== "";
  const filteredData = transactionData?.filter(
    (item) =>
      item?.Trade?.Currency?.MintAddress.toLowerCase()?.includes(
        activitySearchQuery.toLowerCase()
      ) ||
      item?.Trade?.Currency?.Name?.toLowerCase()?.includes(
        activitySearchQuery.toLowerCase()
      ) ||
      item?.Trade?.Currency?.Symbol?.toLowerCase()?.includes(
        activitySearchQuery.toLowerCase()
      )
  );
  const filteredActivityData = hasSearch ? filteredData : transactionData;

  useEffect(() => {
    getData();
  }, [walletAddress]);

  return (
    <>
      <div className="overflow-auto h-[400px] max-h-[400px]">
        {isLoading ? (
          <div
            className="snippet flex justify-center mt-20   "
            data-title=".dot-spin"
          >
            <div className="stage">
              <div className="dot-spin"></div>
            </div>
          </div>
        ) : !transactionData?.length > 0 ||
          !filteredActivityData?.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-64  mt-10 text-center">
            <div
              className=" flex items-center justify-center"
              style={{ maxWidth: "200px", maxHeight: "150px" }}
            >
              <Image
                src={NoDataLogo}
                alt={referral?.refMata?.noData}
                width={200}
                height={100}
                className="text-slate-400 object-contain md:w-[200px] sm:w-[180px] w-[120px] h-auto"
              />
            </div>
            <p className="text-slate-400 text-lg  break-all break-words">
              {!transactionData?.length > 0
                ? referral?.refMata?.noHistory
                : !filteredActivityData?.length > 0
                  ? `No results found for "${activitySearchQuery}"`
                  : "No data"}
            </p>
            <p className="text-slate-500 text-sm">
              {!transactionData?.length > 0
                ? referral?.refMata?.infoWillAppear
                : !filteredActivityData?.length > 0
                  ? referral?.refMata?.adjustSearch
                  : null}
            </p>
          </div>
        ) : (
          <div className="min-w-full">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b-[1px] bg-[#08080E] border-gray-800 z-40">
                <tr>
                  <th className="px-2 py-2 text-slate-300 font-medium w-16">
                    Type
                  </th>
                  <th className="px-4 py-2 text-slate-300 font-medium">
                    Token
                  </th>
                  <th className="px-3 py-2 text-slate-300 font-medium whitespace-nowrap w-24">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-slate-300 font-medium whitespace-nowrap w-28">
                    Value (USD)
                  </th>
                  <th className="px-3 py-2 text-slate-300 font-medium whitespace-nowrap w-20">
                    Age
                  </th>
                  <th className="px-3 py-2 text-slate-300 font-medium whitespace-nowrap w-28">
                    Explorer
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-4">
                      <div className="flex justify-center items-center min-h-[40vh]">
                        <span className="Tableloader"></span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredActivityData.map((item, index) => (
                    <tr
                      onClick={() =>
                        navigateToChartSreen(
                          item,
                          tokenImages[item?.Trade?.Currency?.Symbol]
                        )
                      }
                      key={index}
                      className={`${index % 2 === 0 ? "bg-gray-800/20" : ""
                        } border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors duration-200 cursor-pointer whitespace-nowrap`}
                    >
                      <td className=" w-16  px-2 py-2  ">
                        <div
                          className={`font-semibold flex items-center justify-center text-center px-2 py-1 rounded-full text-sm  ${item?.Trade?.Side?.Type == "sell"
                              ? "text-red-400 bg-red-900/20"
                              : "text-emerald-400 bg-emerald-900/20"
                            } font-medium`}
                        >
                          {item?.Trade?.Side?.Type}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {loadingImage ? (
                            // <div className="w-10 h-10 flex items-center justify-center">
                            //   <div className="loaderPopup"></div>
                            // </div>
                            <div className="w-10 h-10 rounded-md bg-[#2c2c34] animate-pulse"></div>
                          ) : tokenImages ? (
                            <img
                              src={tokenImages[item?.Trade?.Currency?.Symbol]}
                              alt="Token Icon"
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md  flex items-center justify-center bg-[#3b3b49] border border-[#1F73FC]">
                              <span className="text-sm text-white uppercase text-center">
                                {item?.Trade?.Currency?.Name.toString()?.slice(
                                  0,
                                  1
                                ) || "T"}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 whitespace-nowrap">
                            <div className="flex items-center gap-1 whitespace-nowrap break-keep">
                              <p className="font-medium text-base text-white">
                                {item?.Trade?.Currency?.Symbol} /
                              </p>
                              <p className="font-medium text-sm text-gray-400 truncate">
                                {item?.Trade?.Currency?.Name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400 font-mono truncate max-w-[150px]">
                                {item?.Trade?.Currency?.MintAddress}
                              </span>
                              <button
                                onClick={(e) =>
                                  handleCopy(
                                    item?.Trade?.Currency?.MintAddress,
                                    index,
                                    e
                                  )
                                }
                                className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded transition-colors duration-200"
                              >
                                {copiedIndex === index ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400 hover:text-slate-200" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-[18px] whitespace-nowrap w-24 ">
                        <p className="font-medium text-white text-sm">
                          {Number(item?.Trade?.Side?.Amount).toFixed(5)}
                        </p>
                      </td>
                      <td className="px-3 py-[18px] whitespace-nowrap w-28">
                        <p className="font-medium text-white text-sm">
                          ${Number(item?.Trade?.Side?.AmountInUSD).toFixed(5)}
                        </p>
                      </td>
                      <td className="px-3 py-[18px] whitespace-nowrap w-20">
                        <p className="font-medium text-white text-sm">
                          {timeAgo(item?.Block?.Time)}
                        </p>
                      </td>
                      <td className="px-3 py-[18px] whitespace-nowrap w-28">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm">
                            {item?.Transaction?.Signature.slice(0, 4) +
                              "..." +
                              item?.Transaction?.Signature.slice(-5)}
                          </span>
                          <Link
                            href={`https://solscan.io/tx/${item?.Transaction?.Signature}`}
                            onClick={(e) => {
                              // e.preventDefault();
                              e.stopPropagation();
                            }}
                            target="_blank"
                            className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded transition-colors duration-200"
                          >
                            <ExternalLink className="h-3 w-3 text-slate-400 hover:text-slate-200" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPage}
        />
      )} */}
    </>
  );
};

export default ActivityTable;
