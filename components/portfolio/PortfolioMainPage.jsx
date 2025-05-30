"use client";
import { updatePnlTableData } from '@/app/redux/holdingDataSlice/holdingData.slice';
import PNLProtfolio from '@/components/portfolio/PNLPage';
import UserProfileControl from '@/components/portfolio/UserProfileControl';
import Image from 'next/image';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PortfolioMainPage = () => {
  const dispatch = useDispatch();
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const activeTab = useSelector(
    (state) => state?.setPnlData?.pnlTableData
  );

  return (
    <>
      {solWalletAddress ?
        <>
          <div className='overflow-y-scroll h-[95vh]'>

            <div className='flex items-center gap-5 p-5'>
              <div className={`text-xl font-bold cursor-pointer ${activeTab == "profile" ? "text-white" : "text-gray-400"}`} onClick={() => dispatch(updatePnlTableData("profile"))}>
                Spots
              </div>
              <div className={`text-xl font-bold cursor-pointer ${activeTab == "portfolio" ? "text-white" : "text-gray-400"}`} onClick={() => dispatch(updatePnlTableData("portfolio"))}>
                Wallets
              </div>
            </div>

            {activeTab == "profile" &&
              <UserProfileControl />
            }
            {activeTab == "portfolio" &&
              <PNLProtfolio />
            }
          </div>
        </> :

        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="mb-6 flex flex-col justify-center text-center items-center">
            <Image
              src="/assets/NoDataImages/qwe.svg"
              alt="No Data Available"
              width={24}
              height={24}
              className="text-slate-400 w-28 h-28"
            />
            <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Please connect your login to view your portfolio and profile.
            </p>
          </div>
        </div>

      }
    </>
  );
};

export default PortfolioMainPage;