import Link from "next/link";

import { PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toUrlSearchParams, type NextSearchParams } from "@/lib/ctf/search";
import { getChallengeList } from "@/lib/ctf/service";

export const revalidate = 120;

type Props = {
  searchParams: NextSearchParams;
};

export default async function ChallengeListPage({ searchParams }: Props) {
  const params = await toUrlSearchParams(searchParams);
  const data = await getChallengeList(params);

  return (
    <PageShell nav={data.nav}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 md:grid-cols-3" method="get">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="category">
                  Category
                </label>
                <NativeSelect id="category" name="category" defaultValue={data.categories.find((o) => o.selected)?.value ?? "all"}>
                  {data.categories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="event">
                  Event
                </label>
                <NativeSelect id="event" name="event" defaultValue={data.events.find((o) => o.selected)?.value ?? "all"}>
                  {data.events.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              {data.statuses.length > 0 ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="status">
                    Status
                  </label>
                  <NativeSelect id="status" name="status" defaultValue={data.statuses.find((o) => o.selected)?.value ?? "all"}>
                    {data.statuses.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
              ) : null}
              <div className="md:col-span-3">
                <Button type="submit">
                  Apply filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Challenge</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Solved</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.rank}>
                    <TableCell className="text-muted-foreground">{item.rank}</TableCell>
                    <TableCell>
                      <Link href={item.href} className="font-medium text-foreground hover:underline">
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={item.authorHref} className="text-muted-foreground hover:text-foreground hover:underline">
                        {item.author}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">{item.solved}</TableCell>
                    <TableCell className="text-right font-semibold">{item.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
