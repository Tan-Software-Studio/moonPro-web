import PortfolioForOtherWallet from "@/components/portfolio/PortfolioForOtherWallet";
import React from "react";

export default function page({ params }) {
  return <PortfolioForOtherWallet wallet={params?.address} />;
}
