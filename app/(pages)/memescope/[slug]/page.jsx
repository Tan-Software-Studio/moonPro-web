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
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [searchbar, setSearchbar] = useState(null);
  const [showCircle, setShowCircle] = useState(null);
  const [showMarketCap, setShowMarketCap] = useState(null);
  const [showVolume, setShowVolume] = useState(null);
  const [showSocials, setShowSocials] = useState(null);
  const [showHolders, setShowHolders] = useState(null);
  const [showHolders10, setshowHolders10] = useState(null);
  const [progerssBar, setProgerssBar] = useState(null);
  const [newSearchData, setNewSearchData] = useState('');
  const [newAboutToSearchData, setAboutToSearchData] = useState('');
  const [graduateSearchData, setGraduateSearchData] = useState('');

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

  const aboutSearchedData = Graduatedata.filter((item) =>
    item.symbol.toUpperCase().includes(newAboutToSearchData.toUpperCase())
  );

  const hasAboutSearch = newAboutToSearchData.trim() !== "";

  const aboutDataToShow = aboutGraduateDataFiltersApplied
    ? (hasAboutSearch ? aboutSearchedData : filteredAboutGraduatData)
    : (hasAboutSearch ? aboutSearchedData : Graduatedata);


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

  const graduatedSearchData = GraduateddataSortedData.filter((item) =>
    item.symbol.toUpperCase().includes(graduateSearchData.toUpperCase())
  );

  const hasGraduateSearch = graduateSearchData.trim() !== "";

  const graduateDataToShow = graduatedDataFiltersApplied
    ? (hasGraduateSearch ? graduatedSearchData : filteredGraduatedData)
    : (hasGraduateSearch ? graduatedSearchData : GraduateddataSortedData);

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

  const searchedData = NewData.filter((item) =>
    item.symbol.toUpperCase().includes(newSearchData.toUpperCase())
  );

  const hasSearch = newSearchData.trim() !== "";

  const newCreationDataToShow = newCreationDataFiltersApplied
    ? (hasSearch ? searchedData : filteredNewCreationData)
    : (hasSearch ? searchedData : NewData);

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

  useEffect(() => {
    const savedSearchbar = localStorage.getItem('searchbar');
    const savedShowCircle = localStorage.getItem('showCircle');

    if (savedSearchbar !== null) {
      setSearchbar(savedSearchbar === 'true'); // convert string to boolean
    }

    if (savedShowCircle !== null) {
      setShowCircle(savedShowCircle === 'true');
    }
  }, []);



  return (
    <>
      <div className="relative">
        <div
          className={`${pathname === "/memescope"
            ? "sticky z-10 top-0"
            : "sticky z-10 top-[50px]"
            }  `}
        >
          <AllPageHeader HeaderData={HeaderData} duration={true} setSelectedMetric={setSelectedMetric} selectedMetric={selectedMetric} setSearchbar={setSearchbar} searchbar={searchbar} setShowCircle={setShowCircle} showCircle={showCircle} setShowMarketCap={setShowMarketCap} showMarketCap={showMarketCap} setShowVolume={setShowVolume} showVolume={showVolume} setShowSocials={setShowSocials} showSocials={showSocials} showHolders={showHolders} setShowHolders={setShowHolders} setshowHolders10={setshowHolders10} showHolders10={showHolders10} setProgerssBar={setProgerssBar} progerssBar={progerssBar} />
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
                <div className={`text-[18px] font-[400] w-auto text-[#FFFFFF]`}>
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
              <div className="flex">
                {searchbar ? <input
                  type="text"
                  placeholder="Search by ticker or name"
                  className="bg-[#101115] border border-gray-700 text-gray-400 placeholder-gray-500 rounded-full text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={newSearchData}
                  onChange={(e) => setNewSearchData(e.target.value)}
                /> : null}
                <div className="relative hidden xl:block group">
                  <FilterButton onClick={() => handleSidebarToggle(0)} />

                  {/* Tooltip shown on top with delay */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 px-2 py-1 z-50 text-sm text-[#c6c5cb] bg-[#101115] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-[#1a1b22]"
                    style={{ transitionDelay: '300ms' }}
                  >
                    Filter
                  </div>
                </div>



              </div>
            </div>
            {/* Box body */}
            <div
              className={`${selectedScope === 1 ? "block " : "hidden xl:block"
                }`}
            >
              <MscopePumpTable MemscopeData={newCreationDataToShow} selectedMetric={selectedMetric} showCircle={showCircle} setSelectedMetric={setSelectedMetric} setShowMarketCap={setShowMarketCap} showMarketCap={showMarketCap} setShowVolume={setShowVolume} showVolume={showVolume} setShowSocials={setShowSocials} showSocials={showSocials} showHolders={showHolders} setShowHolders={setShowHolders} setshowHolders10={setshowHolders10} showHolders10={showHolders10} setProgerssBar={setProgerssBar} progerssBar={progerssBar} />
            </div>
          </div>

          {/* 2 box */}
          <div
            className={` ${Graduatedata.length === 0 ? `border-r ${borderColor}` : ""
              }`}
          >
            {/* Box header */}
            <div
              className={` border-r ${borderColor} justify-between items-center md:px-[24px] md:pt-[24px] sm:px-3  sticky xl:flex hidden`}
            >
              <div className="flex items-center gap-0">
                <div
                  className={`text-[17px] font-[400] text-[#FFFFFF]`}
                >
                  {memescopePage?.tableheaders?.abouttogra}
                </div>
                <Infotip
                  iconSize={20}
                  body={memescopePage?.tableheaders?.abouttogratooltip}
                />
              </div>

              <div className="flex">
                {searchbar ? <input
                  type="text"
                  placeholder="Search by ticker or name"
                  className="bg-[#101115] border border-gray-700 text-gray-400 placeholder-gray-500 rounded-full text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={newAboutToSearchData}
                  onChange={(e) => setAboutToSearchData(e.target.value)}
                /> : null}
                {/* Filter button */}


                <div className="relative hidden xl:block group">
                  <FilterButton onClick={() => handleSidebarToggle(1)} />

                  {/* Tooltip shown on top with delay */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 px-2 py-1 !z-50 text-sm text-[#c6c5cb] bg-[#101115] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-[#1a1b22]"
                    style={{ transitionDelay: '300ms' }}
                  >
                    Filter
                  </div>
                </div>

              </div>
            </div>
            {/* Box body */}
            <div
              className={`${selectedScope === 2 ? "block " : "hidden xl:block"
                }`}
            >
              <MscopePumpTable MemscopeData={aboutDataToShow} selectedMetric={selectedMetric} showCircle={showCircle} setSelectedMetric={setSelectedMetric} setShowMarketCap={setShowMarketCap} showMarketCap={showMarketCap} setShowVolume={setShowVolume} showVolume={showVolume} setShowSocials={setShowSocials} showSocials={showSocials} showHolders={showHolders} setShowHolders={setShowHolders} setshowHolders10={setshowHolders10} showHolders10={showHolders10} setProgerssBar={setProgerssBar} progerssBar={progerssBar} />
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
              className={`xl:flex border-r ${borderColor} justify-between items-center w-full px-5 md:px-[24px] md:pt-[24px] sticky hidden`}
            >
              <div className="flex items-center">
                <div
                  className={`text-[18px] font-[400] mr-1 h-[21p] text-[#FFFFFF]`}
                >
                  {memescopePage?.tableheaders?.graduated}
                </div>
                <Infotip
                  iconSize={20}
                  body={memescopePage?.tableheaders?.graduatedtooltip}
                />

              </div>
              <div className="flex">
                {/* Filter button */}
                {searchbar ? <input
                  type="text"
                  placeholder="Search by ticker or name"
                  className="bg-[#101115] border border-gray-700 text-gray-400 placeholder-gray-500 rounded-full text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={graduateSearchData}
                  onChange={(e) => setGraduateSearchData(e.target.value)}
                /> : null}


                <div className="relative hidden xl:block group">
                  <FilterButton onClick={() => handleSidebarToggle(2)} />

                  {/* Tooltip shown on top with delay */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 px-2 py-1 z-[9999] text-sm text-[#c6c5cb] bg-[#101115] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-[#1a1b22]"
                    style={{ transitionDelay: '300ms' }}
                  >
                    Filter
                  </div>
                </div>

              </div>
            </div>
            {/* Box body */}
            <div
              className={`${selectedScope === 3 ? "block " : "hidden xl:block"
                }`}
            >
              <MscopePumpTable MemscopeData={graduateDataToShow} selectedMetric={selectedMetric} showCircle={showCircle} setSelectedMetric={setSelectedMetric} setShowMarketCap={setShowMarketCap} showMarketCap={showMarketCap} setShowVolume={setShowVolume} showVolume={showVolume} setShowSocials={setShowSocials} showSocials={showSocials} showHolders={showHolders} setShowHolders={setShowHolders} setshowHolders10={setshowHolders10} showHolders10={showHolders10} setProgerssBar={setProgerssBar} progerssBar={progerssBar} />
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
