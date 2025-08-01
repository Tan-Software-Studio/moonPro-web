import React, { memo, useState } from 'react'
import FundingCountdown from '../FundingCountdown';
import { FaCaretDown } from 'react-icons/fa6';

function Header({ setIsOpen, isOpen, allToken, handleTokenSelect, selectedToken }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTokens = allToken.filter(token =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function formatFundingRate(fundingRate) {
        const rate = parseFloat(fundingRate);
        if (isNaN(rate)) return "--";
        return (rate * 100).toFixed(4) + "%";
    }

    function formatVolume(volume) {
        const vol = Number(volume);
        if (vol >= 1000000) {
            return (vol / 1000000).toFixed(2) + 'M';
        } else if (vol >= 1000) {
            return (vol / 1000).toFixed(2) + 'K';
        }
        return vol.toFixed(0);
    }

    return (
        <div className='flex overflow-scroll items-center py-2 px-4 w-full h-[70px] gap-10 bg-[#1a1a1a]'>
            <div className='border-r flex items-center  border-r-gray-500 pr-2.5 h-full'>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="px-3 flex items-center gap-1.5 text-[#ffffff]  text-sm font-semibold transition-colors cursor-pointer"
                >
                    <span className="capitalize">
                        {selectedToken?.symbol || "Tokens"}
                    </span>
                    <div
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    >
                        <FaCaretDown />
                    </div>
                </button>
                {isOpen && (
                    <div className="absolute z-50 mt-3 top-10 left-0 md:w-[600px] w-full max-w-[600px] bg-[#1a1a1a] border border-gray-700 rounded-lg max-h-[75vh] animate-in slide-in-from-top-2 duration-300 overflow-hidden backdrop-blur-sm">
                        <div className="p-3 border-b border-gray-700">
                            <input
                                type="text"
                                placeholder="Search by symbol (e.g. BTCUSDT)"
                                className="w-full rounded-sm px-3 py-2 bg-[#2a2a2a] text-sm text-white placeholder-gray-400 outline-none border border-gray-600 focus:ring-[1px] focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Header row matching main design */}
                        <div className="bg-[#1a1a1a] px-4 py-3 border-b border-gray-700">
                            <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-gray-400">
                                <div className="col-span-3">Symbol</div>
                                <div className="col-span-2  ">Last Price</div>
                                <div className="col-span-2  *:">24h Change</div>
                                <div className="col-span-2 ">Index</div>
                                <div className="col-span-3 ">24h Volume</div>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[55vh] custom-scrollbar">
                            {allToken?.length > 0 ? (
                                filteredTokens.map((item, ind) => {
                                    const priceChange = Number(item?.priceChangePercent);
                                    const isPositive = priceChange > 0;

                                    return (
                                        <div
                                            key={ind}
                                            onClick={() => handleTokenSelect(item, ind)}
                                            className={`group cursor-pointer relative bg-[#1a1a1a] hover:bg-[#2a2a2a] px-4 py-3 border-b border-gray-800/50 transition-all duration-200`}
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                {/* Symbol */}
                                                <div className="col-span-3 flex items-center gap-2">
                                                    <div>
                                                        <div className="text-white font-medium text-sm truncate">
                                                            {item?.symbol}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Last Price */}
                                                <div className="col-span-2 ">
                                                    <div className="text-white text-sm font-medium">
                                                        {Number(item?.lastPrice).toFixed(item?.lastPrice > 1 ? 2 : 6)}
                                                    </div>
                                                </div>

                                                {/* 24h Change */}
                                                <div className="col-span-2 ">
                                                    <div className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                                                        {isPositive ? '+' : ''}{item?.priceChangePercent}%
                                                    </div>
                                                </div>

                                                {/* Index Price */}
                                                <div className="col-span-2 ">
                                                    <div className="text-white text-sm font-medium">
                                                        {Number(item?.indexPrice || item?.lastPrice).toFixed(item?.lastPrice > 1 ? 2 : 6)}
                                                    </div>
                                                </div>

                                                {/* 24h Volume */}
                                                <div className="col-span-3  ">
                                                    <div className="text-white text-sm font-medium">
                                                        {formatVolume(item?.quoteVolume || item?.volume)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-400 py-16">
                                    <div className="text-gray-400">No tokens available</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Main header info - matching your existing design */}
            <div className=''>
                <div className="font-medium text-white text-sm">${Number(selectedToken?.markPrice || selectedToken?.lastPrice).toFixed(2) || "--"}</div>
                <span className="text-xs text-gray-400 font-normal">Mark</span>
            </div>
            <div>
                <div className={`font-medium text-sm text-white`}>
                    {Number(selectedToken?.indexPrice || selectedToken?.lastPrice).toFixed(2) || "--"}
                </div>
                <span className="text-xs text-gray-400 font-normal">Index</span>
            </div>
            <div className='col-span-2'>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {formatFundingRate(selectedToken?.lastFundingRate) || '--'} / <FundingCountdown nextFundingTime={selectedToken?.nextFundingTime} />
                </div>
                <span className="text-xs text-gray-400 font-normal">Funding/Countdown</span>
            </div>
            <div className=''>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {formatVolume(selectedToken?.oneDayVolume || selectedToken?.quoteVolume) || '--'}
                </div>
                <span className="text-xs text-gray-400 font-normal">24h Volume</span>
            </div>
        </div>
    )
}

export default memo(Header)