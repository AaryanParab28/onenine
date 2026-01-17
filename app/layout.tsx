import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
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
    <html lang="en" className={`${inter.variable} ${vt323.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
