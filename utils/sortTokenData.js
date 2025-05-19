// src/app/utils/sortTokenData.js
const handleSort = (key, data, order) => {
    if (!data || !Array.isArray(data) || !key || !order) return data;
  
    return [...data].sort((a, b) => {
      if (order === "desc") {
        return key === "date"
          ? new Date(a[key]) - new Date(b[key])
          : (a[key] || 0) - (b[key] || 0);
      } else {
        return key === "date"
          ? new Date(b[key]) - new Date(a[key])
          : (b[key] || 0) - (a[key] || 0);
      }
    });
  };

  export default handleSort;
  
    // const handleSort = (key, order) => {
    //   console.log("🚀 ~ handleSort ~ order:", order)
    //   console.log("🚀 ~ handleSort ~ key:", key)
    //   setSortColumn(key);
    //   setSortOrder(order);
    //   const sortedData = [...data].sort((a, b) => {
    //     if (order === "asc") {
    //       if (key == "date") {
    //         return new Date(a[key]) - new Date(b[key]);
    //       }
    //       return a[key] - b[key];
    //     } else {
    //       if (key == "date") {
    //         return new Date(b[key]) - new Date(a[key]);
    //       }
    //       return b[key] - a[key];
    //     }
    //   });
    //   setData(sortedData);
    // };
  