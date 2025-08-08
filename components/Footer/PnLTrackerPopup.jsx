import React, { useState, useRef, useEffect } from "react";
import { X, RotateCcw, Settings, History } from "lucide-react";
import { solanasollogo, pnlbg } from "@/app/Images";
import Image from "next/image";
import { useSelector } from "react-redux";

const PnLTrackerPopup = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredControl, setHoveredControl] = useState(null);
  const popupRef = useRef(null);

  const currentTabData = useSelector(
    (state) => state?.setPnlData?.PnlData || []
  );
  const activeSolWalletAddress = useSelector(
    (state) => state?.userData?.activeSolanaWallet
  );

  // unrealized pnl calculation
  const UnrealizedPNL = currentTabData.reduce((acc, item) => {
    const pnl =
      (item?.activeQtyHeld - item?.quantitySold) *
      (item.current_price - item.averageBuyPrice);
    return acc + pnl;
  }, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPosition = JSON.parse(
        localStorage.getItem("pnlTrackerPosition") || "null"
      );
      if (savedPosition) {
        setPosition(savedPosition);
      } else {
        const randomX = Math.random() * (window.innerWidth - 450);
        const randomY = Math.random() * (window.innerHeight - 250);
        setPosition({ x: randomX, y: randomY });
      }
    }
  }, []);

  // save position to memory whenever position changes
  const [savedPosition, setSavedPosition] = useState(position);
  useEffect(() => {
    setSavedPosition(position);
    if (typeof window !== "undefined") {
      localStorage.setItem("pnlTrackerPosition", JSON.stringify(position));
    }
  }, [position]);

  const handleMouseDown = (e) => {
    if (e.target.closest(".no-drag")) return;

    setIsDragging(true);
    const rect = popupRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    const maxX = window.innerWidth - 450;
    const maxY = window.innerHeight - 250;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={`fixed z-50 bg-[#1a1a1a] shadow-[0_0_16px_rgba(30,30,30,0.8)]  rounded-lg  border-[1px] border-[#404040] select-none transition-opacity duration-200 ${
        isDragging ? "opacity-70" : "opacity-100"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "392px",
        height: "94px",
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredControl(null);
      }}
    >
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <Image
          src={pnlbg}
          alt="PnL Background"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>

      <div
        className={`absolute top-2 left-2 flex items-center gap-1 z-20 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative">
          <button
            className="no-drag text-gray-400 hover:text-white transition-colors p-1 rounded cursor-pointer"
            onMouseEnter={() => setHoveredControl("settings")}
            onMouseLeave={() => setHoveredControl(null)}
          >
            <Settings size={14} />
          </button>
          {hoveredControl === "settings" && (
            <div className="absolute -top-8 left-0 bg-[#101114] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
              Settings
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="no-drag text-gray-400 hover:text-white transition-colors p-1 rounded cursor-pointer"
            onMouseEnter={() => setHoveredControl("history")}
            onMouseLeave={() => setHoveredControl(null)}
          >
            <History size={14} />
          </button>
          {hoveredControl === "history" && (
            <div className="absolute -top-8 left-0 bg-[#101114] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
              View History
            </div>
          )}
        </div>
      </div>

      <div
        className={`absolute top-2 right-2 flex items-center gap-1 z-20 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative">
          <button
            className="no-drag text-gray-400 hover:text-white transition-colors p-1 rounded cursor-pointer"
            onMouseEnter={() => setHoveredControl("reset")}
            onMouseLeave={() => setHoveredControl(null)}
          >
            <RotateCcw size={14} />
          </button>
          {hoveredControl === "reset" && (
            <div className="absolute -top-8 right-0 bg-[#101114] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-30">
              Click twice to reset PNL
            </div>
          )}
          <button
            className="no-drag text-gray-400 hover:text-white transition-colors p-1 rounded cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 h-full flex items-center justify-center relative z-10">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <div className="text-sm text-[#A8A8A8]">Balance</div>
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={solanasollogo}
                width={18}
                height={18}
                alt="solanasollogo"
                unoptimized
              />
              <div className="text-white text-2xl font-bold">
                ${Number(activeSolWalletAddress?.balance || 0).toFixed(5) || 0}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm text-[#A8A8A8]">PNL</div>
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={solanasollogo}
                width={18}
                height={18}
                alt="solanasollogo"
                unoptimized
              />
              <div
                className={`text-2xl font-bold ${
                  UnrealizedPNL >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {UnrealizedPNL >= 0 ? "+" : ""}
                {UnrealizedPNL >= 0 ? "$" : "-$"}
                {Math.abs(UnrealizedPNL).toFixed(5)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PnLTrackerPopup;
