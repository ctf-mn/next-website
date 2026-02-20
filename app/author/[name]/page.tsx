import Link from "next/link";

import { PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAuthorProfile } from "@/lib/ctf/service";

export const revalidate = 60;

type Props = {
  params: Promise<{ name: string }>;
};

export default async function AuthorProfilePage({ params }: Props) {
  const { name } = await params;
  const data = await getAuthorProfile(name);

  return (
    <PageShell nav={data.nav}>
      <Card>
        <CardHeader>
          <CardTitle>Author: {data.author}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Solved</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, idx) => (
                <TableRow key={`${row.title}-${idx}`}>
                  <TableCell>
                    <Link href={row.challengeHref} className="font-medium hover:underline">
                      {row.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={row.categoryHref} className="hover:underline">
                      <Badge variant="secondary">{row.category}</Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={row.eventHref} className="hover:underline">
                      {row.event}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{row.solved}</TableCell>
                  <TableCell className="text-right font-semibold">{row.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
