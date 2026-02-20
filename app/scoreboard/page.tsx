import Link from "next/link";

import { PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { withEllipsis } from "@/lib/ctf/pagination";
import { toUrlSearchParams, type NextSearchParams } from "@/lib/ctf/search";
import { getScoreboard } from "@/lib/ctf/service";
import { cn } from "@/lib/utils";

export const revalidate = 60;

type Props = {
  searchParams: NextSearchParams;
};

export default async function ScoreboardPage({ searchParams }: Props) {
  const params = await toUrlSearchParams(searchParams);
  const data = await getScoreboard(params);
  const pagination = withEllipsis(data.pages);
  const currentPage = Math.max(1, Number(params.get("page") ?? "1") || 1);

  return (
    <PageShell nav={data.nav}>
      <Card>
        <CardHeader>
          <CardTitle>Scoreboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Solved</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row) => (
                <TableRow key={`${row.rank}-${row.user}`}>
                  <TableCell className="text-muted-foreground">{row.rank}</TableCell>
                  <TableCell>
                    <Link href={row.userHref} className="font-medium hover:underline">
                      {row.user}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{row.solved}</TableCell>
                  <TableCell className="text-right font-semibold">{row.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center gap-2">
            {pagination.map((item) =>
              item.type === "page" ? (
                <Link
                  key={item.value.page}
                  href={item.value.href}
                  aria-current={item.value.current || item.value.page === currentPage ? "page" : undefined}
                >
                  <Badge
                    className={cn(
                      "h-10 w-10 justify-center rounded-lg border p-0 text-sm transition-colors",
                      item.value.current || item.value.page === currentPage
                        ? "border-foreground/40 bg-muted text-foreground ring-1 ring-foreground/15 ring-offset-1 ring-offset-background font-semibold"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                    )}
                    variant="outline"
                  >
                    {item.value.page}
                  </Badge>
                </Link>
              ) : (
                <span key={item.key} className="px-1 text-muted-foreground" aria-hidden>
                  ...
                </span>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
