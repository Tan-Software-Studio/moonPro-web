import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import OtpPopup from './OtpPopup';
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image';
import { googleLogo } from '@/app/Images';
import RecoveryKey from './RecoveryKey';

const LoginPopup = ({ setIsLoginPopup, authName, setAuthName }) => {


    const [isPassword, setIsPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState('')
    const [jwtToken, setJwtToken] = useState('')
    const [error, setError] = useState('')
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(false)
    const [verifyData, setVerifyData] = useState({})
    const [refferalCode, setRefferalCode] = useState('')
    const [email, setEmail] = useState('')

    const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
    console.log("🚀 ~ LoginPopup ~ baseUrl:", baseUrl)

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
        try {
            const response = await axios.post(`${baseUrl}${auth}`, {
                email: email.toLowerCase(),
                ...(authName === 'login' && { password: password }),
                ...(authName === 'signup' && { referralId })

            })
            console.log(response);
            setJwtToken(response?.data?.data?.token)

            if (response?.data?.statusCode === 200 || 201) {
                setIsPassword(true);
            }
            if (response?.data?.statusCode === 201) {
                toast.error("User was created but not verified")
            }

            toast.success(response?.data?.message)

        }
        catch (err) {
            console.error(err);
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
                    url: `${baseUrl}googleAuth`,
                    method: "post",
                    data: {
                        googleCode: codeResponse.code,
                    },
                })
                    .then((res) => {
                        localStorage.setItem('token', res?.data?.data?.token)
                        localStorage.setItem('walletAddress', res?.data?.data?.user?.walletAddressSOL)
                        setVerifyData(res?.data)

                        if (res?.data?.message === "Login successfull") {
                            setIsLoginPopup(false)
                        } else {
                            setIsGoogleSignIn(true)
                        }
                        toast.success(res?.data?.message)
                    })
                    .catch((err) => {
                        console.error(err );
                        toast.error(err?.message)
                        setIsGoogleSignIn(false)
                    });
            } catch (error) {
                console.error(error);
                toast.error(error?.message)
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
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setIsLoginPopup(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1F1F1F]  p-4 rounded-md shadow-lg w-[350px] "
                        >
                            <div
                                className='flex cursor-pointer  leading-none items-center justify-end'>
                                <IoMdClose
                                    onClick={() => setIsLoginPopup(false)}
                                    className='w-fit' />
                            </div>
                            <h2 className="text-base text-center leading-none">{authName == 'login' ? 'Login' : 'Sign up'}</h2>
                            <div>
                                <div className='text-sm text-[#6E6E6E]'>Email</div>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    className="w-full  border-[1px] border-[#404040] bg-[#1F1F1F] focus:outline-none text-sm p-2 rounded-md mt-1" placeholder="Enter your email"
                                />
                                <div className='text-xs text-red-600 mt-0.5'>{error}</div>
                                {authName == 'login' ?
                                    <>
                                        <div className='text-sm text-[#6E6E6E] mt-3'>Password</div>
                                        <div className=' border-[1px] bg-[#1F1F1F] py-2 px-2 mt-1 flex items-center justify-between rounded-md border-[#404040] '>
                                            <input
                                                type={!showPassword ? "password" : "text"}
                                                placeholder="Password"
                                                onChange={(e) => setPasswordInput(e.target.value)}
                                                className=" focus:outline-none text-sm w-full bg-[#1F1F1F]  "

                                            />
                                            {showPassword ?
                                                <FaEye size={18} onClick={() => setShowPassword(!showPassword)} className='w-fit cursor-pointer' />
                                                :
                                                <FaEyeSlash size={18} onClick={() => setShowPassword(!showPassword)} className='w-fit cursor-pointer' />
                                            }
                                            {/* <FaEyeSlash size={18} className='w-fit cursor-pointer' /> */}
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className='text-sm text-[#6E6E6E] mt-3'>Invite code</div>
                                        <input
                                            type="text"
                                            onChange={(e) => setRefferalCode(e.target.value)}
                                            className="w-full border-[1px] border-[#404040] bg-[#1F1F1F] focus:outline-none text-sm p-2 rounded-md mt-1" placeholder="Invite code (optional)"
                                        />
                                    </>
                                }
                            </div>
                            <button
                                onClick={handleOtpPopup}
                                className='bg-[#11265B] border-[1px] border-[#0E43BD] text-sm py-2 flex items-center  w-full mt-3 rounded-md justify-center'>
                                {authName == 'login' ? 'Login' : 'Sign up'}
                            </button>

                            <div className='text-sm text-[#6E6E6E] mt-3 text-center'>Or {authName == 'login' ? '' : 'Sign Up'}</div>



                            <div
                                className='bg-[#FFFFFF] hover:opacity-80 text-sm py-2 flex items-center justify-center w-full mt-3 rounded-md cursor-pointer'
                                onClick={() => handleGoogleAuth()}>
                                <Image
                                    src={googleLogo}
                                    alt="Google Logo"
                                    width={20}
                                    height={20}
                                    className='w-6 h-6 object-contain'
                                />
                                <div>
                                    <span className='text-[#1F1F1F] font-semibold text-sm ml-2'>Continue with Google</span>
                                </div>
                            </div> 

                            {authName != 'login' ?
                                <div className='text-xs mt-3 cursor-pointer text-center'>
                                    Already have an account?
                                    <span onClick={() => setAuthName('login')} className='text-[#1f73fc]' >
                                        Login
                                    </span>
                                </div>
                                :
                                <div className='text-xs mt-3 cursor-pointer text-center'>
                                    Don&apos;t have an account?
                                    <span onClick={() => setAuthName('signup')} className='text-[#1f73fc]'>
                                        Sign up
                                    </span>
                                </div>
                            }
                            <div className='text-xs mt-3 text-center'>
                                By creating an account, you agree to moon pro&apos;s Privacy Policy and Terms of Service
                            </div>
                        </div>
                    </div>
            }

        </>)
}

export default LoginPopup
