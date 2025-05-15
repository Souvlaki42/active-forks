import { notFound } from "next/navigation";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { FetchArgs, getForks } from "~/lib/providers/common";

export default async function Repo({
  params,
  searchParams,
}: {
  params: Promise<{ repo: string[] }>;
  searchParams: Promise<Omit<FetchArgs, "repo">>;
}) {
  const { repo } = await params;
  const { page = 1, perPage = 30 } = await searchParams;

  const { data: forkResponse, error } = await getForks("github", {
    page,
    perPage,
    repo,
  });

  if (error?.cause === "REPO_NOT_FOUND") notFound();

  if (error) throw error;

  return (
    <CardLayout>
      <ForksTable forkResponse={forkResponse} />
    </CardLayout>
  );
}
