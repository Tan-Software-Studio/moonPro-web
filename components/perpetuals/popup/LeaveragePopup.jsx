import React, { useState } from 'react'
import { motion } from "framer-motion";
import { X } from 'lucide-react';

const LeaveragePopup = ({ onClose, maxLeverage, leverage, setMaxLeverage }) => {
    // const leverage = selectedToken?.maxLeverage || 100;
    // const [size, setSize] = useState(maxLeverage / 2);

    function handleSliderChange(e) {
        const percent = parseFloat(e.target.value);
        setMaxLeverage(percent);
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
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    <h2 className="text-white text-lg font-semibold">Adjust Leverage</h2>
                    <button onClick={() => onClose()} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-5 py-6">
                    <p className="text-xs text-gray-400">
                        Adjust your leverage to manage your exposure. Higher leverage increases both potential profits and risks.
                    </p>

                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2 text-sm text-gray-300">
                            <span>Leverage: <span className="text-white font-medium">{maxLeverage}x</span></span>
                            <span className="text-xs text-gray-500">{Math.round((maxLeverage / leverage) * 100)}%</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max={leverage}
                            value={maxLeverage}
                            onChange={handleSliderChange}
                            className="w-full h-2 appearance-none cursor-pointer bg-[#1F2937] rounded-full outline-none transition"
                            style={{
                                background: `linear-gradient(to right, #1F73FC 0%, #1F73FC ${((maxLeverage / leverage) * 100)}%, #1F2937 ${((maxLeverage / leverage) * 100)}%, #1F2937 100%)`
                            }}
                        />

                        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setMaxLeverage(maxLeverage)
                            onClose()
                        }}
                        className="w-full mt-8 bg-[#1F73FC] hover:bg-[#155EE0] text-white text-sm font-medium py-2.5 rounded-md transition"
                    >
                        Update Leverage
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default LeaveragePopup;
