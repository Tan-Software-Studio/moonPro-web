"use client";

import React, { useState } from "react";
import { IoMdDoneAll } from "react-icons/io";
import Image from "next/image";
import Copy from "../../../public/assets/RecentCalls/Copy.svg";

const CopyButton = ({ textToCopy, imageSize = 14 }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = (textToCopy) => {
    navigator?.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <span
      className={`${textToCopy ? "block" : "hidden"} shrink-0`}
      onClick={() => copyAddress(textToCopy)}
    >
      {copied ? (
        <IoMdDoneAll size={imageSize} className="text-[#3f756d] cursor-pointer" />
      ) : (
        <Image
          src={Copy}
          alt="Copy Icon"
          width={imageSize}
          height={imageSize}
          className="cursor-pointer"
        />
      )}
    </span>
  );
};

export default CopyButton;
