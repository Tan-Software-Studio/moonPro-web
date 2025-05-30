
import { pump_img } from "@/app/Images";
import Image from "next/image";
import React from "react";
import { BiSolidCapsule } from "react-icons/bi";

const SquareProgressBar = ({
  value,
  maxValue = 100,
  size = 70.5,
  trailColor = "#3c3c44",
  progressColor
}) => {
  const progress = Math.min(Math.max((value / maxValue) * 100, 0), 100); // Ensures progress is between 0 and 100
  const strokeWidth = 2; // Thinner border width
  const halfStrokeWidth = strokeWidth / 2;
  const rectSize = size - strokeWidth; // Inner rectangle size
  const perimeter = rectSize * 4; // Total perimeter of the square
  const progressStrokeDasharray = (perimeter * progress) / 100; // Progress length

  return (
    <div className="flex justify-center items-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Square Progress Bar */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          {/* Background Trail */}
          <rect
            x={halfStrokeWidth}
            y={halfStrokeWidth}
            width={rectSize}
            height={rectSize}
            rx="5"
            fill="none"
            stroke={trailColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress Border */}
          <rect
            x={halfStrokeWidth}
            y={halfStrokeWidth}
            width={rectSize}
            height={rectSize}
            rx="5"
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progressStrokeDasharray}, ${perimeter}`}
            strokeLinecap="round"
          />
        </svg>
        <div
          className="absolute inset-0 flex justify-center items-center text-sm font-semibold"
          style={{ color: progressColor }}
        >
          {Math.round(progress)}%
        </div>
        {/* top-left Icon */}
        {/* <div 
          className="absolute rounded-full bg-black text-white text-xs border border-[#6ec3f5] bottom-12 right-12 p-[1px] z-10">
          <span >
            <BiSolidCapsule />
          </span>
        </div> */}
        <div
          className={`absolute rounded-full bg-black border -top-1.5 -left-1.5 z-50`} style={{ borderColor: progressColor }}>
            <Image src={pump_img} alt="pump_img" className="w-4"/>
        </div>
      </div>
    </div>
  );
};

export default SquareProgressBar;
