import LoaderPopup from '@/components/common/LoaderPopup/LoaderPopup';
import NoData from '@/components/common/NoData/noData';
import React from 'react'
import { useSelector } from 'react-redux';

const OpenOrders = ({ openOrdersLoading }) => {

    const OpenOrdersData = useSelector(
        (state) => state?.perpetualsData?.OpenOrdersData
    );

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    }



    if (openOrdersLoading) {
        return (
            <div className="flex items-center justify-center h-[300px] w-full">
                <div
                    className="snippet flex justify-center mt-20   "
                    data-title=".dot-spin"
                >
                    <div className="stage">
                        <div className="dot-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!openOrdersLoading && (!OpenOrdersData || OpenOrdersData.length === 0)) {
        return (
            <div className="flex items-center flex-col  justify-center h-[300px] w-full">
                <NoData title="No open orders yet" />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-auto max-h-[200px] max-w-full">
                <table className="min-w-full divide-y divide-gray-800 text-sm">
                    <thead className="text-gray-400 sticky top-0 bg-black">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium">Time ↑</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Coin</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Direction</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Size</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Original size</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Order Value</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Reduce only</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Trigger Condition</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">TP/SL</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Cancel All</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-white">
                        {OpenOrdersData.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{formatTimestamp(item?.timestamp)}</td>
                                <td className="px-4 py-2">{item?.side}</td>
                                <td className="px-4 py-2">{item?.coin}</td>
                                <td className="px-4 py-2">Long</td>
                                <td className="px-4 py-2">{item?.sz}</td>
                                <td className="px-4 py-2">{item?.origSz}</td>
                                <td className="px-4 py-2">{Number(item?.origSz) * Number(item?.limitPx)} USDC</td>
                                <td className="px-4 py-2">{item?.limitPx}</td>
                                <td className="px-4 py-2">No</td>
                                <td className="px-4 py-2">N/A</td>
                                <td className="px-4 py-2">--</td>
                                <td className="px-4 py-2 text-[#1d73fc] cursor-pointer">Cencel</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default OpenOrders