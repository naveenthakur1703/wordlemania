import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wordle Unlimited - Play Unlimited Word Games Online | WordleMania",
  description:
    "Play Wordle Unlimited online for free. Guess unlimited 5-letter words, track your streaks, and enjoy the best unlimited word puzzle game experience with WordleMania.",
  openGraph: {
    title: "Wordle Unlimited - Play Unlimited Word Games Online",
    description:
      "Play unlimited Wordle games online for free with WordleMania.",
    url: "https://wordlemania.online",
    siteName: "WordleMania",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}    >
      <body className="min-h-full flex flex-col">

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6DVXGDRDDB"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-6DVXGDRDDB');
    `}
        </Script>

        {children}

      </body>
    </html>
  );
}
