import { Solana, usdcPerps } from '@/app/Images'
import { ArrowUpDown, X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { showToaster, showToasterSuccess } from '@/utils/toaster/toaster.style';
import axiosInstanceAuth from '@/apiInstance/axiosInstanceAuth';
import { orderPositions } from '@/app/redux/perpetauls/perpetual.slice';

const SwapPopup = ({ onClose, perpsBalance, SolBalance }) => {

    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL
    const SOL_PRICE_IN_USDC = 170;
    const activeSolWalletAddress = useSelector(
        (state) => state?.userData?.activeSolanaWallet
    );
    console.log("🚀 ~ SwapPopup ~ activeSolWalletAddress:", activeSolWalletAddress)


    const dispatch = useDispatch();
    const [solInputAmount, setSolInputAmount] = useState(0);
    const [usdcInputAmount, setUsdcInputAmount] = useState(0);
    const [btnLoading, setBtnLoading] = useState(false)
    const userDetails = useSelector((state) => state?.userData?.userDetails);


    function handleSolInputAmount(e) {
        const maxAmount = activeSolWalletAddress?.balance
        let val = e.target.value
        if (!/^\d*\.?\d*$/.test(val)) return;
        if (Number(val) > maxAmount) {
            val = maxAmount.toString();
        }
        setSolInputAmount(val);
        setUsdcInputAmount(val ? (Number(val) * SOL_PRICE_IN_USDC).toFixed(2) : 0);
    }

    const handleConfirmConvert = async () => {
        try {
            setBtnLoading(true)
            const response = await axiosInstanceAuth.post(`${baseUrl}hyper/deposit`, {
                amount: Number(solInputAmount),
            })
            dispatch(orderPositions(userDetails?.perpsWallet))
            showToasterSuccess(response?.data?.message || "Successfully transfer");
            setBtnLoading(false)
            onClose(false);
        } catch (error) {
            showToaster(error?.response?.data?.message || "Please try again!");
            setBtnLoading(false)
        } finally {
            setBtnLoading(false)
        }
    };

    return (
        <>
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => onClose()}
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center !z-50"
            >
                <motion.div
                    key="modal"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="LanguagePopup-lg max-w-sm sm:w-[90%] border border-gray-800 w-full bg-[#08080E] rounded-md !z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 border-b border-gray-800">
                        <h2 className="text-lg font-medium text-white">Exchange</h2>
                        <button
                            onClick={() => onClose()}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="flex flex-col h-full">

                            <div className="mb-2">
                                <div className=" bg-[#1D1E26] rounded-lg px-4 py-3 text-white text-sm">
                                    <div className='flex justify-between items-center'>
                                        <div className="text-gray-400 text-xs font-medium">Converting</div>
                                        <div className="text-gray-400 text-xs font-medium">Balance: {SolBalance}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="number"
                                            value={solInputAmount}
                                            placeholder={`0.0`}
                                            onChange={handleSolInputAmount}
                                            className="bg-transparent text-base  font-medium focus:outline-none placeholder-gray-400"
                                        />
                                        <div className='flex items-center gap-2 mt-2'>
                                            <Image src={Solana} alt="usdc" height={20} width={20} className="rounded-full" />
                                            <div className="text-gray-400 text-xs font-medium">SOL</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center my-2">
                                <button
                                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2 rounded-full transition-colors"
                                >
                                    <ArrowUpDown size={16} className="text-white" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className=" bg-[#1D1E26] rounded-lg px-4 py-3 text-white text-sm">
                                    <div className='flex justify-between items-center'>
                                        <div className="text-gray-400 text-xs font-medium">Gaining</div>
                                        <div className="text-gray-400 text-xs font-medium">Balance: {perpsBalance}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="number"
                                            placeholder={`0.0`}
                                            value={usdcInputAmount}
                                            disabled
                                            className="bg-transparent text-base  font-medium focus:outline-none placeholder-gray-400"
                                        />
                                        <div className='flex items-center gap-2  mt-2'>
                                            <Image src={usdcPerps} alt="usdc" height={20} width={20} className="rounded-full" />
                                            <div className="text-gray-400 text-xs font-medium"> USDC</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right text-[#A8A8A8] text-xs mt-2">
                                    {`1 SOL ≈ ${SOL_PRICE_IN_USDC} USDC`}
                                </div>
                            </div>

                            <div className='text-[#A8A8A8] text-[10px] mb-4 mt-4 break-all'>NOTE: Exchange Native Solana for USDC on Hyperliquid. The minimum deposit is 7 USDC.</div>


                            <div className="mt-auto">
                                {btnLoading ?
                                    <button className="w-full bg-[#1d73fc] opacity-50 cursor-not-allowed py-3 rounded-lg font-bold text-sm text-[#FFFFFF] transition-colors">
                                        <div className="flex justify-center py-2 items-center gap-2">
                                            <div className="loaderPopup"></div>
                                        </div>
                                    </button>
                                    :
                                    <button
                                        onClick={handleConfirmConvert}
                                        className="w-full bg-[#1d73fc] hover:bg-[#438bff] py-3 rounded-lg font-bold text-sm text-[#FFFFFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={usdcInputAmount <  7 || btnLoading}
                                    >
                                Confirm
                            </button>
                                }
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div >
        </>
    )
}

export default SwapPopup