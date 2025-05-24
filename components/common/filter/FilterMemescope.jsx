

import React, { useEffect, useState } from 'react';
import { HiMenuAlt2 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import { useTranslation } from 'react-i18next';

function FilterMemescope({ isOpen, setIsOpen, data, onApply, onReset, filterValues, setFilterValues }) {
  const { t } = useTranslation();
  const tredingPage = t("tredingPage");

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (id, title, checked) => {
    setFilterValues(prev => ({
      ...prev,
      [title]: {
        ...(prev[title] || {}), // avoid undefined
        checked
      }
    }));
  };

  // Handle min/max input changes
  const handleInputChange = (id, title, field, value) => {
    setFilterValues(prev => ({
      ...prev,
      [title]: {
        ...(prev[title] || {}),
        [field]: value
      }
    }));
  };

  // Reset all filters


  // Apply filters and close the panel
  const handleApply = () => {
    if (onApply) {
      onApply();
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    setIsOpen(false);
  }

  const chcekBoxStyle =
    "appearance-none w-4 h-4 border border-gray-400 rounded-sm bg-transparent flex items-center justify-center checked:bg-[#3e9fd6] checked:border-[#3e9fd6] checked:after:content-['✔'] checked:after:text-xs";

  return (
    <>
      {isOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-[9999998]"
          onClick={handleClose}
        />
      )}
      <div
        className={`absolute transition-all duration-500 ease-in-out top-0 ${isOpen ? "right-0" : "-right-full"
          } md:w-[366px] w-full h-screen bg-[#16171c] z-[9999999]`}
      >
        <div className="">
          <div className="flex w-full justify-between p-3 px-3 py-4 h-full items-center border-b border-gray-500">
            <div className="flex items-center gap-1 ">
              <HiMenuAlt2 color="11265B" size={20} />
              <span className="text-sm font-semibold text-gray-0">
                {data?.Title}
              </span>
            </div>
            <div className="cursor-pointer" onClick={handleClose}>
              <MdClose size={15} />
            </div>
          </div>

          <div className="">
            <div className="flex flex-col gap-y-2 w-full px-3">
              {data?.FilterInput?.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full justify-between h-full py-1.5 items-center"
                >
                  <div className="flex items-center gap-1">
                    <div className="text-xs font-semibold leading-[100%] text-gray-300">
                      {item?.name}
                    </div>
                    {item?.infotipString && (
                      <Infotip body={item?.infotipString} />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={filterValues[item.title]?.checked || false}
                    onChange={(e) =>
                      handleCheckboxChange(item.id, item?.title, e.target.checked)
                    }
                    className={`${chcekBoxStyle} text-[#11265B] focus:text-[#11265B] focus:ring-[#11265B] bg-[#11265B] placeholder:text-[#11265B] cursor-pointer`}
                  />
                </div>
              ))}
            </div>

            {data?.FilterInput && (
              <div className="px-3">
                <div className="w-full border-b border-gray-600 my-4"></div>
              </div>
            )}

            {data?.FromToFilter?.map((item) => (
              <div key={item?.id} className="flex flex-col gap-y-2 px-3 pb-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-300">{item?.name}</div>
                  {/* min input */}
                  <div className="flex gap-2">
                    <div className="relative w-[100px]">
                      <input
                        placeholder={item?.firstInputName}
                        className="box-border p-1.5 text-xs !h-[28px] w-full text-[#E9E9E9] text-start bg-[#202129] border-0 rounded outline-0 appearance-none pr-5 transition-all duration-200 ease-linear"
                        value={filterValues[item.title]?.min || ""}
                        onChange={(e) =>
                          handleInputChange(item.id, item?.title, "min", e.target.value)
                        }
                        type="number"
                      />
                      <div className="absolute text-xs text-[#E9E9E9] top-1/2 right-2 transform -translate-y-1/2">
                        {item?.firstInputIcon}
                      </div>
                    </div>

                    {/* max input */}
                    <div className="relative w-[100px]">
                      <input
                        placeholder={item?.secondInputName}
                        className="box-border p-1.5 text-xs !h-[28px] w-full text-[#E9E9E9] text-start bg-[#202129] border-0 rounded outline-0 appearance-none pr-5 transition-all duration-200 ease-linear"
                        value={filterValues[item.title]?.max || ""}
                        onChange={(e) =>
                          handleInputChange(item.id, item?.title, "max", e.target.value)
                        }
                        type="number"
                      />
                      <div className="absolute text-xs text-[#E9E9E9] top-1/2 right-2 transform -translate-y-1/2">
                        {item?.secondInputIcon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-14 left-0 w-full">
            <div className="flex justify-between border-t border-gray-500 py-3 px-4 bg-[#16171c]">
              <button
                className="text-gray-200 gap-2 text-xs flex items-center"
                onClick={handleReset}
              >
                <VscDebugRestart />
                {tredingPage?.mainHeader?.filter?.reset}
              </button>

              <button
                onClick={handleApply}
                className="bg-[#11265B] !font-semibold h-[36px] !px-8 border-2 border-[#0E43BD] rounded-md text-white text-grey-0 text-xs"
              >
                {tredingPage?.mainHeader?.filter?.apply}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterMemescope;