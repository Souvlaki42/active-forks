import { CardLayout } from "~/components/card-layout";
import { ForksTable } from "~/components/forks-table/table";

export default function Home() {
  return (
    <CardLayout>
      <ForksTable forkResponse={{ forks: [], total: 0 }} />
    </CardLayout>
  );
}
