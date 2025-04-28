/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ipfs.io",
      "logo.moralis.io",
      "gratisography.com",
      "cdn.moralis.io",
      'd23exngyjlavgo.cloudfront.net',
      "adds-token-info-29a861f.s3.eu-central-1.amazonaws.com",
      'res.cloudinary.com'
    ], // Add the domain here
  },
};

export default nextConfig;
