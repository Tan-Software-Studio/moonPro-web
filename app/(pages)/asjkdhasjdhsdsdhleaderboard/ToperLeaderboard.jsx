import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const ToperLeaderboard = ({
  email,
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
  flag,
  solanaLivePrice,
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
          <p className="text-[#FFFFFF] font-normal text-xs md:text-sm lg:text-base">
            {`${flag ? "----" : `${email?.slice(0, 5)}...${email?.slice(-4)}`}`}
          </p>
        </div>
        <div
          className={`flex sm:flex-nowrap flex-wrap gap-5 boxGradient ${boxGradientClassName} pt-5 text-center`}
        >

          <div>
            <h4 className="text-[#A8A8A8] text-[10px] md:text-xs">
              {"Total Trades"}
            </h4>
            <h3 className="text-[#F6F6F6] md:font-semibold lg:font-bold text-xs md:text-sm lg:text-base">
              {flag ? "----" : TotalTrades}
            </h3>
          </div>
          <div>
            <h4 className="text-[#A8A8A8] text-[10px] md:text-xs">
              {"Amount"}
            </h4>
            <h3 className="text-[#F6F6F6] md:font-semibold lg:font-bold text-xs md:text-sm lg:text-base">
              {flag ? "----" : `${Number(value).toFixed(5)}`}
            </h3>
          </div>
          <div>
            <h4 className="text-[#A8A8A8] text-[10px] md:text-xs">
              {"Value"}
            </h4>
            <h3 className="text-[#F6F6F6] md:font-semibold lg:font-bold text-xs md:text-sm lg:text-base">
              {flag
                ? "----"
                : `$${(Number(value) * solanaLivePrice).toFixed(2)}`}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToperLeaderboard;
