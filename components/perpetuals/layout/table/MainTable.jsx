import React, { useEffect, useState } from 'react'
import Positions from './Positions';
import OpenOrders from './OpenOrders';
import { getOpenOrders } from '@/services/hyperLiquid/getOpenOrders';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenOrdersData } from '@/app/redux/perpetauls/perpetual.slice';
const MainTable = () => {

    const [selectedTab, setSelectedTab] = useState('Positions');
    const dispatch = useDispatch()
    // const [OpenOrdersData, setOpenOrdersData] = useState([])
    const [openOrdersLoading, setOpenOrdersLoading] = useState(false)

    const userDetails = useSelector((state) => state?.userData?.userDetails);


    async function handleOpenOrders() {
        try {
            setOpenOrdersLoading(true)
            const data = await getOpenOrders(userDetails?.perpsWallet)
            dispatch(setOpenOrdersData(data))
            setOpenOrdersLoading(false)

        } catch (error) {
            setOpenOrdersLoading(false)
            console.log("🚀 ~ OpenOrders ~ error:", error)
        }
    }

    useEffect(() => {
        if (userDetails?.perpsWallet) {
            handleOpenOrders()
        }
    }, [userDetails?.perpsWallet])

    return (
        <div>

            <div className=' font-sans  w-full'>
                <div className='py-2 px-5 flex items-center gap-6 w-full overflow-x-auto border-b border-gray-800'>
                    {[
                        'Positions',
                        'Open orders',
                        'Trades'].map((item, index) => (
                            <div
                                key={index}
                                className={`${selectedTab == item ? "text-white" : "text-gray-400 hover:text-white"} font-semibold cursor-pointer text-sm`}
                                onClick={() => setSelectedTab(item)}
                            >
                                {item}
                            </div>
                        ))}
                </div>
                {selectedTab == "Positions" ? <Positions /> : selectedTab == 'Open orders' ? <OpenOrders openOrdersLoading={openOrdersLoading} /> : null}


            </div>
        </div>
    )
}

export default MainTable