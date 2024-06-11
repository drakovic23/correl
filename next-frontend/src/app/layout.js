import { Inter } from "next/font/google";
import "./globals.css";
import SidebarNavTest from "@/components/SidebarNav/SidebarNav"
import Footer from "@/components/Footer/Footer";
import InfinityLoader from "@/components/InfinityLoader/InfinityLoader";
import React, {Suspense} from "react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "GetStats",
    description: "Your solution to the markets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <SidebarNavTest>
          <Suspense
              fallback={<InfinityLoader/>}
          >
              <div className="p-1.5">
              {children}
              </div>
          </Suspense>
              <div className="mt-auto static">
                  <Footer/>
              </div>

      </SidebarNavTest>
      </body>
    </html>
  );
}
