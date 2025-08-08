import React, { useState } from 'react' 
import Positions from './Positions';
const MainTable = () => {
    const [selectedTab, setSelectedTab] = useState('Positions');
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
                {selectedTab == "Positions" ? <Positions /> : null}


            </div>
        </div>
    )
}

export default MainTable