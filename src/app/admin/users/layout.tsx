import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default function AdminUsersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
