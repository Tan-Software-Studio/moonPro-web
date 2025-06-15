import { setChartSymbolImage } from "@/app/redux/states";
import axios from "axios";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PiWallet } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { pnlPercentage } from "./calculation";
import NoData from "../common/NoData/noData";

const TopHundred = ({ }) => {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [topHundredHistoryData, setTopHundredHistoryData] = useState([]);
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );

  const backendUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  async function getTopHundredHistoryData() {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    await axios
      .get(`${backendUrl}transactions/PNLHistoryTop/${solWalletAddress}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("🚀 ~ awaitaxios.get ~ response:", response?.data?.data);
        setTopHundredHistoryData(response?.data?.data?.pnlHistory);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const navigateToChartSreen = (item) => {
    router.push(
      `/tradingview/solana?tokenaddress=${item?.token}&symbol=${item?.symbol}`
    );
    localStorage.setItem("chartTokenImg", item?.img);
    dispatch(setChartSymbolImage(item?.img));
  };

  const handleCopy = (address, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    setTopHundredHistoryData([]);
    getTopHundredHistoryData();
  }, [solWalletAddress]);

  return (
    <>
      <div className="overflow-auto h-[400px] max-h-[450px]">
        {loading ? (
          <div
            className="snippet flex justify-center items-center mt-24   "
            data-title=".dot-spin"
          >
            <div className="stage">
              <div className="dot-spin"></div>
            </div>
          </div>
        ) : topHundredHistoryData.length > 0 ? (
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
                {topHundredHistoryData?.map((item, index) => (
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

                    <td className="px-4 py-2">
                      <p className="font-semibold  text-white">
                        ${(item?.qty * item?.buyPrice).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm font-medium">
                        {Number(item?.qty).toFixed(2)}  {item?.symbol?.length > 5 ? item.symbol.slice(0, 5) + '...' : item.symbol}
                      </p>
                    </td>

                    <td className="px-4 py-2">
                      <p className="font-semibold text-white ">
                        ${(item.qty * item.sellPrice).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-sm font-medium">
                        {Number(item.qty).toFixed(2)} {item?.symbol?.length > 5 ? item.symbol.slice(0, 5) + '...' : item.symbol}
                      </p>
                    </td>

                    <td className="px-4 py-2 " >
                      <div className={`flex items-center gap-0.5 text-base font-semibold whitespace-nowrap break-keep ${pnlPercentage(item?.sellPrice, item?.buyPrice) >= 0 ? "text-emerald-500" : "text-red-500"}`}>

                        <p className="">
                          {
                            `${(item?.buyPrice - item.sellPrice) * item.qty >= 0 ? "-$" : "$"}${Math.abs((item?.buyPrice - item.sellPrice) * item.qty).toFixed(2)}`
                          }
                        </p>
                        <p className={``}>
                          ({`${pnlPercentage(item?.sellPrice, item?.buyPrice)}%`})
                        </p>

                      </div>
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !topHundredHistoryData.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-64 mt-10 text-center">
            <NoData />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default TopHundred;
