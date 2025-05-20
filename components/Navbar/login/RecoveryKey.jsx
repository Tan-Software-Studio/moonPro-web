import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { openCloseLoginRegPopup } from "@/app/redux/states";
import { useDispatch } from "react-redux";

const RecoveryKey = ({ verifyData, setVerifyData }) => {
  const dispatch = useDispatch();
  const [isRevealed, setIsRevealed] = useState(false);
  const { t } = useTranslation();
  const navbar = t("navbar");
  const handleClose = () => {
    dispatch(openCloseLoginRegPopup(false));
    setVerifyData({});
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyData?.data?.solPhrase);
    toast.success("Recovery key copied to clipboard");
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center z-50 "
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#141414]/90 backdrop-blur-lg border border-[#2A2A2A]  rounded-2xl w-[400px] relative"
        >
          <IoMdClose
            size={22}
            onClick={handleClose}
            className="absolute right-4 top-4 text-[#6E6E6E] hover:text-white cursor-pointer transition duration-200"
          />

          <div className="p-8">
            <h2 className="text-2xl font-semibold text-center text-white">
              {navbar?.recovery?.recoveryKey}
            </h2>
            <div className="mt-4">
              <div className="text-sm text-center">
                {navbar?.recovery?.thisRecovery}
              </div>
            </div>
            <div className="mt-4  w-full">
              <div className="text-sm text-[#6E6E6E] mt-2 mb-1 block">
                {navbar?.recovery?.recoveryKey}{" "}
              </div>
              <div
                className={`flex w-full border-[1px] border-[#404040] rounded-md  mt-1 p-3  bg-[#1F1F1F] ${
                  !isRevealed ? "blur-sm select-none" : ""
                }`}
              >
                <div className="w-[90%] overflow-x-hidden  break-words text-sm ">
                  {verifyData?.data?.solPhrase}
                </div>
                <div className="cursor-pointer w-[10%]">
                  <div className="justify-end w-full flex">
                    <MdContentCopy onClick={handleCopy} className="w-fit" />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className={`mt-6 w-full rounded-lg text-sm py-3 font-semibold transition bg-[#11265B] hover:bg-[#133D94] border border-[#0E43BD] text-white shadow-md`}
            >
              {navbar?.recovery?.revealMyKey}
            </button>
          </div>
          <div className="text-xs border-t-[1px] border-t-[#404040] mt-3 text-center">
            <div className=" p-4">{navbar?.recovery?.warning}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecoveryKey;
