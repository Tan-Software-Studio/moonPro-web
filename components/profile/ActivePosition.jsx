import { NoDataLogo } from "@/app/Images";
import { setChartSymbolImage } from "@/app/redux/states";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pnlPercentage } from "./calculation";
import { useTranslation } from "react-i18next";
import InstantSell from "./InstantSell";
import { FaArrowUp } from "react-icons/fa";

const ActivePosition = ({
  filteredActivePosition,
  activePositionSearchQuery,
}) => {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [quickSellTokenData, setQuickSellTokenData] = useState({});
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

  const { t } = useTranslation();
  const referral = t('referral');

  const handleCopy = (address, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const shouldShowLoading = initialLoading || (!hasAttemptedLoad && !isDataLoaded);
  const shouldShowData = !initialLoading && isDataLoaded && currentTabData?.length > 0 && filteredActivePosition?.length > 0;
  const shouldShowNoData = !initialLoading && hasAttemptedLoad && isDataLoaded && currentTabData?.length === 0;
  const shouldNoSearchData = !initialLoading && isDataLoaded && currentTabData?.length > 0 && filteredActivePosition.length === 0;


  function pnlDollarCalc(item) {
    return ((item.activeQtyHeld - item?.quantitySold) * (item.current_price - item.averageBuyPrice));
  }

  const navigateToChartSreen = (item) => {
    router.push(
      `/tradingview/solana?tokenaddress=${item?.token}&symbol=${item?.symbol}`
    );
    localStorage.setItem("chartTokenImg", item?.img);
    dispatch(setChartSymbolImage(item?.img));
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
                        {item?.img || item?.img != null ?
                          <img
                            src={item?.img}
                            alt="Token Icon"
                            className="w-10 h-10 rounded-md object-cover"
                          /> :
                          <div className="w-10 h-10 rounded-md  flex items-center justify-center bg-[#3b3b49] border border-[#1F73FC]">
                            <span className="text-sm text-white uppercase text-center">
                              {item?.symbol.toString()?.slice(0, 1) || "T"}
                            </span>
                          </div>
                        }
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
                        ${Number(item?.activeQtyHeld * item?.averageBuyPrice).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-xs ">
                        {Number(item.activeQtyHeld).toFixed(2)} {item?.symbol?.length > 5 ? item.symbol.slice(0, 5) + '...' : item.symbol}
                      </p>
                    </td>

                    {/* Sold */}
                    <td className="px-4 py-2">
                      <p className="font-semibold text-red-500  ">
                        ${Number(item?.quantitySold * item?.averageHistoricalSellPrice).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-xs ">
                        {Number(item.quantitySold).toFixed(2)} {item?.symbol?.length > 5 ? item.symbol.slice(0, 5) + '...' : item.symbol}

                      </p>
                    </td>

                    {/* Remaining */}
                    <td className="px-4 py-2">
                      <p className="font-semibold text-white">
                        ${((item.activeQtyHeld - item.quantitySold) * item?.current_price).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-xs  ">
                        {(item.activeQtyHeld - item.quantitySold).toFixed(2)} {item?.symbol?.length > 5 ? item.symbol.slice(0, 5) + '...' : item.symbol}

                      </p>
                    </td>

                    {/* PnL */}
                    <td className="px-4 py-2 " >
                      <div className="flex items-center gap-0.5 text-base font-semibold whitespace-nowrap break-keep">

                        <p className={`${pnlDollarCalc(item) >= 0 ? "text-emerald-500" : "text-red-500"} `}>
                          {`${pnlDollarCalc(item) >= 0 ? "$" : "-$"}${Math.abs(pnlDollarCalc(item)).toFixed(2)}`}
                        </p>

                        <p className={`${pnlPercentage(item?.current_price, item?.averageBuyPrice) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          ({`${pnlPercentage(item?.current_price, item?.averageBuyPrice)}%`})
                        </p>
                      </div>
                    </td>

                    {/* <td className="px-4 py-2 " >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setQuickSellTokenData({ tokenData: item, index: index });
                          setIsOpen(true);
                        }}
                        className={`${pnlDollarCalc(item) >= 0 ? "text-emerald-500 hover:bg-emerald-500/10" : "text-red-500 hover:bg-red-500/10 "} flex items-center justify-center px-2 w-fit py-2 rounded-md`}
                      >
                        <FaArrowUp />
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : shouldShowNoData || shouldNoSearchData ? (
          <div className="flex flex-col items-center justify-center h-64 mt-10 text-center">
            <div className="flex items-center justify-center  " style={{ maxWidth: "200px", maxHeight: "150px" }}>
              <Image
                src={NoDataLogo}
                alt={referral?.refMata?.noData}
                width={200}
                height={100}
                className="text-slate-400 object-contain md:w-[200px] sm:w-[180px] w-[120px] h-auto"
              />
            </div>
            <p className="text-slate-400 text-lg  break-words break-all">{`${shouldShowNoData
              ? referral?.refMata?.noData
              : shouldNoSearchData
                ? `No results found for "${activePositionSearchQuery}"`
                : "No data"
              }`}</p>
            <p className="text-slate-500 text-sm">
              {`${shouldShowNoData
                ? referral?.refMata?.infoWillAppear
                : shouldNoSearchData
                  ? referral?.refMata?.adjustSearch
                  : null
                }`}
            </p>
          </div>
        ) : null}
      </div>
      {
        isOpen && quickSellTokenData?.tokenData && <InstantSell tokenData={quickSellTokenData?.tokenData} index={quickSellTokenData?.index} setIsOpen={setIsOpen} />
      }
    </>
  );
};

export default ActivePosition;
