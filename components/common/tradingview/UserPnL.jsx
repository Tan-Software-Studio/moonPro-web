import React, { useRef, useEffect } from 'react';
import { RiExchangeDollarLine } from 'react-icons/ri';
import { formatDecimal, humanReadableFormatWithNoDollar } from '@/utils/basicFunctions';

const UserPnL = ({ userTokenHoldings, currentPrice, tokenSymbol }) => {
  const buyAmount = userTokenHoldings?.totalBoughtQty * userTokenHoldings?.averageBuyPrice || 0;
  const soldAmount = userTokenHoldings?.quantitySold * userTokenHoldings?.averageBuyPrice || 0;
  const holdingAmount = userTokenHoldings?.activeQtyHeld * currentPrice || 0;
  const pnlAmount = holdingAmount - buyAmount;
  const isPositivePnL = pnlAmount >= 0;
  const absolutePnL = Math.abs(pnlAmount);
  const pnlPercent = buyAmount !== 0 ? (absolutePnL / buyAmount) * 100 : 0;
  const safePnLPercent = isNaN(pnlPercent) ? 0 : pnlPercent;

  const sections = [
    {
      title: 'Bought',
      value: buyAmount,
      color: 'text-[#21CB6B]',
      hasDollar: true,
    },
    {
      title: 'Sold',
      value: soldAmount,
      color: 'text-[#ED1B24]',
      hasDollar: true,
    },
    {
      title: 'Holding',
      value: holdingAmount,
      color: 'text-white',
      hoverValue: (
        <span>
          {userTokenHoldings?.activeQtyHeld > 1 || userTokenHoldings?.activeQtyHeld < -1
            ? humanReadableFormatWithNoDollar(userTokenHoldings?.activeQtyHeld, 2)
            : formatDecimal(userTokenHoldings?.activeQtyHeld, 1)}{' '}
          {tokenSymbol ? tokenSymbol.slice(0, 3) : ''}
        </span>
      ),
      hasDollar: true,
    },
    {
      title: 'PnL',
      value: absolutePnL,
      color: isPositivePnL ? 'text-[#21CB6B]' : 'text-[#ED1B24]',
      icon: <RiExchangeDollarLine className="text-[#21CB6B]" size={15} />,
      extra: `(${isPositivePnL ? '+' : '-'}${safePnLPercent.toFixed(2)}%)`,
      hasDollar: true,
    },
  ];

  return (
    <div
      className="bg-[#08080E] border-t w-full px-3 py-1 border-[#4D4D4D] flex flex-wrap justify-between items-center"
      style={{ boxSizing: 'border-box' }}
    >
      {sections.map((section, index) => {
        const textRef = useRef(null);
        const containerRef = useRef(null);

        useEffect(() => {
          const textEl = textRef.current;
          const containerEl = containerRef.current;
          if (textEl && containerEl) {
            const containerWidth = containerEl.offsetWidth;
            let fontSize = parseFloat(getComputedStyle(textEl).fontSize);
            const textWidth = textEl.scrollWidth;

            if (textWidth > containerWidth && fontSize > 8) {
              const scale = containerWidth / textWidth;
              textEl.style.fontSize = `${Math.max(fontSize * scale, 8)}px`;
            }
          }
        }, [section.value, section.extra, section.hoverValue]);

        return (
          <React.Fragment key={section.title}>
            <div
              ref={containerRef}
              className="select-none outline-none flex items-center justify-center flex-1 h-[54px] rounded-[4px] ease-linear duration-200 group"
              style={{ minWidth: '20%', maxWidth: '25%', boxSizing: 'border-box', padding: '0 2px' }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center justify-center gap-1 h-[14px]">
                  <span className="text-center text-[12px] text-[#A8A8A8] font-[400]">
                    {section.title}
                  </span>
                  {section.icon && (
                    <div className="flex items-center">
                      {section.icon}
                    </div>
                  )}
                </div>
                <div
                  ref={textRef}
                  className={`flex items-center justify-center text-center text-[14px] font-[500] ${section.color}`}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.2', // Tighter line height for better centering
                    marginTop: '2px', // Small adjustment to balance vertical spacing
                  }}
                >
                  {section.title === 'PnL' ? (
                    <div className="flex items-center">
                      <span>
                        {section.hasDollar && '$'}
                        {section.value > 1 || section.value < -1
                          ? humanReadableFormatWithNoDollar(section.value)
                          : formatDecimal(section.value, 1)}
                      </span>
                      <span className="ml-1">{section.extra}</span>
                    </div>
                  ) : (
                    <>
                      <span className={section.title === 'Holding' ? 'group-hover:hidden' : ''}>
                        {section.hasDollar && '$'}
                        {section.value > 1 || section.value < -1
                          ? humanReadableFormatWithNoDollar(section.value)
                          : formatDecimal(section.value, section.title === 'Holding' ? 1 : undefined)}
                      </span>
                      {section.title === 'Holding' && (
                        <span className="hidden group-hover:inline font-medium ml-1">
                          {section.hoverValue}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {index < sections.length - 1 && (
              <div className="w-[1px] h-12 bg-[#4D4D4D]" style={{ flexShrink: 0 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default UserPnL;