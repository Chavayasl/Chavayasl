import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { AccessibilityBtn } from "@/components/layout/AccessibilityBtn";
import { LoadingScreen } from "@/components/layout/LoadingScreen";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "חוויה סביב השנה – הפעלות וסדנאות לבתי ספר וגנים",
  description: "חוויה סביב השנה מספקת סדנאות, הצגות והפעלות חינוכיות לבתי ספר וגנים ברחבי הארץ. פעילויות מגוונות לכל גיל ועונה.",
  openGraph: {
    title: "חוויה סביב השנה",
    description: "הפעלות וסדנאות חינוכיות לבתי ספר וגנים",
    locale: "he_IL",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} scroll-smooth`}>
      <body className="font-rubik min-h-screen flex flex-col bg-[#FAF7F4]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:bg-[#0F4C2A] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          דלג לתוכן הראשי
        </a>
        <LoadingScreen />
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <AccessibilityBtn />
      </body>
    </html>
  );
}
