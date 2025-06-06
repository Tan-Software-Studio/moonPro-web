import { configureStore } from "@reduxjs/toolkit";

import AllthemeColorData from "./CommonUiData";

import allNewPairData from "./newpair/NewPairData";
import allNewPairBaseData from "./newpair/BaseData";
import allNewPairEthData from "./newpair/EthData";
import allMemescopeData from "./memescopeData/Memescope";
import allCharTokenData from "./chartDataSlice/chartData.slice";
import solTrendingData from "./trending/solTrending.slice";
import AllStatesData from "./states";
import userData from "./userDataSlice/UserData.slice";
import setPnlData from "./holdingDataSlice/holdingData.slice";
import aiSignal from "./AiSignalDataSlice/AiSignal.slice";
import portfolioData from "./portFolioDataSlice/portfolioData.slice";

export default configureStore({
  reducer: {
    AllthemeColorData,
    solTrendingData,
    AllStatesData,
    allNewPairData,
    allNewPairBaseData,
    allNewPairEthData,
    allMemescopeData,
    allCharTokenData,
    userData,
    setPnlData,
    aiSignal,
    portfolioData,
  },
});
