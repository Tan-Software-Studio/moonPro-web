import { updateData15Secinterval } from "@/app/redux/trending/solTrending.slice";

function debouncing(fun, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fun(...args);
    }, delay);
  };
}

function throttlingFunctionWrapper(delay = 15000) {
  let timer = 0;
  return (data, dispatch, localFilterTime) => {
    let currentTime = Date.now();
    if (currentTime - timer >= delay) {
      timer = currentTime;
      let convertInObject = data?.reduce((acc, item) => {
        acc[item.address] = item;
        return acc;
      }, {});
      const sortedEntries = Object.entries(convertInObject)
        .sort(([, a], [, b]) => b.Percentage - a.Percentage)
        .map(([, value]) => [value?.address, value]);
      dispatch(
        updateData15Secinterval({
          data: Object.fromEntries(sortedEntries),
          frame: localFilterTime,
        })
      );
    }
  };
}

export { debouncing, throttlingFunctionWrapper };
