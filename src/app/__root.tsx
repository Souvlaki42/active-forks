import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { SearchXIcon } from "lucide-react";
import { CardLayout } from "~/components/card-layout";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import appCss from "./globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Active Forks" },
      { name: "description", content: "Find and analyze active forks" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function NotFound() {
  <CardLayout className="text-foreground rounded-md p-6 text-center shadow-md">
    <SearchXIcon aria-hidden className="mx-auto h-12 w-12" />
    <h1 className="mt-4 text-xl font-bold">404 - Repository Not Found</h1>
    <p className="mt-2 text-center">
      The repository you are looking for does not exist or has been removed.
    </p>
    <Link
      to="/"
      className="mt-4 inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      Return to Home
    </Link>
  </CardLayout>;
}

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider storageKey="vite-ui-theme" defaultTheme="system">
          <Outlet />
          <Scripts />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
