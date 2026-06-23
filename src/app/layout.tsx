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
  metadataBase: new URL("https://chavayasl.co.il"),
  title: {
    default: "חוויה סביב השנה – סדנאות והפעלות לילדים, אטרקציות לבתי ספר וגנים",
    template: "%s | חוויה סביב השנה",
  },
  description: "סדנאות והפעלות חווייתיות לילדים, אטרקציות לבתי ספר וגנים, וחוגי העשרה לכל הגילאים כולל חטיבת ביניים. חוויה, הנאה ולמידה שמגיעות עד אליכם — מאושר גפ\"ן.",
  keywords: [
    "סדנאות לילדים", "הפעלות לילדים", "אטרקציות לבית ספר", "חוגי העשרה לילדים",
    "פעילויות לחטיבת ביניים", "הפעלות לגנים", "סדנאות לבתי ספר", "הפעלות לחגים",
    "חוויה", "הנאה", "אטרקציות לילדים", "מאושר גפן", "חוויה סביב השנה",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "חוויה סביב השנה – סדנאות והפעלות לילדים",
    description: "סדנאות, הפעלות ואטרקציות חווייתיות לבתי ספר, גנים וחטיבות ביניים — מגיעות עד אליכם.",
    locale: "he_IL",
    type: "website",
    siteName: "חוויה סביב השנה",
  },
  twitter: {
    card: "summary_large_image",
    title: "חוויה סביב השנה – סדנאות והפעלות לילדים",
    description: "סדנאות, הפעלות ואטרקציות חווייתיות לבתי ספר, גנים וחטיבות ביניים.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} scroll-smooth`}>
      <body className="font-rubik min-h-screen flex flex-col bg-[#FAF7F4]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "חוויה סביב השנה",
            url: "https://chavayasl.co.il",
            logo: "https://chavayasl.co.il/logo-hero.png",
            description: "סדנאות, הפעלות ואטרקציות חווייתיות לילדים — לבתי ספר, גנים וחטיבות ביניים. חוגי העשרה וחוויות שמגיעות עד אליכם.",
            telephone: "+972-55-667-1997",
            email: "office.chavayasl@gmail.com",
            areaServed: "IL",
            sameAs: [],
          }) }}
        />
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
