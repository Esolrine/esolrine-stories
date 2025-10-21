import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: {
    default: "Esolrine | Stories from a World of Magic",
    template: "%s | Esolrine",
  },
  description:
    "Explore short stories from the Esolrine universe - a world of solarpunk magic and possibility. Read tales that expand the world of the Esolrine webtoon.",
  keywords: ["Esolrine", "webtoon", "stories", "magic", "solarpunk", "fantasy"],
  authors: [{ name: "Esolrine" }],
  creator: "Esolrine",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://esolrine.com",
    siteName: "Esolrine",
    title: "Esolrine | Stories from a World of Magic",
    description:
      "Explore short stories from the Esolrine universe - a world of solarpunk magic and possibility.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Esolrine | Stories from a World of Magic",
    description:
      "Explore short stories from the Esolrine universe - a world of solarpunk magic and possibility.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${ebGaramond.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
