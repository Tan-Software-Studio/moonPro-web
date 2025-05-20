"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import {
  Filter,
  Advanced,
  buyIcon,
  bitcoinIcon,
  TrendingImg,
  solana,
} from "@/app/Images";
import { useDispatch, useSelector } from "react-redux";
import AllPageHeader from "@/components/common/AllPageHeader/AllPageHeader";
import TableHeaderData from "@/components/common/TableHeader/TableHeaderData";
import TableBody from "@/components/common/TableBody/TableBody";
import axios from "axios";
import { setFilterTime } from "@/app/redux/trending/solTrending.slice";
import { useTranslation } from "react-i18next";
import handleSort from "@/utils/sortTokenData";
const URL = process.env.NEXT_PUBLIC_BASE_URLS;
const Trending = () => {
  const { t } = useTranslation();
  const tredingPage = t("tredingPage");
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [localFilterTime, setLocalFilterTime] = useState("24h");

  const getTimeFilterData = useSelector(
    (state) => state?.solTrendingData.filterTime[`${localFilterTime}`] 
  );
  const Trendings = {
    Title: tredingPage?.mainHeader?.filter?.filter,
    FilterInput: [
      {
        id: "1",
        name: tredingPage?.mainHeader?.filter?.mintauth,
        type: "checkbox",
        infotipString: tredingPage?.mainHeader?.filter?.mintauthtooltip,
      },
      {
        id: "2",
        name: tredingPage?.mainHeader?.filter?.freezeauth,
        type: "checkbox",
        infotipString: tredingPage?.mainHeader?.filter?.freezeauthtooltip,
      },
      {
        id: "3",
        name: tredingPage?.mainHeader?.filter?.lpburned,
        type: "checkbox",
        infotipString: tredingPage?.mainHeader?.filter?.lpburnedtooltip,
      },
      {
        id: "4",
        name: tredingPage?.mainHeader?.filter?.withatleast1social,
        type: "checkbox",
      },
    ],
    FromToFilter: [
      {
        id: "5",
        title: "Liquidity",
        name: `${tredingPage?.mainHeader?.filter?.bycurrentliquidity}($)`,
        firstInputName: "Min",
        firstInputIcon: "$",
        secondInputName: "Max",
        secondInputIcon: "$",
        type: "number",
      },
      {
        id: "6",
        title: "Volume",
        name: tredingPage?.mainHeader?.filter?.byvolume,
        firstInputName: "Min",
        firstInputIcon: "%",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
      },
      {
        id: "7",
        title: "Age",
        name: `${tredingPage?.mainHeader?.filter?.byage}`,
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
      },
      {
        id: "8",
        title: "MKT",
        name: tredingPage?.mainHeader?.filter?.bymc,
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
      },
      {
        id: "9",
        title: "TXNS",
        name: tredingPage?.mainHeader?.filter?.bytxns,
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
      },
      {
        id: "10",
        title: "Buys",
        name: tredingPage?.mainHeader?.filter?.bybuys,
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
      },
      {
        id: "11",
        title: tredingPage?.mainHeader?.filter?.sells,
        name: "By Sells",
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
      },
    ],
  };
  const headersDataSol = [
    {
      title: tredingPage?.tableheaders?.pairinfo,
      className: "!text-left",
      sortable: false,
      key: "pairInfo",
      sortingKey: "",
      infoTipString: tredingPage?.tableheaders?.pairinfotooltip,
    },
    {
      title: tredingPage?.tableheaders?.created,
      sortable: true,
      key: "created",
      sortingKey: "date",
    },
    {
      title: tredingPage?.tableheaders?.liquidity,
      sortable: true,
      key: "liquidity",
      sortingKey: "liquidity",
      infoTipString: tredingPage?.tableheaders?.liquiditytooltip,
    },
    {
      title: tredingPage?.tableheaders?.mcap,
      sortable: true,
      key: "marketCap",
      sortingKey: "marketCap",
      infoTipString: tredingPage?.tableheaders?.mcaotooltip,
    },
    {
      title: tredingPage?.tableheaders?.swaps,
      sortable: true,
      key: "swaps",
      sortingKey: "trades",
      infoTipString: tredingPage?.tableheaders?.swapstooltip,
    },
    {
      title: tredingPage?.tableheaders?.volume,
      sortable: true,
      key: "volume",
      sortingKey: "traded_volume",
    },
    {
      title: tredingPage?.tableheaders?.auditres,
      sortable: false,
      key: "auditResults",
      sortingKey: "",
      infoTipString: tredingPage?.tableheaders?.auditrestooltip,
    },
    {
      title: tredingPage?.tableheaders?.quickbuy,
      sortable: false,
      key: "quickBuy",
      sortingKey: "",
    },
  ];
  const HeaderData = {
    newPairsIcon: {
      menuIcon: TrendingImg,
      headTitle: tredingPage?.mainHeader?.trending,
      discription: tredingPage?.mainHeader?.desc,
    },
    timeDuration: ["1m", "5m", "1h", "6h", "24h"],
    Filter: {
      menuIcon: Filter,
      menuTitle: tredingPage?.mainHeader?.filter?.filter,
    },
    Advanced: {
      menuIcon: Advanced,
      menuTitle: tredingPage?.mainHeader?.advanced,
    },
    Buy: {
      menuIcon: buyIcon,
      menuTitle: tredingPage?.mainHeader?.buy,
      placeHolder: "0$",
    },
    coin: {
      menuIcon: bitcoinIcon,
    },
  };
  async function fetchData() {
    await axios.get(`${URL}findallTrendingToken`).then((response) => {
      const rawData = response?.data?.data;
      const formattedData = {
        "1m": rawData?.["1+min"]?.[0].tokens || {},
        "5m": rawData?.["5+min"]?.[0].tokens || {},
        "1h": rawData?.["1+hr"]?.[0].tokens || {},
        "6h": rawData?.["6+hr"]?.[0].tokens || {},
        "24h": rawData?.["24+hr"]?.[0].tokens || {},
      };
      dispatch(setFilterTime(formattedData));
    }).catch((error) => {
      console.log("🚀 ~ awaitaxios.get ~ error:", error)
    })
  }

  const sortedData = handleSort(
    sortColumn,
    Array.isArray(getTimeFilterData) ? getTimeFilterData : [],
    sortOrder
  );
 

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <>
      <div className="relative">
        <AllPageHeader
          FilterData={Trendings}
          HeaderData={HeaderData}
          setLocalFilterTime={setLocalFilterTime}
          localFilterTime={localFilterTime}
          duration={true}
        />
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full -mt-0.5">
              <div
                className="xl:h-[85vh] md:h-[78vh] h-[80vh] overflow-y-auto visibleScroll"
                ref={tableRef}
              >
                <table className="min-w-full !text-xs ">
                  <TableHeaderData
                    headers={headersDataSol}
                    onSort={(key, order) => {
                      setSortColumn(key);
                      setSortOrder(order);
                    }}
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                  />
                  <TableBody data={sortedData} img={solana} />
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Trending;
