"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useWeb3Modal } from "@web3modal/solana/react";
import { SolanaWallet } from "@/SolanaContext/context";
// import { useWeb3Modal } from "@web3modal/wagmi/react";

const ConnectWallet = ({ setConnectWallet, connectWallet }) => {
    const { open, close } = useWeb3Modal();
    const modalRef = useRef(null);
    const [chainData, setChainData] = useState();
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setConnectWallet(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [connectWallet]);
    const borderColor = useSelector(
        (state) => state?.AllthemeColorData?.borderColor
    );

    const handleData = (name) => {
        setChainData(name);
        open()
    };
    return (
        <div>
            {connectWallet && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999999999999999999999999999999] w-full">
                    <div className="fixed inset-0 flex items-center justify-center ">
                        <div
                            className={`bg-transparent rounded-[20px] pb-10 text-white relative w-[20%] border-[2px] ${borderColor} `}
                            ref={modalRef}
                        >
                            <button
                                className="text-3xl top-0.5 right-3 absolute"
                                onClick={() => setConnectWallet(false)}
                            >
                                &times;
                            </button>
                            <div className="text-center p-7">Choose Your Wallet</div>
                            <hr className={`${borderColor}`} />
                            <div className="flex justify-center gap-10 mt-7">
                                <div
                                    className={` w-[25%] border-[2px] ${borderColor} py-8 text-center rounded-md text-[#6CC4F4] text-xl font-bold cursor-pointer`}
                                    onClick={() => handleData("evm")}
                                >
                                    Evm
                                </div>
                                <div
                                    className={` w-[25%] border-[2px] ${borderColor} py-8 text-center rounded-md text-[#6CC4F4] text-xl font-bold cursor-pointer`}
                                // onClick={() => handleData("solana")}
                                >
                                    Solana:- <SolanaWallet />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectWallet;