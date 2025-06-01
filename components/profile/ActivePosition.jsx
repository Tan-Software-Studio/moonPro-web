import { NoDataFish } from '@/app/Images';
import { setChartSymbolImage } from '@/app/redux/states';
import { Check, Copy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PiWallet } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

const ActivePosition = ({searchPnlData}) => {

    const router = useRouter()
    const [copiedIndex, setCopiedIndex] = useState(null);
    const dispatch = useDispatch();
    const currentTabData = useSelector(
        (state) => state?.setPnlData?.PnlData || []
    );

    const solWalletAddress = useSelector(
        (state) => state?.AllStatesData?.solWalletAddress
    );
    const initialLoading = useSelector(
        (state) => state?.setPnlData?.initialLoading
    );
    const isDataLoaded = useSelector(
        (state) => state?.setPnlData?.isDataLoaded
    );
    const hasAttemptedLoad = useSelector(
        (state) => state?.setPnlData?.hasAttemptedLoad
    );

    const handleCopy = (address, index, e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const shouldShowLoading = initialLoading || (!hasAttemptedLoad && !isDataLoaded);
    const shouldShowData = !initialLoading && isDataLoaded && currentTabData?.length > 0;
    const shouldShowNoData = !initialLoading && hasAttemptedLoad && isDataLoaded && currentTabData?.length === 0;




    const navigateToChartSreen = (item) => {
        router.push(
            `/tradingview/solana?tokenaddress=${item?.token}&symbol=${item?.symbol}`
        );
        localStorage.setItem("chartTokenImg", item?.img);
        dispatch(setChartSymbolImage(item?.img));
    }

    return (
        <>
            <div className="overflow-auto h-[400px] max-h-[450px]">
                {shouldShowLoading ?
                    <div
                        className="snippet flex justify-center items-center mt-24   "
                        data-title=".dot-spin"
                    >
                        <div className="stage">
                            <div className="dot-spin"></div>
                        </div>
                    </div> : shouldShowData ?
                        <div className="min-w-full">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 border-b bg-[#08080E] border-gray-800 z-40">
                                    <tr>
                                        <th className="px-4 py-2 text-slate-300 font-medium">
                                            Token
                                        </th>
                                        <th className="px-4 py-2 text-slate-300 font-medium">
                                            Bought
                                        </th>
                                        <th className="px-4 py-2 text-slate-300 font-medium">
                                            Sold
                                        </th>
                                        <th className="px-4 py-2 text-slate-300 font-medium">
                                            Remaining
                                        </th>
                                        <th className="px-4 py-2 text-slate-300 font-medium">
                                            PnL
                                        </th>
                                    </tr >
                                </thead >
                                <tbody>
                                    {searchPnlData?.map((item, index) => (
                                        <tr
                                            onClick={() => navigateToChartSreen(item)}
                                            key={index}
                                            className={`${index % 2 === 0
                                                ? "bg-gray-800/20"
                                                : ""}
                                         border-b border-slate-700/20 hover:bg-slate-800/30 cursor-pointer transition-colors duration-200`}
                                        >
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item?.img}
                                                        alt="Token Icon"
                                                        className="w-10 h-10 rounded-md object-cover"
                                                    />
                                                    <div className="min-w-0">
                                                        <div className='flex items-center gap-1'>
                                                            <p className="font-medium text-base text-white">{item?.symbol} /</p>
                                                            <p className="font-medium  text-sm text-gray-400 ">{item?.name}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]">
                                                                {item?.token}
                                                            </span>
                                                            <button
                                                                onClick={(e) => handleCopy(item?.token, index, e)}
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
                                            <td className="px-4 py-2">
                                                <p className="font-semibold  text-emerald-500 ">{Number(item.totalBoughtQty).toFixed(2)}</p>
                                            </td>
                                            <td className="px-4 py-2">
                                                <p className="font-semibold text-red-500 ">{Number(item.quantitySold).toFixed(2)}</p>
                                            </td>
                                            <td className="px-4 py-2">
                                                <p className="font-semibold  text-white">{(item.totalBoughtQty - item.quantitySold).toFixed(2)}</p>
                                                {/* <p className="font-semibold  text-gray-400">${((item.totalBoughtQty - item.quantitySold) * item.current_price).toFixed(2)}</p> */}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`font-semibold px-2 py-1 rounded-full text-sm 
                                                     ${((item.current_price - item.averageBuyPrice) / item.averageBuyPrice) * 100 >= 0
                                                            ? 'text-emerald-400 bg-emerald-900/20'
                                                            : 'text-red-400 bg-red-900/20'
                                                        }
                                                    `}
                                                >
                                                    {`${(((item.current_price - item.averageBuyPrice) / item.averageBuyPrice) * 100).toFixed(2)}%`}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table >
                        </div > : shouldShowNoData ?
                            <div className="flex flex-col items-center justify-center h-64 mt-10 text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <Image
                                        src={NoDataFish}
                                        alt="No Data Available"
                                        width={200}
                                        height={100}
                                        className="text-slate-400"
                                    />
                                </div>
                                <p className="text-slate-400 text-lg mb-2">No data available</p>
                                <p className="text-slate-500 text-sm">
                                    information will appear here when available
                                </p>
                            </div> : null
                }
            </div >
        </>
    );
};

export default ActivePosition;