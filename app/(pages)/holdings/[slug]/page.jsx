"use client";
// import AllPageHeader from "@/components/AllPageHeader/AllPageHeader";
import React, { useEffect, useState } from "react";
import {
  baseIcon,
  solana,
  ethereum,
  HoldingImg,
  Filter,
  Advanced,
  buyIcon,
  bitcoinIcon,
} from "@/app/Images";
import TableHeaderData from "@/components/common/TableHeader/TableHeaderData";
import AllPageHeader from "@/components/common/AllPageHeader/AllPageHeader";
import HolderDataTable from "@/components/common/HolderTable/HolderDataTable";
import Moralis from "moralis";

import { useAppKitAccount } from "@reown/appkit/react";
import NoDataMessage from "@/components/NoDataMessage/NoDataMessage";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useTranslation } from "react-i18next";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URLS;

const Holdings = () => {
  const { t, ready } = useTranslation();
  const holdingsPage = t("holdings");
  const pathname = usePathname();
  const chainName = pathname.split("/")[2];
  const [holdingsData, setHoldingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isConnected } = useAppKitAccount();
  const noDataMessage = holdingsPage?.noholdingsmsg;
  const noConnectWalletMsg = holdingsPage?.noconnectwallet;

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
    // Advanced: {
    //   menuIcon: Advanced,
    //   menuTitle: "Advanced",
    // },
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
    // { title: "Invested" },
    { title: holdingsPage?.tableheaders?.quantity },
    {
      title: "P&L in USD",
      infoTipString: holdingsPage?.tableheaders?.pnlusdtooltip,
    },
    {
      title: "P&L in %",
      infoTipString: holdingsPage?.tableheaders?.pnlpertooltip,
    },
    {
      title: holdingsPage?.tableheaders?.quicksell,
      infoTipString: holdingsPage?.tableheaders?.quickselltooltip,
    },
  ];

  const { address } = useAppKitAccount();
  useEffect(() => {
    const chainName = pathname.split("/")[2];
    const fetchData = async () => {
      if (!Moralis.Core.isStarted) {
        const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
        if (!apiKey) throw new Error("API key is missing!");
        await Moralis.start({ apiKey });
      }
      setLoading(true);
      // if (chainName == "ethereum") {
      //   try {
      //     const response =
      //       await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      //         chain: "0x1",
      //         address: address,
      //       });

      //     const res = response.toJSON();
      //     setHoldingsData(res.result);
      //   } catch (error) {
      //     console.error(
      //       "Error fetching token balances and prices:",
      //       error?.message
      //     );
      //   } finally {
      //     setLoading(false);
      //   }
      // } else if (chainName == "solana") {
      //   try {
      //     const response = await axios({
      //       url: `${BASE_URL}wavePro/users/solanaHoldings`,
      //       method: "post",
      //       data: {
      //         walletAddress: address,
      //       },
      //     });
      //     setHoldingsData(response?.data?.data?.buyTokens);
      //   } catch (error) {
      //     console.error("Error fetching token balances and prices:", error);
      //   } finally {
      //     setLoading(false);
      //   }
      // } else if (chainName == "base") {
      //   try {
      //     const response =
      //       await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      //         chain: "0x2105",
      //         address: address,
      //       });

      //     const res = response.toJSON();
      //     setHoldingsData(res.result);
      //   } catch (error) {
      //     console.error("Error fetching token balances and prices:", error);
      //   } finally {
      //     setLoading(false);
      //   }
      // }
      await axios({
        url: `${BASE_URL}wavePro/users/solanaHoldings`,
        method: "post",
        data: {
          walletAddress: address,
        },
      })
        .then((response) => {
          setHoldingsData(response?.data?.data?.buyTokens);
          setLoading(false);
        })
        .catch((err) => {
          console.log("🚀 ~ fetchData ~ err:", err?.message);
          setLoading(false);
        });
    };
    if (address) {
      fetchData();
    }
  }, [address]);

  return (
    <>
      <AllPageHeader HeaderData={HeaderData} />
      <div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full -mt-0.5">
              <div className="xl:h-[86vh] h-[84vh] overflow-y-auto visibleScroll">
                {holdingsData?.length > 0 && address ? (
                  <table className="min-w-full !text-xs">
                    <TableHeaderData headers={headersData} />
                    <HolderDataTable
                      data={holdingsData}
                      img={
                        chainName == "solana"
                          ? solana
                          : chainName == "base"
                          ? baseIcon
                          : ethereum
                      }
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
                      isConnected={isConnected}
                      noDataMessage={
                        !isConnected ? noConnectWalletMsg : noDataMessage
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
