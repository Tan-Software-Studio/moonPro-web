import React from "react";
import { motion } from "framer-motion";

function ImportWalletModal({ wallettrackerPage, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-2 z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0A0A0B] text-white rounded-lg w-[500px] shadow-lg border border-[#404040]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#404040] px-4 pt-4">
          <h2 className="text-[22px] font-bold">
            {wallettrackerPage?.importwallets}
          </h2>
          <button onClick={onClose} className="text-[#A8A8A8] text-xl">
            ×
          </button>
        </div>

        {/* Form */}
        <div className="mt-4 space-y-4 px-4">
          <div className="text-[#D6EBFE] font-medium text-[12px]">
            {wallettrackerPage?.desc}
          </div>
          <div className="relative border border-[#404040] rounded-md p-3">
            <textarea
              className="w-full bg-transparent text-[#808080] text-sm outline-none resize-none h-24"
              placeholder={`wallet address 1, wallet name 1\nwallet address 2, wallet name 2\nwallet address 3, wallet name 3\n...`}
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-5 space-x-3 pb-4 px-4">
          <button
            onClick={onClose}
            className="border border-[#ED1B24] text-[#ED1B24] px-5 py-2 rounded-md hover:bg-[#ED1B24] hover:text-white transition"
          >
            {wallettrackerPage?.cancel}
          </button>
          <button className="bg-[#1F73FC] px-5 py-2 rounded-md text-white hover:bg-blue-600 transition">
            {wallettrackerPage?.add}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ImportWalletModal;
