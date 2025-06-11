"use client"

import { nexaLogo, nexaText, sharePnlBg } from "@/app/Images"
import { SiSolana } from "react-icons/si";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { RiArrowUpDownFill, RiDownloadLine, RiFileCopyLine } from "react-icons/ri";

import Image from "next/image";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { formatNumber } from "@/utils/basicFunctions";

const SharePnLModal = ({
  isOpen,
  onClose,
  tokenSymbol,
  currentTokenPnLData,
  solanaLivePrice
}) => {
  if (!isOpen) return null;

  const modalRef = useRef(null);
  const [solIsActive, setSolIsActive] = useState(true);

  const handleClickSwapCurrency = () => {
    setSolIsActive(prev => !prev);
  };

  const handleDownload = async () => {
  if (!modalRef.current) return;
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); // ensure layout is settled
    const dataUrl = await toPng(modalRef.current, { cacheBust: true, pixelRatio: 0.75 });
    const link = document.createElement("a");
    link.download = `${tokenSymbol || 'pnl'}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Failed to download image", error);
  }
};

const handleCopy = async () => {
  if (!modalRef.current) return;
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); // delay to flush layout
    const dataUrl = await toPng(modalRef.current, { cacheBust: true, pixelRatio: 0.75 });
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    alert("Image copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy image", error);
  }
};
  const pnlAmount = solIsActive ? currentTokenPnLData?.absolutePnL / solanaLivePrice : currentTokenPnLData?.absolutePnL;
  const invested = solIsActive ? currentTokenPnLData?.buyAmount / solanaLivePrice : currentTokenPnLData?.buyAmount;
  const position = solIsActive ? currentTokenPnLData?.holdingsUsdInCurrentPrice / solanaLivePrice : currentTokenPnLData?.holdingsUsdInCurrentPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50" onClick={onClose}>
      <div
        ref={modalRef}
        className="relative overflow-hidden bg-gray-900 font-spaceGrotesk pt-[68px] w-full max-w-[800px] h-[640px] rounded-lg text-center"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={sharePnlBg}
          alt="Share PNL Background"
          fill
          className="object-cover rounded-lg border border-[#323542]"
        />
        <div className="text-white flex flex-col items-center relative">
          <div className="flex gap-[15px] justify-center mb-10">
            <img
              src={nexaLogo.src}
              alt="Nexa Logo"
              width={48}
              height={48}
              className="flex flex-shrink-0"
            />
            <img
              src={nexaText.src}
              alt="Nexa Text"
              width={72.13}
              height={19.67}
              className="flex py-[14.2px]"
            />
          </div>
          <p className="font-bold uppercase text-[41.67px]">{tokenSymbol || "TOKEN NAME"}</p>
          <div className="bg-[#1F73FC] w-[125.67px] h-[45px] my-4 gap-2 flex justify-center items-center py-3 px-4 rounded-[4px]">
            {solIsActive && <SiSolana width={20} height={16} />}
            <p className="font-medium text-xl">{currentTokenPnLData?.isPositivePnL ? "+" : "-"}{formatNumber(pnlAmount, false, !solIsActive)}</p>
          </div>
          <div className="bg-white w-[32px] h-[3px]" />
          <div className="w-[314px] mt-10 flex gap-[10px] flex-col justify-center font-normal text-2xl">
            <div className="w-full flex justify-between">
              <p>PnL</p>
              <div className={`${currentTokenPnLData?.isPositivePnL ? "text-[#21CB6B]" : "text-[#ed1b26]"} flex gap-1 items-center font-bold`}>
                {currentTokenPnLData?.isPositivePnL ? <BiSolidUpArrow size={12} /> : <BiSolidDownArrow size={12} />}
                <p>{currentTokenPnLData?.safePnLPercent?.toFixed(2)}%</p>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <p>Invested</p>
              <div className="flex items-center gap-[9px]">
                {solIsActive && <SiSolana width={22} height={17} />}
                <p className="font-medium">{formatNumber(invested, false, !solIsActive)}</p>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <p>Position</p>
              <div className="flex items-center gap-[9px]">
                {solIsActive && <SiSolana width={22} height={17} />}
                <p className="font-medium">{formatNumber(position, false, !solIsActive)}</p>
              </div>
            </div>
            <p className="mt-[30px] font-medium text-[26px]">Crushing every trade 🚀</p>
            <div className="w-full bg-[#1F73FC] mt-[2px] font-normal text-base flex items-center justify-center rounded-md py-2 gap-3">
              <div className="border-[3px] rounded-full w-3 h-3" />
              <p>with AI Signal Powered by Nexa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-x-4 w-full max-w-[800px] flex justify-between">
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleClickSwapCurrency();
          }}
          className="bg-[#6b728050] flex gap-1 items-center text-white px-4 py-2 rounded hover:bg-[#6b728075]"
        >
          <RiArrowUpDownFill />
          <p>{solIsActive ? "SOL" : "USD"}</p>
        </button>
        <div className="flex gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleDownload();
            }}
            className="bg-[#6b728050] flex gap-1 items-center text-white px-4 py-2 rounded hover:bg-[#6b728075]"
          >
            <RiDownloadLine />
            <p>Download</p>
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleCopy();
            }}
            className="bg-[#6b728050] flex gap-1 items-center text-white px-4 py-2 rounded hover:bg-[#6b728075]"
          >
            <RiFileCopyLine />
            <p>Copy</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePnLModal;
