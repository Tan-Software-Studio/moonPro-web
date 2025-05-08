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
                border: "1px solid #4D4D4D",
                color: "#FFFFFF",
                fontSize: "14px",
                letterSpacing: "1px",
                backgroundColor: "#1F1F1F",
            },
        }
    );
}