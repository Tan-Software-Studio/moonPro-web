import React from 'react'
import { IoClose, IoCopyOutline } from 'react-icons/io5'
import { motion } from "framer-motion";
import Image from 'next/image';
import { Swaps, tableImage } from '@/app/Images';
import { HiArrowsUpDown } from 'react-icons/hi2';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';

const Watchlist = ({ setIsWatchlistPopup }) => {
    const { t } = useTranslation();
    const accountPopupLng = t("accountPopup");
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
                <div className="">
                    <div className="flex items-center justify-between lg:px-6 px-3 py-4">
                        <div className="md:text-2xl sm:text-xl text-lg sm:font-bold font-semibold text-white ">
                            {accountPopupLng?.watchlist?.watchlist}
                        </div>
                        <div
                            onClick={() => setIsWatchlistPopup(false)}
                            className="cursor-pointer"
                        >
                            <IoClose size={20} />
                        </div>
                    </div>
                    <hr className='border-b-[1px] border-[#404040] ' />
                    <div className="w-full px-2 lg:px-8 py-3 overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="w-full ">
                                {[
                                    "TOKEN",
                                    "MARKET CAP",
                                    "1H VOLUMNE",
                                    "LIQUIDITY",
                                    "ACTIONS",
                                ].map((item, index) => (
                                    <th key={index}>
                                        <td className="text-[#A8A8A8] px-2 font-semibold flex items-center  py-3 text-xs md:text-sm whitespace-nowrap">
                                            <div>{item}</div>
                                        </td>
                                    </th>
                                ))}
                            </thead>
                            <tbody>
                                {Array(4).fill(0).map((_, index) => (
                                    <tr
                                        key={index}
                                        className=' border-b-[1px] border-[#404040]'>
                                        <td className="px-2 py-3">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={tableImage}
                                                    alt="Token"
                                                    className="w-8 md:w-10 h-8 md:h-10 xl:w-12 xl:h-12 rounded-[4px] border border-[#1F73FC]"
                                                />
                                                <div>
                                                    <div className="flex items-center flex-wrap">
                                                        <div className="flex font-semibold text-sm md:text-base items-center">
                                                            Ghibli
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs md:text-sm text-[#6E6E6E]">
                                                        0x34295...c3b6
                                                        <span>
                                                            <IoCopyOutline />
                                                        </span>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="text-xs text-[#A8A8A8] md:text-sm px-2 whitespace-nowrap">
                                            $4.194K
                                        </td>

                                        <td className="text-xs text-[#A8A8A8] md:text-sm px-2 whitespace-nowrap">
                                            $882K
                                        </td>

                                        <td className="text-xs text-[#A8A8A8] md:text-sm px-2 whitespace-nowrap">
                                            $102.33
                                        </td>
                                        <td className="text-xs text-[#A8A8A8] md:text-sm px-2 text-center whitespace-nowrap">
                                            <RiDeleteBin6Line size={20} color='#ED1B24' />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="py-5 sm:px-5 px-3">
                            <div className="flex gap-2 items-center justify-end">
                                <button
                                    onClick={() => setIsWatchlistPopup(false)}
                                    className="py-2 px-5 border-[1px] border-[#ED1B24] text-[#ED1B24] hover:bg-[#ED1B24] hover:text-[#FFFFFF] rounded-md transition-all duration-500 ease-in-out "
                                >
                                    {accountPopupLng?.watchlist?.Cancel}
                                </button>
                                <button
                                    onClick={() => setIsWatchlistPopup(false)}
                                    className="py-2 px-5 border-[1px] border-[#1F73FC] text-white bg-[#1F73FC] hover:opacity-80 rounded-md transition-all duration-500 ease-in-out "
                                >
                                    {accountPopupLng?.watchlist?.Save}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    )
}

export default Watchlist
