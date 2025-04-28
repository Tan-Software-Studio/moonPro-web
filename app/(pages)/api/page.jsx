"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Page = () => {

  const NetworkData = [
    { name: "Ethereum", chainid: "1", descode: "0x1" },
    { name: "Arbitrum", chainid: "42161", descode: "0xa4b1" },
    { name: "Avalanche", chainid: "43114", descode: "0xa86a" },
    { name: "Base", chainid: "8453", descode: "0x2105" },
    { name: "Optimism", chainid: "10", descode: "0xa" },
    { name: "Polygon", chainid: "137", descode: "0x89" },
    { name: "BNB Chain", chainid: "56", descode: "0x38" },
    { name: "Solana", chainid: "19999", descode: " " },
    { name: "Cronos", chainid: "25", descode: "0x19" },
    { name: "Blast", chainid: "81457", descode: "0xee" },
    { name: "Linea", chainid: "250", descode: "0xe705" },
    { name: "Fantom", chainid: "250", descode: "0xfa" },
  ];

  const [selectedNetwork, setSelectedNetwork] = useState(NetworkData[0].name);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNetworkChange = (event) => {
    setSelectedNetwork(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.mobula.io/api/1/market/query/token?sortBy=listed_at&sortOrder=desc&blockchain=${selectedNetwork}&limit=50`
        );
        setApiData(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedNetwork]);

  return (
    <div className="p-4  ">
      <label
        htmlFor="network"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Select Network:
      </label>
      <select
        id="network"
        value={selectedNetwork}
        onChange={handleNetworkChange}
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {NetworkData.map((network) => (
          <option key={network.chainid} value={network.name}>
            {network.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="mt-4 text-sm">Loading data...</p>
      ) : apiData ? (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Results for {selectedNetwork}:</h2>
          <div className=" overflow-y-scroll">
            <ul>
              {apiData.data?.map((token) => (
                <li key={token.id} className="mt-4 ">
                  <p>
                    <strong>{token.name}</strong> ({token.symbol})
                  </p>{" "}
                  <p>
                    <strong>{token.blockchain}</strong>
                  </p>
                  {token.pairs && token.pairs.length > 0 && (
                    <ul className="ml-4">
                      {token.pairs.map((pair, index) => (
                        <li key={index}>
                          <p>
                            <strong>Pair {index + 1}</strong>: Base Token:{" "}
                            {pair.baseToken}, Quote Token: {pair.quoteToken},
                            Exchange: {pair.exchange}
                          </p>
                          <p>Buy Volume (24h): {pair.buy_volume_24h}</p>
                          <p>Sell Volume (24h): {pair.sell_volume_24h}</p>
                          <p>Liquidity: {pair.liquidity}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm">No data available.</p>
      )}
    </div>
  );
};

export default Page;
