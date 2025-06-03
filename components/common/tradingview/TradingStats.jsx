"use client";
import { humanReadableFormatWithNoDollar } from "@/utils/basicFunctions";
import React, { useEffect, useState } from "react";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import { SyncLoader } from "react-spinners";

// Utility function to calculate percentage
const calculatePercentage = (value1, value2) => {
  const total = Number(value1) + Number(value2) || 1;
  return {
    val1: Math.round((value1 / total) * 100),
    val2: Math.round((value2 / total) * 100),
  };
};

// Percentage bar component
const PercentageBar = ({ percentage }) => (
  <div className="flex items-center w-full">
    <div
      className="bg-[#21CB6B] h-[2px] ease-in-out duration-200"
      style={{ width: `${percentage?.val1 || 50}%` }}
    ></div>
    <div
      className="bg-[#ED1B247A] h-[2px] ease-in-out duration-200"
      style={{ width: `${percentage?.val2 || 50}%` }}
    ></div>
  </div>
);

// Data Row component for displaying stats
const DataRow = ({
  label,
  value,
  label1,
  value1,
  label2,
  value2,
  percentage,
  infoTipString,
}) => (
  <div className="flex w-full">
    {label == "VOL" ? (
      <>
        <div className="flex flex-col items-start w-[100px]">
          <div className="flex items-center gap-1">
            <div className="font-[400] text-[12px] text-[rgb(168,168,168)]">
              {label}
            </div>
            <Infotip body={infoTipString} />
          </div>
          <div className="font-[700] text-[14px] text-[#F6F6F6]">
            ${humanReadableFormatWithNoDollar(Number(value), 0)}
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <div className="font-[400] text-[12px] text-[#A8A8A8]">
                {label1}
              </div>
              <div className="font-[700] text-[14px] text-[#F6F6F6]">
                ${humanReadableFormatWithNoDollar(Number(value1), 0)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-[400] text-[12px] text-[#A8A8A8]">
                {label2}
              </div>
              <div className="font-[700] text-[14px] text-[#F6F6F6]">
                ${humanReadableFormatWithNoDollar(Number(value2), 0)}
              </div>
            </div>
          </div>
          <PercentageBar percentage={percentage} />
        </div>
      </>
    ) : (
      <>
        <div className="flex flex-col items-start w-[100px]">
          <div className="flex items-center gap-1">
            <div className="font-[400] text-[12px] text-[#A8A8A8]">{label}</div>
            <Infotip body={infoTipString} />
          </div>
          <div className="font-[700] text-[14px] text-[#F6F6F6]">
            {humanReadableFormatWithNoDollar(value)}
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <div className="font-[400] text-[12px] text-[#A8A8A8]">
                {label1}
              </div>
              <div className="font-[700] text-[14px] text-[#F6F6F6]">
                {humanReadableFormatWithNoDollar(value1)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-[400] text-[12px] text-[#A8A8A8]">
                {label2}
              </div>
              <div className="font-[700] text-[14px] text-[#F6F6F6]">
                {humanReadableFormatWithNoDollar(value2)}
              </div>
            </div>
          </div>
          <PercentageBar percentage={percentage} />
        </div>
      </>
    )}
  </div>
);

const TradingStats = ({ tragindViewPage, data, timeframes }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("5M");
  const [currentData, setCurrentData] = useState(data[selectedTimeframe]);
  const [percentages, setPercentages] = useState({});

  useEffect(() => {
    const calculatePercentages = async () => {
      const [per1, per2, per3] = await Promise.all([
        calculatePercentage(currentData?.buys, currentData?.sells),
        calculatePercentage(currentData?.buyVol, currentData?.sellVol),
        calculatePercentage(currentData?.buyers, currentData?.sellers),
      ]);
      setPercentages({ per1, per2, per3 });
    };

    calculatePercentages();
  }, [currentData]);
  useEffect(
    () => setCurrentData(data[selectedTimeframe]),
    [selectedTimeframe, data]
  );

  return (
    <div className="bg-[#08080E] text-white h-fit p-[24px] w-full mx-auto xl:p-4 md:p-3">
      <div className="flex justify-between gap-[1px] mb-4">
        {timeframes.map(({ label, value }) => (
          <div
            key={label}
            onClick={() => setSelectedTimeframe(label)}
            className={`select-none cursor-pointer outline-none flex items-center justify-center w-[77px] h-[54px] rounded-[4px] ease-linear duration-200 ${selectedTimeframe === label
              ? `${value > 0
                ? "bg-[#1c894bb7] border-[0.5px] border-[#21CB6B]"
                : "bg-[#ED1B247A] border-[0.5px] border-[#ED1B247A]"
              }`
              : "border-[0.5px] border-transparent"
              }`}
          >
            <div className="flex flex-col">
              <div className="text-center text-[12px] font-[400]">{label}</div>
              <div
                className={`text-center text-[14px] font-[600] ${selectedTimeframe === label
                  ? value > 0
                    ? "text-[#21cb6bcc]"
                    : "text-[#ED1B247A]"
                  : value > 0
                    ? "text-[#21CB6B]"
                    : "text-[#ED1B24]"
                  }`}
              >
                {isNaN(value) ? <SyncLoader color="red" size={6} /> : `${value} %`}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[8px] w-full">
        <DataRow
          label={tragindViewPage?.right?.stats?.tx}
          value={currentData?.txns}
          label1={tragindViewPage?.right?.stats?.buys}
          value1={currentData?.buys}
          label2={tragindViewPage?.right?.stats?.sells}
          value2={currentData?.sells}
          percentage={percentages.per1}
          infoTipString={tragindViewPage?.right?.stats?.txtool}
        />
        <DataRow
          label={tragindViewPage?.right?.stats?.vol}
          value={currentData?.vol}
          label1={tragindViewPage?.right?.stats?.buyvol}
          value1={currentData?.buyVol}
          label2={tragindViewPage?.right?.stats?.sellvol}
          value2={currentData?.sellVol}
          percentage={percentages.per2}
          infoTipString={tragindViewPage?.right?.stats?.voltool}
        />
        <DataRow
          label={tragindViewPage?.right?.stats?.makers}
          value={currentData?.makers}
          label1={tragindViewPage?.right?.stats?.buyers}
          value1={currentData?.buyers}
          label2={tragindViewPage?.right?.stats?.sellers}
          value2={currentData?.sellers}
          percentage={percentages.per3}
          infoTipString={tragindViewPage?.right?.stats?.makerstool}
        />
      </div>
    </div>
  );
};

export default TradingStats;
