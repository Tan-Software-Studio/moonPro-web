"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import DownToUp from "../../../public/assets/Trading/DownToUp.svg";

// This component can be directly used in your Table component
const TabNavigation = ({
  tabList,
  activeTab,
  setActiveTab,
  topHoldersApiCall,
  toptradersApiCall,
  tvChartRef,
}) => {
  const tabsRef = useRef([]);
  const scrollContainerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isExpanded, setIsExpanded] = useState(true);

  // Function to handle tab click with centering behavior
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    // Call the appropriate API function based on which tab was clicked
    if (tabName == "Holders" && typeof topHoldersApiCall == "function") {
      topHoldersApiCall();
    } else if (
      tabName == "Top Traders" &&
      typeof toptradersApiCall == "function"
    ) {
      toptradersApiCall();
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

  useEffect(() => {
    if (tvChartRef?.current) {
      const el = tvChartRef.current;

      // Only set if not already set
      if (!el.style.height) {
        el.style.height = "600px";
      }
    }
  }, []);

  function swapTvHeight() {
      if (tvChartRef?.current) {
      const el = tvChartRef.current;

      // Set smooth transition
      el.style.transition = "height 0.4s ease";

      // Toggle height based on state
      if (isExpanded) {
        el.style.height = "200px";
      } else {
        el.style.height = "600px";
      }

      // Update state
      setIsExpanded(!isExpanded);
    }
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
    <div className="relative w-full z-10 top-0 bg-[#1f1f1f3a] text-[#A8A8A8] text-xs font-normal border border-[#08080E] sm:px-4 px-1 leading-4 text-center flex justify-between items-center">
      {/* Tabs with Scrollable Feature */}
      <div
        ref={scrollContainerRef}
        className="relative flex flex-nowrap gap-4 md:gap-8 w-full overflow-x-auto scrollbar-hide"
      >
        {tabList.map((tab, index) => (
          <div
            key={tab.name}
            ref={(el) => (tabsRef.current[index] = el)}
            onClick={() => handleTabClick(tab.name)}
            className={`cursor-pointer font-bold min-w-[80px] md:min-w-[100px] lg:min-w-[120px] onest ${
              activeTab === tab.name ? "text-[#278BFE]" : ""
            }`}
          >
            <h6 className="py-3 md:py-4">{tab.name}</h6>
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

      {/* DownToUp Icon */}
      <div
        className="flex items-center justify-center cursor-pointer ml-4 md:ml-6 p-1 md:p-2"
        onClick={() => swapTvHeight()}
      >
        <Image
          src={DownToUp}
          alt="DownToUp"
          width={20}
          height={20}
          className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${
            !isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default TabNavigation;
