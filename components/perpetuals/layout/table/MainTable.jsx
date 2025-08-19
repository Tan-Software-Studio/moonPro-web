import React, { useEffect, useState } from 'react'
import Positions from './Positions';
import OpenOrders from './OpenOrders';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenOrdersData } from '@/app/redux/perpetauls/perpetual.slice';
import TradesTable from './TradesTable';
import { fetchHyperliquidData } from '@/services/hyperLiquid/hyperLiquidApi';
import OrderHistory from './OrderHistory';
const MainTable = () => {

    const [selectedTab, setSelectedTab] = useState('Positions');
    const dispatch = useDispatch()
    const [openOrdersLoading, setOpenOrdersLoading] = useState(false)

    // Trades Loading & data
    const [tradesData, setTradesData] = useState([]);
    const [tradesLoading, setTradesLoading] = useState(false)

    //  Funding History Loading & data
    const [orderHistoryData, setOrderHistoryData] = useState([]);
    const [orderHistoryLoading, setOrderHistoryLoading] = useState(false)

    const userDetails = useSelector((state) => state?.userData?.userDetails);
    const orderPositionsData = useSelector(
        (state) => state?.perpetualsData?.orderPositionsData
    );

    const OpenOrdersData = useSelector(
        (state) => state?.perpetualsData?.OpenOrdersData
    );

    const Trades = [
        {
            title: 'Positions',
            name: `Positions (${orderPositionsData?.assetPositions?.length || 0})`,

        },
        {
            title: 'Open orders',
            name: `Open orders (${OpenOrdersData?.length ? OpenOrdersData?.length : 0}) `,
        },
        {
            title: 'Trades',
            name: 'Trades',
            callbackFun: handleTrades
        },
        {
            title: 'Order',
            name: 'Order History',
            callbackFun: handleOrderHistory
        }

    ]


    // Open order api
    async function handleOpenOrders() {
        try {
            setOpenOrdersLoading(true)
            const data = await fetchHyperliquidData("openOrders", userDetails?.perpsWallet)
            dispatch(setOpenOrdersData(data))
            setOpenOrdersLoading(false)

        } catch (error) {
            setOpenOrdersLoading(false)
        }
    }

    // Trades api api
    async function handleTrades() {
        try {
            setTradesLoading(true)
            const data = await fetchHyperliquidData("userFills", userDetails?.perpsWallet)
            setTradesData(data)
            setTradesLoading(false)

        } catch (error) {
            setTradesLoading(false)
        }
    }

    // Order history api
    async function handleOrderHistory() {
        setOrderHistoryLoading(true)
        try {
            const response = await fetchHyperliquidData("historicalOrders", userDetails?.perpsWallet)
            setOrderHistoryData(response)
            setOrderHistoryLoading(false)
        } catch (error) {
            console.log("🚀 ~ handleOrderHistory ~ error:", error)
            setOrderHistoryLoading(false)
        }
    }

    useEffect(() => {
        if (userDetails?.perpsWallet) {
            handleOpenOrders()
        }
    }, [userDetails?.perpsWallet])

    return (
        <div>

            <div className=' font-sans  w-full'>
                <div className='py-2 px-5 flex items-center gap-6 w-full overflow-x-auto border-b border-gray-800'>
                    {Trades.map((item, index) => (
                        <div
                            key={index}
                            className={`${selectedTab == item?.title ? "text-white" : "text-gray-400 hover:text-white"}  font-semibold cursor-pointer text-sm`}
                            onClick={() => {
                                setSelectedTab(item?.title)
                                if (item?.callbackFun && userDetails?.perpsWallet) {
                                    item?.callbackFun()
                                }
                            }}
                        >
                            {item?.name}
                        </div>
                    ))}
                </div>
                {selectedTab == "Positions" &&
                    <Positions />
                }
                {selectedTab == 'Open orders' &&
                    <OpenOrders openOrdersLoading={openOrdersLoading} />
                }
                {selectedTab == 'Trades' &&
                    <TradesTable tradesData={tradesData} tradesLoading={tradesLoading} />
                }
                {selectedTab == 'Order' &&
                    <OrderHistory orderHistoryData={orderHistoryData} orderHistoryLoading={orderHistoryLoading} />
                }
            </div>
        </div>
    )
}

export default MainTable