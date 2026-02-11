import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wallet",
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
