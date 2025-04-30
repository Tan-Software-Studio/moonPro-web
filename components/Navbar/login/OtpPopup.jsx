import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import OTPInput from 'react-otp-input'
import PasswordPopup from './PasswordPopup';
import RecoveryKey from './RecoveryKey';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { setJwtToken, setSolWalletAddress, setSOLWalletAddress } from '@/app/redux/states';
import { useDispatch } from 'react-redux';



const OtpPopup = ({ setIsLoginPopup, authName, jwtToken, email, setAuthName }) => {
    const dispatch = useDispatch();
    const [recoveryKey, setRecoveryKey] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyData, setVerifyData] = useState({})
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')


    const [otpError, setOtpError] = useState(' ')


    const [passwordInput, setPasswordInput] = useState('')
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('')


    const handleClose = () => {
        setIsLoginPopup(false)
    }

    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;


    const handleVerify = async () => {
        const confirmPassword = confirmPasswordInput.trim();
        const password = passwordInput.trim();

        if (!otp) {
            setOtpError("Otp is required")
            return;
        }
        if (otp.length < 6) {
            setOtpError("Otp is not valid")
            return;
        }
        setOtpError('')
        if (authName != 'login') {
            if (password.length < 8) {
                setPasswordError("Password must be at least 8 characters long.");
                return;
            }
            if (!/[a-z]/.test(password)) {
                setPasswordError("Password must include at least one lowercase letter.");
                return;
            }
            if (!/[A-Z]/.test(password)) {
                setPasswordError("Password must include at least one uppercase letter.");
                return;
            }
            if (!/\d/.test(password)) {
                setPasswordError("Password must include at least one digit.");
                return;
            }
            if (!/[@$!%*?#&]/.test(password)) {
                setPasswordError("Password must (@$!%*?#&) one special character .");
                return;
            }
            setPasswordError('')

            if (!confirmPassword) {
                setConfirmPasswordError("Confirm password is required");
                return;
            }
            if (confirmPassword != password) {
                setConfirmPasswordError("New password and Confirm password should be same ");
                return;
            }
            setConfirmPasswordError('')
        }

        try {
            const response = await axios.post(`${baseUrl}verify`, {
                otp: Number(otp),
                ...(authName != 'login' && {
                    password: password,
                    confirmPassword: confirmPassword
                }),
            },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            )
            localStorage.setItem('token', response?.data?.data?.token)
            localStorage.setItem('walletAddress', response?.data?.data?.user?.walletAddressSOL)

            setVerifyData(response?.data)

            if (response?.data?.statusCode === 200) {
                if (authName == 'login') {
                    setIsLoginPopup(false)
                } else {
                    setRecoveryKey(true)
                }
            }
            dispatch(setSolWalletAddress())
            toast.success(response?.data?.message)
        }
        catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message)
        }
    }


    return (
        <>
            {recoveryKey && authName != 'login' ? <RecoveryKey verifyData={verifyData} setVerifyData={setVerifyData} setIsLoginPopup={setIsLoginPopup} />
                :
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#1F1F1F] border-[1px] border-[#404040]  rounded-md shadow-lg w-[350px] "
                    >
                        <div className='p-4'>
                            <div
                                className='flex cursor-pointer  leading-none items-center justify-end'>
                                <IoMdClose onClick={handleClose} className='w-fit' />
                            </div>

                            <h2 className="text-base text-center pointer-events-none leading-none">Confirmation code</h2>


                            <div className='text-sm text-center mt-3 '>We&apos;ve sent a verifaction code to {email}</div>
                            < OTPInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderInput={(props) => <input {...props} />}
                                containerStyle="flex justify-center gap-2 mt-2"
                                inputStyle={{
                                    width: "2.7rem",
                                    height: "2.7rem",
                                    padding: "0.5rem",
                                    textAlign: "center",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    color: "#FFFFFF",
                                    backgroundColor: "#1F1F1F",
                                    border: "1px solid #404040", //isInvalidOtp ? "1px solid red" :
                                    borderRadius: "8px",
                                    outline: "none",
                                    transition: "border 0.2s ease-in-out",
                                    // animation: isInvalidOtp ? "shake 0.7s" : "none",
                                }}
                            />
                            <div className='text-xs text-red-600 mt-0.5'>{otpError}</div>

                            {authName != 'login' &&
                                <div className='mt-4'>
                                    <div className='text-sm '>Password</div>
                                    <div className=' border-[1px] bg-[#1F1F1F] py-2 px-2 mt-1 flex items-center justify-between rounded-md border-[#404040] '>
                                        <input
                                            type={!showPassword ? "password" : "text"}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            className=" focus:outline-none text-sm w-full bg-[#1F1F1F]" placeholder="Enter password"

                                        />
                                        {showPassword ?
                                            <FaEye size={18} onClick={() => setShowPassword(!showPassword)} className='w-fit cursor-pointer' />
                                            :
                                            <FaEyeSlash size={18} onClick={() => setShowPassword(!showPassword)} className='w-fit cursor-pointer' />
                                        }
                                        {/* <FaEyeSlash size={18} className='w-fit cursor-pointer' /> */}
                                    </div>
                                    <div className='text-xs text-red-600 mt-0.5'>{passwordError}</div>
                                    <div className=' border-[1px] bg-[#1F1F1F] py-2 px-2 mt-1 flex items-center justify-between rounded-md border-[#404040] '>
                                        <input
                                            type={!showPassword1 ? "password" : "text"}
                                            placeholder="Confirm password"
                                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                                            className=" focus:outline-none text-sm w-full bg-[#1F1F1F]"

                                        />
                                        {showPassword1 ?
                                            <FaEye size={18} onClick={() => setShowPassword1(!showPassword1)} className='w-fit cursor-pointer' />
                                            :
                                            <FaEyeSlash size={18} onClick={() => setShowPassword1(!showPassword1)} className='w-fit cursor-pointer' />
                                        }
                                        {/* <FaEyeSlash size={18} className='w-fit cursor-pointer' /> */}
                                    </div>
                                    <div className='text-xs text-red-600 mt-0.5'>{confirmPasswordError}</div>
                                </div>
                            }
                            <button
                                onClick={handleVerify}
                                className='bg-[#1f73fc]  text-sm py-2 flex items-center  w-full mt-3 rounded-md justify-center'>Verify</button>

                            {/* <div className='text-sm text-center mt-3 '>You can resend a new code in 60 seconds</div> */}
                        </div>
                        <div className='text-xs border-t-[1px] border-t-[#404040] mt-3 text-center'>
                            <div className=' p-4'>
                                By creating an account, you agree to moon pro&aspos;s Privacy Policy and Terms of Service
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default OtpPopup
