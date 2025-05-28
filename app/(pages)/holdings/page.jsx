"use client";
import React, { useEffect, useState } from "react";
import { solana, HoldingImg, Filter, buyIcon, bitcoinIcon } from "@/app/Images";
import TableHeaderData from "@/components/common/TableHeader/TableHeaderData";
import AllPageHeader from "@/components/common/AllPageHeader/AllPageHeader";
import HolderDataTable from "@/components/common/HolderTable/HolderDataTable";
import NoDataMessage from "@/components/NoDataMessage/NoDataMessage";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

const Holdings = () => {
  const { t } = useTranslation();
  const holdingsPage = t("holdings");
  const [holdingsData, setHoldingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const noDataMessage = holdingsPage?.noholdingsmsg;
  const noConnectWalletMsg = holdingsPage?.noconnectwallet;
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  const HeaderData = {
    newPairsIcon: {
      menuIcon: HoldingImg,
      headTitle: holdingsPage?.mainHeader?.title,
      discription: holdingsPage?.mainHeader?.desc,
    },

    Filter: {
      menuIcon: Filter,
      menuTitle: "Filter",
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
    { title: holdingsPage?.tableheaders?.token, className: "!text-left" },
    { title: holdingsPage?.tableheaders?.quantity },
    {
      title: "P&L in USD",
      infoTipString: holdingsPage?.tableheaders?.pnlusdtooltip,
    },
    {
      title: "P&L in %",
      infoTipString: holdingsPage?.tableheaders?.pnlpertooltip,
    },
    // {
    //   title: holdingsPage?.tableheaders?.quicksell,
    //   infoTipString: holdingsPage?.tableheaders?.quickselltooltip,
    // },
  ];

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      await axios({
        url: `${BASE_URL}transactions/PNLSolana/${solWalletAddress}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(
            "🚀 ~ .then ~ response?.data?.data?.pnlCalculation:",
            response?.data?.data?.pnl
          );
          setHoldingsData(response?.data?.data?.pnl);
          setLoading(false);
        })
        .catch((err) => {
          console.log("🚀 ~ fetchData ~ err:", err?.message);
          setLoading(false);
        });
    } else {
      return toast.error("Unauthorized request.");
    }
  };
  useEffect(() => {
    if (solWalletAddress) {
      fetchData();
    }
  }, [solWalletAddress]);

  return (
    <>
      <AllPageHeader HeaderData={HeaderData} />
      <div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full -mt-0.5">
              <div className="xl:h-[86vh] h-[84vh] overflow-y-auto visibleScroll">
                {holdingsData?.length > 0 && solWalletAddress ? (
                  <table className="min-w-full !text-xs">
                    <TableHeaderData headers={headersData} />
                    <HolderDataTable
                      data={holdingsData}
                      img={solana}
                      loading={loading}
                    />
                  </table>
                ) : (
                  <div
                    div
                    className="h-[60vh] flex items-center justify-center"
                  >
                    <NoDataMessage
                      loading={loading}
                      isConnected={solWalletAddress}
                      noDataMessage={
                        !solWalletAddress ? noConnectWalletMsg : noDataMessage
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Holdings;
