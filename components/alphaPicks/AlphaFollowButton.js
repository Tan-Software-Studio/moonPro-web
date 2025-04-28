import { useDispatch } from "react-redux";
import { addAlphaFollowToDB } from "@/app/redux/alphaFollows/alphaFollowsData.js";

import toast from "react-hot-toast";
import clsx from "clsx";
import Image from "next/image";

const AlphaFollowButton = ({ groupParams, isFollowing, onUnfollow, icon = false, baseClass = `font-semibold text-[11px] leading-[15px] rounded py-2 px-8 border-[0.77px] transition-colors ease-in-out delay-200`, bgFollowColor = 'border-[#6CC4F4] text-white bg-black/25', bgUnFollowColor = 'border-green-500 text-white bg-green-500'}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!groupParams.walletAddress) {
        return toast.error("Please connect your wallet.", { position: "top-center" });
    }
    if (isFollowing) {
      onUnfollow(); // Open modal for confirmation
    } else {
      dispatch(addAlphaFollowToDB(groupParams)); // Directly add to Redux
    }
  };

  return (
    <button 
          className={clsx(
            `${baseClass}`,
            isFollowing
              ? `${bgUnFollowColor}`
              : `${bgFollowColor}`,
          )}
            onClick={(event) => {
                event.stopPropagation();
                handleClick()
            }}
        >
            {isFollowing ? `Following` : `Follow`}
            {icon &&
              <Image 
                src={icon}
                alt="Follow Icon"
                width={16}
                height={16}
              />
            }
        </button>
  );
};

export default AlphaFollowButton;