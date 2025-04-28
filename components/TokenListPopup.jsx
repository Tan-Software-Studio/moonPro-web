import { setselectToken, setTokenPopup } from "@/app/redux/CommonUiData";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";

const TokenListPopup = ({ token, setselectTokenLogo }) => {
  const popupRef = useRef(null);
  const dispatch = useDispatch();

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        dispatch(setTokenPopup(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[999]"></div> */}
      <div
        className={`h-svh bg-black bg-opacity-50 backdrop-blur-md w-full fixed top-0 left-0 right0 z-[999] duration-75 transition-all ease-in-out
          block
         cursor-pointer`}
      ></div>

      <div clasame="fixed inset-0 flex items-center justify-center z-[999999] ">
        <div
          ref={popupRef}
          className="border border-[#3A3A54] px-10 rounded-md py-10 relative z-[999999]"
        >
          <div className="text-2xl text-center pb-5">Select Chain</div>
          <div className="absolute top-4 right-4">
            <IoClose
              size={25}
              className="cursor-pointer"
              onClick={() => dispatch(setTokenPopup(false))}
            />
          </div>
          <div className="grid grid-cols-3 gap-5">
            {token.map((token, i) => (
              <div
                key={i}
                className="border border-[#3A3A54] p-5 rounded-md cursor-pointer flex gap-2 items-center"
                onClick={() => {
                  dispatch(setselectToken(token?.name));

                  dispatch(setTokenPopup(false));
                  setselectTokenLogo(token?.img);
                }}
              >
                <div>
                  <Image src={token?.img} width={30} height={30} />
                </div>
                <div>{token?.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenListPopup;
