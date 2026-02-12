import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { connection } from 'next/server';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "RedTab Merchant",
    template: "%s | RedTab Merchant",
  },
  description: "RedTab Merchant Portal",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased font-poppins`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
