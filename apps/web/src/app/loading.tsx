"use client";

import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Loading() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4">
      <Loader2 className="text-primary h-16 w-16 animate-spin" />
      <h2 className="sr-only">Loading…</h2>
      <p className="text-muted-foreground mt-4 text-sm">
        Please wait while we fetch your data.
      </p>
      <Button onClick={() => window.location.reload()} className="mt-6">
        Retry
      </Button>
    </main>
  );
}
