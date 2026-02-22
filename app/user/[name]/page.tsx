import Link from "next/link";

import { PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUserProfile } from "@ctf-mn/api/service";

export const revalidate = 60;

type Props = {
  params: Promise<{ name: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { name } = await params;
  const data = await getUserProfile(name);

  return (
    <PageShell nav={data.nav}>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>User: {data.user}</CardTitle>
            <Badge variant="secondary">
              Solved: {data.solvedCount} | Score: {data.score}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Time</TableHead>
                <TableHead>Challenge</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, idx) => (
                <TableRow key={`${row.challenge}-${idx}`}>
                  <TableCell className="text-muted-foreground">{row.time}</TableCell>
                  <TableCell>
                    <Link href={row.challengeHref} className="hover:underline">
                      {row.challenge}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{row.score}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={row.status.toLowerCase() === "correct" ? "success" : "destructive"}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
