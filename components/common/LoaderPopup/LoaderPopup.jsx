"use client";
import React, { useEffect, useRef } from "react";
import { setBigLoader } from "@/app/redux/states";
import { TailSpin } from "react-loader-spinner";

const LoaderPopup = () => {
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                dispatch(setBigLoader(false));
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div
                className={`h-svh bg-[#00000056] w-full fixed top-0 left-0 right0 z-[999] duration-75 transition-all ease-in-out block cursor-pointer`}
            ></div>
            <div className="fixed inset-0 flex items-center justify-center z-[999999] h-[100dvh] w-full">
                <div className="overflow-auto visibleScroll " ref={popupRef}>
                    <div className="relative z-[999999] w-full">
                        <div className="mx-2 md:mx-5" >
                            <div className="w-full h-[20%] bg-[#22222c] overflow-hidden p-3 md:py-10 md:px-32 rounded-md flex flex-col items-center justify-center gap-10">
                                <TailSpin
                                    visible={true}
                                    height="100"
                                    width="100"
                                    color="#77c1e9"
                                    ariaLabel="tail-spin-loading"
                                    strokeWidth={5}
                                />
                                <p className="text-xl">Please wait...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoaderPopup;