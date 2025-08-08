import React, { useState } from 'react';
import { motion } from "framer-motion";
import { X, ArrowLeftRight } from 'lucide-react';

const PerpsSpotPopup = ({ onClose, PerpsBalance, spotBalance, }) => {
    const [direction, setDirection] = useState(true);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const maxAmount = direction === true ? PerpsBalance : spotBalance;

    const handleMaxClick = () => {
        setAmount(maxAmount.toString());
        setError("");
    };

    const handleAmountChange = (e) => {
        let val = e.target.value;

        if (!/^\d*\.?\d*$/.test(val)) return;

        if (Number(val) > maxAmount) {
            val = maxAmount.toString();
        }

        setAmount(val);
        setError("");
    };


    const handleConfirm = () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError("Enter a valid amount");
            return;
        }
        if (Number(amount) > maxAmount) {
            setError("Amount exceeds available balance");
            return;
        }
        setError("");
        // onTransfer(direction, Number(amount));
        onClose(false);
    };

    return (
        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onClose(false)}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[999999]"
        >
            <motion.div
                key="modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg bg-[#08080E] border border-gray-700 rounded-xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="px-6 pb-2 mt-2">
                    <div className="flex justify-end">
                        <button onClick={() => onClose(false)} className="text-gray-400 hover:text-white transition">
                            <X size={20} />
                        </button>
                    </div>
                    <h2 className="text-white text-base font-semibold mb-2 text-center mt-2">
                        Transfer USDC
                    </h2>
                    <p className="text-xs text-gray-400 text-center mb-3">
                        Transfer USDC between your Perps and Spot balances.
                    </p>

                    {/* Direction Switch */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center gap-2 mb-3 bg-[#1D1E26] w-fit rounded">
                            <button className={`px-3 py-1 rounded-md text-sm font-medium transition text-white`} >
                                {direction == true ? "Perps" : "Spot"}
                            </button>

                            <ArrowLeftRight
                                onClick={() => {
                                    setDirection(!direction)
                                    setAmount(0)
                                }}
                                size={18} className="text-gray-400 cursor-pointer" />

                            <button className={`px-3 py-1 rounded-md text-sm font-medium transition text-white `}>
                                {direction == true ? "Spot" : "Perps"}
                            </button>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="bg-[#1D1E26] rounded-lg px-4 py-3 text-white text-sm">
                        <div className="flex items-center justify-between">
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0.0"
                                className="bg-transparent w-full text-lg font-medium focus:outline-none placeholder-gray-400"
                            />

                            <button
                                onClick={handleMaxClick}
                                className="text-xs text-[#1F73FC] hover:underline truncate"
                            >
                                MAX: {maxAmount}
                            </button>
                        </div>

                        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full mt-6 py-3 rounded-lg font-medium bg-[#1F73FC] text-[#FFFFFF]  transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!amount || Number(amount) <= 0}
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>
        </motion.div >
    );
};

export default PerpsSpotPopup;
