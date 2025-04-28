import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io'
import { MdContentCopy } from "react-icons/md";


const RecoveryKey = ({ setIsLoginPopup, verifyData, setVerifyData }) => {

    const [isRevealed, setIsRevealed] = useState(false);
    const handleClose = () => {
        setIsLoginPopup(false);
        setVerifyData({})
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(verifyData?.data?.solPhrase)
        toast.success('Recovery key copied to clipboard')
    }

        
    


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1F1F1F] border-[1px] border-[#404040] rounded-md shadow-lg w-[350px] "
            >
                <div className='p-4'>
                    <div
                        onClick={handleClose}
                        className='flex cursor-pointer  leading-none items-center justify-end'>
                        <IoMdClose className='w-fit' />
                    </div>
                    <h2 className="text-base text-center leading-none">Recovery Key</h2>
                    <div className='mt-4'>
                        <div className='text-sm text-center'>This recovery key will allow you to access your wallet if you ever lose your credential to your moon pro account</div>
                    </div>
                    <div className='mt-4  w-full'>
                        <div className='text-sm '>Recovery key </div>
                        <div className={`flex w-full border-[1px] border-[#404040] rounded-md  mt-1 p-3  bg-[#1F1F1F] ${!isRevealed ? 'blur-sm select-none' : ''}`}>
                            <div className='w-[90%] overflow-x-hidden  break-words text-sm '>{verifyData?.data?.solPhrase}</div>
                            <div className='cursor-pointer w-[10%]'>
                                <div className='justify-end w-full flex'>
                                    <MdContentCopy
                                        onClick={handleCopy}
                                        className='w-fit' /></div>
                            </div>
                        </div>
                    </div>
                    <button

                        onClick={() => setIsRevealed(!isRevealed)}
                        className='bg-[#1f73fc] text-sm py-2 flex items-center   w-full mt-3 rounded-md justify-center'>
                        Reveal my key
                    </button>
                </div>
                <div className='text-xs border-t-[1px] border-t-[#404040] mt-3 text-center'>
                    <div className=' p-4'>
                        WARNING: This recovery key is the only way to access your wallet if you lose your credentials. Store it in a safe place and do not share it with anyone.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecoveryKey
