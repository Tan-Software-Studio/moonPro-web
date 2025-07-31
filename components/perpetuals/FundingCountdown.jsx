import React, { useEffect, useState } from "react";

function FundingCountdown({ nextFundingTime }) {
    
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(nextFundingTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeRemaining(nextFundingTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [nextFundingTime]);

    return (
        <div className="text-white text-sm">
            <p className="font-semibold">
                {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
            </p>
        </div>
    );
}

function getTimeRemaining(nextFundingTime) {
    const now = Date.now();
    const diff = Math.max(nextFundingTime - now, 0); // avoid negative time

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);



    return { hours, minutes, seconds };
}

export default FundingCountdown;
