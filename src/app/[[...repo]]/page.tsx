import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { RepoSearchForm } from "~/components/repo-search";
import { getForks } from "~/lib/github/forks";
import { tryCatch } from "~/lib/utils";

export default async function Repo({
  params,
  searchParams,
}: {
  params: Promise<{ repo?: string[] }>;
  searchParams: Promise<{ page?: string; per_page?: string }>;
}) {
  const { repo } = await params;
  const { page = 1, per_page = 30 } = await searchParams;

  const { data, error } = await tryCatch(
    getForks({
      page: Number(page),
      per_page,
      repo: repo?.join("/"),
    }),
  );

  if (error?.message.includes("Not Found")) notFound();

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
