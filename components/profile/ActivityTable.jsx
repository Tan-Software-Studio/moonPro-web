import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import axiosInstanceAuth from "@/apiInstance/axiosInstanceAuth";
import Pagination from "./Pagination";
import Image from "next/image";
import { convertUTCToIST } from "@/utils/calculation";

// Truncate long strings
const truncateString = (str, start = 4, end = 4) => {
  if (str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
};

// Type badge color
const getTypeBadgeColor = (type) => {
  switch (type) {
    case "buy":
      return "bg-green-800 text-green-200";
    case "sell":
      return "bg-red-800 text-red-200";
    case "swap":
      return "bg-blue-800 text-blue-200";
    default:
      return "bg-gray-800 text-gray-200";
  }
};

const ActivityTable = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPages = 10;
  const [isLoading, setIsLoading] = useState(false);

  const handleTransaction = async (e) => {
    setIsLoading(true)
    await axiosInstanceAuth
      .get(`transactions/history/${entriesPerPages}/${currentPage}`)
      .then((response) => {
        setIsLoading(false)
        setTransactionData(response?.data?.data?.transaction);
        setTotalPage(response?.data?.data?.totalPage);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false)
      });
  };

  useEffect(() => {
    if (!transactionData.length > 0) {
      handleTransaction();
    }
  }, [currentPage]);

  return (
    <>
      <div className="overflow-auto max-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="flex justify-center items-center min-h-[40vh]">
              <span className="Tableloader"></span>
            </div>
          </div>
        ) : !transactionData?.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
              <Image
                src="/assets/NoDataImages/qwe.svg"
                alt="No Data Available"
                width={24}
                height={24}
                className="text-slate-400"
              />
            </div>
            <p className="text-slate-400 text-lg mb-2">{"You don't have any transaction history yet."}</p>
            <p className="text-slate-500 text-sm">
              Transaction information will appear here when available
            </p>
          </div>
        ) : (
          <div className="min-w-full">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b bg-[#08080E] border-gray-800 z-10">
                <tr>
                  <th className="p-4 text-slate-300 font-medium">
                    <div className="flex gap-4 items-center">
                      <div>#</div>
                      <div>From</div>
                    </div>
                  </th>
                  <th className="p-4 text-slate-300 font-medium">
                    To
                  </th>
                  <th className="p-4 text-slate-300 font-medium">
                    Amount
                  </th>
                  <th className="p-4 text-slate-300 font-medium">
                    Value (USD)
                  </th>
                  <th className="p-4 text-slate-300 font-medium">
                    Type
                  </th>
                  <th className="p-4 text-slate-300 font-medium">
                    TX
                  </th>
                  <th className="p-4 text-slate-300 font-medium">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="p-4">
                      <div className="flex justify-center items-center min-h-[40vh]">
                        <span className="Tableloader"></span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactionData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div className="flex gap-4 items-center">
                          <div className="text-white font-medium">{index + 1}</div>
                          <div className="min-w-0">
                            <p className="font-medium text-white">{truncateString(item.fromToken)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">{truncateString(item.toToken)}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">{item.amount.toFixed(5)}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">${item.amountInDollar.toFixed(2)}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(
                            item.type
                          )}`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{truncateString(item.tx)}</span>
                          <Link
                            href={`https://solscan.io/tx/${item.tx}`}
                            target="_blank"
                            className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded transition-colors duration-200"
                          >
                            <ExternalLink className="h-3 w-3 text-slate-400 hover:text-slate-200" />
                          </Link>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">{convertUTCToIST(item.createdAt)}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPage}
        />
      )}
    </>
  );
};

export default ActivityTable;
