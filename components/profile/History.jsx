import { NoDataFish } from "@/app/Images";
import { setChartSymbolImage } from "@/app/redux/states";
import axios from "axios";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PiWallet } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

const History = ({ }) => {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const [historyData, setHistoryData] = useState([])
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );

  const backendUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL

  async function getHistoryData() {
    const token = localStorage.getItem("token")
    if (!token) return
    setLoading(true)
    await axios.get(`${backendUrl}transactions/PNLHistory/${solWalletAddress}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      console.log("🚀 ~ awaitaxios.get ~ response:", response?.data?.data)
      setHistoryData(response?.data?.data?.pnlHistory)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const navigateToChartSreen = (item) => {
    router.push(
      `/tradingview/solana?tokenaddress=${item?.token}&symbol=${item?.symbol}`
    );
    localStorage.setItem("chartTokenImg", item?.img);
    dispatch(setChartSymbolImage(item?.img));
  };

  useEffect(() => {
    getHistoryData()
  }, [solWalletAddress])

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
        ) : historyData.length > 0 ? (
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
                    className={`${index % 2 === 0 ? "bg-gray-800/20" : ""} border- b -slate-700/20 hover:bg-slate-800/30 cursor-pointer transition - colors duration - 200`}
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
                        {Number(item.qty).toFixed(5)}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      <p className="font-semibold text-white ">
                        {Number(item.qty).toFixed(5)}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      <p
                        className={`${item?.realizedProfit >= 0
                          ? "text-emerald-400 bg-emerald-900/20"
                          : "text-red-400 bg-red-900/20"
                          } font-semibold px-2 py-1 rounded-full text-sm flex items-center justify-center text-center `}

                      >
                        {(item?.realizedProfit).toFixed(5)}
                      </p>
                      {/* <p className="font-semibold  text-gray-400">${((item.totalBoughtQty - item.quantitySold) * item.current_price).toFixed(2)}</p> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !historyData.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-64 mt-10 text-center">
            <div className="flex items-center justify-center mb-4">
              <Image
                src={NoDataFish}
                alt="No Data Available"
                width={200}
                height={100}
                className="text-slate-400"
              />
            </div>
            <p className="text-slate-400 text-lg mb-2 break-words break-all">No data available</p>
            <p className="text-slate-500 text-sm">Information will appear here when availab</p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default History;
