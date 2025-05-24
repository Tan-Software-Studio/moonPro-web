/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import { BiSolidCopy } from "react-icons/bi";
import Image from "next/image";
import { proWallet } from "@/app/Images";
import { PublicKey } from "@solana/web3.js";
import { CiFilter } from "react-icons/ci";
import Infotip from "@/components/common/Tooltip/Infotip.jsx";
import Tooltip from "@/components/common/Tooltip/ToolTip.jsx";
import { useTranslation } from "react-i18next";

const TraderBoard = () => {
  const { t, ready } = useTranslation();
  const prowalletsPage = t("prowallets");
  const rankBadges = [
    "bg-yellow-500 text-black", // Gold for #1
    "bg-gray-400 text-black", // Silver for #2
    "bg-orange-500 text-black", // Bronze for #3
  ];

  const colors = [
    { outer: "bg-yellow-200", inner: "bg-yellow-500" }, // Rank 1 (Gold)
    { outer: "bg-gray-300", inner: "bg-gray-500" }, // Rank 2 (Silver)
    { outer: "bg-orange-300", inner: "bg-orange-500" }, // Rank 3 (Bronze)
  ];

  // Static data
  const data = {
    All: {
      gainers: [
        {
          trader: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
          pnl: "+$50.25M",
          volume: "$55.30M",
          trades: 150,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "9kf7oyNPHZB7TWcZZRewFMFwGNDKSEZKSSumMdaRYiuv",
          pnl: "+$45.10M",
          volume: "$48.90M",
          trades: 140,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "2C5n9nGrWkniwgcN9UZQk16QQU1sPBe9v9Fg9Y9VKmDo",
          pnl: "+$40.75M",
          volume: "$42.60M",
          trades: 130,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "5UaUYL69o34hcFQJ3NE6jkepN99CZMKnZr6DtBtxNAu",
          pnl: "+$35.40M",
          volume: "$39.20M",
          trades: 120,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "FBtpMJpwJsAKc862E5qsrtFpzrhbUYAd1PyYCsPeEQfc",
          pnl: "+$30.80M",
          volume: "$33.50M",
          trades: 110,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "4MtZv1vb7GAYj9MP3KGZXWhaKdpT7yMGXWDq6QbDR3Cg",
          pnl: "+$25.60M",
          volume: "$28.10M",
          trades: 100,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "FUDmdpdipmiRDQJLctD9iRVGrHFS2socSzhA6E9qZv3w",
          pnl: "+$20.90M",
          volume: "$24.70M",
          trades: 90,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "BXJ4eEiSskrjtHH4Fm8SXN8oiJwtT35envuprYDDe8WB",
          pnl: "+$15.30M",
          volume: "$18.80M",
          trades: 80,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "E6J3puR2oJYaCr9fpPHgAHRYQmvhy6qTYEUR99YT1XQr",
          pnl: "+$10.75M",
          volume: "$12.90M",
          trades: 70,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "6GpSwWRFXnxBXFdhoQELnLQB4tLB4dUQzVD9ksDkW1ES",
          pnl: "+$5.60M",
          volume: "$7.20M",
          trades: 60,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
      losers: [
        {
          trader: "3KXvoZequDqtRaXudcpthu8pQKCp39sJxmaJABtFfSUf",
          pnl: "-$40.50M",
          volume: "$45.60M",
          trades: 140,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "8sZ71K6SMSQuLovXiexLWzmoji4Txf8uJaYyZ9hmmCXW",
          pnl: "-$35.20M",
          volume: "$39.80M",
          trades: 130,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "sgHs7Eh3xyUtJRj4U9Bv3BYPbiT1XKVcapMbur9zFSr",
          pnl: "-$30.75M",
          volume: "$34.50M",
          trades: 120,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "GNrTXKJzkJ1qDHZ2DttJetTk5yk9ooiGUzwNEKcr6dqA",
          pnl: "-$25.40M",
          volume: "$28.60M",
          trades: 110,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7S8btNTnUUtqYYTWrrJKRZTPKRuiygfS8zd6ahmYA9GF",
          pnl: "-$20.80M",
          volume: "$23.10M",
          trades: 100,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "BXTXd1PqeKgZ1mArVpREu1inaaAjy5DTVDhoq8UL2YDy",
          pnl: "-$15.60M",
          volume: "$18.40M",
          trades: 90,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "HkYSwo1HGaMBRPb3QJC4v2zzMoQVYhzFUwnNMGPzKWZ7",
          pnl: "-$10.90M",
          volume: "$12.70M",
          trades: 80,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "Caaa1dmT8GS3NgQcdMgo8weAWiUGgTLB5KwCbNcGMB7W",
          pnl: "-$8.30M",
          volume: "$10.50M",
          trades: 70,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
          pnl: "-$5.75M",
          volume: "$7.80M",
          trades: 60,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "6J65eepwYpE4Lqn7Geqj7piaci1HkfWsAp68cnZG1Efg",
          pnl: "-$3.60M",
          volume: "$5.20M",
          trades: 50,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
    },
    "1D": {
      gainers: [
        {
          trader: "4DbAcLDyhCLX7rKPx55xTQA6D8w2poSg3xwW6NzozAAe",
          pnl: "+$90M",
          volume: "$100M",
          trades: 180,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "9kf7oyNPHZB7TWcZZRewFMFwGNDKSEZKSSumMdaRYiuv",
          pnl: "+$80M",
          volume: "$90M",
          trades: 200,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7qVZm4Nxwp5v7bmkL57ZQm393e98PmpcZiYwkQx9oKts",
          pnl: "+$75M",
          volume: "$85M",
          trades: 170,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "FNay34Y1YJ634DHyzgQPTHgqojAirbLKp3uPHTRDwCBn",
          pnl: "+$65M",
          volume: "$75M",
          trades: 160,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "Gr3eiFhPfLAaA4SSHYqan8hcBB9dHLxRC176tfRtS4eb",
          pnl: "+$60M",
          volume: "$70M",
          trades: 140,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "2C5n9nGrWkniwgcN9UZQk16QQU1sPBe9v9Fg9Y9VKmDo",
          pnl: "+$55M",
          volume: "$65M",
          trades: 130,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "H1zFMUjYLzJwcfgXEtwiJ2ykvxmBr7JW6afW29PkcEAe",
          pnl: "+$50M",
          volume: "$60M",
          trades: 125,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "3B6AU7JkCPfb9JWfz5yxvrHbkVrmw8fwmZf2N9PqLMpu",
          pnl: "+$45M",
          volume: "$55M",
          trades: 110,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "2NHGzdMGW4Zoe4Szypj3QpQuZR2mq3qRgQk6ek1KkH7V",
          pnl: "+$40M",
          volume: "$50M",
          trades: 105,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7KuA1Uik1teBayCgHCF5JLFtk16yeLzAC2L95JFqaayc",
          pnl: "+$35M",
          volume: "$45M",
          trades: 95,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
      losers: [
        {
          trader: "9DRFEMtoiwiNpxs3uBpZ3tQMdKW8wbuU68cHgVGrXqXv",
          pnl: "-$70M",
          volume: "$80M",
          trades: 160,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7QxGV8mKMn8RDVv2R6KQxcAr31zZ9BB1zMMmS894m768",
          pnl: "-$60M",
          volume: "$70M",
          trades: 140,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "6J65eepwYpE4Lqn7Geqj7piaci1HkfWsAp68cnZG1Efg",
          pnl: "-$55M",
          volume: "$65M",
          trades: 130,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "AzDByJsGm9gAVQPX8v8WS3iAs3PPdTwZZDDUNP2u5nVj",
          pnl: "-$50M",
          volume: "$60M",
          trades: 120,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "8enKCua8QdbGQmqEdLnWVpUFougd3ZrhfFP6LBiQqX1D",
          pnl: "-$45M",
          volume: "$55M",
          trades: 110,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
          pnl: "-$40M",
          volume: "$50M",
          trades: 100,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "HV1KXxWFaSeriyFvXyx48FqG9BoFbfinB8njCJonqP7K",
          pnl: "-$35M",
          volume: "$45M",
          trades: 95,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "AqVyjNfb669ZotpBiUsA1x3ra3dc3KduuBngEQw18StW",
          pnl: "-$30M",
          volume: "$40M",
          trades: 85,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "GNVuYrBypY9bZXVoowiMjPjwVLqTrUirYwsJ6JYZdDEu",
          pnl: "-$25M",
          volume: "$35M",
          trades: 80,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "BmYRt6dfrNdHXTYTXfJxnDXtjMMCpUch7PKPJZrt3uVq",
          pnl: "-$20M",
          volume: "$30M",
          trades: 75,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
    },
    "7D": {
      gainers: [
        {
          trader: "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
          pnl: "+$200M",
          volume: "$220M",
          trades: 500,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "2bhkQ6uVn32ddiG4Fe3DVbLsrExdb3ubaY6i1G4szEmq",
          pnl: "+$180M",
          volume: "$200M",
          trades: 450,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "9a56eNL975mDrdewFSs5baZ7dagFUauutfa1uGsnGKfB",
          pnl: "+$160M",
          volume: "$180M",
          trades: 400,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "6QSc2CxSdkUQSXttkceR9yMuxMf36L75fS8624wJ9tXv",
          pnl: "+$140M",
          volume: "$160M",
          trades: 350,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "9roz1aqp82U6VpaDAQucFTmLpQ2vewtqTWijNN3JcCCC",
          pnl: "+$120M",
          volume: "$140M",
          trades: 300,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "4DbAcLDyhCLX7rKPx55xTQA6D8w2poSg3xwW6NzozAAe",
          pnl: "+$100M",
          volume: "$120M",
          trades: 250,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "FNay34Y1YJ634DHyzgQPTHgqojAirbLKp3uPHTRDwCBn",
          pnl: "+$80M",
          volume: "$100M",
          trades: 200,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7qVZm4Nxwp5v7bmkL57ZQm393e98PmpcZiYwkQx9oKts",
          pnl: "+$60M",
          volume: "$80M",
          trades: 150,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "AtTjQKXo1CYTa2MuxPARtr382ZyhPU5YX4wMMpvaa1oy",
          pnl: "+$40M",
          volume: "$60M",
          trades: 100,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "9kf7oyNPHZB7TWcZZRewFMFwGNDKSEZKSSumMdaRYiuv",
          pnl: "+$20M",
          volume: "$40M",
          trades: 50,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
      losers: [
        {
          trader: "BPo65Bz96dRuTj6vyuwjRQ7ZMSnbZmLaVajxmn2moiww",
          pnl: "-$150M",
          volume: "$170M",
          trades: 450,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "HBGdumkxEsZUsWz2sbg4GvHqJW9wA7CTa5sN9pn6pGMB",
          pnl: "-$130M",
          volume: "$150M",
          trades: 400,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "CtVvZeKyLm68xk8ngK6fznY2hAV1Kspw7VuJr5Ee2xED",
          pnl: "-$110M",
          volume: "$130M",
          trades: 350,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "93m7idp68v8oMT1fqNQMAX9vQFvtYzgtaoEJxS4PwbNU",
          pnl: "-$90M",
          volume: "$110M",
          trades: 300,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "93m7idp68v8oMT1fqNQMAX9vQFvtYzgtaoEJxS4PwbNU",
          pnl: "-$70M",
          volume: "$90M",
          trades: 250,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "HV1RDska68xUG3J9cfx4EUvyL3RLZRm72gHHBAWnYK8m",
          pnl: "-$50M",
          volume: "$70M",
          trades: 200,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7rhxnLV8C77o6d8oz26AgK8x8m5ePsdeRawjqvojbjnQ",
          pnl: "-$30M",
          volume: "$50M",
          trades: 150,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "DFZcDnmEYNUK1khquZzx5dQYiEyjJ3N5STqaDVLZ88ZU",
          pnl: "-$20M",
          volume: "$30M",
          trades: 100,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "8enKCua8QdbGQmqEdLnWVpUFougd3ZrhfFP6LBiQqX1D",
          pnl: "-$10M",
          volume: "$20M",
          trades: 50,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "Cciu3WnJuKkHkVaVF34hGNCsFG6cxyKxCo94ZSamPy4D",
          pnl: "-$5M",
          volume: "$10M",
          trades: 30,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
    },
    "1M": {
      gainers: [
        {
          trader: "4DbAcLDyhCLX7rKPx55xTQA6D8w2poSg3xwW6NzozAAe",
          pnl: "+$90M",
          volume: "$100M",
          trades: 180,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "9kf7oyNPHZB7TWcZZRewFMFwGNDKSEZKSSumMdaRYiuv",
          pnl: "+$80M",
          volume: "$90M",
          trades: 200,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7qVZm4Nxwp5v7bmkL57ZQm393e98PmpcZiYwkQx9oKts",
          pnl: "+$75M",
          volume: "$85M",
          trades: 170,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "FNay34Y1YJ634DHyzgQPTHgqojAirbLKp3uPHTRDwCBn",
          pnl: "+$65M",
          volume: "$75M",
          trades: 160,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "Gr3eiFhPfLAaA4SSHYqan8hcBB9dHLxRC176tfRtS4eb",
          pnl: "+$60M",
          volume: "$70M",
          trades: 140,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "2C5n9nGrWkniwgcN9UZQk16QQU1sPBe9v9Fg9Y9VKmDo",
          pnl: "+$55M",
          volume: "$65M",
          trades: 130,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "H1zFMUjYLzJwcfgXEtwiJ2ykvxmBr7JW6afW29PkcEAe",
          pnl: "+$50M",
          volume: "$60M",
          trades: 125,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "3B6AU7JkCPfb9JWfz5yxvrHbkVrmw8fwmZf2N9PqLMpu",
          pnl: "+$45M",
          volume: "$55M",
          trades: 110,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "2NHGzdMGW4Zoe4Szypj3QpQuZR2mq3qRgQk6ek1KkH7V",
          pnl: "+$40M",
          volume: "$50M",
          trades: 105,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7KuA1Uik1teBayCgHCF5JLFtk16yeLzAC2L95JFqaayc",
          pnl: "+$35M",
          volume: "$45M",
          trades: 95,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
      losers: [
        {
          trader: "9DRFEMtoiwiNpxs3uBpZ3tQMdKW8wbuU68cHgVGrXqXv",
          pnl: "-$70M",
          volume: "$80M",
          trades: 160,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "7QxGV8mKMn8RDVv2R6KQxcAr31zZ9BB1zMMmS894m768",
          pnl: "-$60M",
          volume: "$70M",
          trades: 140,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "6J65eepwYpE4Lqn7Geqj7piaci1HkfWsAp68cnZG1Efg",
          pnl: "-$55M",
          volume: "$65M",
          trades: 130,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "AzDByJsGm9gAVQPX8v8WS3iAs3PPdTwZZDDUNP2u5nVj",
          pnl: "-$50M",
          volume: "$60M",
          trades: 120,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "8enKCua8QdbGQmqEdLnWVpUFougd3ZrhfFP6LBiQqX1D",
          pnl: "-$45M",
          volume: "$55M",
          trades: 110,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
          pnl: "-$40M",
          volume: "$50M",
          trades: 100,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "HV1KXxWFaSeriyFvXyx48FqG9BoFbfinB8njCJonqP7K",
          pnl: "-$35M",
          volume: "$45M",
          trades: 95,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "AqVyjNfb669ZotpBiUsA1x3ra3dc3KduuBngEQw18StW",
          pnl: "-$30M",
          volume: "$40M",
          trades: 85,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "GNVuYrBypY9bZXVoowiMjPjwVLqTrUirYwsJ6JYZdDEu",
          pnl: "-$25M",
          volume: "$35M",
          trades: 80,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
        {
          trader: "BmYRt6dfrNdHXTYTXfJxnDXtjMMCpUch7PKPJZrt3uVq",
          pnl: "-$20M",
          volume: "$30M",
          trades: 75,
          address: "Hm7ZZomcstqbCHsdXPWL9yUpCQCJdKCXinaQZwbvRGtC",
        },
      ],
    },
  };

  const presets = ["All", "1D", "7D", "1M"];
  const [selectedPreset, setSelectedPreset] = useState("7D");
  const [gainersCopied, setGainersCopied] = useState(null);
  const [losersCopied, setLosersCopied] = useState(null);

  const copyAddress = (address, index, tableType, e) => {
    e.stopPropagation();
    navigator?.clipboard?.writeText(address);

    // Set the copied state based on the table type
    if (tableType === "gainers") {
      setGainersCopied(index);
    } else if (tableType === "losers") {
      setLosersCopied(index);
    }

    // Reset the copied state after a short delay
    setTimeout(() => {
      if (tableType === "gainers") {
        setGainersCopied(null);
      } else if (tableType === "losers") {
        setLosersCopied(null);
      }
    }, 2000);
  };

  return (
    <div className="md:h-[94vh] h-[87vh] overflow-y-auto bg-[#08080E] text-white ">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0A0A0B] text-white p-4 rounded-lg">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <Image
            src={proWallet}
            alt="Wallet Tracker Icon"
            width={20}
            height={20}
            className="object-contain"
          />
          <h1 className="text-lg font-semibold">
            {prowalletsPage?.mainHeader?.title}
          </h1>
        </div>

        {/* Right Section (Buttons) */}
        <div className="flex items-center bg-[#333333] p-1 rounded-md">
          {["All", "1D", "7D", "1M"].map((preset) => (
            <button
              key={preset}
              onClick={() => setSelectedPreset(preset)}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                selectedPreset === preset
                  ? "bg-[#1F73FC] text-white"
                  : "text-[#6E6E6E] hover:bg-[#1F73FC] hover:text-white"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Trader Board Table */}
      <div className=" px-5 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Gainers Table */}
          <div>
            <div className="flex justify-between items-center bg-[#0A0A0B] text-white p-4 border border-[#1A1B1E]">
              {/* Left Section - Title */}
              <div className="flex items-center gap-1">
                <h2 className="text-white font-semibold text-lg">
                  {prowalletsPage?.mainHeader?.left?.gainers}
                </h2>
                <Infotip
                  iconSize={20}
                  body={prowalletsPage?.mainHeader?.left?.gainerstool}
                />
              </div>

              {/* Right Section - Filter Button */}
              <button className="flex items-center text-[12px] gap-1 px-[20px] py-[10px] border border-[#1F73FC] hover:bg-[#11265B] rounded-md bg-transparent font-bold text-xs text-[white] cursor-pointer w-fit  h-[36px] xl:flex ease-in-out duration-300">
                <CiFilter size={16} />
                {prowalletsPage?.mainHeader?.filter}
              </button>
            </div>
            <div className="border border-[#22222c]">
              {/* Horizontal Scrolling Container */}
              <div className="w-full overflow-x-auto">
                {/* Outer Container with Fixed Width */}
                <div className="min-w-[600px] md:min-w-[700px]  overflow-y-scroll h-[75vh]">
                  <div className="w-full text-sm table-fixed">
                    {data[selectedPreset]?.gainers?.map((trader, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-[#22222c] border-y p-4 hover:bg-[#1f2229] transition-all"
                      >
                        {/* Left Section - Rank + Image + Name + Address */}
                        <div className="flex items-center gap-3 min-w-[300px]">
                          {/* Rank Badge */}
                          {index < 3 ? (
                            <div className="relative w-7 h-8 flex items-center justify-center font-normal text-white text-[16px]">
                              {/* Outer Shield */}
                              <div
                                className={`absolute w-full h-full ${
                                  index === 0
                                    ? "bg-[#FEF5BF]"
                                    : index === 1
                                    ? "bg-[#E6E8EC]"
                                    : "bg-[#FECBA1]"
                                }`}
                                style={{
                                  clipPath:
                                    "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                                }}
                              ></div>

                              {/* Inner Shield */}
                              <div
                                className={`absolute w-[75%] h-[75%] ${
                                  index === 0
                                    ? "bg-gradient-to-b from-[#FFE069] to-[#EFC353]"
                                    : index === 1
                                    ? "bg-gradient-to-b from-[#B8B9BD] to-[#969B9E]"
                                    : "bg-gradient-to-b from-[#E3A266] to-[#E5863E]"
                                }`}
                                style={{
                                  clipPath:
                                    "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                                }}
                              ></div>

                              {/* Rank Number */}
                              <span className="relative mt-[-2px]">
                                {index + 1}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white font-medium text-[12px] px-2 py-1 rounded-md bg-[#11265B]">
                              #{index + 1}
                            </span>
                          )}

                          {/* Trader Avatar */}
                          <img
                            src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
                            alt="Solana Logo"
                            className="h-10 w-10 rounded-md border border-gray-600"
                          />

                          {/* Name + Address */}
                          <div className="flex flex-col space-y-1">
                            {/* Name and Copy Icon in One Line */}
                            <div className="flex items-center space-x-2">
                              <span className="text-[#F6F6F6] text-[16px] font-semibold">
                                {trader.trader.slice(0, 10)}
                              </span>
                              <span className="text-[#6E6E6E] text-[16px] flex items-center">
                                {"/ "}{" "}
                                {trader.address.slice(0, 6) +
                                  "..." +
                                  trader.address.slice(-6)}
                                {gainersCopied === index ? (
                                  <IoMdDoneAll
                                    size={17}
                                    className="text-[#3f756d] cursor-pointer ml-2"
                                  />
                                ) : (
                                  <BiSolidCopy
                                    className="text-[#9b9999] cursor-pointer ml-2"
                                    onClick={(e) =>
                                      copyAddress(
                                        trader.address,
                                        index,
                                        "gainers",
                                        e
                                      )
                                    }
                                  />
                                )}
                              </span>
                            </div>

                            {/* Volume and Trades in One Line */}
                            <div className="text-sm flex items-center space-x-1">
                              <Tooltip
                                body={
                                  "The total value of assets traded (both buy and sell) by the wallet. Higher volume can indicate high activity or influence in the market."
                                }
                              >
                                <span className="text-[#6E6E6E] text-[12px] font-medium">
                                  Volume{" "}
                                  <span className="text-[#F1F0F0] text-[12px] font-normal">
                                    {trader.volume}
                                  </span>
                                </span>
                              </Tooltip>

                              <span className="text-[#6E6E6E]">•</span>

                              <Tooltip
                                body={
                                  "The total number of transactions executed by the wallet. This includes all individual buy and sell actions."
                                }
                              >
                                <span className="text-[#6E6E6E] text-[12px] font-medium">
                                  Trades{" "}
                                  <span className="text-[#F1F0F0] text-[12px] font-normal">
                                    {trader.trades}
                                  </span>
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - PNL */}
                        <Tooltip
                          body={
                            " The net earnings from trading activity. A positive number reflects gains, while a negative number indicates losses."
                          }
                        >
                          <div className="text-right">
                            <span className="text-gray-400 text-xs block">
                              PnL
                            </span>
                            <span className="text-[#21CB6B] text-[14px] font-semibold">
                              {trader.pnl}
                            </span>
                          </div>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Losers Table */}
          <div>
            <div className="flex justify-between items-center bg-[#0A0A0B] text-white p-4 border border-[#1A1B1E]">
              {/* Left Section - Title */}
              <div className="flex items-center gap-1">
                <h2 className="text-white font-semibold text-lg">
                  {prowalletsPage?.mainHeader?.right?.losers}
                </h2>
                <Infotip
                  iconSize={20}
                  body={prowalletsPage?.mainHeader?.right?.loserstool}
                />
              </div>

              {/* Right Section - Filter Button */}
              <button className="flex items-center text-[12px] gap-1 px-[20px] py-[10px] border border-[#1F73FC] hover:bg-[#11265B] rounded-md bg-transparent font-bold text-xs text-[white] cursor-pointer w-fit  h-[36px] xl:flex ease-in-out duration-300">
                <CiFilter size={16} />
                Filter
              </button>
            </div>

            <div className="border border-[#22222c]">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px] md:min-w-[700px]  overflow-y-scroll h-[75vh]">
                  <div className="w-full text-sm table-fixed">
                    {data[selectedPreset]?.losers?.map((trader, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-[#22222c] border-y p-4 hover:bg-[#1f2229] transition-all"
                      >
                        {/* Left Section - Rank + Image + Name + Address */}
                        <div className="flex items-center gap-3">
                          {/* Rank Badge */}
                          {index < 3 ? (
                            <div className="relative w-7 h-8 flex items-center justify-center font-normal text-white text-[16px] ">
                              {/* Outer Shield (Lighter Background) */}
                              <div
                                className={`absolute w-full h-full ${
                                  index === 0
                                    ? "bg-[#FEF5BF]"
                                    : index === 1
                                    ? "bg-[#E6E8EC]"
                                    : "bg-[#FECBA1]"
                                }`}
                                style={{
                                  clipPath:
                                    "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                                }}
                              ></div>

                              {/* Inner Shield (Darker Background) */}
                              <div
                                className={`absolute w-[75%] h-[75%] ${
                                  index === 0
                                    ? "bg-gradient-to-b from-[#FFE069] to-[#EFC353]"
                                    : index === 1
                                    ? "bg-gradient-to-b from-[#B8B9BD] to-[#969B9E]"
                                    : "bg-gradient-to-b from-[#E3A266] to-[#E5863E]"
                                }`}
                                style={{
                                  clipPath:
                                    "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                                }}
                              ></div>

                              {/* Rank Number (Shifted Slightly Upwards) */}
                              <span className="relative mt-[-2px]">
                                {index + 1}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white font-medium text-[12px] px-2 py-1 rounded-md bg-[#11265B]">
                              #{index + 1}
                            </span>
                          )}

                          {/* Trader Avatar */}
                          <img
                            src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
                            alt="Solana Logo"
                            className="h-10 w-10 rounded-md border border-gray-600"
                          />

                          {/* Name + Address */}
                          <div className="flex flex-col space-y-1">
                            {/* Name and Copy Icon in One Line */}
                            <div className="flex items-center space-x-2">
                              <span className="text-[#F6F6F6] text-[16px] font-semibold">
                                {trader.trader.slice(0, 10)}
                              </span>
                              <span className="text-[#6E6E6E] text-[16px] flex items-center">
                                {"/ "}{" "}
                                {trader.address.slice(0, 6) +
                                  "..." +
                                  trader.address.slice(-6)}
                                {losersCopied === index ? (
                                  <IoMdDoneAll
                                    size={17}
                                    className="text-[#3f756d] cursor-pointer ml-2"
                                  />
                                ) : (
                                  <BiSolidCopy
                                    className="text-[#9b9999] cursor-pointer ml-2"
                                    onClick={(e) =>
                                      copyAddress(
                                        trader.address,
                                        index,
                                        "losers",
                                        e
                                      )
                                    }
                                  />
                                )}
                              </span>
                            </div>

                            {/* Volume and Trades in One Line, Below the Name */}
                            <div className="text-sm flex items-center space-x-1">
                              <Tooltip
                                body={
                                  "The total value of assets traded (both buy and sell) by the wallet. Higher volume can indicate high activity or influence in the market."
                                }
                              >
                                <span className="text-[#6E6E6E] text-[12px] font-medium">
                                  Volume{" "}
                                  <span className="text-[#F1F0F0] text-[12px] font-normal">
                                    {trader.volume}
                                  </span>
                                </span>
                              </Tooltip>

                              <span className="text-[#6E6E6E]">•</span>

                              <Tooltip
                                body={
                                  "The total number of transactions executed by the wallet. This includes all individual buy and sell actions."
                                }
                              >
                                <span className="text-[#6E6E6E] text-[12px] font-medium">
                                  Trades{" "}
                                  <span className="text-[#F1F0F0] text-[12px] font-normal">
                                    {trader.trades}
                                  </span>
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - PNL */}
                        <Tooltip
                          body={
                            "The net earnings from trading activity. A positive number reflects gains, while a negative number indicates losses."
                          }
                        >
                          <div className="text-right">
                            <span className="text-gray-400 text-xs block">
                              PnL
                            </span>
                            <span className="text-[#ED1B24] text-[14px] font-semibold">
                              {trader.pnl}
                            </span>
                          </div>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderBoard;
