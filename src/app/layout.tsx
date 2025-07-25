import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { LayoutContent } from "./layout-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Text based game",
  description: "Text based game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-gray-100 min-h-screen relative`}
      >
        <div className="bg-gradient-to-br from-blue-900 via-black to-gray-900 absolute top-0 right-0 bottom-0 left-0"></div>

        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
