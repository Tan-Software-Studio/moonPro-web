"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Trades from './layout/Trades'
import Header from './layout/Header'
import {
  connectBookTicker,
  connectTrades,
  connetMarkPrice,
  disconnectBookTicker,
  disconnectMarkPrice,
  disconnectTrades
} from '@/websocket/socketAsterdex'
import OrderBook from './layout/OrderBook'
import CustomChart from './layout/Chart'
import BuySell from './layout/BuySell'
import MainTable from './layout/table/MainTable'
import Account from './layout/Account'

const Perpetual = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [allToken, setAllToken] = useState([])
  const [selectedToken, setSelectedToken] = useState(null);
  const [isTokenChanged, setIsTokenChanged] = useState(null);  
  const [activeTab, setActiveTab] = useState('orders');
  const [trades, setTrades] = useState([])
  const [orders, setOrders] = useState([])
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);


  async function getAllTokens() {
    try {
      const response = await axios.get(`https://fapi.asterdex.com/fapi/v1/ticker/24hr`, {
        headers: {
          apiKey: "4c266fd53bf07ed37834538e6d4ab33961a4efc736d88d688252c77b39eb28c3",
          secretKey: "51412dd92f82b54be5c70dd2e02145a826af31caeb1803520b34998879bcb72ds"
        }
      })
      if (response?.data && response.data.length > 0) {
        handleTokenSelect(response.data[0])
      }
      setAllToken(response?.data)
    } catch (error) {
    }
  }

  // Selected token Api 
  async function handleTokenSelect(token) {
    try {
      setOrders([])
      setBids([])
      setAsks([])
      const response = await axios.get(`https://fapi.asterdex.com/fapi/v1/premiumIndex?symbol=${token?.symbol}`, {
        headers: {
          apiKey: "4c266fd53bf07ed37834538e6d4ab33961a4efc736d88d688252c77b39eb28c3",
          secretKey: "51412dd92f82b54be5c70dd2e02145a826af31caeb1803520b34998879bcb72ds"
        }
      })

      const baseData = { ...response?.data, "oneDayVolume": token?.quoteVolume }

      setSelectedToken(baseData);
      setIsTokenChanged(baseData)
    } catch (error) {
      console.error("🚀 ~ getAllTokens ~ error:", error)
    }
    setIsOpen(false);
  };


  // Trades Api
  useEffect(() => {
    async function getTrades(symbol) {
      try {
        const response = await axios.get(`https://fapi.asterdex.com/fapi/v1/aggTrades?symbol=${symbol}&limit=50`, {
          headers: {
            apiKey: "4c266fd53bf07ed37834538e6d4ab33961a4efc736d88d688252c77b39eb28c3",
            secretKey: "51412dd92f82b54be5c70dd2e02145a826af31caeb1803520b34998879bcb72ds"
          }
        })
        setTrades(response?.data);
      } catch (error) {
        console.error("🚀 ~ useEffect ~ error:", error)
      }
    }
    if (selectedToken?.symbol) {
      let symbol = selectedToken?.symbol.toLowerCase()
      getTrades(symbol)
    }
  }, [isTokenChanged]);


  // Trades socket
  useEffect(() => {
    if (selectedToken?.symbol) {
      connectTrades(selectedToken?.symbol, setTrades)
    }

    return () => disconnectTrades()
  }, [isTokenChanged]);


  // Order book socket 
  useEffect(() => {
    let symbol = selectedToken?.symbol?.toLowerCase()
    connectBookTicker(symbol, setOrders);

    return () => disconnectBookTicker()
  }, [isTokenChanged]);


  // Market price socket
  useEffect(() => {
    if (selectedToken?.symbol) {
      connetMarkPrice(selectedToken?.symbol, setSelectedToken)
    }
    return () => disconnectMarkPrice()
  }, [isTokenChanged]);

  useEffect(() => {
    getAllTokens()
  }, [])


  return (
    <div className="w-full bg-[#0a0a0a] overflow-y-scroll h-[95vh] p-1 font-poppins ">
      {/* Token Dropdown */}

      <div className='w-full grid grid-cols-1 lg:grid-cols-5 gap-1'>
        <div className="relative col-span-1 lg:col-span-3   h-full lg:h-[600px]   w-full text-left ">
          <Header
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            allToken={allToken}
            handleTokenSelect={handleTokenSelect}
            selectedToken={selectedToken}
          />

          {selectedToken?.symbol ?
            <div className='bg-[#1a1a1a] w-full h-svh lg:h-[526px] mt-1 flex items-center justify-center'>
              <CustomChart selectedSymbol={selectedToken?.symbol} />
            </div>
            :
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1a1a]">
              <div className="w-12 h-12 border-4 border-[#2962ff] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        </div>

        <div className='w-full col-span-1 lg:col-span-1 bg-[#1a1a1a]  lg:max-h-[600px] overflow-scroll h-full lg:h-[600px] order-2 lg:order-1'>
          {selectedToken && (
            <div className=" bg-[#1a1a1a]  backdrop-blur-sm">
              {/* Headers */}
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

              <div className="h-full">
                {activeTab === 'orders' && (
                  <OrderBook orders={orders} selectedToken={selectedToken} bids={bids} setBids={setBids} asks={asks} setAsks={setAsks} />
                )}

                {activeTab === 'trades' && (
                  <Trades trades={trades} />
                )}
              </div>
            </div>
          )}
        </div>

        <div className='w-full bg-[#1a1a1a]   lg:max-h-[600px] h-full lg:h-[600px] col-span-1 lg:col-span-1 order-1 lg:order-2'>
          <BuySell  selectedSymbol={selectedToken?.symbol} />
        </div>

      </div>
      <div className='w-full grid grid-cols-1 lg:grid-cols-5 mt-1 gap-1'>
        <div className='col-span-1 lg:col-span-4 w-full h-[200px] lg:h-[250px] bg-[#1a1a1a] order-2 lg:order-1'>
          <MainTable />
        </div>
        <div className='col-span-1 lg:col-span-1 w-full h-[200px] lg:h-[250px] bg-[#1a1a1a] order-1 lg:order-2'>
          <Account />
        </div>
      </div>
    </div>
  )
}

export default Perpetual