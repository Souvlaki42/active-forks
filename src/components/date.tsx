"use client";

import { ComponentType, ReactNode, useEffect, useState } from "react";

function withClient<T extends Record<string, string | null | undefined>>(
  Comp: ComponentType<T>
) {
  return function ClientOnly(props: T & { children?: ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
      setIsClient(true);
    }, []);
    return isClient ? <Comp {...props} /> : null;
  };
}

const DateTime = ({ date }: { date?: string | null }) =>
  !!date ? (
    <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
  ) : (
    "No date"
  );

export default withClient(DateTime);
