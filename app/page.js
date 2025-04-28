"use client";
// import NewPairs from "./(pages)/newpairs/[slug]/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Trending from "./(pages)/trending/[slug]/page";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push(`/trending/solana`);
  }, []);
  // useEffect(() => {
  //   router.push(`/newpairs/${selectToken.toLowerCase()}`);
  // }, []);

  return (
    <div>
      {/* <NewPairs /> */}
      <Trending />
    </div>
  );
}