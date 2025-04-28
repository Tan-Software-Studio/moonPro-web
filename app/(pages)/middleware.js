
import { fetchnewPairData } from "../redux/newpair/NewPairData";

const apiMiddleware = (store) => (next) => (action) => {
    // Dispatch fetchData only on store initialization
  if (action.type === "@@INIT") {
    store.dispatch(fetchnewPairData());
    
  }

  return next(action);
};

export default apiMiddleware;
