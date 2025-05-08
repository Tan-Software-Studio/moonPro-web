import toast from "react-hot-toast"; 
export function showToastLoader (title, id) {
    toast(
        <div className="flex items-center gap-5">
            <div className="loaderPopup"></div>
            <div className="text-white text-sm">{title}</div>
        </div>,
        {
            id: id,
            position: "top-center",
            duration: Infinity,
            style: {
                border: "1px solid #2A2A2A",
                color: "#FFFFFF",
                fontSize: "14px",
                letterSpacing: "1px",
                backgroundColor: "#141414",
            },
        }
    );
}