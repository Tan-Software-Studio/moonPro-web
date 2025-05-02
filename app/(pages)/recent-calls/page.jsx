"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { recentCalls } from "@/app/Images";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatNumberNoLoop, getTimeAgo } from "@/utils/calculation";
import XLogo from "../../../public/assets/RecentCalls/XLogo.svg";
import TelegramLogo from "../../../public/assets/RecentCalls/TelegramLogo.svg";
import GlobeSimple from "../../../public/assets/RecentCalls/GlobeSimple.svg";
import Lightning from "../../../public/assets/RecentCalls/Lightning.svg";
import ArrowsDownUp from "../../../public/assets/RecentCalls/ArrowsDownUp.svg";
import { subscribeToNewCalls } from "@/websocket/alphaCalls";
import { CiCircleCheck } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import CopyButton from "@/components/common/Alpha_TokenCalls/CopyButton";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const RecentCallsPage = () => {
  const { t } = useTranslation();
  const recentcalls = t("recentcalls");
  const apiSK = process.env.NEXT_PUBLIC_WAVE_SCAN_ADMIN_SK;
  const router = useRouter();

  const [newCalls, setNewCalls] = useState([]);

  useEffect(() => {
    const fetchCalls = async () => {
      const callsApiUrl = `https://wave-scan-test-cebad401b8f2.herokuapp.com/getRecentCalls`;
      const callsParams = {
        securityKey: apiSK,
        amountLimit: 20,
      };

      try {
        const response = await axios.get(callsApiUrl, { params: callsParams });
        setNewCalls(response.data);
        // console.log(response.data);
      } catch (err) {
        console.error("Failed to fetch calls data", err);
      }
    };

    fetchCalls();
    // Setup WebSocket Immediately
    const { socket, disconnect } = subscribeToNewCalls("recentCallsPage");

    socket.on("callsUpdate", (data) => {
      // console.log('Calls receive update', data);
      setNewCalls((prevCalls) => {
        const updatedCalls = [data, ...prevCalls];
        return updatedCalls.slice(0, 20);
      });
    });

    return () => disconnect(); // Cleanup WebSocket on unmount
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="px-6 flex justify-between items-center ">
        {/* Left Side */}
        <div className="flex gap-2 items-center py-[26px]">
          <Image
            src={recentCalls}
            alt="Recent Calls Image"
            width={32}
            height={32}
          />
          <p className="font-spaceGrotesk font-bold text-[28px] leading-8">
            {recentcalls?.mainHeader?.title}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex py-6 gap-6">
          {/* Time Filter */}
          {/* <div className="flex text-[#404040] text-xs leading-4 font-normal onest">
                    <button
                        className={`px-5 py-2.5 rounded-l-[4px] ${toggleShownTimeData !==  'DAILY' ? `border-[#404040] border-[0.8px]` : `bg-[#1F73FC] text-white font-bold  `}`}
                        onClick={() => setToggleShownTimeData('DAILY')}
                    >
                        Daily
                    </button>
                    <button
                        className={`px-5 py-2.5 ${toggleShownTimeData !==  'WEEKLY' ? `border-[#404040] border-[0.8px]` : `bg-[#1F73FC] text-white font-bold  `}`}
                        onClick={() => setToggleShownTimeData('WEEKLY')}
                    >
                        Weekly
                    </button>
                    <button
                        className={`rounded-r-[4px] px-5 py-2.5 ${toggleShownTimeData !==  'MONTHLY' ? `border-[#404040] border-[0.8px]` : `bg-[#1F73FC] text-white font-bold  `}`}
                        onClick={() => setToggleShownTimeData('MONTHLY')}
                    >
                        Monthly
                    </button>
                </div> */}

          {/* Sort by */}
          {/* <div className="border-[0.5px] rounded-lg border-[#404040] overflow-hidden onest flex">
                    <div className="bg-[#1F1F1F] font-medium text-xs leading-4 px-4 py-2.5">
                        Sort by
                    </div>
                    <div className="w-[181px] bg-[#141414] flex gap-1 items-center justify-end py-[9px] px-3">
                        <p className="font-normal text-xs leading-4">Time</p>
                        <Image
                            src={CaretDown}
                            alt="Recent Calls Page"
                            width={18}
                            height={18}
                        />
                    </div>
                </div> */}
        </div>
      </div>

      {/* Table */}
      <div className="px-6 w-full">
        {/* Header */}
        {/* // cols with 7 days
            <div className="onest font-bold text-xs items-center leading-4 text-[#A8A8A8] grid grid-cols-[1.9fr_0.6fr_1.8fr_0.6fr_0.6fr_0.55fr_0.55fr_1fr_1.5fr_0.85fr]"> */}
        <div className="onest font-bold text-xs items-center leading-4 text-[#A8A8A8] grid grid-cols-[1.9fr_0.6fr_1.8fr_0.6fr_0.6fr_0.55fr_0.55fr_1.5fr_0.85fr]">
          <p className="px-2">{recentcalls?.tableheaders?.token}</p>
          <div className="flex gap-1 items-center px-2 justify-between">
            <div className="flex items-center gap-1">
              <p>{recentcalls?.tableheaders?.before}</p>
              <Infotip body={recentcalls?.tableheaders?.beforetooltip} />
            </div>
            <Image
              src={ArrowsDownUp}
              alt={"Before Logo"}
              width={16}
              height={16}
            />
          </div>
          <p className="px-2">{recentcalls?.tableheaders?.calledby}</p>
          <div className="flex items-center gap-1 justify-start px-2">
            <p>{recentcalls?.tableheaders?.calledmc}</p>
            <Infotip body={recentcalls?.tableheaders?.calledmctooltip} />
          </div>
          <div className="flex items-center gap-1 justify-start px-2">
            <p>{recentcalls?.tableheaders?.mcnow}</p>
            <Infotip body={recentcalls?.tableheaders?.mcnowtooltip} />
          </div>
          <p>{recentcalls?.tableheaders?.growth} (%)</p>
          <div className="flex items-center gap-1 justify-start px-2">
            <p>{recentcalls?.tableheaders?.ath}</p>
            <Infotip body={recentcalls?.tableheaders?.athtooltip} />
          </div>
          <div className="flex items-center gap-1 justify-center px-2">
            <p>{recentcalls?.tableheaders?.audit}</p>
            <Infotip body={recentcalls?.tableheaders?.audittooltip} />
          </div>
          {/* <p className="px-2">LAST 7 DAYS</p> */}
          <p className="flex justify-center">
            {recentcalls?.tableheaders?.action}
          </p>
        </div>
        {/* Items */}
        <div
          className="overflow-y-auto overflow-hidden"
          style={{ height: "calc(100vh - 190px)" }}
        >
          {newCalls?.map((call, index) => (
            // cols with 7 days
            // <div key={index} className="hover:bg-[#1A1A1A] border-b border-[#1A1A1A] grid grid-cols-[1.9fr_0.6fr_1.8fr_0.6fr_0.6fr_0.55fr_0.55fr_1fr_1.5fr_0.85fr]">
            <div
              key={index}
              className="hover:bg-[#1A1A1A] border-b border-[#1A1A1A] grid grid-cols-[1.9fr_0.6fr_1.8fr_0.6fr_0.6fr_0.55fr_0.55fr_1.5fr_0.85fr]"
            >
              {/* Token */}
              <div className="px-2 py-4 flex gap-2">
                <div className="w-[42px] h-[42px] bg-gradient-to-b from-[#1F73FC] via-[#B9DEFF] to-[#4FAFFE] p-0.5 rounded-lg shrink-0">
                  <button
                    onClick={() =>
                      router.push(
                        `/tradingview/solana?tokenaddress=${call?.tokenAddress}&symbol=${call?.tokenSymbol}`
                      )
                    }
                    className="bg-[#4FAFFE] w-full h-full rounded-lg overflow-hidden"
                  >
                    {call?.tokenImage && (
                      <img
                        src={call?.tokenImage}
                        alt="Token Image"
                        width={42}
                        height={42}
                        className="h-full w-full"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </button>
                </div>

                <div className="flex flex-col gap-1 onest text-[#F6F6F6] w-full">
                  {/* Top */}
                  <div className="flex items-center w-full">
                    <p className="font-bold text-base leading-5 flex items-center max-w-[255px] min-w-0 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                      {call?.tokenSymbol}
                      <span className="text-[#6E6E6E] font-normal mx-0.5 truncate overflow-hidden text-ellipsis">
                        {`/ ${call?.tokenName}`}
                      </span>
                    </p>
                    <CopyButton
                      textToCopy={call?.tokenAddress}
                      imageSize={16}
                    />
                  </div>

                  {/* Bottom */}
                  <div className="flex gap-2">
                    <p className="text-[#6E6E6E] text-sm leading-[18px] font-normal">
                      {call?.tokenAddress?.slice(0, 5) +
                        "..." +
                        call?.tokenAddress?.slice(-4)}
                    </p>
                    <div className="h-4 w-[1px] bg-[#6E6E6E]" />
                    <button>
                      <Image
                        src={XLogo}
                        alt="X Logo Image"
                        width={16}
                        height={16}
                        className={"shrink-0"}
                      />
                    </button>

                    <button>
                      <Image
                        src={TelegramLogo}
                        alt="Telegram Logo Image"
                        width={16}
                        height={16}
                        className={"shrink-0"}
                      />
                    </button>

                    <button>
                      <Image
                        src={GlobeSimple}
                        alt="Globe Simple Image"
                        width={16}
                        height={16}
                        className={"shrink-0"}
                      />
                    </button>
                    <Link
                      href={`https://www.pump.news/en/${call?.tokenAddress}-solana`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-[10px] h-[17px] w-[17px] border border-[#626266] text-[#626266] rounded-md flex items-center justify-center cursor-pointer">
                        AI
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Before */}
              <div className="onest px-2 flex items-center justify-start">
                <p className="text-xs leading-3 font-normal">
                  {getTimeAgo(call?.callTimestamp, false)}
                </p>
              </div>

              {/* Called By */}
              <div className="py-[19px] px-2 flex items-center gap-4">
                <div className="w-9 h-9 p-[1px] bg-gradient-to-b from-[#1F73FC] via-[#B9DEFF] to-[#4FAFFE] rounded-[4px] shrink-0">
                  <Image
                    src={`/assets/temporaryProfileImages/tempProfileImage_${
                      Math.floor(Math.random() * 18) + 1
                    }.png`}
                    alt={"Called By Profile Icon"}
                    width={50}
                    height={50}
                    className="rounded-[4px]"
                  />
                </div>
                <div>
                  <button
                    onClick={() =>
                      router.push(`/caller-profile/${call?.userId}`)
                    }
                    className="hover:underline font-medium text-sm leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap flex-grow-0 min-w-0"
                  >
                    {call?.userName}
                  </button>
                  <div className="flex font-normal text-xs leading-4 gap-2 text-[#6E6E6E]">
                    <p>Rank: {call?.rank ? `${call?.rank}` : `-`}</p>
                    <div className="h-3 w-[1px] bg-[#6E6E6E]" />
                    <p>
                      Win rate:{" "}
                      {call?.rank ? `${call?.winRate?.toFixed(0)}%` : `-`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Cap (Called At) */}
              <div className="onset px-2 flex items-center justify-start text-xs leading-4 font-normal">
                <p>{formatNumberNoLoop(call?.mc)}</p>
              </div>

              {/* Market Cap (Now) */}
              <div className="onset px-2 flex items-center justify-start text-xs leading-4 font-normal">
                <p>{`${
                  call?.nowMc ? formatNumberNoLoop(call?.nowMc) : "-"
                }`}</p>
              </div>

              {/* Growth */}
              <div
                className={`onset px-2 flex items-center justify-start text-xs leading-4 font-normal 
                            ${
                              call?.mcGrowthPercentage > 0
                                ? "text-[#21CB6B]"
                                : call?.mcGrowthPercentage < 0
                                ? "text-[#ED1B24]"
                                : "text-[#6E6E6E]"
                            }`}
              >
                <p>
                  {call?.mcGrowthPercentage !== null &&
                  call?.mcGrowthPercentage !== undefined
                    ? `${formatNumberNoLoop(call.mcGrowthPercentage)}%`
                    : "-"}
                </p>
              </div>

              {/* ATH */}
              <div className="onset px-2 flex items-center justify-start text-xs leading-4 font-normal">
                <p>{`${
                  call?.nowAthMc ? formatNumberNoLoop(call?.nowAthMc) : "-"
                }`}</p>
              </div>

              {/* Last 7 days */}
              {/* <div className="flex px-2 items-center justify-center">
                            <Image 
                                src={TempChartMini}
                                alt={'Temp Chart Mini'}
                                width={148}
                                height={24}
                            />
                        </div> */}

              {/* Audit */}
              <div className="whitespace-nowrap flex justify-center items-center">
                <div
                  className={`flex onest justify-center gap-[7px] text-xs leading-4 font-normal items-center ${
                    !call.mintAuth ? "text-white" : "text-[#828282]"
                  }`}
                >
                  {/* Mint */}
                  <Tooltip
                    body={
                      "The token can’t be minted anymore — no one can create new tokens."
                    }
                  >
                    <div className="grid text-start">
                      <div className="flex flex-col text-start opacity-75">
                        {!call.mintAuth ? (
                          <CiCircleCheck size={12} className="text-[#21CB6B]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={12}
                            className="text-[#ED1B24]"
                          />
                        )}
                        <div className="mt-1">
                          <div>Mint Auth</div>
                          <div>Disabled</div>
                        </div>
                      </div>
                    </div>
                  </Tooltip>

                  {/* Freeze */}
                  <Tooltip body={"No one can freeze token transfers."}>
                    <div className="grid text-start">
                      <div
                        className={`flex flex-col text-start opacity-75 ${
                          !call.freezeAuth ? "text-white" : "text-[#828282]"
                        }`}
                      >
                        {!call.freezeAuth ? (
                          <CiCircleCheck size={12} className="text-[#21CB6B]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={12}
                            className="text-[#ED1B24]"
                          />
                        )}
                        <div className="mt-1">
                          <div>Freeze Auth</div>
                          <div>Disabled</div>
                        </div>
                      </div>
                    </div>
                  </Tooltip>

                  {/* LP Burned */}
                  <Tooltip
                    body={
                      "Liquidity Pool tokens were burned — this helps lock the liquidity in place."
                    }
                  >
                    <div className="grid text-start">
                      <div
                        className={`flex flex-col text-start opacity-75 ${
                          true ? "text-white" : "text-[#828282]"
                        }`}
                      >
                        {true ? (
                          <CiCircleCheck size={12} className="text-[#21CB6B]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={12}
                            className="text-[#ED1B24]"
                          />
                        )}
                        <div className="mt-1">
                          <div>LP</div>
                          <div>Burned</div>
                        </div>
                      </div>
                    </div>
                  </Tooltip>

                  {/* Top 10 Holder */}
                  <Tooltip body={"Shows if token has 10 holders."}>
                    <div className="grid text-start">
                      <div
                        className={`flex flex-col text-start opacity-75 ${
                          call?.haveTop10Holder
                            ? "text-white"
                            : "text-[#828282]"
                        }`}
                      >
                        {call?.haveTop10Holder ? (
                          <CiCircleCheck size={12} className="text-[#21CB6B]" />
                        ) : (
                          <IoCloseCircleOutline
                            size={12}
                            className="text-[#ED1B24]"
                          />
                        )}
                        <div className="mt-1">
                          <div>Top 10</div>
                          <div>Holders</div>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>

              {/* Quick Buy */}
              <div className="px-4 py-[19px] flex items-center justify-center">
                <button className="rounded-[4px] py-2.5 px-5 flex gap-2 hover:bg-[#11265B]">
                  <Image
                    src={Lightning}
                    alt={"Lightning Logo"}
                    width={16}
                    height={16}
                  />
                  <p className="text-[#278BFE] font-normal text-xs leading-4">
                    Buy 0.1
                  </p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentCallsPage;