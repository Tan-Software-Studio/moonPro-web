import React from "react";
import Image from "next/image";
import { pump_img, yellow_pump } from "@/app/Images";

const RoundProgressBar = ({
  value,
  maxValue = 100,
  size = 70.5,
  strokeWidth = 2,
  trailColor = "#3c3c44",
  progressColor = "#4FAFFE",
  capsuleImg
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex justify-center items-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          {/* Background Trail */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trailColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Center text */}
        {/* <div
          className="absolute inset-0 flex justify-center items-center text-sm font-semibold"
          style={{ color: progressColor }}
        >
          {Math.round(progress)}%
        </div> */}

        {/* top-left icon */}
        <div
          className={`absolute rounded-full bg-black border -top-1.5 -left-2.1 !z-10`}
          style={{ borderColor: progressColor }}
        >
          <Image
            src={capsuleImg ? capsuleImg : pump_img}
            alt="pump_img"
            className="w-4"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default RoundProgressBar;
