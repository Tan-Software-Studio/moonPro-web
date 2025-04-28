import React from "react";

const TimeIntervalsFilterTabs = ({ intervals, selectedInterval, onChange }) => {
  return (
    <div className="py-1">
      <div className="flex bg-[#333333] rounded-md p-0.5 items-center gap-2 onest font-normal text-xs leading-4">
        {intervals.map(({ label, value, data }) => (
          <button
            key={value}
            className={`${data?.length === 0 ? "opacity-50 pointer-events-none" : ""}
                        ${selectedInterval !== value ? "text-[#6E6E6E]" : "bg-[#1F73FC] text-white"}
                        rounded-[4px] px-2 py-1`}
            onClick={() => onChange(value)}
            disabled={data?.length === 0}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeIntervalsFilterTabs;