"use client";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pnlPercentage } from "./calculation";
import NoData from "../common/NoData/noData";
import { setActiveChartToken } from "@/app/redux/chartDataSlice/chartData.slice";

const History = ({ }) => {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const dispatch = useDispatch();
  // history data from redux
  const historyData = useSelector((state) => state?.setPnlData?.PnlDataHistory);
  const navigateToChartSreen = (item) => {
    dispatch(setActiveChartToken({ symbol: item?.symbol, img: item?.img }));
    router.push(
      `/tradingview/${item?.token}`
    );
  };

  const handleCopy = (address, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <div className="overflow-auto h-[400px] max-h-[450px]">
        {historyData.length > 0 ? (
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
                  <th className="px-4 py-2 text-slate-300 font-medium">PnL</th>
                </tr>
              </thead>
              <tbody>
                {historyData?.map((item, index) => (
                  <tr
                    onClick={() => navigateToChartSreen(item)}
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-800/20" : ""
                      } border- b -slate-700/20 hover:bg-slate-800/30 cursor-pointer transition - colors duration - 200`}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={item?.img}
                          alt="Token Icon"
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-base text-white">
                              {item?.symbol} /
                            </p>
                            <p className="font-medium  text-sm text-gray-400 ">
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
                    {/* bought */}
                    <td className="px-4 py-2">
                      <p className="font-semibold  text-white">
                        ${(item.qty * item.buyPrice).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm font-medium">
                        {Number(item.qty).toFixed(2)}{" "}
                        {item?.symbol?.length > 5
                          ? item.symbol.slice(0, 5) + "..."
                          : item.symbol}
                      </p>
                    </td>

                    {/* sold */}
                    <td className="px-4 py-2">
                      <p className="font-semibold text-white ">
                        ${(item.qty * item.sellPrice).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm font-medium">
                        {Number(item.qty).toFixed(2)}{" "}
                        {item?.symbol?.length > 5
                          ? item.symbol.slice(0, 5) + "..."
                          : item.symbol}
                      </p>
                    </td>

                    <td className="px-4 py-2 ">
                      <div
                        className={`flex items-center gap-0.5 text-base font-semibold whitespace-nowrap break-keep ${pnlPercentage(item?.sellPrice, item?.buyPrice) >= 0
                          ? "text-emerald-500"
                          : "text-red-500"
                          }`}
                      >
                        <p className="">
                          {`${(item?.buyPrice - item.sellPrice) * item.qty >= 0
                            ? "-$"
                            : "$"
                            }${Math.abs(
                              (item?.buyPrice - item.sellPrice) * item.qty
                            ).toFixed(2)}`}
                        </p>
                        <p className={``}>
                          (
                          {`${pnlPercentage(item?.sellPrice, item?.buyPrice)}%`}
                          )
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 mt-10 text-center">
            <NoData />
          </div>
        )}
      </div>
    </>
  );
};

export default History;
