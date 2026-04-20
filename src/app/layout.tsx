import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/_components/navbar";
import { StepsIndicator } from "@/app/_components/StepsIndicator";
import { CVProvider } from "@/store/CVContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwissCV Generator",
  description: "Designed for Precision",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen w-full">
        <CVProvider>
          <Navbar />
          <StepsIndicator />
          <div className="min-h-[calc(100vh-120px)]">{children}</div>
        </CVProvider>
      </body>
    </html>
  );
}
