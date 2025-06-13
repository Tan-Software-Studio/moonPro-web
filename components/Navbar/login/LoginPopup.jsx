"use client";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import OtpPopup from "./OtpPopup";
import axios from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { googleLogo, phantom, phantompurple } from "@/app/Images";
import RecoveryKey from "./RecoveryKey";
import {
  openCloseLoginRegPopup,
  setLoginRegPopupAuth,
  setreferralPopupAfterLogin,
  setSolWalletAddress,
} from "@/app/redux/states";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { usePhantomWallet } from "@/app/providers/PhantomWalletProvider";
import { showToaster, showToasterSuccess } from "@/utils/toaster/toaster.style";

const MobilePhantomNotification = ({ onClose, onOpenPhantom }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-4 right-4 z-[80] bg-[#1e1e1efb] text-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-[#1e1e1e] rounded-full p-1 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">You must use the Phantom browser to sign in on mobile with Phantom</p>
            <button
              onClick={onOpenPhantom}
              className="mt-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Open in Phantom
            </button>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-700 transition-colors">
          <IoMdClose size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const ConnectionFailureNotification = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-20 left-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-red-600 rounded-full p-1 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <IoMdClose size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const LoginPopup = ({ authName }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPassword, setIsPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [error, setError] = useState("");
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const [verifyData, setVerifyData] = useState({});
  const [refferalCode, setRefferalCode] = useState("");
  const [email, setEmail] = useState("");
  const [isDisable, setIsDisable] = useState(false);

  const [showMobileNotification, setShowMobileNotification] = useState(false);
  const [showFailureNotification, setShowFailureNotification] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");

  const { t } = useTranslation();
  const navbar = t("navbar");

  const {
    connectWallet,
    signMessage,
    connected,
    publicKey,
    connecting,
    isInstalled,
    isMobile,
    isInPhantomBrowser,
    generatePhantomDeepLink,
  } = usePhantomWallet();

  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
  const referralIdFromLink = useSelector((state) => state?.AllStatesData?.referralForSignup);
  const isRegLoginPopup = useSelector((state) => state?.AllStatesData?.isRegLoginPopup);

  const handleOtpPopup = async () => {
    const trimmedEmail = email.trim();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (trimmedEmail === "") {
      setError(navbar?.loginPopup?.enterEmail);
      return;
    }
    if (!gmailRegex.test(trimmedEmail)) {
      setError(navbar?.loginPopup?.validEmail);
      return;
    } else {
      setError("");
    }

    const auth = authName == "login" ? "login" : "signup";
    const password = passwordInput.trim();
    const referralId = refferalCode.trim();
    if (authName == "login") {
      if (!password) {
        showToaster(navbar?.loginPopup?.enterPassword);
        return;
      }
    }
    try {
      setIsDisable(true);
      const response = await axios.post(`${baseUrl}user/${auth}`, {
        email: email.toLowerCase(),
        ...(authName === "login" && { password: password }),
        ...(authName === "signup" && { referralId }),
      });
      setJwtToken(response?.data?.data?.token);

      if (response?.data?.statusCode === 200 || 201) {
        setIsPassword(true);
        setIsDisable(false);
      }
      showToasterSuccess(response?.data?.message);
    } catch (err) {
      console.error(err);
      setIsDisable(false);
      if (err?.response?.data?.message === "User already register.") {
        showToaster("User already exists please try to login");
        setTimeout(() => {
          dispatch(setLoginRegPopupAuth("login"));
        }, 1500);
      } else {
        showToaster(err?.response?.data?.message);
      }
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        await axios({
          url: `${baseUrl}user/googleAuth`,
          method: "post",
          data: {
            googleCode: codeResponse.code,
            inviteCode: refferalCode || null,
          },
        })
          .then((res) => {
            localStorage.setItem("token", res?.data?.data?.token);
            localStorage.setItem("walletAddress", res?.data?.data?.user?.walletAddressSOL);
            setVerifyData(res?.data);

            if (res?.data?.message === "Login successfull") {
              if (res?.data?.data?.user?.referredBy === null) {
                dispatch(setreferralPopupAfterLogin(true));
              }
            } else {
              setIsGoogleSignIn(true);
            }
            dispatch(openCloseLoginRegPopup(false));
            dispatch(setSolWalletAddress());
            showToasterSuccess(res?.data?.message);
            router.push("/trending");
          })
          .catch((err) => {
            console.error(err);
            showToaster(err?.message);
            setIsGoogleSignIn(false);
          });
      } catch (error) {
        console.error(error);
        showToaster(error?.message);
        dispatch(setreferralPopupAfterLogin(false));
        setIsGoogleSignIn(false);
      }
    },
  });

  const handlePhantomConnect = async () => {
    setShowMobileNotification(false);
    setShowFailureNotification(false);

    if (isMobile && !isInPhantomBrowser) {
      setShowMobileNotification(true);
      return;
    }

    if (!isMobile && !isInstalled) {
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      const connectResult = await connectWallet();

      if (connectResult.needsPhantomBrowser) {
        setShowMobileNotification(true);
        return;
      }

      if (!connectResult.success) {
        setFailureMessage(connectResult.error || "Failed to connect to Phantom");
        setShowFailureNotification(true);
        return;
      }

      const message = `By signing, you agree to Nexapro's Terms of Use & Privacy Policy.\n\nNonce: ${Date.now()}`;

      try {
        const signResult = await signMessage(message, connectResult.phantomInstance);

        const response = await axios.post(`${baseUrl}user/phantomLogin`, {
          walletAddress: connectResult.publicKey,
          signature: signResult.signature,
          message: message,
          inviteCode: refferalCode || null,
        });

        if (
          response?.data?.message === "Login successfull" ||
          response?.data?.message === "User registered successfully."
        ) {
          localStorage.setItem("token", response?.data?.data?.token);
          localStorage.setItem("walletAddress", response?.data?.data?.user?.walletAddressSOL);

          dispatch(openCloseLoginRegPopup(false));
          dispatch(setSolWalletAddress());
          showToasterSuccess(response?.data?.message || "Wallet connected successfully!");
          router.push("/trending");
        }
      } catch (signError) {
        console.error("Signature error:", signError);
        setFailureMessage("Failed to sign message. Please try again.");
        setShowFailureNotification(true);
      }
    } catch (error) {
      console.error("Phantom connection error:", error);
      setFailureMessage("Failed to connect wallet. Please try again.");
      setShowFailureNotification(true);
    }
  };

  const handleOpenPhantom = () => {
    const phantomUrl = generatePhantomDeepLink();
    setTimeout(() => {
      window.location.href = phantomUrl;
    }, 500);
  };

  const getPhantomButtonText = () => {
    if (connecting) return "Connecting...";
    if (isMobile && !isInPhantomBrowser) return "Connect with Phantom";
    if (!isMobile && !isInstalled) return "Install Phantom";
    return "Connect with Phantom";
  };

  useEffect(() => {
    if (referralIdFromLink) {
      setRefferalCode(referralIdFromLink);
    }
  }, [referralIdFromLink]);

  useEffect(() => {
    if (showMobileNotification) {
      const timer = setTimeout(() => {
        setShowMobileNotification(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showMobileNotification]);

  useEffect(() => {
    if (showFailureNotification) {
      const timer = setTimeout(() => {
        setShowFailureNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showFailureNotification]);

  return (
    <>
      {showMobileNotification && (
        <MobilePhantomNotification onClose={() => setShowMobileNotification(false)} onOpenPhantom={handleOpenPhantom} />
      )}

      {showFailureNotification && (
        <ConnectionFailureNotification message={failureMessage} onClose={() => setShowFailureNotification(false)} />
      )}

      {isPassword ? (
        <OtpPopup email={email} setIsPassword={setIsPassword} authName={authName} jwtToken={jwtToken} />
      ) : (
        isRegLoginPopup && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#1E1E1ECC] flex items-center justify-center"
            onClick={() => dispatch(openCloseLoginRegPopup(false))}
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
                onClick={() => dispatch(openCloseLoginRegPopup(false))}
                className="absolute right-4 top-4 text-[#6E6E6E] hover:text-white cursor-pointer transition duration-200"
              />

              <div className="mt-2 p-8">
                {authName !== "login" ? (
                  <>
                    <h1 className="text-3xl font-bold text-center text-white">{navbar?.loginPopup?.creatAccount}</h1>
                    <p className="text-sm text-[#6E6E6E] text-center mt-1">{navbar?.loginPopup?.creatAccountDesc}</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-center text-white">{navbar?.loginPopup?.welcomeBack}</h1>
                    <p className="text-sm text-[#6E6E6E] text-center mt-1">{navbar?.loginPopup?.loginInAccouont}</p>
                  </>
                )}

                {/* Email */}
                <div className="mt-6">
                  <label className="text-sm text-[#6E6E6E] mb-1 block">{navbar?.loginPopup?.email}</label>
                  <div className="flex items-center gap-3 bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                    <MdOutlineEmail size={20} className="text-[#6E6E6E]" />
                    <input
                      type="email"
                      placeholder={navbar?.loginPopup?.enterEmailPlace}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder-[#6E6E6E] focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-red-500 mt-1">{error}</p>
                </div>

                {/* Password or Invite Code */}
                {authName === "login" ? (
                  <div className="mt-4">
                    <label className="text-sm text-[#6E6E6E] mb-1 block">{navbar?.loginPopup?.password}</label>
                    <div className="flex items-center justify-between bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                      <div className="flex items-center gap-3 w-full">
                        <FiLock size={20} className="text-[#6E6E6E]" />
                        <input
                          type={!showPassword ? "password" : "text"}
                          placeholder={navbar?.loginPopup?.password}
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
                    <label className="text-sm text-[#6E6E6E] mb-1 block">{navbar?.loginPopup?.inviteCode}</label>
                    <div className="flex items-center gap-3 bg-[#1F1F1F] border border-[#333] px-4 py-3 rounded-lg transition focus-within:border-[#1F73FC]">
                      <FaUserFriends size={20} className="text-[#6E6E6E]" />
                      <input
                        type="text"
                        placeholder={navbar?.loginPopup?.inviteCodePlace}
                        value={refferalCode}
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
                  className={`mt-6 w-full rounded-lg text-sm py-3 font-semibold transition ${
                    isDisable ? "bg-[#11265B] cursor-not-allowed" : "bg-[#11265B] hover:bg-[#133D94]"
                  } border border-[#0E43BD] text-white shadow-md`}
                >
                  {!isDisable ? (
                    authName === "login" ? (
                      "Login"
                    ) : (
                      "Sign up"
                    )
                  ) : (
                    <div className="flex justify-center py-2 items-center gap-2">
                      <div className="loaderPopup"></div>
                    </div>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center justify-center my-5 text-sm text-[#6E6E6E]">
                  <div className="flex-grow border-t border-[#333]"></div>
                  <span className="px-3"> {navbar?.loginPopup?.continueWith}</span>
                  <div className="flex-grow border-t border-[#333]"></div>
                </div>

                {/* Google Auth */}
                <div
                  className="bg-white hover:opacity-90 text-sm py-3 px-4 flex items-center justify-center w-full rounded-lg cursor-pointer transition mb-3"
                  onClick={() => handleGoogleAuth()}
                >
                  <Image src={googleLogo} alt="Google Logo" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="text-[#1F1F1F] font-semibold ml-3">{navbar?.loginPopup?.continueGoogle}</span>
                </div>

                {/* Phantom Auth */}
                <div
                  className={`bg-white hover:opacity-90 text-sm py-3 px-4 flex items-center justify-center w-full rounded-lg cursor-pointer transition ${
                    connecting ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  onClick={handlePhantomConnect}
                  disabled={connecting}
                >
                  <Image
                    src={phantompurple}
                    alt="Phantom Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-[#1F1F1F] font-semibold ml-3">{getPhantomButtonText()}</span>
                </div>

                {/* Switch Auth */}
                <div className="text-sm mt-5 text-center text-white">
                  {authName !== "login" ? (
                    <>
                      {navbar?.loginPopup?.haveaccount}{" "}
                      <span
                        className="text-[#1F73FC] cursor-pointer hover:underline"
                        onClick={() => dispatch(setLoginRegPopupAuth("login"))}
                      >
                        {navbar?.loginPopup?.login}
                      </span>
                    </>
                  ) : (
                    <>
                      {navbar?.loginPopup?.dontAccount}{" "}
                      <span
                        className="text-[#1F73FC] cursor-pointer hover:underline"
                        onClick={() => dispatch(setLoginRegPopupAuth("signup"))}
                      >
                        {navbar?.loginPopup?.signup}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs border-t-[1px] border-t-[#404040] mt-3 text-center">
                <div className="p-6">{navbar?.loginPopup?.byCreating}</div>
              </div>
            </motion.div>
          </motion.div>
        )
      )}
    </>
  );
};

export default LoginPopup;
