"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import OtpPopup from "./OtpPopup";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { openCloseLoginRegPopup } from "@/app/redux/states";
import { useDispatch } from "react-redux";
import { showToaster, showToasterSuccess } from "@/utils/toaster/toaster.style";

const PasswordPopup = ({
  setIsPassword,
  setIsLoginPopup,
  email,
  setAuthName,
}) => {
  const dispatch = useDispatch();
  const [otpPopup, setOtpPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [jwtToken, setJwtToken] = useState("");

  const handleClose = () => {
    setOtpPopup(false);
    setIsPassword(false);
    dispatch(openCloseLoginRegPopup(false));
  };
  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  const handleSignup = async () => {
    confirmPasswordInput.trim();
    const password = passwordInput.trim();
    if (password.length < 4) {
      showToaster("Password must be at least 4 characters long");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}user/signup`, {
        email: email.toLowerCase(),
        password: passwordInput,
        confirmPassword: confirmPasswordInput,
      });
      console.log(response);
      setJwtToken(response?.data?.data?.token);

      if (response?.data?.statusCode === 200) {
        setOtpPopup(true);
        showToasterSuccess(response?.data?.message);
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.statusCode === 405) {
        showToaster("User already exists please try to login");
        setTimeout(() => {
          setAuthName("login");
          setIsPassword(false);
        }, 1500);
      } else {
        showToaster(err?.response?.data?.message);
      }
    }
  };
  return (
    <>
      {otpPopup ? (
        <OtpPopup
          email={email}
          setOtpPopup={setOtpPopup}
          jwtToken={jwtToken}
          setJwtToken={setJwtToken}
          setIsPassword={setIsPassword}
          setIsLoginPopup={setIsLoginPopup}
        />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1F1F1F] border-[1px] border-[#404040] rounded-md shadow-lg w-[350px] "
          >
            <div className="p-4">
              <div
                onClick={handleClose}
                className="flex cursor-pointer  leading-none items-center justify-end"
              >
                <IoMdClose className="w-fit" />
              </div>
              <div className="flex  leading-none items-center justify-center">
                <h2 className="text-base text-center leading-none">
                  Create password
                </h2>
              </div>
              <div className="mt-4">
                <div className="text-sm ">Password</div>
                <div className=" border-[1px] bg-[#1F1F1F] py-2 px-2 mt-1 flex items-center justify-between rounded-md border-[#404040] ">
                  <input
                    type={!showPassword ? "password" : "text"}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className=" focus:outline-none text-sm w-full bg-[#1F1F1F]"
                    placeholder="Enter password"
                  />
                  {showPassword ? (
                    <FaEye
                      size={18}
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-fit cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                      size={18}
                      onClick={() => setShowPassword(!showPassword)}
                      className="w-fit cursor-pointer"
                    />
                  )}
                  {/* <FaEyeSlash size={18} className='w-fit cursor-pointer' /> */}
                </div>
                <div className=" border-[1px] bg-[#1F1F1F] py-2 px-2 mt-1 flex items-center justify-between rounded-md border-[#404040] ">
                  <input
                    type={!showPassword1 ? "password" : "text"}
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className=" focus:outline-none text-sm w-full bg-[#1F1F1F]"
                  />
                  {showPassword1 ? (
                    <FaEye
                      size={18}
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="w-fit cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                      size={18}
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="w-fit cursor-pointer"
                    />
                  )}
                  {/* <FaEyeSlash size={18} className='w-fit cursor-pointer' /> */}
                </div>
              </div>
              <button
                onClick={handleSignup}
                className="bg-[#1f73fc] text-sm py-2 flex items-center  w-full mt-3 rounded-md justify-center"
              >
                Continue
              </button>
            </div>
            <div className="text-xs border-t-[1px] border-t-[#404040] mt-3 text-center">
              <div className=" p-4">
                By creating an account, you agree to moon pro&aspos;s Privacy
                Policy and Terms of Service
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordPopup;
