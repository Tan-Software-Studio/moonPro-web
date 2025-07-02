// src/app/utils/sortTokenData.js
const handleSort = (key, data, order) => {
  if (!data || !Array.isArray(data) || !key || !order) return data;

  return [...data].sort((a, b) => {
    if (order === "desc") {
      return key === "dbCreatedAt"
        ? new Date(a[key]) - new Date(b[key])
        : key === "buys"
        ? (a["buys"] + a["sells"] || 0) - (b["buys"] + b["sells"] || 0)
        : (a[key] || 0) - (b[key] || 0);
    } else {
      return key === "dbCreatedAt"
        ? new Date(b[key]) - new Date(a[key])
        : key === "buys"
        ? (b["buys"] + b["sells"] || 0) - (a["buys"] + a["sells"] || 0)
        : (b[key] || 0) - (a[key] || 0);
    }
  });
};

export default handleSort;
