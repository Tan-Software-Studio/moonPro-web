import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ClosePositionPopup from './ClosePositionPopup';
import NoData from '@/components/common/NoData/noData';

const Positions = () => {
    const [isClosePositionOpen, setisClosePositionOpen] = useState(false)
    const [closeOrderToken, setcloseOrderToken] = useState(0)
    const [orderType, setorderType] = useState('')

    function handleClosePosition(item) {
        setisClosePositionOpen(true)
        setcloseOrderToken(item?.position)

    }

    const orderPositionsData = useSelector(
        (state) => state?.perpetualsData?.orderPositionsData
    );

    const initialLoading = useSelector(
        (state) => state?.perpetualsData?.initialLoading
    );



    if (initialLoading) {
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

    if (!initialLoading && (!orderPositionsData || orderPositionsData.length === 0)) {
        return (
            <div className="flex items-center flex-col  justify-center h-[300px] w-full">
                <NoData title="No positions yet" />
            </div>
        );
    }



    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800 text-sm">
                    <thead className=" text-gray-400">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Coin ↑</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Size</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Position Value</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Entry Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Mark Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">PNL (ROE %)</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Liq. price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Margin</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Funding</th>
                            <th className="px-4 py-2 text-left text-xs font-medium ">Close All</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-white overflow-y-scroll h-full">
                        {orderPositionsData?.assetPositions?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="px-4 py-2">{item?.position?.coin}</td>
                                    <td className={`px-4 py-2 ${Number(item?.position?.szi) > 0 ? "text-green-500" : "text-red-500"} `}>{item?.position?.szi}</td>
                                    <td className="px-4 py-2">{item?.position?.positionValue}</td>
                                    <td className="px-4 py-2">{Number(item?.position?.entryPx).toFixed(2)}</td>
                                    <td className="px-4 py-2">---</td>
                                    <td className="px-4 py-2">{Number(item?.position?.unrealizedPnl).toFixed(2)}</td>
                                    <td className="px-4 py-2">{Number(item?.position?.liquidationPx).toFixed(2)}</td>
                                    <td className="px-4 py-2">{Number(item?.position?.marginUsed).toFixed(2)}</td>
                                    <td className="px-4 py-2">{Number(item?.position?.cumFunding?.allTime).toFixed(2)}</td>
                                    <td className="px-4 py-2 cursor-pointer text-[#1F73FC]"
                                    >
                                        <div className='flex items-center gap-5 text-xs'>
                                            <div onClick={() => {
                                                setorderType("Limit")
                                                handleClosePosition(item)
                                            }}>
                                                Limit
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setorderType("Market")
                                                    handleClosePosition(item)

                                                }}>
                                                Market
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {isClosePositionOpen &&
                <ClosePositionPopup
                    onClose={setisClosePositionOpen}
                    closeOrderToken={closeOrderToken} 
                    orderType={orderType}
                />
            }


        </>
    )
}

export default Positions