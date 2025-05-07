import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import OTPInput from "react-otp-input";
import RecoveryKey from "./RecoveryKey";
import axios from "axios";
import toast from "react-hot-toast";
import { setSolWalletAddress } from "@/app/redux/states";
import { useDispatch } from "react-redux";
import { FiLock } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";

const OtpPopup = ({
  setIsLoginPopup,
  authName,
  jwtToken,
  email,
  setAuthName,
}) => {
  const dispatch = useDispatch();
  const [recoveryKey, setRecoveryKey] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyData, setVerifyData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [otpError, setOtpError] = useState(" ");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [isInvalidOtp, setIsInvalidOtp] = useState(false);

  const handleClose = () => {
    setIsLoginPopup(false);
  };

  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  const handleVerify = async () => {
    const confirmPassword = confirmPasswordInput.trim();
    const password = passwordInput.trim();

    if (!otp) {
      setOtpError("Otp is required");
      return;
    }
    if (otp.length < 6) {
      setOtpError("Otp is not valid");
      return;
    }
    setOtpError("");
    if (authName != "login") {
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
        return;
      }
      if (!/[a-z]/.test(password)) {
        setPasswordError(
          "Password must include at least one lowercase letter."
        );
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setPasswordError(
          "Password must include at least one uppercase letter."
        );
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
      setPasswordError("");

      if (!confirmPassword) {
        setConfirmPasswordError("Confirm password is required");
        return;
      }
      if (confirmPassword != password) {
        setConfirmPasswordError(
          "New password and Confirm password should be same "
        );
        return;
      }
      setConfirmPasswordError("");
    }

    try {
      setIsDisable(true);
      const response = await axios.post(
        `${baseUrl}user/verify`,
        {
          otp: Number(otp),
          ...(authName != "login" && {
            password: password,
            confirmPassword: confirmPassword,
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      localStorage.setItem("token", response?.data?.data?.token);
      localStorage.setItem(
        "walletAddress",
        response?.data?.data?.user?.walletAddressSOL
      );

      setVerifyData(response?.data);

      if (response?.data?.statusCode === 200) {
        if (authName == "login") {
          setIsLoginPopup(false);
        } else {
          setRecoveryKey(true);
        }
      }
      dispatch(setSolWalletAddress());
      toast.success(response?.data?.message);
      setIsDisable(false);
      setIsInvalidOtp(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message);
      if (err?.response?.data?.message == "Invalid OTP.") {
        setIsInvalidOtp(true);
      }
      setIsDisable(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {recoveryKey && authName != "login" ? (
          <RecoveryKey
            verifyData={verifyData}
            setVerifyData={setVerifyData}
            setIsLoginPopup={setIsLoginPopup}
          />
        ) : (
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
              className="bg-[#141414]/90 backdrop-blur-lg border border-[#2A2A2A] rounded-2xl w-[400px] relative"
            >
              <IoMdClose
                size={22}
                onClick={handleClose}
                className="absolute right-4 top-4 text-[#6E6E6E] hover:text-white cursor-pointer transition duration-200"
              />

              <div className="mt-2  p-6">
                <h2 className="text-2xl font-semibold text-center text-white">
                  Confirmation code
                </h2>
                <div className="text-sm text-center mt-2 ">
                  We&apos;ve sent a verifaction code to {email}
                </div>
                <OTPInput
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
                    border: isInvalidOtp
                      ? "0.5px solid red"
                      : "1px solid #404040",
                    borderRadius: "8px",
                    outline: "none",
                    forcedColorAdjust: "#1F73FC",
                    transition: "border 0.2s ease-in-out",
                    animation: isInvalidOtp ? "shake 0.7s" : "none",
                  }}
                />
                <div className="text-xs text-center text-red-600 mt-0.5">
                  {otpError}
                </div>

                {authName != "login" && (
                  <div className="mt-4">
                    <label className="text-sm text-[#6E6E6E] mb-1 block">
                      Password
                    </label>
                    <div className="flex items-center justify-between bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                      <div className="flex items-center gap-3 w-full">
                        <FiLock size={20} className="text-[#6E6E6E]" />
                        <input
                          type={!showPassword ? "password" : "text"}
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
                    <div className="text-xs text-red-600 mt-0.5">
                      {passwordError}
                    </div>

                    <label className="text-sm text-[#6E6E6E] mt-2 mb-1 block">
                      Confirm password
                    </label>
                    <div className="flex items-center justify-between bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                      <div className="flex items-center gap-3 w-full">
                        <FiLock size={20} className="text-[#6E6E6E]" />
                        <input
                          type={!showPassword1 ? "password" : "text"}
                          placeholder="Confirm password"
                          onChange={(e) =>
                            setConfirmPasswordInput(e.target.value)
                          }
                          className="w-full bg-transparent text-sm text-white placeholder-[#6E6E6E] focus:outline-none"
                        />
                      </div>
                      {showPassword1 ? (
                        <BsEye
                          size={18}
                          onClick={() => setShowPassword1(!showPassword1)}
                          className="text-[#6E6E6E] cursor-pointer"
                        />
                      ) : (
                        <BsEyeSlash
                          size={18}
                          onClick={() => setShowPassword1(!showPassword1)}
                          className="text-[#6E6E6E] cursor-pointer"
                        />
                      )}
                    </div>
                    <div className="text-xs text-red-600 mt-0.5">
                      {confirmPasswordError}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={isDisable}
                  className={`mt-6 w-full rounded-lg text-sm py-3 font-semibold transition ${
                    isDisable
                      ? "bg-[#11265B] cursor-not-allowed"
                      : "bg-[#11265B] hover:bg-[#133D94]"
                  } border border-[#0E43BD] text-white shadow-md`}
                >
                  {!isDisable ? (
                    "Verify"
                  ) : (
                    <div className="flex cursor-not-allowed py-2 justify-center items-center gap-5">
                      <div className="loaderPopup"></div>
                    </div>
                  )}
                </button>

                {/* <div className='text-sm text-center mt-3 '>You can resend a new code in 60 seconds</div> */}
              </div>
              <div className="text-xs border-t-[1px] border-t-[#404040] mt-3 text-center">
                <div className=" p-4">
                  By creating an account, you agree to moon pro&aspos;s Privacy
                  Policy and Terms of Service
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OtpPopup;
