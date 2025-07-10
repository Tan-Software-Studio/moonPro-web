"use client";

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoData from '@/components/common/NoData/noData';
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";


const PortfolioPage = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const portfolio = t("portfolio");
    const activeSolWalletAddress = useSelector(
        (state) => state?.userData?.activeSolanaWallet
    );

    useEffect(() => {
        const currentWallet = activeSolWalletAddress?.wallet;
        if (currentWallet) {
            router.replace(`/portfolio/${currentWallet}`);
        }
    }, [activeSolWalletAddress])
    return (
        <div className="flex flex-col h-[70vh] w-full items-center justify-center mt-5">
            <NoData
            title={portfolio?.loginRequired}
            description={portfolio?.pleaseLogin}
            />
        </div>
    )
}

export default PortfolioPage