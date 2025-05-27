/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { LuCopyPlus } from "react-icons/lu";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";
import { FaGem } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { IoPieChartOutline } from "react-icons/io5";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { TbCopyCheck } from "react-icons/tb";


const ReferralPage = () => {

  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [copied3, setCopied3] = useState(false);
  const username = "wavepro123";
  const progress = 100;


  const handleCopy = () => {
    navigator.clipboard.writeText(username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy2 = () => {
    navigator.clipboard.writeText(username);
    setCopied2(true);
    setTimeout(() => setCopied2(false), 2000);
  };

  const handleCopy3 = () => {
    navigator.clipboard.writeText(username);
    setCopied3(true);
    setTimeout(() => setCopied3(false), 2000);
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


  return (
    <div className=" text-white p-6 rounded-2xl space-y-6 overflow-y-auto h-[90vh]">

      {/* User Header */}
      <div className="flex md:flex-row flex-col items-center md:items-start gap-4 w-full">
        {/* Image */}
        <div
          className={`w-20 h-20 min-w-[3.5rem] rounded-md bg-yellow-500 overflow-hidden cursor-pointer relative`}
          onClick={handleBoxClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {imageURL && (
            <img src={imageURL} alt="Uploaded" className="w-full h-full object-cover" />
          )}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
              <LuUpload size={20} />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col items-center md:items-start w-full">
          {/* Top row: username, points, icons */}
          <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between w-full gap-2 md:gap-0 mt-2">
            <div className="flex gap-2 items-center">
              <div
                onClick={handleCopy3}
                className="font-semibold hover:text-blue-400 cursor-pointer"
              >
                {username}
              </div>
              <div className="text-sm font-medium text-gray-400">0 Points</div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LuUpload className="cursor-not-allowed text-[#4f628a]" />
              <div className="flex items-center gap-1 cursor-pointer" onClick={handleCopy}>
                {copied ? <TbCopyCheck className="text-green-600" /> : <LuCopyPlus />}
                <span>{username}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-center text-xs text-gray-400">
        {/* Left side: Level Info */}
        <div className="flex items-start gap-1 sm:items-center flex-wrap">
          <MdOutlineKeyboardDoubleArrowUp className="text-blue-500 mt-[2px]" size={16} />
          <span>Next Level:</span>
          <span className="font-medium text-blue-500">2.5X Rewards rate for Points and SOL</span>
        </div>

        {/* Right side: Progress Info */}
        <div className="flex items-start gap-1 sm:items-center flex-wrap">
          <FaGem className="text-blue-500 mt-[2px]" size={16} />
          <span>{"You're almost there! Trade 20 SOL to reach"}</span>
          <span className="text-white font-medium">Silver</span>
        </div>
      </div>


      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level Card */}
        <div className="border-[#5b6075ce] border rounded-xl p-4 space-y-2">
          <div className="text-sm text-orange-400">🥉 Bronze</div>
          <div className="text-2xl font-bold  flex items-center gap-2">2X Rewards <span className="text-blue-500"><FaRegStar className="text-blue-500" size={23} /></span></div>
        </div>

        {/* SOL Earned */}
        <div className="border-[#5b6075ce] border rounded-xl p-4">
          <div className="text-sm text-[rgb(200,201,209)] flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <HiOutlineCurrencyDollar className="text-blue-500" size={20} />SOL Earned
            </div>
            <button className="lg:py-2 md:py-0 py-2 lg:px-3 md:px-0 px-3 bg-blue-500 rounded-md hover:bg-blue-700">Claim SOL</button>
          </div>
          <div className="text-2xl font-thin pt-2">
            0.0<sub>4</sub>66 SOL
          </div>

          <div className="text-sm text-gray-500">0 SOL claimed</div>
        </div>

        {/* Points Breakdown */}
        <div className="border-[#5b6075ce] border rounded-xl p-4">
          <div className="text-sm text-[rgb(200,201,209)] flex items-center gap-2">
            <IoPieChartOutline className="text-blue-500" size={20} />
            Points Breakdown
          </div>
          <div className="flex flex-col gap-1 text-sm mt-2 pt-1.5">
            <div className="text-[#5B6075]">Trading <span className="float-right text-[rgb(200,201,209)]">0</span></div>
            <div className="text-[#5B6075]">Referrals <span className="float-right text-[rgb(200,201,209)]">0</span></div>
            <div className="text-[#5B6075]">Quests <span className="float-right text-[rgb(200,201,209)]">0</span></div>
          </div>
        </div>
      </div>

      {/* Referral Table */}
      <div className="bg-[#1c1c2493] rounded-xl border border-[#2c2c34]">
        <div className="text-white text-sm">
          {/* Header */}
          <div className="flex justify-between border-b border-[#2c2c34] px-4 py-2 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2 items-center flex-shrink-0">
              <FiUserPlus className="text-blue-500" size={18} /> Referrals
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400 flex-shrink-0">
              <span className="text-blue-400 whitespace-nowrap">30%+ Referral Rate</span>

              <span
                className="flex items-center gap-1 cursor-pointer whitespace-nowrap"
                onClick={handleCopy2}
              >
                {copied2 ? (
                  <TbCopyCheck className="text-green-600" />
                ) : (
                  <LuCopyPlus />
                )}
                <span>{username}</span>
              </span>

              <span className="flex items-center gap-2 whitespace-nowrap">
                <FaUserFriends /> 1
              </span>
            </div>
          </div>


          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-gray-500 border-b border-[#2c2c34]">
                <tr>
                  <th className="px-4 py-2 text-nowrap">Email/Wallet</th>
                  <th className="px-4 py-2 text-nowrap">Date Joined</th>
                  <th className="px-4 py-2 text-nowrap">Type</th>
                  <th className="px-4 py-2 text-nowrap">Points Earned</th>
                  <th className="px-4 py-2 text-nowrap">SOL Earned</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-white border-b border-[#2c2c34]">
                  <td className="px-4 py-2 text-nowrap">m********</td>
                  <td className="px-4 py-2 text-nowrap">3mo</td>
                  <td className="px-4 py-2 text-nowrap">Direct</td>
                  <td className="px-4 py-2 text-nowrap">0.2202</td>
                  <td className="px-4 py-2 text-nowrap">0.0466 SOL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReferralPage;
