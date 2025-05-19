/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { NoDataFish, referral } from "@/app/Images";
import { FaXTwitter, FaFacebook } from "react-icons/fa6";
import axios from "axios";
import { useSelector } from "react-redux";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "https://pro.wavebot.app";
const Referral = () => {
  const { t } = useTranslation();
  const referralPage = t("referral");
  const [referralData, setReferralData] = useState([]);
  const [copyRef, setCopyRef] = useState(false);
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const tableHeader = [
    { id: 1, title: "#" },
    { id: 2, title: referralPage?.table?.user },
    { id: 3, title: referralPage?.table?.date },
  ];

  const rankColors = ["bg-[#FFD542]", "bg-[#B3B3B3]", "bg-[#E39757]"];
  const rankBorder = [
    "border-2 border-[#FFBB00]",
    "border-2 border-[#818181]",
    "border-2 border-[#DC7220]",
  ];
  const copyToClipboard = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyRef(true);
        setTimeout(() => {
          setCopyRef(false);
        }, 2000);
        // alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  async function getReferrals() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    await axios({
      url: `${BASE_URL}user/getreferrals`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setReferralData(res?.data?.data?.referrals);
      })
      .catch((err) => {
        console.log("🚀 ~ getReferrals ~ err:", err);
      });
  }

  useEffect(() => {
    getReferrals();
  }, [solWalletAddress]);

  return (
    <>
      <div className="font-poppins bg-transparent">
        {/* header */}
        <div className="px-4 sm:px-6 pt-6 text-white">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Image
                src={referral}
                alt="referral"
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
              <span className="text-xl sm:text-[28px] font-bold">
                {referralPage?.mainHeader?.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
              <span className="text-[#F6F6F6] font-normal text-base sm:text-lg">
                {referralPage?.mainHeader?.yourstats}
              </span>
              <div className="flex items-center">
                <span className="text-[#A8A8A8] text-xs sm:text-sm px-2 py-1 rounded-md">
                  {referralPage?.mainHeader?.referralpoints}
                </span>
                <span className="text-[#1F73FC] font-bold text-lg sm:text-xl">
                  23
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mb-4 md:h-[83vh] h-[75vh] overflow-auto">
          <div className="md:mt-12 mt-6 mx-4 mb-4">
            <div className="flex justify-center">
              <div
                className={`md:text-[32px] text-[14px] font-bold text-white text-center  md:w-[570px]`}
              >
                <h2>{referralPage?.pageData?.title}</h2>
                <p
                  className={`text-[#B9BABC] md:text-[16px] font-normal text-xs items-center text-center mt-2 m-0`}
                >
                  {referralPage?.pageData?.desc}
                </p>
              </div>
            </div>
          </div>

          {/* share referral link */}
          {/* <div className="flex justify-center md:mt-12 mt-6 px-4">
            <div className="flex flex-col items-center  gap-3 rounded-lg w-full max-w-[512px] text-white">
              <div className="flex flex-wrap items-center w-fit gap-2 rounded-md">
                <input
                  type="text"
                  value={`Not available`}
                  readOnly
                  className="flex-grow bg-[#1f1e1e85] text-white text-xs px-4 py-2 outline-none truncate border border-[#141414] rounded-md"
                />
                <button
                  className="hover:text-[#278BFE] text-white transition-all duration-300 ease-in-out text-xs w-[80px] py-2 rounded-md  border border-[#1F73FC] hover:bg-[#11265B]"
                  onClick={() => copyToClipboard(`Not available`)}
                >
                  {copyRef
                    ? referralPage?.pageData?.copied
                    : referralPage?.pageData?.copy}
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-3/4">
                <h1 className="text-xs sm:text-sm text-gray-400 md:mb-0 mb-2">
                  {referralPage?.pageData?.shareto}
                </h1>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `${WEB_URL}/referral/${user?.referralId}`
                  )}`}
                  target="_blank"
                >
                  <button className=" gap-2 flex justify-center items-center flex-1 bg-[#11265B] px-4 py-2 rounded-md text-white transition">
                    <FaXTwitter className="text-white text-[12px]" />
                    <span className="text-white text-[12px]">Twitter</span>
                  </button>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `${WEB_URL}/referral/${user?.referralId}`
                  )}`}
                  target="_blank"
                >
                  <button className=" gap-2 flex justify-center items-center flex-1 bg-[#11265B] px-4 py-2 rounded-md text-white transition">
                    <FaFacebook className="text-white text-[12px]" />
                    <span className="text-white text-[12px]">Facebook</span>
                  </button>
                </a>
              </div>
            </div>
          </div> */}

          <div
            className={`flex flex-col items-center justify-center md:w-full w-auto  mt-[40px]`}
          >
            {/* table data */}
            <div className="rounded-3xl  md:w-full">
              <div className="md:max-w-full max-w-[310px] h-full overflow-y-scroll">
                <div className=" h-full">
                  {solWalletAddress && referralData?.length > 0 && (
                    <table className={`w-full max-w-4xl rounded-b-lg  mx-auto`}>
                      <thead>
                        <tr className="sticky -top-1 z-30">
                          {tableHeader.map((header) => (
                            <th
                              key={header.id}
                              className={`text-start text-[12px] font-bold py-5 `}
                            >
                              <span className={`text-[#A8A8A8] uppercase`}>
                                <div className="flex items-center gap-1">
                                  <p>{header.title}</p>
                                  {header.infoTipString && (
                                    <Infotip body={header.infoTipString} />
                                  )}
                                </div>
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className={`mt-5`}>
                        {referralData?.map((user, index) => (
                          <tr
                            key={index + 1}
                            className={`py-2 border-b border-[#2B3737]`}
                          >
                            <td className="py-2">
                              <div
                                className={`w-8 h-8 flex items-center justify-center text-white font-bold text-[12px] rounded-full ${
                                  index < 3
                                    ? `${rankColors[index]} ${rankBorder[index]}`
                                    : ""
                                }`}
                              >
                                {index + 1}
                              </div>
                            </td>
                            <td className="py-2 flex items-center gap-3">
                              <h1 className="text-white text-[14px]">
                                <a
                                  href={`https://solscan.io/account/${user?.walletAddressSOL}`}
                                  target="_blank"
                                >
                                  {`${user?.walletAddressSOL?.slice(
                                    0,
                                    3
                                  )}...${user?.walletAddressSOL?.slice(-4)}`}
                                </a>
                              </h1>
                            </td>
                            <td className="text-[#F6F6F6]  text-[12px] font-medium py-2">
                              {new Intl.DateTimeFormat("en-GB").format(
                                new Date(
                                  user?.referralAddedAt ||
                                    "2025-04-03T12:06:12.140+00:00"
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {referralData?.length <= 0 ? (
                    <div className="flex flex-col items-center justify-center mt-5">
                      <div className={`text-4xl mb-2`}>
                        <Image
                          src={NoDataFish}
                          alt="No Data Available"
                          width={200}
                          height={100}
                          className="rounded-lg"
                        />
                      </div>
                      <h1 className="text-[#89888e]">No referrals found</h1>
                    </div>
                  ) : (
                    !solWalletAddress && (
                      <div className="flex flex-col items-center justify-center mt-5">
                        <div className={`text-4xl mb-2`}>
                          <Image
                            src={NoDataFish}
                            alt="No Data Available"
                            width={200}
                            height={100}
                            className="rounded-lg"
                          />
                        </div>
                        <h1 className="text-[#89888e]">
                          Please login to see your referrals
                        </h1>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Referral;
