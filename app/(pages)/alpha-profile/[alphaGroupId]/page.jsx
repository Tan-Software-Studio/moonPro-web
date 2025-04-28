"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from 'axios';
import Image from "next/image";
import { useAppKitAccount } from '@reown/appkit/react';
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import AlphaFollowButton from "@/components/alphaPicks/AlphaFollowButton"
import { removeAlphaFollowFromDB } from "@/app/redux/alphaFollows/alphaFollowsData.js";
import { formatNumberNoLoop } from "@/utils/calculation";
import { notFound, useRouter } from "next/navigation";

import twitter from "../../../../public/assets/AlphaProfile/twitter.svg";
import telegram from "../../../../public/assets/AlphaProfile/telegram.svg";
import youtube from "../../../../public/assets/AlphaProfile/youtube.svg";
import linkedin from "../../../../public/assets/AlphaProfile/linkedin.svg";
import ArrowDownRight from "../../../../public/assets/AlphaProfile/ArrowDownRight.svg";
import ArrowUpRight from "../../../../public/assets/AlphaProfile/ArrowUpRight.svg";
import UserPlus from "../../../../public/assets/AlphaProfile/UserPlus.svg";
import Share from "../../../../public/assets/AlphaProfile/Share.svg";
import upRightArrow from "../../../../public/assets/AlphaProfile/upRightArrow.svg";
import searchIcon from "../../../../public/assets/AlphaProfile/searchIcon.svg";
import thinDownArrow from "../../../../public/assets/AlphaProfile/thinDownArrow.svg";
import filterIcon from "../../../../public/assets/AlphaProfile/filterIcon.svg";
import faqIcon from "../../../../public/assets/AlphaProfile/faqIcon.svg";
import addDataIcon from "../../../../public/assets/AlphaProfile/addDataIcon.svg";
import exportIcon from "../../../../public/assets/AlphaProfile/exportIcon.svg";
import ArrowRightDarkBlue from "../../../../public/assets/AlphaProfile/ArrowRightDarkBlue.svg";
import fireIcon from "../../../../public/assets/AlphaProfile/fireIcon.png";
import tetherIcon from "../../../../public/assets/AlphaProfile/tetherIcon.png";
import greenUpArrow from "../../../../public/assets/AlphaProfile/greenUpArrow.svg";
import MagnifyingGlass from "../../../../public/assets/AlphaPicks/MagnifyingGlass.svg";
import Funnel from "../../../../public/assets/AlphaPicks/Funnel.svg";

import AlphaProfileTabNavigation from "@/components/common/AlphaProfile/AlphaProfileTabNavigation.jsx";
import TimeIntervalsFilterTabs from "@/components/common/Alpha_TokenCalls/TimeIntervalsFilterTabs";
import CopyButton from "@/components/common/Alpha_TokenCalls/CopyButton";
import AllAlphaDataTable from "@/components/common/AllAlpha/AllAlphaDataTable";
import Infotip from "@/components/common/Tooltip/Infotip.jsx"
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx"

