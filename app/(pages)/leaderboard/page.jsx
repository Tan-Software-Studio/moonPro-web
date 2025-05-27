/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  LeaderboardIcon,
  firstUserIcon,
  SecondUserIcon,
  ThirdUserIcon,
  One,
  Two,
  Three,
} from "@/app/Images";
import ToperLeaderboard from "./ToperLeaderboard";
import axios from "axios";
import toast from "react-hot-toast"; 
import { useTranslation } from "react-i18next";

const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

const LeaderBoard = () => { 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [flag, setFlag] = useState(false);
  const { t } = useTranslation();
  const leaderboardPage = t("leaderboard");
  const tableHeader = [
    { id: 1, title: "#" },
    { id: 3, title: "email" },
    { id: 4, title: leaderboardPage?.table?.trading?.totaltrads },
    { id: 5, title: leaderboardPage?.table?.trading?.value },
    { id: 6, title: leaderboardPage?.table?.trading?.referralid },
  ];

  const YourStats = [
    { id: 1, title: leaderboardPage?.mainHeader?.ranking, value: "439" },
    { id: 1, title: leaderboardPage?.mainHeader?.totalpoints, value: "439" },
    {
      id: 1,
      title: leaderboardPage?.mainHeader?.tradingpoints,
      value: "439K",
      infoTipString: leaderboardPage?.mainHeader?.tradingpointstooltip,
    },
    {
      id: 1,
      title: leaderboardPage?.mainHeader?.referralpoints,
      value: "439",
      infoTipString: leaderboardPage?.mainHeader?.referralpointstooltip,
    },
  ];
 

  const clipPathTop1Style = {
    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0 100%)",
  };
  const clipPathTopStyle = {
    clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0 100%)",
  };

  async function getLeaderBoardData() {
    setFlag(true);
    await axios({
      url: `${BASE_URL}transactions/leaderBoard`,
      method: "get",
    })
      .then((res) => {
        console.log("🚀 ~ .then ~ res:", res)
        setFlag(false);
        setLeaderboardData(res?.data?.data?.leaderBoardData);

      })
      .catch((err) => {
        setFlag(false);
        console.log(err?.message);
        toast.error("Something has been wrong!", {
          position: "top-center",
        });
      });
  }
  useEffect(() => {
    getLeaderBoardData();
  }, []);

  return (
    <>
      {/* container mx-auto px-4 */}
      <div className="font-poppins">
        <div className={`container mx-auto px-4 mb-4 h-[93vh] overflow-auto`}>
          <div className={`mx-[-1px] md:mx-0`}>
            <div
              className={`flex justify-start items-start xl:items-center pt-4 w-full`}
            >
              <div className="flex items-center gap-2">
                <Image src={LeaderboardIcon} alt="" />
                <p
                  className={`md:text-[28px] text-[14px] font-semibold text-white`}
                >
                  {leaderboardPage?.mainHeader?.title}
                </p>
              </div>
              {/* <div
                className={`w-full lg:flex justify-end gap-4 text-end items-center`}
              >
                <p
                  className={`text-[14px] md:text-xl font-normal bg-gradient-to-b text-[#F6F6F6] mb-5 lg:mb-0 `}
                >
                  {leaderboardPage?.mainHeader?.yourstats}
                </p>
                <div
                  className={`xl:flex grid grid-cols-2 place-items-end gap-3`}
                >
                  {YourStats?.map((state) => {
                    return (
                      <div
                        key={state?.id}
                        className={`flex items-center gap-2`}
                      >
                        <div className="flex items-center gap-1">
                          <p
                            className={`text-xs md:text-sm bg-gradient-to-b text-[#A8A8A8]`}
                          >
                            {state?.title}
                          </p>
                          {state?.infoTipString && (
                            <Infotip body={state.infoTipString} />
                          )}
                        </div>
                        <p className="text-sm md:text-lg font-bold text-[#1F73FC] bg-[#1A1A1A] rounded px-2 py-0.5">
                          {state?.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div> */}
            </div>
          </div>

          <div className={`flex flex-col items-center justify-end w-full `}>
            {/* Weekly Leaderboard */}
            {/* <div
              className={`w-full my-7 xl:my-4 mx-auto flex flex-col items-end gap-2 text-center`}
            >
              <Tooltip body={"Total points of all users this week"}>
                <p className={`font-semibold bg-gradient-to-b text-[#A8A8A8]`}>
                  {leaderboardPage?.mainHeader?.weeklyleaderboard}
                </p>
              </Tooltip>
              <p
                className={`text-3xl lg:text-4xl font-semibold text-[#F6F6F6]`}
              >
                500,000 pts
              </p>
            </div> */}

            <div className="w-full">
              {/* top 3 */}
              <div className="flex items-end justify-center">
                <ToperLeaderboard
                  upperSideCss={" pr-[85px]"}
                  email={leaderboardData[1]?.email}
                  TotalTrades={leaderboardData[1]?.totalTrades}
                  value={leaderboardData[1]?.totalTradeAmount}
                  boxGradientClassName={"h-24 pr-[85px] justify-center"}
                  mainDivClass={" -mr-20 -z-10"}
                  clipPathDivClass={"pr-16 lg:pr-[85px] text-center"}
                  toperUser={SecondUserIcon}
                  topperNumber={Two}
                  clipPathStyle={clipPathTopStyle}
                  boxStyle={"md:w-[300px] lg:w-[380px] xl:w-[420px]"}
                  flag={flag}
                />

                <ToperLeaderboard
                  upperSideCss={""}
                  email={leaderboardData[0]?.email}
                  TotalTrades={leaderboardData[0]?.totalTrades}
                  value={leaderboardData[0]?.totalTradeAmount}
                  boxGradientClassName={"h-44 self-start justify-center "}
                  mainDivClass={""}
                  clipPathDivClass={"text-center"}
                  toperUser={firstUserIcon}
                  topperNumber={One}
                  clipPathStyle={clipPathTop1Style}
                  boxStyle={"md:w-[220px] lg:w-[300px] xl:w-[340px]"}
                  flag={flag}
                />

                <ToperLeaderboard
                  upperSideCss={"pl-[80px]"}
                  email={leaderboardData[2]?.email}
                  TotalTrades={leaderboardData[2]?.totalTrades}
                  value={leaderboardData[2]?.totalTradeAmount}
                  boxGradientClassName={"pl-[80px] justify-center"}
                  mainDivClass={" -ml-20 -z-10"}
                  clipPathDivClass={"pl-16 lg:pl-[80px] text-center"}
                  toperUser={ThirdUserIcon}
                  topperNumber={Three}
                  clipPathStyle={clipPathTopStyle}
                  boxStyle={"md:w-[300px] lg:w-[380px] xl:w-[420px]"}
                  flag={flag}
                />
              </div>

              {/* table data */}
              <div className=" rounded-3xl mt-28"> 

                <div className="w-full h-[50vh]">
                  <div className="overflow-auto h-full">
                    <table
                      className={`w-full max-w-4xl rounded-b-lg  mx-auto `}
                    >
                      <thead>
                        <tr className="sticky -top-1 z-30 bg-[#08080e]  ">
                          {tableHeader.map((header, i) => (
                            <th
                              key={i + 1}
                              className={` text-base font-medium py-5 !text-start`}
                            >
                              <span className={`text-[#A8A8A8]`}>
                                {header.title}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={`mt-5`}>
                        {leaderboardData
                          ?.slice(3, leaderboardData.length)
                          .map((item, i) => (
                            <tr
                              key={i + 1}
                              className={`py-2 text-white border-b border-[#404040]`}
                            >
                              <td className=" text-lg font-medium py-4 ">
                                {i + 4}
                              </td>
                              <td className=" text-base font-medium py-4 ">
                                {`${flag
                                  ? "----"
                                  : `${item?.email?.slice(
                                    0,
                                    3
                                  )}...${item?.email?.slice(-4)}`
                                  }`}
                              </td>
                              <td className=" text-base font-medium py-4 ">
                                {flag ? "----" : item?.totalTrades}
                              </td>
                              <td className=" text-base font-medium py-4">
                                {flag ? "----" : `${item?.totalTradeAmount}`}
                              </td>
                              <td className=" text-base font-medium py-4">
                                {flag ? "----" : item?.referralId}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
