import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';


export default function ReferralCodePopup({ verifyData, setIsLoginPopup }) {
    const [referralCode, setReferralCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { t } = useTranslation();
    const navbar = t("navbar");

    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = verifyData?.data?.token

        if (!referralCode.trim()) {
            setErrorMessage(navbar?.referralPopup?.referralCode);
            return;
        }
        setErrorMessage('');

        try {
            setIsLoading(true);
            const response = await axios.put(`${baseUrl}user/addreferral`,
                {
                    inviteCode: referralCode
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response?.data?.data?.user?.verify == true) {
                setIsLoginPopup(false)
            }
            setIsLoading(false);
            toast.success(response?.data?.data?.message);
        }
        catch (error) {
            setIsLoading(false);
            console.error(error)
            toast.error(error?.message)
        }
    };

    return (
        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center z-50"

        >
            <motion.div
                key="modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#141414]/90 backdrop-blur-lg border border-[#2A2A2A] rounded-2xl w-[400px] relative"
            >
                <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-white"
                    aria-label="Close"
                >
                    <IoMdClose
                        onClick={() => setIsLoginPopup(false)}
                        size={22} />
                </button>

                <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-[#133D94] rounded-full p-3">
                            <FaGift size={24} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                        {navbar?.referralPopup?.useReferral}
                    </h2>

                    <p className="text-gray-400 text-center mb-6">
                        {navbar?.referralPopup?.specialBonuses}
                    </p>

                    <div>
                        <div className="mb-4">
                            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300 mb-2">
                                {navbar?.referralPopup?.referralCoded}
                            </label>
                            <input
                                type="text"
                                id="referralCode"
                                placeholder={navbar?.referralPopup?.enterCode}
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                className="w-full p-3  bg-[#141414]/90 border border-[#333] rounded-lg text-white  focus:outline-none  "
                            />
                            {errorMessage && (
                                <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`mt-6 w-full rounded-lg text-sm py-3 font-semibold transition ${isLoading
                                ? 'bg-[#11265B] cursor-not-allowed'
                                : 'bg-[#11265B] hover:bg-[#133D94]'
                                } border border-[#0E43BD] text-white shadow-md`}
                        >
                            {!isLoading ? 'Apply Code' : (
                                <div className="flex justify-center py-2 items-center gap-2">
                                    <div className="loaderPopup"></div>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don t have a code? <a href="#" className="text-[#1F73FC] hover:text-[#1F73FC]/[90] ">Ask your friends</a>
                        </p>
                    </div> */}
                </div>
            </motion.div>
        </motion.div>
    );
}