const AlphaProfile = ({params}) => {
    const apiSK = process.env.NEXT_PUBLIC_WAVE_SCAN_ADMIN_SK;
    const waveScanApiUrl = process.env.NEXT_PUBLIC_WAVE_SCAN_BOT_API_URL;
    const router = useRouter();
    const { address } = useAppKitAccount();
    const dispatch = useDispatch();
    const alphaFollow = useSelector((state) => state?.alphaFollowsData?.alphaFollow || []);
    
    const [loadingMainPage, setLoadingMainPage] = useState(true);
    const [foundGroup, setFoundGroup] = useState(true);
    
    const [shownMainStatData, setShownAlphaData] = useState([]);
    const [dailyAlphaData, setDailyAlphaData] = useState([]);
    const [weeklyAlphaData, setWeeklyAlphaData] = useState([]);
    const [monthlyAlphaData, setMonthlyAlphaData] = useState([]);
    const [yearlyAlphaData, setYearlyAlphaData] = useState([]);
    const [allTimeAlphaData, setAllTimeAlphaData] = useState([]);

    const [recentCalls, setRecentCalls] = useState([]);
    const [topAdminSortedCalls, setTopAdminSortedCalls] = useState([]);

    const [topCall, setTopCall] = useState(null);
    
    const [allAdminCallsData, setAllAdminCallsData] = useState([]);
    const [allCallsData, setAllCallsData] = useState([]);
    
    const [activeIntervalAlphaMainStat, setActiveIntervalAlphaMainStat] = useState('ALLTIME');
    const [activeIntervalGraph, setActiveIntervalGraph] = useState('ALLTIME');
    const [activeIntervalTable, setActiveIntervalTable] = useState('ALLTIME');
    const [activeIntervalTopCall, setActiveIntervalTopCall] = useState('ALLTIME');

    const [topCallIsLoading, setTopCallIsLoading] = useState(true);
    
    const [isModalFollowingOpen, setIsModalFollowingOpen] = useState(false);
    
    const [maxGraphValue, setMaxGraphValue] = useState([]);
    const [barGraphDivision, setBarGraphDivision] = useState([]);
    const [performanceOpacities, setPerformanceOpacities] = useState([]);
    const [graphIsLoading, setGraphIsLoading] = useState(true);
    const [graphDataToShow, setGraphDataToShow] = useState(true);

    const [showAdminCallsOnly, setShowAdminCallsOnly] = useState(true);
    const displayAllCalls = showAdminCallsOnly ? allAdminCallsData : allCallsData;
    const [allCallsIsLoading, setAllCallsIsLoading] = useState(true);

    const [tempProfileImage, setTempProfileImage] = useState(``);

    const [tooltip, setTooltip] = useState({ visible: false, value: 0, x: 0, y: 0 });

    const [activeCallsTab, setActiveCallsTab] = useState("All token calls")
    const [activeRecentCallsTab, setActiveRecentCallsTab] = useState("Recent Call")

    const [shareCopied, setShareCopied] = useState(false);

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activeRecentCallsTab, shownMainStatData]); // Runs when the tab changes

    const filterButtonRef = useRef(null);

    const barChartRef = useRef(null);
    const [barChartHeightRef, setBarChartHeightRef] = useState(0);

    const alphaCallsTabs = [
        { name: "All token calls" },
        // { name: "Best winrate" },
        // { name: "Summary" },
      ];

    const handleMainStatIntervalChange = (newInterval) => {
        setActiveIntervalAlphaMainStat(newInterval);
    };

    const handleTopCallIntervalChange = (newInterval) => {
        setActiveIntervalTopCall(newInterval);
        setTopCallIsLoading(true)
    };

    const handleGraphIntervalChange = (newInterval) => {
        setActiveIntervalGraph(newInterval);
        setGraphIsLoading(true);
    }; 

    const handleTableIntervalChange = (newInterval) => {
        setActiveIntervalTable(newInterval);
        setAllCallsIsLoading(true);
    }; 
    
    const timeIntervals = [
        { label: "All", value: "ALLTIME", data: allTimeAlphaData },
        { label: "1D", value: "DAILY", data: dailyAlphaData },
        { label: "7D", value: "WEEKLY", data: weeklyAlphaData },
        { label: "1M", value: "MONTHLY", data: monthlyAlphaData },
    ];

    // Store y position separately to avoid re-rendering
    const handleMouseEnter = useCallback((event, value) => {
        const barY = event.currentTarget.getBoundingClientRect().top + window.scrollY;
        setTooltip((prev) => ({
            visible: true,
            value,
            x: event.clientX, // Track X only
            y: barY // Snap Y once
        }));
    }, []);

    const handleMouseMove = useCallback((event) => {
        setTooltip((prev) => ({
            ...prev,
            x: event.clientX // Only update X-axis, preventing unnecessary state updates
        }));
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTooltip({ visible: false, value: 0, x: 0, y: 0 });
    }, []);

    useEffect(() => {
        const fetchAlphaData = async () => {
            const apiUrl = `https://wave-scan-test-cebad401b8f2.herokuapp.com/getAlphaStats`;
            const intervals = ["ALLTIME", "DAILY", "WEEKLY", "MONTHLY"];
    
            try {
                for (const interval of intervals) {
                    const apiParams = {
                        "securityKey": apiSK,
                        "intervalType": interval,
                        "alphaGroupId": `${params.alphaGroupId}`
                    }
    
                    const response = await axios.get(apiUrl, { params: apiParams });
                    
                    if (interval === "ALLTIME") {
                        setShownAlphaData(response.data.alphaStat);
                        setAllTimeAlphaData(response.data.alphaStat);
                        setLoadingMainPage(false);
                    } else if (interval === "DAILY") {
                        setDailyAlphaData(response.data.alphaStat);
                    } else if (interval === "WEEKLY") {
                        setWeeklyAlphaData(response.data.alphaStat);
                    } else if (interval === "MONTHLY") {
                        setMonthlyAlphaData(response.data.alphaStat);
                    } 
                }
            } catch (error) {
                console.error('Failed to fetch alpha data', error);
                setFoundGroup(false);
            }
        };
    
        fetchAlphaData(); // Fetch in the background
        const randomIndex = Math.floor(Math.random() * 18) + 1;
        setTempProfileImage(`/assets/temporaryProfileImages/tempProfileImage_${randomIndex}.png`);
    }, []);

    useEffect(() => {
        if (!shownMainStatData || shownMainStatData.length === 0) return;

        if (recentCalls?.length === 0) {
            const recentCalls = shownMainStatData?.allCalls || [];
            const last20Calls = recentCalls.slice(-20).reverse();
            setRecentCalls(last20Calls);
        }

        const bestAdminCall = shownMainStatData?.topAdmin?.topAdminCalls
        ?.reduce((max, curr) => (curr.performance > max.performance ? curr : max));

        setTopCall(bestAdminCall ? bestAdminCall : null);
        if (barChartRef.current) {
            setBarChartHeightRef(barChartRef.current.clientHeight);
        }
    }, [shownMainStatData]);

    useEffect(() => {
        const newShowTimeData = activeIntervalAlphaMainStat;
        if (newShowTimeData === "DAILY") {
        setShownAlphaData(dailyAlphaData);
        } else if (newShowTimeData === "WEEKLY") {
        setShownAlphaData(weeklyAlphaData);
        } else if (newShowTimeData === "MONTHLY") {
        setShownAlphaData(monthlyAlphaData);
        } else if (newShowTimeData === "YEARLY") {
        setShownAlphaData(yearlyAlphaData);
        } else if (newShowTimeData === "ALLTIME") {
        setShownAlphaData(allTimeAlphaData);
        }
    }, [activeIntervalAlphaMainStat]);

    useEffect(() => {
        if (!foundGroup) notFound();
    }, [foundGroup]);

    useEffect(() => {
        const newShowTimeData = activeIntervalTopCall;
        let dataToShow = null;
    
        if (newShowTimeData === "DAILY") {
            dataToShow = dailyAlphaData;
        } else if (newShowTimeData === "WEEKLY") {
            dataToShow = weeklyAlphaData;
        } else if (newShowTimeData === "MONTHLY") {
            dataToShow = monthlyAlphaData;
        } else if (newShowTimeData === "YEARLY") {
            dataToShow = yearlyAlphaData;
        } else if (newShowTimeData === "ALLTIME") {
            dataToShow = allTimeAlphaData;
        }
    
        if (!dataToShow) return; // ⛔ Don’t run if no data
    
        const sortedAdminCalls = dataToShow?.topAdmin?.topAdminCalls
            ?.sort((a, b) => b.performance - a.performance)
            ?.slice(0, 20);
    
        setTopAdminSortedCalls(sortedAdminCalls);
        setTopCallIsLoading(false);
    
    }, [
        activeIntervalTopCall,
        dailyAlphaData,
        weeklyAlphaData,
        monthlyAlphaData,
        yearlyAlphaData,
        allTimeAlphaData
    ]);

    useEffect(() => {
        const newShowTimeData = activeIntervalGraph;
        let dataToShow = null;
    
        if (newShowTimeData === "DAILY") {
            dataToShow = dailyAlphaData;
        } else if (newShowTimeData === "WEEKLY") {
            dataToShow = weeklyAlphaData;
        } else if (newShowTimeData === "MONTHLY") {
            dataToShow = monthlyAlphaData;
        } else if (newShowTimeData === "YEARLY") {
            dataToShow = yearlyAlphaData;
        } else if (newShowTimeData === "ALLTIME") {
            dataToShow = allTimeAlphaData;
        }
    
        if (!dataToShow) return; // ⛔ Don’t run if no data
        setGraphDataToShow(dataToShow);
         // Compute the max value before setting it
         const newMaxGraphValue = getHighestPerformanceCount(dataToShow?.topAdmin?.performanceCounts);
         setPerformanceOpacities(getPerformanceOpacities(dataToShow?.topAdmin?.performanceCounts));
         
         if (newMaxGraphValue !== maxGraphValue) {
             setMaxGraphValue(newMaxGraphValue);
             setBarGraphDivision(getDivisibleValue(newMaxGraphValue));
             setGraphIsLoading(false);
         }
    }, [
        activeIntervalGraph,
        dailyAlphaData,
        weeklyAlphaData,
        monthlyAlphaData,
        yearlyAlphaData,
        allTimeAlphaData
    ]);

    useEffect(() => {
        const newShowTimeData = activeIntervalTable;
        let dataToShow = null;
    
        if (newShowTimeData === "DAILY") {
            dataToShow = dailyAlphaData;
        } else if (newShowTimeData === "WEEKLY") {
            dataToShow = weeklyAlphaData;
        } else if (newShowTimeData === "MONTHLY") {
            dataToShow = monthlyAlphaData;
        } else if (newShowTimeData === "YEARLY") {
            dataToShow = yearlyAlphaData;
        } else if (newShowTimeData === "ALLTIME") {
            dataToShow = allTimeAlphaData;
        }
    
        if (!dataToShow) return; // ⛔ Don’t run if no data
        const adminCalls = [...(dataToShow?.allCalls?.filter(call => call.isAdmin) || [])].reverse();
        setAllAdminCallsData(adminCalls);
        setAllCallsData(dataToShow?.allCalls);
        setAllCallsIsLoading(false);
    }, [
        activeIntervalTable,
        dailyAlphaData,
        weeklyAlphaData,
        monthlyAlphaData,
        yearlyAlphaData,
        allTimeAlphaData
    ]);

    const noCallsFoundMessage = (timeInterval) => {
        switch (timeInterval) {
            case 'ALLTIME':
                return 'No calls avaiable in Alpha Group';
            case 'DAILY':
                return 'No calls avaiable in 1 day';
            case 'WEEKLY':
                return 'No calls avaiable in 7 days';
            case 'MONTHLY':
                return 'No calls avaiable in 1 month';
        }
    }

    const performanceRanges = [
        { key: "count1dot5xAbove", label: "≥ 1.5x" },
        { key: "count2xAbove", label: "≥ 2x" },
        { key: "count3xAbove", label: "≥ 3x" },
        { key: "count5xAbove", label: "≥ 5x" },
        { key: "count10xAbove", label: "≥ 10x" },

        { key: "count20xAbove", label: "≥ 20x" },
        { key: "count30xAbove", label: "≥ 30x" },
        { key: "count50xAbove", label: "≥ 50x" },
        { key: "count100xAbove", label: "≥ 100x" },
        { key: "count200xAbove", label: "≥ 200x" },
    ];

     const handleConfirmUnfollow = () => {
        if (shownMainStatData) {
          dispatch(removeAlphaFollowFromDB({
            walletAddress: address,
            alphaGroupId: shownMainStatData?.chatType === "channel"
                ? shownMainStatData?.channelId
                : shownMainStatData?.groupId,
            alphaGroupChatType: shownMainStatData?.chatType
          })); // Dispatch Redux action
          setIsModalFollowingOpen(false);
        }
      };

      const getHighestPerformanceCount = (performanceCounts) => {
        if (!performanceCounts || typeof performanceCounts !== 'object') {
            return 0;
        }
      
        let highestKey = null;
        let highestValue = -Infinity;
      
        Object.entries(performanceCounts).forEach(([key, value]) => {
          if (value > highestValue) {
            highestValue = value;
            highestKey = key;
          }
        });
      
        return highestValue;
      }

      const readableTimeInterval = (timeInterval) => {
        switch (timeInterval) {
            case 'ALLTIME':
                return 'All time';
            case 'DAILY':
                return '24H';
            case 'WEEKLY':
                return '7D';
            case 'MONTHLY':
                return '30D';
        }
      }

      const getPerformanceOpacities = (performanceCounts) => {
        if (!performanceCounts || typeof performanceCounts !== 'object') {
            return {};
        }

        const sortedEntries = Object.entries(performanceCounts)
            .sort(([, a], [, b]) => b - a); // Sort descending by value

        let rankOpacity = { 1: 1, 2: 0.75, 3: 0.55 }; // Opacity mapping for top 3 ranks
        let lastOpacity = 0.3; // Default opacity for the rest
        let rankMap = new Map(); // Stores rank based on values

        let rank = 1; // Start ranking from 1
        let prevValue = null;

        sortedEntries.forEach(([key, value], index) => {
            if (value !== prevValue) {
                rank = index + 1; // Update rank only when value changes
            }
            prevValue = value;
            rankMap.set(key, rank);
        });

        // Assign opacities based on rank
        return Object.fromEntries(
            Object.entries(performanceCounts).map(([key, value]) => {
                const rank = rankMap.get(key);
                return [key, rankOpacity[rank] || lastOpacity];
            })
        );
    };

      const getDivisibleValue = (maxValue) => {
        if (maxValue === 0) {
            return [1];
        }
        const priorities = [8, 9, 7, 6, 5, 4, 3, 2, 1];
        let divisibleValues = [];
      
        for (let num of priorities) {
          if (maxValue % num === 0) {
            let step = maxValue / num;
            divisibleValues = Array.from({ length: num }, (_, i) => maxValue - i * step).reverse();
            break;
          }
        }
        
        return divisibleValues;
      }

      const handleShareCopy = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2000);
        });
      };
