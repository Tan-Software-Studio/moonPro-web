"use client";
import {
  openCloseLoginRegPopup,
  setLoginRegPopupAuth,
  setreferralPopupAfterLogin,
  setSignupReferral,
} from "@/app/redux/states";
import ReferralPage from "@/components/referral/ReferralPage";
import { showToaster } from "@/utils/toaster/toaster.style";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
export default function ReferralLogin({ params }) {
  const { referralId } = params;
  const dispatch = useDispatch();
  // const [referralForAlreadyLogin, setReferralForAlreadyLogin] = useState(false);
  const [referralData, setReferralData] = useState([]);
  const [referralIFromApi, setReferralIdFromApi] = useState([]);
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  );
  async function getReferrals() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    await axios({
      url: `${BASE_URL}user/getreferrals`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setReferralData(res?.data?.data?.referrals);
        setReferralIdFromApi(res?.data?.data?.referralId);
        if (!res?.data?.data?.referredBy) {
          dispatch(setreferralPopupAfterLogin(true));
        } else {
          showToaster("Already referred.");
          dispatch(setSignupReferral(null));
        }
      })
      .catch((err) => {
        console.log("🚀 ~ getReferrals ~ err:", err);
      });
  }

  useEffect(() => {
    if (solWalletAddress) {
      getReferrals();
    }
  }, [solWalletAddress]);

  useEffect(() => {
    const walletAddress = localStorage.getItem("walletAddress");
    if (referralId) {
      if (walletAddress) {
        dispatch(setSignupReferral(referralId));
      } else {
        // dispatch(setreferralPopupAfterLogin(false));
        dispatch(setSignupReferral(referralId));
        dispatch(openCloseLoginRegPopup(true));
        dispatch(setLoginRegPopupAuth("signup"));
      }
    }
  }, [referralId]);
  return (
    <>
      <ReferralPage
        referralData={referralData}
        referralId={referralIFromApi}
        solWalletAddress={solWalletAddress}
      />
    </>
  );
}
