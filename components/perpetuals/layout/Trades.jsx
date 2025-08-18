import NoData from '@/components/common/NoData/noData'
import React, { memo } from 'react'

function Trades({ trades }) {
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
                            <div className={`text-sm font-medium ${item?.side == "A" ? 'text-red-400' : 'text-green-400'}`}>
                                {item?.px}
                            </div>
                            <div className="text-white text-sm text-center">
                                {item?.sz && parseFloat(item?.sz).toFixed(4)}
                            </div>
                            <div className="text-gray-300 text-sm text-right">
                                {item?.time && new Date(item?.time).toLocaleTimeString() }
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full w-full">
                        <NoData
                            imageTagClass="!md:w-[180px] !sm:w-[120px] !w-[100px] !h-auto"
                            title="No Trades Data yet" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(Trades)