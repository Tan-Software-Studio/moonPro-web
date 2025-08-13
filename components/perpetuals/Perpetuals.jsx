"use client"
import React, { useEffect, useState } from 'react'
import Chart from './layout/Chart'
import axios from 'axios'
import Header from './layout/Header/Header'
import {
    disconnectAllTokens,
    disconnectMarketPriceSocket,
    disconnectOrderBookSocket,
    disconnectTradesSocket,
    marketPriceSocketConnect,
    marketPriceSocketConnectAllTokens,
    orderBookSocketConnect,
    tradesSocketConnect
}
    from '@/websocket/hyperLiquidSocket'
import OrderBook from './layout/OrderBook'
import Trades from './layout/Trades'
import BuySell from './layout/BuySell'
import MainTable from './layout/table/MainTable'
import { useDispatch, useSelector } from 'react-redux'
import { orderPositions, setIsTokenChanged, setPerpsTokenList, setSelectedToken } from '@/app/redux/perpetauls/perpetual.slice'
const url = process.env.NEXT_PUBLIC_BASE_URLS
const Perpetuals = () => {

    const [activeTab, setActiveTab] = useState('orders');
    const [tradesData, setTradesData] = useState([]);
    const [bidsData, setBidsData] = useState([]);
    const [asksData, setAsksData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const selectedToken = useSelector(
        (state) => state?.perpetualsData?.selectedToken
    );

    const isTokenChanged = useSelector(
        (state) => state?.perpetualsData?.isTokenChanged
    );

    const userDetails = useSelector((state) => state?.userData?.userDetails);

    async function getPerpsTokenList() {
        try {
            const response = await axios.get(`${url}perpetual/getPerpetualTokens`);
            dispatch(setPerpsTokenList(response?.data?.data));
            dispatch(setSelectedToken(response?.data?.data[0]));
            dispatch(setIsTokenChanged(response?.data?.data[0]));
        } catch (error) {
            console.error(error)
        }
    }

    // Socket interegration
    useEffect(() => {
        if (isTokenChanged && selectedToken?.name) {
            tradesSocketConnect(selectedToken?.name, setTradesData)
            orderBookSocketConnect(selectedToken?.name, setBidsData, setAsksData)
            marketPriceSocketConnect(selectedToken?.name, dispatch)
        }
        return () => {
            disconnectTradesSocket()
            disconnectOrderBookSocket()
            disconnectMarketPriceSocket()
        };

    }, [isTokenChanged])

    // All tokens update in dropdown
    // useEffect(() => {
    //     if (perpsTokenList.length > 0) {
    //         marketPriceSocketConnectAllTokens(perpsTokenList, dispatch);
    //     }
    //     return () => {
    //         disconnectAllTokens();
    //     };
    // }, [isTokenChanged]);

    // PerpsToken list 
    useEffect(() => {
        getPerpsTokenList();
    }, [])


    useEffect(() => {
        if (userDetails?.perpsWallet) {
            dispatch(orderPositions(userDetails?.perpsWallet));
        }
    }, [userDetails]);

    return (
        <div className="w-full bg-[#0a0a0a] h-svh font-poppins">
            {/* Token Dropdown */}

            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5">
                {/* LEFT CONTENT */}
                <div className="lg:col-span-3 xl:col-span-4 w-full  overflow-y-auto">
                    <div className="w-full grid-cols-1 grid xl:grid-cols-4 lg:grid-cols-3">
                        {/* CHART */}
                        <div className="relative lg:col-span-2 xl:col-span-3 h-full lg:h-[600px] w-full text-left">
                            <div className="border-b border-b-[#404040] w-full h-[70px] flex items-center justify-center">
                                <Header setIsOpen={setIsOpen} isOpen={isOpen} />
                            </div>

                            {selectedToken?.name && (
                                <div className="w-full h-[600px] lg:h-[526px] flex items-center justify-center">
                                    <Chart selectedSymbol={selectedToken?.name} />
                                </div>
                            )}

                            {/* Buy/Sell on small screens */}
                            <div className="lg:hidden border-t border-[#404040]">
                                {selectedToken && <BuySell />}
                            </div>
                        </div>

                        {/* ORDER BOOK / TRADES */}
                        <div className="w-full lg:col-span-1 xl:col-span-1 border-l border-l-[#404040] lg:max-h-[600px]   h-full lg:h-[600px]">
                            {/* Tabs always at top */}
                            <div className="flex items-center sticky top-0 bg-[#0a0a0a] z-10">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`px-4 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 ${activeTab === 'orders'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Order Book
                                </button>
                                <button
                                    onClick={() => setActiveTab('trades')}
                                    className={`px-4 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 ${activeTab === 'trades'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Trades
                                </button>
                            </div>

                            {selectedToken && (
                                <div className="h-full">
                                    {activeTab === 'orders' && (
                                        <OrderBook
                                            asksData={asksData}
                                            bidsData={bidsData}
                                            selectedToken={selectedToken}
                                        />
                                    )}
                                    {activeTab === 'trades' && <Trades trades={tradesData} />}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MAIN TABLE */}
                    <div className="w-full h-[200px] lg:h-[250px] border-t border-t-[#404040]">
                        <MainTable />
                    </div>
                </div>

                {/* BUY/SELL on large screens */}
                <div className="hidden lg:block border-l border-l-[#404040] h-full lg:col-span-1 xl:col-span-1">
                    {selectedToken && <BuySell />}
                </div>
            </div>
        </div>


    )
}

export default Perpetuals

