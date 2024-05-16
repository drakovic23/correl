import { Inter } from "next/font/google";
import "./globals.css";
import SidebarNavTest from "@/components/SidebarNav/SidebarNav"
import Footer from "@/components/Footer/Footer";
import Loading from "@/app/bonds/loading";
import React, {Suspense} from "react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Correl",
  description: "Your solution to the markets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <SidebarNavTest>
          <Suspense fallback={<Loading/> /*I don't know if this works*/} className="justify-center">
              <div className="p-1.5">
              {children}
              </div>

              <div className="mt-auto static">
                  <Footer/>
              </div>
          </Suspense>
      </SidebarNavTest>
      </body>
    </html>
  );
}
