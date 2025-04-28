/* eslint-disable @next/next/no-img-element */
"use client";;
import { cn } from "@/lib/utils";

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls
}) => {
  return (
    (<div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <a
          key={index}
          // href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer">
          <img
            key={index}
            className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800"
            src={url.imageUrl}
            width={28}
            height={28}
            alt={`Avatar ${index + 1}`} />
        </a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <a
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-black text-center text-[8px] font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
          // href=""
        >
          +{numPeople}
        </a>
      )}
    </div>)
  );
};

export default AvatarCircles;