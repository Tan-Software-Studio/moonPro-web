"use client";
import { bitcoinIcon, buyIcon, memescopeImg } from "@/app/Images";
import AllPageHeader from "@/components/common/AllPageHeader/AllPageHeader";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MscopePumpTable from "@/components/common/memsscope/MscopePumpTable";
import { usePathname } from "next/navigation";
import FilterMemescope from "@/components/common/filter/FilterMemescope";
import FilterButton from "@/components/common/filter/FilterButton";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import { useTranslation } from "react-i18next";
import { aboutGraduateFilterData, applyAllAboutGraduatDataFilters, checkIfAboutGraduatDataFiltersExist, initialAboutGraduatDataFilterValues, loadAboutGraduatDataFiltersFromStorage, applyAboutGraduatDataFilters, resetAboutGraduatDataFilters } from '../../../../components/memescope/AboutGraduateDataFilter'
import { graduatedFilterData, applyGraduatedDataFilters, initialGraduatedDataFilterValues, resetGratuatedDataFilters, loadGraduatedDataFiltersFromStorage, checkIfGraduatedDataFiltersExist, applyAllGraduatedDataFilters } from "@/components/memescope/GraduatedDataFilter";
import { applyAllNewCreationDataFilters, applyNewCreationDataFilters, checkIfNewCreationFiltersExist, initialNewCreationDataFilterValues, loadNewCreationDataFiltersFromStorage, newCreationFilterData, resetNewCreationDataFilters } from "@/components/memescope/NewCreationDataFilter";

