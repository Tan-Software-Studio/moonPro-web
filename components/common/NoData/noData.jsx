import { NoDataLogo } from '@/app/Images'
import Image from 'next/image'
import React from 'react'

const NoData = ({
    imageSrc,
    title,
    description,
    imageClass,
    titleClass,
    descriptionClass

}) => {
    return (
        <>
            <div className={`flex items-center justify-center   ${imageClass}`} style={{ maxWidth: "200px", maxHeight: "150px" }}>
                <Image
                    src={imageSrc || NoDataLogo}
                    alt="No Data Available" 
                    className="text-slate-400 object-contain md:w-[200px] sm:w-[180px] w-[120px] h-auto"
                />
            </div>
            <p className={`text-slate-400 text-lg mb-2 break-words break-all ${titleClass}`}>
                {title || "No data available"}
            </p>
            <p className={`text-slate-500 text-sm ${descriptionClass}`}>
                {description}
            </p>

        </>
    )
}

export default NoData
