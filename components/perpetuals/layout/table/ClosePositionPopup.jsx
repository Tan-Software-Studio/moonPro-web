import { X } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstanceAuth from '@/apiInstance/axiosInstanceAuth';
import { showToastLoader } from '@/components/common/toastLoader/ToastLoder';
import { orderPositions } from '@/app/redux/perpetauls/perpetual.slice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ClosePositionPopup = ({ onClose, closeOrderToken, orderType }) => {
    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL
    const fullUSD = closeOrderToken?.positionValue;

    const dispatch = useDispatch()

    const [usdAmount, setUsdAmount] = useState(fullUSD);
    const [percentage, setPercentage] = useState(100);
    const [limitPriceInput, setLimitPriceInput] = useState(1)
    const [isBtnLoading, setIsBtnLoading] = useState(false)

    const selectedToken = useSelector(
        (state) => state?.perpetualsData?.selectedToken
    );
    const userDetails = useSelector((state) => state?.userData?.userDetails);


    const currentSize = (closeOrderToken?.szi * percentage) / 100;

    function handleLimitPriceInput(e) {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;

        if (value === '' || regex.test(value)) {
            if (value === '') {
                setLimitPriceInput('');
            } else {
                const num = parseFloat(value);
                setLimitPriceInput(num);
            }
        }
    }

    function handleUsdInput(e) {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;

        if (value === "" || regex.test(value)) {
            setUsdAmount(value);

            if (value === "") {
                setPercentage(0);
                return;
            }

            const num = parseFloat(value);
            if (!isNaN(num)) {
                const clamped = Math.min(num, fullUSD);
                setUsdAmount(clamped);
                setPercentage((clamped / fullUSD) * 100);
            }
        }
    }

    function handleSliderChange(e) {
        const newPercent = Number(e.target.value);
        setPercentage(newPercent);
        const newUSD = (fullUSD * newPercent) / 100;
        setUsdAmount(newUSD);
    }

    async function handleConfirm() {
        setIsBtnLoading(true)
        showToastLoader("Transaction proccessing", "transation-toast");
        try {
            const response = await axiosInstanceAuth.post(`${baseUrl}hyper/closeOrder`, {
                tokenName: closeOrderToken?.coin,
                size: currentSize,
                limit: orderType == "Limit" ? "yes" : "no",
                price: orderType == "Limit" ? limitPriceInput : Number(selectedToken?.markPx),
                isBuy: Number(closeOrderToken?.szi) > 0 ? "yes" : "no"
            })
            toast.success(response?.data?.message || "Order closed successfully...", {
                id: "transation-toast",
                duration: 2000,
            });
            dispatch(orderPositions(userDetails?.perpsWallet))
            setIsBtnLoading(false)
            onClose(false)
        } catch (error) {
            console.log("🚀 ~ handleConfirm ~ error:", error)
            toast.error(error?.response?.data?.message || "Please try again!", {
                id: "transation-toast",
                duration: 2000,
            });
            setIsBtnLoading(false)
        }
        finally {
            setIsBtnLoading(false)
        }
    }


    return (
        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onClose(false)}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
            <motion.div
                key="modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-[#08080E] border border-gray-700 rounded-xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6  py-4 border-b border-gray-700">
                    <h2 className="text-white text-lg font-semibold">{orderType} Close</h2>
                    <button
                        onClick={() => onClose(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-gray-300 text-sm mb-6 text-center">
                        This will attempt to immediately close the position.
                    </p>

                    {/* Size */}
                    <div className="flex items-center mb-4 justify-between">
                        <div className="text-sm font-medium text-white">Size</div>
                        <div className="text-red-500 text-xs">
                            {currentSize.toFixed(8)} {closeOrderToken?.coin || "BTC"}
                        </div>
                    </div>

                    {/* Price */}
                    {orderType == "Market" && <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-medium text-white">Price</div>
                        <div className="text-xs text-white">Market</div>
                    </div>}


                    {orderType == "Limit" &&
                        <div className="mt-2">
                            <div className=" bg-[#1D1E26] border border-gray-600 rounded-lg px-4 py-3 text-white text-sm">
                                <div className='flex justify-between items-center'>
                                    <div className="text-sm w-[20%] text-gray-400">Price</div>
                                    <input
                                        value={+Number(limitPriceInput).toFixed(2)}
                                        onChange={handleLimitPriceInput}
                                        type="number"
                                        placeholder={`0.00`}
                                        className="bg-transparent w-[80%] text-right text-sm font-medium focus:outline-none placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    }

                    {/* Size Input */}
                    <div className="mb-6 mt-2">
                        <div className="w-full bg-[#1A1B23] border border-gray-600 rounded-lg px-3 flex items-center justify-between py-3">
                            <div className="text-gray-400 w-[20%] text-sm font-medium">Size</div>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={+Number(usdAmount).toFixed(2)}
                                    onChange={handleUsdInput}
                                    placeholder="0.00"
                                    className="bg-transparent text-right text-sm font-medium text-white focus:outline-none placeholder-gray-400 w-[80%]"
                                />
                                <span className="text-gray-400 text-xs">USD</span>
                            </div>
                        </div>
                    </div>



                    {/* Slider */}
                    <div className="mb-6">
                        <div className="flex justify-end items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-medium">{percentage.toFixed(1)}%</span>
                            </div>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={percentage}
                            onChange={handleSliderChange}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #1F73FC 0%, #1F73FC ${percentage}%, #1F2937 ${percentage}%, #1F2937 100%)`
                            }}
                        />

                    </div>

                    {/* Confirm Button */}
                    {isBtnLoading ?

                        <button
                            className="w-full bg-[#1F73FC]/50 cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            <div className="flex justify-center py-2 items-center gap-2">
                                <div className="loaderPopup"></div>
                            </div>
                        </button>

                        :
                        <button
                            disabled={currentSize <= 0}
                            className={`w-full  ${currentSize <= 0 ? "bg-[#1F73FC]/50 cursor-not-allowed" : "bg-[#1F73FC] hover:bg-[#1557D0]  cursor-pointer"} text-white font-medium py-3 px-4 rounded-lg transition-colors`}
                            onClick={handleConfirm}
                        >
                            {orderType} Close
                        </button>
                    }
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ClosePositionPopup;
