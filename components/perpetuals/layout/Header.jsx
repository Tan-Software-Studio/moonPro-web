import React, { useState } from 'react'
import FundingCountdown from '../FundingCountdown';
import { FaCaretDown } from 'react-icons/fa6';

const Header = ({ setIsOpen, isOpen, allToken, handleTokenSelect, selectedToken }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTokens = allToken.filter(token =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );


    function formatFundingRate(fundingRate) {
        const rate = parseFloat(fundingRate);
        if (isNaN(rate)) return "--";
        return (rate * 100).toFixed(4) + "%";
    }
    return (
        <div className='flex overflow-scroll items-center  p-4 w-full h-[70px] gap-10 bg-[#1a1a1a]'>
            <div className=''>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="px-3 flex items-center gap-1.5 w-fit h-fit    text-[#ffffff] rounded-md text-sm font-bold transition-colors cursor-pointer"
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
                    <div className="absolute z-50 mt-3 left-0 md:w-[500px] w-full max-w-[500px] bg-[#18181a] border border-gray-700 rounded-lg max-h-[75vh] animate-in slide-in-from-top-2 duration-300 overflow-hidden backdrop-blur-sm">
                        <div className="p-2">
                            <h1 className='p-2 font-medium text-lg'>Symbol</h1>
                            <input
                                type="text"
                                placeholder="Search by symbol (e.g. BTCUSDT)"
                                className="w-full rounded-sm px-3 py-1.5 bg-[#2a2a2a] text-sm text-white placeholder-gray-400 outline-none border border-gray-600 focus:ring-[1px] focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-5 py-1 gap-4 items-center ">
                            <div className="col-span-2 text-gray-400 text-xs font-medium px-2">Symbols</div>
                            <div className="col-span-1 text-gray-400 text-xs font-medium">Last Price</div>
                            <div className="col-span-1 text-gray-400 text-xs font-medium">24h Change</div>
                            <div className="col-span-1 text-gray-400 text-xs font-medium">24h Volume</div>
                        </div>

                        <div className="overflow-y-auto max-h-[55vh] custom-scrollbar">
                            {allToken?.length > 0 ? (
                                filteredTokens.map((item, ind) => {
                                    return (
                                        <div
                                            key={ind}
                                            onClick={() => handleTokenSelect(item, ind)}
                                            className={`group cursor-pointer relative bg-[#18181a] hover:bg-[#2a2a2a] px-2 py-3 transition-all duration-300`}
                                        >
                                            <div className="grid grid-cols-5 gap-4 items-center">
                                                <div className="col-span-2 flex items-center gap-4">
                                                    <div className="flex-1 mt-0.5 min-w-0">
                                                        <div className="flex items-center gap-2 text-white font-medium text-sm">
                                                            <span className="truncate">{item?.symbol}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-1 text-start">
                                                    <div className="text-white text-sm font-medium">{item?.lastPrice}</div>
                                                </div>
                                                <div className="col-span-1 text-start">
                                                    <div className={`text-sm font-medium ${Number(item?.priceChangePercent) > 0 ? "text-green-500" : "text-red-500"}`}>{item?.priceChangePercent}%</div>
                                                </div>
                                                <div className="col-span-1 text-start">
                                                    <div className="text-white text-sm font-medium">{Number(item.quoteVolume).toFixed(0)}</div>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#1d73fc]/5 to-[#2563eb]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
            <div>
                <span className="text-sm text-gray-400 font-medium">Mkt price:</span>
                <div className="font-bold text-white text-sm">${Number(selectedToken?.markPrice).toFixed(2) || "--"}</div>
            </div>
            <div>
                <span className="text-sm text-gray-400 font-medium">Index:</span>
                <div className={`font-medium text-sm text-white`}>
                    {Number(selectedToken?.indexPrice).toFixed(2) || "--"}
                </div>
            </div>
            <div className='col-span-2'>
                <span className="text-sm text-gray-400 font-medium">Funding/Countdown</span>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                    {formatFundingRate(selectedToken?.lastFundingRate) || '--'} /  <FundingCountdown nextFundingTime={selectedToken?.nextFundingTime} />
                </div>
            </div>
            <div className=''>
                <span className="text-sm text-gray-400 font-medium">24h Volume</span>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                    {selectedToken?.oneDayVolume || '--'}
                </div>
            </div>
        </div>
    )
}

export default Header