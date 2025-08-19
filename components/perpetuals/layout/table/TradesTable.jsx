import NoData from '@/components/common/NoData/noData'
import { convertTimestamp } from '@/utils/calculation'
import Link from 'next/link'
import React, { memo } from 'react'
import { LuExternalLink } from 'react-icons/lu'

const TradesTable = ({ tradesData, tradesLoading }) => {
    return (
        <div className="overflow-auto max-h-[500px] max-w-full">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
                <thead className="text-gray-400 sticky top-0 bg-black">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Time ↑
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Coin</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Direction
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            size
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Trade Value
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Fee</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">
                            Close pnl                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-white">
                    {tradesLoading ?
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
                        : tradesData.length > 0 ?
                            tradesData.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">
                                        <div className='flex items-center gap-3'>
                                            {convertTimestamp(item?.time)}
                                            {item.hash &&
                                                <Link
                                                    target='_blank'
                                                    href={`http://app.hyperliquid.xyz/explorer/tx/${item.hash}`} >
                                                    <LuExternalLink />
                                                </Link>
                                            }
                                        </div>
                                    </td>
                                    <td className={`px-4 py-2 ${item?.dir == "Close Long" ? "text-red-500" : "text-green-500"} `}>{item?.coin}</td>
                                    <td className={`px-4 py-2 ${item?.dir == "Close Long" ? "text-red-500" : "text-green-500"} `}>{item?.dir}</td>
                                    <td className="px-4 py-2">{item?.px}</td>
                                    <td className="px-4 py-2">{item?.sz}</td>
                                    <td className="px-4 py-2">
                                        {/* {(Number(item?.origSz) * Number(item?.limitPx)).toFixed(2)}{" "} */}
                                        USDC
                                    </td>
                                    <td className="px-4 py-2">{item?.fee}</td>
                                    <td className="px-4 py-2">{item?.closedPnl}</td>

                                </tr>
                            ))
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

export default memo(TradesTable)