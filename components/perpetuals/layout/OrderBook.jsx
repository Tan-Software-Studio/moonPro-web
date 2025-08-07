import React from 'react'

const OrderBook = ({ asksData, bidsData, selectedToken }) => {
  const maxBidTotal = Math.max(...bidsData.map((b) => b.n));
  const maxAskTotal = Math.max(...asksData.map((a) => a.n));
  return (
    <div className="font-mono h-full">
      {/* Headers */}
      <div className="grid grid-cols-3 py-1 gap-4 items-center border-b border-gray-700 bg-[#1a1a1a]">
        <div className="text-gray-400 text-xs font-medium px-3">Price</div>
        <div className="text-gray-400 text-xs font-medium text-right px-2">Size</div>
        <div className="text-gray-400 text-xs font-medium text-right px-3">Total</div>
      </div>

      <div className="custom-scrollbar  h-full">
        <div className="h-full flex flex-col">

          {/* Bids */}
          <div className="min-h-[250px] flex flex-col justify-end">
            {bidsData?.slice(0, 10)?.map((bid, ind) => (
              <div key={`bid-${ind}`} className="grid grid-cols-3 gap-2 items-center py-1 hover:bg-[#1a1a1a] transition-colors relative group min-h-[20px] max-h-[25px]">
                <div
                  className="absolute left-0 top-0 h-full bg-red-500/10"
                  style={{
                    width: `${(bid.n / maxBidTotal) * 100}%`,
                    transition: 'width 0.2s ease-in-out',
                  }}
                ></div>

                <div className="text-red-400 text-xs px-3 relative z-10 tabular-nums">
                  {Number(bid?.px)?.toFixed(2)}
                </div>
                <div className="text-white text-xs text-right px-2 relative z-10 tabular-nums">
                  {Number(bid?.sz)?.toFixed(5)}
                </div>
                <div className="text-gray-300 text-xs text-right px-3 relative z-10 tabular-nums">
                  {Number(bid?.n)?.toFixed(5)}
                </div>
              </div>
            ))}
          </div>

          {/* Mark Price */}
          <div className="bg-[#1a1a1a] py-2 px-4 border-y border-gray-600 relative min-h-[36px] flex items-center  ">
            {selectedToken?.markPx ? (
              <span className="text-green-400 font-mono text-xs font-bold">
                ${Number(selectedToken.markPx).toFixed(2)}
              </span>
            ) : (
              <span className="text-gray-400 text-xs">Loading...</span>
            )}
          </div>

          {/* Asks */}

          <div className=" min-h-[200px]">
            {asksData?.slice(0, 10)?.map((ask, ind) => (
              <div key={`ask-${ind}`} className="grid grid-cols-3 gap-2 items-center py-1 hover:bg-[#1a1a1a] transition-colors relative group min-h-[20px] max-h-[25px]">

                <div
                  className="absolute left-0 top-[1px] h-full bg-green-500/10 "
                  style={{
                    width: `${(ask.n / maxAskTotal) * 100}%`,
                    transition: 'width 0.2s ease-in-out',
                  }}
                ></div>

                <div className="text-green-400 text-xs px-3 relative z-10 tabular-nums">
                  {Number(ask?.px)?.toFixed(2)}
                </div>
                <div className="text-white text-xs text-right px-2 relative z-10 tabular-nums">
                  {Number(ask?.sz)?.toFixed(5)}
                </div>
                <div className="text-gray-300 text-xs text-right px-3 relative z-10 tabular-nums">
                  {Number(ask?.n)?.toFixed(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBook