import React from 'react'
import { RiExchangeDollarLine } from "react-icons/ri";
import { formatDecimal, humanReadableFormatWithNoDollar } from '@/utils/basicFunctions';

// use map instead change in future
const UserPnL = ({userTokenHoldings}) => {
    const tempSoldAmount = userTokenHoldings?.quantitySold * userTokenHoldings?.averageBuyPrice;
    const tempHoldingAmount = userTokenHoldings?.activeQtyHeld * userTokenHoldings?.averageBuyPrice;
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
                    className={`text-center text-[14px] font-[600] ${userTokenHoldings?.realizedProfit < 0 ? `text-[#ED1B24]` : `text-[#21CB6B]`} `}
                >
                    {`$${userTokenHoldings?.realizedProfit > 1 || userTokenHoldings?.realizedProfit < -1 ?
                    humanReadableFormatWithNoDollar(userTokenHoldings?.realizedProfit) 
                    :
                    formatDecimal(userTokenHoldings?.realizedProfit)
                    }`}
                </div>
            </div>
          </div>
      </div>
  )
}

export default UserPnL