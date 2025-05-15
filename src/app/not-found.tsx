import Link from "next/link";
import { CardLayout } from "~/components/card-layout";

export default function RepoNotFoundPage() {
  return (
    <CardLayout className="text-foreground rounded-md p-6 text-center shadow-md">
      <svg
        className="mx-auto h-16 w-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 21a9 9 0 100-18 9 9 0 000 18z"
        />
      </svg>
      <h1 className="mt-4 text-2xl font-bold">Repository Not Found</h1>
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
