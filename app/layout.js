import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mathla'ul Anwar Jawa Tengah",
  description: "Website Resmi Pengurus Wilayah Mathla'ul Anwar Jawa Tengah - Organisasi Islam yang berfokus pada Pendidikan, Dakwah, dan Sosial.",
  keywords: "Mathlaul Anwar, Jawa Tengah, MA Jateng, organisasi Islam, pendidikan Islam, dakwah",
  openGraph: {
    title: "Mathla'ul Anwar Jawa Tengah",
    description: "Website Resmi Pengurus Wilayah Mathla'ul Anwar Jawa Tengah",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="top-right" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
