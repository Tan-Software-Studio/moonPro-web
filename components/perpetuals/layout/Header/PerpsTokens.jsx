import { setIsTokenChanged, setSelectedToken } from '@/app/redux/perpetauls/perpetual.slice';
import { humanReadableFormatWithNoDollar } from '@/utils/basicFunctions';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const PerpsTokens = ({ setIsOpen, searchTerm }) => {

    const dispatch = useDispatch();

    const perpsTokenList = useSelector(
        (state) => state?.perpetualsData?.perpsTokenList
    );
    const filteredTokens = perpsTokenList.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <>
            <div className="  px-4 pt-2 pb-1">
                <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-gray-400">
                    <div className="col-span-2">Symbol</div>
                    <div className="col-span-2">Market Price</div>
                    <div className="col-span-3">24h Change</div>
                    <div className="col-span-2">Oracle</div>
                    <div className="col-span-3">Volume</div>
                </div>
            </div>
            <div className="overflow-y-auto max-h-[35vh] visibleScroll">
                {perpsTokenList?.length > 0 ? (
                    filteredTokens.map((item, ind) => {
                        return (
                            <div
                                key={ind}
                                onClick={() => {
                                    dispatch(setSelectedToken(item));
                                    dispatch(setIsTokenChanged(item))
                                    setIsOpen(false)
                                }}
                                className={`group cursor-pointer relative   hover:bg-[#2a2a2a] px-4 py-1.5 border-b border-gray-800/50 transition-all duration-200`}
                            >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* Symbol */}
                                    <div className="col-span-2 flex items-center gap-2">
                                        <div className='flex items-center gap-2'>
                                            <div className="text-white font-medium text-[13px] truncate">
                                                {item?.name}
                                            </div>
                                            <div className='text-xs w-fit bg-[#11265B]/50 px-1 py-1 rounded-sm text-[#3b82f6]'>{item?.maxLeverage}X</div>
                                        </div>
                                    </div>

                                    {/* Last Price */}
                                    <div className="col-span-2 ">
                                        <div className="text-white text-[13px] font-medium">
                                            {item?.markPx}
                                        </div>
                                    </div>

                                    {/* 24h Change */}
                                    <div className="col-span-3 ">
                                        <div className={`font-medium text-[13px] flex items-center gap-1 ${Number(item?.priceChangePercent) > 0 ? "text-green-400" : "text-red-400"}`}>
                                            <div>{Number(item?.priceChangeAbs)?.toFixed(2)}</div> /
                                            <div>{Number(item?.priceChangePercent)?.toFixed(2)}%</div>
                                        </div>
                                    </div>

                                    {/* Oracle Price */}
                                    <div className="col-span-2 ">
                                        <div className="text-white text-[13px] font-medium">
                                            {humanReadableFormatWithNoDollar(item?.oraclePx, 2)}
                                        </div>
                                    </div>

                                    {/* 24h Volume */}
                                    <div className="col-span-3  ">
                                        <div className="text-white text-[13px] font-medium">
                                            {humanReadableFormatWithNoDollar(item?.dayNtlVlm, 2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-gray-400 py-16">
                        <div className="text-gray-400">No tokens available</div>
                    </div>
                )}
            </div>
        </>
    )
}
export default PerpsTokens