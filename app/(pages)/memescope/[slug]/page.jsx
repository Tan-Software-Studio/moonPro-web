"use client";
import { bitcoinIcon, buyIcon, memescopeImg } from "@/app/Images";
import AllPageHeader from "@/components/common/AllPageHeader/AllPageHeader";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import MscopePumpTable from "@/components/common/memsscope/MscopePumpTable";
import { usePathname } from "next/navigation";
import FilterMemescope from "@/components/common/filter/FilterMemescope";
import FilterButton from "@/components/common/filter/FilterButton";
import NewPairSOLData from "@/websocket/NewPairSOLData";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import { useTranslation } from "react-i18next";

const Memescope = () => {
  const { t } = useTranslation();
  const memescopePage = t("memescope");
  const [selectedScope, setSelectedScope] = useState(1);
  const [filterValues, setFilterValues] = useState({})

  function onApply() {
    console.log("Apply filters");
  }
  function onReset() {
    console.log("remove filters");
  }

  const Graduatedata = useSelector(
    (state) => state?.allMemescopeData?.MscopeGraduateData
  );
  const Graduateddata = useSelector(
    (state) => state?.allMemescopeData?.MscopeGraduatedData
  );
  const NewData = useSelector((state) => state?.allMemescopeData?.newLaunch);
  const [openDropdown, setOpenDropdown] = useState(null);

  const pathname = usePathname();

  const handleSidebarToggle = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };
  const FilterInput = [
    {
      id: "1",
      name: memescopePage?.mainHeader?.filters?.newcreation?.top10holders,
      type: "checkbox",
    },
    {
      id: "2",
      name: memescopePage?.mainHeader?.filters?.newcreation?.withatleast1social,
      type: "checkbox",
    },
  ];

  // New Creations data input
  const FromToFilter = [
    {
      id: "3",
      title: "progress",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bypumpprogress,
      firstInputName: "Min",
      firstInputIcon: "%",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
    {
      id: "4",
      title: "Holders",
      name: memescopePage?.mainHeader?.filters?.newcreation?.byholderscount,
      firstInputName: "Min",
      firstInputIcon: "%",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
    {
      id: "5",
      title: "holding",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bydevholding,
      firstInputName: "Min",
      firstInputIcon: "",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
    {
      id: "6",
      title: "Snipers",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bysnipers,
      firstInputName: "Min",
      firstInputIcon: "$",
      secondInputName: "Max",
      secondInputIcon: "$",
      type: "number",
    },
    {
      id: "7",
      title: "Age",
      name: memescopePage?.mainHeader?.filters?.newcreation?.byage,
      firstInputName: "Min",
      firstInputIcon: "$",
      secondInputName: "Max",
      secondInputIcon: "$",
      type: "number",
    },
    {
      id: "8",
      title: "Liquidity",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bycurrentliquidity,
      firstInputName: "Min",
      firstInputIcon: "$",
      secondInputName: "Max",
      secondInputIcon: "$",
      type: "number",
    },
    {
      id: "9",
      title: "Volume",
      name: memescopePage?.mainHeader?.filters?.newcreation?.byvolume,
      firstInputName: "Min",
      firstInputIcon: "",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
    {
      id: "10",
      title: "MKT",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bymCap,
      firstInputName: "Min",
      firstInputIcon: "",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
    {
      id: "11",
      title: "TXNS",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bytx,
      firstInputName: "Min",
      firstInputIcon: "",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
    {
      id: "12",
      title: "Buys",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bybuys,
      firstInputName: "Min",
      firstInputIcon: "",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
    {
      id: "13",
      title: "Sells",
      name: memescopePage?.mainHeader?.filters?.newcreation?.bysells,
      firstInputName: "Min",
      firstInputIcon: "",
      secondInputName: "Max",
      secondInputIcon: "",
      type: "number",
    },
  ];
  // New Creations data
  const NewCreationFilterData = {
    Title: memescopePage?.mainHeader?.filters?.newcreation?.newcreationsfilter,
    FilterInput,
    FromToFilter,
  };
  // About to Graduate data
  const AboutGraduate = {
    Title: memescopePage?.mainHeader?.filters?.abouttograduate,
    FilterInput,
    FromToFilter,
  };
  // Graduated data
  const Graduate = {
    Title: memescopePage?.mainHeader?.filters?.graduated,
    FilterInput,
    FromToFilter,
  };
  ///------------------------------------------
  const HeaderData = {
    newPairsIcon: {
      menuIcon: memescopeImg,
      headTitle: memescopePage?.mainHeader?.title,
      discription: memescopePage?.mainHeader?.desc,
    },
    // timeDuration: ["1m", "5m", "1h", "6h", "24h"],
    // Filter: {
    //   menuIcon: Filter,
    //   menuTitle: "Filter",
    // },
    // Advanced: {
    //   menuIcon: Advanced,
    //   menuTitle: "Advanced",
    // },
    Buy: {
      menuIcon: buyIcon,
      menuTitle: memescopePage?.mainHeader?.buy,
      placeHolder: "0$",
    },
    coin: {
      menuIcon: bitcoinIcon,
    },
  };
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  const { closeWebSocketConnection } = NewPairSOLData();

  return (
    <>
      <div className="relative">
        <div
          className={`${pathname === "/memescope"
            ? "sticky z-10 top-0"
            : "sticky z-10 top-[56.5px]"
            }  `}
        >
          <AllPageHeader HeaderData={HeaderData} duration={true} />
        </div>
        <div className={`grid xl:grid-cols-3 w-full  `}>
          {/* box 1 */}
          <div
            className={` ${NewData.length === 0 ? `border-r ${borderColor} ` : ""
              }`}
          >
            <div
              className={`md:flex border-r ${borderColor} justify-between items-center w-full sticky px-1 sm:px-3 md:px-[24px] md:pt-[24px]`}
            >
              <div className="xl:flex xl:items-center xl:gap-1 hidden">
                <div className={`text-[18px] font-[700] w-auto text-[#FFFFFF]`}>
                  {memescopePage?.tableheaders?.newcreations}
                </div>
                <Infotip
                  iconSize={20}
                  body={memescopePage?.tableheaders?.newcreationstooltip}
                />
              </div>

              {/* Mobile screen header */}
              <div className="flex justify-between items-center xl:hidden w-full ease-in-out duration-200 !my-[15px]">
                {/* --creation Graduate Graduated--- */}
                <div
                  className={`md:static sm:block flex  sticky top-0  rounded-md bg-[#16171D] border ${borderColor}`}
                >
                  <button
                    // key={index}
                    onClick={() => setSelectedScope(1)}
                    className={`${selectedScope === 1 &&
                      "bg-[#1F73FC] first-of-type:rounded-l-md"
                      }  py-2 px-3 text-xs  text-[#ffffff] hover:bg-[#1F73FC] border-r ${borderColor}`}
                  >
                    {memescopePage?.tableheaders?.newcreations}
                  </button>
                  <button
                    // key={index}
                    onClick={() => setSelectedScope(2)}
                    className={`${selectedScope === 2 && "bg-[#1F73FC]"
                      }  py-2 px-3 text-xs  text-[#ffffff] hover:bg-[#1F73FC] border-r ${borderColor}`}
                  >
                    {memescopePage?.tableheaders?.abouttogra}
                  </button>
                  <button
                    // key={index}
                    onClick={() => setSelectedScope(3)}
                    className={`${selectedScope === 3 &&
                      "bg-[#1F73FC] last-of-type:rounded-r-md"
                      }  py-2 px-3 text-xs  text-[#ffffff] hover:bg-[#1F73FC]`}
                  >
                    {memescopePage?.tableheaders?.graduated}
                  </button>
                </div>
                {selectedScope === 1 && (
                  <FilterButton onClick={() => handleSidebarToggle(0)} />
                )}
                {selectedScope === 2 && (
                  <FilterButton onClick={() => handleSidebarToggle(1)} />
                )}
                {selectedScope === 3 && (
                  <FilterButton onClick={() => handleSidebarToggle(2)} />
                )}
              </div>

              <div className="hidden xl:block">
                <FilterButton onClick={() => handleSidebarToggle(0)} />
              </div>
            </div>
            {/* Box body */}
            <div
              className={`${selectedScope === 1 ? "block " : "hidden xl:block"
                }`}
            >
              <MscopePumpTable MemscopeData={NewData} />
            </div>
          </div>

          {/* 2 box */}
          <div
            className={` ${Graduatedata.length === 0 ? `border-r ${borderColor}` : ""
              }`}
          >
            {/* Box header */}
            <div
              className={` border-r ${borderColor} justify-between items-center gap-5 w-full px-5 md:px-[24px] md:pt-[24px] sticky xl:flex hidden`}
            >
              <div className="flex items-center gap-1">
                <div
                  className={`text-[18px] font-[700] w-auto h-[21p] text-[#FFFFFF]`}
                >
                  {memescopePage?.tableheaders?.abouttogra}
                </div>
                <Infotip
                  iconSize={20}
                  body={memescopePage?.tableheaders?.abouttogratooltip}
                />
              </div>
              {/* Filter button */}
              <FilterButton onClick={() => handleSidebarToggle(1)} />
            </div>
            {/* Box body */}
            <div
              className={`${selectedScope === 2 ? "block " : "hidden xl:block"
                }`}
            >
              <MscopePumpTable MemscopeData={Graduatedata} />
            </div>
          </div>

          {/* 3 box */}
          <div
            className={` ${Graduateddata.length === 0
              ? `border-r ${borderColor} h-screen`
              : ""
              }`}
          >
            {/* Box header */}
            <div
              className={`xl:flex border-r ${borderColor} justify-between items-center gap-5 w-full px-5 md:px-[24px] md:pt-[24px] sticky top-[138px] hidden`}
            >
              <div className="flex items-center gap-1">
                <div
                  className={`text-[18px] font-[700] w-auto h-[21p] text-[#FFFFFF]`}
                >
                  {memescopePage?.tableheaders?.graduated}
                </div>
                <Infotip
                  iconSize={20}
                  body={memescopePage?.tableheaders?.graduatedtooltip}
                />
              </div>
              {/* Filter button */}
              <FilterButton onClick={() => handleSidebarToggle(2)} />
            </div>
            {/* Box body */}
            <div
              className={`${selectedScope === 3 ? "block " : "hidden xl:block"
                }`}
            >
              <MscopePumpTable MemscopeData={Graduateddata} />
            </div>
          </div>


          {/* Filter sidebar */}
          <FilterMemescope
            isOpen={openDropdown === 0}
            setIsOpen={() => setOpenDropdown(null)}
            data={NewCreationFilterData}
            onApply={onApply}
            onReset={onReset}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
          <FilterMemescope
            isOpen={openDropdown === 1}
            setIsOpen={() => setOpenDropdown(null)}
            data={AboutGraduate}
            onApply={onApply}
            onReset={onReset}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
          <FilterMemescope
            isOpen={openDropdown === 2}
            setIsOpen={() => setOpenDropdown(null)}
            data={Graduate}
            onApply={onApply}
            onReset={onReset}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />

        </div>
      </div>
    </>
  );
};

export default Memescope;
