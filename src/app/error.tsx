"use client";

import { CircleXIcon } from "lucide-react";
import { CardLayout } from "~/components/card-layout";
import { Button } from "~/components/ui/button";
import { CustomError } from "~/lib/errors";

// TODO: Implement better logging / error reporting
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: CustomError;
  reset: () => void;
}) {
  const { cause, message } = CustomError.parse(error) ?? {
    cause: "UNKNOWN",
    message: "An unexpected error has occurred.",
  };

  return (
    <CardLayout className="text-foreground rounded-md p-6 text-center shadow-md">
      <CircleXIcon aria-hidden className="mx-auto h-12 w-12 text-red-600" />
      <h1 className="mt-4 text-xl font-bold text-red-500">
        500 - Oops, something went wrong!
      </h1>
      <p className="mt-2 text-lg">
        {message ?? "An unexpected error has occurred."}
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        {typeof cause === "string" ? cause : "Please try again later."}
      </p>
      <Button
        onClick={reset}
        className="mt-4 inline-flex items-center rounded px-4 py-2 focus:ring-2 focus:outline-none"
      >
        Try Again
      </Button>
    </CardLayout>
  );
}
