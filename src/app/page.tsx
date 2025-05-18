import { Suspense } from "react";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";
import { RepoSearchForm } from "~/components/repo-search";

export default function Home() {
  return (
    <CardLayout className="flex flex-col gap-4">
      <RepoSearchForm />
      <Suspense fallback={<ForksTable loading />}>
        <ForksTable />
      </Suspense>
    </CardLayout>
  );
}
