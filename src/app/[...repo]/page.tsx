import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { RepoSearchForm } from "~/components/repo-search";
import { API, FetchArgs } from "~/lib/providers/common";

export default async function Repo({
  params,
  searchParams,
}: {
  params: Promise<{ repo: string[] }>;
  searchParams: Promise<Omit<FetchArgs, "repo">>;
}) {
  const { repo } = await params;
  const { page = 1, per_page = 30 } = await searchParams;

  const { data, error } = await API.getForks("github", {
    page,
    per_page,
    repo,
  });

  if (error?.cause === "REPO_NOT_FOUND") notFound();

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
