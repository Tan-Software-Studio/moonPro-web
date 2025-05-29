'use client';
import { solana } from '@/app/Images';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { showToastLoader } from '../common/toastLoader/ToastLoder';
import toast from 'react-hot-toast';

function RefPopup({ Available, address, onClose, setAddClaimed }) {

    const URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL
    const [loading, setLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [claimAmount, setClaimAmount] = useState(Available);
    const [cooldown, setCooldown] = useState(false);



    const handleAddressChange = (e) => {
        setWalletAddress(e.target.value);
    };
    const handleAmountChange = (e) => {
        setClaimAmount(e.target.value);

    };

    const fetchData = async () => {
        if (cooldown) return;


        setLoading(true);
        showToastLoader("Claiming...", "switch-toast");
        setCooldown(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {


                return toast.error('Please Login')
            }
            const paylodData = {
                address: walletAddress,
                amount: Number(claimAmount),
            }

            const res = await axios.post(`${URL}transactions/claimSolana`, paylodData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const responce = res.data.data;
            //   console.log("🚀 ~ fetchData ~ responce:", responce)
            setAddClaimed(claimAmount)
            toast.success(`Claim SOL ${claimAmount}`, {
                id: "switch-toast",
                duration: 2000,
            });
            onClose()
        } catch (e) {

            toast.error("All fields are required.", {
                id: "switch-toast",
                duration: 2000,
            });
        } finally {
            setLoading(false);

            // Start cooldown timer for 5 seconds
            setTimeout(() => {
                setCooldown(false);
            }, 5000);
        }
    };



    useEffect(() => {
        setWalletAddress(address || '');
    }, [address]);

    return (
        <div className="fixed inset-0 bg-[#00000052] bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#08080e] text-white rounded-md w-[90%]  max-w-lg p-5 relative space-y-4 shadow-xl border border-[#191919]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes size={18} />
                </button>

                <h2 className="text-lg font-semibold">Claim</h2>

                {/* Coin Selector & Balance */}
                <div className=" items-center w-fit bg-[#191919] px-3 py-2 rounded-md">
                    <div className="text-sm w-fit text-[#a0a4b8] tracking-wider"> Balance: {(Number(Available) || 0).toFixed(5)} </div>

                </div>

                {/* Wallet Address */}
                <input
                    value={walletAddress}
                    onChange={handleAddressChange}
                    type="text"
                    placeholder="Address of destination wallet"
                    className="w-full bg-[#191919] p-3 mt-2 rounded-md text-white font-thin tracking-wider placeholder-gray-500 outline-none"
                />

                {/* Claim Amount */}
                <div className="bg-[#191919] p-3 rounded-md space-y-1">
                    <div className="flex justify-between text-sm text-gray-400 tracking-wider">
                        <label>Claim Amount</label>
                        <button
                            className="text-blue-500"
                            type="button"
                            // onClick={() => setClaimAmount(Available?.toString())}
                            onClick={() => setClaimAmount(Number(Available) || 0)}

                        >
                            Max
                        </button>

                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="number"
                            value={claimAmount}
                            onChange={handleAmountChange}
                            placeholder={Available?.toString() || "0.0"}
                            className="bg-transparent w-full text-white placeholder-gray-500 outline-none"
                        />

                        <div className="flex items-center gap-1 text-sm text-gray-300">
                            <Image src={solana} className='w-5 h-5' alt="solana" />
                            <span>SOL</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    disabled={Available <= 0 || !walletAddress || loading || cooldown}
                    onClick={fetchData}
                    className={`w-full py-2 rounded-md text-white font-medium transition tracking-wider 
    ${Available <= 0 || !walletAddress || loading || cooldown
                            ? 'bg-[#0000ff46] cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-700 cursor-pointer'
                        }`}
                >
                    {loading ? 'Claiming...' : (walletAddress ? 'Claim' : 'Missing Destination Address')}
                </button>




            </div>
        </div>
    );
}

export default RefPopup;
