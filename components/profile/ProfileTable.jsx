import React from "react";
import { ProgressBar } from "react-loader-spinner";

const ProfileTable = ({ title }) => {
  const pnlData = [
    {
      id: 1,
      title: "win RATE",
      amount: "$0",
    },
    {
      id: 2,
      title: "UNREALIZED PROFITS",
      amount: "$0",
    },
    {
      id: 3,
      title: "TOTAL COST",
      amount: "$0",
    },
    {
      id: 4,
      title: "TOKEN AVERAGE COST",
      amount: "$0",
    },
    {
      id: 5,
      title: "TOKEN AVERAGE REALIZED PROFITS",
      amount: "$0",
    },
    {
      id: 6,
      title: "SOL BALANCE",
      amount: "0 SOL ($0)",
    },
  ];

  const distributionData = [
    {
      id: 1,
      title: ">500%",
      amount: "1",
      color: "bg-[#24C366]",
    },
    {
      id: 2,
      title: "100% - 500%",
      amount: "3",
      color: "bg-[#1A8045]",
    },
    {
      id: 3,
      title: "0% - 200%",
      amount: "7",
      color: "bg-[#124D2B]",
    },
    {
      id: 4,
      title: "0 - -50%",
      amount: "2",
      color: "bg-[#9F141D]",
    },
    {
      id: 5,
      title: "←50%",
      amount: "12",
      color: "bg-[#ED1B24]",
    },
  ];

  return (
    <div className="border-l-[1px] border-[#404040] border-b-[1px] md:border-l-[1px] border-t-[1px] md:border-t-0">
      <div className="px-4 lg:px-8 py-3 border-t-[1px] border-[#404040] bg-[#1F1F1F] w-full text-sm md:text-base">
        {title}
      </div>

      {title == "Balance" && (
        <div className="px-4 lg:px-8 flex flex-col justify-between min-h-[200px] md:h-[250px] gap-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
                PNL
              </div>
              <div className="text-base md:text-lg">$293.2K</div>
            </div>
            <div>
              <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
                Winrate
              </div>
              <div className="text-base md:text-lg">45.59%</div>
            </div>
          </div>
          <div>
            <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
              USD
            </div>
            <div className="text-base md:text-lg">$20.2K</div>
          </div>
          <div>
            <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
              LIQUIDITY
            </div>
            <div className="text-base md:text-lg">$10.94K</div>
          </div>
        </div>
      )}

      {title == "PnL" && (
        <div className="px-4 lg:px-8 flex flex-col justify-between min-h-[200px] md:h-[250px] gap-2 md:gap-3 py-3">
          {pnlData.map(({ id, title, amount }) => (
            <div className="flex items-center justify-between" key={id}>
              <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
                {title}
              </div>
              <div className="text-xs md:text-base text-white">{amount}</div>
            </div>
          ))}
        </div>
      )}

      {title == "Distribution" && (
        <div className="px-4 lg:px-8 flex flex-col justify-between min-h-[200px] md:h-[250px] gap-2 md:gap-3 py-3">
          {distributionData.map(({ id, title, amount, color }) => (
            <div className="flex items-center justify-between" key={id}>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${color}`}></div>
                <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
                  {title}
                </div>
              </div>
              <div className="text-xs md:text-base text-white">{amount}</div>
            </div>
          ))}

          <div className="w-full h-2 mb-4 rounded-full relative mt-2">
            <div
              className="absolute left-0 h-full bg-[#24C366] rounded-l-full"
              style={{ width: "10%" }}
            ></div>
            <div
              className="absolute left-[10%] h-full rounded-r-full bg-[#1A8045]"
              style={{ width: "10%" }}
            ></div>
            <div
              className="absolute left-[20%] h-full rounded-r-full bg-[#124D2B]"
              style={{ width: "30%" }}
            ></div>
            <div
              className="absolute left-[40%] h-full rounded-r-full bg-[#9F141D]"
              style={{ width: "10%" }}
            ></div>
            <div
              className="absolute left-[45%] h-full rounded-r-full bg-[#ED1B24]"
              style={{ width: "50%" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTable;
