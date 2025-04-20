// This project was developed by MOUAAD MRABBI - 2025
// All rights reserved © AndroCat

export const metadata = {
  title: "AndroCat",
  description: "Download free games and programs, including many popular Android games with MOD.",
  icons: "/images/logo.png",
  author: "MOUAAD MRABBI",
  copyright: "© 2025 AndroCat. All rights reserved.",
};

import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { ToastContainer } from "react-toastify";
import '@/components/clientLogger';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <Nav />
        <div className="max-w-[1348px] mx-auto">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
