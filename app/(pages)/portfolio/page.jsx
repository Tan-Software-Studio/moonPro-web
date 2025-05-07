"use client";
import { solana } from "@/app/Images";
import { setSolWalletAddress } from "@/app/redux/states";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsStar } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { IoIosKey } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { RiShareBoxLine } from "react-icons/ri";
import { useDispatch } from "react-redux";

export default function Portfolio() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState([]);

  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
  const getAllWallets = async (e) => {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return 0;
    try {
      // setIsLoading(true);
      const response = await axios.get(`${baseUrl}user/getAllWallets`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log(
        "🚀 ~ getAllWallets ~ response:",
        response?.data?.data?.wallets?.walletAddressSOL
      );
      setWalletAddresses(response?.data?.data?.wallets?.walletAddressSOL);
    } catch (error) {
      console.error(error);
    }
  };

  async function handlePrimary(index) {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return 0;
    try {
      await axios
        .put(
          `${baseUrl}user/makeSolWalletPrimary`,
          {
            index,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        )
        .then(async (res) => {
          const findXPrimaryIndex = await walletAddresses.findIndex(
            (item) => item?.primary
          );
          setWalletAddresses((pre) => {
            const preArr = [...pre];
            preArr[findXPrimaryIndex].primary = false;
            preArr[index].primary = true;
            return preArr;
          });
          localStorage.setItem(
            "walletAddress",
            res?.data?.data?.wallet?.wallet
          );
          dispatch(setSolWalletAddress());
        })
        .catch((err) => {
          console.log("🚀 ~ ).then ~ err:", err?.message);
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllWallets();
  }, []);

  const wallets = [
    {
      id: 1,
      name: "Axiom Main",
      address: "AHZu...qjyU",
      balance: 0,
      holdings: 0,
      type: "main",
      color: "blue",
      primary: true,
    },
    {
      id: 2,
      name: "Wallet",
      address: "8xqT...Tokm",
      balance: 0,
      holdings: 0,
      type: "standard",
      color: "orange",
      primary: false,
    },
  ];

  return (
    <div className="bg-[#08080E] text-white p-4 md:p-6">
      <div className="border-[#404040] border-[1px] rounded-lg">
        <div className="flex flex-col  ">
          {/* Header & Search Bar */}
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between border-[#404040] border-b-[1px] 
            gap-4 px-3 py-3"
          >
            <div className=" selection: w-full md:w-64">
              <input
                type="text"
                placeholder="Search by name or address"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm `}
              >
                <span>Show Archived</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm">
                <span>Import</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 rounded-lg text-sm">
                <span>Create Wallet</span>
              </button>
            </div>
          </div>

          <div className="min-h-[50vh] max-h-[70vh] overflow-y-auto">
            <table className="w-full table-fixed overflow-x-auto">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-[#404040] border-b-[1px]">
                  <th className="py-3 px-5 font-normal w-5/12">#</th>
                  <th className="py-3 px-5 font-normal w-5/12">Wallet</th>
                  <th className="py-3 px-5 font-normal w-2/12 text-center md:text-left">
                    Balance
                  </th>
                  <th className="py-3 px-5 font-normal w-2/12 text-center md:text-left">
                    Holdings
                  </th>
                  <th className="py-3 px-5 font-normal w-3/12 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className=" ">
                {walletAddresses.map((wallet, index) => (
                  <tr
                    key={index}
                    className={` ${index % 2 == 0 ? "bg-[#1A1A1A] " : ""}`}
                  >
                    {/* Wallet Info */}
                    <td className="py-2 px-6 ">{index + 1}</td>
                    <td className="py-2 px-6 flex items-center gap-3 ">
                      <div
                        className={`font-medium ${
                          wallet.primary ? "text-[rgb(247,147,26)]" : ""
                        }`}
                      >
                        Wallet
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        {`${wallet?.wallet.slice(
                          0,
                          4
                        )}...${wallet?.wallet.slice(-4)}`}
                        <FaRegCopy size={12} className="ml-1" />
                      </div>
                    </td>

                    {/* Balance */}
                    <td className="py-2 px-6 ">
                      <div className="flex items-center gap-2 ">
                        <Image
                          src={solana}
                          width={20}
                          height={20}
                          alt="solana"
                          className="rounded-full"
                        />
                        <span>{wallet?.balance || 0}</span>
                      </div>
                    </td>

                    {/* Holdings */}
                    <td className="py-2 px-6 ">
                      <div className="flex items-center justify-center md:justify-start space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                        <span>{wallet?.holdings || 0}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-6 ">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1.5 hover:bg-gray-800 rounded-full transition-colors">
                          <IoEye size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-800 rounded-full transition-colors">
                          <RiShareBoxLine size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-800 rounded-full transition-colors">
                          <IoIosKey size={16} />
                        </button>
                        {!wallet?.primary && (
                          <button
                            onClick={() => handlePrimary(wallet?.index)}
                            className="p-1.5 hover:bg-gray-800 rounded-full transition-colors"
                          >
                            <BsStar size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
