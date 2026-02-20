import Link from "next/link";

import { PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getActivity } from "@/lib/ctf/service";

export const revalidate = 15;

export default async function ActivityPage() {
  const data = await getActivity();

  return (
    <PageShell nav={data.nav}>
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Time</TableHead>
                <TableHead className="w-40">User</TableHead>
                <TableHead>Challenge</TableHead>
                <TableHead className="w-28 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, idx) => (
                <TableRow key={`${row.user}-${row.challenge}-${idx}`} className={row.correct ? "bg-emerald-50" : undefined}>
                  <TableCell className="text-slate-500">{row.time}</TableCell>
                  <TableCell>
                    <Link href={row.userHref} className="hover:underline">
                      {row.user}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={row.challengeHref} className="hover:underline">
                      {row.challenge}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={row.correct ? "success" : "destructive"}>{row.status}</Badge>
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
