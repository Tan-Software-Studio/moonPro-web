import TVChartContainer from '@/components/TradingChart/TradingChart';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BsThreeDots } from 'react-icons/bs';

const ResizableChartContainer = ({
    isSmallScreen,
    bottomOffset = 173,
    minHeight = 200,
    maxHeightFallback = 1000,
    tokenSymbol,
    tokenaddress,
    currentTokenPnLData,
    solanaLivePrice,
    supply,
}) => {
  const [chartHeight, setChartHeight] = useState(isSmallScreen ? 380 : 600);
  const [isResizing, setIsResizing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const isResizingRef = useRef(false);
  const startY = useRef(0);
  const initialHeight = useRef(0);
  const lastHeightRef = useRef(chartHeight);

  const getMaxHeight = useCallback(() => window.innerHeight - bottomOffset, [bottomOffset]);

  const updateHeightFromPercent = useCallback(() => {
    const savedPercent = localStorage.getItem('ChartHeightPercent');
    const percent = savedPercent !== null && !isNaN(Number(savedPercent)) ? Number(savedPercent) : 50;
    const maxHeight = getMaxHeight();
    const clampedHeight = Math.min(
      minHeight + ((maxHeight - minHeight) * percent) / 100,
      maxHeight
    );
    setChartHeight(clampedHeight);
    lastHeightRef.current = clampedHeight;
  }, [getMaxHeight, minHeight]);

  useEffect(() => {
    if (isSmallScreen) {
      setChartHeight(380);
    } else {
      updateHeightFromPercent();
    }
  }, [isSmallScreen, updateHeightFromPercent]);

  useEffect(() => {
    if (isSmallScreen) return;

    // Debounce function to limit resize event frequency
    let timeoutId;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateHeightFromPercent();
      }, 100); // Adjust delay as needed (100ms is a good starting point)
    };

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [isSmallScreen, updateHeightFromPercent]);

  const startResizing = useCallback((e) => {
    if (isSmallScreen) return;
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
    startY.current = e.clientY;
    initialHeight.current = chartHeight;
    setShowOverlay(true);
    document.body.style.userSelect = 'none';
    document.body.style.overflow = 'hidden';

    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
  }, [isSmallScreen, chartHeight]);

  const resize = useCallback((e) => {
    if (!isResizingRef.current) return;

    const deltaY = e.clientY - startY.current;
    const newHeight = initialHeight.current + deltaY;
    const maxHeight = getMaxHeight();
    const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

    setChartHeight(clampedHeight);
    lastHeightRef.current = clampedHeight;
  }, [getMaxHeight, minHeight]);

  const stopResizing = useCallback(() => {
    isResizingRef.current = false;
    setIsResizing(false);
    setShowOverlay(false);

    const maxHeight = getMaxHeight();
    const percent = ((lastHeightRef.current - minHeight) / (maxHeight - minHeight)) * 100;
    localStorage.setItem('ChartHeightPercent', percent.toString());

    document.body.style.userSelect = '';
    document.body.style.overflow = '';

    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResizing);
  }, [getMaxHeight, minHeight, resize]);

  return (
    <div className="relative w-full">
      <div className="w-full relative" style={{ height: `${chartHeight}px` }}>
        <TVChartContainer
            tokenSymbol={tokenSymbol}
            tokenaddress={tokenaddress}
            currentTokenPnLData={currentTokenPnLData}
            solanaLivePrice={solanaLivePrice}
            supply={supply}
        />
        {showOverlay && (
          <div
            className="absolute inset-0 z-50"
            style={{ backgroundColor: 'transparent' }}
          />
        )}
      </div>

      {!isSmallScreen && (
        <div
          className={`w-full h-1 flex bg-[#404040] items-center text-[14px] text-[#8f92a4] justify-center cursor-ns-resize transition-colors duration-300 ease ${
            !isResizing ? 'hover:bg-[#646363]' : ''
          }`}
          onMouseDown={startResizing}
        >
          <BsThreeDots />
        </div>
      )}
    </div>
  );
};

export default ResizableChartContainer;