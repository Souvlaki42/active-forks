import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { RepoSearchForm } from "~/components/repo-search";
import { getForks } from "~/lib/github/forks";
import { tryCatch } from "~/lib/utils";

export default async function Repo({
  params,
}: {
  params: Promise<{ repo?: string[] }>;
}) {
  const { repo } = await params;

  const { data, error } = await tryCatch(getForks({ repo: repo?.join("/") }));

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
