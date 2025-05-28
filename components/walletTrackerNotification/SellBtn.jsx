import React from "react";
export default function SellBtn({ fromToken, price }) {
  return (
    <button className="border-[#ED1B24] text-[#ED1B24] border-[1px] hover:text-white transition-all ease-in-out duration-300 hover:bg-[#ED1B24] cursor-pointer rounded-md py-2 px-6 text-sm">
      Sell
    </button>
  );
}
