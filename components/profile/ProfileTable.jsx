import React from "react";
import { useTranslation } from "react-i18next";

const ProfileTable = ({ title }) => {
  const { t } = useTranslation();
  const newProfile = t("newProfile");
  const pnlData = [
    {
      id: 1,
      title: newProfile?.winRate,
      amount: "$0",
    },
    {
      id: 2,
      title: newProfile?.UNREALIZEDPROFITS,
      amount: "$0",
    },
    {
      id: 3,
      title: newProfile?.TOTALCOST,
      amount: "$0",
    },
    {
      id: 4,
      title: newProfile?.TOKENAVERAGECOST,
      amount: "$0",
    },
    {
      id: 5,
      title: newProfile?.TOKENPROFITS,
      amount: "$0",
    },
    {
      id: 6,
      title: newProfile?.SOLBALANCE,
      amount: "0 SOL ($0)",
    },
  ];

  const distributionData = [
    {
      id: 1,
      title: ">500%",
      amount: "---",
      color: "bg-[#24C366]",
    },
    {
      id: 2,
      title: "100% - 500%",
      amount: "---",
      color: "bg-[#1A8045]",
    },
    {
      id: 3,
      title: "0% - 200%",
      amount: "---",
      color: "bg-[#124D2B]",
    },
    {
      id: 4,
      title: "0 -50%",
      amount: "---",
      color: "bg-[#9F141D]",
    },
    {
      id: 5,
      title: "←50%",
      amount: "---",
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
               {newProfile?.PNL} 
              </div>
              <div className="text-base md:text-lg">---</div>
            </div>
            <div>
              <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
              {newProfile?.Winrate} 
              </div>
              <div className="text-base md:text-lg">---</div>
            </div>
          </div>
          <div>
            <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
           USD
            </div>
            <div className="text-base md:text-lg">---</div>
          </div>
          <div>
            <div className="text-[#A8A8A8] text-xs md:text-sm uppercase">
              {newProfile?.LIQUIDITY}
            </div>
            <div className="text-base md:text-lg">---</div>
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
