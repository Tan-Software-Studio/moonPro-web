"use client"
import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import OtpPopup from './OtpPopup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import { googleLogo } from '@/app/Images';
import RecoveryKey from './RecoveryKey';
import { setSolWalletAddress } from '@/app/redux/states';
import { useDispatch } from 'react-redux';
import { MdOutlineEmail } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { motion } from 'framer-motion';
import RefferalPopup from './RefferalPopup';




const LoginPopup = ({ setIsLoginPopup, authName, setAuthName }) => {
    const dispatch = useDispatch()
    const [isPassword, setIsPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState('')
    const [jwtToken, setJwtToken] = useState('')
    const [error, setError] = useState('')
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(false)
    const [verifyData, setVerifyData] = useState({})
    const [refferalCode, setRefferalCode] = useState('')
    const [email, setEmail] = useState('')
    const [isDisable, setIsDisable] = useState(false);
    const [isReffaralCode, setIsReffaralCode] = useState(false)

    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

    const handleOtpPopup = async () => {
        const trimmedEmail = email.trim();
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (trimmedEmail === '') {
            setError('Please enter your email');
            return;
        }
        if (!gmailRegex.test(trimmedEmail)) {
            setError('Please enter a valid email address');
            return;
        }
        else {
            setError('')

        }

        const auth = authName == 'login' ? 'login' : 'signup'
        const password = passwordInput.trim();
        const referralId = refferalCode.trim();
        if (authName == 'login') {
            if (!password) {
                toast.error("Password is required");
                return;
            }
        }
        try {
            setIsDisable(true)
            const response = await axios.post(`${baseUrl}user/${auth}`, {
                email: email.toLowerCase(),
                ...(authName === 'login' && { password: password }),
                ...(authName === 'signup' && { referralId })

            })
            setJwtToken(response?.data?.data?.token)

            if (response?.data?.statusCode === 200 || 201) {
                setIsPassword(true);
                setIsDisable(false)
            }
            // if (response?.data?.statusCode === 201) {
            //     toast.error("User was created but not verified")
            // }

            toast.success(response?.data?.message)

        }
        catch (err) {
            console.error(err);
            setIsDisable(false)
            if (err?.response?.data?.message === "User already register.") {
                toast.error('User already exists please try to login')
                setTimeout(() => {
                    setAuthName('login')
                    // setIsPassword(false)
                }, 1500);
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    }


    const handleGoogleAuth = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            try {
                await axios({
                    url: `${baseUrl}user/googleAuth`,
                    method: "post",
                    data: {
                        googleCode: codeResponse.code,
                    },
                })
                    .then((res) => {
                        localStorage.setItem("token", res?.data?.data?.token);
                        localStorage.setItem("walletAddress", res?.data?.data?.user?.walletAddressSOL);
                        setVerifyData(res?.data);


                        if (res?.data?.message === "Login successfull") {
                            if (res?.data?.data?.user?.referredBy === null) {
                                setIsReffaralCode(true)
                            } else {
                                setIsLoginPopup(false);
                            }
                        } else {
                            setIsGoogleSignIn(true);
                        }
                        dispatch(setSolWalletAddress());
                        toast.success(res?.data?.message);
                    })
                    .catch((err) => {
                        console.error(err);
                        toast.error(err?.message);
                        setIsGoogleSignIn(false);
                    });
            } catch (error) {
                console.error(error);
                toast.error(error?.message)
                setIsReffaralCode(false)
                setIsGoogleSignIn(false)
            }
        },
    });






    return (
        <>

            {isGoogleSignIn ?
                <RecoveryKey
                    verifyData={verifyData}
                    setVerifyData={setVerifyData}
                    setIsLoginPopup={setIsLoginPopup} />

                :
                isReffaralCode ?
                    <RefferalPopup
                        setIsReffaralCode={setIsReffaralCode}
                        verifyData={verifyData}
                        setIsLoginPopup={setIsLoginPopup}
                    />
                    :

                    isPassword ?
                        <OtpPopup
                            email={email}
                            setIsPassword={setIsPassword}
                            authName={authName}
                            setIsLoginPopup={setIsLoginPopup}
                            jwtToken={jwtToken}
                            setAuthName={setAuthName}
                        />
                        :
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center z-50 "
                            onClick={() => setIsLoginPopup(false)}
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
                                    onClick={() => setIsLoginPopup(false)}
                                    className="absolute right-4 top-4 text-[#6E6E6E] hover:text-white cursor-pointer transition duration-200"
                                />

                                <div className="mt-2 p-8">
                                    {authName !== 'login' ? (
                                        <>
                                            <h1 className="text-3xl font-bold text-center text-white">Create Account</h1>
                                            <p className="text-sm text-[#6E6E6E] text-center mt-1">Please enter your details</p>
                                        </>
                                    ) : (
                                        <>
                                            <h1 className="text-3xl font-bold text-center text-white">Welcome Back</h1>
                                            <p className="text-sm text-[#6E6E6E] text-center mt-1">Log in to your account</p>
                                        </>
                                    )}

                                    {/* Email */}
                                    <div className="mt-6">
                                        <label className="text-sm text-[#6E6E6E] mb-1 block">Email</label>
                                        <div className="flex items-center gap-3 bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                                            <MdOutlineEmail size={20} className="text-[#6E6E6E]" />
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-transparent text-sm text-white placeholder-[#6E6E6E] focus:outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-red-500 mt-1">{error}</p>
                                    </div>

                                    {/* Password or Invite Code */}
                                    {authName === 'login' ? (
                                        <div className="mt-4">
                                            <label className="text-sm text-[#6E6E6E] mb-1 block">Password</label>
                                            <div className="flex items-center justify-between bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                                                <div className="flex items-center gap-3 w-full">
                                                    <FiLock size={20} className="text-[#6E6E6E]" />
                                                    <input
                                                        type={!showPassword ? 'password' : 'text'}
                                                        placeholder="Password"
                                                        onChange={(e) => setPasswordInput(e.target.value)}
                                                        className="w-full bg-transparent text-sm text-white placeholder-[#6E6E6E] focus:outline-none"
                                                    />
                                                </div>
                                                {showPassword ? (
                                                    <BsEye
                                                        size={18}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-[#6E6E6E] cursor-pointer"
                                                    />
                                                ) : (
                                                    <BsEyeSlash
                                                        size={18}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-[#6E6E6E] cursor-pointer"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4">
                                            <label className="text-sm text-[#6E6E6E] mb-1 block">Invite code</label>
                                            <div className="flex items-center gap-3 bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                                                <FaUserFriends size={20} className="text-[#6E6E6E]" />
                                                <input
                                                    type="text"
                                                    placeholder="Invite code (optional)"
                                                    onChange={(e) => setRefferalCode(e.target.value)}
                                                    className="w-full bg-transparent text-sm text-white placeholder-[#6E6E6E] focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleOtpPopup}
                                        disabled={isDisable}
                                        className={`mt-6 w-full rounded-lg text-sm py-3 font-semibold transition ${isDisable
                                            ? 'bg-[#11265B] cursor-not-allowed'
                                            : 'bg-[#11265B] hover:bg-[#133D94]'
                                            } border border-[#0E43BD] text-white shadow-md`}
                                    >
                                        {!isDisable ? (authName === 'login' ? 'Login' : 'Sign up') : (
                                            <div className="flex justify-center py-2 items-center gap-2">
                                                <div className="loaderPopup"></div>
                                            </div>
                                        )}
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center justify-center my-5 text-sm text-[#6E6E6E]">
                                        <div className="flex-grow border-t border-[#333]"></div>
                                        <span className="px-3">Or continue with</span>
                                        <div className="flex-grow border-t border-[#333]"></div>
                                    </div>

                                    {/* Google Auth */}
                                    <div
                                        className="bg-white hover:opacity-90 text-sm py-3 px-4 flex items-center justify-center w-full rounded-lg cursor-pointer transition"
                                        onClick={() => handleGoogleAuth()}
                                    >
                                        <Image
                                            src={googleLogo}
                                            alt="Google Logo"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 object-contain"
                                        />
                                        <span className="text-[#1F1F1F] font-semibold ml-3">Continue with Google</span>
                                    </div>

                                    {/* Switch Auth */}
                                    <div className="text-sm mt-5 text-center text-white">
                                        {authName !== 'login' ? (
                                            <>
                                                Already have an account?{' '}
                                                <span
                                                    className="text-[#1F73FC] cursor-pointer hover:underline"
                                                    onClick={() => setAuthName('login')}
                                                >
                                                    Login
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                Don&apos;t have an account?{' '}
                                                <span
                                                    className="text-[#1F73FC] cursor-pointer hover:underline"
                                                    onClick={() => setAuthName('signup')}
                                                >
                                                    Sign up
                                                </span>
                                            </>
                                        )}
                                    </div>

                                </div>
                                <div className='text-xs border-t-[1px] border-t-[#404040] mt-3 text-center'>
                                    <div className='p-6'>
                                        By creating an account, you agree to moon pro&aspos;s Privacy Policy and Terms of Service
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

            }

        </>
    )
}

export default LoginPopup
