/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Clear, solana } from "@/app/Images";
import Image from "next/image";
import { setIsSearchPopup } from "@/app/redux/states";
import { useDispatch } from "react-redux";
import SearchResultData from "./SearchResultData";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setActiveChartToken } from "@/app/redux/chartDataSlice/chartData.slice";

const SearchPopup = () => {
  const [searchData, setsearchData] = useState(false);
  const [searchToken, setSearchToken] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [resentTokens, setResentTokens] = useState([]);

  const popupRef = useRef(null);
  const debounceRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        dispatch(setIsSearchPopup(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SearchResult = async (value) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URLS}wavePro/users/searchToken`,
        { search: value }
      );
      if (res?.data?.success) {
        setSearchLoader(false);
        setSearchResult(res?.data?.data);
      }
    } catch (error) {
      setSearchLoader(false);
      setSearchResult([]);
      setNotFoundMessage(error?.response?.data?.message);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    // console.log("🚀 ~ handleSearchChange ~ value:", value)
    setSearchToken(value);
    setsearchData(Boolean(value)); // Show or hide search data state

    if (!value) {
      setSearchLoader(false);
      setSearchResult([]);
      return;
    }

    // Start loader when typing begins
    if (value.length >= 3) {
      setSearchLoader(true);
    }
    // Debounce API call
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.length >= 3) {
        SearchResult(value);
      } else {
        setSearchResult([]);
      }
    }, 500);
  };
  const handleSearchClear = () => {
    setSearchToken("");
    setSearchResult([]);
    setSearchLoader(false);
    setsearchData(false);
  };

  useEffect(() => {
    const storedTokens = JSON.parse(
      localStorage.getItem("recentTokens") || "[]"
    );
    setResentTokens(storedTokens);
  }, []);

  function navigateToChartView(e) {
    dispatch(setIsSearchPopup(false));
    dispatch(
      setActiveChartToken({
        symbol: e?.Trade?.Currency?.Symbol,
        img: e?.img || e?.dexImg,
        pairAddress: e?.Trade?.Market?.MarketAddress,
      })
    );
    localStorage.setItem("chartTokenAddress", e?.Trade?.Currency?.MintAddress);
  }
  return (
    <>
      <div
        className={`h-svh bg-black bg-opacity-60  w-full fixed top-0 left-0 right0 z-[999] duration-75 transition-all ease-in-out block cursor-pointer`}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-[999999] h-[100dvh] w-full">
        <div
          className="overflow-y-auto md:w-auto w-full visibleScroll"
          ref={popupRef}
        >
          <div className="relative z-[999999] w-full flex items-center justify-center">
            <div className="mt-3 bg-[#08080e] md:mx-5 w-[90%] sm:w-[80%] md:w-[40rem] lg:w-[56rem] xl:w-[58rem] ">
              {/* Searchbar */}
              <div className="sticky top-0 z-[9999999] ">
                <div className="flex bg-[#191919] py-3">
                  <span className="inline-flex items-center px-3 text-sm bg-[#191919] text-gray-400 border-[#333333]">
                    {searchLoader === true ? (
                      <div class="simple-spinner">
                        <span></span>
                      </div>
                    ) : (
                      <svg
                        class="w-4 h-4 text-white font-bold"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="text"
                    autocomplete="off"
                    id="website-admin"
                    className="block flex-1 min-w-0 w-full pr-3 text-sm bg-transparent border-[#333333] placeholder-gray-400 text-white outline-none"
                    placeholder="Search"
                    value={searchToken}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                  {searchToken && (
                    <button
                      onClick={handleSearchClear}
                      className="appearance-none inline-flex items-center justify-center select-none whitespace-nowrap rounded-[0.375rem] h-6 min-w-6 text-xs px-2 border border-[rgba(255,255,255,0.16)] text-[rgba(255,255,255,0.92)] mr-3 gap-1"
                    >
                      {/* <span className="inline-flex items-center flex-shrink-0"> */}
                      <Image src={Clear} alt="Clear" />
                      {/* </span> */}
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {resentTokens?.length > 0 && (
                <div className="flex items-center gap-2 m-5">
                  <h3 className="text-sm text-white opacity-60">Recents :</h3>
                  <div className="flex overflow-x-auto gap-2">
                    {resentTokens.map((recentData, index) => (
                      <Link
                        key={index}
                        href={`/tradingview/${recentData?.Trade?.Currency?.MintAddress}`}
                      >
                        <button
                          onClick={() => navigateToChartView(recentData)}
                          className="text-xs text-white px-2 py-1 bg-[#17171c] rounded cursor-pointer hover:bg-[#333] flex gap-2 items-center"
                        >
                          <div className="flex w-7 h-7 items-center justify-center border border-dashed rounded-md border-gray-700 relative">
                            {recentData?.img ? (
                              <img
                                src={recentData?.img}
                                alt={`${recentData?.Currency?.Symbol}`}
                                className="w-7 h-7 rounded-md border border-dashed border-gray-700 text-sm text-gray-700 uppercase"
                              />
                            ) : recentData?.Currency?.Symbol ? (
                              recentData?.Currency?.Symbol?.charAt(0)
                            ) : (
                              "?"
                            )}
                            <Image
                              src={solana}
                              alt="solana"
                              className="absolute w-3 h-3 right-0 bottom-0"
                            />
                          </div>
                          <span>{recentData?.Trade?.Currency?.Symbol}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 h-[60vh] md:h-[80vh] overflow-auto visibleScroll p-3 rounded-md w-full">
                {!searchData || searchToken?.length <= 2 ? (
                  <div className="h-[60vh] md:h-[70vh] flex items-center justify-center opacity-50 w-full">
                    Search by Token Symbol and Name
                  </div>
                ) : (
                  <div className="w-full">
                    <SearchResultData
                      searchToken={searchToken}
                      searchResult={searchResult}
                      searchLoader={searchLoader}
                      notFoundMessage={notFoundMessage}
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

export default SearchPopup;
