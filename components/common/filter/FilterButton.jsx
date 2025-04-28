import React from "react";
import { useTranslation } from "react-i18next";
import { CiFilter } from "react-icons/ci";

function FilterButton({ onClick }) {
  const { t, ready } = useTranslation();
  const tredingPage = t("tredingPage");
  return (
    <div className=" ">
      <div
        className="flex items-center text-[12px] gap-1 px-[20px] py-[10px] border border-[#1F73FC] hover:bg-[#11265B] rounded-md bg-transparent font-bold text-xs text-[#ffffff] cursor-pointer w-fit  h-[36px] xl:flex ease-in-out duration-300"
        onClick={onClick}
      >
        <CiFilter className="text-[16px]" />
        {tredingPage?.mainHeader?.filter?.filter}
      </div>
    </div>
  );
}

export default FilterButton;
