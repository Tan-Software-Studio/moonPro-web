"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";

import { alphaPicks } from "@/app/Images";
import AlphaPicksHeader from "../../../public/assets/AlphaPicks/AlphaPicksHeader.svg";
import { formatNumberNoLoop, getTimeAgo } from "@/utils/calculation";
import calls from "../../../public/assets/AlphaPicks/calls.svg";
import star from "../../../public/assets/AlphaPicks/Star.svg";
import ArrowsClockwise from "../../../public/assets/AlphaPicks/ArrowsClockwise.svg";
import ChartLineUp from "../../../public/assets/AlphaPicks/ChartLineUp.svg";
import ChartBar from "../../../public/assets/AlphaPicks/ChartBar.svg";
import firstRankBadge from "../../../public/assets/AlphaPicks/firstRankBadge.png";
import secondRankBadge from "../../../public/assets/AlphaPicks/secondRankBadge.png";
import thirdRankBadge from "../../../public/assets/AlphaPicks/thirdRankBadge.png";
import forthRankBadge from "../../../public/assets/AlphaPicks/forthRankBadge.png";
import ArrowCircleRight from "../../../public/assets/AlphaPicks/ArrowCircleRight.svg";
import ArrowRight from "../../../public/assets/AlphaPicks/ArrowRight.svg";
import Users from "../../../public/assets/AlphaPicks/Users.svg";

import AllAlphaDataTable from "@/components/common/AllAlpha/AllAlphaDataTable";
import AlphaFollowButton from "@/components/alphaPicks/AlphaFollowButton";
import TimeIntervalsFilterTabs from "@/components/common/Alpha_TokenCalls/TimeIntervalsFilterTabs";
import { removeAlphaFollowFromDB } from "@/app/redux/alphaFollows/alphaFollowsData.js";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";

// import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

