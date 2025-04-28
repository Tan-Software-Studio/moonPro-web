"use client";
import React, { useEffect, useState } from "react";
import { newPairsIcon, Filter, buyIcon, bitcoinIcon } from "@/app/Images";
import AllPageHeader from "@/components/common/AllPageHeader/AllPageHeader";
import TableHeaderData from "@/components/common/TableHeader/TableHeaderData";
import { useDispatch, useSelector } from "react-redux";
import { setselectToken } from "@/app/redux/CommonUiData";
import { fetchnewPairData } from "@/app/redux/newpair/NewPairData";

import { fetchnewPairEthData } from "@/app/redux/newpair/EthData";
import { fetchnewPairBaseData } from "@/app/redux/newpair/BaseData";
import NewPairTBody from "@/components/common/TableBody/NewPairTBody";
import NewPairSBody from "@/components/common/TableBody/NewPairSBody";
import NewPairBaseBody from "@/components/common/TableBody/NewPairBaseBody";
import { useRouter } from "next/navigation";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import NewPairSOLData from "@/websocket/NewPairSOLData";
import handleSort from "@/utils/sortTokenData";
import axios from "axios";
import { FilterSidebarData } from "@/components/common/filter/FilterSidebarData";

const NewPairs = () => {
  const router = useRouter();
  const { chainId } = useAppKitNetwork();
  const { address } = useAppKitAccount();
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const chainName = useSelector(
    (state) => state.AllthemeColorData?.selectToken
  );

  const dispatch = useDispatch();

  const HeaderData = {
    newPairsIcon: {
      menuIcon: newPairsIcon,
      headTitle: "New Pairs",
      discription: "New token pairs in the last 24-hours updated in real-time.",
    },
    Filter: {
      menuIcon: Filter,
      menuTitle: "Filter",
    },
    Advanced: {
      menuIcon: Filter,
      menuTitle: "Dexes",
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
    {
      title: "Pair Info",
      className: "!text-left",
      key: "pairInfo",
      sortingKey: "",
    },
    {
      title: "Created",
      sortable: true,
      key: "created",
      sortingKey: "created_time",
    },
    {
      title: "Liquidity",
      sortable: true,
      key: "liquidity",
      sortingKey: "liquidity",
    },
    {
      title: "MKT Cap",
      sortable: true,
      key: "MKC",
      sortingKey: "MKC",
    },
    { title: "Swaps", sortable: true, key: "swaps", sortingKey: "trades" },
    { title: "Volume", sortable: true, key: "Volume", sortingKey: "Volume" },
    ...(chainName !== "Solana" ? [{ title: "Holders" }] : []),
    {
      title: "Audit Results",
      sortable: false,
      key: "auditResults",
      sortingKey: "",
    },
    { title: "Quick Buy", sortable: false, key: "quickBuy", sortingKey: "" },
  ];

  const selectToken = useSelector(
    (state) => state?.AllthemeColorData?.selectToken
  );

  // eth data
  const NewEthData = useSelector((state) => state?.allNewPairEthData?.Newdata);
  const NewEthLoading = useSelector(
    (state) => state.allNewPairEthData.initialLoading
  );

  // base data
  const NewBaseData = useSelector(
    (state) => state?.allNewPairBaseData?.Newdata
  );
  const NewBaseLoading = useSelector(
    (state) => state.allNewPairBaseData.initialLoading
  );

  // solana data
  const NewData = useSelector((state) => state?.allNewPairData?.Newdata);
  const NewDataLoading = useSelector(
    (state) => state?.allNewPairData?.initialLoading
  );

  // for solana websocket start
  const { closeWebSocketConnection } = NewPairSOLData();

  useEffect(() => {
    selectToken === "Solana"
      ? dispatch(fetchnewPairData())
      : selectToken === "Base"
      ? dispatch(fetchnewPairBaseData())
      : dispatch(fetchnewPairEthData());
  }, []);

  useEffect(() => {
    const chainFfromLocalStorage = localStorage.getItem("chain") || 19999;
    if (chainFfromLocalStorage == 1) {
      dispatch(setselectToken("Ethereum"));

      router.replace("/newpairs/ethereum");
    } else if (chainFfromLocalStorage == 8453) {
      dispatch(setselectToken("Base"));

      router.replace("/newpairs/base");
    } else if (chainFfromLocalStorage == 19999) {
      dispatch(setselectToken("Solana"));

      router.replace("/newpairs/solana");
    } else {
      dispatch(setselectToken("Solana"));

      router.replace("/newpairs/solana");
    }
  }, [selectToken, NewBaseData, NewEthData, chainId]);

  const sortedData = handleSort(sortColumn, NewData, sortOrder);

  return (
    <>
      <div className="relative">
        <AllPageHeader
          FilterData={FilterSidebarData.NewPairs}
          HeaderData={HeaderData}
          duration={false}
        />
        <div className="flex flex-col">
          <div className="overflow-x-auto ">
            <div className="inline-block min-w-full -mt-0.5">
              <div className="xl:h-[85vh] md:h-[78vh] h-[80vh] overflow-y-auto visibleScroll">
                <table className="min-w-full !text-xs ">
                  <TableHeaderData
                    headers={headersData}
                    onSort={(key, order) => {
                      setSortColumn(key);
                      setSortOrder(order);
                    }}
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                  />
                  {selectToken == "Solana" ? (
                    <NewPairSBody data={sortedData} loading={NewDataLoading} />
                  ) : selectToken == "Base" ? (
                    <NewPairBaseBody
                      data={NewBaseData}
                      loading={NewBaseLoading}
                    />
                  ) : (
                    <NewPairTBody data={NewEthData} loading={NewEthLoading} />
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPairs;
