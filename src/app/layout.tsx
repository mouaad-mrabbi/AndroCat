export const metadata = {
  title: "AndroCat",
  description:
    "Download free games and programs, including many popular Android games with MOD.",
  icons: "/images/logo.png",
};

import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
