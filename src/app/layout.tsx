import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "~/components/theme-provider";
import "./globals.css";
import { env } from "~/lib/env";

const mainFont = DM_Sans({
  subsets: ["latin"],
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
      <body className={mainFont.className}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="var(--primary)" />
            {children}
            {env.NODE_ENV === "development" && (
              <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-primary p-3 font-mono text-xs text-white">
                <div className="block sm:hidden">xs</div>
                <div className="hidden sm:block md:hidden">sm</div>
                <div className="hidden md:block lg:hidden">md</div>
                <div className="hidden lg:block xl:hidden">lg</div>
                <div className="hidden xl:block 2xl:hidden">xl</div>
                <div className="hidden 2xl:block">2xl</div>
              </div>
            )}
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
