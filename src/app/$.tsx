import { createFileRoute } from "@tanstack/react-router";

import { Suspense } from "react";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { RepoSearchForm } from "~/components/repo-search";
import { getForks } from "~/lib/github/forks";
import { tryCatch } from "~/lib/utils";

export const Route = createFileRoute("/$")({
  component: Repo,
});

function Repo() {
  const { owner, repo } = Route.useParams();
  const promise = tryCatch(getForks({ repo: [owner, repo].join("/") }));

  return (
    <CardLayout className="flex flex-col gap-4">
      <RepoSearchForm />
      <Suspense
        fallback={
          <ForksTable
            loading
            promisedData={Promise.resolve({ data: [], error: null })}
          />
        }
      >
        <ForksTable promisedData={promise} />
      </Suspense>
    </CardLayout>
  );
}
