import { addNewAlphaPickNotification } from "@/app/redux/alphaPicksNotification/alphaPicksNotificationData.js";
import { addNewAlphaFollow } from "@/app/redux/alphaFollows/alphaFollowsData.js";
import { removeAlphaFollow } from "@/app/redux/alphaFollows/alphaFollowsData.js";
import { io } from "socket.io-client";
import store from "@/app/redux/store";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { BiSolidCopy } from "react-icons/bi";
import Image from "next/image";

const waveScanApiUrl = process.env.NEXT_PUBLIC_WAVE_SCAN_BOT_API_URL;

const copyAddress = (address) => {
    navigator?.clipboard?.writeText(address);
    return toast.success ("Copied To Clipboard.", { position: "top-center", duration: 2000 });
};

export async function subscribeToNewNotifications(walletAddress) {
    try {
        const socket = io(`${waveScanApiUrl}`, {
            transports: ["websocket"], // Ensure WebSocket transport is used
        });

        socket.on("connect", () => {
            // console.log("✅ Connected to Wave Scan WebSocket server");
            socket.emit("registerWallet", walletAddress); // Send wallet address
        });

        socket.on("notificationUpdate", async (data) => {
            // console.log("📩 New Notification:", data.fullDocument);

            try {
                store.dispatch(addNewAlphaPickNotification(data.fullDocument)); // Add to Redux
                showToast(data.fullDocument);
            } catch (error) {
                console.error("Error inserting new notification:", error);
            }
        });

        socket.on("newFollows", async (data) => {
            // console.log("📩 New Follow:", data);

            try {
                store.dispatch(addNewAlphaFollow(data)); // Add to Redux
            } catch (error) {
                console.error("Error inserting new notification:", error);
            }
        });

        socket.on("removeFollows", async (id) => {
            // console.log("📩 Removed Follow:", id);

            try {
                store.dispatch(removeAlphaFollow(id)); // Add to Redux
            } catch (error) {
                console.error("Error inserting new notification:", error);
            }
        }); 

        // Add keypress listener for manual testing
        // document.addEventListener("keydown", (event) => {
        //     if (event.key.toLowerCase() === "p") {
        //         console.log("🔔 Manually triggering test toast...");
        //         showToast({
        //             groupName: "Test Group",
        //             userName: "John123",
        //             address: "JCeo...time",
        //             price: 0.0034512,
        //             mc: 345500
        //         });
        //     }
        // });

    } catch (error) {
        console.error("Error connecting to WebSocket:", error?.message);
    }
}

export function subscribeToNewCalls(pageId) {
    let socket = null;

    const connectSocket = () => {
        try {
            socket = io(`${waveScanApiUrl}`, {
                transports: ["websocket"],
            });

            socket.on("connect", () => {
                // console.log("✅ Connected to WebSocket server for page:", pageId);
                socket.emit("registerPage", pageId);
            });

            socket.on("disconnect", () => {
                console.log("❌ Disconnected from WebSocket server for page:", pageId);
            });

            socket.on("error", (error) => {
                console.error("WebSocket error for page:", error);
            });

            return socket;
        } catch (error) {
            console.error("Error establishing WebSocket connection for page:", error?.message);
        }
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            // console.log("🛑 WebSocket disconnected for page:", pageId);
        }
    };

    socket = connectSocket();
    return { socket, disconnect: disconnectSocket };
}

// Function to show persistent toast
function showToast(notification) {
    toast.custom((t) => (
        <motion.div
            initial={{ x: 100, opacity: 0 }} // Start off-screen (right) and invisible
            animate={{ x: 0, opacity: 1 }}  // Slide in and fade in
            exit={{ x: 100, opacity: 0 }}     // Slide out and fade out
            transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation
            className="bg-[#1F1F23] rounded-lg shadow-xl p-4"
        >
            <div className="w-full h-full flex gap-2">
                <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 shrink-0">
                        <Image
                            src={'https://res.cloudinary.com/dzlxfdze6/image/upload/v1741337731/GroupImages/groupImage_-4782015967.jpg'}
                            alt={'Alpha Image'}
                            width={64}
                            height={64}
                            className="rounded-md w-full h-full shrink-0 border border-[#6CC4F4]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="flex items-center gap-1">
                            <p className="text-base font-semibold text-[#6CC4F4]">
                                {notification?.channelName || notification?.groupName}
                            </p>
                            {notification?.channelName &&
                                <span className="text-xs">
                                    by: @{notification?.userName}
                                </span>
                            }
                        </p>
                        <div className="flex gap-3">
                            <p className="text-xs font-semibold">
                                Price: <span className="text-[#2DC24E] font-normal">${notification?.price}</span>
                            </p>
                            <p className="text-xs font-semibold">
                                MC: <span className="text-[#2DC24E] font-normal">${notification?.mc}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <p className="text-xs tracking-wider font-normal sm:truncate md:block hidden">
                                {notification?.address?.slice(0, 4)}...{notification?.address?.slice(-4)}
                            </p>
                        <span
                            className={`${notification?.address ? `block` : `hidden`}`}
                            onClick={() => copyAddress(notification?.address)}
                        >
                            <BiSolidCopy
                                size={14}
                                className="ml-2 cursor-pointer"
                            />
                        </span>
                        </div>
                    </div>
                    <button className="font-semibold text-sm rounded-lg p-2 border-[0.77px] border-[#6CC4F4] text-white hover:text-black bg-black/25 hover:bg-[#6CC4F4] transition-colors ease-in-out delay-200">
                        Quick Buy
                    </button>
                </div>
                <div className="flex items-center justify-center rounded-full ">
                    <button
                        onClick={() => toast.dismiss(t.id)} // Manually close
                        className="w-2 h-2 shrink-0 p-2 flex items-center justify-center aspect-square text-sm text-white font-extrabold"
                    >
                        X
                    </button>
                </div>
            </div>
        </motion.div>
    ), {
        duration: 10000, // Stay until closed
        position: "top-right", // Appears in bottom-right
        style: {
            background: "transparent", // Keep background transparent since Framer Motion handles it
        },
    });
}
