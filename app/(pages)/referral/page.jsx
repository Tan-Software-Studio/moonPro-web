"use client";
import ReferralPage from "@/components/referral/ReferralPage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

export default function ReferralMainPage() {
  const [referralData, setReferralData] = useState([]);
  const [referralId, setReferralId] = useState([]);
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
        setReferralId(res?.data?.data?.referralId);
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
  return (
    <>
      <ReferralPage
        referralData={referralData}
        referralId={referralId}
        solWalletAddress={solWalletAddress}
      />
    </>
  );
}