const Memescope = () => {
  const { t } = useTranslation();
  const memescopePage = t("memescope");
  const [selectedScope, setSelectedScope] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();


  // == about graduate states == \\
  const [aboutGraduateDataFilterValues, setAboutGraduateDataFilterValues] = useState(initialAboutGraduatDataFilterValues);  // input values
  const [aboutGraduateDataFiltersApplied, setaboutGraduateDataFiltersApplied] = useState(false); // filter applied or not
  const [filteredAboutGraduatData, setFilteredAboutGraduatData] = useState([]); // filtered data

  // == graduated states == \\
  const [graduatedDataFilterValues, setGraduatedDataFilterValues] = useState(initialGraduatedDataFilterValues); // input values
  const [graduatedDataFiltersApplied, setGraduatedDataFiltersApplied] = useState(false); // filter applied or not
  const [filteredGraduatedData, setFilteredGraduatedData] = useState([]); // filtered data

  const [newCreationDataFilterValues, setNewCreationDataFilterValues] = useState(initialNewCreationDataFilterValues);
  const [newCreationDataFiltersApplied, setNewCreationDataFiltersApplied] = useState(false); // filter applied or not
  const [filteredNewCreationData, setFilteredNewCreationData] = useState([]); // filtered data



  // =======*=*= All about graduate data filter ==========//
  const Graduatedata = useSelector(
    (state) => state?.allMemescopeData?.MscopeGraduateData
  );
  // input of about graduate data
  const aboutGraduateFilterDataJson = aboutGraduateFilterData(memescopePage)

  // onApply function 
  function onApplyAboutGraduatData() {
    applyAboutGraduatDataFilters(aboutGraduateDataFilterValues, Graduatedata, setFilteredAboutGraduatData, setaboutGraduateDataFiltersApplied)
  }

  // onReset function  
  function onResetAboutGraduatData() {
    resetAboutGraduatDataFilters(setAboutGraduateDataFilterValues, setFilteredAboutGraduatData, setaboutGraduateDataFiltersApplied)

  }

  // about graduate data apply in localstotahr
  useEffect(() => {
    const savedFilters = loadAboutGraduatDataFiltersFromStorage();
    if (savedFilters) {
      setAboutGraduateDataFilterValues(savedFilters);
    }
  }, []);

  // Apply saved filters when data avilable 
  useEffect(() => {
    const savedFilters = loadAboutGraduatDataFiltersFromStorage();

    if (savedFilters && Graduatedata.length > 0) {
      const hasFilters = checkIfAboutGraduatDataFiltersExist(savedFilters);

      if (hasFilters) {
        const filteredResult = applyAllAboutGraduatDataFilters(Graduatedata, savedFilters);
        setFilteredAboutGraduatData(filteredResult);
        setaboutGraduateDataFiltersApplied(true);
      }
    }
  }, [Graduatedata]);

  // Check if filters are or not
  const aboutDataToShow = aboutGraduateDataFiltersApplied && filteredAboutGraduatData.length >= 0
    ? filteredAboutGraduatData
    : Graduatedata;




  // =======*=*= All graduated data filter ==========//
  const Graduateddata = useSelector(
    (state) => state?.allMemescopeData?.MscopeGraduatedData
  );
  const GraduateddataSortedData = [...Graduateddata].sort((a, b) => b.created_time - a.created_time);

  const graduatedFilterDataJson = graduatedFilterData(memescopePage);

  function onApplyGraduatedData() {
    applyGraduatedDataFilters(
      graduatedDataFilterValues,
      GraduateddataSortedData,
      setFilteredGraduatedData,
      setGraduatedDataFiltersApplied

    )
  }

  function onReserGraduatedData() {
    resetGratuatedDataFilters(
      setGraduatedDataFiltersApplied,
      setGraduatedDataFilterValues,
      setFilteredGraduatedData
    )
  }

  useEffect(() => {
    const savedFilters = loadGraduatedDataFiltersFromStorage();
    if (savedFilters) {
      setGraduatedDataFilterValues(savedFilters);
    }
  }, []);

  useEffect(() => {
    const savedFilters = loadGraduatedDataFiltersFromStorage();

    if (savedFilters && GraduateddataSortedData.length > 0) {
      const hasFilters = checkIfGraduatedDataFiltersExist(savedFilters);

      if (hasFilters) {
        const filteredResult = applyAllGraduatedDataFilters(GraduateddataSortedData, savedFilters);
        setFilteredGraduatedData(filteredResult);
        setGraduatedDataFiltersApplied(true);
      }
    }
  }, [GraduateddataSortedData]);

  const graduateDataToShow = graduatedDataFiltersApplied && filteredGraduatedData.length >= 0
    ? filteredGraduatedData
    : GraduateddataSortedData;


  // == new creation data filter == \\
  const NewData = useSelector((state) => state?.allMemescopeData?.newLaunch);
  const NewCreationFilterDataJson = newCreationFilterData(memescopePage);

  function onApplyNewCreationData() {
    applyNewCreationDataFilters(
      newCreationDataFilterValues,
      NewData,
      setFilteredNewCreationData,
      setNewCreationDataFiltersApplied
    )
  }

  function onReserNewCreationData() {
    resetNewCreationDataFilters(
      setNewCreationDataFiltersApplied,
      setNewCreationDataFilterValues,
      setFilteredNewCreationData

    )
  }

  useEffect(() => {
    const savedFilters = loadNewCreationDataFiltersFromStorage();
    if (savedFilters) {
      setNewCreationDataFilterValues(savedFilters);
    }
  }, []);

  useEffect(() => {
    const savedFilters = loadNewCreationDataFiltersFromStorage();

    if (savedFilters && filteredNewCreationData.length > 0) {
      const hasFilters = checkIfNewCreationFiltersExist(savedFilters);

      if (hasFilters) {
        const filteredResult = applyAllNewCreationDataFilters(NewData, savedFilters);
        setFilteredNewCreationData(filteredResult);
        setNewCreationDataFiltersApplied(true);
      }
    }
  }, [NewData]);

  const newCreationDataToShow = newCreationDataFiltersApplied && filteredNewCreationData.length >= 0
    ? filteredNewCreationData
    : NewData;

  const handleSidebarToggle = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  function onApply() {
    console.log("Apply filters");
  }
  function onReset() {
    console.log("remove filters");
  }


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
              <MscopePumpTable MemscopeData={newCreationDataToShow} />
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
              <MscopePumpTable MemscopeData={aboutDataToShow} />
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
              className={`xl:flex border-r ${borderColor} justify-between items-center gap-5 w-full px-5 md:px-[24px] md:pt-[24px] sticky hidden`}
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
              <MscopePumpTable MemscopeData={graduateDataToShow} />
            </div>
          </div>


          {/* Filter sidebar */}
          <FilterMemescope
            isOpen={openDropdown === 0}
            setIsOpen={() => setOpenDropdown(null)}
            data={NewCreationFilterDataJson}
            onApply={onApplyNewCreationData}
            onReset={onReserNewCreationData}
            filterValues={newCreationDataFilterValues}
            setFilterValues={setNewCreationDataFilterValues}
          />
          <FilterMemescope
            isOpen={openDropdown === 1}
            setIsOpen={() => setOpenDropdown(null)}
            data={aboutGraduateFilterDataJson}
            onApply={onApplyAboutGraduatData}
            onReset={onResetAboutGraduatData}
            filterValues={aboutGraduateDataFilterValues}
            setFilterValues={setAboutGraduateDataFilterValues}
          />
          <FilterMemescope
            isOpen={openDropdown === 2}
            setIsOpen={() => setOpenDropdown(null)}
            data={graduatedFilterDataJson}
            onApply={onApplyGraduatedData}
            onReset={onReserGraduatedData}
            filterValues={graduatedDataFilterValues}
            setFilterValues={setGraduatedDataFilterValues}
          />

        </div>
      </div>
    </>
  );
};

export default Memescope;
