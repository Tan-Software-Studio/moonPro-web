import React, { useEffect, useState } from 'react'
import SwapPopup from '../popup/SwapPopup'
import { useSelector } from 'react-redux'
import { humanReadableFormatWithNoDollar } from '@/utils/basicFunctions'
import { spotClearinghouseState } from '@/services/hyperLiquid/spotClearinghouseState '
import { IoSwapHorizontal } from 'react-icons/io5'
import LeaveragePopup from '../popup/LeaveragePopup'
import SlippagePopup from '../popup/SlippagePopup'
const BuySell = ({ selectedToken }) => {
    let symbol = selectedToken?.name?.slice(0, 4)
    const leverage = selectedToken?.maxLeverage || 100;

    const [symbolSelected, setSymbolSelected] = useState(symbol)
    const [spotBalance, setSpotBalance] = useState({});
    
    // Tabs
    const [activeTab, setActiveTab] = useState('buy')
    const [orderType, setOrderType] = useState('Market')
    
    // inputs  
    const [maxLeverage, setMaxLeverage] = useState(leverage / 2);
    const [usdcAmount, setUsdcAmount] = useState(0)
    const [size, setSize] = useState(0)
    const [slippageAmount, setSlippageAmount] = useState(8);

    // popups // dropdowna
    const [tpSl, setTpSl] = useState(false);
    const [isSlippagePopup, setIsSlippagePopup] = useState(false)
    const [isLeaveragePopup, setIsLeaveragePopup] = useState(false)
    const [isSwapPopup, setIsSwapPopup] = useState(false)

    const orderPositionsData = useSelector(
        (state) => state?.perpetualsData?.orderPositionsData
    );
    const activeSolWalletAddress = useSelector(
        (state) => state?.userData?.activeSolanaWallet
    );

    const usdcBalance = orderPositionsData ? humanReadableFormatWithNoDollar(Number(orderPositionsData?.crossMarginSummary?.accountValue), 2) : 0
    const usdcBalanceNum = Number(orderPositionsData?.crossMarginSummary?.accountValue)


    function handleAmountInput(e) {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;

        if (value === '' || regex.test(value)) {
            const num = parseFloat(value);

            if (value === '') {
                setUsdcAmount('');
                setSize(0);
            } else if (!isNaN(num)) {
                const clampedValue = Math.min(num, usdcBalanceNum);
                setUsdcAmount(clampedValue);
                const newSize = (clampedValue / usdcBalanceNum) * 100;
                setSize(newSize);
            }
        }
    }

    function handleSliderChange(e) {
        const percent = parseFloat(e.target.value);
        setSize(percent);

        const calculatedAmount = ((percent / 100) * usdcBalanceNum).toFixed(4);
        setUsdcAmount(parseFloat(calculatedAmount));
    }

    async function spotApi() {
        try {
            const response = await spotClearinghouseState("0xf58b673c1633ccef0ac58263cdc95ed80f817fc7                                                                                                                                                                                                                                                                                                  ");
            const spot = response?.find((item) => item?.coin == "USDC")
            setSpotBalance(spot)
        } catch (err) {
            console.error("❌ API Error:", err?.response?.data || err.message);
        }
    }
    useEffect(() => {
        spotApi()
    }, []);


    return (
        <>
            <div className=" overflow-auto max-h-[90vh] text-white p-4 max-w-sm mx-auto">
                {/* Buy/Sell Tabs */}
                <div className="flex border border-[#22242D] rounded p-[1px] ">
                    <button
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${activeTab === 'buy'
                            ? 'bg-[#1F73FC] rounded text-white'
                            : 'bg-[#08080E]  text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('buy')}
                    >
                        Buy
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-all ${activeTab === 'sell'
                            ? 'bg-[#ED1B24] rounded'
                            : 'bg-[#08080E]  text-gray-400 hover:text-white'
                            }`}
                        onClick={() => setActiveTab('sell')}
                    >
                        Sell
                    </button>
                </div>

                {/* Order Type Selector */}
                <div className="flex gap-1.5  justify-between mt-4 text-sm">
                    <div className='flex gap-1.5 '>
                        <button
                            className={` text-xs font-medium py-1   ${orderType === 'Market'
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                            onClick={() => setOrderType('Market')}
                        >
                            Market
                        </button>
                        <button
                            className={`px-3 text-xs font-medium py-1 ${orderType === 'Limit'
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                            onClick={() => setOrderType('Limit')}
                        >
                            Limit
                        </button>
                    </div>

                    <div
                        onClick={() => setIsLeaveragePopup(true)}
                        className='border border-[#22242D] bg-[#22242D] p-[3px] rounded-md text-xs cursor-pointer'>
                        Leverage: {maxLeverage || 0}x
                    </div>
                </div>


                {/* Size Controls */}
                <div className="mt-2 w-full">
                    {/* Buy Amount Input Box */}
                    <div className=" bg-[#1D1E26] rounded-lg px-4 py-3 text-white text-sm">
                        <div className='flex justify-between items-center'>
                            <div className="text-xs text-gray-400">Buy Amount</div>
                            <div>{symbolSelected || "usdt"}</div>
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="number"
                                value={usdcAmount}
                                placeholder='0.0 USDC'
                                onChange={(e) => handleAmountInput(e)}
                                className="bg-transparent text-lg font-medium  focus:outline-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Slider */}
                    <div className="relative mt-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={size}
                            onChange={handleSliderChange}
                            className="w-full h-1 bg-transparent appearance-none"
                        />

                        {/* Slider Labels */}
                        <div className="flex justify-between text-xs text-white mt-2 px-[2px]">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>



                {/* Price - show for Limit and Stop Limit */}
                {
                    (orderType === 'Limit') && (
                        <div className="mt-2">
                            <div className=" bg-[#1D1E26] rounded-lg px-4 py-3 text-white text-sm">
                                <div className='flex justify-between items-center'>
                                    <div className="text-xs text-gray-400">Limit Price</div>
                                    <div className='text-gray-400'>{selectedToken ? selectedToken?.markPx : "--"}</div>
                                </div>
                                <div className="flex flex-col">
                                    <input
                                        type="number"
                                        placeholder={`$${selectedToken?.markPx}`}
                                        className="bg-transparent text-sm font-medium focus:outline-none placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="mt-4 space-y-3">
                    <div className='flex items-center justify-between'>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={tpSl}
                                onChange={(e) => setTpSl(e.target.checked)}
                                className="appearance-none w-4 h-4 border border-gray-500 bg-[#1a1a1a] checked:bg-gray-500 checked:border-gray-500 rounded-none"
                            />
                            <span className="ml-2 text-xs text-white">TP/SL</span>
                        </label>
                        <div className="text-xs">Est. Liq. Price:</div>
                    </div>
                </div>


                {/* TP/SL Section - only show if TP/SL is checked */}
                {tpSl && (
                    <div className="mt-4 space-y-4">
                        {/* TP (Take Profit) */}
                        <div className='flex items-center '>
                            <div className="flex items-center justify-between gap-3">
                                <div className='flex items-center justify-between w-fit bg-[#1D1E26] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                    <input
                                        type="text"
                                        placeholder='TP'
                                        className=" focus:outline-none focus:border-none   bg-[#1D1E26] text-white border-none"
                                    />
                                </div>
                                <div className='flex items-center justify-between w-fit bg-[#1D1E26] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                    <input
                                        type="text"
                                        placeholder='0.0'
                                        className=" focus:outline-none focus:border-none w-5  bg-[#1D1E26] text-white border-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SL (Stop Loss) */}
                        <div className='flex items-center '>
                            <div className="flex items-center justify-between gap-3">
                                <div className='flex items-center justify-between w-fit bg-[#1D1E26] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                    <input
                                        type="text"
                                        placeholder='SL'
                                        className=" focus:outline-none focus:border-none   bg-[#1D1E26] text-white border-none"
                                    />
                                </div>
                                <div className='flex items-center justify-between w-fit bg-[#1D1E26] border-gray-600 border rounded px-3 py-2 text-white text-sm'>
                                    <input
                                        type="text"
                                        placeholder='0.0'
                                        className=" focus:outline-none focus:border-none  w-5 bg-[#1D1E26] text-white border-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

                <button
                    disabled={usdcAmount >= 2 && usdcBalance}
                    className={`w-full mt-20 ${usdcAmount >= 2 && usdcBalance ? "bg-[#1F73FC]" : "bg-[#1F73FC]/50"}  py-2 rounded  text-sm font-medium transition-colors `}>
                    Place order
                </button>

                {/* <div className='border-b-gray-600 border-b'></div> */}

                <div className="space-y-3 mt-5 text-xs border-t-gray-600 pt-5 border-t">
                    <div className="flex justify-between ">
                        <div className="text-gray-400">Order Value</div>
                        <div className="text-white">{usdcAmount ? usdcAmount : "N/A"}</div>

                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Slippage</div>
                        <div
                            onClick={() => setIsSlippagePopup(true)}
                            className="text-white cursor-pointer">Est: 1% / Max: {slippageAmount}%</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Fees</div>
                        <div className="text-[#6683ff]"> 0.0700% / 0.0400%</div>
                    </div>
                </div>


                {/* Deposit Button */}
                <button
                    onClick={() => setIsSwapPopup(!isSwapPopup)}
                    className={`w-full ${activeTab == "buy" ? "bg-[#1F73FC]" : "bg-[#ED1B24]"} py-2 rounded mt-8 text-sm font-medium transition-colors `}>
                    Deposite
                </button>

                <div className='flex items-center gap-3'>
                    <button
                        className={`w-full flex items-center justify-center gap-2 text-[#1F73FC] border border-[#1F73FC]  py-2 rounded mt-3 text-sm font-medium transition-colors `}>
                        <span> Perps </span>
                        <IoSwapHorizontal />
                        <span> Spot </span>
                    </button>
                    <button
                        className={`w-full  bg-[#1F73FC]  py-2 rounded mt-3 text-sm font-medium transition-colors `}>
                        Withdraw
                    </button>
                </div>

                {/* Trading Info */}
                <div className="space-y-3 mt-5 text-xs">

                    {/* <div className="flex justify-between border-b-gray-600 pb-5 border-b">
                        <div className="text-gray-400">Available Margin</div>
                        <div onClick={() => setIsSwapPopup(!isSwapPopup)} className="text-[#6683ff] bg-[#22242D80] cursor-pointer p-0.5 rounded">
                            {orderPositionsData ? humanReadableFormatWithNoDollar(Number(orderPositionsData?.crossMarginSummary?.accountValue), 2) : "--"} USDC
                        </div>
                    </div> */}

                    <div className='text-sm'>Account Equity</div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Spot</div>
                        <div className="text-white">{spotBalance?.total ? Number(spotBalance?.total).toFixed(2) : "0"} USDC</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Perps</div>
                        <div className="text-white">{usdcBalance} USDC</div>
                    </div>


                    <div className='text-sm'>Perps Overview</div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Balance</div>
                        <div className="text-white">{usdcBalance} USDC</div>
                    </div>

                    <div className="flex justify-between">
                        <div className="text-gray-400">Unrealized PNL</div>
                        <div className="text-white">$0.00</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Cross Margin Ratio</div>
                        <div className="text-white">0.00%</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Maintenance Margin</div>
                        <div className="text-white">$0.00</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-gray-400">Cross Account Leverage</div>
                        <div className="text-white">0.00%</div>
                    </div>
                </div>

                <style jsx>{`
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 12px;
        width: 12px;
        background: #526FFF;
        border-radius: 9999px;
        cursor: pointer;
        margin-top: -6px;
      }
      input[type="range"]::-webkit-slider-runnable-track {
        height: 2px;
        background: #444;
        border-radius: 9999px;
      }
    `}</style>

            </div >

            {isSwapPopup ?
                <SwapPopup onClose={setIsSwapPopup} usdcBalance={usdcBalance} SolBalance={activeSolWalletAddress?.balance} /> : null
            }

            {isLeaveragePopup ?
                <LeaveragePopup
                    maxLeverage={maxLeverage}
                    setMaxLeverage={setMaxLeverage}
                    leverage={leverage}
                    onClose={setIsLeaveragePopup} /> : null
            }

            {isSlippagePopup ?
                <SlippagePopup
                    onClose={setIsSlippagePopup} 
                    setSlippageAmount={setSlippageAmount}
                    slippageAmount={slippageAmount}
                    /> : null
            }

        </>
    )
}

export default BuySell