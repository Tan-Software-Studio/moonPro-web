"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Infotip from "@/components/common/Tooltip/Infotip.jsx"
import { FaBell, FaBellSlash } from "react-icons/fa";
import toast from "react-hot-toast";
const TableHeaderData = ({ headers, onSort, sortColumn, sortOrder, data }) => {
  const [sortStates, setSortStates] = useState({});
  const [isAiSignalNotificationOn, setIsAiSignalNotificationOn] = useState(() => {
    const storedValue = localStorage.getItem('ai-signal-notification');
    return storedValue ? JSON.parse(storedValue) : true;
  });
  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );
  const hasScrolled = useSelector(
    (state) => state?.AllthemeColorData?.hasTableScroll
  );

  const handleSort = (header) => {
    const currentSortOrder = sortStates[header.sortingKey] || "asc";
    const newSortOrder = currentSortOrder === "asc" ? "desc" : "asc";

    // Update the sort state for the specific header
    setSortStates((prev) => ({
      ...prev,
      [header.sortingKey]: newSortOrder,
    }));

    // Call the onSort function with the new sort order
    onSort(header.sortingKey, newSortOrder);
  };
 

  useEffect(() => {
    localStorage.setItem('ai-signal-notification', JSON.stringify(isAiSignalNotificationOn));
  }, [isAiSignalNotificationOn]);

  return (
    <thead
      className={`!text-[#84858E] bg-[#08080E] sticky top-0 transition-all duration-500 ease-in-out ${hasScrolled ? "z-10" : "z-10"
        }`}
    >
      {hasScrolled && (
        <div
          className={`w-full absolute xl:top-9 top-12 z-50`}
        />
      )}
      <tr>
        {headers.map((header, index) => (
          <th
            key={index}
            scope="col"
            className={`text-[#7a7e9e] uppercase px-3 pt-2.5 pb-3 ${header.key == "pairInfo" || header.key == "auditResults"
              ? "md:w-[7%] w-7"
              : "md:w-32 w-28"
              }`}
          >
            <div className={`flex items-center ${header.key === "quickBuy" || header.key === "auditResults" ? "justify-center" : "justify-start"
              } `}>
              <div
                className={`flex items-center ${header.key === "quickBuy" || header.key === "auditResults" ? "justify-center" : "justify-start"
                  } gap-1 cursor-pointer ${header.key == "pairInfo" || header.key == "auditResults"
                    ? "w-60"
                    : "md:w-32 w-28"
                  }`}
                onClick={() => handleSort(header)}
              >
                <td className={`text-xs font-semibold capitalize text-[#5c6772]`}>{header?.title}</td>
                {header?.sortable && (
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      fill="currentColor"
                      className={`g-table-column-sorter-up active ${sortColumn === header.sortingKey && sortOrder === "asc"
                        ? "text-white"
                        : "text-[#84858E]"}`}
                      viewBox="0 0 7 7"
                    >
                      <path d="M3.199 2.344a.4.4 0 01.602 0L6.42 5.337A.4.4 0 016.118 6H.882a.4.4 0 01-.302-.663L3.2 2.344z"></path>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      fill="currentColor"
                      className={`g-table-column-sorter-down ${sortColumn === header.sortingKey && sortOrder === "desc"
                        ? "text-white"
                        : "text-[#84858E]"
                        }`}
                      viewBox="0 0 7 7"
                    >
                      <path d="M3.801 4.656a.4.4 0 01-.602 0L.58 1.663A.4.4 0 01.882 1h5.236a.4.4 0 01.302.663L3.8 4.656z"></path>
                    </svg>
                  </div>


                )}
                {header?.infoTipString && (
                  <Infotip body={header?.infoTipString} />
                )}

                {header?.notificationIcon &&
                  <div onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsAiSignalNotificationOn(!isAiSignalNotificationOn)
                  }}>
                    {isAiSignalNotificationOn ? <FaBell size={18} color="#ffffff" /> : <FaBellSlash size={18} color="#ffffff" />}
                  </div>
                }
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaderData;
