import { ScoreboardTable } from "@/components/scoreboard/scoreboard-table";
import { PageShell } from "@/components/site/page-shell";
import { toUrlSearchParams, type NextSearchParams } from "@/lib/ctf/search";
import { getScoreboard } from "@/lib/ctf/service";

export const revalidate = 60;

type Props = {
  searchParams: NextSearchParams;
};

export default async function ScoreboardPage({ searchParams }: Props) {
  const params = await toUrlSearchParams(searchParams);
  const data = await getScoreboard(params);
  const currentPage = Math.max(1, Number(params.get("page") ?? "1") || 1);

  return (
    <PageShell nav={data.nav}>
      <ScoreboardTable initialData={{ rows: data.rows, pages: data.pages }} initialPage={currentPage} />
    </PageShell>
  );
}
