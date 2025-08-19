import NoData from '@/components/common/NoData/noData'
import { convertTimestamp } from '@/utils/calculation'
import React from 'react'

const OrderHistory = ({ orderHistoryData, orderHistoryLoading }) => {
    return (
        <div className="overflow-auto max-h-[500px] max-w-full">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
                <thead className="text-gray-400 sticky top-0 bg-black">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Time ↑
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Type
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Coin</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Direction
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Size</th>
                        {/* <th className="px-4 py-2 text-left text-xs font-medium">Filled Size</th> */}
                        {/* <th className="px-4 py-2 text-left text-xs font-medium">Over value</th> */}
                        <th className="px-4 py-2 text-left text-xs font-medium">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Reduce Only</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Trigger Direction</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Orer Id
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-white">
                    {orderHistoryLoading ?
                        <tr>
                            <td colSpan={10} className="py-10">
                                <div className="flex items-center justify-center lg:h-[400px] w-full">
                                    <div className="snippet flex justify-center" data-title=".dot-spin">
                                        <div className="stage">
                                            <div className="dot-spin"></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        : orderHistoryData.length > 0 ?
                            orderHistoryData.map((item, index) => {
                                let direction;
                                if (item?.order.side === "B" && item?.order.reduceOnly) {
                                    direction = "Close Short";
                                } else if (item?.order.side === "A" && item?.order.reduceOnly) {
                                    direction = "Close Long";
                                } else if (item?.order.side === "B") {
                                    direction = "Long";
                                } else if (item?.order.side === "A") {
                                    direction = "Short";
                                }
                                console.log("🚀 ~ direction:", direction, index)
                                return (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            <div className='flex items-center gap-3'>
                                                {convertTimestamp(item?.order?.timestamp)}
                                            </div>
                                        </td>
                                        <td className={`px-4 py-2`}>{item?.order?.orderType}</td>
                                        <td className={`px-4 py-2 ${(direction == "Close Short" || direction == "Long") ? "text-green-500" : "text-red-500"}`}>{item?.order?.coin}</td>
                                        <td className={`px-4 py-2 ${(direction == "Close Short" || direction == "Long") ? "text-green-500" : "text-red-500"}`}>{direction}</td>
                                        <td className={`px-4 py-2`}>{item?.order?.sz}</td>
                                        {/* <td className={`px-4 py-2`}>---</td> */}
                                        {/* <td className={`px-4 py-2`}>---</td> */}
                                        <td className={`px-4 py-2`}>{item?.order?.limitPx}</td>
                                        <td className="px-4 py-2">{item?.order?.reduceOnly == false ? "No" : "Yes"}</td>
                                        <td className="px-4 py-2">N/A</td>
                                        <td className="px-4 py-2">{item?.status}</td>
                                        <td className="px-4 py-2">{item?.order?.oid}</td>
                                    </tr>
                                )
                            }
                            )
                            : <tr>
                                <td colSpan={10} className="py-10">
                                    <div className="flex items-center flex-col justify-center lg:h-[400px] w-full">
                                        <NoData title="No Trades data yet" />
                                    </div>
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrderHistory