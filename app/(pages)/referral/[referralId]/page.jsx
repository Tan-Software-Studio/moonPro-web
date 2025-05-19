"use client";
import {
  openCloseLoginRegPopup,
  setLoginRegPopupAuth,
  setSignupReferral,
} from "@/app/redux/states";
import ReferralCodePopup from "@/components/Navbar/login/RefferalPopup";
import ReferralPage from "@/components/referral/ReferralPage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;
export default function ReferralLogin({ params }) {
  const { referralId } = params;
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [referralForAlreadyLogin, setReferralForAlreadyLogin] = useState(false);
  const [referralData, setReferralData] = useState([]);
  const [referralIFromApi, setReferralIdFromApi] = useState([]);
  const [referredBy, setReferredBy] = useState(null);
  const [uiRenderPopup, setUiRenderPopup] = useState(false);
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
        setReferredBy(res?.data?.data?.referredBy);
      })
      .catch((err) => {
        console.log("🚀 ~ getReferrals ~ err:", err);
      });
  }

  useEffect(() => {
    if (solWalletAddress) {
      getReferrals();
    }
    setUiRenderPopup(true);
  }, [solWalletAddress]);

  useEffect(() => {
    const walletAddress = localStorage.getItem("walletAddress");
    if (referralId) {
      if (walletAddress) {
        dispatch(setSignupReferral(referralId));
        setReferralForAlreadyLogin(true);
      } else {
        dispatch(setSignupReferral(referralId));
        dispatch(openCloseLoginRegPopup(true));
        dispatch(setLoginRegPopupAuth("signup"));
      }
    }
  }, [referralId]);
  return (
    <>
      {uiRenderPopup && (
        <>
          {!referredBy
            ? referralForAlreadyLogin && (
                <ReferralCodePopup
                  token={token}
                  onClose={() => {
                    setReferralForAlreadyLogin(false);
                  }}
                />
              )
            : toast.error("Invite code is already added.")}
          <ReferralPage
            referralData={referralData}
            referralId={referralIFromApi}
            solWalletAddress={solWalletAddress}
          />
        </>
      )}
    </>
  );
}
