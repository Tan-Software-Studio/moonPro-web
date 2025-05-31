"use client"
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { NoDataFish, tableImage } from '@/app/Images';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Copy, Trash2, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setChartSymbolImage, setIsFaviouriteToken } from '@/app/redux/states';

const Watchlist = ({ setIsWatchlistPopup }) => {
    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL
    const [getWatchlistData, setGetWatchlistData] = useState([]);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter();

    const token = localStorage.getItem("token");
    async function getWatchlist() {
        if (!token) {
            return toast.error("Please login");
        }
        setLoading(true)
        await axios.get(`${baseUrl}user/getUserTokenFavorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                // console.log("🚀 ~ .then ~ res:--->>>>", res)
                setLoading(false)
                setGetWatchlistData(res?.data?.data?.tokenFavorites || []);
            })
            .catch((err) => {
                setLoading(false)
                toast.error(err?.res?.data?.message || "Something went wrong");
            });
    }

    useEffect(() => {
        getWatchlist();
    }, []);

    const handleDeleteItem = async (tokenAddress) => {
        if (!token) {
            return toast.error("Please login");
        }
        await axios.delete(`${baseUrl}user/deleteTokenFavorite`, {
            data: {
                tokenAddress
            },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },
        ).then((response) => {
            setGetWatchlistData((prev) => prev.filter(item => item.tokenAddress !== tokenAddress));
            dispatch(setIsFaviouriteToken())
            toast.success(response?.data?.message)

        }).catch((error) => {
            toast.success(error?.response?.data?.message)
        })
    };

    const navigateToChartSreen = (item) => {
        router.push(
            `/tradingview/solana?tokenaddress=${item?.tokenAddress}&symbol=${item?.symbol}`
        );
        setIsWatchlistPopup(false)
        localStorage.setItem("chartTokenImg", item?.img);
        dispatch(setChartSymbolImage(item?.img));
    }

    return (
        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsWatchlistPopup(false)}
            className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center !z-[999999999999999]"
        >
            <motion.div
                key="modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="LanguagePopup-lg xl:w-[1100px] lg:w-[1000px] md:w-[90%]  w-full bg-[#08080E] rounded-md !z-[999999999999999]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white">Watchlist</h2>
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
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    TOKEN
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    MARKET CAP
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    1H VOLUME
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    LIQUIDITY
                                </th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    ACTIONS
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
                            ) :
                                getWatchlistData.length > 0 ?
                                    <>
                                        {
                                            getWatchlistData.map((item, index) => (
                                                <tr key={index}
                                                    className="hover:bg-gray-900 transition-colors">
                                                    {/* Token Column */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.img}
                                                                alt={item.name}
                                                                className="w-10 h-10 rounded-lg border border-blue-500"
                                                            />
                                                            <div>
                                                                <div className="text-white font-semibold text-base">
                                                                    {item.name || item?.symbol || "Unknown"}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                                    <span>{`${item?.tokenAddress?.slice(0, 5)}...${item?.tokenAddress?.slice(-5)}`}</span>
                                                                    <button
                                                                        onClick={() => navigator.clipboard.writeText(item.tokenAddress)}
                                                                        className="text-gray-500 hover:text-gray-300 transition-colors"
                                                                    >
                                                                        <Copy size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Market Cap Column */}
                                                    <td
                                                        onClick={() => navigateToChartSreen(item)}
                                                        className="px-6 py-4">
                                                        <span className="text-gray-300 text-sm">
                                                            {item?.marketCap || "N/A"}
                                                        </span>
                                                    </td>

                                                    {/* Volume Column */}
                                                    <td
                                                        onClick={() => navigateToChartSreen(item)}
                                                        className="px-6 py-4">
                                                        <span className="text-gray-300 text-sm">
                                                            {item.volume || "N/A"}
                                                        </span>
                                                    </td>

                                                    {/* Liquidity Column */}
                                                    <td
                                                        onClick={() => navigateToChartSreen(item)}
                                                        className="px-6 py-4">
                                                        <span className="text-gray-300 text-sm">
                                                            {item.Liqudity || "N/A"}
                                                        </span>
                                                    </td>

                                                    {/* Actions Column */}
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteItem(item?.tokenAddress, index)}
                                                            className="text-red-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </> : (
                                        <tr>
                                            <td colSpan="5">
                                                <div className="flex flex-col items-center justify-center h-[300px] w-full">
                                                    <Image
                                                        src={NoDataFish}
                                                        alt="No Data Available"
                                                        width={200}
                                                        height={100}
                                                        className="rounded-lg mb-4"
                                                    />
                                                    <h1 className="text-[#89888e] text-lg">No data found.</h1>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div >
    )
}

export default Watchlist
