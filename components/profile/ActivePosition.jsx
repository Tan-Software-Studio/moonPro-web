import { NoDataLogo } from "@/app/Images";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pnlPercentage } from "./calculation";
import { useTranslation } from "react-i18next";
import InstantSell from "./InstantSell";
import { setActiveChartToken } from "@/app/redux/chartDataSlice/chartData.slice";
import { FiUpload } from "react-icons/fi";
import SharePnLModal from "../common/tradingview/SharePnLModal";
import Tooltip from "../common/Tooltip/ToolTip";
import { FaArrowUp } from "react-icons/fa6";

const ActivePosition = ({
  filteredActivePosition,
  activePositionSearchQuery,
}) => {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [quickSellTokenData, setQuickSellTokenData] = useState({});
  const [currentPnlDataToShow, setCurrentPnlDataToShow] = useState({});
  const [isSharePnLModalActive, setIsSharePnLModalActive] = useState(false);
  const [currentPnlDataToShowSymbol, setCurrentPnlDataToShowSymbol] =
    useState(null);
  const dispatch = useDispatch();
  const currentTabData = useSelector(
    (state) => state?.setPnlData?.PnlData || []
  );
  const initialLoading = useSelector(
    (state) => state?.setPnlData?.initialLoading
  );
  const isDataLoaded = useSelector((state) => state?.setPnlData?.isDataLoaded);
  const hasAttemptedLoad = useSelector(
    (state) => state?.setPnlData?.hasAttemptedLoad
  );
  const solanaLivePrice = useSelector(
    (state) => state?.AllStatesData?.solanaLivePrice
  );

  const { t } = useTranslation();
  const referral = t("referral");

  const handleCopy = (address, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const shouldShowLoading =
    initialLoading || (!hasAttemptedLoad && !isDataLoaded);
  const shouldShowData =
    !initialLoading &&
    isDataLoaded &&
    currentTabData?.length > 0 &&
    filteredActivePosition?.length > 0;
  const shouldShowNoData =
    !initialLoading &&
    hasAttemptedLoad &&
    isDataLoaded &&
    currentTabData?.length === 0;
  const shouldNoSearchData =
    !initialLoading &&
    isDataLoaded &&
    currentTabData?.length > 0 &&
    filteredActivePosition.length === 0;

  function pnlDollarCalc(item) {
    return (
      (item.activeQtyHeld - item?.quantitySold) *
      (item.current_price - item.averageBuyPrice)
    );
  }

  const navigateToChartSreen = (item) => {
    dispatch(setActiveChartToken({ symbol: item?.symbol, img: item?.img }));
    router.push(`/meme/${item?.token}`);
  };

  const handleSharePnlButton = (newPnlData) => {
    if (shouldShowData) {
      setCurrentPnlDataToShow(convertPnlDataToSharePnl(newPnlData));
      setCurrentPnlDataToShowSymbol(newPnlData.symbol);
      setIsSharePnLModalActive(true);
    }
  };

  const convertPnlDataToSharePnl = (pnlData) => {
    const buyAmount = pnlData?.activeQtyHeld * pnlData?.averageBuyPrice || 0;
    const solBuyAmount =
      pnlData?.activeQtyHeld * pnlData?.averageSolBuyPrice || 0;
    const soldAmount =
      pnlData?.quantitySold * pnlData?.averageHistoricalSellPrice || 0;
    const solSellAmount =
      pnlData?.quantitySold * pnlData?.averageSolSellPrice || 0;
    const activeQtyHeld = pnlData?.activeQtyHeld || 0;
    const quantitySold = pnlData?.quantitySold || 0;
    const averageBuyPrice = pnlData?.averageBuyPrice || 0;

    const holdingRawAmount = activeQtyHeld - quantitySold;
    const availableQtyInUSDWhenBought = holdingRawAmount * averageBuyPrice;
    const holdingsUsdInCurrentPrice =
      holdingRawAmount * (pnlData?.current_price || 0);
    const holdingSolInCurrentPrice =
      holdingsUsdInCurrentPrice / solanaLivePrice;

    const pnlAmount = holdingsUsdInCurrentPrice - availableQtyInUSDWhenBought;
    const isPositivePnL = pnlAmount >= 0;
    const absolutePnL = Math.abs(pnlAmount);
    const absoluteSolPnL = absolutePnL / solanaLivePrice;

    const pnlPercent =
      availableQtyInUSDWhenBought !== 0
        ? (pnlAmount / availableQtyInUSDWhenBought) * 100
        : 0;

    const safePnLPercent = isNaN(pnlPercent) ? 0 : pnlPercent;

    return {
      buyAmount,
      solBuyAmount,
      averageBuyPrice,
      averageSolBuyPrice: pnlData?.averageSolBuyPrice || 0,
      soldAmount,
      solSellAmount,
      averageSellPrice: pnlData?.averageHistoricalSellPrice || 0,
      averageSolSellPrice: pnlData?.averageSolSellPrice || 0,
      holdingRawAmount,
      holdingsUsdInCurrentPrice,
      holdingSolInCurrentPrice,
      isPositivePnL,
      absolutePnL,
      absoluteSolPnL,
      safePnLPercent,
    };
  };

  return (
    <>
      <div className="overflow-auto h-[400px] max-h-[450px]">
        {shouldShowLoading ? (
          <div
            className="snippet flex justify-center items-center mt-24   "
            data-title=".dot-spin"
          >
            <div className="stage">
              <div className="dot-spin"></div>
            </div>
          </div>
        ) : shouldShowData ? (
          <div className="min-w-full">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b bg-[#08080E] border-gray-800 z-40">
                <tr>
                  <th className="px-4 py-2 text-slate-300 font-medium">
                    Token
                  </th>
                  <th className="px-4 py-2 text-slate-300 font-medium">
                    Bought
                  </th>
                  <th className="px-4 py-2 text-slate-300 font-medium">Sold</th>
                  <th className="px-4 py-2 text-slate-300 font-medium">
                    Remaining
                  </th>
                  <th className="px-4 py-2 text-slate-300 font-medium">PnL</th>
                  <th className="px-4 py-2 text-slate-300 font-medium">
                    Action
                  </th>
                  {/* <th className="px-4 py-2 text-slate-300 font-medium">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredActivePosition?.map((item, index) => (
                  <tr
                    onClick={() => navigateToChartSreen(item)}
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-800/20" : ""}
                                         border-b border-slate-700/20 hover:bg-slate-800/30 cursor-pointer transition-colors duration-200`}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        {item?.img || item?.img != null ? (
                          <img
                            src={item?.img}
                            alt="Token Icon"
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md  flex items-center justify-center bg-[#3b3b49] border border-[#1F73FC]">
                            <span className="text-sm text-white uppercase text-center">
                              {item?.symbol.toString()?.slice(0, 1) || "T"}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-base text-white truncate">
                              {item?.symbol} /
                            </p>
                            <p className="font-medium truncate  text-sm text-gray-400 ">
                              {item?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]">
                              {item?.token}
                            </span>
                            <button
                              onClick={(e) => handleCopy(item?.token, index, e)}
                              className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded transition-colors duration-200"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400 hover:text-slate-200" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Bought */}
                    <td className="px-4 py-2">
                      <p className="font-semibold  text-emerald-500 ">
                        $
                        {Number(
                          item?.activeQtyHeld * item?.averageBuyPrice
                        ).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-xs ">
                        {Number(item.activeQtyHeld).toFixed(2)}{" "}
                        {item?.symbol?.length > 5
                          ? item.symbol.slice(0, 5) + "..."
                          : item.symbol}
                      </p>
                    </td>

                    {/* Sold */}
                    <td className="px-4 py-2">
                      <p className="font-semibold text-red-500  ">
                        $
                        {Number(
                          item?.quantitySold * item?.averageHistoricalSellPrice
                        ).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-xs ">
                        {Number(item.quantitySold).toFixed(2)}{" "}
                        {item?.symbol?.length > 5
                          ? item.symbol.slice(0, 5) + "..."
                          : item.symbol}
                      </p>
                    </td>

                    {/* Remaining */}
                    <td className="px-4 py-2">
                      <p className="font-semibold text-white">
                        $
                        {(
                          (item.activeQtyHeld - item.quantitySold) *
                          item?.current_price
                        ).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-xs  ">
                        {(item.activeQtyHeld - item.quantitySold).toFixed(2)}{" "}
                        {item?.symbol?.length > 5
                          ? item.symbol.slice(0, 5) + "..."
                          : item.symbol}
                      </p>
                    </td>

                    {/* PnL */}
                    <td className="px-4 py-2 ">
                      <div className="flex items-center gap-0.5 text-base font-semibold whitespace-nowrap break-keep">
                        <p
                          className={`${
                            pnlDollarCalc(item) >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          } `}
                        >
                          {`${pnlDollarCalc(item) >= 0 ? "$" : "-$"}${Math.abs(
                            pnlDollarCalc(item)
                          ).toFixed(2)}`}
                        </p>

                        <p
                          className={`${
                            pnlPercentage(
                              item?.current_price,
                              item?.averageBuyPrice
                            ) >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          (
                          {`${pnlPercentage(
                            item?.current_price,
                            item?.averageBuyPrice
                          )}%`}
                          )
                        </p>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip body={"Sell"}>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setQuickSellTokenData({
                                tokenData: item,
                                index: index,
                              });
                              setIsOpen(true);
                            }}
                            className={`text-red-500 hover:bg-red-500/10 flex items-center justify-center px-2 w-fit py-2 rounded-md`}
                          >
                            <FaArrowUp />
                          </div>
                        </Tooltip>
                        <Tooltip body={"Share PnL"}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSharePnlButton(item);
                            }}
                            className="flex cursor-pointer items-center justify-center text-slate-400 text-lg hover:bg-slate-700 p-1 rounded-lg"
                          >
                            <FiUpload />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : shouldShowNoData || shouldNoSearchData ? (
          <div className="flex flex-col items-center justify-center h-64 mt-10 text-center">
            <div
              className="flex items-center justify-center  "
              style={{ maxWidth: "200px", maxHeight: "150px" }}
            >
              <Image
                src={NoDataLogo}
                alt={referral?.refMata?.noData}
                width={200}
                height={100}
                className="text-slate-400 object-contain md:w-[200px] sm:w-[180px] w-[120px] h-auto"
              />
            </div>
            <p className="text-slate-400 text-lg  break-words break-all">{`${
              shouldShowNoData
                ? referral?.refMata?.noData
                : shouldNoSearchData
                ? `No results found for "${activePositionSearchQuery}"`
                : "No data"
            }`}</p>
            <p className="text-slate-500 text-sm">
              {`${
                shouldShowNoData
                  ? referral?.refMata?.infoWillAppear
                  : shouldNoSearchData
                  ? referral?.refMata?.adjustSearch
                  : null
              }`}
            </p>
          </div>
        ) : null}
      </div>
      {isOpen && quickSellTokenData?.tokenData && (
        <InstantSell
          tokenData={quickSellTokenData?.tokenData}
          index={quickSellTokenData?.index}
          setIsOpen={setIsOpen}
        />
      )}
      <SharePnLModal
        currentTokenPnLData={currentPnlDataToShow}
        isOpen={isSharePnLModalActive}
        onClose={() => {
          setIsSharePnLModalActive(false);
        }}
        tokenSymbol={currentPnlDataToShowSymbol}
      />
    </>
  );
};

export default ActivePosition;
