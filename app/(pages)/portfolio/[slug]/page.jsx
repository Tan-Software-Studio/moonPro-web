import PortfolioMainPage from '@/components/portfolio/PortfolioMainPage';
import React from 'react';
const page = ({ params }) => {
  const walletAddress = params?.slug;
  return (
    <PortfolioMainPage walletAddress={walletAddress} />
  );
};

export default page;