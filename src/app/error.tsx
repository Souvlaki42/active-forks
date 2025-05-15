"use client";

import { useEffect } from "react";
import { CardLayout } from "~/components/card-layout";
import { Button } from "~/components/ui/button";
import { ErrorWithCause } from "~/lib/errors";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: ErrorWithCause & { digest?: string };
  reset: () => void;
}) {
  // TODO: Implement better logging / error reporting
  useEffect(() => {
    console.dir("Give that to the developer:", error);
  }, [error]);

  return (
    <CardLayout className="text-foreground rounded-md p-6 text-center shadow-md">
      <svg
        className="mx-auto h-12 w-12 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="mt-4 text-xl font-semibold text-red-700">
        Oops, something went wrong!
      </h2>
      <p className="mt-2 text-sm">
        {error.message ?? "An unexpected error has occurred."}
      </p>
      {error.cause && (
        <p className="mt-1 text-sm">Cause: {String(error.cause)}</p>
      )}
      <Button
        onClick={reset}
        className="mt-4 inline-flex items-center rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
      >
        Try Again
      </Button>
    </CardLayout>
  );
}
