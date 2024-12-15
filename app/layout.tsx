import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./Navbar"; // Ensure Navbar exists in the same folder

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
  title: "Cyber",
  description: "Cyber",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Full-page layout with flexbox to keep footer at the bottom */}
        <div className="flex flex-col min-h-screen bg-gray-100 text-[#0B1F48] font-sans">
          {/* Navbar */}
          <Navbar />

          {/* Main content */}
          <main className="flex-grow pt-20">
            {children} {/* Render page content */}
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 py-6 text-gray-400 text-center">
            <p>&copy; Cyber.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
