import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EU Motorcycle Repair Shops",
  description: "Find motorcycle repair shops across Europe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
