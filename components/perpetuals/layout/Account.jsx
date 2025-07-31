import React from 'react';
import { Info } from 'lucide-react';

const Account = () => {

    return (
        <div className="text-white p-3 rounded-lg max-w-md mx-auto"> 

            <div className="flex justify-between  mb-2">
                <button
                    className={` py-2 text-sm font-medium transition-colors hover:text-white text-gray-300`}
                >
                    Account
                </button>
                <div className='flex items-center gap-2'>
                    <button
                        className={`py-1 px-1 bg-[#343434] text-[#F2C672] text-xs transition-colors`}
                    >
                        Deposit
                    </button>
                    <button
                        className={`py-1 px-1 bg-[#343434] text-[#F2C672] text-xs transition-colors`}
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-xs">Account Margin Ratio</span>
                    <span className="text-cyan-400 text-xs">0.00%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-xs">Account Maintenance Margin</span>
                    <span className="text-white text-xs">0.00 USD</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="text-gray-300 text-xs">Account Equity</span>
                        <Info className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="text-white text-xs">0.00 USD</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-xs">Unrealized PNL</span>
                    <span className="text-white text-xs">0.0000 USDT</span>
                </div>
            </div>

            <div className="border border-gray-700 mt-3 flex items-center justify-center">
                <span className="text-gray-300 text-xs py-3">Multi-Asset Mode</span>
            </div>
        </div>
    );
};

export default Account;