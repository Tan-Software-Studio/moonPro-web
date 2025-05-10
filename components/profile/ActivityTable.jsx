import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import axiosInstanceAuth from '@/apiInstance/axiosInstanceAuth';
import Pagination from './Pagination';
import Image from 'next/image';


// Format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Truncate long strings
const truncateString = (str, start = 4, end = 4) => {
    if (str.length <= start + end) return str;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
};

// Type badge color
const getTypeBadgeColor = (type) => {
    switch (type) {
        case 'buy': return 'bg-green-800 text-green-200';
        case 'sell': return 'bg-red-800 text-red-200';
        case 'swap': return 'bg-blue-800 text-blue-200';
        default: return 'bg-gray-800 text-gray-200';
    }
};

const ActivityTable = () => {

    const [transactionData, setTransactionData] = useState([])
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPages = 10;
    const [isLoading, setIsLoading] = useState(false)


    const handleTransaction = async (e) => {
        await axiosInstanceAuth.get(`transactions/history/${entriesPerPages}/${currentPage}`)
            .then((response) => {
                setTransactionData(response?.data?.data?.transaction)
                setTotalPage(response?.data?.data?.totalPage)
            }).catch((error) => {
                console.log(error)
            })
    };


    useEffect(() => {
        handleTransaction();
    }, [currentPage])

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="w-full ">
                        {[
                            "From",
                            "To",
                            "Amount",
                            "Value (USD)",
                            "Type",
                            "TX",
                            "Date & Time"
                        ].map((item, index) => (
                            <th key={index}>
                                <th className="px-3 py-3 text-left text-xs font-medium text-[#A8A8A8] uppercase tracking-wider">
                                    <div className="flex gap-4 items-center">
                                        {item == "From" &&
                                            <div>#</div>
                                        }
                                        <div>{item}</div>
                                    </div>

                                </th>
                            </th>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {isLoading ?
                            (
                                <tr>
                                    <td colSpan="5">
                                        <div className="flex justify-center items-center min-h-[40vh]  ">
                                            <span class="Tableloader"></span>
                                        </div>
                                    </td>
                                </tr>
                            )
                            : transactionData?.length > 0 ?
                                (transactionData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm">

                                            <div className="flex gap-4 items-center">
                                                <div>{index + 1}</div>
                                                <div>{truncateString(item.fromToken)}</div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center">

                                                <span>{truncateString(item.toToken)}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                                            {item.amount.toFixed(2)}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                                            ${item.amountInDollar.toFixed(2)}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(item.type)}`}>
                                                {item.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center">
                                                <span className="mr-1">{truncateString(item.tx)}</span>
                                                <Link
                                                    href={`https://solscan.io/tx/${item.tx}`}
                                                    target="_blank"
                                                    className="text-blue-400 hover:text-blue-300">
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                                            {formatDate(item.createdAt)}
                                        </td>
                                    </tr>

                                )))
                                :
                                <tr>
                                    <td colSpan={7} className="py-10">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Image
                                                src="/assets/NoDataImages/qwe.svg"
                                                alt="No Data Available"
                                                width={200}
                                                height={100}
                                                className="rounded-lg mb-2"
                                            />
                                            <div>You don&apos;t have any transaction history yet.</div>
                                        </div>
                                    </td>
                                </tr> 
                        }
                    </tbody>
                </table>
            </div>
            {
                totalPage > 1 && (
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPage} />
                )
            }
        </>
    );
};

export default ActivityTable;