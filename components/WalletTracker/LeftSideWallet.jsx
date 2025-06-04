"use client";
import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiNotification2Line } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa";
import { PiWallet } from "react-icons/pi";
import { GoTag } from "react-icons/go";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { WalletCreatedAt } from "../common/Wallet/WalletCreatedAt";
import { CiEdit } from "react-icons/ci";
import { RiNotification2Fill } from "react-icons/ri";
import {
  subscribeToWalletTracker,
  unsubscribeFromWalletTracker,
} from "@/websocket/walletTracker";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import { showToaster, showToasterSuccess } from "@/utils/toaster/toaster.style";

function LeftSideWallet({
  onChartOpen,
  walletData,
  setWalletData,
  setWalletChartData,
  solAddress,
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [editTagIndex, setEditTagIndex] = useState(null);
  const [updatedTag, setUpdatedTag] = useState("");

  // Copy Address
  const handleCopy = (address, index) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  //  Name Update
  const handleEdit = (index, name) => {
    setEditIndex(index);
    setUpdatedName(name);
  };
  const handleUpdate = async (wallet, index) => {
    if (!updatedName.trim() || updatedName === wallet.walletName) {
      setEditIndex(null);
      return;
    }

    const updatedWalletData = {
      walletAddress: wallet.walletAddress,
      walletName: updatedName,
    };
    const token = localStorage.getItem("token");
    if (!token) return;
    await axios
      .put(`${BASE_URL}wallettracker/walletTracking`, updatedWalletData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data?.success) {
          setWalletData((prevData) =>
            prevData.map((item, i) =>
              i === index ? { ...item, walletName: updatedName } : item
            )
          );

          showToasterSuccess("Wallet name updated successfully.");
        } else {
          showToaster(
            response.data?.message || "Failed to update wallet name."
          );
        }
      })
      .catch((err) => {
        console.error("Error updating wallet name:", err?.message);
        showToaster("Failed to update wallet name.");
      });

    setEditIndex(null);
  };
  // Tag Update
  const handleTagEdit = (index, tag) => {
    setEditTagIndex(index);
    setUpdatedTag(tag.join(", "));
  };
  const handleTagUpdate = async (wallet, index) => {
    const newTags = updatedTag.split(",").map((tag) => tag.trim());

    if (
      !updatedTag.trim() ||
      JSON.stringify(newTags) === JSON.stringify(wallet.tag)
    ) {
      setEditTagIndex(null);
      return;
    }

    const updatedWalletData = {
      walletAddress: wallet.walletAddress,
      tag: newTags,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.put(
        `${BASE_URL}wallettracker/walletTracking`,
        updatedWalletData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setWalletData((prevData) =>
          prevData.map((item, i) =>
            i === index ? { ...item, tag: newTags } : item
          )
        );

        showToasterSuccess("Tags updated successfully.");
      } else {
        showToaster(response.data?.message || "Failed to update tags.");
      }
    } catch (error) {
      console.error("Error updating tags:", error);
      showToaster("Failed to update tags.");
    }

    setEditTagIndex(null);
  };
  // Delete
  const handleDelete = async (walletAddress) => {
    const USER_ADDRESS = solAddress;
    if (!walletAddress) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.delete(`${BASE_URL}wallettracker/walletTracking`, {
        data: {
          walletAddresses: [walletAddress],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWalletData((prevData) =>
        prevData.filter((item) => item.walletAddress !== walletAddress)
      );

      showToasterSuccess("Wallet deleted successfully.");
    } catch (error) {
      console.error(
        "❌ Error deleting wallet:",
        error.response ? error.response.data : error
      );
      showToaster("Failed to delete wallet. Please try again.", {
        position: "top-center",
        style: { fontSize: "12px" },
      });
    }
  };
  // alert Update
  const toggleNotification = async (wallet, index) => {
    const updatedAlert = !wallet.alert;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.put(
        `${BASE_URL}wallettracker/walletTracking`,
        {
          walletAddress: wallet.walletAddress,
          alert: updatedAlert,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setWalletData((prevData) =>
          prevData.map((item, i) =>
            i === index ? { ...item, alert: updatedAlert } : item
          )
        );
        await unsubscribeFromWalletTracker();
        await subscribeToWalletTracker(solAddress);
      } else {
        showToaster(response.data?.message || "Failed to update alert status.");
      }
    } catch (error) {
      console.error("Error updating alert status:", error);
      showToaster("Failed to update alert status.");
    }
  };

  return (
    <div className="bg-[#0A0A0B] text-white xl:h-[77vh] h-[40vh] overflow-y-scroll overflow-x-auto min-w-full">
      <div className="min-w-[500px]">
        {walletData.length === 0 ? (
          <div className="text-center text-[#A8A8A8] py-5 h-[20vh] flex justify-center items-center">
            No Data Available
          </div>
        ) : (
          walletData.map((wallet, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-[#1A1A1A] p-3 hover:bg-[#1A1A1B] transition-all  min-w-[500px]"
            >
              <PiWallet size={25} className="text-[#1F73FC]" />

              <div className="flex-1 ml-3">
                <div className="flex gap-2 items-center">
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={updatedName}
                      maxLength={15}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      onBlur={() => handleUpdate(wallet, index)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleUpdate(wallet, index)
                      }
                      autoFocus
                      className="bg-transparent border border-gray-600 px-2 py-1 text-white rounded-md text-sm focus:outline-none w-24"
                    />
                  ) : (
                    <span className="font-semibold text-[14px]">
                      {wallet.walletName}
                    </span>
                  )}
                  <button onClick={() => handleEdit(index, wallet.walletName)}>
                    <CiEdit className="cursor-pointer hover:text-gray-400" />
                  </button>
                  <span className="text-[#6E6E6E] text-[14px]">
                    {" / "}
                    {`${wallet?.walletAddress
                      ?.toString()
                      ?.slice(0, 4)}...${wallet.walletAddress
                      ?.toString()
                      ?.slice(-4)}`}
                  </span>

                  <button
                    onClick={() => handleCopy(wallet.walletAddress, index)}
                    className="cursor-pointer"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-xs flex gap-2">
                  <div className="border-r border-r-[#6E6E6E] flex gap-2 pr-2">
                    <span className="text-[#6E6E6E]">Chain</span>
                    {wallet.chain}
                  </div>
                  <h6 className="text-[#6E6E6E] text-xs">
                    <WalletCreatedAt createdAt={wallet?.createdAt} />
                  </h6>
                </div>
                {/* tag */}
                <div className="text-xs flex items-center gap-1">
                  <GoTag className="text-[#6E6E6E]" />

                  {editTagIndex === index ? (
                    <input
                      type="text"
                      value={updatedTag}
                      onChange={(e) => setUpdatedTag(e.target.value)}
                      onBlur={() => handleTagUpdate(wallet, index)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleTagUpdate(wallet, index)
                      }
                      autoFocus
                      className="bg-transparent border border-gray-600 px-2 py-1 w-24  text-white rounded-md text-xs focus:outline-none"
                    />
                  ) : (
                    <span>{wallet.tag?.join(", ")}</span>
                  )}

                  <button onClick={() => handleTagEdit(index, wallet.tag)}>
                    <CiEdit className="cursor-pointer hover:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex gap-6">
                <Tooltip body={"Enable/Disable Alert"}>
                  <div
                    onClick={() => toggleNotification(wallet, index)}
                    className="cursor-pointer"
                  >
                    {wallet.alert ? (
                      <RiNotification2Fill className="text-white" />
                    ) : (
                      <RiNotification2Line className="hover:text-white" />
                    )}
                  </div>
                </Tooltip>

                <FaChartLine
                  onClick={() => {
                    onChartOpen();
                    setWalletChartData(wallet);
                  }}
                  className="cursor-pointer hover:text-white"
                />

                <RiDeleteBinLine
                  onClick={() => handleDelete(wallet.walletAddress)}
                  className="text-[#ED1B24] cursor-pointer hover:text-red-400"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeftSideWallet;
