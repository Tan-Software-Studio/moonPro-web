"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";
import { setselectToken, setselectTokenLogo } from "@/app/redux/CommonUiData";
import Table from "@/components/TradingChart/Table";
import { solana } from "@/app/Images";
import {
  getSoalanaTokenBalance,
} from "@/utils/solanaNativeBalance";
import { decimalConvert } from "@/utils/basicFunctions";
import axiosInstance from "@/components/axiosIntance/axiosInstance";
import TVChartContainer from "@/components/TradingChart/TradingChart";
import TokenDetails from "@/components/common/tradingview/TokenDetails";
import TradingStats from "@/components/common/tradingview/TradingStats";
import TradingPopup from "@/components/common/tradingview/TradingPopup";
import TokenInfo from "@/components/common/tradingview/TokenInfo";
import DataSecurity from "@/components/common/tradingview/DataSecurity";
import { useTranslation } from "react-i18next";
import { fetchSolanaNativeBalance } from "@/app/redux/states";

const Tradingview = () => {
  const { t } = useTranslation();
  const tragindViewPage = t("tragindViewPage");
  const [activeTab, setActiveTab] = useState("buy");
  const [dataLoaderForChart, setDataLoaderForChart] = useState(false);
  const latestTradesData = useSelector((state) => state.allCharTokenData);
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const [tokenBalance, setTokenBalance] = useState(0);
  const searchParams = useSearchParams();
  const [chartTokenData, setchartTokenData] = useState({});
  const tokenaddress = searchParams.get("tokenaddress");
  const tokenSymbol = searchParams.get("symbol");
  let pairAddress = searchParams?.get("pair") || null;
  const pathname = usePathname();
  const getNetwork = pathname.split("/")[2];
  const containerRef = useRef(null);
  const tvChartRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollableDivRef4 = useRef(null);
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  // native balance
  const nativeTokenbalance = useSelector((state) => state?.AllStatesData?.solNativeBalance)

  const [smallScreenTab, setIsSmallScreenTab] = useState("Trades");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    dispatch(setselectToken("Solana"));
    dispatch(setselectTokenLogo(solana));
  }, []);

  useEffect(() => {
    localStorage.setItem("chartTokenAddress", tokenaddress);
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollAmount = containerRef.current.scrollTop;
        setScrollPosition(scrollAmount);
      }
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const fetchTokenMeta = async () => {
      const [singleTokenBalance, solBalance] = await Promise.all([
        getSoalanaTokenBalance(solWalletAddress, tokenaddress),
        dispatch(fetchSolanaNativeBalance(solWalletAddress)),
      ]);
      if (singleTokenBalance) {
        setTokenBalance(singleTokenBalance || 0);
      }
    };
    fetchTokenMeta();
  }, [solWalletAddress, tokenaddress]);
  const handleCopy = (mintAddress) => {
    setCopied(true);
    // toast.success("TokenAddress copied to clipboard!", {
    //   position: "top-center",
    // });
    if (mintAddress) {
      const formattedAddress = mintAddress;
      navigator.clipboard
        ?.writeText(formattedAddress)
        .then(() => { })
        .catch((err) => {
          console.error("Failed to copy: ", err?.message);
        });
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const TokenDetailsNumberData = [
    {
      label: "Price USD",
      price: latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD,
    },
    {
      label: "Liqudity",
      price: chartTokenData?.Liqudity || 0,
    },
    {
      label: "FDV",
      price: `$${chartTokenData?.marketCap || 0}`,
    },
    {
      label: "MKT CAP",
      price: `$${chartTokenData?.marketCap || 0}`,
    },
  ];

  const tradeData = {
    "5M": {
      txns:
        chartTokenData?.totalTxns5min == "NaN"
          ? 0
          : chartTokenData?.totalTxns5min || 0,
      buys:
        chartTokenData?.buys_5min == "NaN" ? 0 : chartTokenData?.buys_5min || 0,
      sells:
        chartTokenData?.sells_5min == "NaN"
          ? 0
          : chartTokenData?.sells_5min || 0,
      vol:
        chartTokenData?.totalVol5min == "$NaN"
          ? 0
          : chartTokenData?.totalVol5min || 0,
      buyVol:
        chartTokenData?.buy_volume_5min == "$NaN"
          ? 0
          : chartTokenData?.buy_volume_5min || 0,
      sellVol:
        chartTokenData?.sell_volume_5min == "$NaN"
          ? 0
          : chartTokenData?.sell_volume_5min || 0,
      makers:
        chartTokenData?.totalMakers5min == "NaN"
          ? 0
          : chartTokenData?.totalMakers5min || 0,
      buyers:
        chartTokenData?.buyers_5min == "NaN"
          ? 0
          : chartTokenData?.buyers_5min || 0,
      sellers:
        chartTokenData?.sellers_5min == "NaN"
          ? 0
          : chartTokenData?.sellers_5min || 0,
    },
    "1H": {
      txns:
        chartTokenData?.totalTxns1h == "NaN"
          ? 0
          : chartTokenData?.totalTxns1h || 0,
      buys: chartTokenData?.buys_1h == "NaN" ? 0 : chartTokenData?.buys_1h || 0,
      sells:
        chartTokenData?.sells_1h == "NaN" ? 0 : chartTokenData?.sells_1h || 0,
      vol:
        chartTokenData?.totalVol1h == "$NaN"
          ? 0
          : chartTokenData?.totalVol1h || 0,
      buyVol:
        chartTokenData?.buy_volume_1h == "$NaN"
          ? 0
          : chartTokenData?.buy_volume_1h || 0,
      sellVol:
        chartTokenData?.sell_volume_1h == "$NaN"
          ? 0
          : chartTokenData?.sell_volume_1h || 0,
      makers:
        chartTokenData?.totalMakers1h == "NaN"
          ? 0
          : chartTokenData?.totalMakers1h || 0,
      buyers:
        chartTokenData?.buyers_1h == "NaN" ? 0 : chartTokenData?.buyers_1h || 0,
      sellers:
        chartTokenData?.sellers_1h == "NaN"
          ? 0
          : chartTokenData?.sellers_1h || 0,
    },
    "6H": {
      txns:
        chartTokenData?.totalTxns6h == "NaN"
          ? 0
          : chartTokenData?.totalTxns6h || 0,
      buys: chartTokenData?.buys_6h == "NaN" ? 0 : chartTokenData?.buys_6h || 0,
      sells:
        chartTokenData?.sells_6h == "NaN" ? 0 : chartTokenData?.sells_6h || 0,
      vol:
        chartTokenData?.totalVol6h == "$NaN"
          ? 0
          : chartTokenData?.totalVol6h || 0,
      buyVol:
        chartTokenData?.buy_volume_6h == "$NaN"
          ? 0
          : chartTokenData?.buy_volume_6h || 0,
      sellVol:
        chartTokenData?.sell_volume_6h == "$NaN"
          ? 0
          : chartTokenData?.sell_volume_6h || 0,
      makers:
        chartTokenData?.totalMakers6h == "NaN"
          ? 0
          : chartTokenData?.totalMakers6h || 0,
      buyers:
        chartTokenData?.buyers_6h == "NaN" ? 0 : chartTokenData?.buyers_6h || 0,
      sellers:
        chartTokenData?.sellers_6h == "NaN"
          ? 0
          : chartTokenData?.sellers_6h || 0,
    },
    "24H": {
      txns:
        chartTokenData?.totalTxns24h == "NaN"
          ? 0
          : chartTokenData?.totalTxns24h || 0,
      buys:
        chartTokenData?.buys_24h == "NaN" ? 0 : chartTokenData?.buys_24h || 0,
      sells:
        chartTokenData?.sells_24h == "NaN" ? 0 : chartTokenData?.sells_24h || 0,
      vol:
        chartTokenData?.totalVol24h == "$NaN"
          ? 0
          : chartTokenData?.totalVol24h || 0,
      buyVol:
        chartTokenData?.buy_volume_24h == "$NaN"
          ? 0
          : chartTokenData?.buy_volume_24h || 0,
      sellVol:
        chartTokenData?.sell_volume_24h == "$NaN"
          ? 0
          : chartTokenData?.sell_volume_24h || 0,
      makers:
        chartTokenData?.totalMakers24h == "NaN"
          ? 0
          : chartTokenData?.totalMakers24h || 0,
      buyers:
        chartTokenData?.buyers_24h == "NaN"
          ? 0
          : chartTokenData?.buyers_24h || 0,
      sellers:
        chartTokenData?.sellers_24h == "NaN"
          ? 0
          : chartTokenData?.sellers_24h || 0,
    },
  };

  const timeframesTrade = [
    {
      label: "5M",
      value:
        chartTokenData?.perfomancePertnage_5min == "NaN"
          ? 0
          : `${Number(chartTokenData?.perfomancePertnage_5min).toFixed(2)}` ||
          "N/A",
    },
    {
      label: "1H",
      value:
        chartTokenData?.perfomancePertnage_1h == "NaN"
          ? 0
          : `${Number(chartTokenData?.perfomancePertnage_1h).toFixed(2)}` ||
          "N/A",
    },
    {
      label: "6H",
      value:
        chartTokenData?.perfomancePertnage_6h == "NaN"
          ? 0
          : `${Number(chartTokenData?.perfomancePertnage_6h).toFixed(2)}` ||
          "N/A",
    },
    {
      label: "24H",
      value:
        chartTokenData?.perfomancePertnage_24h == "NaN"
          ? 0
          : `${Number(chartTokenData?.perfomancePertnage_24h).toFixed(2)}` ||
          "N/A",
    },
  ];

  const tokenInfo = [
    {
      label: `${tragindViewPage?.right?.tokeninfo?.price} USD`,
      price: `$${decimalConvert(
        latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD || 0
      )}`,
    },
    {
      label: `${tragindViewPage?.right?.tokeninfo?.price} ${getNetwork == "solana" ? "SOL" : "WETH"
        }`,
      price: `$${decimalConvert(chartTokenData?.price_in_sol || 0)}`,
    },
    {
      label: tragindViewPage?.right?.tokeninfo?.supply,
      price: chartTokenData?.currentSupply,
    },
    {
      label: tragindViewPage?.right?.tokeninfo?.liq,
      price: chartTokenData?.Liqudity || 0,
    },
    {
      label: "FDV",
      price: `$${chartTokenData?.marketCap || 0}`,
    },
    {
      label: tragindViewPage?.right?.tokeninfo?.mc,
      price: `$${chartTokenData?.marketCap || 0}`,
    },
  ];

  const dataAndSecurity = [
    {
      label: "Mint Authority",
      value: chartTokenData?.mint_authority ? "Available" : "Disabled",
    },
    {
      label: "Freeze Authority",
      value: chartTokenData?.freeze_authority ? "Available" : "Disabled",
    },
    {
      label: "LP Burned",
      value: `${Number(chartTokenData?.lp).toFixed(2) || 100}%`,
    },
    {
      label: "Top 10 Holders",
      value: Number(chartTokenData?.TopHolders),
    },
    {
      label: `Pooled ${tokenSymbol}`,
      value: `${chartTokenData?.Pooled_Base} | ${chartTokenData?.Pooled_Base_format}`,
    },
    {
      label: "Pooled SOL",
      value: `${chartTokenData?.Pooled_Quote_Native} | ${chartTokenData?.Pooled_Quote_Native_format}`,
    },
  ];
  // Token Chart Data (Right Side)
  const chartTokenDataAPI = async () => {
    setDataLoaderForChart(true);
    await axiosInstance
      .post("combineData", {
        address: tokenaddress,
        pair: pairAddress || null,
      })
      .then((res) => {
        setDataLoaderForChart(false);
        const tokenData = res?.data?.data;
        setchartTokenData(tokenData);
        // console.log('tokenData', tokenData);
        localStorage.setItem("chartSupply", tokenData?.rawsupply || 0);
        localStorage.setItem("solPrice", tokenData?.solPrice || 0);
        localStorage.setItem("chartTokenCreator", tokenData?.tokenCreator || 0);
      })
      .catch((err) => {
        console.log("🚀 ~ chartTokenDataAPI ~ err:", err?.message);
      });
  };

  useEffect(() => {
    chartTokenDataAPI();
  }, [tokenaddress]);

  const isSidebarOpen = useSelector(
    (state) => state?.AllthemeColorData?.isSidebarOpen
  );

  return (
    <div
      className={`lg:flex relative overflow-y-auto h-[86vh] md:h-[91vh] lg:h-[100vh] ${isSidebarOpen ? "ml-0 mr-0" : " md:ml-2.5 ml-2 mr-2"
        }`}
    >
      {isSmallScreen && (

        <div className="md:hidden flex  items-center justify-start bg-[#1F1F1F] rounded-md mt-2 text-white   text-[12px] font-semibold px-2 py-1">

          {["Trades", "Transaction"].map((item, index) => (
            <div
              onClick={() => setIsSmallScreenTab(item)}
              className={`${smallScreenTab === item
                ? "bg-[#11265B] border-2 border-[#0E43BD]"
                : "border-[1px] border-[#1F1F1F]"
                } cursor-pointer  min-w-fit w-20 text-sm font-light flex justify-center tracking-wider px-2 py-1 rounded-md`}
              key={index}>
              {item}
            </div>
          ))}
        </div>
      )}
      {/* left side */}
      <div className="lg:!h-[91vh] h-svh mb-2 lg:w-[80%] grid place-items-center text-[#8d93b752] overflow-y-auto w-full">
        {/* original live chart */}
        <div ref={containerRef} className="md:h-screen h-fit w-full overflow-y-auto">
          {(!isSmallScreen || smallScreenTab === "Trades") && (
            <>
              <div>
                <TokenDetails
                  tokenSymbol={tokenSymbol}
                  tokenaddress={tokenaddress}
                  copied={copied}
                  handleCopy={handleCopy}
                  TokenDetailsNumberData={TokenDetailsNumberData}
                  chartTokenData={chartTokenData}
                  walletAddress={solWalletAddress}
                />
              </div>

              <div ref={tvChartRef} className="h-[600px] w-full">
                <TVChartContainer
                  tokenSymbol={tokenSymbol}
                  tokenaddress={tokenaddress}
                />
              </div>
            </>
          )
          }
          {(!isSmallScreen || smallScreenTab === "Transaction") && (
            <div className="overflow-y-auto border-t border-t-[#4D4D4D]">
              <Table
                tokenCA={tokenaddress}
                address={solWalletAddress}
                scrollPosition={scrollPosition}
                tvChartRef={tvChartRef}
                solWalletAddress={solWalletAddress}
              />
            </div>
          )}
        </div>
      </div>

      {/* right side */}
      {(!isSmallScreen || smallScreenTab === "Trades") && (


        <div
          ref={scrollableDivRef4}
          className="lg:h-[91.5vh] overflow-y-auto w-full lg:w-[25%] border-b border-b-[#404040] md:border-l md:border-l-[#404040] space-y-2 md:space-y-0"
        >
          <div className="flex sm:flex-col flex-col-reverse gap-2">
            <div className="p-1 w-full border border-[#4D4D4D] md:border-l-0 md:border-r-0 md:border-t-0">
              <TradingStats
                tragindViewPage={tragindViewPage}
                data={tradeData}
                timeframes={timeframesTrade}
              />
            </div>

            <div className="p-1 w-full border border-[#4D4D4D] md:border-t-0 md:border-l-0 md:border-r-0 md:border-b-0">
              <TradingPopup
                tragindViewPage={tragindViewPage}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                token={tokenaddress}
                walletAddress={solWalletAddress}
                setTokenBalance={setTokenBalance}
                tokenBalance={tokenBalance}
                tokenName={tokenSymbol}
                nativeTokenbalance={nativeTokenbalance}
                decimal={chartTokenData?.decimal}
                progranAddress={chartTokenData?.programAddress}
                bondingProgress={chartTokenData?.bondingCurveProgress || 0}
                price={latestTradesData?.latestTrades?.[0]?.Trade?.PriceInUSD}
                dispatch={dispatch}
              />
            </div>
          </div>

          <div className="w-full border border-[#4D4D4D] md:border-l-0 md:border-r-0 md:border-b-0">
            <TokenInfo
              tragindViewPage={tragindViewPage?.right?.tokeninfo}
              tokenInfo={tokenInfo}
              dataLoaderForChart={dataLoaderForChart}
            />
          </div>

          <div className="w-full border border-[#4D4D4D] md:border-l-0 md:border-r-0">
            <DataSecurity
              tragindViewPage={tragindViewPage?.right?.datasecurity}
              activeTab={activeTab}
              dataAndSecurity={dataAndSecurity}
              dataLoaderForChart={dataLoaderForChart}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tradingview;
