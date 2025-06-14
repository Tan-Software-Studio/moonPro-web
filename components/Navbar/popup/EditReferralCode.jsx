"use client"
import { fetchUserData, updateUserReferralId } from '@/app/redux/userDataSlice/UserData.slice'
import axios from 'axios'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { useDispatch } from 'react-redux'

const EditReferralCode = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [referralCode, setReferralCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL

    async function handleSumbit() {
        const referralId = referralCode.trim()
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login")
            return
        }
        if (referralId.length === 0) {
            setError("Referral Id is required")
            return
        }
        if (referralId == 0) {
            setError("referral id should not be 0")
            return;
        }
        if (referralId.length > 9) {
            setError("Referral Id must have less then 9 letter")
            return
        }
        setIsLoading(true)
        await axios.put(`${baseUrl}user/editReferralId`, {
            referralId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setIsLoading(false)
            toast.success(response?.data?.message)
            dispatch(updateUserReferralId(response?.data?.data?.referralId))
            setIsOpen(false)
            setError("")
        }).catch((error) => {
            console.error(error)
            setError("")
            setIsLoading(false)
            toast.error(error?.response?.data?.message || "Something went wrong")
        })
    }


    return (
        <>
            <MdEdit onClick={() => setIsOpen(!isOpen)} className="cursor-pointer text-xs hover:text-white transition-colors flex-shrink-0" title="Edit Referral Link" />
            {isOpen &&
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-[1px] flex items-center justify-center !z-[999999999999999] p-2 sm:p-4"
                >
                    <motion.div
                        key="modal"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-[350px] bg-[#18181a] rounded-md !z-[999999999999999] max-h-[95vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="">
                            <div className="relative flex items-center justify-center px-3 sm:px-4 pt-3 pb-1.5 ">
                                <div className="text-base sm:text-lg font-medium text-white truncate">
                                    Edit Referral code
                                </div>
                                <div
                                    onClick={() => setIsOpen(false)}
                                    className="cursor-pointer px-5 absolute right-0"
                                >
                                    <IoClose size={18} />
                                </div>
                            </div>
                            <div className='px-2 py-2'>
                                <div className="mt-3">
                                    <label className="text-sm text-[#6E6E6E] mb-1 block">Referral Code</label>
                                    <div className="flex items-center gap-3 bg-[#1F1F1F] border border-[#333] px-4 py-2 rounded-lg transition focus-within:border-[#1F73FC]">
                                        <input
                                            type="email"
                                            placeholder="Referral Code"
                                            onChange={(e) => setReferralCode(e.target.value)}
                                            className="w-full bg-transparent text-sm text-white placeholder-[#6E6E6E] focus:outline-none"
                                        />
                                    </div>
                                    {/* <p className="text-xs text-red-500 mt-1">{error}</p> */}
                                </div>
                                <p className="text-xs text-red-500 mt-1">{error}</p>
                                <button
                                    onClick={handleSumbit}
                                    disabled={isLoading}
                                    className={`mt-3 w-full rounded-lg text-sm py-2 font-semibold transition border ${isLoading ? "bg-[#11265B] cursor-not-allowed" : "bg-[#11265B] hover:bg-[#133D94]"}  border-[#0E43BD] text-white shadow-md`}
                                >
                                    {isLoading ?
                                        <div className="flex justify-center py-2 items-center gap-2">
                                            <div className="loaderPopup"></div>
                                        </div> :
                                        "Set"
                                    }
                                </button>
                                <div className="mt-4 text-xs text-[#AAAAAA]">
                                    Note: You can edit referral code only once
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </>
    )
}

export default EditReferralCode