"use client";
import { solana } from "@/app/Images";
import { setSolWalletAddress } from "@/app/redux/states";
import { showToastLoader } from "@/components/common/toastLoader/ToastLoder";
import RecoveryKey from "@/components/Navbar/login/RecoveryKey";
import { decodeData } from "@/utils/decryption/decryption";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { BiCheckDouble } from "react-icons/bi";
import { FaCopy, FaStar } from "react-icons/fa";
import { RiShareBoxLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { BsKey } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { addNewGeneratedWallet, updateWalletToPrimary } from "@/app/redux/userDataSlice/UserData.slice";
import { showToaster } from "@/utils/toaster/toaster.style";

export default function WalletManagement() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(null);
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [pkParticulerWallet, setPkParticulerWallet] = useState("");
  const [openRecovery, setOpenRecovery] = useState(false);
  const { t } = useTranslation();
  const portfolio = t("portfolio");

  const userDetails = useSelector((state) => state?.userData?.userDetails);
  const allWallets = userDetails?.walletAddressSOL || [];

  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL;

  useEffect(() => {
    if (allWallets?.length > 0) {
      setWalletAddresses(allWallets);
    }
  }, [allWallets]);

  // old primary
  async function handlePrimary(walletIndex, loopIndex) {
    console.log("===<><>wallet manage", walletIndex, loopIndex);
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return 0;
    try {
      showToastLoader("Switching wallet", "switch-toast");
      await axios
        .put(
          `${baseUrl}user/makeSolWalletPrimary`,
          {
            index: walletIndex,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        )
        .then(async (res) => {
          // const updatedAllWallets = allWallets.map((wallet) => ({
          //   ...wallet,
          //   primary: wallet.index === walletIndex,
          // }));

          // setAllWallets(updatedAllWallets);
          // setWalletAddresses((prevVisibleWallets) =>
          //   // Update only if the wallet is visible in the filtered list
          //   prevVisibleWallets.map((wallet) => ({
          //     ...wallet,
          //     primary: wallet.index === walletIndex,
          //   }))
          // );

          localStorage.setItem("walletAddress", res?.data?.data?.wallet?.wallet);

          toast.success("Primary wallet switched", {
            id: "switch-toast",
            duration: 2000,
          });
          dispatch(updateWalletToPrimary(res?.data?.data?.wallet?.wallet));
          dispatch(setSolWalletAddress());
        })
        .catch((err) => {
          console.log("🚀 ~ ).then ~ err:", err?.message);
        });
    } catch (error) {
      console.error(error);
      showToaster("Primary not wallet switched.");
    }
  }

  async function handleCreateMultiWallet() {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return 0;
    if (walletAddresses?.length >= 50) {
      showToaster("You can only create 50 wallets.");
    }
    showToastLoader("Creating wallet...", "wallet-toast");
    await axios
      .put(
        `${baseUrl}user/generateSolWallet`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then(async (response) => {
        const generatedWallet = response?.data?.data?.wallet;
        toast.success("Wallet created successfully", {
          id: "wallet-toast",
          duration: 2000,
        });
        dispatch(addNewGeneratedWallet(generatedWallet));
      })
      .catch((error) => {
        console.error(error);
        toast.error("Wallet is not created", {
          id: "wallet-toast",
          duration: 2000,
        });
      });
  }

  const copyToClipboard = async (walletAddress) => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopiedWallet(walletAddress);
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedWallet(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  function handleSearchWallet(e) {
    const value = e.target.value.toLowerCase().trim();
    if (!value) {
      setWalletAddresses(allWallets);
      return;
    }
    const searchItems = allWallets.filter((wallet) => wallet?.wallet?.toLowerCase()?.includes(value));
    setWalletAddresses(searchItems);
  }

  // get solana PK
  async function handleToGetSolanaPk(wallet) {
    const token = localStorage.getItem("token");
    await axios({
      url: `${baseUrl}user/getSolanaPk/${wallet?.wallet}/${wallet?.index}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const decodeKey = await decodeData(res?.data?.data?.solanaPk);
        setPkParticulerWallet(decodeKey);
        setOpenRecovery(true);
      })
      .catch((err) => {
        console.log("🚀 ~ handleToGetSolanaPk ~ err:", err);
      });
  }

  return (
    <>
      <div className="bg-[#08080E] text-white p-3 md:p-6">
        <div className="border-[#404040] border-[1px] rounded-lg">
          <div className="flex flex-col  ">
            {/* Header & Search Bar */}
            <div
              className="flex flex-col md:flex-row items-start md:items-center justify-between border-[#404040] border-b-[1px] 
            gap-4 px-3 py-3"
            >
              <div className="w-full md:w-64 ">
                <input
                  type="search"
                  onChange={handleSearchWallet}
                  placeholder="Search by address"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2  text-sm focus:outline-none cursor-pointer "
                />
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {/* <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm">
                  <span>{portfolio?.Import}</span>
                </button> */}

                <button
                  onClick={handleCreateMultiWallet}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-[#11265B] hover:bg-[rgb(88_86_235/_var(--tw-bg-opacity))] rounded-lg text-sm"
                >
                  <span>{portfolio?.CreateWallet}</span>
                </button>
              </div>
            </div>

            {/* <div className="w-full max-w-full overflow-x-auto rounded-lg border border-gray-800">
          <table className="">  */}

            <div className="min-h-[50vh] max-w-full w-full whitespace-nowrap max-h-[70vh] overflow-x-auto overflow-y-auto rounded-lg border border-gray-800">
              <table className="min-w-[800px] w-full table-fixed">
                <thead className="overflow-x-auto">
                  <tr className="bg-gray-800 text-left text-gray-400 text-sm">
                    <th className="py-4 px-5 font-medium w-1/12">#</th>
                    <th className="py-4 px-5 font-medium w-5/12">{portfolio?.Wallet}</th>
                    <th className="py-4 px-5 font-medium w-2/12 text-center md:text-left">{portfolio?.Balance}</th>
                    {/* <th className="py-4 px-5 font-medium w-2/12 text-center md:text-left">{portfolio?.Holdings}</th> */}
                    <th className="py-4 px-5 font-medium w-3/12 text-right">{portfolio?.Actions}</th>
                  </tr>
                </thead>
                <tbody className="overflow-x-auto">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5">
                        <div className="flex justify-center items-center min-h-[40vh]  ">
                          <span class="Tableloader"></span>
                        </div>
                      </td>
                    </tr>
                  ) : walletAddresses.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="flex justify-center items-center min-h-[40vh] text-gray-400">
                          No wallets found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    walletAddresses.map((wallet, index) => (
                      <tr
                        key={wallet._id || index}
                        className={`transition-colors hover:bg-gray-800/50 ${
                          wallet.primary
                            ? "bg-gradient-to-r from-amber-900/30 to-transparent border-l-4 border-amber-500"
                            : index % 2 === 0
                            ? "bg-gray-800/20"
                            : ""
                        }`}
                      >
                        {/* Wallet number */}
                        <td className="py-2 px-4">{index + 1}</td>

                        {/* Wallet address */}
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {wallet.primary && <FaStar className="text-amber-500 " size={16} />}
                              <div className={`font-medium ${wallet.primary ? "text-amber-500" : ""}`}>
                                {wallet.primary ? "Primary Wallet" : "Wallet"}
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(wallet.wallet)}
                              className="text-xs text-gray-400 flex gap-1 items-center hover:text-gray-200 transition-colors bg-gray-800/50 py-1 px-2 rounded-md"
                            >
                              {`${wallet?.wallet.slice(0, 4)}...${wallet?.wallet.slice(-4)}`}
                              {copiedWallet === wallet.wallet ? (
                                <BiCheckDouble className="text-[20px]" />
                              ) : (
                                <FaCopy className="cursor-pointer flex-shrink-0" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Balance */}
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2 ">
                            <Image src={solana} width={20} height={20} alt="solana" className="rounded-full" />
                            <span>{wallet?.balance || 0}</span>
                          </div>
                        </td>

                        {/* Holdings */}
                        {/* <td className="py-2 px-4">
                          <div className="relative flex flex-row items-center gap-2">
                            <div className="relative w-[26px] h-[13px]">
                              <div className="absolute left-[0px] bg-[#6f6f8b] h-[13px] w-[13px] rounded-[4px] z-[3]" />
                              <div className="absolute left-[6px] bg-[#6f6f8b9c] h-[13px] w-[13px] rounded-[4px] z-[2]" />
                              <div className="absolute left-[12px] bg-[#6f6f8b36] h-[13px] w-[13px] rounded-[4px] z-[1]" />
                            </div>

                            <div className=" ">{wallet?.holdings || 0}</div>
                          </div>
                        </td> */}

                        {/* Actions */}
                        <td className="py-2 px-4">
                          <div className="flex items-center justify-end space-x-1">
                            {/* <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-100" title="Archive wallet">
                            <IoEyeOff size={18} />
                          </button> */}

                            <Link
                              href={`https://solscan.io/account/${wallet?.wallet}`}
                              target="_blank"
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-100"
                              title="Open in Solscan"
                            >
                              <RiShareBoxLine size={15} />
                            </Link>
                            <button
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-100"
                              title="Export private key"
                              onClick={() => handleToGetSolanaPk(wallet)}
                            >
                              <BsKey size={18} />
                            </button>
                            {!wallet?.primary && (
                              <button
                                onClick={() => handlePrimary(wallet?.index, index)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-amber-500"
                                title="Set as primary"
                              >
                                <CiStar size={18} />
                              </button>
                            )}
                          </div>
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
      {openRecovery && pkParticulerWallet && (
        <RecoveryKey
          PK={pkParticulerWallet}
          setPK={setPkParticulerWallet}
          setOpenRecovery={setOpenRecovery}
          flag={false}
        />
      )}
    </>
  );
}
