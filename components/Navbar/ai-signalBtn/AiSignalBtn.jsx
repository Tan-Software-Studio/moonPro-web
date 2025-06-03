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
        <>
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
        </>
    );
};

export default AISignalsButton;

//  <button class="button sm:px-6 px-3 py-2  ">
//                             <div class="dots_border"></div>
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 class="sparkle"
//                             >
//                                 <path
//                                     class="path"
//                                     stroke-linejoin="round"
//                                     stroke-linecap="round"
//                                     stroke="black"
//                                     fill="black"
//                                     d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
//                                 ></path>
//                                 <path
//                                     class="path"
//                                     stroke-linejoin="round"
//                                     stroke-linecap="round"
//                                     stroke="black"
//                                     fill="black"
//                                     d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
//                                 ></path>
//                                 <path
//                                     class="path"
//                                     stroke-linejoin="round"
//                                     stroke-linecap="round"
//                                     stroke="black"
//                                     fill="black"
//                                     d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
//                                 ></path>
//                             </svg>
//                             <span class="text_button">Ai Signals</span>
//                         </button>