import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Catalog",
};

export default function AdminCatalogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
