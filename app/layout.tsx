import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./Navbar"; // Asegúrate de tener este archivo

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ALCO",
  description: "Plataforma informativa para la Asociación Lucha Contra la Obesidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navbar */}
        <Navbar />
        
        {/* Main content */}
        <main className="pt-20">
          {children} {/* Esto renderiza el contenido de las páginas */}
        </main>
      </body>
    </html>
  );
}
