import React from 'react'
import { useSelector } from 'react-redux';

const Positions = () => {
    const orderPositionsData = useSelector(
        (state) => state?.perpetualsData?.orderPositionsData
    );
    // console.log("🚀 ~ Positions ~ orderPositionsData:", orderPositionsData)
 
    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800 text-sm">
                    <thead className=" text-gray-400">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Asset ↑</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Position</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Position Value</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Entry Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Mark Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Liquidation Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Margin Used (PNL) ↓</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">TP/SL</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Close</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-white overflow-y-scroll h-full">
                        {orderPositionsData?.assetPositions?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="px-4 py-2">{item?.position?.coin}</td>
                                    <td className="px-4 py-2">{Number(item?.position?.positionValue).toFixed(2)}</td>
                                    <td className="px-4 py-2">-----</td>
                                    <td className="px-4 py-2">{Number(item?.position?.entryPx).toFixed(2)}</td>
                                    <td className="px-4 py-2">---</td>
                                    <td className="px-4 py-2">{Number(item?.position?.liquidationPx).toFixed(2)}</td>
                                    <td className="px-4 py-2">{Number(item?.position?.marginUsed).toFixed(2)}</td>
                                    <td className="px-4 py-2">----</td>
                                    <td className="px-4 py-2">
                                        <button className="text-white text-xs px-3 py-1 rounded ">---</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default Positions