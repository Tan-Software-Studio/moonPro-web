import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { showToasterSuccess } from "@/utils/toaster/toaster.style";
import axiosInstanceAuth from "@/apiInstance/axiosInstanceAuth";
const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
const LeaveragePopup = ({
  onClose,
  leverage,
  maxLeverage,
  tokenName,
  setLeverageDataState,
}) => {
  const [tempLeverage, setTempLeverage] = useState(maxLeverage);
  const [loader, setLoader] = useState(false);

  async function handleMaxLeverage() {
    try {
      if (!tokenName) {
        console.error("Token name not found.");
        return;
      }
      setLoader(true);
      const response = await axiosInstanceAuth.post(
        `${baseUrl}hyper/updateLeverage`,
        {
          tokenName: tokenName?.toString(),
          leverage: Number(tempLeverage),
        }
      );
      const leverageTokenData = JSON.parse(
        localStorage.getItem("leverageTokenData")
      );
      if (!leverageTokenData) {
        localStorage.setItem(
          "leverageTokenData",
          JSON.stringify({
            [tokenName]: tempLeverage,
          })
        );
        const tempLocalDatasUpdate = {
          [tokenName]: tempLeverage,
        };
        setLeverageDataState(tempLocalDatasUpdate);
      } else {
        const tempLeverageLocalData = {
          ...leverageTokenData,
          [tokenName]: tempLeverage,
        };
        localStorage.setItem(
          "leverageTokenData",
          JSON.stringify(tempLeverageLocalData)
        );
        setLeverageDataState(tempLeverageLocalData);
      }
      onClose(false);
      setLoader(false);
      showToasterSuccess("Leverage updated.");
    } catch (error) {
      console.log("🚀 ~ handleMaxLeverage ~ error:", error);
      setLoader(false);
      onClose(false);
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
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="text-xs text-gray-400">
            Adjust your leverage to manage your exposure. Higher leverage
            increases both potential profits and risks.
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2 text-sm text-gray-300">
              <span>
                Leverage:{" "}
                <span className="text-white font-medium">{tempLeverage}x</span>
              </span>
              <span className="text-xs text-gray-500">Max: {leverage}X</span>
            </div>

            <input
              type="range"
              min="1"
              max={leverage}
              value={tempLeverage}
              onChange={(e) => setTempLeverage(e.target.value)}
              className="w-full h-2 appearance-none cursor-pointer bg-[#1F2937] rounded-full outline-none transition"
              style={{
                background: `linear-gradient(to right, #1F73FC 0%, #1F73FC ${
                  (tempLeverage / leverage) * 100
                }%, #1F2937 ${(tempLeverage / leverage) * 100}%, #1F2937 100%)`,
              }}
            />
          </div>
          {loader ? (
            <button className="w-full mt-8 py-2 rounded-lg font-medium bg-[#1F73FC] text-[#FFFFFF]  transition opacity-50 cursor-not-allowed">
              <div className="flex justify-center py-2.5 items-center gap-2">
                <div className="loaderPopup"></div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleMaxLeverage()}
              className="w-full mt-8 bg-[#1F73FC] hover:bg-[#155EE0] text-white text-sm font-medium py-2.5 rounded-md transition"
            >
              Update Leverage
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeaveragePopup;
