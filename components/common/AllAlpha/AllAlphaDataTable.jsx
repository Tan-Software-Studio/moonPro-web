"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowLeft from "../../../public/assets/AlphaPicks/ArrowLeft.svg";
import ArrowCircleRight from "../../../public/assets/AlphaPicks/ArrowCircleRight.svg";
import alphaPicksSearch from "../../../public/assets/AlphaPicks/alphaPicksSearch.svg";
import alphaPicksFilter from "../../../public/assets/AlphaPicks/alphaPicksFilter.svg";
import Funnel from "../../../public/assets/AlphaPicks/Funnel.svg";
import MagnifyingGlass from "../../../public/assets/AlphaPicks/MagnifyingGlass.svg";
import Infotip from "@/components/common/Tooltip/Infotip.jsx"
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx"

const AllAlphaDataTable = ({ setShowAllAlphaDataTable, allAlpha }) => {
    const filterPopupRef = useRef(null);
    const router = useRouter();
    const filterButtonRef = useRef(null);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

    // alphaFilterData
    const alphaFilterData = ["Time", "Win Rate", "Avg Multiplier", "Social"];
    console.log("🚀 ~ AllAlphaDataTable ~ alphaFilterData:", alphaFilterData);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterPopupRef.current &&
                !filterPopupRef.current.contains(event.target) &&
                filterButtonRef.current &&
                !filterButtonRef.current.contains(event.target)
            ) {
                setIsFilterPopupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="h-screen overflow-auto overflow-y-auto relative">
            {/* Header */}
            <div className="p-6 flex sm:flex-row flex-col sm:justify-between justify-start items-start gap-2 sm:gap-0">
                {/* Alpha Picks details */}
                <div className="flex items-start gap-2">
                    {/* back to all alpha */}
                    <div className="">
                        <button
                            className="px-5 py-2.5 flex gap-2"
                            onClick={() => setShowAllAlphaDataTable(false)}
                        >
                            <Image
                                src={ArrowLeft}
                                alt={ArrowLeft}
                                width={16}
                                height={16}
                            />
                            <span className="text-xs font-normal leading-4 onest text-[#278BFE]">Back</span>
                        </button>
                    </div>

                    <div className="flex gap-2 items-center">
                      <h3 className="font-bold text-[28px] leading-8 font-spaceGrotesk text-white">
                        All Alpha
                      </h3>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6E6E6E]" />
                        <span className="text-[#6E6E6E] text-sm leading-[18px] font-medium">Find the best traders and copy their strategies</span>
                    </div>
                </div>

                {/* Search and filter */}
                <div className="flex flex-row justify-end items-center gap-6">
                    <div className="bg-gradient-to-b from-[#4D4D4D] to-[#1A1A1A] p-[0.5px] rounded-lg w-[256px]">
                        <div className="bg-[#141414] w-full h-full rounded-lg text-white font-normal text-sm leading-[18px] flex justify-start items-center gap-1 py-2.5 px-3">
                            <Image
                                src={MagnifyingGlass}
                                alt="MagnifyingGlass"
                                width={16}
                                height={16}
                            />
                            <input
                                type="text"
                                placeholder="Search"
                                className="outline-none bg-[#141414] placeholder-white"
                            />
                        </div>
                    </div>
                    <div
                        ref={filterButtonRef}
                        className="bg-[#1F73FC] onest rounded-[4px] text-white font-medium text-xs leading-[18px] flex justify-center items-start gap-2 py-2.5 px-5 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFilterPopupOpen((prev) => !prev);
                        }}
                    >
                        <Image
                            src={Funnel}
                            alt="Funnel"
                            width={16}
                            height={16}
                        />
                        <span>Filter</span>
                    </div>
                </div>
            </div>

            {/* table */}
            <div className="px-[200px] mb-20">
                <div className="overflow-x-auto">
                    <div className="w-full border-[#404040] border">
                            {allAlpha?.map((data, index) => (
                                <div
                                    key={index}
                                    className="border-b border-[#404040] grid grid-cols-3 justify-between"
                                >
                                    {/* first */}
                                    <div className="pl-8 pt-4 pb-5 flex items-center">
                                        <div className="flex items-center gap-2.5">
                                            {data?.groupImage ? (
                                                <Image
                                                    src={data?.groupImage}
                                                    alt={data?.channelName || data?.groupName}
                                                    width={34}
                                                    height={34}
                                                    className="rounded-full"
                                                />
                                                ) : (
                                                <p className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg text-black font-bold">
                                                    {data?.channelName?.charAt(0)?.toUpperCase() || data?.groupName?.charAt(0)?.toUpperCase()}
                                                </p>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm leading-[18px] text-white">
                                                    {data?.channelName || data?.groupName}
                                                </span>
                                               <Tooltip body={`The Alpha group admin with the top-performing calls.`}>
                                                    <button
                                                        onClick={() => {
                                                            if (data?.topAdmin?.adminId) {
                                                            router.push(`/caller-profile/${data.topAdmin.adminId}`);
                                                            }
                                                        }}
                                                        className={`font-normal text-xs leading-4 truncate text-[#6E6E6E] 
                                                            ${data?.topAdmin?.adminId ? "hover:underline hover:text-[#1F73FC]" : "pointer-events-none opacity-50"}`}
                                                        >
                                                            {data?.topAdmin?.adminName ? `@ ${data.topAdmin.adminName}` : '-'}
                                                    </button>
                                                </Tooltip>
                                                {/* <span className="rounded w-fit border-[0.7px] border-[#6CC4F4] py-0.5 px-2.5 text-[10px] font-semibold leading-4 text-[#6CC4F4] break-keep text-nowrap">
                                                    {data?.alphaCat}
                                                </span> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* second */}
                                    <div className="py-4">
                                        <div className="grid grid-cols-4 gap-x-8 items-center">
                                            {data?.alphaMainStats?.map((stats, idx) => (
                                                <div key={idx} className="font-medium shrink-0 text-xs flex flex-col items-center leading-4 text-center">
                                                    <div className="flex gap-1 items-center justify-between"> 
                                                        <h3 className="text-[#A8A8A8] text-nowrap">{stats?.title}:</h3>
                                                        <Infotip body={stats?.toolTipString} />
                                                    </div>
                                                    <span className="text-white text-nowrap">{stats?.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    {/* third */}
                                    <div className="pr-8 text-right whitespace-nowrap flex items-center justify-end">
                                         <button
                                            onClick={() => router.push(`/alpha-profile/${data?.channelId || data?.groupId}`)}
                                            className="flex items-center gap-2"
                                            >
                                            <p className="font-normal text-[12px] leading-4 text-[#278BFE]">Details</p>
                                            <Image
                                                src={ArrowCircleRight}
                                                alt={ArrowCircleRight}
                                                width={16}
                                                height={16}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* filter Popup */}
            {isFilterPopupOpen && (
                <div
                    ref={filterPopupRef}
                    className="absolute top-20 right-7 bg-[#1A1A20] border-[0.5px] border-[#3A3A54] rounded-lg p-5 w-56 z-50"
                >
                    {alphaFilterData?.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="flex justify-start items-center gap-2.5 mt-4 first:mt-0"
                            >
                                <input
                                    type="checkbox"
                                    className="bg-[#333946] w-[15px] h-[15px] rounded-sm"
                                />
                                <span className="font-medium text-xs leading-3 text-white">
                                    {item}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllAlphaDataTable;
