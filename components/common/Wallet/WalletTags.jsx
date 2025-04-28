

"use client";
import React, { useEffect, useState } from 'react';

const WalletTags = ({ wallet, updateTags }) => {
    const [inputValue, setInputValue] = useState('');

    // ✅ Add Tag
    const handleAddTag = async (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '' && wallet.tag.length < 2) {
            if (inputValue.length > 15) {
                alert('Max length for a tag is 15 characters.');
                return;
            }

            const newTags = [...wallet.tag, inputValue.trim()];
            setInputValue('');

            await updateTags(wallet, newTags);
        }
    };

    // ✅ Delete Tag
    const handleDeleteTag = async (index) => {
        const newTags = wallet.tag.filter((_, i) => i !== index);

        // Call API to update tags (Pass full wallet object)
        await updateTags(wallet, newTags);
    };

    return (
        <div className="flex items-center space-x-2 justify-center">
            {/* Display Tags */}
            {(wallet.tag || []).map((tag, index) => (
                <div key={index} className="bg-green-600 text-white rounded-md px-2 m-[5px]  flex items-center">
                    {tag}
                    <button
                        onClick={() => handleDeleteTag(index)}
                        className="ml-1 text-sm font-bold focus:outline-none"
                    >
                        ×
                    </button>
                </div>
            ))}

            {/* Input Field for New Tags */}
            {wallet?.tag?.length < 1 && (
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Tag wallet"
                    maxLength={15}
                    className="border border-gray-500 rounded-sm p-1 bg-transparent text-white focus:outline-none"
                />
            )}
        </div>
    );
};

export default WalletTags;
