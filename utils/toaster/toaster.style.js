import toast from "react-hot-toast";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
export function showToaster(title) {
  toast(
    <div className="flex items-center gap-2">
      <MdError size={18} color="#b2161e" />
      <div className="text-white text-sm">{title}</div>
    </div>,
    {
      position: "top-center",
      duration: 2000,
      style: {
        border: "1px solid #2A2A2A",
        fontSize: "14px",
        letterSpacing: "1px",
        backgroundColor: "#141414",
      },
    }
  );
}
export function showToasterSuccess(title) {
  toast(
    <div className="flex items-center gap-2">
      <FaCheckCircle size={18} color="#359e63" />
      <div className="text-white text-sm">{title}</div>
    </div>,
    {
      position: "top-center",
      duration: 2000,
      style: {
        border: "1px solid #2A2A2A",
        fontSize: "14px",
        letterSpacing: "1px",
        backgroundColor: "#141414",
      },
    }
  );
}
