import React, { useEffect, useState } from 'react';
import { X, TrendingUp, Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { humanReadableFormat } from '@/utils/basicFunctions';
import { IoMdDoneAll } from 'react-icons/io';
import { BiSolidCopy } from 'react-icons/bi';
import { UpdateTimeViaUTCWithCustomTime } from '@/utils/calculation';
import { setChartSymbolImage } from '@/app/redux/states';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NoDataFish } from '@/app/Images';

const NewAiSignalTokens = ({ setIsOpen }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [copiedIndex, setCopiedIndex] = useState(null);
    const dispatch = useDispatch()
    const aiSignalData = useSelector((state) => state?.aiSignal?.aiSignalData);
    const isLoading = useSelector((state) => state?.aiSignal?.initialLoading);
    const router = useRouter();

    const handleCopy = (address, index, e) => {
        e.preventDefault()
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const navigateToChartSreen = (item) => {
        router.push(
            `/tradingview/solana?tokenaddress=${row?.address}&symbol=${row?.symbol}`
        );
        localStorage.setItem("chartTokenImg", item?.img);
        dispatch(setChartSymbolImage(item?.img));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return (

        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed min-w-full h-screen inset-0 bg-[#1E1E1ECC] flex items-center justify-center z-[999999999999999]"
            onClick={() => setIsOpen(false)}
        >
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-6xl mx-4 p-6 bg-[#08080E] rounded-lg border border-[#333333] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Top 5 New Tokens</h2>
                            <p className="text-gray-400 text-sm">Recently added Ai Signal tokens</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#333333] rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Table Header */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-4 py-3 border-b border-[#333333] mb-2">
                    <div className="col-span-5 text-[#B2B2B7] text-sm font-semibold">Token</div>
                    <div className="col-span-2 text-[#B2B2B7] text-sm font-semibold text-center">AI Call</div>
                    <div className="col-span-2 text-[#B2B2B7] text-sm font-semibold text-center">Mkt Cap</div>
                    <div className="col-span-3 text-[#B2B2B7] text-sm font-semibold text-center">Volume</div>
                </div>

                {/* Token Rows */}
                <div className="space-y-2">
                    {isLoading ?
                        <div
                            className="snippet flex justify-center items-center mt-24   "
                            data-title=".dot-spin"
                        >
                            <div className="stage">
                                <div className="dot-spin"></div>
                            </div>
                        </div> :
                        aiSignalData.length > 0 ?

                            aiSignalData?.slice(0, 5)?.map((item, ind) => (
                                <div
                                    key={ind}
                                    className="hover:bg-[#3333339c] bg-[#08080E] cursor-pointer rounded-lg border border-[#333333] p-4 transition-colors duration-200"
                                    onClick={() => navigateToChartSreen(item)}
                                >
                                    {/* Desktop Layout */}
                                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                                        {/* Token Info - 5 columns */}
                                        <div className="col-span-5 flex items-center gap-3">
                                            <div className="shrink-0">
                                                <div className="flex w-12 h-12 items-center justify-center border border-dashed rounded-lg border-gray-700">
                                                    {item?.img ? (
                                                        <img
                                                            src={item?.img}
                                                            alt={`${item.symbol}`}
                                                            className="w-12 h-12 rounded-lg border border-dashed border-gray-700"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-gray-400 uppercase">
                                                            {item?.symbol?.charAt(0) || "?"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-white">
                                                        {item?.symbol}
                                                    </span>
                                                    <span className="text-[#9b9999] text-xs">/</span>
                                                    <span className="text-sm text-white truncate">
                                                        {item?.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="text-xs text-[#B2B2B7] font-mono px-2 truncate">
                                                        {item?.address}
                                                    </div>
                                                    <button
                                                        onClick={(event) => handleCopy(item?.address, ind, event)}
                                                        className="p-1 hover:bg-[#333333] rounded transition-colors"
                                                    >
                                                        {copiedIndex === ind ? (
                                                            <IoMdDoneAll className="text-[#48BB78] w-3 h-3" />
                                                        ) : (
                                                            <BiSolidCopy className="text-[#9b9999] hover:text-white w-3 h-3" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Call - 2 columns */}
                                        <div className="col-span-2 text-center">
                                            <div className="text-sm font-semibold text-emerald-500">
                                                {UpdateTimeViaUTCWithCustomTime(item?.dbCreatedAt, currentTime)}
                                            </div>
                                        </div>

                                        {/* Market Cap - 2 columns */}
                                        <div className="col-span-2 text-center">
                                            <div className="text-sm font-semibold text-[#FFFFFF]">
                                                {humanReadableFormat(item?.marketCap)}
                                            </div>
                                        </div>

                                        {/* Volume - 3 columns */}
                                        <div className="col-span-3 text-center">
                                            <div className="text-sm font-semibold text-[#FFFFFF]">
                                                {humanReadableFormat(item?.traded_volume)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Layout */}
                                    <div className="lg:hidden">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="shrink-0">
                                                <div className="flex w-12 h-12 items-center justify-center border border-dashed rounded-lg border-gray-700">
                                                    {item?.img ? (
                                                        <img
                                                            src={item?.img}
                                                            alt={`${item.symbol}`}
                                                            className="w-12 h-12 rounded-lg border border-dashed border-gray-700"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold text-gray-400 uppercase">
                                                            {item?.symbol?.charAt(0) || "?"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-white">
                                                        {item?.symbol}
                                                    </span>
                                                    <span className="text-[#9b9999] text-xs">/</span>
                                                    <span className="text-sm text-white truncate">
                                                        {item?.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs text-[#B2B2B7] font-mono bg-[#1a1a1a] px-2 py-1 rounded border border-[#333333] truncate max-w-[180px]">
                                                        {item?.address}
                                                    </div>
                                                    <button
                                                        onClick={(event) => handleCopy(item?.address, ind, event)}
                                                        className="p-1 hover:bg-[#333333] rounded transition-colors"
                                                    >
                                                        {copiedIndex === ind ? (
                                                            <IoMdDoneAll className="text-[#48BB78] w-3 h-3" />
                                                        ) : (
                                                            <BiSolidCopy className="text-[#9b9999] hover:text-white w-3 h-3" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#333333]">
                                            <div className="text-center">
                                                <div className="text-[#B2B2B7] text-xs mb-1">AI Call</div>
                                                <div className="text-sm font-semibold text-[#FFFFFF]">
                                                    {UpdateTimeViaUTCWithCustomTime(item?.dbCreatedAt, currentTime)}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[#B2B2B7] text-xs mb-1">Mkt Cap</div>
                                                <div className="text-sm font-semibold text-[#FFFFFF]">
                                                    {humanReadableFormat(item?.marketCap)}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[#B2B2B7] text-xs mb-1">Volume</div>
                                                <div className="text-sm font-semibold text-[#FFFFFF]">
                                                    {humanReadableFormat(item?.traded_volume)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) :
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
                                <p className="text-slate-400 text-lg mb-2 break-words break-all">
                                    No data available
                                </p>
                            </div>
                    }
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NewAiSignalTokens; 