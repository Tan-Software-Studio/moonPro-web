"use client";
import React, { memo } from 'react'
import Chart from "react-apexcharts";
import { useSelector } from 'react-redux';
import useInViewport from './useInViewport';

const ChartComponent = ({ block }) => {
  const [isInViewport, chartRef] = useInViewport({
    rootMargin: "100px", // Load the chart when it's within 100px of the viewport
  });
  if (!isInViewport) {
    return <div ref={chartRef} style={{ width: "60px", height: "60px" }} />;
  }

  const smallCandlestickChartOptions = {
    chart: {
      type: "candlestick",
      height: 70,
      width: 70,
      sparkline: {
        enabled: true, // Use sparkline for a compact chart
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#089981", // Green for upward movement
          downward: "#f23645", // Red for downward movement
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: false, // Hide labels to save space
      },
      axisBorder: {
        show: false, // Hide axis borders
      },
      axisTicks: {
        show: false, // Hide axis ticks
      },
    },
    tooltip: {
      enabled: false, // Hide tooltip for sparkline chart
    },
  };

  return (
    <div ref={chartRef}>
      <Chart
        options={smallCandlestickChartOptions}
        series={[
          {
            data:
              block?.candlesticks?.map((item) => ({
                x: new Date(item?.timestamp * 1000),
                y: [item?.open, item?.high, item?.low, item?.close],
              })) || [],
          },
        ]}
        type="candlestick"
        height={60}
        width={60}
      />
    </div>
  )
}

export default memo(ChartComponent);