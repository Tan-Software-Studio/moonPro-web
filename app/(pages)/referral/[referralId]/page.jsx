"use client";
import {
  openCloseLoginRegPopup,
  setLoginRegPopupAuth,
  setreferralPopupAfterLogin,
  setSignupReferral,
} from "@/app/redux/states";
import ReferralPage from "@/components/referral/ReferralPage";
import { showToaster } from "@/utils/toaster/toaster.style";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function ReferralLogin({ params }) {
  const { referralId } = params;
  const userDetails = useSelector((state) => state?.userData?.userDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (userDetails?.email) {
        if (userDetails?.referredBy) {
          showToaster("Already referred.");
          dispatch(setreferralPopupAfterLogin(false));
        } else {
          dispatch(setSignupReferral(referralId));
          dispatch(setreferralPopupAfterLogin(true));
        }
      }
    } else {
      dispatch(setSignupReferral(referralId));
      dispatch(openCloseLoginRegPopup(true));
      dispatch(setLoginRegPopupAuth("signup"));
    }
  }, [userDetails]);
  return (
    <>
      <ReferralPage />
    </>
  );
}
