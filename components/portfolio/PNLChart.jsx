"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const RealizedPnLChart = ({ data }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef?.current || data?.length === 0) {
      data = [
        {
          value: 0,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#12121a" },
        textColor: "#d1d4dc",
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        visible: false,
      },
      crosshair: {
        mode: 0,
        vertLine: {
          visible: true,
          labelVisible: false,
        },
        horzLine: {
          visible: true,
          labelVisible: true,
        },
      },
    });

    const formattedData = data?.map((item, index) => ({
      time: Math.floor(
        (new Date(item?.createdAt).getTime() + index * 60_000) / 1000
      ),
      value: parseFloat(item.value.toFixed(5)),
    }));

    // Create segments based on up/down movement
    const segments = [];
    let currentSegment = [];
    let isCurrentSegmentUp = null;

    for (let i = 0; i < formattedData.length; i++) {
      const point = formattedData[i];

      if (i === 0) {
        currentSegment.push(point);
        continue;
      }

      const isUp = point.value >= formattedData[i - 1].value;

      if (isCurrentSegmentUp === null) {
        isCurrentSegmentUp = isUp;
      }

      if (isUp === isCurrentSegmentUp) {
        currentSegment.push(point);
      } else {
        // Finish current segment and start new one
        if (currentSegment.length > 0) {
          segments.push({
            data: [...currentSegment],
            isUp: isCurrentSegmentUp
          });
        }

        // Start new segment with the transition point
        currentSegment = [currentSegment[currentSegment.length - 1], point];
        isCurrentSegmentUp = isUp;
      }
    }

    // Add the last segment
    if (currentSegment.length > 0) {
      segments.push({
        data: currentSegment,
        isUp: isCurrentSegmentUp
      });
    }

    // Create an invisible area series for the tooltip functionality
    const invisibleAreaSeries = chart.addAreaSeries({
      topColor: "rgba(0, 0, 0, 0)",
      bottomColor: "rgba(0, 0, 0, 0)",
      lineColor: "rgba(0, 0, 0, 0)",
      lineWidth: 0,
      priceLineVisible: false,
    });

    invisibleAreaSeries.setData(formattedData);

    // Store reference to the first area series for tooltip positioning
    let firstAreaSeries = null;
    segments.forEach((segment, index) => {
      const areaSeries = chart.addAreaSeries({
        ...(segment.isUp
          ? {
            topColor: "rgba(16, 185, 129, 0.3)",
            bottomColor: "rgba(16, 185, 129, 0)",
            lineColor: "#10b981",
          }
          : {
            topColor: "rgba(239, 68, 68, 0.3)",
            bottomColor: "rgba(239, 68, 68, 0)",
            lineColor: "#ef4444",
          }),
        lineWidth: 2,
        lineType: 0,
        priceLineVisible: false,
      });

      areaSeries.setData(segment.data);

      if (index === 0) {
        firstAreaSeries = areaSeries;
      }
    });
    chart.timeScale().fitContent();

    // Tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "custom-tooltip";
    tooltip.style = `
      position: absolute;
      display: none;
      padding: 4px 8px;
      border-radius: 4px;
      background: #1e1e2f;
      color: #fff;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
    `;
    chartContainerRef.current.appendChild(tooltip);

    // Subscribe to hover
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        tooltip.style.display = "none";
        return;
      }

      const value = param.seriesData.get(invisibleAreaSeries)?.value;
      if (value === undefined) {
        tooltip.style.display = "none";
        return;
      }

      const coordinate = firstAreaSeries ? firstAreaSeries.priceToCoordinate(value) : invisibleAreaSeries.priceToCoordinate(value);
      const timestamp =
        typeof param.time === "object"
          ? param.time.timestamp
          : param.time * 1000;
      const dateObj = new Date(timestamp);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      tooltip.style.display = "block";
      tooltip.style.left = `${param.point.x + 10}px`;
      tooltip.style.top = `${coordinate}px`;
      tooltip.innerHTML = `
        <div><strong>$${value.toFixed(5)}</strong></div>
        <div style="font-size: 11px; color: #aaa;">${formattedDate}</div>`;
    });

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      chart.timeScale().fitContent();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "300px", position: "relative" }}
    />
  );
};

export default RealizedPnLChart;
