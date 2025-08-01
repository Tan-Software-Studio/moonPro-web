import React, { memo } from 'react'

function Trades({ trades, }) {
    return (
        <div>
            <div className="grid grid-cols-3 py-1 gap-4 items-center border-b border-gray-700 bg-[#1a1a1a]">
                <div className="text-gray-400 text-xs font-medium px-4">Price</div>
                <div className="text-gray-400 text-xs font-medium text-center">Size</div>
                <div className="text-gray-400 text-xs font-medium text-right px-4">Time</div>
            </div>

            {/* Content */}
            <div className="max-h-[526px]  custom-scrollbar overflow-auto">
                {trades?.length > 0 ? (
                    trades.map((item, ind) => (
                        <div
                            key={ind}
                            className="grid grid-cols-3 gap-4 items-center px-4 py-2"
                        >
                            <div className={`text-sm font-medium ${item.m ? 'text-red-400' : 'text-green-400'}`}>
                                {parseFloat(item.p).toFixed(4)}
                            </div>
                            <div className="text-white text-sm text-center">
                                {parseFloat(item.q).toFixed(4)}
                            </div>
                            <div className="text-gray-300 text-sm text-right">
                                {new Date(item.T).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center text-gray-400 py-16">
                        <div>Loading trades...</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(Trades)