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
import { useSelector } from "react-redux";
import AllPageHeader from "@/components/common/AllPageHeader/AllPageHeader";
import TableHeaderData from "@/components/common/TableHeader/TableHeaderData";
import TableBody from "@/components/common/TableBody/TableBody";
import { useTranslation } from "react-i18next";
import handleSort from "@/utils/sortTokenData";

const Trending = () => {
  const { t } = useTranslation();
  const tredingPage = t("tredingPage");
  const tableRef = useRef(null);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [localFilterTime, setLocalFilterTime] = useState("5m");
  const [filteredData, setFilteredData] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Initial filter values - all empty/false
  const initialFilterValues = {
    mintauth: { checked: false },
    freezeauth: { checked: false },
    lpburned: { checked: false },
    top10holders: { checked: false },
    liquidity: { min: "", max: "" },
    volume: { min: "", max: "" },
    age: { min: "", max: "" },
    MKT: { min: "", max: "" },
    TXNS: { min: "", max: "" },
    buys: { min: "", max: "" },
    sells: { min: "", max: "" },
  };

  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const isLoading = useSelector((state) => state?.solTrendingData?.loading);

  // Get data from Redux store
  const getTimeFilterData = Object.values(useSelector(
    (state) => state?.solTrendingData.filterTime[`${localFilterTime}`]
  ));

  // Convert data to array (safety check)
  let filterDataArray = Array.isArray(getTimeFilterData)
    ? getTimeFilterData
    : [];

  const Trendings = {
    Title: tredingPage?.mainHeader?.filter?.filter,
    FilterInput: [
      {
        id: "1",
        name: tredingPage?.mainHeader?.filter?.mintauth,
        title: "mintauth",
        type: "checkbox",
        infotipString: tredingPage?.mainHeader?.filter?.mintauthtooltip,
      },
      {
        id: "2",
        name: tredingPage?.mainHeader?.filter?.freezeauth,
        title: "freezeauth",
        type: "checkbox",
        infotipString: tredingPage?.mainHeader?.filter?.freezeauthtooltip,
      },
      // {
      //   id: "3",
      //   name: tredingPage?.mainHeader?.filter?.lpburned,
      //   title: "lpburned",
      //   type: "checkbox",
      //   infotipString: tredingPage?.mainHeader?.filter?.lpburnedtooltip,
      // },
      {
        id: "4",
        name: "Top 10 Holders",
        title: "top10holders",
        type: "checkbox",
      },
    ],
    FromToFilter: [
      {
        id: "5",
        title: "liquidity",
        name: tredingPage?.mainHeader?.filter?.bycurrentliquidity,
        firstInputName: "Min",
        firstInputIcon: "$",
        secondInputName: "Max",
        secondInputIcon: "$",
        type: "number",
      },
      {
        id: "6",
        title: "volume",
        name: tredingPage?.mainHeader?.filter?.byvolume,
        firstInputName: "Min",
        firstInputIcon: "$",
        secondInputName: "Max",
        secondInputIcon: "$",
        type: "number",
      },
      {
        id: "7",
        title: "age",
        name: tredingPage?.mainHeader?.filter?.byage,
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
        firstInputIcon: "$",
        secondInputName: "Max",
        secondInputIcon: "$",
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
        title: "buys",
        name: tredingPage?.mainHeader?.filter?.bybuys,
        firstInputName: "Min",
        firstInputIcon: "",
        secondInputName: "Max",
        secondInputIcon: "",
        type: "number",
      },
      {
        id: "11",
        name: tredingPage?.mainHeader?.filter?.bysells,
        title: "sells",
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
      title: tredingPage?.tableheaders?.mcap,
      sortable: true,
      key: "marketCap",
      sortingKey: "marketCap",
      infoTipString: tredingPage?.tableheaders?.mcaotooltip,
    },
    {
      title: tredingPage?.tableheaders?.liquidity,
      sortable: true,
      key: "liquidity",
      sortingKey: "liquidity",
      infoTipString: tredingPage?.tableheaders?.liquiditytooltip,
    },
    {
      title: tredingPage?.tableheaders?.volume,
      sortable: true,
      key: "volume",
      sortingKey: "traded_volume",
    },
    {
      title: tredingPage?.tableheaders?.swaps,
      sortable: true,
      key: "swaps",
      sortingKey: "buys",
      infoTipString: tredingPage?.tableheaders?.swapstooltip,
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
    timeDuration: ["1m", "5m", "30m", "1h"],
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

  // === SIMPLE HELPER FUNCTIONS ===

  // Check if user has set any filters
  function checkIfFiltersExist(filters) {
    // Check checkboxes
    if (filters.freezeauth?.checked) return true;
    if (filters.mintauth?.checked) return true;
    if (filters.top10holders?.checked) return true;

    // Check number inputs
    if (filters.liquidity?.min || filters.liquidity?.max) return true;
    if (filters.volume?.min || filters.volume?.max) return true;
    if (filters.age?.min || filters.age?.max) return true;
    if (filters.MKT?.min || filters.MKT?.max) return true;
    if (filters.TXNS?.min || filters.TXNS?.max) return true;
    if (filters.buys?.min || filters.buys?.max) return true;
    if (filters.sells?.min || filters.sells?.max) return true;

    return false;
  }

  // Convert filter names to database field names
  function getFieldName(filterName) {
    const fieldMap = {
      MKT: "marketCap",
      TXNS: "trades",
      volume: "traded_volume",
      liquidity: "liquidity",
      age: "date",
      buys: "buys",
      sells: "sells",
    };
    return fieldMap[filterName] || filterName;
  }

  // Apply all filters to response
  function applyAllFilters(dataArray, filters) {
    let result = [...dataArray];

    // true false filters
    if (filters.freezeauth?.checked) {
      result = result.filter((item) => item?.freeze_authority === true);
    }

    if (filters.mintauth?.checked) {
      result = result.filter((item) => item?.mint_authority === true);
    }

    if (filters.top10holders?.checked) {
      result = result.filter((item) => item?.top10Holder === true);
    }

    // from to filters (min max)
    const numberFilters = [
      "liquidity",
      "volume",
      "age",
      "MKT",
      "TXNS",
      "buys",
      "sells",
    ];

    numberFilters.forEach((filterName) => {
      const fieldName = getFieldName(filterName);

      if (filters[filterName]?.min) {
        result = result.filter((item) => {
          let value = Number(item?.[fieldName]);

          // Convert age from timestamp to minutes
          if (filterName === "age") {
            const now = Date.now();
            const ageInMs = now - value;
            value = Math.floor(ageInMs / (1000 * 60)); // Convert to minutes
          }

          const minValue = Number(filters[filterName].min);
          return value >= minValue;
        });
      }

      // Apply maximum filter
      if (filters[filterName]?.max) {
        result = result.filter((item) => {
          let value = Number(item?.[fieldName]);

          // Convert age from timestamp to minutes
          if (filterName === "age") {
            const now = Date.now();
            const ageInMs = now - value;
            value = Math.floor(ageInMs / (1000 * 60)); // Convert to minutes
          }

          const maxValue = Number(filters[filterName].max);
          return value <= maxValue;
        });
      }
    });
    return result;
  }

  // === Localstorage manipulation === \\

  // Save filters
  function saveFiltersToStorage(filters) {
    try {
      localStorage.setItem("trendingFilters", JSON.stringify(filters));
    } catch (error) {
      console.error("Could not save filters:", error);
    }
  }

  // get filter
  function loadFiltersFromStorage() {
    try {
      const saved = localStorage.getItem("trendingFilters");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Could not load filters:", error);
    }
    return null;
  }

  // remove filters
  function clearFiltersFromStorage() {
    try {
      localStorage.removeItem("trendingFilters");
    } catch (error) {
      console.error("Could not clear filters:", error);
    }
  }

  function onApply() {
    const hasFilters = checkIfFiltersExist(filterValues);

    if (hasFilters) {
      // Apply filters to data
      const filteredResult = applyAllFilters(filterDataArray, filterValues);
      setFilteredData(filteredResult);
      setFiltersApplied(true);

      // Save to storage
      saveFiltersToStorage(filterValues);
    } else {
      setFilteredData([]);
      setFiltersApplied(false);

      // remove localstorage
      clearFiltersFromStorage();
    }
  }

  function onReset() {
    setFilterValues(initialFilterValues);
    setFilteredData([]);
    setFiltersApplied(false);
    clearFiltersFromStorage();
  }

  // show save filter data
  useEffect(() => {
    const savedFilters = loadFiltersFromStorage();
    if (savedFilters) {
      setFilterValues(savedFilters);
    }
  }, []);

  // Apply saved filters when data becomes available
  useEffect(() => {
    const savedFilters = loadFiltersFromStorage();

    if (savedFilters && filterDataArray.length > 0) {
      const hasFilters = checkIfFiltersExist(savedFilters);

      if (hasFilters) {
        const filteredResult = applyAllFilters(filterDataArray, savedFilters);
        setFilteredData(filteredResult);
        setFiltersApplied(true);
      }
    }
  }, [filterDataArray]);

  // time filter data render
  useEffect(() => {
    if (filtersApplied && filterDataArray.length > 0) {
      const filteredResult = applyAllFilters(filterDataArray, filterValues);
      setFilteredData(filteredResult);
    }
  }, [localFilterTime]);

  const dataToShow =
    filtersApplied && filteredData.length >= 0 ? filteredData : filterDataArray;

  // asc dsc function
  const sortedData = handleSort(sortColumn, dataToShow, sortOrder);
  return (
    <>
      <div className="relative">
        <AllPageHeader
          FilterData={Trendings}
          HeaderData={HeaderData}
          setLocalFilterTime={setLocalFilterTime}
          localFilterTime={localFilterTime}
          duration={true}
          setFilterValues={setFilterValues}
          filterValues={filterValues}
          onApply={onApply}
          onReset={onReset}
        />
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full -mt-0.5">
              <div
                className="xl:h-[82vh] md:h-[75vh] h-[70vh] overflow-y-auto visibleScroll"
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
                  <TableBody data={sortedData} img={solana} isLoading={isLoading} isTimeCreated={false} />
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
