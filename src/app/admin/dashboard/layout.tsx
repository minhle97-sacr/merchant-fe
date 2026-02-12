import { Metadata } from "next";
import { connection } from 'next/server';

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return children;
}
