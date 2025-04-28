"use client";
import AllPageHeader from "@/components/AllPageHeader/AllPageHeader";
import TableBody from "@/components/common/TableBody/TableBody";
import TableHeaderData from "@/components/common/TableHeader/TableHeaderData";
import { useAppKitState } from "@reown/appkit/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  newPairsIcon,
  Filter,
  Advanced,
  buyIcon,
  bitcoinIcon,
  tableIcon,
  Swaps,
  close,
} from "@/app/Images";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Tokens = () => {
  const { selectedNetworkId } = useAppKitState();
  const [tokenApiData, settokenApiData] = useState([]);

  const router = useRouter();
  const HeaderData = {
    newPairsIcon: {
      menuIcon: newPairsIcon,
      headTitle: "New Pairs",
      discription: "Latest tokens across chains",
    },
    Filter: {
      menuIcon: Filter,
      menuTitle: "Filter",
    },
    Advanced: {
      menuIcon: Advanced,
      menuTitle: "Advanced",
    },
    Buy: {
      menuIcon: buyIcon,
      menuTitle: "Buy",
      placeHolder: "0$",
    },
    coin: {
      menuIcon: bitcoinIcon,
    },
  };
  const headersData = [
    { title: "Pair Info", className: "!text-left" },
    { title: "Created" },
    { title: "Liquidity" },
    { title: "Initial Liquidity" },
    { title: "MKT Cap" },
    { title: "Swaps" },
    { title: "Volume" },
    { title: "Audit Results" },
    { title: "Quick Buy" },
  ];
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  const tableRef = useRef(null);
  const getNetworkId = selectedNetworkId.split(":")[1];
  const tokenApi = async () => {
    const apiData = await axios.get(
      `https://ks-setting.kyberswap.com/api/v1/tokens?pageSize=100&isWhitelisted=true&chainIds=${getNetworkId}&page=1`
    );
    settokenApiData(apiData?.data?.data?.tokens);
  };
  useEffect(() => {
    tokenApi();
    localStorage.setItem("tokensData", tokenApiData);
  }, [selectedNetworkId]);

  return (
    <>
      {/* <div>
            {tokenApiData?.map((e, ind) => (
                <div key={ind} className='flex gap-5'>
                    <div className='border p-2 m-2'>{e?.name}</div>
                </div>
            ))}
        </div> */}
      <AllPageHeader HeaderData={HeaderData} duration={false} />

      <div className="flex flex-col">
        <div className="overflow-x-auto ">
          <div className="inline-block min-w-full -mt-0.5">
            <div
              className="h-[100vh] overflow-y-auto visibleScroll"
              ref={tableRef}
            >
              <table className="min-w-full !text-xs ">
                <TableHeaderData headers={headersData} />
                {tokenApiData.map((e, ind) => (
                  <tbody key={ind} className="text-center ">
                    <tr className={`border-b ${borderColor}`}>
                      {/* Column 1: Icon and Pair Info */}
                      <td
                        className="whitespace-nowrap px-6 py-4 cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/tradingview?tokensymbol=${e?.symbol}&tokenaddress=${e?.address}&decimals=${e?.decimals}`
                          )
                        }
                      >
                        <div className="flex items-center gap-3 !text-left">
                          {/* <div> */}
                          <Image
                            src={tableIcon}
                            alt="newPairsIcon"
                            className="w-8 md:w-10 h-8 md:h-10 xl:w-12 xl:h-12"
                            width={50}
                            height={50}
                          />
                          {/* </div> */}
                          <div>
                            <p>
                              <span className="text-[#71A8FE]">{e?.name}</span>
                              {/* <span> / WETH</span> */}
                            </p>
                            <p>
                              <span className="text-[#71A8FE]">44s</span>
                              <span className="text-[#666873]">
                                {" "}
                                / 0x0...81e
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Time */}
                      <td className="whitespace-nowrap px-6 py-4 text-[#F0488B]">
                        44s
                      </td>

                      {/* Column 3: Liquidity */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="grid place-content-center text-start">
                          <div className="flex justify-center items-center gap-1.5">
                            {/* <Image
                              src={row.bitcoinIcon}
                              alt="newPairsIcon"
                              className="my-auto w-4 h-4"
                            /> */}
                            <p>
                              <span>17,439</span>
                              <span className="text-[#666873]"> / $46k</span>
                            </p>
                          </div>
                          <p className="text-[#3E9FD6] mt-1">+28.3%</p>
                        </div>
                      </td>

                      {/* Column 4: Initial Liquidity */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex justify-center items-center gap-1.5">
                          {/* <Image
                            src={row.bitcoinIcon}
                            alt="newPairsIcon"
                            className="my-auto w-4 h-4"
                          /> */}
                          <p>17,439 / 46k</p>
                        </div>
                      </td>

                      {/* Column 5: Market Cap and Price */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="grid place-content-center text-start">
                          <p>$399.000</p>
                          <p className="text-[#828282]">$0.0075</p>
                        </div>
                      </td>

                      {/* Column 6: Swaps */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="grid place-content-center text-start">
                          <div className="flex gap-1.5">
                            {/* <Image
                              src={row.SwapsIcon}
                              alt="newPairsIcon"
                              className="my-auto"
                            /> */}
                            <div>
                              <p className="mt-0.5">3</p>
                              <p className="mt-0.5">
                                <span className="text-[#3E9FD6]">2</span>
                                <span className="text-[#828282]"> / </span>
                                <span className="text-[#F0488B]">1</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Column 7: Volume */}
                      <td className="whitespace-nowrap px-6 py-4">$21M</td>

                      {/* Column 8: Holders */}
                      <td className="whitespace-nowrap px-6 py-4">1500</td>

                      {/* Column 10: Quick Buy Button */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <button className="border border-[#3E9FD6] rounded-lg py-1 px-[30px] bg-[#16171D]">
                          Buy
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tokens;
