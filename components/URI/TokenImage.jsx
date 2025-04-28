/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useState, useEffect } from "react";

const TokenImage = ({ uri, symbol }) => {
    const [imageUrl, setImageUrl] = useState(null);

    // Fetch Image from URI
    useEffect(() => {
        const fetchImage = async () => {
            if (!uri || uri.trim() === "") return;

            try {
                const { data } = await axios.get(uri);
                setImageUrl(data.image || null);
            } catch (error) {
                console.error("Error fetching token image:", error);
                setImageUrl(null);
            }
        };

        fetchImage();
    }, [uri]);

    return (
        <div
            className={`h-8 w-8 border-2 border-[#24242b] rounded-md flex items-center justify-center ${imageUrl ? "bg-transparent" : "bg-gray-800 text-white text-lg font-bold"
                }`}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Token"
                    className="h-full w-full rounded-md object-cover"
                />
            ) : (
                symbol?.charAt(0)?.toUpperCase() || "?"
            )}
        </div>
    );
};

export default TokenImage;
