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
    const perpsTokenList = useSelector(
        (state) => state?.perpetualsData?.perpsTokenList
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
        if (isTokenChanged) {
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
        <div className="w-full bg-[#0a0a0a] overflow-y-scroll h-[95vh]  font-poppins ">
            {/* Token Dropdown */}

            <div className='grid grid-cols-5'>
                <div className='col-span-4 w-full'>
                    <div className='w-full grid lg:grid-cols-4  grid-cols-3'>
                        <div className="relative col-span-1 lg:col-span-3 h-full lg:h-[600px]   w-full text-left ">
                            <div className='border-b-[1px]   border-b-[#404040]  w-full h-[70px] flex items-center justify-center'>
                                <Header
                                    setIsOpen={setIsOpen}
                                    isOpen={isOpen}
                                />
                            </div>
                            {selectedToken?.name ?
                                <div className='w-full h-svh lg:h-[526px] flex items-center justify-center'>
                                    <Chart selectedSymbol={selectedToken?.name} />
                                </div> :
                                null
                            }
                        </div>

                        {/* Order book / trades */}
                        <div className='w-full col-span-1 lg:col-span-1 border-l-[1px] border-l-[#404040]  lg:max-h-[600px] overflow-scroll h-full lg:h-[600px] '>
                            <div className=" backdrop-blur-sm">
                                <div className="backdrop-blur-sm">
                                    <div className="flex  items-center ">
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className={` px-4 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 ${activeTab === 'orders'
                                                ? 'text-white '
                                                : 'text-gray-400 hover:text-white  '
                                                }`}
                                        >
                                            Order Book
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('trades')}
                                            className={`  px-4 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 ${activeTab === 'trades'
                                                ? 'text-white  '
                                                : 'text-gray-400 hover:text-white  '
                                                }`}
                                        >
                                            Trades
                                        </button>
                                    </div>

                                    {selectedToken && (
                                        <div className="h-full">
                                            {activeTab === 'orders' && (
                                                <OrderBook asksData={asksData} bidsData={bidsData} selectedToken={selectedToken} />
                                            )}

                                            {activeTab === 'trades' && (
                                                <Trades trades={tradesData} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-[200px] lg:h-[250px]  border-t-[1px] border-t-[#404040]'>
                        <MainTable />
                    </div>
                </div>
                <div className='w-full border-l-[1px] border-l-[#404040]   h-full col-span-1'>
                    {selectedToken ?
                        <BuySell /> : null}
                </div>
            </div>
        </div>
    )
}

export default Perpetuals

