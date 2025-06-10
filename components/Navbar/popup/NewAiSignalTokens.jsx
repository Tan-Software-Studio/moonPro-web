import React, { useEffect, useState, useRef } from 'react';
import { Check, Copy, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { humanReadableFormat } from '@/utils/basicFunctions';
import { UpdateTimeViaUTCWithCustomTime } from '@/utils/calculation';
import { setChartSymbolImage } from '@/app/redux/states';
import { useRouter } from 'next/navigation';

const NewAiSignalTokens = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [copiedIndex, setCopiedIndex] = useState(null);
    const dispatch = useDispatch();
    const aiSignalData = useSelector((state) => state?.aiSignal?.aiSignalData);
    const isLoading = useSelector((state) => state?.aiSignal?.initialLoading);
    const router = useRouter();
    const dropdownRef = useRef(null);

    const handleCopy = (address, index, e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const navigateToChartScreen = (item, index) => {
        router.push(`/tradingview/solana?tokenaddress=${item?.address}&symbol=${item?.symbol}`);
        localStorage.setItem("chartTokenImg", item?.img);
        localStorage.setItem("chartTokenAddress", item?.address);
        dispatch(setChartSymbolImage(item?.img));
        setIsOpen(false)
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="px-3 flex items-center gap-1.5 border-[1px] border-[#333333] py-1.5  bg-[#1a1a1a] text-[#ffffff] rounded-md text-sm font-bold transition-colors cursor-pointer"
            >
                <div className="text-[10px] h-[17px] w-[17px] border border-[#4CAF50] text-[#ffffff] rounded-md flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#409143] to-[#093d0c] shadow-[0_0_4px_rgba(76,255,80,0.4)]">
                    AI
                </div>
                <span className="capitalize 2sm:hidden">{aiSignalData[0]?.symbol || 'Tokens'}</span>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Enhanced Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-3 left-0 w-[30rem] max-w-full bg-[#18181a] border border-gray-700 rounded-lg  max-h-[75vh] animate-in slide-in-from-top-2 duration-300 overflow-hidden backdrop-blur-sm">
                    {/* Enhanced Header */}
                    <div className="p-2 border-b border-gray-700">
                        <h2 className="text-white font-semibold text-base flex items-center gap-3">
                            Recent 5 AI Signals
                        </h2>
                    </div>


                    <div className='grid grid-cols-5 py-1 gap-4 items-center border-b border-gray-700 '>
                        <div className='col-span-2 text-gray-400 text-xs font-medium px-2'>Token</div>
                        <div className="col-span-1 text-gray-400 text-xs font-medium">AI Call</div>
                        <div className="col-span-1 text-gray-400 text-xs font-medium">Market Cap</div>
                        <div className="col-span-1 text-gray-400 text-xs font-medium">Volume</div>
                    </div>
                    {/* Enhanced Content */}
                    <div className="overflow-y-auto max-h-[55vh] custom-scrollbar">
                        {isLoading ? (
                            <div className="text-center text-gray-400 py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d73fc]"></div>
                                <p className="mt-4">Loading tokens...</p>
                            </div>
                        ) : aiSignalData?.length > 0 ? (
                            aiSignalData.slice(0, 5).map((item, ind) => {
                                const { time, isRecent } = UpdateTimeViaUTCWithCustomTime(item?.dbCreatedAt, currentTime);
                                return (
                                    <div
                                        key={ind}
                                        onClick={() => navigateToChartScreen(item, ind)}
                                        className={`group cursor-pointer relative bg-[#18181a]  hover:bg-[#2a2a2a] ${ind != 4 && "border-b border-gray-700"}  px-2 py-1   transition-all duration-300 `}
                                    >

                                        <div className="grid grid-cols-5  gap-4 items-center">
                                            {/* Token Info */}
                                            <div className="col-span-2 flex items-center gap-4">
                                                <div className="relative">
                                                    {item?.img ? (
                                                        <img
                                                            src={item.img}
                                                            alt={item.symbol}
                                                            className="w-10 h-10 object-cover rounded-md border-2 border-[#333]/50 shadow-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gradient-to-br from-[#1d73fc] to-[#2563eb] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                            {item?.symbol?.charAt(0) || "?"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 mt-0.5 min-w-0">
                                                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                                                        <span className="truncate ">{item.symbol}</span>
                                                        {isRecent && (
                                                            <div className="bg-[#1d73fc] text-white text-[10px] font-normal px-1 py-[1px] rounded-md">
                                                                New
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs mt-0.5 text-[#aaa] font-mono">
                                                        <span className="max-w-[150px] truncate">
                                                            {item.address?.slice(0, 4) + "..." + item.address?.slice(-4)}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleCopy(item.address, ind, e)}
                                                            className=" "
                                                        >
                                                            {copiedIndex === ind ? (
                                                                <Check className="text-green-500 w-2.5 h-2.5" />
                                                            ) : (
                                                                <Copy className="text-[#aaa] hover:text-white w-2.5 h-2.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Time */}
                                            <div className="col-span-1 text-start">
                                                <div className="text-emerald-500 text-xs font-medium">
                                                    {time}
                                                </div>
                                            </div>

                                            {/* Market Cap */}
                                            <div className="col-span-1 text-start">
                                                <div className='text-xs font-medium'>{humanReadableFormat(item.marketCap)}</div>
                                            </div>

                                            {/* Volume */}
                                            <div className="col-span-1 text-start">
                                                <div className='text-xs font-medium'>{humanReadableFormat(item.traded_volume)}</div>
                                            </div>
                                        </div>

                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#1d73fc]/5 to-[#2563eb]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center text-gray-400 py-16">
                                <div className="p-4 bg-gradient-to-r from-[#1a1a24] to-[#0f0f14] rounded-2xl mb-4">
                                    <TrendingUp className="w-16 h-16 text-gray-600" />
                                </div>
                                <p className="text-lg font-medium">No AI signals available</p>
                                <p className="text-sm text-gray-500 mt-1">Check back soon for new token signals</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(51, 51, 51, 0.2);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #1d73fc, #2563eb);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #438bff, #3b82f6);
                }
                    
                @keyframes slide-in-from-top-2 {
                    from {
                        opacity: 0;
                        transform: translateY(-12px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .animate-in {
                    animation: slide-in-from-top-2 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
};

export default NewAiSignalTokens;