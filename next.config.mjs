/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.29.204",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wavepro-core-89e1c8f57054.herokuapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nexastreaming.wavebot.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nexauserbackend.wavebot.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "moon-bk-9e55cf86c25b.herokuapp.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.29.154",
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