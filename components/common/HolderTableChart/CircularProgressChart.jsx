import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgressChart = ({ scrollPosition, top100Percentage, top49Percentage, top10Percentage }) => {

  const sections = [
    { value: Number(top10Percentage), color: "#facc15" },
    { value: Number(top49Percentage), color: "#3b82f6" },
    { value: Number(top100Percentage), color: "#a855f7" },
  ];

  const one = Number(top10Percentage)
  const two = Number(top49Percentage)
  const three = Number(top100Percentage)

  return (
    <div className="flex justify-center items-center">
      <div className="relative xl:w-[300px] xl:h-[300px] w-[150px] h-[150px] ">
        {/* Layer 4: Others (Background) */}
        <CircularProgressbar
          value={100}
          strokeWidth={8}
          styles={buildStyles({
            pathColor: sections[2].color,
            trailColor: "transparent",
            strokeLinecap: "round",
          })}
        />


        <div className="absolute top-0 left-0 w-full h-full z-10">
          <CircularProgressbar
            value={one}
            strokeWidth={8}
            styles={buildStyles({
              pathColor: sections[1].color,
              trailColor: "transparent",
              strokeLinecap: "round",
              strokeDasharray: "90 10",
            })}
          />
        </div>

        {/* Layer 3: Top 49 */}
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <CircularProgressbar
            value={two}
            strokeWidth={8}
            styles={buildStyles({
              pathColor: sections[1].color,
              trailColor: "transparent",
              strokeLinecap: "round",
              strokeDasharray: "90 10",
            })}
          />
        </div>

        {/* Layer 2: Top 10 */}
        <div className="absolute top-0 left-0 w-full h-full z-20">
          <CircularProgressbar
            value={three}
            strokeWidth={8}
            styles={buildStyles({
              pathColor: sections[0].color,
              trailColor: "transparent",
              strokeLinecap: "round",
              strokeDasharray: "80 20",
            })}
          />
        </div>

        {/* Layer 1: Inner ProgressBar */}
        <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] z-30">
          <CircularProgressbar
            value={100}
            strokeWidth={8}
            styles={buildStyles({
              pathColor: `${sections[2].color}30`, // Assuming sections[2].color provides a hex or rgba color
              background: "transparent",
              trailColor: "transparent",
              strokeLinecap: "round",
              strokeOpacity: 0.1, // Reduced opacity for transparency
            })}
          />
          <div className="absolute top-0 left-0 w-full h-full z-10">
            <CircularProgressbar
              value={one}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: `${sections[1].color}30`, // Assuming sections[1].color provides a hex or rgba color
                background: "transparent",
                trailColor: "transparent",
                strokeLinecap: "round",
                strokeDasharray: "90 10",
                strokeOpacity: 0.1, // Reduced opacity for transparency
              })}
            />

            <div className="absolute top-0 left-0 w-full h-full z-20">
              <CircularProgressbar
                value={two}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: `${sections[0].color}30`, // Assuming sections[0].color provides a hex or rgba color
                  background: "transparent",
                  trailColor: "transparent",
                  strokeLinecap: "round",
                  strokeDasharray: "80 20",
                  strokeOpacity: 0.1, // Reduced opacity for transparency
                })}
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full z-20">
              <CircularProgressbar
                value={three}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: `${sections[0].color}30`, // Assuming sections[0].color provides a hex or rgba color
                  background: "transparent",
                  trailColor: "transparent",
                  strokeLinecap: "round",
                  strokeDasharray: "80 20",
                  strokeOpacity: 0.1, // Reduced opacity for transparency
                })}
              />
            </div>
          </div>
        </div>

        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xxl font-bold text-center z-40">
          <p className="text-3xl font-semibold">{top10Percentage}%</p>
          <div className=" text-[#7b809e] font-light ">Top 10</div>
        </div>
      </div>
    </div>
  );
};

export default CircularProgressChart;

