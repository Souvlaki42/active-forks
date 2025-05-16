"use client";

import { Loader2 } from "lucide-react";
import { CardLayout } from "~/components/card-layout";
import { Button } from "~/components/ui/button";

export default function Loading() {
  return (
    <div className="bg-background flex h-full w-full items-center justify-center p-4">
      <CardLayout className="animate-fade-in p-8 text-center">
        <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
        <h2 className="text-foreground text-lg font-semibold">Loading…</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Please wait while we fetch your data.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            window.location.reload();
          }}
          className="mt-6"
        >
          Retry
        </Button>
      </CardLayout>
    </div>
  );
}
