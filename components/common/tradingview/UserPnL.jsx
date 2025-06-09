import React from "react";
import { RiExchangeDollarLine } from "react-icons/ri";
import {
  formatDecimal,
  humanReadableFormatWithNoDollar,
} from "@/utils/basicFunctions";
import { useTranslation } from "react-i18next";

const UserPnL = ({ currentTokenPnLData, tokenSymbol, useTitle = true, customBgColor = null, customBorderColor = null, customHeight = null, customLineSeparatorHeight = null, customLineSeparatorColor = null }) => {
  const {
        buyAmount,
        soldAmount,
        holdingRawAmount,
        holdingsUsdInCurrentPrice,
        isPositivePnL,
        absolutePnL,
        safePnLPercent
      } = currentTokenPnLData
  const { t } = useTranslation();
  const wallettracker = t("wallettracker");
  
  const sections = [
    {
      title: wallettracker?.pnlpopup?.bottom?.activeposition?.bought,
      value: buyAmount,
      color: "text-[#21CB6B]",
      hasDollar: true,
    },
    {
      title: wallettracker?.pnlpopup?.bottom?.activeposition?.sold,
      value: soldAmount,
      color: "text-[#ED1B24]",
      hasDollar: true,
    },
    {
      title: wallettracker?.pnlpopup?.bottom?.activeposition?.remaining,
      value: holdingsUsdInCurrentPrice,
      color: "text-white",
      hoverValue: (
        <span>
          {holdingRawAmount > 1 || holdingRawAmount < -1
            ? humanReadableFormatWithNoDollar(holdingRawAmount, 2)
            : formatDecimal(holdingRawAmount, 1)}{" "}
          {tokenSymbol ? tokenSymbol.slice(0, 3) : ""}
        </span>
      ),
      hasDollar: true,
    },
    {
      title: wallettracker?.pnlpopup?.bottom?.activeposition?.pnl,
      value: absolutePnL,
      addSign: isPositivePnL !== undefined ? `${isPositivePnL === true ? "+" : "-"}` : "+",
      color: isPositivePnL !== undefined ? `${isPositivePnL === true ? "text-[#21CB6B]" : "text-[#ED1B24]"}` : `text-[#21CB6B]`,
      icon: (
        <RiExchangeDollarLine className="text-[#21CB6B] w-[18px] h-[18px] lg:w-2 lg:h-2 xl:w-3 xl:h-3" />
      ),
      extra: safePnLPercent ? `(${isPositivePnL ? "+" : ""}${safePnLPercent?.toFixed(
        safePnLPercent < 1 ? 2 : 0
      )}%)` : `(0%)`,
      hasDollar: true,
    },
  ];

  return (
    <div
      className={`${customBgColor ? customBgColor : `bg-[#08080E]`} border-t w-full py-1 ${customBorderColor ? customBorderColor : "border-[#4D4D4D]"} flex flex-wrap justify-between items-center`}
      style={{ boxSizing: "border-box" }}
    >
      {sections.map((section, index) => (
        <React.Fragment key={section.title}>
          <div
            className={`select-none outline-none flex items-center justify-center flex-1 ${customHeight ? customHeight : `h-[64px]`} rounded-[4px] ease-linear duration-200 group`}
            style={{
              minWidth: section.title === wallettracker?.pnlpopup?.bottom?.activeposition?.pnl ? "30%" : "20%",
              maxWidth: section.title === wallettracker?.pnlpopup?.bottom?.activeposition?.pnl ? "35%" : "25%",
              boxSizing: "border-box",
              padding: section.title === wallettracker?.pnlpopup?.bottom?.activeposition?.pnl ? "0 6px" : "0 2px",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              {useTitle &&
                <div className="flex items-center justify-center gap-1 h-[14px]">
                  <span className="text-center text-[#A8A8A8] font-[400] text-base sm:text-sm lg:text-[8px] xl:text-[12px] 2xl:text-[14px]">
                    {section.title}
                  </span>
                  {section.icon && (
                    <div className="flex items-center">{section.icon}</div>
                  )}
                </div>
              }
              <div
                className={`flex items-center justify-center text-center font-[500] ${section.color} text-base sm:text-sm lg:text-[8px] xl:text-[12px] 2xl:text-[14px]`}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.2",
                  marginTop: "2px",
                  maxWidth: "100%",
                }}
              >
                {section.title === wallettracker?.pnlpopup?.bottom?.activeposition?.pnl ? (
                  <div className="flex items-center">
                    <span>
                      {section?.addSign && section.addSign}
                      {section.hasDollar && "$"}
                      {section.value > 1 || section.value < -1
                        ? humanReadableFormatWithNoDollar(section.value)
                        : formatDecimal(section.value, 1)}
                    </span>
                    <span className="ml-1">{section.extra}</span>
                  </div>
                ) : (
                  <>
                    <span
                      className={
                        section.title === wallettracker?.pnlpopup?.bottom?.activeposition?.remaining ? "group-hover:hidden" : ""
                      }
                    >
                      {section.hasDollar && "$"}
                      {section.value > 1 || section.value < -1
                        ? humanReadableFormatWithNoDollar(section.value, 2)
                        : formatDecimal(
                            section.value,
                            section.title === wallettracker?.pnlpopup?.bottom?.activeposition?.remaining ? 1 : undefined
                          )}
                    </span>
                    {section.title === wallettracker?.pnlpopup?.bottom?.activeposition?.remaining && (
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
            <div
              className={`w-[1px] ${customLineSeparatorHeight ? customLineSeparatorHeight : 'h-12'} ${customLineSeparatorColor ? customLineSeparatorColor : 'bg-[#4D4D4D]'} `}
              style={{ flexShrink: 0 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default UserPnL;
