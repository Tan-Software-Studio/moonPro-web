"use client";
import { profileImage, Swaps, tableImage } from "@/app/Images";
import ProfileTable from "@/components/profile/ProfileTable";
import Image from "next/image";
import React, { useState } from "react";
import { FaShare, FaCopy } from "react-icons/fa";
import { BiCheckDouble } from "react-icons/bi";
import { HiArrowsUpDown } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ActivityTable from "@/components/profile/ActivityTable";

const Profile = () => {
  const [isActive, setIsActive] = useState("All");
  const [tableTab, setTableTab] = useState("Activity");
  const [copied, setCopied] = useState(false);
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const { t } = useTranslation();
  const newProfile = t("newProfile");
  const handleCopy = (mintAddress) => {
    setCopied(true);
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
  return (
    <>
      <div className="overflow-y-scroll h-[95vh]">
        <div className="lg:p-8 p-4 ">
          {/* Profile Header - Made responsive with flex-col on small screens */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={profileImage}
                alt="profile"
                height={50}
                width={50}
                className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-md"
              />
              <div>
                <div className="font-semibold text-base md:text-lg">
                  This is a name
                </div>
                <div className="flex items-center gap-2 text-[#A8A8A8] text-xs md:text-sm break-all">
                  <span className="hidden sm:block">{solWalletAddress}</span>
                  <span className="block sm:hidden">{`${solWalletAddress
                    ?.toString()
                    ?.slice(0, 4)}...${solWalletAddress
                      ?.toString()
                      ?.slice(-4)}`}</span>
                  {copied ? (
                    <BiCheckDouble className="text-[20px]" />
                  ) : (
                    <FaCopy
                      onClick={() => handleCopy(solWalletAddress)}
                      className="cursor-pointer flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <div className="bg-[#1A1A1A] p-1 flex items-center rounded-md text-xs md:text-sm">
                {["All", "1D", "7D", "1M"].map((item, index) => (
                  <div
                    onClick={() => setIsActive(item)}
                    className={`px-2 md:px-3 py-1 md:py-2 cursor-pointer rounded-md ${isActive == item ? "bg-[#1F73FC]" : ""
                      }`}
                    key={index}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1 md:gap-2 bg-[#1F73FC] text-white rounded-md px-3 md:px-5 py-1 md:py-2 text-xs md:text-sm">
                <div>Share</div>
                <FaShare />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Tables - Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ProfileTable title="Balance" />
          <ProfileTable title="PnL" />
          <ProfileTable title="Distribution" />
        </div>

        {/* Table Section */}
        <div>
          <div className="px-4 lg:px-8 py-3 flex items-center gap-3 md:gap-5 bg-[#1F1F1F] w-full overflow-x-auto">
            {["Activity", "Recent PnL"].map((item, index) => (
              //  "Holdings"
              <div
                onClick={() => setTableTab(item)}
                className={`${tableTab == item
                  ? "text-[#278BFE] border-b-[#278BFE] py-1"
                  : "text-[#A8A8A8] border-b-transparent py-1"
                  } transition-all duration-300 ease-in-out cursor-pointer border-b-[1px] flex text-sm md:text-base items-center gap-3 whitespace-nowrap`}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Responsive Table */}

          {tableTab == "Recent PnL" ?
            <div className="w-full px-2 lg:px-8 py-3 overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="w-full ">
                  {[
                    newProfile?.TOKENACTIVE,
                    newProfile?.UNREALIZED,
                    newProfile?.REALIZEDPROFIT,
                    newProfile?.TOTALPROFIT,
                    newProfile?.BALANCE,
                    newProfile?.POSITION,
                    newProfile?.HOLDING,
                    newProfile?.BOUGHT,
                    newProfile?.TXS,
                  ].map((item, index) => (
                    <th key={index}>
                      <td className="text-[#A8A8A8] px-2 font-medium flex items-center  py-3 text-xs md:text-sm whitespace-nowrap">
                        <div>{item}</div>
                        <div>
                          <HiArrowsUpDown />
                        </div>
                      </td>
                    </th>
                  ))}
                </thead>
                <tbody>
                  <tr>
                    <td className="px-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={tableImage}
                          alt="Token"
                          className="w-8 md:w-10 h-8 md:h-10 xl:w-12 xl:h-12 rounded-[4px] border border-[#1F73FC]"
                          loading="lazy"
                        />
                        <div>
                          <div className="flex items-center flex-wrap">
                            <div className="flex font-semibold text-sm md:text-base items-center">
                              cascade{" "}
                            </div>
                            <div className="flex items-center text-xs md:text-sm text-[#6E6E6E]">
                              /53mha...pump{" "}
                              <span>
                                <IoCopyOutline />
                              </span>{" "}
                            </div>
                          </div>
                          <div className="text-[#6E6E6E] text-xs md:text-sm">
                            3d
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      {newProfile?.SellAll}
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      <div>$0</div>
                      <div>0%</div>
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      <div>$0</div>
                      <div>0%</div>
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      <div>$0</div>
                      <div>0%</div>
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      <div>100%</div>
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      <div>--</div>
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      <div>$0</div>
                      <div>0%</div>
                    </td>

                    <td className="text-xs md:text-sm px-2 whitespace-nowrap">
                      <div>$0</div>
                      <div>0%</div>
                    </td>

                    <td className="whitespace-nowrap py-3 px-3 md:px-6">
                      <div className="grid">
                        <div className="flex gap-1.5">
                          <Image
                            src={Swaps}
                            alt="newPairsIcon"
                            className="my-auto"
                          />
                          <div>
                            <p className="mt-0.5 text-sm px-2 md:text-base">4</p>
                            <p className="mt-0.5 text-xs md:text-sm">
                              <span className="text-[#21CB6B]">3</span>
                              <span className="text-[#828282]"> / </span>
                              <span className="text-[#ED1B24]">1</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            :
            <div className="w-full px-2 lg:px-8 py-3 overflow-x-auto">
              <ActivityTable />
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Profile;
