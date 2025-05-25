/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logo.moralis.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gratisography.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.moralis.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d23exngyjlavgo.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "adds-token-info-29a861f.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
