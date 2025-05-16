import { Suspense } from "react";
import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";

export default function Home() {
  return (
    <CardLayout>
      <Suspense fallback={<ForksTable loading />}>
        <ForksTable />
      </Suspense>
    </CardLayout>
  );
}
