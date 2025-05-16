import { SearchXIcon } from "lucide-react";
import Link from "next/link";
import { CardLayout } from "~/components/card-layout";

export default function RepoNotFoundPage() {
  return (
    <CardLayout className="text-foreground rounded-md p-6 text-center shadow-md">
      <SearchXIcon aria-hidden className="mx-auto h-12 w-12" />
      <h1 className="mt-4 text-xl font-bold">404 - Repository Not Found</h1>
      <p className="mt-2 text-center">
        The repository you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        Return to Home
      </Link>
    </CardLayout>
  );
}
