import React, { useState } from 'react'
import { motion } from "framer-motion";
import { X } from 'lucide-react';

const SlippagePopup = ({ onClose, slippageAmount, setSlippageAmount }) => {
    const [error, setError] = useState(''); 
    function handleAmountInput(e) {
        const value = e.target.value;
        if (value === '') {
            setSlippageAmount('');
            setError('');
            return;
        }

        const regex = /^\d*\.?\d*$/;
        if (!regex.test(value)) return;

        const num = parseFloat(value);
        if (!isNaN(num)) {
            if (num < 1 || num > 100) {
                setError('Slippage must be between 1% and 100%');
            } else {
                setError('');
                setSlippageAmount(num);
            }
        }
    }

    function handleConfirm() {
        if (slippageAmount < 1 || slippageAmount > 100 || slippageAmount === '') {
            setError('Please enter a value between 1 and 100');
            return;
        } 
        onClose();
    }

    return (
        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onClose()}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[999999]"
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
                <div className="flex items-center justify-end px-4 py-3 border-b border-gray-700">
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <h2 className="text-white text-base font-semibold mb-2 text-center mt-5">Adjust Max Slippage</h2>
                    <p className="text-xs text-gray-400 text-center mb-6">
                        Max slippage only affects market orders placed from the order form. Closing positions will use max slippage of 8% and market TP/SL orders will use max slippage of 10%.
                    </p>

                    <div className="bg-[#1D1E26] rounded-lg px-4 py-3 text-white text-sm">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={slippageAmount}
                                placeholder="0.0"
                                onChange={handleAmountInput}
                                className="bg-transparent w-full text-lg font-medium focus:outline-none placeholder-gray-400"
                            />
                            <span className="text-sm text-gray-400">%</span>
                        </div>
                        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full mt-6 bg-[#1F73FC] hover:bg-[#155EE0] text-white text-sm font-medium py-2.5 rounded-md transition"
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default SlippagePopup;
