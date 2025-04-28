/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Page = () => {
  const [tokenData, setTokenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState("1"); // Default to Ethereum

  const NetworkData = [
    { name: "Ethereum", chainid: "1", descode: "0x1" },
    { name: "Arbitrum", chainid: "42161", descode: "0xa4b1" },
    { name: "Optimism", chainid: "10", descode: "0xa" },
    { name: "Polygon", chainid: "137", descode: "0x89" },
    { name: "Solana", chainid: "19999", descode: " " },
    { name: "BNB Chain", chainid: "56", descode: "0x38" },
    { name: "Avalanche", chainid: "43114", descode: "0xa86a" },
    { name: "Cronos", chainid: "25", descode: "0x19" },
    { name: "Base", chainid: "250", descode: "0x2105" },
    { name: "Blast", chainid: "81457", descode: "0xee" },
    { name: "Linea", chainid: "250", descode: "0xe705" },
    { name: "Fantom", chainid: "250", descode: "0xfa" },
  ];

  const fetchAllData = async (chainId) => {
    try {
      const pageSize = 100; // items per page
      let allData = [];
      let page = 1;

      // Fetch the first page to get totalRecords and total pages
      const initialResponse = await axios.get(
        `https://ks-setting.kyberswap.com/api/v1/tokens`,
        {
          params: {
            pageSize,
            isWhitelisted: true,
            chainIds: chainId, // Pass the selected network chainid here
            page,
          },
        }
      );

      const data = initialResponse?.data?.data?.tokens;
      const totalItems = initialResponse?.data?.data?.pagination?.totalItems;
      const totalPages = Math.ceil(totalItems / pageSize); // calculate total pages

      // Add first page's data to allData
      allData = [...allData, ...data];

      // Fetch data for remaining pages if there are more than 1 page
      const pageRequests = [];
      for (let i = 2; i <= totalPages; i++) {
        pageRequests.push(
          axios.get(`https://ks-setting.kyberswap.com/api/v1/tokens`, {
            params: {
              pageSize,
              isWhitelisted: true,
              chainIds: chainId,
              page: i,
            },
          })
        );
      }

      // Fetch all pages concurrently
      const pageResponses = await Promise.all(pageRequests);

      // Combine data from all pages
      pageResponses.forEach((res) => {
        allData = [...allData, ...res.data.data.tokens];
      });

      // Set the combined data to state
      setTokenData(allData);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch token data");
      setLoading(false);
    }
  };

  const handleNetworkChange = (e) => {
    const selectedChainId = e.target.value;
    setSelectedNetwork(selectedChainId);
    setLoading(true); // Set loading state when fetching new data
    fetchAllData(selectedChainId);
  };

  useEffect(() => {
    fetchAllData(selectedNetwork); // Fetch data for the default network on page load
  }, [selectedNetwork]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Token Data</h1>

      {/* Dropdown for selecting the network */}
      <select value={selectedNetwork} onChange={handleNetworkChange} className='bg-gray-600'>
        {NetworkData.map((network) => (
          <option key={network.chainid} value={network.chainid}>
            {network.name}
          </option>
        ))}
      </select>

      {/* Display token data */}
      <ul>
        {tokenData.map((token, index) => (
          <li key={index}>

            <img src={token.logoURI} alt={token.name} className="h-12 w-12 rounded" />
            <strong>{token.name}</strong>: {token.symbol}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
