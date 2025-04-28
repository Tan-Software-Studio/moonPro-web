"use client";

import { useState, useEffect } from "react";

export const WalletCreatedAt = ({ createdAt }) => {
    const [relativeTime, setRelativeTime] = useState("Loading...");

    useEffect(() => {
        if (!createdAt) return; 

        setRelativeTime(getRelativeTime(createdAt));

        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(createdAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [createdAt]); // Ye sirf tab chalega jab createdAt available hoga

    return <span>{relativeTime}</span>;
};

// Function to Calculate Relative Time
const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Unknown"; // Agar timestamp undefined hai to return "Unknown"

    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 365) return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
};
