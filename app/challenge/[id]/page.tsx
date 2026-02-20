import Link from "next/link";
import { notFound } from "next/navigation";

import { ChallengeMarkdown } from "@/components/challenge/challenge-markdown";
import { FlashAlert } from "@/components/site/flash-alert";
import { PageShell } from "@/components/site/page-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseChallengeContent } from "@/lib/ctf/attachments";
import { readFlash } from "@/lib/ctf/flash";
import { getChallenge } from "@/lib/ctf/service";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const challengeId = Number(id);

  if (!Number.isFinite(challengeId)) {
    notFound();
  }

  const [data, flash] = await Promise.all([getChallenge(challengeId), readFlash()]);
  const { attachments, contentMarkdown } = parseChallengeContent(data.markdown);

  return (
    <PageShell nav={data.nav}>
      <div className="space-y-4">
        <FlashAlert flash={flash} />

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>{data.challengeTitle}</CardTitle>
              <Badge>{data.score} points</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link href={data.categoryHref} className="hover:underline">
                {data.category}
              </Link>
              <span>•</span>
              <Link href={data.eventHref} className="hover:underline">
                {data.event}
              </Link>
              <span>•</span>
              <Link href={data.authorHref} className="hover:underline">
                {data.author}
              </Link>
              <span>•</span>
              <span>Solved: {data.solved}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <article className="prose prose-sm max-w-none dark:prose-invert sm:prose-base">
              <ChallengeMarkdown markdown={contentMarkdown} />
            </article>

            {data.loginRequired ? (
              <Alert variant="info">
                <AlertTitle>Login required</AlertTitle>
                <AlertDescription>You need to log in to submit a flag.</AlertDescription>
              </Alert>
            ) : null}
            {data.alreadySolved ? (
              <Alert variant="info">
                <AlertDescription>Congratulations! You already solved this challenge.</AlertDescription>
              </Alert>
            ) : null}

            {!data.alreadySolved ? (
              <form action={`/challenge/${data.id}/submit`} method="post" className="flex flex-col gap-3 md:flex-row">
                {data.csrfToken ? <input type="hidden" name="_csrf_token" value={data.csrfToken} /> : null}
                <input type="hidden" name="action" value="flag" />
                <Input name="flag" placeholder="Flag" disabled={data.loginRequired} required />
                <Button type="submit" disabled={data.loginRequired}>
                  Submit Flag
                </Button>
              </form>
            ) : null}

            {attachments.length > 0 ? (
              <section className="space-y-3 border-t pt-4">
                <h2 className="text-base font-semibold">Attachments</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {attachments.map((attachment) => {
                    const external = /^https?:\/\//i.test(attachment.href);
                    return (
                      <a
                        key={attachment.href}
                        href={attachment.href}
                        className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer noopener" : undefined}
                      >
                        <p className="text-sm font-medium leading-tight">{attachment.label}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground group-hover:text-accent-foreground/80">
                          {attachment.href}
                        </p>
                      </a>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solve History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solved at</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.solvedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No one solved yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.solvedUsers.map((row, idx) => (
                    <TableRow key={`${row.user}-${idx}`}>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>
                        <Link href={row.userHref} className="hover:underline">
                          {row.user}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
