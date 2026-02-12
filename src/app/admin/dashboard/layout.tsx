import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
