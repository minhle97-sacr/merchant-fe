import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Management",
};

export default function TeamManagementLayout({ children }: { children: React.ReactNode }) {
  return children;
}
