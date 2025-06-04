/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";
import { FaGem } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash, FaRegStar } from "react-icons/fa";
import { IoPieChartOutline } from "react-icons/io5";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import axios from "axios";
import Image from "next/image";
import { nftImg, nftImg2, nftImg3, nftImg4, nftImg5, NoDataFish } from "@/app/Images";
import { useDispatch, useSelector } from "react-redux";
import { token } from "@/utils/tradingViewChartServices/constant";
import toast from "react-hot-toast";
import { decimalConvert } from "@/utils/basicFunctions";
import RefPopup from "./RefPopup";
import { RiLinkM } from "react-icons/ri";
import { SlUserFollow } from "react-icons/sl";
import { openCloseLoginRegPopup } from "@/app/redux/states";
import { FaAngleDown } from "react-icons/fa6";

const ReferralPage = () => {
  const nftImages = [nftImg, nftImg2, nftImg3, nftImg4, nftImg5];

  const URL_LINK = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);
  const [copied3, setCopied3] = useState(false);
  const [copiedRef1, setCopiedRef1] = useState(false);
  const [copiedRef2, setCopiedRef2] = useState(false);
  const [refData, setRefData] = useState([]);
  const [selectedTier, setSelectedTier] = useState(1);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [hideEmail, setHideEmail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const progress = 100;
  const tierKey = selectedTier === 1 ? "firstTier" : selectedTier === 2 ? "secondTier" : "thirdTier";

  const rewardPercentage =
    selectedTier === 1
      ? refData?.user?.referealRewardsFirstTierPer
      : selectedTier === 2
      ? refData?.user?.referealRewardsSecondTierPer
      : refData?.user?.referealRewardsThirdTierPer;

  const tierData = refData?.referrals?.[tierKey] || [];

  const [addClaimed, setAddClaimed] = useState(0);
  const [rendomImg, setRendomImg] = useState(nftImg);

  const solWalletAddress = useSelector((state) => state?.AllStatesData?.solWalletAddress);

  const shortenAddress = (address) => {
    if (!address || address.length < 8) return address || "...";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getUserDisplayInfo = (user) => {
    if (user?.email === "phantom@phantom.com" && user?.phantomAddress) {
      return {
        displayText: shortenAddress(user.phantomAddress),
        isPhantomAddress: true,
      };
    }
    else if (user?.phantomAddress) {
      return {
        displayText: shortenAddress(user.phantomAddress),
        isPhantomAddress: true,
      };
    }
    else {
      return {
        displayText: user?.email || "N/A",
        isPhantomAddress: false,
      };
    }
  };

  const getReferralDisplayInfo = (referral) => {
    if (referral?.email === "phantom@phantom.com" && referral?.phantomAddress) {
      return shortenAddress(referral.phantomAddress);
    } else if (referral?.phantomAddress) {
      return shortenAddress(referral.phantomAddress);
    } else {
      return referral?.email || "N/A";
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("Please Login");
      }
      const res = await axios.get(`${URL_LINK}user/get3TierRefferals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responce = res.data.data;
      setRefData(responce);
    } catch (e) {
      console.log("🚀 ~ fetchData ~ error:", e);
    }
  };

  const handleWithdrawClick = () => {
    const tokenInStorage = localStorage.getItem("token");
    if (solWalletAddress && tokenInStorage) {
      setShowWithdrawPopup(true);
    } else {
      return dispatch(openCloseLoginRegPopup(true));
    }
  };

  // date time ago
  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}mo`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }

  const handleCopy1 = (ref) => {
    navigator.clipboard.writeText(`https://moonpro.wavebot.app/referral/${ref}`);
    setCopiedRef1(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopiedRef1(false), 2000);
  };

  const handleCopy2 = (ref) => {
    navigator.clipboard.writeText(`https://moonpro.wavebot.app/referral/${ref}`);
    setCopiedRef2(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopiedRef2(false), 2000);
  };

  const handleCopy3 = () => {
    navigator.clipboard.writeText(solWalletAddress);
    setCopied3(true);
    toast.success("Wallet address copied!");
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageURL(imageUrl);
    }
  };

  useEffect(() => {
    const randomImage = nftImages[Math.floor(Math.random() * nftImages.length)];
    setRendomImg(randomImage);
    if (solWalletAddress) {
      fetchData();
    }
  }, [solWalletAddress]);

  const userDisplayInfo = getUserDisplayInfo(refData?.user);

  return (
    <>
      <div className=" text-white py-6 md:px-6 px-3  rounded-2xl space-y-6 overflow-y-auto h-[90vh]">
        {/* User Header */}
        <div className="flex md:flex-row flex-col items-center md:items-start gap-4 w-full">
          {/* Image */}
          <div
            className={`w-20 h-20 min-w-[3.5rem] flex justify-center items-center font-bold text-[30px] rounded-md bg-yellow-500 overflow-hidden  relative`}
          >
            {userDisplayInfo.displayText?.[0]?.toUpperCase() || "U"}
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col items-center md:items-start w-full">
            {/* Top row: username, points, icons */}
            <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between w-full gap-2 md:gap-0 mt-2">
              <div className="flex gap-2 items-center">
                <div onClick={handleCopy3} className="font-semibold hover:text-blue-400 cursor-pointer">
                  {shortenAddress(token ? solWalletAddress : "")}
                </div>
              </div>

              <div>
                {solWalletAddress && (
                  <div
                    onClick={() => handleCopy1(refData?.user?.referralId)}
                    className="flex items-center gap-1 cursor-pointer text-sm group"
                  >
                    <RiLinkM
                      size={18}
                      className="text-[#a0a4b8] group-hover:text-white transition-colors duration-200"
                    />
                    <span className="text-[#a0a4b8]">{refData?.user?.referralId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <p className="tracking-wider text-sm">{hideEmail ? "******" : userDisplayInfo.displayText}</p>
              <div className="cursor-pointer" onClick={() => setHideEmail(!hideEmail)}>
                {hideEmail ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-center text-xs text-gray-400">
          {/* Left side: Level Info */}
          <div className="flex items-start gap-1 sm:items-center flex-wrap tracking-wider">
            <MdOutlineKeyboardDoubleArrowUp className="text-blue-500 mt-[2px]" size={16} />
            <span className="text-[#cdced4]">Next Level:</span>
            <span className="font-medium text-blue-500">2.5X Rewards rate for Points and SOL</span>
          </div>

          {/* Right side: Progress Info */}
          <div className="flex items-start gap-1 sm:items-center flex-wrap tracking-wider">
            <FaGem className="text-blue-500 mt-[2px]" size={16} />
            <span className="text-[#a0a4b8]">{"You're almost there! Trade 20 SOL to reach"}</span>
            <span className="text-white font-medium">Silver</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level Card */}
          <div className=" bg-[#191919]  rounded-xl p-4 space-y-2">
            {/* <div className="text-sm text-orange-400 tracking-wider">
              🥉 Bronze
            </div>
            <div className="text-2xl font-bold  flex items-center gap-2">
              2X Rewards{" "}
              <span className="text-blue-500">
                <FaRegStar className="text-blue-500" size={25} />
              </span>
            </div> */}
            <div className="flex items-center justify-center">
              <div className="text-base mt-12 text-gray-400">Coming soon..</div>
            </div>
          </div>

          {/* SOL Earned */}
          <div className=" bg-[#191919]  rounded-xl p-4">
            <div className="text-sm text-[rgb(200,201,209)] flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 tracking-wider">
                <HiOutlineCurrencyDollar className="text-blue-500" size={22} />
                SOL Earned
              </div>
              <button
                onClick={handleWithdrawClick}
                className="lg:py-2 md:py-2 py-2 lg:px-3 md:px-2 px-3 bg-blue-500 rounded-md hover:bg-blue-700 tracking-wider"
              >
                Claim
              </button>
            </div>
            <div className="text-2xl font-thin pt-2 tracking-wider">
              {refData?.totalEarningInSol > 0 ? decimalConvert(refData?.totalEarningInSol) : 0} SOL
            </div>

            <div className="text-sm text-[#a0a4b8] tracking-wider">
              Claimed {((Number(refData?.user?.totalClaimed) || 0) + (Number(addClaimed) || 0)).toFixed(5)} SOL
            </div>
            <div className="text-sm text-[#a0a4b8] tracking-wider">
              Available to claim{" "}
              {(
                (Number(refData?.totalEarningInSol) || 0) -
                (Number(refData?.user?.totalClaimed) || 0) -
                (Number(addClaimed) || 0)
              ).toFixed(5)}{" "}
              SOL
            </div>
          </div>

          {/* Points Breakdown */}
          <div className=" bg-[#191919]  rounded-xl p-4">
            {/* <div className="text-sm text-[rgb(200,201,209)] flex items-center gap-2 tracking-wider">
              <IoPieChartOutline className="text-blue-500" size={22} />
              Points Breakdown
            </div>
            <div className="flex flex-col gap-1 text-sm mt-2 pt-1.5">
              <div className="text-[#a0a4b8] tracking-wider">
                Trading <span className="float-right text-[#a0a4b8]">0</span>
              </div>
              <div className="text-[#a0a4b8] tracking-wider">
                Referrals <span className="float-right text-[#a0a4b8]">0</span>
              </div>
              <div className="text-[#a0a4b8] tracking-wider">
                Quests <span className="float-right text-[#a0a4b8]">0</span>
              </div>
            </div> */}
            <div className="flex items-center justify-center">
              <div className="text-base mt-12 text-gray-400">Coming soon..</div>
            </div>
          </div>
        </div>

        {/* Referral Table */}
        <div className="bg-[#191919]  rounded-t-xl ">
          <div className="text-white text-sm">
            {/* Header */}
            <div className="flex justify-between border-b border-[#2c2c34] px-4 py-2 overflow-x-auto whitespace-nowrap">
              <div className="flex gap-2 items-center flex-shrink-0">Referrals</div>

              <div className="flex gap-3 items-center">
                <div>
                  {solWalletAddress && (
                    <div
                      onClick={() => handleCopy2(refData?.user?.referralId)}
                      className="flex items-center gap-1 cursor-pointer text-[14px] group"
                    >
                      <RiLinkM
                        size={18}
                        className="text-[#a0a4b8] group-hover:text-white transition-colors duration-200"
                      />
                      <span className="text-[#a0a4b8]">{refData?.user?.referralId}</span>
                    </div>
                  )}
                </div>
                <div className="flex relative items-center gap-3 text-sm text-gray-400 flex-shrink-0 border-none focus:outline-none focus:ring-0">
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(Number(e.target.value))}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded border-none focus:outline-none focus:ring-0 cursor-pointer appearance-none pr-8 "
                  >
                    <option className="bg-black text-white cursor-pointer" value={1}>
                      1 Tier
                    </option>
                    <option className="bg-black text-white cursor-pointer" value={2}>
                      2 Tier
                    </option>
                    <option className="bg-black text-white cursor-pointer" value={3}>
                      3 Tier
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
                    <FaAngleDown />
                  </div>
                </div>

                <div className="flex justify-center items-center gap-1">
                  <SlUserFollow className="text-blue-500" /> <span className="text-[#89888e]">{tierData.length}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-[#2c2c34] rounded-b-lg text-left text-sm  border-collapse">
                <thead className="text-gray-500 border-b border-[#2c2c34]">
                  <tr>
                    <th className="px-4 py-2 whitespace-nowrap text-blue-500">Email/Wallet</th>
                    <th className="px-4 py-2 whitespace-nowrap text-blue-500">Date Joined</th>
                    <th className="px-4 py-2 whitespace-nowrap text-blue-500">SOL Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {tierData.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-gray-400 py-4">
                        <div className="flex flex-col w-full items-center justify-center mt-5">
                          <div className="text-4xl mb-2">
                            <Image
                              src={NoDataFish}
                              alt="No Data Available"
                              width={200}
                              height={100}
                              className="rounded-lg"
                            />
                          </div>
                          <h1 className="text-[#89888e] text-lg">No Referrals found.</h1>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tierData.map((row, idx) => (
                      <tr
                        key={row._id || idx}
                        className="text-white border-b border-[#2c2c34] last:border-b-0 hover:bg-[#08080e]"
                      >
                        <td className="px-4 py-4 whitespace-nowrap tracking-wider font-spaceGrotesk">
                          {hideEmail ? "*******" : getReferralDisplayInfo(row)}
                        </td>
                        {/* <td className="px-4 py-4 whitespace-nowrap">{new Date(row.referralAddedAt).toLocaleDateString()}</td> */}
                        <td className="px-4 py-4 whitespace-nowrap text-gray-400">
                          {formatTimeAgo(row.referralAddedAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {(row.feeCollected * (rewardPercentage / 100)).toFixed(5)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showWithdrawPopup && (
        <RefPopup
          setAddClaimed={setAddClaimed}
          Available={refData?.totalEarningInSol - refData?.user?.totalClaimed}
          address={solWalletAddress}
          onClose={() => setShowWithdrawPopup(false)}
        />
      )}
    </>
  );
};

export default ReferralPage;
