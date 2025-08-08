"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import transform from "../../../public/assets/Transfer-funds/transfer.png";
import { useSelector } from "react-redux";
const metaDataMainName = process.env.NEXT_PUBLIC_METADATA_MAIN_NAME || "Nexa";
const TransferFunds = () => {
  const [activeTab, setActiveTab] = useState("Deposit");

  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  useEffect(() => {
    document.title = `${metaDataMainName} | Transfer Funds`;
  }, []);
  return (
    <>
      <div className={``}>
        <div className={`ml-4 mr-4`}>
          <div
            className={`mt-4 font-semibold	 mb-5 mt4 text-3xl text-[#3E9FD6]`}
          >
            <p>Transfer Funds</p>
          </div>
          <div
            className={`!w-full bg-transparent rounded-2xl  p-8   border  ${borderColor}`}
          >
            <div
              className={`flex gap-8  text-[#A5A5A7] border-b ${borderColor}`}
            >
              <p
                onClick={() => setActiveTab(`Deposit`)}
                className={`cursor-pointer  ${
                  activeTab === `Deposit` ? `border-b pb-4  text-whi` : ``
                }`}
              >
                Deposit
              </p>
              <p
                onClick={() => setActiveTab(`Withdraw`)}
                className={`cursor-pointer ${
                  activeTab === `Withdraw` ? `border-b pb-4  text-white` : ``
                }`}
              >
                Withdraw
              </p>
            </div>

            <p className={`mt-6  text-[#A5A5A7]`}>
              Deposit ETH to your Photon trading wallet
            </p>
            {activeTab === `Deposit` && (
              <div>
                <div className={`md:flex gap-8 mt-6 text-[#A5A5A7]`}>
                  <div className={``}>
                    <p>Deposit ETH amount</p>
                    <input
                      type="number"
                      className={`w-full mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-white text-center`}
                      placeholder="Input amount"
                    />
                  </div>
                  <div className={`flex justify-center  my-6 md:my-11`}>
                    <Image
                      src={transform}
                      className={`h-4 w-4 rotate-90 md:rotate-0`}
                      alt="Transfer Icon"
                      unoptimized
                    />
                  </div>
                  <div className={``}>
                    <p>Deposit to</p>
                    <input
                      type="number"
                      className={`w-full mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-white text-center`}
                      placeholder="0x37d8..5384"
                    />
                  </div>
                  <div className={`lg:block md:hidden block mt-6 lg:mt-[2rem]`}>
                    <button
                      className={`border ${borderColor} rounded-full py-2 px-8 bg-[#6A60E8] text-white hover:bg-[#5249d1] transition`}
                    >
                      Deposit
                    </button>
                  </div>
                </div>
                <div className={`lg:hidden md:block hidden md:-mt-2 `}>
                  <button
                    className={`border ${borderColor} rounded-full py-2 px-8 bg-[#6A60E8] text-white hover:bg-[#5249d1] transition`}
                  >
                    Deposit
                  </button>
                </div>
              </div>
            )}

            {activeTab === `Withdraw` && (
              <div>
                <div className={`md:flex gap-8 mt-6 text-[#A5A5A7]`}>
                  <div className={``}>
                    <p>Withdraw ETH amount</p>
                    <input
                      type="number"
                      className={`w-full mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-white text-center`}
                      placeholder="Input amount"
                    />
                  </div>
                  <div className={`flex justify-center  my-6 md:my-11`}>
                    <Image
                      src={transform}
                      className={` h-4 w-4 rotate-90 md:rotate-0`}
                      alt="Transfer Icon"
                      unoptimized
                    />
                  </div>
                  <div className={``}>
                    <p>Withdraw to</p>
                    <input
                      type="number"
                      className={`w-full mt-2 p-2 bg-transparent border ${borderColor} rounded-full outline-none text-white text-center`}
                      placeholder="0x37d8..5384"
                    />
                  </div>
                  <div className={` mt-6 md:mt-[1.8rem]`}>
                    <button
                      className={`border ${borderColor} rounded-full py-2 px-8 bg-[#6A60E8] text-white hover:bg-[#5249d1] transition`}
                    >
                      Withdraw
                    </button>
                  </div>
                  {/* <button className=`${borderColor} rounded-full py-2 px-5  bg-purple-500   my-6 md:my-8`>Deposit</button> */}
                </div>
              </div>
            )}
            <div className={`mt-5 border-b ${borderColor}`} />
            <div className={`mt-6 `}>
              <p className={`text-[#A5A5A7]`}>History</p>
              <div className={`flex justify-center items-center mt-20 mb-20`}>
                <span className={`text-[#A5A5A7] text-center`}>
                  There are currently no transactions yet.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex mt-5 ml-4  space-x- p- rounded-lg bg-[#16171D]">
      {timeOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={` py-2 px-8 text-sm  text-[#A5A5A7] ${
            activeIndex === index ? 'bg-[#6CC4F4] text-black' : ` border   ${borderColor}`
          } transition duration-300`}
        >
          {option}
        </button>
      ))}
    </div>
  */}
      </div>
    </>
  );
};

export default TransferFunds;
