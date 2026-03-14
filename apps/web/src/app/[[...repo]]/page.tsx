import { Suspense } from "react";
import { getForks } from "~/actions/github";
import { AdvancedQueries } from "~/components/advanced-queries";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { RepoSearchForm } from "~/components/repo-search";

export default async function Repo({
  params,
}: {
  params: Promise<{ repo?: string[] }>;
}) {
  const { repo } = await params;
  const [owner, repoName] = repo ?? [];

  const forks = getForks({ owner, repo: repoName });

  return (
    <CardLayout className="flex flex-col gap-4">
      <RepoSearchForm />
      <AdvancedQueries />
      <Suspense fallback={<ForksTable loading />}>
        <ForksTable promise={forks} />
      </Suspense>
    </CardLayout>
  );
}
