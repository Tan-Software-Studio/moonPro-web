// SolDeposit.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Copy, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import Image from 'next/image';
import { walletBalance } from '@/app/Images';
import { useSelector } from 'react-redux';
import { BiCheckDouble } from 'react-icons/bi';

const SolDeposit = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const nativeTokenbalance = useSelector(
    (state) => state?.AllStatesData?.solNativeBalance
  );

  const depositAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
 

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  if (!isOpen) return null;

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClose()}
      className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center !z-[999999999999999]"
    >
      <motion.div
        key="modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="LanguagePopup-lg max-w-sm sm:w-[90%]  w-full bg-[#08080E] rounded-md !z-[999999999999999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between sm:p-4 p-3 border-b border-gray-800">
          <h2 className="text-lg font-medium">Deposit</h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">

          {/* Coin selection */}
          <div className="flex justify-between gap-3 items-center mb-4">
            <div
              className={`flex items-center w-full gap-3 rounded-lg h-8 px-2 bg-[#1A1A1A]   `}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={walletBalance}
                  alt="solana"
                  height={30}
                  width={30}
                  className="rounded-full"
                />
                <div className="text-[#A8A8A8] text-sm">Solana</div>
              </div>
            </div>
            <div
              className={`flex items-center w-full gap-3 rounded-lg h-8 px-2 bg-[#1A1A1A]   `}
            >
              <p className="text-[#A8A8A8] text-sm">Balance:</p>
              <div className="text-[#A8A8A8] text-sm">{Number(nativeTokenbalance).toFixed(5) || 0} SOL</div>
            </div>
          </div>

          {/* Warning text */}
          <div className="text-[#A8A8A8] text-sm mb-4">
            Only deposit SOL through the Solana network for this address.
          </div>

          {/* QR code and address */}
          <div className="flex gap-3 rounded-lg bg-[#08080E] hover:bg-[#1E1E1ECC] cursor-pointer  border-[1px] border-gray-800 px-2 py-2 mb-4">
            <div className="bg-white p-2 rounded-lg w-32 h-32 flex items-center justify-center">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={depositAddress}
                viewBox={`0 0 256 256`}
              />
            </div>
            <div
              onClick={() => handleCopyAddress(depositAddress)}
              className="flex-1 ">
              <p className="text-[#A8A8A8] text-sm mb-1">Deposit Address</p>
              <p className="text-sm break-all mb-2">{depositAddress}</p>
              <button className="text-gray-400 hover:text-white">
                {copied ? (
                  <BiCheckDouble size={16} />
                ) : (
                  <Copy
                    size={16}
                    className="cursor-pointer flex-shrink-0"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className='border-t-[1px] border-gray-800 my-2'></div>

        <div className='sm:px-4 px-3 pb-4 pt-2 '>
          <button
            onClick={handleCopyAddress}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3  rounded-lg font-medium text-sm"
          >
            {copied ? 'Address Copied!' : 'Copy Address'}
          </button>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default SolDeposit;