return (
    <>
    {loadingMainPage ? (
        <div className="h-screen w-full flex items-center justify-center">
            <div
            class="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full"
            >
            <div
                class="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"
            ></div>
            </div>
      </div>
      ) : (
        <>
            <div className="h-screen flex flex-col">
                {/* Header */}
                <div className="flex justify-between py-6 items-center border-b border-[#404040]">
                    
                    {/* Left Side */}
                    <div className="xl:w-[67%] w-full xl:pl-6 px-6 flex justify-start items-center gap-8">
                        {/* Group Image */}
                        <div className="h-[72px] w-[72px] rounded-lg p-0.5 bg-gradient-to-b from-[#1F73FC] via-[#B9DEFF] to-[#4FAFFE] shrink-0 ">
                            <Image
                                src={shownMainStatData?.groupImage || tempProfileImage}
                                alt="Group Image"
                                width={110}
                                height={110}
                                className="w-full h-full rounded-lg"
                            />
                        </div>
                        {/* Social Info */}
                        <div className="flex flex-col shrink-0 py-0.5">
                            <div className="flex gap-2 onest w-full">
                                <p className="font-bold text-lg leading-6">{shownMainStatData?.groupName || "Group Name"}</p>
                                <div className="h-full justify-center items-center rounded-[4px] py-1 px-2 text-[10px] font-normal flex-shrink-0 whitespace-nowrap leading-4 text-white bg-[#133D94]">
                                    Alpha Group
                                </div>
                            </div>
                            <div className="flex gap-2 onest text-[#A8A8A8] font-normal text-xs leading-4 items-center">
                                {shownMainStatData?.topAdmin?.adminName &&
                                    <>
                                        <button
                                            onClick={() => router.push(`/caller-profile/${shownMainStatData?.topAdmin?.adminId}`)}
                                            className="hover:underline"
                                        >
                                            @{shownMainStatData?.topAdmin?.adminName}
                                        </button>
                                        <div className="w-1 h-1 rounded-full bg-[#A8A8A8]" />
                                    </>
                                }
                                <p>5.3k followers</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button>
                                    <Image 
                                        src={twitter}
                                        alt={'Twitter Logo'}
                                        width={20}
                                        height={20}
                                    />
                                </button>

                                <button>
                                    <Image 
                                        src={linkedin}
                                        alt={'LinkedIn Logo'}
                                        width={20}
                                        height={20}
                                    />
                                </button>

                                {shownMainStatData?.inviteLink &&
                                    <a href={shownMainStatData?.inviteLink} target="_blank" rel="noopener noreferrer">                                        <Image 
                                            src={telegram}
                                            alt={'Telegram Logo'}
                                            width={20}
                                            height={20}
                                        />
                                    </a>
                                }

                                <button>
                                    <Image 
                                        src={youtube}
                                        alt={'Youtube Logo'}
                                        width={20}
                                        height={20}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="h-16 w-[1px] py-1 bg-[#404040] shrink-0" />

                        {/* Ranking */}
                        <div className="flex items-center justify-center flex-col shrink-0">
                            <div className="flex gap-1 items-center">
                                <p className="font-normal text-xs leading-4 onest">Ranking</p>
                                <Infotip body={`Rank based on performance in ${readableTimeInterval(activeIntervalAlphaMainStat)}`} />
                            </div>
                            <p className="font-spaceGrotesk font-bold text-4xl leading-[44px]">#{shownMainStatData?.rank}</p>
                        </div>

                        <div className="h-16 w-[1px] py-1 bg-[#404040] shrink-0" />

                        <div className="flex justify-between w-full">
                            <div className="flex flex-col items-center gap-1 py-4 onest">
                                <div className="flex gap-1 items-center">
                                    <p className=" font-normal text-xs leading-4">Calls</p>
                                    <Infotip body={`Total Calls made in ${readableTimeInterval(activeIntervalAlphaMainStat)}`} />
                                </div>
                                <div className="flex gap-[5px]">
                                    <div className="rounded-[4px] w-4 h-4 flex items-center justify-center bg-[#21CB6B52] shrink-0">
                                        <Image 
                                            src={ArrowUpRight}
                                            alt={'Gain Lose Arrow Icon'}
                                            width={12}
                                            height={12}
                                        />
                                    </div>
                                    <p className="font-bold text-base leading-5">{shownMainStatData?.topAdmin?.callsCount || 0}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-1 py-4 onest">
                                <div className="flex gap-1 items-center">
                                    <p className="font-normal text-xs leading-4">Top Call</p>
                                    <Infotip body={`Highest performance call in ${readableTimeInterval(activeIntervalAlphaMainStat)}`} />
                                </div>
                                <div className="flex gap-[5px]">
                                    <div className="rounded-[4px] w-4 h-4 flex items-center justify-center bg-[#21CB6B52] shrink-0">
                                        <Image 
                                            src={ArrowUpRight}
                                            alt={'Gain Lose Arrow Icon'}
                                            width={12}
                                            height={12}
                                        />
                                    </div>
                                    <p className="font-bold text-base leading-5">{formatNumberNoLoop(topCall?.performance)}x</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-1 py-4 onest">
                                <div className="flex gap-1 items-center">
                                    <p className=" font-normal text-xs leading-4">Win rate</p>
                                    <Infotip body={`Percentage of calls that reached 2x gains or more in ${readableTimeInterval(activeIntervalAlphaMainStat)}`} />
                                </div>
                                <div className="flex gap-[5px]">
                                    <div className="rounded-[4px] w-4 h-4 flex items-center justify-center bg-[#21CB6B52] shrink-0">
                                        <Image 
                                            src={ArrowUpRight}
                                            alt={'Gain Lose Arrow Icon'}
                                            width={12}
                                            height={12}
                                        />
                                    </div>
                                    <p className="font-bold text-base leading-5">{shownMainStatData?.topAdmin?.winRate?.toFixed(2) || 0}%</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-1 py-4 onest">
                                <div className="flex gap-1 items-center">
                                    <p className=" font-normal text-xs leading-4">Average Gain</p>
                                    <Infotip body={`Average gains from all calls in ${readableTimeInterval(activeIntervalAlphaMainStat)}`} />
                                </div>
                                <div className="flex gap-[5px]">
                                    <div className="rounded-[4px] w-4 h-4 flex items-center justify-center bg-[#21CB6B52] shrink-0">
                                        <Image 
                                            src={ArrowUpRight}
                                            alt={'Gain Lose Arrow Icon'}
                                            width={12}
                                            height={12}
                                        />
                                    </div>
                                    <p className="font-bold text-base leading-5">{formatNumberNoLoop(shownMainStatData?.topAdmin?.averagePerformance)}x</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="xl:w-[37%] w-full xl:pr-6 px-6 flex justify-end items-center gap-4">
                        {/* Time Filters */}
                        <TimeIntervalsFilterTabs
                            intervals={timeIntervals}
                            selectedInterval={activeIntervalAlphaMainStat}
                            onChange={handleMainStatIntervalChange}
                        />
                        <AlphaFollowButton  
                            groupParams={{
                            walletAddress: address,
                            alphaGroupId: shownMainStatData?.chatType === "channel"
                                ? shownMainStatData?.channelId
                                : shownMainStatData?.groupId,
                            alphaGroupChatType: shownMainStatData?.chatType
                            }} 
                            isFollowing={Array.isArray(alphaFollow) && alphaFollow.some((g) => g.groupType === 'channel' ? g.channelId === shownMainStatData?.channelId : g.groupId === shownMainStatData?.groupId)}
                            onUnfollow={() => {
                                setIsModalFollowingOpen(true);
                            }}
                            baseClass="px-5 py-2.5 flex gap-2 items-center rounded-[4px] onest font-normal text-sm leading-4"
                            bgFollowColor="border border-[#1F73FC] hover:bg-[#11265B] text-[#1F73FC] ease-in-out duration-200"
                            bgUnFollowColor="bg-[#1F73FC] text-white"
                        />
                        <button 
                            onClick={() => {handleShareCopy()}}
                            className={`flex gap-2 items-center justify-center px-[29.5px] py-2.5 rounded-[4px] ${shareCopied ? 'pointer-events-none bg-[#333333]' : 'bg-[#1F73FC] hover:bg-[#0E43BD] ease-out transition-colors duration-200' }`}
                        >
                            <p className="onest font-normal text-sm leading-4 text-[#F6F6F6]">{shareCopied ? "Copied!" : "Share"}</p>
                            <Image
                                src={Share}
                                alt={'Share Icon'}
                                width={16}
                                height={16}
                            />
                        </button>
                    </div>
                </div>
                <div className="flex xl:flex-row flex-col xl:justify-between justify-center items-start">
                    {/* left side */}
                    <div className="xl:w-[67%] w-full xl:border-r border-[#4B4B4B]">
                        {/* Bar Graph */}
                        <div ref={barChartRef} className="p-6 flex flex-col gap-1 border-b border-[#404040]">
                            <div className="w-fit ml-auto">
                                <TimeIntervalsFilterTabs
                                    intervals={timeIntervals}
                                    selectedInterval={activeIntervalGraph}
                                    onChange={handleGraphIntervalChange}
                                />
                            </div>
                            <div className="flex gap-5">
                                <div className="flex flex-col">
                                    {performanceRanges.slice().reverse().map((performance, index) => (
                                        <div
                                            key={index}
                                            className={`h-[26px] font-normal text-xs leading-6 flex items-center justify-end text-nowrap`}
                                        >
                                            {performance.label}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-[3px] w-full">
                                <div className="w-full border-l border-b relative border-[#494949]">
                                        {performanceRanges.slice().reverse().map((performanceRow, index) => {
                                            const value = graphDataToShow?.topAdmin?.performanceCounts?.[performanceRow?.key] || 0;
                                            const barWidth = maxGraphValue ? (value / maxGraphValue) * 100 : 0;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`h-[26px] flex items-center justify-start relative`}
                                                >
                                                    <div
                                                        className={`h-3 rounded-r-[4px] bg-green-500 transition-all duration-300 ease-in-out relative`}
                                                        style={{ 
                                                            width: maxGraphValue ? `calc(${barWidth}%)` : "0%", 
                                                            opacity: performanceOpacities?.[performanceRow?.key]
                                                        }}
                                                        onMouseEnter={(e) => handleMouseEnter(e, value)}
                                                        onMouseMove={handleMouseMove}
                                                        onMouseLeave={handleMouseLeave}
                                                    />
                                                </div>
                                            );
                                        })}
                                        {!graphIsLoading && maxGraphValue === 0 &&
                                            <div className="inset-0 absolute flex items-center justify-center trans">
                                                <p className="text-[#6E6E6E]">{noCallsFoundMessage(activeIntervalGraph)}</p>
                                            </div>
                                        }

                                        {/* Tooltip */}
                                        {tooltip.visible && (
                                            <div
                                                className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity duration-200"
                                                style={{
                                                    top: `${tooltip.y}px`, // Fixed Y position (snaps to bar)
                                                    left: `${tooltip.x + 10}px`, // Moves only on X-axis
                                                    transform: "translateY(-50%)",
                                                    position: "fixed"
                                                }}
                                            >
                                                {tooltip.value}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex onest font-normal text-xs leading-4 text-white">
                                        {barGraphDivision.map((divisionNumber, index) => (
                                            <div key={index} className={`flex flex-1 ${index === 0 ? `justify-between` : `justify-end`}`}>
                                                {index === 0 && <p>0</p>}
                                                <p>{divisionNumber}</p>
                                            </div>
                                        ))}
                                    </div> 
                                </div>
                            </div>
                            
                        </div>
                        {/* All Token Calls */}
                        <div className="mb-10">
                            <AlphaProfileTabNavigation
                                tabList={alphaCallsTabs}
                                activeTab={activeCallsTab}
                                setActiveTab={setActiveCallsTab}
                            />
                            <div className="w-full px-6 py-4">
                                {/* Header */}
                                <div className="flex justify-between">
                                    {/* Left Side */}
                                    <div className="flex gap-[11px] items-center">
                                        {/* Search Bar */}
                                        <div className="bg-gradient-to-b from-[#4D4D4D] to-[#1A1A1A] p-[0.5px] rounded-lg w-[569px]">
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

                                        {/* Filter */}
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

                                        <TimeIntervalsFilterTabs
                                            intervals={timeIntervals}
                                            selectedInterval={activeIntervalTable}
                                            onChange={handleTableIntervalChange}
                                        />

                                        <div className="flex gap-2 items-center">
                                            <div class="flex justify-center items-center">
                                                <label class="container flex items-center">
                                                    <input
                                                        value="wedding-gift"
                                                        class="peer cursor-pointer hidden after:opacity-100"
                                                        checked={showAdminCallsOnly}
                                                        type="checkbox"
                                                        onChange={() => setShowAdminCallsOnly((prev) => !prev)}
                                                    />
                                                    <span
                                                    class="inline-block w-5 h-5 border-2 relative cursor-pointer after:content-[''] after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[10px] after:h-[10px] after:bg-[#278BFE] after:rounded-[2px] after:opacity-0 peer-checked:after:opacity-100"
                                                    ></span>
                                                </label>
                                            </div>
                                            <Tooltip body={'Displays only the calls made by admins from this alpha group.'}>
                                                <p className="text-xs leading-4">Admin Calls Only</p>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {/* Right Side */}
                                    <button className="flex items-center justify-center gap-2 py-2.5 px-5">
                                        <Image
                                            src={exportIcon}
                                            alt="Export Icon"
                                            width={16}
                                            height={16}
                                        />
                                        <p className="onest font-normal text-xs leading-4 ">Export</p>
                                    </button>
                                </div>
                                {displayAllCalls?.length > 0 ?
                                    <>
                                        {/* Table Header */}
                                        <div className="mt-4 grid grid-cols-[0.25fr_1.25fr_1fr_1.5fr_0.5fr_0.75fr_0.75fr_0.75fr] w-full justify-between font-bold text-xs leading-4 onest text-[#A8A8A8]">
                                            <p>#</p>
                                            <p>Symbol</p> 
                                            <p>Token Address</p>
                                            <p>Caller</p>
                                            <p>Admin</p>
                                            <div className="flex gap-1 items-center">
                                                <p>Called at</p>
                                                <Infotip body={'Shows the market cap of the token at the time it was called.'}/>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <p>Reached at</p>
                                                <Infotip body={'Displays the all-time high (ATH) the token reached after the call.'} />
                                            </div>
                                            <p>Gains</p>
                                        </div>
                                        {/* Table Items */}
                                        <div className="flex h-[421px] flex-col overflow-y-scroll overflow-hidden">
                                            {displayAllCalls.map((call, index) => (
                                                <div key={index} className="grid grid-cols-[0.25fr_1.25fr_1fr_1.5fr_0.5fr_0.75fr_0.75fr_0.75fr] w-full justify-between onest text-xs leading-4 py-2 border-b border-[#404040]">
                                                    <p className="flex">{index + 1}</p>
                                                    <button
                                                        onClick={() => router.push(`/tradingview/solana?tokenaddress=${call?.tokenAddress}&symbol=${call?.tokenSymbol}`)}
                                                        className="flex hover:underline"
                                                    >
                                                        {call?.tokenSymbol?.toUpperCase()}
                                                    </button>
                                                    <div className="flex items-center gap-2"> 
                                                        <button
                                                            onClick={() => router.push(`/tradingview/solana?tokenaddress=${call?.tokenAddress}&symbol=${call?.tokenSymbol}`)} 
                                                            className="flex justify-center hover:underline"
                                                        >
                                                            {call?.tokenAddress?.slice(0, 4) + "..." + call?.tokenAddress?.slice(-4)}
                                                        </button>
                                                        <CopyButton textToCopy={call?.tokenAddress} imageSize={16} />
                                                    </div>                                            <button
                                                        onClick={() => router.push(`/caller-profile/${call?.userId}`)}
                                                        className="flex hover:underline hover:cursor-pointer"
                                                    >
                                                        {call?.userName}
                                                    </button>
                                                    <p className="flex">{call?.isAdmin === true ? 'Yes' : 'No'}</p>
                                                    <p className="flex">${formatNumberNoLoop(call?.mc)}</p>
                                                    <p className="flex">${formatNumberNoLoop(call?.athPostCallMc)}</p>
                                                    <p className="flex">x{formatNumberNoLoop(call?.performance)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>   
                                :
                                    (!allCallsIsLoading &&
                                        <div className="w-full mt-40 flex items-center justify-center text-[#6E6E6E]">
                                            <p>{noCallsFoundMessage(activeIntervalTable)}</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* right side */}
                    <div className="xl:w-[37%] w-full flex flex-col overflow-y-auto pb-16" style={{height: `calc(100vh - 144px)`}}>
                        {/* Recent / Top Call */}
                        <div className="border-b border-[#404040]" style={{height: barChartHeightRef}}>
                            {/* Toggle Active */}
                            <div className="px-6 pt-6 w-full font-normal text-sm leading-[18px] onest rounded-lg overflow-hidden flex text-[#6E6E6E]" >
                                <button
                                    onClick={() => setActiveRecentCallsTab('Recent Call')}
                                    className={`w-full flex justify-center items-center py-3 rounded-lg ${activeRecentCallsTab === 'Recent Call' && `bg-[#1F73FC] text-[#F6F6F6]`}`}
                                >
                                    Recent Calls
                                </button>
                                <button
                                    onClick={() => setActiveRecentCallsTab('Top Call')}
                                    className={`w-full gap-4 flex justify-center items-center rounded-lg ${activeRecentCallsTab === 'Top Call' ? `bg-[#1F73FC] text-[#F6F6F6] py-0.5` : `py-3`}`}
                                >
                                    <p>Top Calls</p>
                                    {activeRecentCallsTab === 'Top Call' &&
                                        <TimeIntervalsFilterTabs
                                            intervals={timeIntervals}
                                            selectedInterval={activeIntervalTopCall}
                                            onChange={handleTopCallIntervalChange}
                                        />
                                    }
                                </button>
                            </div>

                            {/* Array Calls */}
                            <div className="p-6 overflow-hidden onest" style={{height: barChartHeightRef - 66}}>
                                <div className="h-full flex flex-col gap-4 overflow-hidden overflow-y-scroll">
                                    <div ref={scrollContainerRef} className="flex flex-col gap-4 h-full overflow-y-scroll">
                                        {activeRecentCallsTab === 'Recent Call' &&
                                            recentCalls.map((call, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <p className="font-normal text-base leading-5 text-[#4D4D4D] w-12">#{index + 1}</p>
                                                    <div className="bg-[#D9D9D9] w-[38px] h-[38px] shrink-0 rounded-[4px] overflow-hidden">
                                                        {call?.tokenImage &&
                                                            <img 
                                                                src={call?.tokenImage} 
                                                                alt="Token Image" 
                                                                width={38} 
                                                                height={38} 
                                                                className="h-full w-full shrink-0" 
                                                                loading="lazy" 
                                                                decoding="async"
                                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                                            />
                                                        }                                                    
                                                    </div>
                                                    <div className="flex flex-col gap-1 onest text-[#F6F6F6] w-full">
                                                        {/* Top */}
                                                        <div className="flex items-center w-full justify-between">
                                                            <div className="flex items-center">
                                                                <p className="font-medium text-sm leading-[18px] flex items-center">
                                                                    {call?.tokenSymbol}
                                                                    <span className="text-[#6E6E6E] text-xs leading-4 font-medium mx-0.5 truncate overflow-hidden text-ellipsis">
                                                                        {`/ ${call?.tokenName}`}
                                                                    </span>
                                                                </p>
                                                                <CopyButton textToCopy={call?.tokenAddress} imageSize={16} />
                                                            </div>

                                                            <p className="text-[#21CB6B] font-medium text-sm leading-[18px]">
                                                               +{formatNumberNoLoop(call?.performance || 0)}x
                                                            </p>
                                                        </div>
                        
                                                        {/* Bottom */}
                                                        <div className="flex gap-2">
                                                            <p className="text-[#6E6E6E] text-sm leading-[18px] font-normal">{call?.tokenAddress?.slice(0, 11) + "..." + call?.tokenAddress?.slice(-4)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {activeRecentCallsTab === 'Top Call' && (
                                            topAdminSortedCalls?.length > 0 ? (
                                                topAdminSortedCalls?.map((call, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <p className="font-normal text-base leading-5 text-[#4D4D4D] w-12">#{index + 1}</p>
                                                        <div className="bg-[#D9D9D9] w-[38px] h-[38px] shrink-0 rounded-[4px] overflow-hidden">
                                                            {call?.tokenImage &&
                                                                <img 
                                                                    src={call?.tokenImage} 
                                                                    alt="Token Image" 
                                                                    width={38} 
                                                                    height={38} 
                                                                    className="h-full w-full shrink-0" 
                                                                    loading="lazy" 
                                                                    decoding="async"
                                                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                                                />
                                                            }                                                    
                                                        </div>
                                                        <div className="flex flex-col gap-1 onest text-[#F6F6F6] w-full">
                                                            {/* Top */}
                                                            <div className="flex items-center w-full justify-between">
                                                                <div className="flex items-center">
                                                                    <p className="font-medium text-sm leading-[18px] flex items-center">
                                                                        {call?.tokenSymbol}
                                                                        <span className="text-[#6E6E6E] text-xs leading-4 font-medium mx-0.5 truncate overflow-hidden text-ellipsis">
                                                                            {`/ ${call?.tokenName}`}
                                                                        </span>
                                                                    </p>
                                                                    <CopyButton textToCopy={call?.tokenAddress} imageSize={16} />
                                                                </div>

                                                                <p className="text-[#21CB6B] font-medium text-sm leading-[18px]">
                                                                +{formatNumberNoLoop(call?.performance || 0)}x
                                                                </p>
                                                            </div>
                            
                                                            {/* Bottom */}
                                                            <div className="flex gap-2">
                                                                <p className="text-[#6E6E6E] text-sm leading-[18px] font-normal">{call?.tokenAddress?.slice(0, 11) + "..." + call?.tokenAddress?.slice(-4)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                (!topCallIsLoading &&
                                                    <div className="w-full h-full flex items-center justify-center text-[#6E6E6E]">
                                                        <p>{noCallsFoundMessage(activeIntervalTopCall)}</p>
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Wave / Ads Banner*/}
                        <div className="border-b border-[#404040] p-6">
                            <div className="flex items-center justify-center w-full h-[356px] bg-white text-black rounded-lg font-spaceGrotesk">
                                <p className="font-bold text-[40px] leading-[44px] text-center">Wave<br/>Banner/<br/>Ads Banner</p>
                            </div>
                        </div>

                        {/* Booseted Alphas */}
                        <div className="px-6 onest">
                            <h3 className="py-6 font-normal text-[22px] leading-7 text-white">
                                Boosted Alphas
                            </h3>
                            <div>
                            {/* if empty show contact us button */}
                            <button className="font-normal w-full rounded-lg py-2.5 flex items-center justify-center gap-2 border border-[#278BFE] text-[#278BFE] hover:text-black hover:bg-[#278BFE] transition-colors ease-in-out delay-200">
                                <p>Contact us</p>
                                <Image
                                    src={ArrowRightDarkBlue}
                                    alt={'ArrowRightDarkBlue'}
                                    width={16}
                                    height={16}
                                /> 
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Following Modal */}
            <Modal
                isOpen={isModalFollowingOpen}
                onRequestClose={() => setIsModalFollowingOpen(false)}
                className="bg-[#16171D] p-6 rounded-lg shadow-lg w-80 mx-auto mt-20 absolute z-[1000] text-white"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
            >
                <h2 className="text-lg font-semibold mb-4">Confirm Unfollow</h2>
                <p>Are you sure you want to unfollow?</p>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        className="font-semibold rounded py-2 px-8 shrink-0 border-[0.77px] border-[#278BFE] text-white hover:text-black bg-black/25 hover:bg-[#278BFE] transition-colors ease-in-out delay-200"
                        onClick={() => setIsModalFollowingOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="border-red-500 text-white rounded py-2 px-8 shrink-0 bg-red-500 hover:bg-red-700 hover:text-black transition-colors ease-in-out delay-200"
                        onClick={() => handleConfirmUnfollow()}
                    >
                        Unfollow
                    </button>
                </div>
            </Modal>
        </>
      )
  }
  </>
  )
}

export default AlphaProfile