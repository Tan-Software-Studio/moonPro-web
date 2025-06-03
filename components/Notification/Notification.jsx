/* eslint-disable @next/next/no-img-element */
import { setIsEnabled } from "@/app/redux/states";
import React  from "react";
import { useDispatch, useSelector } from "react-redux";
import MainWalletTrackingNotificationPopUp from "../walletTrackerNotification/MainWalletTrackingNotificationPopUp";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

const Notification = () => {
  const dispatch = useDispatch();
  const isEnabled = useSelector((state) => state?.AllStatesData?.isEnabled);
  const walletLatestTrades = useSelector(
    (state) => state?.allCharTokenData?.tradesForWalletTracking
  );
  return (
    <>
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(setIsEnabled(false))}
            className="fixed inset-0 bg-[#000000b2] flex items-center justify-center !z-[999999999999999]"
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="  xl:w-[1100px] lg:w-[1000px] w-full  bg-[#08080E] rounded-md !z-[999999999999999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="">
                <div className="flex items-center justify-between sm:px-5 px-3 py-2">
                  <div className="md:text-2xl sm:text-xl text-lg sm:font-bold font-semibold text-white ">
                    Notification
                  </div>
                  <div
                    onClick={() => dispatch(setIsEnabled(false))}
                    className="cursor-pointer"
                  >
                    <IoClose size={20} />
                  </div>
                </div>

                <div className="bg-[#1F1F1F] border-t-[1px] border-t-[#404040] flex overflow-x-auto  items-center gap-4 w-full px-5">
                  <div
                    className={`  text-[#1F73FC]  py-3 transition-all sm:text-base text-sm duration-500 cursor-pointer ease-in-out sm:font-semibold`}
                  >
                    Wallet tracking
                  </div>
                </div>

                <div className=" ">
                  {/* Transaction List */}
                  <div className="mt-1 sm:h-[650px] h-[500px] max-h-[650px] space-y-4 p-4 overflow-y-auto">
                    {walletLatestTrades?.length > 0 ? (
                      walletLatestTrades?.map((tx) => (
                        <>
                          <MainWalletTrackingNotificationPopUp tx={tx} />
                        </>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center flex items-center flex-col justify-center gap-2 py-10">
                        <Image
                          src="/assets/NoDataImages/NoDataImages.svg"
                          alt="No Data Available"
                          width={200}
                          height={100}
                          className="rounded-lg"
                        />
                        <div>No data</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Notification;
