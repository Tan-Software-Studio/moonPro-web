/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Copy, Trash2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setChartSymbolImage, setIsFaviouriteToken } from "@/app/redux/states";
import { showToaster, showToasterSuccess } from "@/utils/toaster/toaster.style";
import { useTranslation } from "react-i18next";
import NoData from "@/components/common/NoData/noData";

const Watchlist = ({ setIsWatchlistPopup }) => {
  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
  const [getWatchlistData, setGetWatchlistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const accountPopup = t("accountPopup");
  // Format Number Compact
  const formatNumberCompact = (number) => {
    if (number === null || number === undefined || isNaN(number)) return "0";

    const absNum = Math.abs(Number(number));
    const suffixes = [
      { value: 1e12, symbol: "T" },
      { value: 1e9, symbol: "B" },
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "K" },
    ];

    for (let i = 0; i < suffixes.length; i++) {
      if (absNum >= suffixes[i].value) {
        return (
          (number / suffixes[i].value).toFixed(2).replace(/\.00$/, "") +
          suffixes[i].symbol
        );
      }
    }

    return number.toString();
  };

  const token = localStorage.getItem("token");
  async function getWatchlist() {
    if (!token) {
      return showToaster("Please login");
    }
    setLoading(true);
    await axios
      .get(`${baseUrl}user/getUserTokenFavorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("🚀 ~ .then ~ res:--->>>>", res)
        setLoading(false);
        setGetWatchlistData(res?.data?.data?.tokenFavorites || []);
      })
      .catch((err) => {
        setLoading(false);
        showToaster(err?.res?.data?.message || "Something went wrong");
      });
  }

  useEffect(() => {
    getWatchlist();
  }, []);

  const handleDeleteItem = async (tokenAddress) => {
    if (!token) {
      return showToaster("Please login");
    }

    try {
      const response = await axios.delete(
        `${baseUrl}user/deleteTokenFavorite`,
        {
          data: { tokenAddress },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGetWatchlistData((prev) =>
        prev.filter((item) => item.tokenAddress !== tokenAddress)
      );
      dispatch(setIsFaviouriteToken());
      showToasterSuccess(response?.data?.message);
    } catch (error) {
      showToaster(error?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingItem(null);
    }
  };

  const navigateToChartSreen = (item) => {
    router.push(`/tradingview/solana?tokenaddress=${item?.tokenAddress}`);
    setIsWatchlistPopup(false);
    localStorage.setItem("chartTokenImg", item?.img);
    dispatch(setChartSymbolImage(item?.img));
  };

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsWatchlistPopup(false)}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !z-[999999999999999]"
    >
      <motion.div
        key="modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="LanguagePopup-lg xl:w-[1100px] lg:w-[1000px] md:w-[90%]  w-full bg-[#08080e] rounded-md !z-[999999999999999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {accountPopup?.watchlist?.watchlist}
          </h2>
          <button
            onClick={() => setIsWatchlistPopup(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto px-5 pb-5  min-h-[300px] ">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider text-nowrap">
                  {accountPopup?.watchlist?.token}
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider text-nowrap">
                  {accountPopup?.watchlist?.marketCap}
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider text-nowrap">
                  {accountPopup?.watchlist?.volume1h}
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider text-nowrap">
                  {accountPopup?.watchlist?.liquidity}
                </th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider text-nowrap">
                  {accountPopup?.watchlist?.actions}
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-800 max-h-[500px]  overflow-y-auto cursor-pointer">
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex justify-center items-center h-[200px]">
                      <div className="stage">
                        <div className="dot-spin"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : getWatchlistData.length > 0 ? (
                <>
                  {getWatchlistData.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => navigateToChartSreen(item)}
                      className="hover:bg-gray-900 transition-colors"
                    >
                      {/* Token Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 relative">
                          <div className="relative w-10 h-10">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-10 h-10 rounded-md border-2 border-gray-500 object-cover"
                            />

                            {/* Pump badge image in bottom-right corner */}
                            {item.img && (
                              <img
                                src={
                                  "https://play-lh.googleusercontent.com/38AumHMi-kqROWOkerx9qhrNhEtgfu12mqfYSrUizzYd_9cf3h8l4ngNLOT3IEzC2K0=w240-h480-rw"
                                }
                                alt="Pump"
                                className="w-4 h-4 absolute bottom-[-4px] right-[-4px] rounded-full border border-black bg-white p-[1px]"
                              />
                            )}
                          </div>

                          <div>
                            <div className="text-white font-semibold text-base">
                              {item.name || item?.symbol || "Unknown"}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <span>{`${item?.tokenAddress?.slice(
                                0,
                                5
                              )}...${item?.tokenAddress?.slice(-5)}`}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Market Cap Column */}
                      <td
                        // onClick={() => navigateToChartSreen(item)}
                        className="px-6 py-4"
                      >
                        <span className="text-gray-300 text-sm">
                          {item?.marketCap || "N/A"}
                        </span>
                      </td>

                      {/* Volume Column */}
                      <td
                        // onClick={() => navigateToChartSreen(item)}
                        className="px-6 py-4"
                      >
                        <span className="text-gray-300 text-sm">
                          {"$"}
                          {formatNumberCompact(item.tradedVolumeUSD || 0)}
                        </span>
                      </td>

                      {/* Liquidity Column */}
                      <td
                        // onClick={() => navigateToChartSreen(item)}
                        className="px-6 py-4"
                      >
                        <span className="text-gray-300 text-sm">
                          {item.Liqudity || "N/A"}
                        </span>
                      </td>

                      {/* Actions Column */}
                      {/* <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteItem(item?.tokenAddress, index)}
                                                            className="text-red-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td> */}
                      <td className="px-6 py-4 text-center">
                        {deletingItem === item?.tokenAddress ? (
                          <div className="w-4 h-4 mx-auto border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item?.tokenAddress, index);
                            }}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center justify-center h-[300px] w-full">
                      <NoData />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Watchlist;
