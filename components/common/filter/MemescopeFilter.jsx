"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { moon, pump } from "@/app/Images";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

function MemescopeFilter({ isOpen, setIsOpen }) {
  const [isPump, setIspump] = useState(true);

  const [isMoonshot, setIsMoonshot] = useState(false);

  const [isTop10Holders, setIsTop10Holders] = useState(false);

  const [isWithAtLeast1Social, setIsWithAtLeast1Social] = useState(false);

  const [symbolName, setSymbolName] = useState("");

  {
    /* 1 */
  }
  const [PumpProgress, setPumpProgress] = useState({
    from: "",
    to: "",
  });

  {
    /* 2 */
  }
  const [holdersCount, setHoldersCount] = useState({
    from: "",
    to: "",
  });

  {
    /* 3 */
  }
  const [devholding, setDevholding] = useState({
    from: "",
    to: "",
  });

  {
    /* 4 */
  }
  const [bySnipers, setBySnipers] = useState({
    from: "",
    to: "",
  });

  {
    /* 5 */
  }
  const [byAge, setByAge] = useState({
    from: "",
    to: "",
  });

  {
    /* 6 */
  }
  const [byCurrentLiquidity, setByCurrentLiquidity] = useState({
    from: "",
    to: "",
  });

  {
    /* 7 */
  }
  const [byVolume, setByVolume] = useState({
    from: "",
    to: "",
  });

  {
    /* 8 */
  }
  const [byMKTCap, setByMKTCap] = useState({
    from: "",
    to: "",
  });

  {
    /* 9 */
  }
  const [byTXNS, setByTXNS] = useState({
    from: "",
    to: "",
  });

  {
    /* 10 */
  }
  const [byBuys, setByBuys] = useState({
    from: "",
    to: "",
  });

  {
    /* 11 */
  }
  const [bySells, setBySells] = useState({
    from: "",
    to: "",
  });

  //  handle onChange
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const [stateKey, field] = name.split(".");

    if (stateKey && field) {
      if (stateKey === "PumpProgress") {
        setPumpProgress((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "holdersCount") {
        setHoldersCount((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "devholding") {
        setDevholding((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "bySnipers") {
        setBySnipers((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "byAge") {
        setByAge((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "byCurrentLiquidity") {
        setByCurrentLiquidity((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "byVolume") {
        setByVolume((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "byMKTCap") {
        setByMKTCap((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "byTXNS") {
        setByTXNS((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "byBuys") {
        setByBuys((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      } else if (stateKey === "bySells") {
        setBySells((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      }
    }
  };

  //  Submit form
  const handleSubmit = () => {


    // After form submission, all fields and state values are reset
    setIspump(false);
    setIsMoonshot(false);
    setIsTop10Holders(false);
    setIsWithAtLeast1Social(false);
    setSymbolName("");

    setPumpProgress({ from: "", to: "" });
    setHoldersCount({ from: "", to: "" });
    setDevholding({ from: "", to: "" });
    setBySnipers({ from: "", to: "" });
    setByAge({ from: "", to: "" });
    setByCurrentLiquidity({ from: "", to: "" });
    setByVolume({ from: "", to: "" });
    setByMKTCap({ from: "", to: "" });
    setByTXNS({ from: "", to: "" });
    setByBuys({ from: "", to: "" });
    setBySells({ from: "", to: "" });
  };

  // Reset form
  const handleReset = () => {
    setIspump(false);
    setIsMoonshot(false);
    setIsTop10Holders(false);
    setIsWithAtLeast1Social(false);
    setSymbolName("");

    setPumpProgress({ from: "", to: "" });
    setHoldersCount({ from: "", to: "" });
    setDevholding({ from: "", to: "" });
    setBySnipers({ from: "", to: "" });
    setByAge({ from: "", to: "" });
    setByCurrentLiquidity({ from: "", to: "" });
    setByVolume({ from: "", to: "" });
    setByMKTCap({ from: "", to: "" });
    setByTXNS({ from: "", to: "" });
    setByBuys({ from: "", to: "" });
    setBySells({ from: "", to: "" });

  };

  const borderColor = useSelector(
    (state) => state?.AllthemeColorData?.borderColor
  );

  const chcekBoxStyle =
    "appearance-none w-4 h-4 border border-gray-400 rounded-sm bg-transparent flex items-center justify-center checked:bg-[#3e9fd6] checked:border-[#3e9fd6] checked:after:content-['✔'] checked:after:text-xs";

  const inputStyle = `bg-transparent appearance-none border rounded-2xl px-3 py-1 outline-none  ${borderColor}`;

  return (
    <div
      className={`absolute  left-0   mt-2 border ${borderColor} rounded-md z-[9999999] bg-[#16171c] w-full xl:h-[79vh] md:h-[72vh] h-[69vh] visibleScroll overflow-y-auto`}
    >
      <div className="">
        <div className={`border-b-[1px] ${borderColor}  `}>
          <div className="text-end pr-1  z-[1000] py-2 flex justify-end  ">
            <div className="flex justify-end items-center sm:fixed ">
              <IoMdClose
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-end cursor-pointer"
                size={20}
              />
            </div>
          </div>
          <ul className="space-y-4  p-6  ">
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                name=""
                id="checkbox"
                className={chcekBoxStyle}
                onClick={() => setIspump(!isPump)}
                checked={isPump}
              />
              <span>
                <Image src={pump} alt="pump" className="w-4 h-4 rounded-full" />
              </span>
              <label htmlFor="" className="text-sm">
                Pump
              </label>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id=""
                className={chcekBoxStyle}
                checked={isMoonshot}
                onClick={() => setIsMoonshot(!isMoonshot)}
              />
              <span>
                <Image src={moon} alt="moon" className="w-4 h-4 rounded-full" />
              </span>
              <label htmlFor="" className="text-sm">
                Moonshot
              </label>
            </li>
          </ul>
        </div>

        {/* Symbol/Name */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`Symbol/Name`}
            </label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="text"
                name=""
                id=""
                className={`${inputStyle} w-full`}
                onChange={(e) => setSymbolName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={`border-b-[1px] ${borderColor}`}>
          <ul className="space-y-4  p-6  mt-3">
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                name=""
                id="checkbox"
                className={chcekBoxStyle}
                checked={isTop10Holders}
                onClick={() => setIsTop10Holders(!isTop10Holders)}
              />
              <label htmlFor="" className="text-sm">
                Top 10 Holders
              </label>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="checkbox"
                name=""
                id=""
                className={chcekBoxStyle}
                checked={isWithAtLeast1Social}
                onClick={() => setIsWithAtLeast1Social(!isWithAtLeast1Social)}
              />
              <label htmlFor="" className="text-sm">
                With at least 1 social
              </label>
            </li>
          </ul>
        </div>
        {/* 1 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Pump progress %`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="PumpProgress.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={PumpProgress.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="PumpProgress.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={PumpProgress.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 2 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Holders Count`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="holdersCount.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={holdersCount.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="holdersCount.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={holdersCount.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 3 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Dev holding %`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="devholding.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={devholding.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="devholding.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={devholding.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 4 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Snipers`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="bySnipers.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={bySnipers.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="bySnipers.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={bySnipers.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 5 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Age (mins)`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="byAge.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byAge.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="byAge.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byAge.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 6 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Current Liquidity($)`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="byCurrentLiquidity.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byCurrentLiquidity.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="byCurrentLiquidity.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byCurrentLiquidity.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 7 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Volume`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="byVolume.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byVolume.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="byVolume.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byVolume.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 8 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By MKT Cap`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="byMKTCap.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byMKTCap.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="byMKTCap.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byMKTCap.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 9 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By TXNS`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="byTXNS.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byTXNS.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="byTXNS.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byTXNS.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 10 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Buys`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="byBuys.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byBuys.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="byBuys.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={byBuys.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        {/* 11 */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="p-6">
            <label htmlFor="" className="text-sm">
              {`By Sells`}
            </label>
            <div className="flex items-center gap-3 mt-2 ">
              <input
                type="number"
                name="bySells.from"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={bySells.from}
                onChange={handleOnChange}
              />
              to
              <input
                type="number"
                name="bySells.to"
                id=""
                className={`${inputStyle} w-[50%]`}
                value={bySells.to}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>

        {/*  Apply */}
        <div className={`border-b-[1px] ${borderColor}`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                handleReset();
              }}
              className="text-[#6cc4f4]"
            >
              Reset
            </button>
            <button
              onClick={() => {
                handleSubmit();
                setIsOpen(!isOpen);
              }}
              className="bg-[#1F73FC] hover:bg-[#3f8cf1] text-white rounded-2xl px-6 py-1"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemescopeFilter;
