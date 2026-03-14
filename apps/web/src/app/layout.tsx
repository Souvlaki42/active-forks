import type { Metadata } from "next";
import { DM_Sans, Fira_Code, Lora } from "next/font/google";
import { Providers } from "~/components/providers";
import { env } from "~/lib/env";
import { cn } from "~/lib/utils";
import "./globals.css";
import Script from "next/script";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Active Forks",
  description: "Find and analyze active forks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={cn(
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable,
          "antialiased",
        )}
      >
        <Providers>
          {children}
          {env.NODE_ENV === "development" && (
            <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-card p-3 font-mono text-xs text-card-foreground">
              <div className="block sm:hidden">xs</div>
              <div className="hidden sm:block md:hidden">sm</div>
              <div className="hidden md:block lg:hidden">md</div>
              <div className="hidden lg:block xl:hidden">lg</div>
              <div className="hidden xl:block 2xl:hidden">xl</div>
              <div className="hidden 2xl:block">2xl</div>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
