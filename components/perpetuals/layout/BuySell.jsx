import React, { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'

const BuySell = () => {
    const [activeTab, setActiveTab] = useState('buy')
    const [orderType, setOrderType] = useState('Market')
    const [size, setSize] = useState(32)
    const [reduceOnly, setReduceOnly] = useState(false)
    const [tpSl, setTpSl] = useState(false)
    const [hiddenOrder, setHiddenOrder] = useState(false)

    return (
        <div className=" overflow-auto max-h-full text-white p-4 max-w-sm mx-auto">
            {/* Buy/Sell Tabs */}
            <div className="flex">
                <button
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${activeTab === 'buy'
                        ? 'bg-[#1B3B39] border-[#207E79] border text-white'
                        : 'bg-[#08080E] border-[#08080E] border text-gray-400 hover:text-white'
                        }`}
                    onClick={() => setActiveTab('buy')}
                >
                    Buy
                </button>
                <button
                    className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${activeTab === 'sell'
                        ? 'bg-[#432823] border border-[#F0694B] text-white'
                        : 'bg-[#08080E] border-[#08080E] border text-gray-400 hover:text-white'
                        }`}
                    onClick={() => setActiveTab('sell')}
                >
                    Sell
                </button>
            </div>

            {/* Order Type Selector */}
            <div className="flex  mt-2 text-sm">
                <button
                    className={` text-base font-medium py-1 mr-3 ${orderType === 'Market'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    onClick={() => setOrderType('Market')}
                >
                    Market
                </button>
                <button
                    className={`px-3 text-base font-medium py-1 mr-3 ${orderType === 'Limit'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    onClick={() => setOrderType('Limit')}
                >
                    Limit
                </button>
                <button
                    className={`px-3 text-base font-medium py-1 text-gray-400 hover:text-white flex items-center ${orderType === 'Stop Limit' ? 'text-white' : ''}`}
                    onClick={() => setOrderType('Stop Limit')}
                >
                    Stop Limit
                    <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                <Info className="w-4 h-4 text-gray-500 ml-auto mt-1" />
            </div>

            {/* Available Balance */}
            <div className="flex justify-between items-center mt-2 text-sm">
                <div className='flex items-center gap-1'>
                    <span className="text-gray-400">Avbl</span>
                    <div className="flex items-center">
                        <span className="text-white mr-2">0.00 USDT</span>
                        <Info className="w-3 h-3 text-gray-500" />
                    </div>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Cross</span>
                    <span className="text-white">20x</span>
                </div>
            </div>

            {/* Stop Price - only show for Stop Limit */}
            {orderType === 'Stop Limit' && (
                <div className="mt-2">
                    <div className="relative">
                        <div className='flex items-center justify-between w-full bg-[#1a1a1a] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                            <input
                                type="text"
                                placeholder='Stop Price'
                                className=" focus:outline-none focus:border-none   bg-[#1a1a1a] text-white border-none"
                            />
                            <div className="flex items-center">
                                <span className="text-white text-sm mr-2">Mark</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {/* Price - show for Limit and Stop Limit */}
            {(orderType === 'Limit' || orderType === 'Stop Limit') && (
                <div className="mt-2">
                    <div className="relative">
                        <div className='flex items-center justify-between w-full bg-[#1a1a1a] border border-gray-600 rounded px-3 py-2 text-white text-sm'>
                            <input
                                type="text"
                                placeholder='price'
                                className=" focus:outline-none focus:border-none   bg-[#1a1a1a] text-white border-none"
                            />
                            <div className="text-white w-fit text-sm">USDT</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Size Controls */}
            <div className="mt-2">

                {/* Size Input */}
                <div className="relative mt-2">
                    <div className='flex items-center justify-between  w-full bg-[#1a1a1a] border border-gray-600 rounded px-3 py-2 text-white text-sm '>
                        <input
                            type="text"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="focus:outline-none w-full bg-[#1a1a1a] focus:border-none"
                            placeholder="Size"
                        />
                        <div className="flex justify-between items-center gap-1">
                            <span className="text-gray-400 text-sm">Size</span>
                            <div className="flex items-center">
                                <span className="text-white text-sm mr-2">BTC</span>
                                <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <div className="relative mt-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>0%=0.0</span>
                        <span>Max 0.0</span>
                    </div>
                    {/* Slider markers */}
                    <div className="flex justify-between absolute top-0 w-full pointer-events-none">
                        <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Hidden Order - only show for Limit orders */}
            {orderType === 'Limit' && (
                <div className="mt-2">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={hiddenOrder}
                                onChange={(e) => setHiddenOrder(e.target.checked)}
                                className="w-4 h-4 text-green-600   border-gray-600 rounded focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-white">Hidden Order</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-400 text-sm mr-1">TIF</span>
                            <span className="text-white text-sm mr-1">GTC</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                    </label>
                </div>
            )}

            {/* Checkboxes */}
            <div className="mt-4 space-y-3">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={reduceOnly}
                        onChange={(e) => setReduceOnly(e.target.checked)}
                        className="w-4 h-4 text-green-600 bg-[#1a1a1a] border-gray-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-white">Reduce-Only</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={tpSl}
                        onChange={(e) => setTpSl(e.target.checked)}
                        className="w-4 h-4 text-green-600 bg-[#1a1a1a] border-gray-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-white">TP/SL</span>
                </label>
            </div>

            {/* TP/SL Section - only show if TP/SL is checked */}
            {tpSl && (
                <div className="mt-4 space-y-4">
                    {/* TP (Take Profit) */}
                    <div className='flex items-center '>
                        <div className="relative">
                            <div className='flex items-center justify-between w-fit bg-[#1a1a1a] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                <input
                                    type="text"
                                    placeholder='TP'
                                    className=" focus:outline-none focus:border-none   bg-[#1a1a1a] text-white border-none"
                                />
                                <div className="flex items-center">
                                    <span className="text-white text-sm mr-2">Mark</span>
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {/* <div className="relative">
                            <div className='flex items-center justify-between w-fit bg-[#1a1a1a] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                <input
                                    type="text"
                                    placeholder='PNL'
                                    className=" focus:outline-none focus:border-none   bg-[#1a1a1a] text-white border-none"
                                />
                                <div className="flex items-center">
                                    <span className="text-white text-sm mr-2">%</span>
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                </div>
                            </div>
                        </div> */}


                    </div>

                    {/* SL (Stop Loss) */}
                    <div className='flex items-center '>
                        <div className="relative">
                            <div className='flex items-center justify-between w-fit bg-[#1a1a1a] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                <input
                                    type="text"
                                    placeholder='SL'
                                    className=" focus:outline-none focus:border-none   bg-[#1a1a1a] text-white border-none"
                                />
                                <div className="flex items-center">
                                    <span className="text-white text-sm mr-2">Mark</span>
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {/* <div className="relative">
                            <div className='flex items-center justify-between w-fit bg-[#1a1a1a] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                <input
                                    type="text"
                                    placeholder='PNL'
                                    className=" focus:outline-none focus:border-none   bg-[#1a1a1a] text-white border-none"
                                />
                                <div className="flex items-center">
                                    <span className="text-white text-sm mr-2">%</span>
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                </div>
                            </div>
                        </div> */}


                    </div>
                </div>
            )}

            {/* Deposit Button */}
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2   text-sm font-medium transition-colors mt-2">
                Deposit
            </button>

            {/* Trading Info */}
            <div className="space-y-2 mt-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Margin</span>
                    <span className="text-white">0.00 USDT</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Est liq. price</span>
                    <span className="text-white">--</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Fee</span>
                    <span className="text-white">0.0350% / 0.0100%</span>
                </div>
            </div>

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #fbbf24;
                    cursor: pointer;
                    border: 2px solid #1f2937;
                }
                
                .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #fbbf24;
                    cursor: pointer;
                    border: 2px solid #1f2937;
                }
            `}</style>
        </div>
    )
}

export default BuySell