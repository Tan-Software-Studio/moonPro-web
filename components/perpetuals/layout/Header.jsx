import { setSelectedToken } from '@/app/redux/perpetauls/perpetual.slice';
import React, { memo, useEffect, useRef, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { useDispatch } from 'react-redux';
const Header = ({ allTokenList, setIsOpen, isOpen, selectedToken, setIsTokenChanged, setSelectedToken }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();



    function formatVolume(volume) {
        const vol = Number(volume);
        if (vol >= 1_000_000_000) {
            return (vol / 1_000_000_000).toFixed(2) + 'B';
        } else if (vol >= 1_000_000) {
            return (vol / 1_000_000).toFixed(2) + 'M';
        } else if (vol >= 1_000) {
            return (vol / 1_000).toFixed(2) + 'K';
        }
        return vol
    }


    const filteredTokens = allTokenList.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className='flex overflow-scroll items-center py-2 px-4 w-full h-[70px] gap-10  '>
            <div className='border-r flex items-center  border-r-gray-500 pr-2.5 h-full'>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="px-3 flex items-center gap-1.5 text-[#ffffff]  text-sm font-semibold transition-colors cursor-pointer"
                >
                    <span className="capitalize">
                        {selectedToken?.name || "Tokens"}
                    </span>
                    <div
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    >
                        <FaCaretDown />
                    </div>
                </button>

                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-50 mt-3 bg-[#18181A] top-10 left-0 md:w-[600px] w-full max-w-[600px] border border-gray-700 rounded-lg max-h-[75vh] animate-in slide-in-from-top-2 duration-300 overflow-hidden backdrop-blur-sm">

                        <div className="px-3 py-2">
                            <div className='w-full flex items-center gap-1 rounded-md px-3 py-1.5 bg-[#2a2a2a] text-sm border border-gray-600 focus:ring-[1px] focus:ring-blue-500'>
                                <IoIosSearch size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by symbol (e.g. BTCUSDT)"
                                    className=" text-white bg-transparent w-full text-xs outline-none "
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Header row matching main design */}
                        <div className="  px-4 py-3 border-b border-gray-700">
                            <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-gray-400">
                                <div className="col-span-2">Symbol</div>
                                <div className="col-span-2">Market Price</div>
                                <div className="col-span-3">24h Change</div>
                                <div className="col-span-2">Oracle</div>
                                <div className="col-span-3">Volume</div>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[35vh] visibleScroll">
                            {allTokenList?.length > 0 ? (
                                filteredTokens.map((item, ind) => {

                                    return (
                                        <div
                                            key={ind}
                                            onClick={() => {
                                                setSelectedToken(item);
                                                setIsTokenChanged(item)
                                                setIsOpen(false)
                                            }}
                                            className={`group cursor-pointer relative   hover:bg-[#2a2a2a] px-4 py-1.5 border-b border-gray-800/50 transition-all duration-200`}
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                {/* Symbol */}
                                                <div className="col-span-2 flex items-center gap-2">
                                                    <div className='flex items-center gap-2'>
                                                        <div className="text-white font-medium text-[13px] truncate">
                                                            {item?.name}
                                                        </div>
                                                        <div className='text-xs w-fit bg-[#11265B]/50 px-1 py-1 rounded-sm text-[#3b82f6]'>{item?.maxLeverage}X</div>
                                                    </div>
                                                </div>

                                                {/* Last Price */}
                                                <div className="col-span-2 ">
                                                    <div className="text-white text-[13px] font-medium">
                                                        {item?.markPx}
                                                    </div>
                                                </div>

                                                {/* 24h Change */}
                                                <div className="col-span-3 ">
                                                    <div className={`font-medium text-[13px] flex items-center gap-1 ${Number(item?.priceChangePercent) > 0 ? "text-green-400" : "text-red-400"}`}>
                                                        <div>{Number(item?.priceChangeAbs)?.toFixed(2)}</div> /
                                                        <div>{Number(item?.priceChangePercent)?.toFixed(2)}%</div>
                                                    </div>
                                                </div>

                                                {/* Oracle Price */}
                                                <div className="col-span-2 ">
                                                    <div className="text-white text-[13px] font-medium">
                                                        {formatVolume(item?.oraclePx)}
                                                    </div>
                                                </div>

                                                {/* 24h Volume */}
                                                <div className="col-span-3  ">
                                                    <div className="text-white text-[13px] font-medium">
                                                        {formatVolume(item?.dayNtlVlm)}
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
                <div className="font-medium text-white text-sm">{selectedToken ? Number(selectedToken?.markPx).toFixed(2) : "--"}</div>
                <span className="text-xs text-gray-400 font-normal">Mark</span>
            </div>

            <div>
                <div className={`font-medium text-sm text-white`}>
                    {selectedToken ? Number(selectedToken?.oraclePx).toFixed(2) : "--"}
                </div>
                <span className="text-xs text-gray-400 font-normal">Oracle</span>
            </div>

            <div className='col-span-2'>
                <div className={`font-medium text-sm flex items-center gap-1 ${Number(selectedToken?.priceChangePercent) > 0 ? "text-green-400" : "text-red-400"}`}>
                    <div>{selectedToken ? Number(selectedToken?.priceChangeAbs)?.toFixed(2) : "--"}</div> /
                    <div>{selectedToken ? Number(selectedToken?.priceChangePercent)?.toFixed(2) : "--"}%</div>
                </div>
                <span className="text-xs text-gray-400 font-normal">24h Change</span>
            </div>


            <div className='col-span-2'>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {selectedToken ? formatVolume(selectedToken?.dayNtlVlm) : "--"}
                </div>
                <span className="text-xs text-gray-400 font-normal">24h Volume</span>
            </div>


            <div className='col-span-2'>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {selectedToken ? formatVolume(selectedToken?.openInterest) : "--"}
                </div>
                <span className="text-xs text-gray-400 font-normal">Open Interest</span>
            </div>

            <div className='col-span-2'>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {selectedToken ? selectedToken?.funding : "--"}
                </div>
                <span className="text-xs text-gray-400 font-normal">Funding/Countdown</span>
            </div>
        </div>
    )
}

export default memo(Header)