import React from 'react'
import { BiSolidCopy } from "react-icons/bi";
import Image from "next/image";
import toast from "react-hot-toast";

const AlphaPicksNotificationPopUp = ({alphaNotification}) => {
  const copyAddress = (address) => {
    navigator?.clipboard?.writeText(address);
    return toast.success ("Copied To Clipboard.", { position: "top-center", duration: 2000 });
  };
  return (
    <div className="shadow-xl p-3 bg-[#1c1d24] rounded-md border border-gray-700">
            <div className="w-full h-full flex gap-2">
                <div className="flex gap-4 items-center">
                    {alphaNotification?.groupImage ? (
                    <Image
                        src={alphaNotification?.groupImage}
                        alt={'Alpha Image'}
                        width={56}
                        height={56}
                        className="rounded-md w-14 h-14 border border-[#6CC4F4]"
                    />
                    ) : (
                    <p className="w-14 h-14 bg-white rounded-md border border-[#6CC4F4] flex items-center justify-center text-black text-3xl font-extrabold">
                        {alphaNotification?.channelName?.charAt(0).toUpperCase() || alphaNotification?.groupName?.charAt(0).toUpperCase()}
                    </p>
                    )}
                    <div className="flex flex-col">
                        <p className="flex items-center gap-1">
                            <p className="text-base font-semibold text-[#6CC4F4]">
                                {alphaNotification?.channelName || alphaNotification?.groupName}
                            </p>
                            {alphaNotification?.channelName &&
                                <span className="text-xs">
                                    by: @{alphaNotification?.userName}
                                </span>
                            }
                        </p>
                        <div className="flex gap-3">
                            <p className="text-xs font-semibold">
                                Price: <span className="text-[#2DC24E] font-normal">${alphaNotification?.price}</span>
                            </p>
                            <p className="text-xs font-semibold">
                                MC: <span className="text-[#2DC24E] font-normal">${alphaNotification?.mc}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-xs tracking-wider font-normal sm:truncate md:block hidden">
                                {alphaNotification?.address.slice(0, 4)}...{alphaNotification?.address.slice(-4)}
                            </p>
                        <span
                            className={`${alphaNotification?.address ? `block` : `hidden`}`}
                            onClick={() => copyAddress(alphaNotification?.address)}
                        >
                            <BiSolidCopy
                                size={14}
                                className="ml-2 cursor-pointer"
                            />
                        </span>
                        </div>
                    </div>
                    <button className="font-semibold shrink-0 text-sm rounded-lg p-2 border-[0.77px] border-[#6CC4F4] text-white hover:text-black bg-black/25 hover:bg-[#6CC4F4] transition-colors ease-in-out delay-200">
                        Quick Buy
                    </button>
                </div>
            </div>
        </div>
  )
}

export default AlphaPicksNotificationPopUp