const AlphaPicks = () => {
  const { t, ready } = useTranslation();
  const alphapicksPage = t("alphapicks");
  const apiSK = process.env.NEXT_PUBLIC_WAVE_SCAN_ADMIN_SK;
  const waveScanApiUrl = process.env.NEXT_PUBLIC_WAVE_SCAN_BOT_API_URL;

  const top3ParentDivRef = useRef(null);
  const [top3ParentDivHeight, setTop3ParentDivHeight] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const alphaFollow = useSelector(
    (state) => state?.alphaFollowsData?.alphaFollow || []
  );
  const { address } = useAppKitAccount();
  const [showAllAlphaDataTable, setShowAllAlphaDataTable] = useState(false);

  const [shownAlphaData, setShownAlphaData] = useState([]);
  const [dailyAlphaData, setDailyAlphaData] = useState([]);
  const [weeklyAlphaData, setWeeklyAlphaData] = useState([]);
  const [monthlyAlphaData, setMonthlyAlphaData] = useState([]);
  const [yearlyAlphaData, setYearlyAlphaData] = useState([]);
  const [allTimeAlphaData, setAllTimeAlphaData] = useState([]);

  const [shownTopCallData, setShownTopCallData] = useState([]);
  const [dailyTopCallData, setDailyTopCallData] = useState([]);
  const [weeklyTopCallData, setWeeklyTopCallData] = useState([]);
  const [monthlyTopCallData, setMonthlyTopCallData] = useState([]);
  const [yearlyTopCallData, setYearlyTopCallData] = useState([]);
  const [allTimeTopCallData, setAllTimeTopCallData] = useState([]);

  const [allAlpha, setAllAlpha] = useState([]);
  const [allTopCalls, setAllTopCalls] = useState([]);
  const [risingStars, setRisingStars] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unfollowData, setUnfolllowData] = useState(null);
  const [callsList, setCallsList] = useState("Trending");
  // const [newCalls, setNewCalls] = useState([]);
  const [newAlphas, setNewAlphas] = useState([]);
  const [toggleShownTimeData, setToggleShownTimeData] = useState("ALLTIME");

  const handleConfirmUnfollow = () => {
    if (unfollowData) {
      dispatch(
        removeAlphaFollowFromDB({
          walletAddress: address,
          alphaGroupId: unfollowData?.channelId || unfollowData?.groupId,
          alphaGroupChatType: unfollowData?.chatType,
        })
      ); // Dispatch Redux action
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchAlphaData = async () => {
      const apiUrl = `https://wave-scan-test-cebad401b8f2.herokuapp.com/getTopAlphas`;
      const intervals = ["ALLTIME", "DAILY", "WEEKLY", "MONTHLY"];

      try {
        for (const interval of intervals) {
          const params = {
            securityKey: apiSK,
            intervalType: interval,
          };

          const response = await axios.get(apiUrl, { params });

          // Update state incrementally
          if (interval === "ALLTIME") {
            setShownAlphaData(response.data.topAlphaData);
            setAllTimeAlphaData(response.data.topAlphaData);
          } else if (interval === "DAILY") {
            setDailyAlphaData(response.data.topAlphaData);
          } else if (interval === "WEEKLY") {
            setWeeklyAlphaData(response.data.topAlphaData);
          } else if (interval === "MONTHLY") {
            setMonthlyAlphaData(response.data.topAlphaData);
          } else if (interval === "YEARLY") {
            setYearlyAlphaData(response.data.topAlphaData);
          }
        }
      } catch (error) {
        setError("Failed to fetch alpha data");
      }
    };

    const fetchRecentAlphas = async () => {
      try {
        const recentAlphasApiUrl = `https://wave-scan-test-cebad401b8f2.herokuapp.com/getRecentAlphas`;
        const recentAlphasParams = {
          securityKey: apiSK,
          amountLimit: 20,
        };

        const response = await axios.get(recentAlphasApiUrl, {
          params: recentAlphasParams,
        });

        const updatedAlphas = response.data.recentAlphas.map((alpha) => {
          const randomIndex = Math.floor(Math.random() * 18) + 1;
          const randomTempImage = `/assets/temporaryProfileImages/tempProfileImage_${randomIndex}.png`;
          return {
            ...alpha,
            groupImage: alpha.groupImage || randomTempImage,
          };
        });

        setNewAlphas(updatedAlphas);
      } catch (error) {
        setError("Failed to fetch new alphas data");
      }
    };

    const fetchTopAdminCalls = async () => {
      const apiUrl = `https://wave-scan-test-cebad401b8f2.herokuapp.com/getTopCalls`;
      const intervals = ["ALLTIME", "DAILY", "WEEKLY", "MONTHLY"];

      try {
        for (const interval of intervals) {
          const params = {
            securityKey: apiSK,
            intervalType: interval,
            amountLimit: 50,
          };

          const response = await axios.get(apiUrl, { params });

          // Update state incrementally
          if (interval === "ALLTIME") {
            setShownTopCallData(response.data.topCalls);
            setAllTimeTopCallData(response.data.topCalls);
          } else if (interval === "DAILY") {
            setDailyTopCallData(response.data.topCalls);
          } else if (interval === "WEEKLY") {
            setWeeklyTopCallData(response.data.topCalls);
          } else if (interval === "MONTHLY") {
            setMonthlyTopCallData(response.data.topCalls);
          } else if (interval === "YEARLY") {
            setYearlyTopCallData(response.data.topCalls);
          }
        }
      } catch (error) {
        setError("Failed to fetch alpha data");
      }
    };

    // Run both async functions
    fetchAlphaData();
    fetchTopAdminCalls();
    fetchRecentAlphas();
  }, []);

  useEffect(() => {
    const newShowTimeData = toggleShownTimeData;
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
  }, [toggleShownTimeData]);

  useEffect(() => {
    if (shownAlphaData?.length > 0) {
      setAllAlpha(getAllAlphas(shownAlphaData));
    }
  }, [shownAlphaData]);

  useEffect(() => {
    if (shownTopCallData?.length > 0) {
      setAllTopCalls(getAllTopCalls(shownTopCallData));
    }
  }, [shownTopCallData]);

  useEffect(() => {
    setRisingStars(getRisingStars(allAlpha));
  }, [allAlpha]);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [allTimeTopCallData]);

  useEffect(() => {
    if (top3ParentDivRef.current) {
      setTop3ParentDivHeight(top3ParentDivRef.current.clientHeight);
    }
  }, [allTopCalls.length, allAlpha.length]);

  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      const listener = () => setMatches(media.matches);

      listener(); // Check on mount
      media.addEventListener("change", listener);

      return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
  };

  const is4Xl = useMediaQuery("(min-width: 1920px)");

  const adjustedHeight = Math.max(top3ParentDivHeight, 112); // 112px = 7rem

  const topAlphaToShow = is4Xl ? 4 : 3;

  const getAllAlphas = (alphas) => {
    if (!alphas || alphas.length === 0) return null;
    const alphaCategories = ["PRO", "RISING STAR", "RECCOMENDED", "NOVICE"];
    // const alphaImgs = [alphaOne, alphaSecond, alphaThree];
    return alphas.map((alpha) => {
      const randomIndex = Math.floor(Math.random() * 18) + 1;
      const randomTempImage = `/assets/temporaryProfileImages/tempProfileImage_${randomIndex}.png`;
      return {
        ...alpha,
        groupImage: alpha.groupImage || randomTempImage,
        alphaCat:
          alphaCategories[Math.floor(Math.random() * alphaCategories.length)], // Random category
        alphaMainStats: [
          {
            title: alphapicksPage?.cards?.topCard?.winrate,
            value: `${alpha?.topAdmin?.winRate?.toFixed(2) || 0}%`,
            icon: star,
            toolTipString: `The percentage of calls that achieved 2x gains or more.`,
          },
          {
            title: alphapicksPage?.cards?.topCard?.calls,
            value: `${alpha?.topAdmin?.callsCount || 0}`,
            icon: ArrowsClockwise,
            toolTipString: `Total number of calls made by the Alpha.`,
          },
          {
            title: alphapicksPage?.cards?.topCard?.averagegains,
            value: `x${formatNumberNoLoop(
              alpha?.topAdmin?.averagePerformance || 0
            )}`,
            icon: ChartLineUp,
            toolTipString: `The average gain percentage across all calls made by the Alpha.`,
          },
          {
            title: alphapicksPage?.cards?.topCard?.topcall,
            value: `${
              alpha?.topAdmin?.highestPerformanceCall
                ? `x${formatNumberNoLoop(
                    alpha?.topAdmin?.highestPerformanceCall?.performance || 0
                  )} on ${alpha?.topAdmin?.highestPerformanceCall?.tokenSymbol}`
                : `x0`
            }`,
            icon: ChartBar,
            toolTipString: `The single call with the highest gain made by the Alpha.`,
          },
        ],
      };
    });
  };

  const getAllTopCalls = (calls) => {
    if (!calls || calls.length === 0) return null;
    return calls.map((call) => {
      const randomIndex = Math.floor(Math.random() * 18) + 1;
      const randomTempImage = `/assets/temporaryProfileImages/tempProfileImage_${randomIndex}.png`;
      return {
        ...call,
        groupImage: call.groupImage || randomTempImage,
      };
    });
  };

  const getRisingStars = (alphas) => {
    if (!alphas || alphas.length === 0) return null;
    const risingStars = alphas.filter(
      (alpha) => alpha.alphaCat === "RISING STAR"
    );
    return risingStars;
  };

  const handleIntervalChange = (newInterval) => {
    setToggleShownTimeData(newInterval);
  };

  const timeIntervals = [
    { label: "All", value: "ALLTIME", data: allTimeAlphaData },
    { label: "1D", value: "DAILY", data: dailyAlphaData },
    { label: "7D", value: "WEEKLY", data: weeklyAlphaData },
    { label: "1M", value: "MONTHLY", data: monthlyAlphaData },
  ];

  return (
    <>
      {loading ? (
        <div className="h-screen w-full flex items-center justify-center">
          <div class="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
            <div class="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
          </div>
        </div>
      ) : (
        <>
          {showAllAlphaDataTable ? (
            <AllAlphaDataTable
              setShowAllAlphaDataTable={setShowAllAlphaDataTable}
              allAlpha={allAlpha}
            />
          ) : (
            <>
              <div className="h-screen overflow-auto overflow-y-auto">
                {/* Header */}
                <div className="flex w-full justify-between border-b border-[#404040] p-6">
                  <div className="flex flex-row justify-start items-center gap-1.5">
                    <Image
                      src={alphaPicks}
                      alt={"Alpha Picks"}
                      width={40}
                      height={40}
                    />
                    <span className="text-white leading-10 text-[32px] font-spaceGrotesk font-bold">
                      {alphapicksPage?.mainHeader?.title}
                    </span>
                  </div>
                </div>

                <div className="flex xl:flex-row flex-col xl:justify-between justify-center items-start">
                  {/* left side */}
                  <div
                    className="4xl:w-[75%] xl:w-[70%] w-full xl:border-r border-[#404040] overflow-y-auto"
                    style={{ height: `calc(100vh - 162px)` }}
                  >
                    {/* Top 3 */}
                    <div
                      ref={top3ParentDivRef}
                      className="p-6 border-b border-[#404040] flex flex-col gap-4"
                    >
                      {/* Top 3 Headers */}
                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <h3 className="font-bold text-lg leading-6 text-white">
                            {alphapicksPage?.mainHeader?.title2}
                          </h3>
                          <span className="w-1 h-1 rounded-full bg-[#A8A8A8]" />
                          <span className="text-[#A8A8A8] text-base leading-10 font-normal">
                            {alphapicksPage?.mainHeader?.desc}
                          </span>
                        </div>
                        <TimeIntervalsFilterTabs
                          intervals={timeIntervals}
                          selectedInterval={toggleShownTimeData}
                          onChange={handleIntervalChange}
                        />
                      </div>

                      {/* Top 3 Alphas */}
                      <div className="onest w-full grid 4xl:grid-cols-4 3xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-9.5">
                        {allAlpha
                          ?.slice(0, topAlphaToShow)
                          .map((data, index) => {
                            return (
                              <div key={index} className="relative">
                                <div>
                                  {/* Absolute Image */}
                                  <div className="absolute rounded-full flex justify-center overflow-hidden w-full">
                                    {data?.groupImage ? (
                                      <div className="h-16 w-h-16 rounded-[8px] overflow-hidden p-[1px] bg-gradient-to-b from-[#1F73FC] via-[#B9DEFF] to-[#4FAFFE] shrink-0 items-center flex justify-center">
                                        <Image
                                          src={data?.groupImage}
                                          alt="Group Image"
                                          width={63}
                                          height={63}
                                          className="rounded-[8px]"
                                        />
                                      </div>
                                    ) : (
                                      <p className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-6xl text-black font-extrabold flex-shrink-0">
                                        {data?.channelName
                                          ?.charAt(0)
                                          ?.toUpperCase() ||
                                          data?.groupName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                      </p>
                                    )}
                                    <Image
                                      src={
                                        index === 0
                                          ? firstRankBadge
                                          : index === 1
                                          ? secondRankBadge
                                          : index === 2
                                          ? thirdRankBadge
                                          : forthRankBadge
                                      }
                                      alt="Rank Badge"
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 absolute top-0 left-1/2 right-8 translate-x-1/2"
                                    />
                                  </div>
                                  <div className="w-full h-[34px]" />
                                  <div className="w-full bg-[#1A1A1A] rounded-lg pt-[42px] flex flex-col">
                                    {/* Group Name and Admin Name */}
                                    <div className="flex flex-col w-full items-center">
                                      <button
                                        onClick={() => {
                                          router.push(
                                            `/alpha-profile/${
                                              data?.channelId || data?.groupId
                                            }`
                                          );
                                        }}
                                        className="text-white font-bold text-[14px] leading-[18px] overflow-hidden truncate w-full px-4 hover:underline hover:text-[#1F73FC]"
                                      >
                                        {data?.groupName}
                                      </button>
                                      <Tooltip
                                        body={`The Alpha group admin with the top-performing calls.`}
                                      >
                                        <button
                                          onClick={() => {
                                            if (data?.topAdmin?.adminId) {
                                              router.push(
                                                `/caller-profile/${data.topAdmin.adminId}`
                                              );
                                            }
                                          }}
                                          className={`font-normal text-xs leading-4 truncate text-[#6E6E6E] 
                                          ${
                                            data?.topAdmin?.adminId
                                              ? "hover:underline hover:text-[#1F73FC]"
                                              : "pointer-events-none opacity-50"
                                          }`}
                                        >
                                          {data?.topAdmin?.adminName
                                            ? `@ ${data.topAdmin.adminName}`
                                            : "-"}
                                        </button>
                                      </Tooltip>
                                    </div>

                                    {/* Group Admin Stats */}
                                    <div className="mt-3 flex flex-col justify-start items-start gap-2 px-4 pb-4">
                                      {data?.alphaMainStats?.map(
                                        (stats, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="font-poppins font-medium 4xl:text-sm text-base 4xl:leading-[18px] leading-6 flex justify-between w-full items-center gap-2.5"
                                            >
                                              <Tooltip
                                                body={`${stats?.toolTipString}`}
                                              >
                                                <div className="flex items-center justify-center gap-1">
                                                  <Image
                                                    src={stats?.icon}
                                                    alt={stats?.icon}
                                                    width={is4Xl ? 16 : 20}
                                                    height={is4Xl ? 16 : 20}
                                                  />
                                                  <span className="text-[#A8A8A8] leading-4">
                                                    {stats?.title}:
                                                  </span>
                                                </div>
                                              </Tooltip>
                                              <p className="text-right">
                                                {stats?.value}
                                              </p>
                                            </div>
                                          );
                                        }
                                      )}
                                      <AlphaFollowButton
                                        groupParams={{
                                          walletAddress: address,
                                          alphaGroupId:
                                            data?.channelId || data?.groupId,
                                          alphaGroupChatType: data?.chatType,
                                        }}
                                        isFollowing={
                                          Array.isArray(alphaFollow) &&
                                          alphaFollow.some((g) =>
                                            g.groupType === "channel"
                                              ? g.channelId === data?.channelId
                                              : g.groupId === data?.groupId
                                          )
                                        }
                                        onUnfollow={() => {
                                          setUnfolllowData(data);
                                          setIsModalOpen(true);
                                        }}
                                        baseClass={`w-full onest h-9 border-none rounded-[4px] font-normal text-xs leading-4`}
                                        bgFollowColor={
                                          "bg-[#1F73FC] text-[#F6F6F6]"
                                        }
                                        bgUnFollowColor={"bg-[#333333]"}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* All Alpha Data */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="onest flex flex-row justify-between items-center">
                        <h3 className="font-bold text-lg leading-6 text-white">
                          {alphapicksPage?.cards?.restcard?.allalpha}
                        </h3>
                        <button
                          className="flex gap-2 px-5 py-1 items-center justify-center"
                          onClick={() => setShowAllAlphaDataTable(true)}
                        >
                          <p className="font-normal text-xs leading-4 text-[#278BFE]">
                            {alphapicksPage?.cards?.restcard?.seeall}
                          </p>
                          <Image
                            src={ArrowRight}
                            alt={ArrowRight}
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>

                      {/* Alpha data */}
                      <div className="grid 4xl:grid-cols-4 3xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4 mt-4">
                        {allAlpha?.length >= topAlphaToShow &&
                          allAlpha
                            ?.slice(topAlphaToShow)
                            ?.map((data, index) => {
                              return (
                                <div
                                  key={index}
                                  className="bg-[#1A1A1A] rounded-lg p-4 onest"
                                >
                                  {/* details */}
                                  <div className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-4 min-w-0">
                                      {data?.groupImage ? (
                                        <div className="h-[34px] w-[34px] rounded-[4px] overflow-hidden p-[1px] bg-gradient-to-b from-[#1F73FC] via-[#B9DEFF] to-[#4FAFFE] shrink-0 items-center flex justify-center">
                                          <Image
                                            src={data?.groupImage}
                                            alt={
                                              data?.topAdmin?.channelName ||
                                              data?.topAdmin?.groupName
                                            }
                                            width={33}
                                            height={33}
                                            className="rounded-[4px]"
                                          />
                                        </div>
                                      ) : (
                                        <p className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg text-black font-bold flex-shrink-0">
                                          {data?.channelName
                                            ?.charAt(0)
                                            .toUpperCase() ||
                                            data?.groupName
                                              ?.charAt(0)
                                              .toUpperCase()}
                                        </p>
                                      )}
                                      <div className="flex flex-col flex-grow min-w-0">
                                        <h3 className="text-white font-medium text-[14px] leading-[18px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                                          {data?.channelName || data?.groupName}
                                        </h3>
                                        <Tooltip
                                          body={`The Alpha group admin with the top-performing calls.`}
                                        >
                                          <button
                                            onClick={() => {
                                              if (data?.topAdmin?.adminId) {
                                                router.push(
                                                  `/caller-profile/${data.topAdmin.adminId}`
                                                );
                                              }
                                            }}
                                            className={`font-normal text-[#6E6E6E] text-xs leading-4 truncate overflow-hidden text-ellipsis whitespace-nowrap flex justify-start
                                          ${
                                            data?.topAdmin?.adminId
                                              ? "hover:underline hover:text-[#1F73FC]"
                                              : "pointer-events-none opacity-50"
                                          }`}
                                          >
                                            {data?.topAdmin?.adminName
                                              ? `@ ${data.topAdmin.adminName}`
                                              : `-`}
                                          </button>
                                        </Tooltip>
                                      </div>
                                    </div>
                                    {/* <span className="rounded border-[0.7px] border-[#6CC4F4] py-1 px-2.5 text-[10px] font-semibold flex-shrink-0 whitespace-nowrap leading-4 text-[#6CC4F4]">
                                  {data?.alphaCat}
                                </span> */}
                                  </div>

                                  {/* numbers */}
                                  <div className="mt-5 flex flex-col justify-start items-start gap-2">
                                    {data?.alphaMainStats?.map(
                                      (stats, index) => {
                                        return (
                                          <div
                                            key={index}
                                            className="font-poppins font-medium text-xs leading-4 flex justify-between w-full items-center gap-2.5"
                                          >
                                            <Tooltip
                                              body={`${stats?.toolTipString}`}
                                            >
                                              <div className="flex items-center justify-center gap-2">
                                                <Image
                                                  src={stats?.icon}
                                                  alt={stats?.icon}
                                                  width={16}
                                                  height={16}
                                                />
                                                <span className="text-[#A8A8A8]">
                                                  {stats?.title}:
                                                </span>
                                              </div>
                                            </Tooltip>
                                            <p className="text-right">
                                              {stats?.value}
                                            </p>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>

                                  {/* buttons */}
                                  <div className="mt-5 flex justify-between items-center">
                                    <button
                                      onClick={() =>
                                        router.push(
                                          `/alpha-profile/${
                                            data?.channelId || data?.groupId
                                          }`
                                        )
                                      }
                                      className="flex items-center gap-2"
                                    >
                                      <p className="font-normal text-[12px] leading-4 text-[#278BFE]">
                                        Details
                                      </p>
                                      <Image
                                        src={ArrowCircleRight}
                                        alt={ArrowCircleRight}
                                        width={16}
                                        height={16}
                                      />
                                    </button>
                                    <AlphaFollowButton
                                      groupParams={{
                                        walletAddress: address,
                                        alphaGroupId:
                                          data?.channelId || data?.groupId,
                                        alphaGroupChatType: data?.chatType,
                                      }}
                                      isFollowing={
                                        Array.isArray(alphaFollow) &&
                                        alphaFollow.some((g) =>
                                          g.groupType === "channel"
                                            ? g.channelId === data?.channelId
                                            : g.groupId === data?.groupId
                                        )
                                      }
                                      onUnfollow={() => {
                                        setUnfolllowData(data);
                                        setIsModalOpen(true);
                                      }}
                                      baseClass={`px-5 py-[10px] border rounded-[4px] h-9 font-normal text-xs leading-4 flex items-center justify-center`}
                                      bgFollowColor="bg-none border-[#1F73FC] text-[#1F73FC] "
                                      bgUnFollowColor="bg-none border-[#6E6E6E] text-[#6E6E6E]"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                      </div>
                    </div>
                  </div>

                  {/* right side */}
                  <div
                    className="4xl:w-[25%] xl:w-[30%] w-full flex flex-col overflow-y-auto"
                    style={{ height: `calc(100vh - 162px)` }}
                  >
                    {/* Trending Tokens Section */}
                    <div
                      className="w-full border-b border-[#404040]"
                      style={{ height: adjustedHeight }}
                    >
                      <div className="flex px-6 h-10 bg-[#141414]">
                        <button
                          onClick={() => setCallsList("Trending")}
                          className={`${
                            callsList === "Trending" &&
                            `border-b border-[#278BFE] text-[#278BFE] font-bold`
                          } gap-1 font-poppins w-full flex items-center h-full justify-center font-semibold text-sm leading-7 text-[#A8A8A8]`}
                        >
                          <p>
                            {alphapicksPage?.cards?.siderightbar?.bestcalls}
                          </p>
                          <Infotip
                            body={
                              alphapicksPage?.cards?.siderightbar
                                ?.bestcallstooltip
                            }
                          />
                        </button>
                        {/* <button
                        onClick={() => setCallsList('Recent Calls')}
                        className={`${callsList === 'Recent Calls' && `border-b border-[#278BFE] text-[#278BFE] pointer-events-none font-bold`}font-poppins w-full flex items-center h-full justify-center font-semibold text-sm leading-7 text-[#A8A8A8]`}
                      >
                        Recent Calls
                      </button> */}
                        <button
                          onClick={() => setCallsList("Recent Alphas")}
                          className={`${
                            callsList === "Recent Alphas" &&
                            `border-b border-[#278BFE] text-[#278BFE] font-bold`
                          } gap-1 font-poppins w-full flex items-center h-full justify-center font-semibold text-sm leading-7 text-[#A8A8A8]`}
                        >
                          <p>
                            {alphapicksPage?.cards?.siderightbar?.recentalphas}
                          </p>
                          <Infotip
                            body={
                              alphapicksPage?.cards?.siderightbar
                                ?.recentalphastooltip
                            }
                          />
                        </button>
                      </div>
                      <div
                        className="p-6 overflow-hidden min-h-28"
                        style={{ height: top3ParentDivHeight - 40 }}
                      >
                        <div className="h-full flex flex-col gap-4 overflow-hidden overflow-y-scroll">
                          {callsList === "Trending" &&
                            allTopCalls?.map((token, index) => {
                              return (
                                <div
                                  key={index}
                                  className="h-[42px] w-full flex items-center"
                                >
                                  <p className="text-[#4D4D4D] text-base flex mr-2">
                                    #
                                    <span className="flex w-[18px] items-start">
                                      {index + 1}
                                    </span>
                                  </p>
                                  {token?.groupImage ? (
                                    <div className="w-[42px] h-[42px] flex-shrink-0 rounded-[4px] overflow-hidden">
                                      <Image
                                        src={token?.groupImage}
                                        alt={
                                          token?.channelName || token?.groupName
                                        }
                                        width={42}
                                        height={42}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <p className="w-[42px] h-[42px] bg-white flex items-center justify-center text-lg text-black font-bold flex-shrink-0 rounded-[4px] overflow-hidden">
                                      {token?.channelName
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                        token?.groupName
                                          ?.charAt(0)
                                          ?.toUpperCase()}
                                    </p>
                                  )}
                                  <div className="ml-2 flex flex-col justify-between">
                                    <button
                                      onClick={() =>
                                        router.push(
                                          `/tradingview/solana?tokenaddress=${token?.tokenAddress}&symbol=${token?.tokenSymbol}`
                                        )
                                      }
                                      className="text-base flex items-center hover:underline"
                                    >
                                      {token?.tokenSymbol?.toUpperCase()}
                                      <span className="text-[#6E6E6E] mx-[2px]">
                                        /
                                      </span>
                                      <span className="text-[#6E6E6E]">
                                        {token?.tokenName}
                                      </span>
                                    </button>
                                    <p className="text-[14px] flex items-center">
                                      x{formatNumberNoLoop(token?.performance)}
                                      <span className="text-[#6E6E6E] mx-2">
                                        by
                                      </span>
                                      <button
                                        onClick={() =>
                                          router.push(
                                            `/alpha-profile/${
                                              token?.channelId || token?.groupId
                                            }`
                                          )
                                        }
                                        className="text-[#1F73FC] hover:underline cursor-pointer truncate overflow-hidden whitespace-nowrap text-start"
                                      >
                                        {token?.channelName || token?.groupName}
                                      </button>
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          {/* {callsList === 'Recent Calls' && 
                          newCalls?.map((call, index) => {
                            return (
                              <div
                                key={index}
                                className="h-[42px] w-full flex items-center"
                              >
                                <div className="ml-2 flex flex-col justify-between">
                                  <p className="text-base flex items-center">
                                    {call?.tokenSymbol?.charAt(0) !== '$' ? '$' : ''}{call?.tokenSymbol?.toUpperCase()} 
                                    <span className="text-[#6E6E6E] mx-[2px]">/</span>
                                      <span className="text-[#6E6E6E]">
                                      {call?.tokenName}
                                      </span>
                                    </p>
                                  <p className="text-[14px] flex items-center">
                                      MC: ${formatNumberNoLoop(call?.mc)}
                                      <span className="text-[#6E6E6E] mx-2">by</span> 
                                      <button 
                                        onClick={() => router.push(`/caller-profile/${call?.userId}`)} 
                                        className="text-[#1F73FC] hover:underline cursor-pointer truncate"
                                      >
                                        {call?.userName}
                                      </button> 
                                    </p>
                                </div>
                              </div>
                            );
                        })} */}
                          {callsList === "Recent Alphas" &&
                            newAlphas?.map((alpha, index) => {
                              return (
                                <div
                                  key={index}
                                  className="h-[42px] w-full flex items-center"
                                >
                                  <p className="text-[#4D4D4D] text-base flex mr-2">
                                    #
                                    <span className="flex w-[18px] items-start">
                                      {index + 1}
                                    </span>
                                  </p>
                                  {alpha?.groupImage ? (
                                    <div className="w-[42px] h-[42px] flex-shrink-0 rounded-[4px] overflow-hidden">
                                      <Image
                                        src={alpha?.groupImage}
                                        alt={
                                          alpha?.channelName || alpha?.groupName
                                        }
                                        width={42}
                                        height={42}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <p className="w-[42px] h-[42px] bg-white flex items-center justify-center text-lg text-black font-bold flex-shrink-0 rounded-[4px] overflow-hidden">
                                      {alpha?.channelName
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                        alpha?.groupName
                                          ?.charAt(0)
                                          ?.toUpperCase()}
                                    </p>
                                  )}
                                  <div className="ml-2 w-full flex flex-col justify-between">
                                    <div className="w-full text-base flex items-center justify-between">
                                      <button
                                        onClick={() =>
                                          router.push(
                                            `/alpha-profile/${
                                              alpha?.channelId || alpha?.groupId
                                            }`
                                          )
                                        }
                                        className="hover:underline text-[#1F73FC] overflow-hidden text-ellipsis whitespace-nowrap min-w-0 max-w-[50%] text-start"
                                      >
                                        {alpha?.channelName || alpha?.groupName}
                                      </button>
                                      <p className="shrink-0 whitespace-nowrap">
                                        {getTimeAgo(alpha?.joinedAt)}
                                      </p>
                                    </div>
                                    <p className="text-[14px] flex items-center">
                                      Members:{" "}
                                      {alpha?.membersInfo?.membersCount
                                        ? `${formatNumberNoLoop(
                                            alpha?.membersInfo?.membersCount
                                          )}`
                                        : `-`}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    {/* Rising Stars Section */}
                    {risingStars?.length > 0 && (
                      <div className="p-6 onest border-b border-[#404040]">
                        <div className="flex gap-2 items-center">
                          <h3 className="font-normal text-[22px] leading-7 text-white">
                            {alphapicksPage?.cards?.siderightbar?.risingstar}
                          </h3>
                          <Infotip
                            iconSize={24}
                            body={
                              alphapicksPage?.cards?.siderightbar
                                ?.risingstartooltip
                            }
                          />
                        </div>
                        <div className="mt-4 flex flex-col max-h-[288px] overflow-hidden overflow-y-scroll gap-4">
                          {risingStars?.map((risingAlpha, index) => {
                            return (
                              <button
                                onClick={() =>
                                  router.push(
                                    `/alpha-profile/${
                                      risingAlpha?.channelId ||
                                      risingAlpha?.groupId
                                    }`
                                  )
                                }
                                key={index}
                                className="w-full h-[136px] shrink-0 rounded-lg overflow-hidden relative hover:cursor-pointer"
                              >
                                {risingAlpha?.groupImage && (
                                  <Image
                                    src={risingAlpha?.groupImage}
                                    alt={"Alpha Image"}
                                    width={380}
                                    height={106}
                                    className="w-full h-full absolute object-cover translate-y-1/5 z-0"
                                  />
                                )}
                                {/* <div className="w-full h-full absolute backdrop-blur-[3px] object-cover z-10" /> */}
                                <div className="w-full h-full p-4 flex justify-between items-end relative z-20">
                                  {/* Left Side */}
                                  <div className="flex items-end gap-4">
                                    <div className="rounded-full flex items-center justify-center w-16 aspect-square bg-white border-[#6CC4F4] border-2">
                                      {risingAlpha?.groupImage ? (
                                        <Image
                                          src={risingAlpha?.groupImage}
                                          alt={"Alpha Image"}
                                          width={64}
                                          height={64}
                                          className="rounded-full w-full h-full"
                                        />
                                      ) : (
                                        <p className="w-10 h-10 rounded-full flex items-center justify-center text-black text-3xl font-extrabold">
                                          {risingAlpha?.channelName
                                            ?.charAt(0)
                                            ?.toUpperCase() ||
                                            risingAlpha?.groupName
                                              ?.charAt(0)
                                              ?.toUpperCase()}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-0">
                                      <p className="font-medium text-base leading-5">
                                        {risingAlpha?.channelName ||
                                          risingAlpha?.groupName}
                                      </p>
                                      <div className="flex gap-2">
                                        <Image
                                          src={Users}
                                          alt={Users}
                                          width={16}
                                          height={16}
                                        />
                                        <p className="font-normal text-xs leading-4">
                                          {risingAlpha?.membersInfo
                                            ?.membersCount
                                            ? `${formatNumberNoLoop(
                                                risingAlpha?.membersInfo
                                                  ?.membersCount
                                              )}`
                                            : `-`}{" "}
                                          Members
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Right Side */}
                                  <div className="flex flex-col justify-end items-end">
                                    <p className="text-xs font-medium leading-4">
                                      {alphapicksPage?.cards?.restcard?.topcall}
                                    </p>
                                    <p className="font-bold text-[#278BFE] text-xs leading-4">
                                      {risingAlpha?.topAdmin
                                        ?.highestPerformanceCall?.performance
                                        ? `x${formatNumberNoLoop(
                                            risingAlpha?.topAdmin
                                              ?.highestPerformanceCall
                                              ?.performance
                                          )} @${
                                            risingAlpha?.topAdmin?.highestPerformanceCall?.tokenSymbol?.charAt(
                                              0
                                            ) !== "$"
                                              ? "$"
                                              : ""
                                          }${
                                            risingAlpha?.topAdmin
                                              ?.highestPerformanceCall
                                              ?.tokenSymbol
                                          }`
                                        : `x0`}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-full bottom-0 h-[50%] absolute bg-[#1E1E1ECC] z-10" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Booseted Alpha Section */}
                    <div className="p-6 rounded-3xl">
                      <div className="flex gap-2 items-center">
                        <h3 className="font-poppins font-semibold text-xl leading-7 text-white">
                          {alphapicksPage?.cards?.siderightbar?.boostedalphas}
                        </h3>
                        <Infotip
                          iconSize={24}
                          body={
                            "Alpha groups that are being actively promoted or featured for increased visibility."
                          }
                        />
                      </div>
                      <div className="mt-6">
                        {/* if empty show contact us button */}
                        <button className="font-semibold w-full rounded-lg py-2 px-8 border-[0.77px] border-[#6CC4F4] text-white hover:text-black bg-black/25 hover:bg-[#6CC4F4] transition-colors ease-in-out delay-200">
                          {alphapicksPage?.cards?.siderightbar?.contactus}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-[#16171D] p-6 rounded-lg shadow-lg w-80 mx-auto mt-20 absolute z-[1000] text-white"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
              >
                <h2 className="text-lg font-semibold mb-4">Confirm Unfollow</h2>
                <p>Are you sure you want to unfollow?</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="font-semibold rounded py-2 px-8 shrink-0 border-[0.77px] border-[#6CC4F4] text-white hover:text-black bg-black/25 hover:bg-[#6CC4F4] transition-colors ease-in-out delay-200"
                    onClick={() => setIsModalOpen(false)}
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
          )}
        </>
      )}
    </>
  );
};

export default AlphaPicks;
