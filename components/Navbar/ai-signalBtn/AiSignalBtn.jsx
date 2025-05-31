import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const SvgIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="none"
        viewBox="0 0 15 15"
        {...props}
    >
        <path
            fill="currentColor"
            d="M11.348 8.066 8.125 6.875 6.937 3.649a.995.995 0 0 0-1.867 0L3.875 6.875.648 8.063a.995.995 0 0 0 0 1.867l3.227 1.195 1.187 3.226a.994.994 0 0 0 1.868 0l1.195-3.226 3.226-1.187a.995.995 0 0 0 0-1.868zm-3.786 2.198a.5.5 0 0 0-.296.296L6 13.99l-1.264-3.427a.5.5 0 0 0-.299-.3L1.01 9l3.428-1.264a.5.5 0 0 0 .299-.298L6 4.008l1.263 3.428a.5.5 0 0 0 .297.297L10.99 9zM8 2.5a.5.5 0 0 1 .5-.5h1V1a.5.5 0 0 1 1 0v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0V3h-1a.5.5 0 0 1-.5-.5m6.5 3a.5.5 0 0 1-.5.5h-.5v.5a.5.5 0 0 1-1 0V6H12a.5.5 0 1 1 0-1h.5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 .5.5"
        />
    </svg>
);

const AISignalsButton = () => {
    const isSidebarOpen = useSelector(
        (state) => state?.AllthemeColorData?.isSidebarOpen
    );
    return (
        <Link href='/ai-signal'>
            {isSidebarOpen ?
                <button className="group relative inline-flex items-center sm:gap-3 gap-2 pag-1 sm:px-6 px-3 py-1.5  border-[1.5px] border-blue-500 rounded-md transition-all duration-300 ">

                    {/* Icon with glow */}
                    <SvgIcon className="sm:w-5 sm:h-5 h-4 w-4 text-blue-500 group-hover:text-blue-400 transition-all duration-300 " />

                    {/* Text with glow effect */}
                    <span className=" py-1 px-1.5  border-[1px] border-transparent   ease-in-out text-[14px]  cursor-pointer  sm:text-sm text-base font-medium text-blue-500 group-hover:text-blue-400 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                        AI Signals
                    </span>

                </button>
                :
                <button className='border-[1.5px] border-blue-500 rounded-full transition-all px-2 py-2 duration-300 '>
                    <SvgIcon className="sm:w-5 sm:h-5 h-4 w-4 text-blue-500 group-hover:text-blue-400 transition-all duration-300 " />

                </button>
            }
        </Link>
    );
};

export default AISignalsButton;