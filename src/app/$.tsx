import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { RepoSearchForm } from "~/components/repo-search";
import { getForks } from "~/lib/github/forks";
import { tryCatch } from "~/lib/utils";

export const Route = createFileRoute("/app/$repo")({
  component: Repo,
});

function Repo() {
  const { repo } = Route.useParams();
  const { page = 1, per_page = 30 } = Route.useSearch();

  const { data, error } = await tryCatch(
    getForks({
      page: Number(page),
      per_page,
      repo: repo?.join("/"),
    }),
  );

  if (error?.message.includes("Not Found")) throw notFound();

  if (error) throw error;

  return (
    <CardLayout className="flex flex-col gap-4">
      <RepoSearchForm />
      <Suspense fallback={<ForksTable loading />}>
        <ForksTable data={data} />
      </Suspense>
    </CardLayout>
  );
}
