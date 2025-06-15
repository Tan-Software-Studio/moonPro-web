import { iconImage } from "@/app/Images";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { CiFilter } from "react-icons/ci";

function FilterButton({ onClick }) {
  const { t, ready } = useTranslation();
  const tredingPage = t("tredingPage");
  return (
    <>
      <div
        className="flex items-center text-[12px] gap-1 pl-[20px] py-[10px] font-bold text-xs text-[#cdc8cd] cursor-pointer w-fit  h-[36px] xl:flex ease-in-out duration-300"
        onClick={onClick}
      >
        {/* <CiFilter className="text-[15px] text-[#cdc8cd] font-bold" /> */}
        {/* {tredingPage?.mainHeader?.filter?.filter} */}
        <Image src={iconImage} alt="icon_image" className="h-5 w-5" />
      </div>
    </>
  );
}

export default FilterButton;
