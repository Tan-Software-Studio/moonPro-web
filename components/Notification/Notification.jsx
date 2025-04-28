/* eslint-disable @next/next/no-img-element */
import { setIsEnabled } from '@/app/redux/states';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainWalletTrackingNotificationPopUp from '../walletTrackerNotification/MainWalletTrackingNotificationPopUp';
import AlphaPicksNotificationPopUp from '../alphaPicksNotification/AlphaPicksNotificationPopUp';
import Infotip from "@/components/common/Tooltip/Infotip.jsx"
import { useTranslation } from 'react-i18next';

const Notification = () => {
   const { t, ready } = useTranslation();
   const notificationsPage = t("notifications");
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("wallets");
  const isEnabled = useSelector(
    (state) => state?.AllStatesData?.isEnabled
  );
  const walletLatestTrades = useSelector(
    (state) => state?.allCharTokenData?.tradesForWalletTracking
  );
  const alphaPickNotification = useSelector(
    (state) => state?.alphaPicksNotificationData?.alphaPicksNotification
  );
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9999998] transition-opacity duration-500 ${
          isEnabled ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch(setIsEnabled(false))}
      />
      {/* Sidebar Modal */}
      <div
        className={`fixed top-14  bottom-5 rounded-md transition-all duration-500 ease-in-out lg:w-[30%] w-full bg-[#16171c] z-[9999999] border border-[#333333] ${
          isEnabled ? "right-0" : "-right-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-500">
            <button
              className={`flex-1 p-2 text-center ${
                activeTab === "wallets"
                  ? "border-b-2 border-[#1F73FC] text-[#1F73FC]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("wallets")}
            >
              <div className="flex justify-center items-center gap-1">
                <p>{notificationsPage?.wallettracking}</p>
                <Infotip
                  iconSize={20}
                  body={notificationsPage?.wallettrackingtool}
                />
              </div>
            </button>
            <button
              className={`flex-1 p-2 text-center ${
                activeTab === "inflow"
                  ? "border-b-2 border-[#1F73FC] text-[#1F73FC]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("inflow")}
            >
              <div className="flex justify-center items-center gap-1">
                <p>{notificationsPage?.alphapicks}</p>
                <Infotip iconSize={20} body={notificationsPage?.alphapickstool} />
              </div>
            </button>
          </div>
          {/* Transaction List */}
          <div className="mt-4 space-y-4 p-4 flex-grow overflow-y-auto">
            {activeTab === "wallets" ? (
              walletLatestTrades?.length > 0 ? (
                walletLatestTrades?.map((tx) => (
                  <>
                    <MainWalletTrackingNotificationPopUp tx={tx} />
                  </>
                ))
              ) : (
                <div className="text-gray-400 text-center py-10">No Data</div>
              )
            ) : alphaPickNotification?.length > 0 ? (
              alphaPickNotification.map((notificationData, index) => (
                <AlphaPicksNotificationPopUp
                  key={index}
                  alphaNotification={notificationData}
                />
              ))
            ) : (
              <div className="text-gray-400 text-center py-10">No Data</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Notification;