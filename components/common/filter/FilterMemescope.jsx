import React, { useEffect, useState } from 'react'
import { HiMenuAlt2 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import Infotip from "@/components/common/Tooltip/Infotip.jsx"
import { useTranslation } from 'react-i18next';


function FilterMemescope({ isOpen, setIsOpen, data }) {
  const { t, ready } = useTranslation();
    const tredingPage = t("tredingPage");
    // console.log("🚀 ~ FilterMemescope ~ data:+++>>>", data)

    const [inputValues, setInputValues] = useState({})

    const handleClose = () => {
        setIsOpen(false);
    }

    const handleInputChange = (id, field, value) => {
        setInputValues(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };


    useEffect(() => {
        const savedFilters = localStorage.getItem(`filters_${data.Title}`);
        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters)[data.Title] || {};

            const restoredInputValues = {};

            // Restore FromToFilter (Range Inputs)
            data?.FromToFilter?.forEach((filterItem) => {
                if (parsedFilters[filterItem.title]) {
                    restoredInputValues[filterItem.id] = {
                        min: parsedFilters[filterItem.title].min || '',
                        max: parsedFilters[filterItem.title].max || ''
                    };
                }
            });

            // Restore FilterInput (Checkboxes)
            data?.FilterInput?.forEach((filterItem) => {
                restoredInputValues[filterItem.id] = {
                    checked: parsedFilters[filterItem.name] || false
                };
            });

            setInputValues(restoredInputValues);
        }
    }, [data.Title, data.FilterInput, data.FromToFilter, setIsOpen]);



    const HandleReset = () => {
        setIsOpen(false);
        // setInputValues({})
        localStorage.removeItem(`filters_${data.Title}`);
    }

    const handleApply = () => {
        const transformedData = {};
        // Handle FromToFilter (Range Inputs)
        data?.FromToFilter?.forEach((filterItem) => {
            if (inputValues[filterItem.id]) {
                const { min, max } = inputValues[filterItem.id];
                transformedData[filterItem.title] = { min, max };
            }
        });
        // Handle FilterInput (Checkboxes)
        data?.FilterInput?.forEach((filterItem) => {
            if (inputValues[filterItem.id]?.checked !== undefined) {
                transformedData[filterItem.name] = inputValues[filterItem.id].checked;
            } else {
                transformedData[filterItem.name] = false;
            }
        });
        // Final Data Structure
        const finalData = { [data.Title]: transformedData };

        localStorage.setItem(`filters_${data.Title}`, JSON.stringify(finalData));

        setInputValues(finalData);
        // console.log("Updated Input Values:", finalData);
        setIsOpen(false);
    };

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
          className={`absolute transition-all duration-700 ease-in-out top-0 ${
            isOpen ? "right-0" : "-right-full"
          } md:w-[366px] w-full h-screen bg-[#16171c] z-[9999999]`}
        >
          <div className="">
            <div className="flex w-full justify-between p-3 px-3 py-4 h-full items-center border-b border-gray-500">
              <div className="flex items-center gap-1 ">
                <HiMenuAlt2 color="#00FFFF" size={20} />
                <span className="text-sm font-semibold text-gray-0">
                  {data?.Title}
                </span>
              </div>
              <div className="cursor-pointer" onClick={handleClose}>
                {" "}
                <MdClose size={15} />{" "}
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
                      {item?.infotipString &&
                        <Infotip body={item?.infotipString} />
                      }
                    </div>
                    <input
                      type="checkbox"
                      checked={inputValues[item.id]?.checked || false}
                      onChange={(e) =>
                        handleInputChange(item.id, "checked", e.target.checked)
                      }
                      className={`${chcekBoxStyle} cursor-pointer`}
                    />
                  </div>
                ))}
              </div>

              {data?.FilterInput && (
                <div className="px-3">
                  <div className="w-full border-b border-gray-600 my-4"></div>
                </div>
              )}

              {data?.FromToFilter?.map((data) => (
                <div key={data?.id} className="flex flex-col gap-y-2 px-3 pb-3">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-300">{data?.name}</div>
                    {/* min input */}
                    <div className="flex gap-2">
                      <div className="relative w-[100px]">
                        <input
                          placeholder={data?.firstInputName}
                          className="box-border p-1.5 text-xs !h-[28px] w-full text-[#E9E9E9] text-start bg-[#202129] border-0 rounded outline-0 appearance-none pr-5 transition-all duration-200 ease-linear"
                          value={inputValues[data.id]?.min || ""}
                          onChange={(e) =>
                            handleInputChange(data.id, "min", e.target.value)
                          }
                          type="number"
                        />

                        <div className="absolute text-xs text-[#E9E9E9] top-1/2 right-2 transform -translate-y-1/2">
                          {data?.firstInputIcon}
                        </div>
                      </div>

                      {/* max input */}
                      <div className="relative w-[100px]">
                        <input
                          placeholder={data?.secondInputName}
                          className="box-border p-1.5 text-xs !h-[28px] w-full text-[#E9E9E9] text-start bg-[#202129] border-0 rounded outline-0 appearance-none pr-5 transition-all duration-200 ease-linear"
                          value={inputValues[data.id]?.max || ""}
                          onChange={(e) =>
                            handleInputChange(data.id, "max", e.target.value)
                          }
                          type="number"
                        />

                        <div className="absolute text-xs text-[#E9E9E9] top-1/2 right-2 transform -translate-y-1/2">
                          {data?.secondInputIcon}
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
                  onClick={HandleReset}
                  className="text-gray-200 gap-2 text-xs flex items-center"
                >
                  <VscDebugRestart />
                 { tredingPage?.mainHeader?.filter?.reset}
                </button>

                <button
                  onClick={handleApply}
                  className="bg-[#1F73FC] hover:bg-[#3f8cf1] !font-semibold h-[36px] !px-8 border-[#1F73FC] rounded-md text-white text-grey-0 text-xs"
                  >
                  { tredingPage?.mainHeader?.filter?.apply}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default FilterMemescope