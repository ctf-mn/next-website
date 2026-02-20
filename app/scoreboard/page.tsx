import Link from "next/link";

import { PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toUrlSearchParams, type NextSearchParams } from "@/lib/ctf/search";
import { getScoreboard } from "@/lib/ctf/service";

export const revalidate = 60;

type Props = {
  searchParams: NextSearchParams;
};

export default async function ScoreboardPage({ searchParams }: Props) {
  const params = await toUrlSearchParams(searchParams);
  const data = await getScoreboard(params);

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
            {data.pages.map((page) => (
              <Link key={page.page} href={page.href}>
                <Badge variant={page.current ? "default" : "secondary"}>{page.page}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
