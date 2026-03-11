"use client";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { FC, PropsWithChildren } from "react";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </NuqsAdapter>
  );
};
