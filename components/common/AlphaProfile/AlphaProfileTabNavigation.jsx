"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import DownToUp from "../../../public/assets/Trading/DownToUp.svg";

// This component can be directly used in your Table component
const AlphaProfileTabNavigation = ({
  tabList,
  activeTab,
  setActiveTab,
}) => {
  const tabsRef = useRef([]);
  const scrollContainerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  // Function to handle tab click with centering behavior
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    // Call the appropriate API function based on which tab was clicked
    if (tabName == "Top Holders" && typeof topHoldersApiCall == "function") {
      topHoldersApiCall();
    } else if (
      tabName == "Top Traders" &&
      typeof toptradersApiCall == "function"
    ) {
      toptradersApiCall();
    } else if (tabName == "My Holdings" && typeof myHoldingData == "function") {
      myHoldingData();
    }

    // Small delay to ensure state updates
    setTimeout(() => {
      centerActiveTab(tabName);
    }, 10);
  };

  // Function to center the active tab
  const centerActiveTab = (tabName) => {
    const activeIndex = tabList.findIndex((tab) => tab.name === tabName);
    if (
      activeIndex !== -1 &&
      tabsRef.current[activeIndex] &&
      scrollContainerRef.current
    ) {
      const tabElement = tabsRef.current[activeIndex];
      const scrollContainer = scrollContainerRef.current;

      // Calculate center position
      const containerWidth = scrollContainer.offsetWidth;
      const tabWidth = tabElement.offsetWidth;
      const tabLeft = tabElement.offsetLeft;

      // Center the tab in the container
      const scrollPosition = tabLeft - containerWidth / 2 + tabWidth / 2;

      // Smooth scroll to center
      scrollContainer.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  };

  // scroll to  top
  function scrollToTop() {
    tvChartRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Update indicator position when tab changes or when component mounts
  useEffect(() => {
    const activeIndex = tabList.findIndex((tab) => tab.name === activeTab);
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      const tabElement = tabsRef.current[activeIndex];
      setIndicatorStyle({
        left: tabElement.offsetLeft,
        width: tabElement.offsetWidth,
      });

      // Center the active tab on initial load or tab change
      centerActiveTab(activeTab);
    }
  }, [activeTab, tabList]);

  return (
    <div className="relative w-full z-10 top-0 bg-[#1F1F1F] text-[#A8A8A8] text-xs font-normal border border-[#08080E] px-6 leading-[18px] text-center flex justify-between items-center">
      {/* Tabs with Scrollable Feature */}
      <div
        ref={scrollContainerRef}
        className="relative flex flex-nowrap w-full overflow-x-auto scrollbar-hide"
      >
        {tabList.map((tab, index) => (
          <div
            key={tab.name}
            ref={(el) => (tabsRef.current[index] = el)}
            onClick={() => handleTabClick(tab.name)}
            className={`cursor-pointer font-bold min-w-[80px] onest ${
              activeTab === tab.name && "text-[#278BFE] font-bold text-sm leading-[18px]"
            }`}
          >
            <h6 className="py-2.5 px-4">{tab.name}</h6>
          </div>
        ))}

        {/* Animated Bottom Border */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-[#278BFE] rounded-full"
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
};

export default AlphaProfileTabNavigation;
