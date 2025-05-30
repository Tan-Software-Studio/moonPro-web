import React from 'react'
import { RiExchangeDollarLine } from "react-icons/ri";
import { formatDecimal, humanReadableFormatWithNoDollar } from '@/utils/basicFunctions';

// use map instead change in future
const UserPnL = ({userTokenHoldings, currentPrice}) => {
    const getUnrealizedPnL = (
      averageBuyPrice,
      quantityHeld
    ) => {
      if (!averageBuyPrice || !quantityHeld) {
        return {
          isPositive: true,
          formatString: `+$0 (+0%)`
        }
      }
      const priceDiff = currentPrice - averageBuyPrice
      const pnlAmount = priceDiff * quantityHeld
      const pnlPercent =
        averageBuyPrice && averageBuyPrice !== 0
          ? (priceDiff / averageBuyPrice) * 100
          : 0;
      const sign = pnlAmount >= 0 ? '+' : '-'

      const formattedAmount = `${pnlAmount > 1 || pnlAmount < -1
          ? Math.abs(humanReadableFormatWithNoDollar(pnlAmount))
          : Math.abs(formatDecimal(pnlAmount))
      }`

      // Format percentage with .00 check
      let formattedPercent;
      const fixedPercent = Math.abs(pnlPercent).toFixed(2);
      if (fixedPercent.endsWith('.00')) {
        formattedPercent = `${Math.abs(pnlPercent).toFixed(0)}%`;
      } else {
        formattedPercent = `${fixedPercent}%`;
      }

      return {
        isPositive: sign === '+',
        formatString: `${sign}$${formattedAmount} (${sign}${formattedPercent})`
      }
    }
    const tempSoldAmount = userTokenHoldings?.quantitySold * userTokenHoldings?.averageBuyPrice;
    const tempHoldingAmount = userTokenHoldings?.activeQtyHeld * userTokenHoldings?.averageBuyPrice;
    const pnl = getUnrealizedPnL(userTokenHoldings?.averageBuyPrice, userTokenHoldings?.activeQtyHeld);
    const positivePnl = pnl?.isPositive;
    const pnlValue = pnl?.formatString;
  return (
        <div className="bg-[#08080E] border-t w-full px-3 py-1 border-[#4D4D4D] items-center flex justify-between">
          <div
            className={`select-none cursor-pointer outline-none flex items-center justify-center w-[77px] h-[54px] rounded-[4px] ease-linear duration-200`}>
            <div className="flex flex-col">
              <div className="text-center text-[12px] text-[#A8A8A8] font-[400]">Bought</div>
              <div
                className={`text-center text-[14px] font-[600] text-[#21CB6B]`}
              >
                {`$${userTokenHoldings?.totalBuyAmount > 1 || userTokenHoldings?.totalBuyAmount < -1 ?
                    humanReadableFormatWithNoDollar(userTokenHoldings?.totalBuyAmount) 
                    :
                    formatDecimal(userTokenHoldings?.totalBuyAmount)
                }`}
              </div>
            </div>
          </div>

          <div className='w-[1px] h-12 bg-[#4D4D4D]' />

          <div
            className={`select-none cursor-pointer outline-none flex items-center justify-center w-[77px] h-[54px] rounded-[4px] ease-linear duration-200`}>
            <div className="flex flex-col">
              <div className="text-center text-[12px] text-[#A8A8A8] font-[400]">Sold</div>
              <div
                className={`text-center text-[14px] font-[600] text-[#ED1B24]`}
              >
                {`$${tempSoldAmount > 1 || tempSoldAmount < -1 ?
                    humanReadableFormatWithNoDollar(tempSoldAmount) 
                    :
                    formatDecimal(tempSoldAmount)
                }`}
              </div>
            </div>
          </div>

        <div className='w-[1px] h-12 bg-[#4D4D4D]' />

          <div
            className={`select-none cursor-pointer outline-none flex items-center justify-center w-[77px] h-[54px] rounded-[4px] ease-linear duration-200`}>
            <div className="flex flex-col">
              <div className="text-center text-[12px] text-[#A8A8A8] font-[400]">Holding</div>
              <div
                className={`text-center text-[14px] font-[600] text-white`}
              >
                {`$${tempHoldingAmount > 1 || tempHoldingAmount < -1 ?
                    humanReadableFormatWithNoDollar(tempHoldingAmount) 
                    :
                    formatDecimal(tempHoldingAmount)
                }`}
              </div>
            </div>
          </div>

        <div className='w-[1px] h-12 bg-[#4D4D4D]' />


          <div
            className={`select-none cursor-pointer outline-none flex items-center justify-center w-[77px] h-[54px] rounded-[4px] ease-linear duration-200`}>
            <div className="flex flex-col">
                <div className='flex items-center justify-center'>
                    <div className="text-center text-[12px] text-[#A8A8A8] font-[400]">PnL</div>
                    <RiExchangeDollarLine className={'text-[#21CB6B]'} size={15} />
                </div>
                <div
                    className={`text-center text-[12px] text-nowrap font-[550] ${positivePnl ? `text-[#21CB6B]` : `text-[#ED1B24]`} `}
                >
                  {pnlValue}
                </div>
            </div>
          </div>
      </div>
  )
}

export default UserPnL