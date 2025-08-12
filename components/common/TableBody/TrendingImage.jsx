import Image from "next/image";
import React, { useState } from "react";

const TrendingImage = ({ name, address, url }) => {
  const [isImageError, setIsImageError] = useState(false);
  return isImageError ? (
    <div className="w-12 md:w-10 h-12 md:h-10 xl:w-12 xl:h-12 rounded-sm flex items-center justify-center bg-[#3b3b49] border border-[#1F73FC]">
      <span className="text-sm text-white uppercase text-center">
        {name?.toString()?.slice(0, 1) || "T"}
      </span>
    </div>
  ) : (
    <div className="!w-12 md:w-10 !h-12 !md:h-10 !xl:w-14 !xl:h-14 rounded-[4px] border border-[#1F73FC]">
      <Image
        src={`${url}/${address}.webp`}
        alt="Token"
        className="w-full h-full object-cover overflow-hidden"
        loading="lazy"
        width={50}
        height={50}
        onError={(e) => {
          setIsImageError(true);
        }}
        unoptimized
      />
    </div>
  );
};
export default TrendingImage;
