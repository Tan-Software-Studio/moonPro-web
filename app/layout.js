import "./globals.css";
import localFont from "next/font/local";
import { Poppins, Space_Grotesk } from "next/font/google";
import PagesLayout from "./PagesLayout";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";
import Providers from "./redux/provider";
const metaDataMainName = process.env.NEXT_PUBLIC_METADATA_MAIN_NAME || "Nexa";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Google Font - Space Grotesk
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"], // Add the weights you need
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "600", "700"], // Add the weights you need
});

export const metadata = {
  title: metaDataMainName,
  description: `${metaDataMainName
    ?.toString()
    ?.toUpperCase()} is the premier gateway to seamless on-chain trading and rapid asset discovery.`,

  twitter: {
    card: 'summary', // or 'summary_large_image' if you have a larger preview image
    title: metaDataMainName,
    description: `${metaDataMainName
      ?.toString()
      ?.toUpperCase()} is the premier gateway to seamless on-chain trading and rapid asset discovery.`,
    images: [`${process.env.NEXT_PUBLIC_WEB_URL}assets/SharePnL/x-card.webp`], // replace with your actual image URL(s)
  },
};

export default function RootLayout({ children }) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${poppins.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Providers>
          <div className="flex">
            <PagesLayout childrens={children} />
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
