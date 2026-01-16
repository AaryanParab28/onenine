import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OneNine Innovation Haus | Where Ideas Are Broken Open",
  description: "A threshold experience. Enter the Innovation Haus where ideas are dismantled and rebuilt with intent.",
  keywords: ["innovation", "design", "experiments", "philosophy", "creative"],
  authors: [{ name: "OneNine" }],
  openGraph: {
    title: "OneNine Innovation Haus",
    description: "Where ideas are dismantled and rebuilt with intent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
