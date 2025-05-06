"use client";
import React, { useEffect, useState } from "react";
import { Import, Plus, walletTrackerWhiteImg } from "@/app/Images";
import Image from "next/image";
import LeftSideWallet from "@/components/WalletTracker/LeftSideWallet";
import RightSideWallet from "@/components/WalletTracker/RightSideWallet";
import AddWalletModal from "@/components/WalletTracker/AddWalletModal";
import WalletScan from "@/components/walletTrackerNotification/WalletScan";
import ImportWalletModal from "@/components/WalletTracker/ImportWalletModal";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function WalletTracker() {
  const { t } = useTranslation();
  const wallettrackerPage = t("wallettracker");
  // console.log("🚀 ~ WalletTracker ~ address:___________", address)
  const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenImport, setModalOpenImport] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [walletData, setWalletData] = useState([]);
  const [walletChartData, setWalletChartData] = useState({});
  // get solana wallet address
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );

  const fetchWalletData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login");
    await axios({
      method: "get",
      url: `${BASE_URL}wallettracker/walletTracking`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setWalletData(response.data.data?.wallets);
      })
      .catch((err) => {
        setWalletData([]);
        console.log("🚀 ~ fetchWalletData ~ err:", err?.message);
      });
  };

  useEffect(() => {
    solWalletAddress && fetchWalletData();
  }, [solWalletAddress]);

  const handleWalletAdd = (newWallet) => {
    setWalletData((prevWallets) => [...prevWallets, newWallet]);
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-[#0A0A0B] text-white md:p-4 p-2  border-b border-[#404040]">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <Image
            src={walletTrackerWhiteImg}
            alt="Wallet Tracker Icon"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1 className="xl:text-[28px] text-[14px] font-bold">
            {wallettrackerPage?.mainHeader?.title}
          </h1>
          <div className="h-2 w-2 bg-[#6E6E6E] rounded-full "></div>
          <div className="font-normal md:text-[14px] text-[10px] text-[#6E6E6E]">
            {wallettrackerPage?.mainHeader?.desc}
          </div>
        </div>
      </div>

      <div className="xl:grid grid-cols-12 h-[85vh] overflow-y-scroll">
        <div className="col-span-4 border-r border-[#404040] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#0A0A0B] text-white md:p-4 p-2 border-b border-[#404040] md:h-[70px]">
            {/* Left Section */}
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold">
                {wallettrackerPage?.mainHeader?.title}
              </span>
              <span className="text-[#A8A8A8] md:text-[18px] font-normal text-[12px]">
                {`(${solWalletAddress ? walletData.length : 0}/300)`}
              </span>
            </div>
            <div className="flex  md:gap-3 gap-1">
              <div
                onClick={() => setModalOpenImport(true)}
                className="text-[12px] text-[#278BFE] cursor-pointer p-2 flex items-center gap-2"
              >
                <Image src={Import} alt="Import" height={20} width={20} />{" "}
                <span className="md:block hidden">
                  {wallettrackerPage?.leftsidebar?.importwallets?.importwallets}
                </span>
              </div>
              <div
                onClick={() => {
                  if (!solWalletAddress) {
                    toast.error("Please Login", {
                      position: "top-center",
                      style: { fontSize: "12px" },
                    });
                    return;
                  }
                  setModalOpen(true);
                }}
                className="text-[12px] text-[#278BFE] cursor-pointer p-2 flex items-center gap-2"
              >
                <Image src={Plus} alt="Plus" height={20} width={20} />
                <span className="md:block hidden">
                  {
                    wallettrackerPage?.leftsidebar?.addnew?.addnewwallet
                      ?.addnewwallet
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="w-full">
            {solWalletAddress ? (
              <LeftSideWallet
                walletData={walletData}
                setWalletData={setWalletData}
                solAddress={solWalletAddress}
                onChartOpen={() => setIsChartOpen(true)}
                setWalletChartData={setWalletChartData}
              />
            ) : (
              <div className="flex items-center justify-center text-[#A8A8A8] text-lg h-[20vh]">
                Please Login
              </div>
            )}
          </div>
        </div>

        <div className="col-span-8 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-[#0A0A0B] text-white md:p-5 p-2 border-b border-[#404040] md:h-[70px]">
            {/* Left Section */}
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold">
                {wallettrackerPage?.rightide?.title}
              </span>
            </div>
          </div>
          <div className="md:px-4 px-2 w-full">
            <RightSideWallet
              wallettrackerPage={wallettrackerPage?.rightide?.tableHeaders}
            />
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <AddWalletModal
        wallettrackerPage={wallettrackerPage?.leftsidebar?.addnew?.addnewwallet}
        walletData={walletData}
        isOpen={isModalOpen}
        solAddress={solWalletAddress}
        onClose={() => setModalOpen(false)}
        onAddWallet={handleWalletAdd}
      />

      <ImportWalletModal
        wallettrackerPage={wallettrackerPage?.leftsidebar?.importwallets}
        isOpen={isModalOpenImport}
        onClose={() => setModalOpenImport(false)}
      />

      <WalletScan
        wallettrackerPage={wallettrackerPage?.pnlpopup}
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
        walletChartData={walletChartData}
      />
    </div>
  );
}

export default WalletTracker;
