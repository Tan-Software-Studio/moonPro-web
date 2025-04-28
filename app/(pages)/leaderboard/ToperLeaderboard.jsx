import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const ToperLeaderboard = ({
  walletAddress,
  TotalTrades,
  value,
  boxGradientClassName,
  mainDivClass,
  clipPathStyle,
  clipPathDivClass,
  toperUser,
  topperNumber,
  boxStyle,
  upperSideCss,
}) => {
  const { t, ready } = useTranslation();
  const leaderboardPage = t("leaderboard");
  return (
    <div className={mainDivClass}>
      <div
        className={`mx-auto grid place-items-center gap-3 md:gap-4 lg:gap-5 mb-5 ${upperSideCss}`}
      >
        <Image
          src={toperUser}
          alt="toperUser"
          className="mx-auto rounded-full w-12 md:w-14 xl:w-16"
          style={{
            boxShadow: "0px 0px 40px 0px #FFFFFF40",
          }}
        />
        <Image
          src={topperNumber}
          alt="topperNumber"
          className="mx-auto bg-[#ffffff15] w-5 md:w-6 xl:w-auto"
          style={{
            boxShadow: "0px 0px 40px 0px #FFFFFF40",
          }}
        />
      </div>
      <div className={boxStyle}>
        <div
          className={` mx-auto bg-[#262626] clip-path-custom ${clipPathDivClass}  text-sm pt-2 pb-3`}
          style={clipPathStyle}
        >
          <p className="text-[#6E6E6E] font-normal text-xs md:text-sm lg:text-base">
            <a
              href={`https://solscan.io/account/${walletAddress}`}
              target="_blank"
            >{`${walletAddress?.slice(0, 3)}...${walletAddress?.slice(-4)}`}</a>
          </p>
        </div>
        <div
          className={`flex gap-5 boxGradient ${boxGradientClassName} pt-5 text-center`}
        >
          <div>
            <h4 className="text-[#A8A8A8] text-[10px] md:text-xs">
              {leaderboardPage?.stage?.totaltrades}
            </h4>
            <h3 className="text-[#F6F6F6] md:font-semibold lg:font-bold text-xs md:text-sm lg:text-base">
              {TotalTrades}
            </h3>
          </div>
          <div>
            <h4 className="text-[#A8A8A8] text-[10px] md:text-xs">
              {leaderboardPage?.stage?.value}
            </h4>
            <h3 className="text-[#F6F6F6] md:font-semibold lg:font-bold text-xs md:text-sm lg:text-base">
              ${Number(value).toFixed(2)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToperLeaderboard;
