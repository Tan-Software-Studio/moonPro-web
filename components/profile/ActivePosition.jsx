import { fetchPNLData } from '@/app/redux/holdingDataSlice/holdingData.slice';
import { Check, Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PiWallet } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

const ActivePosition = () => {

    // const [currentTabData, setCurrentTabData] = useState([])
    const [copiedIndex, setCopiedIndex] = useState(null);
    const dispatch = useDispatch();

    const solWalletAddress = useSelector(
        (state) => state?.AllStatesData?.solWalletAddress
    );
    const currentTabData = useSelector(
        (state) => state?.setPnlData?.PnlData
    );
    const initialLoading = useSelector(
        (state) => state?.setPnlData?.initialLoading
    );

    const handleCopy = (address, index) => {
        navigator.clipboard.writeText(address);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    useEffect(() => {
        if (solWalletAddress) {
            if (!currentTabData?.length > 0) {
                dispatch(fetchPNLData(solWalletAddress));
            }
        }
    }, []);
    return (
        <>
            <div className="overflow-auto max-h-[400px]">
                {initialLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="flex justify-center items-center min-h-[40vh]">
                            <span className="Tableloader"></span>
                        </div>
                    </div>
                ) : !currentTabData?.length > 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                            <PiWallet className="text-slate-400 text-2xl" />
                        </div>
                        <p className="text-slate-400 text-lg mb-2">No data available</p>
                        <p className="text-slate-500 text-sm">
                            information will appear here when available
                        </p>
                    </div>
                ) : (
                    <div className="min-w-full">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 border-b bg-[#08080E] border-gray-800 z-10">
                                <tr>
                                    <th className="p-4 text-slate-300 font-medium">
                                        Token
                                    </th>
                                    <th className="p-4 text-slate-300 font-medium">
                                        Bought
                                    </th>
                                    <th className="p-4 text-slate-300 font-medium">
                                        Sold
                                    </th>
                                    <th className="p-4 text-slate-300 font-medium">
                                        Remaining
                                    </th>
                                    <th className="p-4 text-slate-300 font-medium">
                                        PnL
                                    </th>
                                </tr >
                            </thead >
                            <tbody>
                                {currentTabData?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors duration-200"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item?.img}
                                                    alt="Token Icon"
                                                    className="w-10 h-10 rounded-md object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <div className='flex items-center gap-1'>
                                                        <p className="font-medium text-base text-white">{item?.symbol} /</p>
                                                        <span className="font-medium  text-sm text-gray-400 ">{item?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]">
                                                            {item?.token}
                                                        </span>
                                                        <button
                                                            onClick={() => handleCopy(item?.token, index)}
                                                            className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded transition-colors duration-200"
                                                        >
                                                            {copiedIndex === index ? (
                                                                <Check className="w-3 h-3 text-emerald-400" />
                                                            ) : (
                                                                <Copy className="w-3 h-3 text-slate-400 hover:text-slate-200" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-white">{Number(item.totalBoughtQty).toFixed(2)}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-white">{Number(item.quantitySold).toFixed(2)}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-white">{(item.totalBoughtQty - item.quantitySold).toFixed(2)}</p>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`font-semibold px-2 py-1 rounded-full text-sm 
                                                     ${((item.current_price - item.averageBuyPrice) / item.averageBuyPrice) * 100 >= 0
                                                        ? 'text-emerald-400 bg-emerald-900/20'
                                                        : 'text-red-400 bg-red-900/20'
                                                    }
                                                    `}
                                            >
                                                {`${(((item.current_price - item.averageBuyPrice) / item.averageBuyPrice) * 100).toFixed(2)}%`}
                                            </span>
                                            {/* ${item.pnl.includes("-")
                                                    ? "text-red-400 bg-red-900/20"
                                                    : "text-emerald-400 bg-emerald-900/20"
                                                    } */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table >
                    </div >
                )}
            </div >
        </>
    );
};

export default ActivePosition;