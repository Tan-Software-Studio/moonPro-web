"use client";
import Image from 'next/image';
import React, { memo, useState } from 'react'

const MemescopeImages = memo(({ showCircle, index, address, symbol, base_url }) => {
    const [isImage, setIsImage] = useState(false);

    return (
        isImage ? <div className={`absolute inset-0 m-auto flex items-center justify-center w-[64px] h-[64px] bg-[#3b3b49] object-cover ${showCircle ? "rounded-full" : ""
            }`}>
            <span className="text-white uppercase text-center text-xl">
                {symbol?.charAt(0) || "T"}
            </span>
        </div> :
            <Image
                key={index + 1}
                src={`${base_url}/${address}.webp`}
                className={`absolute inset-0 m-auto w-[64px] h-[64px] object-cover ${showCircle ? "rounded-full" : ""
                    }`}
                width={64}
                height={64}
                alt="Profile"
                loading="lazy"
                onError={(e) => {
                    setIsImage(true);
                }}
            />
    )
})

MemescopeImages.displayName = 'MemescopeImages';
export default MemescopeImages

