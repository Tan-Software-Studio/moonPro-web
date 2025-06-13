"use client";

import { nexaLogo, nexaText, sharePnlBg } from "@/app/Images";
import { SiSolana } from "react-icons/si";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { RiArrowUpDownFill, RiDownloadLine, RiFileCopyLine } from "react-icons/ri";
import { IoMdDoneAll } from "react-icons/io";

import Image from "next/image";
import { useRef, useState, useEffect, useMemo } from "react";
import { toPng } from "html-to-image";
import { formatNumber } from "@/utils/basicFunctions";

const SharePnLModal = ({
  isOpen,
  onClose,
  tokenSymbol,
  currentTokenPnLData,
  solanaLivePrice
}) => {
  const modalRef = useRef(null);
  const [solIsActive, setSolIsActive] = useState(true);
  const [renderedImage, setRenderedImage] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleClickSwapCurrency = () => {
    setSolIsActive(prev => !prev);
  };

  const handleDownload = async () => {
    if (!renderedImage) return;
    try {
      const link = document.createElement("a");
      link.download = `${tokenSymbol || 'pnl'}.png`;
      link.href = renderedImage;
      link.click();
    } catch (error) {
      console.error("Failed to download image", error);
    }
  };

  const previousPnLRef = useRef({
    pnlAmount: 0,
    isPositivePnL: false,
    pnlPercent: 0,
    invested: 0,
    position: 0
  });

  const {
    pnlAmount,
    isPositivePnL,
    pnlPercent,
    invested,
    position
  } = useMemo(() => {
    if (!currentTokenPnLData || Object.keys(currentTokenPnLData).length === 0) {
      previousPnLRef.current.position = 0;
      return previousPnLRef.current;
    }

    const absolutePnL = currentTokenPnLData?.absolutePnL ?? currentTokenPnLData?.pastPnlPrice ?? 0;
    const isPositive = currentTokenPnLData?.isPositivePnL != null
      ? currentTokenPnLData.isPositivePnL
      : (currentTokenPnLData?.pastPnlPrice ?? 0) >= 0;

    let pnlAmt = Math.abs(absolutePnL);
    pnlAmt = solIsActive ? pnlAmt / solanaLivePrice : pnlAmt;

    let investAmt = currentTokenPnLData?.buyAmount ?? currentTokenPnLData?.pastAverageBuy ?? 0;
    investAmt = solIsActive ? investAmt / solanaLivePrice : investAmt;

    const pnlPerc = currentTokenPnLData?.safePnLPercent ?? currentTokenPnLData?.pastPnlPercentage ?? 0;

    const pos = solIsActive
      ? (currentTokenPnLData?.holdingsUsdInCurrentPrice ?? 0) / solanaLivePrice
      : currentTokenPnLData?.holdingsUsdInCurrentPrice ?? 0;

    const newPnL = {
      pnlAmount: pnlAmt,
      isPositivePnL: isPositive,
      pnlPercent: pnlPerc,
      invested: investAmt,
      position: pos
    };

    // Save for future fallback
    previousPnLRef.current = newPnL;

    return newPnL;
  }, [currentTokenPnLData, solIsActive, solanaLivePrice]);


  const handleCopy = async () => {
    if (!renderedImage) return;
    try {
      const blob = await (await fetch(renderedImage)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
    } catch (error) {
      console.error("Failed to copy image", error);
    }
    setCopied(true);
    // toast.success("address copied successfully");
    setTimeout(() => {
      setCopied(false);
    }, 3000); // Reset after 3 seconds
  };

  const generateImage = async () => {
    if (!modalRef.current) return;
    try {
      const dataUrl = await toPng(modalRef.current, { cacheBust: true, pixelRatio: 1 });
      setRenderedImage(dataUrl);
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  // Trigger when solIsActive or currentTokenPnLData changes
  useEffect(() => {
    generateImage();
  }, [solIsActive, currentTokenPnLData]);

  // Trigger when solanaLivePrice changes AND solIsActive is true
  useEffect(() => {
    if (!solIsActive) return;
    generateImage();
  }, [solanaLivePrice]);

  return (
    <>
      {/* Offscreen content for image generation */}
      <div className="absolute -left-[9999px] top-0 w-[800px] h-[640px]">
        <div
          ref={modalRef}
          className="relative overflow-hidden w-full h-full bg-gray-900 font-spaceGrotesk pt-[68px] rounded-lg text-center"
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
              <p className="font-medium text-xl">
                {isPositivePnL != null ? isPositivePnL === true ? "+" : "-" : ""}
                {formatNumber(pnlAmount, false, !solIsActive) || 0}
              </p>
            </div>
            <div className="bg-white w-[32px] h-[3px]" />
            <div className="w-[314px] mt-10 flex gap-[10px] flex-col justify-center font-normal text-2xl">
              <div className="w-full flex justify-between">
                <p>PnL</p>
                <div className={`${isPositivePnL ? "text-[#21CB6B]" : "text-[#ed1b26]"} flex gap-1 items-center font-bold`}>
                  {isPositivePnL ? <BiSolidUpArrow size={12} /> : <BiSolidDownArrow size={12} />}
                  <p>{pnlPercent.toFixed(2) || 0}%</p>
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
                  <p className="font-medium">{formatNumber(position, true, !solIsActive)}</p>
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
      </div>

      {/* Modal UI */}
      {isOpen && renderedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 p-20 flex flex-col justify-center items-center z-50" onClick={onClose}>
          <div
            className="w-full max-w-[800px] aspect-[800/640] rounded-lg flex justify-center items-center overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={renderedImage}
              alt="PNL Snapshot"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 space-x-4 text-sm w-full max-w-[800px] flex justify-between">
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleClickSwapCurrency();
              }}
              className="bg-[#6b728030] flex gap-1 items-center text-white px-2 py-2 rounded hover:bg-[#6b728075]"
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
                className="bg-[#6b728030] flex gap-1 items-center text-white px-4 py-2 rounded hover:bg-[#6b728075]"
              >
                <RiDownloadLine />
                <p>Download</p>
              </button>
              <button
                disabled={copied}
                onClick={(event) => {
                  event.stopPropagation();
                  handleCopy();
                }}
                className={`bg-[#6b728030] flex gap-1 items-center text-white px-4 py-2 rounded  ${!copied && "hover:bg-[#6b728075]"}`}
              >
                {copied ? 
                  <IoMdDoneAll />
                :
                   <RiFileCopyLine />
                }
                <p>Copy</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SharePnLModal;
