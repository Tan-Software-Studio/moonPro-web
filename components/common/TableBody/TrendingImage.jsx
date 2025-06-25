import Image from 'next/image';
import React, { memo, useState } from 'react'

const TrendingImage = memo(({ name, address, url }) => {
    const [isImageError, setIsImageError] = useState(false)
    return (
        isImageError ? (
            <div className="w-12 md:w-10 h-12 md:h-10 xl:w-14 xl:h-14 rounded-sm flex items-center justify-center bg-[#3b3b49] border border-[#1F73FC]">
                <span className="text-sm text-white uppercase text-center">
                    {name?.toString()?.slice(0, 1) || "T"}
                </span>
            </div>
        ) : (
            <Image
                src={`${url}/${address}.webp`}
                alt="Token"
                className="w-12 md:w-10 h-12 md:h-10 xl:w-14 xl:h-14 rounded-[4px] border border-[#1F73FC]"
                loading="lazy"
                onError={(e) => {
                    setIsImageError(true);
                }}
            />
        )
    )
})

TrendingImage.displayName = 'TrendingImage'
export default TrendingImage