import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';


const NoDataMessage = ({ loading, noDataMessage, isConnected }) => {

    const dataLoadingMsg = "Loading Data..."
    const pathname = usePathname()
    return (
        <div className="flex flex-col items-center justify-center">
            <div className={`text-4xl mb-2 ${loading ? 'animate-bounce' : ''}`}>
                <Image
                    src="/assets/NoDataImages/qwe.svg"
                    alt="No Data Available"
                    width={200}
                    height={100}
                    className="rounded-lg"
                />
            </div>
            <p className="mt-4 text-[15px] text-[#b5b7da] font-bold">
                {loading ? dataLoadingMsg : noDataMessage}
            </p>
            {!isConnected && pathname.includes("holdings") && (noDataMessage !== "Please enter the proper token name, symbol or address.") && (
                <div className="mt-4">
                    <appkit-button />
                </div>
            )}

        </div>
    );
};

export default NoDataMessage;
