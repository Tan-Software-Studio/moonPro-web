"use client";
import React, { useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";


const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    // Calculate the visible page numbers
    const pageNumbers = useMemo(() => {
        const start =
            totalPages === 2
                ? 1
                : currentPage === 3
                    ? 1
                    : currentPage === totalPages
                        ? currentPage - 2
                        : currentPage === 1
                            ? 1
                            : currentPage - 1;

        const end =
            totalPages === 2
                ? 2
                : currentPage === 3
                    ? 3
                    : currentPage === 1
                        ? currentPage + 2
                        : currentPage < totalPages
                            ? currentPage + 1
                            : totalPages;

        const center =
            currentPage === 3
                ? 2
                : currentPage === totalPages
                    ? currentPage - 1
                    : currentPage === 1
                        ? currentPage + 1
                        : currentPage;

        const data =
            totalPages === 2
                ? [start, end]
                : currentPage === 3
                    ? [start, center, end, "...", totalPages]
                    : totalPages === 3
                        ? [start, center, end]
                        : currentPage === 1 || currentPage === 2
                            ? [start, center, end, "...", totalPages]
                            : currentPage === totalPages || currentPage === totalPages - 1
                                ? [1, "...", start, center, end]
                                : [1, "...", start, center, end, "...", totalPages];

        return data;
    }, [currentPage, totalPages]);

    return (
        <div className="flex items-center justify-between px-5 gap-3 cursor-pointer my-3">
            <div className="text-[#A8A8A8] text-base font-light">
                {currentPage} out of {totalPages} pages
            </div>
            <div className="flex items-center gap-3 cursor-pointer">
                <div
                    className="text-[25px] text-[#FFFFFF] bg-[#1F1F1F] rounded-md px-1 py-1"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    <FiChevronLeft />
                </div>
                {pageNumbers.map((page, index) => (
                    <div
                        key={index}
                        className={`rounded-md px-3 py-0.5 text-lg   transition-all duration-300 ease-in-out focus:outline-none ${page === currentPage
                            ? "bg-[#1F1F1F] text-[#FFFFFF] border border-[#333333]"
                            : "text-[#A8A8A8]  border border-[#1F1F1F] hover:bg-[#404040]"
                            }`}
                        onClick={() => typeof page === "number" && setCurrentPage(page)}
                    >
                        {page}
                    </div>
                ))}

                <div
                    className="  text-[25px] text-[#FFFFFF] bg-[#1F1F1F] rounded-md px-1 py-1"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    <FiChevronRight />
                </div>
            </div>
        </div>
    );
};

export default Pagination;