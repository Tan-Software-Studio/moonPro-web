import { humanReadableFormatWithNoDollar } from '@/utils/basicFunctions';
import React, { memo, useEffect, useRef, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { useSelector } from 'react-redux';
import PerpsTokens from './PerpsTokens';
const Header = ({ setIsOpen, isOpen, }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState("Perps")
    const dropdownRef = useRef(null);

    const selectedToken = useSelector(
        (state) => state?.perpetualsData?.selectedToken
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
        <div className='flex overflow-scroll items-center py-2 px-4 w-full h-[70px] lg:gap-10 gap-5 break-keep whitespace-nowrap'>
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
                        <div className='w-full border-b border-gray-400 py-1.5 flex items-center gap-4 px-3'>
                            {["Perps", "Spot"].map((item, index) => (
                                <div
                                    // hover:text-white cursor-pointer
                                    className={`${activeTab == item ? "text-white" : "text-gray-400 cursor-not-allowed"}   text-xs`}
                                    onClick={() => item == "Perps" ? setActiveTab(item) : null}
                                    key={index}>
                                    {item}
                                </div>
                            ))}
                        </div>
                        {activeTab == "Perps" ?
                            <PerpsTokens setIsOpen={setIsOpen} searchTerm={searchTerm} />
                            :
                            <div className='max-h-[35vh] h-[35vh] flex items-center md:w-[600px] w-full max-w-[600px] justify-center '>Spot tokens data</div>
                        }

                    </div>
                )}
            </div>

            {/* Main header info - matching your existing design */}
            <div className=''>
                <div className="font-medium text-white text-sm">{Number(selectedToken?.markPx ?? 0).toFixed(2) || "0"}</div>
                <span className="text-xs text-gray-400 font-normal">Mark</span>
            </div>

            <div>
                <div className={`font-medium text-sm text-white`}>
                    {Number(selectedToken?.oraclePx ?? 0).toFixed(2) || "0"}
                </div>
                <span className="text-xs text-gray-400 font-normal">Oracle</span>
            </div>

            <div className='col-span-2'>
                <div className={`font-medium text-sm flex items-center gap-1 ${Number(selectedToken?.priceChangePercent ?? 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                    <div>{Number(selectedToken?.priceChangeAbs ?? 0)?.toFixed(2) || "0"}</div> /
                    <div>{Number(selectedToken?.priceChangePercent ?? 0)?.toFixed(2) || "0"}%</div>
                </div>
                <span className="text-xs text-gray-400 font-normal">24h Change</span>
            </div>


            <div className='col-span-2'>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {selectedToken ? humanReadableFormatWithNoDollar(selectedToken?.dayNtlVlm, 2) : "0"}
                </div>
                <span className="text-xs text-gray-400 font-normal">24h Volume</span>
            </div>


            <div className='col-span-2'>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {selectedToken ? humanReadableFormatWithNoDollar(selectedToken?.openInterest, 2) : "0"}
                </div>
                <span className="text-xs text-gray-400 font-normal">Open Interest</span>
            </div>

            <div className='col-span-2'>
                <div className="font-medium text-white text-sm flex items-center gap-2">
                    {selectedToken ? selectedToken?.funding : "0"}
                </div>
                <span className="text-xs text-gray-400 font-normal">Funding/Countdown</span>
            </div>
        </div>
    )
}

export default memo(Header)