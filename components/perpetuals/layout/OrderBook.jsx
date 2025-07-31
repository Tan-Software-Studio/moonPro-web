"use client";
import React, { useEffect, useState } from "react";

const MAX_ENTRIES = 10;

const OrderBook = ({ orders, selectedToken, asks, setAsks, bids, setBids }) => {

    // console.log({
    //     bids: orders?.b,
    //     bidsPrice: orders?.B,
    //     asks: orders?.a,
    //     asksPrice: orders?.A

    // })


    useEffect(() => {
        if (!orders?.b || !orders?.a) return;

        const newBid = {
            price: parseFloat(orders?.b),
            size: parseFloat(orders?.B),
        };

        const newAsk = {
            price: parseFloat(orders?.a),
            size: parseFloat(orders?.A),
        };

        setBids((prev) => {
            const updated = [newBid, ...prev];
            return updated.slice(0, MAX_ENTRIES);
        });

        setAsks((prev) => {
            const updated = [newBid, ...prev];
            return updated.slice(0, MAX_ENTRIES);
        });
    }, [orders]);

    // Calculate cumulative total (Sum)
    const calculateTotal = (entries) => {
        let total = 0;
        return entries.map((entry) => {
            total += entry.size;
            return { ...entry, total };
        });
    };

    const formattedBids = calculateTotal(bids);
    const formattedAsks = calculateTotal([...asks].reverse()); // Reverse to go bottom-up like AsterDex

    // Max total for bar size reference
    const maxAskTotal = Math.max(...formattedAsks.map(a => a.total), 1);
    const maxBidTotal = Math.max(...formattedBids.map(b => b.total), 1);

    return (
        <div className="font-mono h-full">
            {/* Headers */}
            <div className="grid grid-cols-3 py-1 gap-2 items-center sticky top-0 z-10 bg-black">
                <div className="text-gray-400 text-xs font-medium px-3">Price</div>
                <div className="text-gray-400 text-xs font-medium text-right px-2">Size</div>
                <div className="text-gray-400 text-xs font-medium text-right px-3">Sum</div>
            </div>

            <div className="custom-scrollbar  h-full">
                <div className="h-full flex flex-col">

                    {/* Bids */}
                    <div className="min-h-[250px] flex flex-col justify-end">
                        {[...formattedBids].reverse().map((bid, ind) => (
                            <div key={`bid-${ind}`} className="grid grid-cols-3 gap-2 items-center py-1 hover:bg-[#1a1a1a] transition-colors relative group min-h-[20px] max-h-[25px]">
                                <div
                                    className="absolute right-0 top-0 h-full bg-red-500/10"
                                    style={{
                                        width: `${(bid.total / maxBidTotal) * 100}%`,
                                        transition: 'width 0.2s ease-in-out',
                                    }}
                                ></div>

                                <div className="text-red-400 text-sm px-3 relative z-10 tabular-nums">
                                    {bid.price.toFixed(4)}
                                </div>
                                <div className="text-white text-sm text-right px-2 relative z-10 tabular-nums">
                                    {bid.size.toFixed(3)}
                                </div>
                                <div className="text-gray-300 text-sm text-right px-3 relative z-10 tabular-nums">
                                    {bid.total.toFixed(3)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mark Price */}
                    <div className="bg-[#1a1a1a] py-2 px-4 border-y border-gray-600 relative min-h-[36px] flex items-center  ">
                        {selectedToken?.markPrice ? (
                            <span className="text-green-400 font-mono text-sm font-bold">
                                ${Number(selectedToken.markPrice).toFixed(2)}
                            </span>
                        ) : (
                            <span className="text-gray-400 text-xs">Loading...</span>
                        )}
                    </div>

                    {/* Asks */}

                    <div className=" min-h-[200px]">
                        {formattedAsks.map((ask, ind) => (
                            <div key={`ask-${ind}`} className="grid grid-cols-3 gap-2 items-center py-1 hover:bg-[#1a1a1a] transition-colors relative group min-h-[20px] max-h-[25px]">
                                <div
                                    className="absolute right-0 top-0 h-full bg-green-500/10"
                                    style={{
                                        width: `${(ask.total / maxAskTotal) * 100}%`,
                                        transition: 'width 0.2s ease-in-out',
                                    }}
                                ></div>

                                <div className="text-green-400 text-sm px-3 relative z-10 tabular-nums">
                                    {ask.price.toFixed(3)}
                                </div>
                                <div className="text-white text-sm text-right px-2 relative z-10 tabular-nums">
                                    {ask.size.toFixed(2)}
                                </div>
                                <div className="text-gray-300 text-sm text-right px-3 relative z-10 tabular-nums">
                                    {ask.total.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
