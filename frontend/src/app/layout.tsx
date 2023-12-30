import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Mantine from "@/context/Mantine";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Lettfaktura",
  },
  description: "lettfaktura app",
  icons: "https://www.lettfaktura.no/images/favicon.jpg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Mantine>
            <main>{children}</main>
          </Mantine>
        </AuthProvider>
      </body>
    </html>
  );
}
