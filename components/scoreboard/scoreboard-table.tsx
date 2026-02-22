"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { withEllipsis } from "@/lib/ctf/pagination";
import type { ScoreboardApiResponse } from "@/lib/ctf/types";
import { cn } from "@/lib/utils";

type Props = {
  initialData: ScoreboardApiResponse;
  initialPage: number;
};

async function fetchScoreboard(page: number, signal: AbortSignal): Promise<ScoreboardApiResponse> {
  const response = await fetch(`/api/scoreboard?page=${page}`, {
    method: "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to load scoreboard (${response.status})`);
  }

  return response.json() as Promise<ScoreboardApiResponse>;
}

function toScoreboardHref(page: number) {
  return page <= 1 ? "/scoreboard" : `/scoreboard?page=${page}`;
}

export function ScoreboardTable({ initialData, initialPage }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ScoreboardTableContent initialData={initialData} initialPage={initialPage} />
    </QueryClientProvider>
  );
}

function ScoreboardTableContent({ initialData, initialPage }: Props) {
  const [page, setPage] = useState(initialPage);
  const didMount = useRef(false);
  const hasPageChanged = page !== initialPage;
  const query = useQuery({
    queryKey: ["scoreboard", page],
    queryFn: ({ signal }) => fetchScoreboard(page, signal),
    initialData,
    enabled: hasPageChanged,
  });
  const data = query.data ?? initialData;
  const pagination = withEllipsis(data.pages);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const href = toScoreboardHref(page);
    window.history.replaceState(window.history.state, "", href);
  }, [page]);

  return (
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

        {query.isFetching ? <p className="text-sm text-muted-foreground">Updating results...</p> : null}

        <div className="flex flex-wrap items-center gap-2">
          {pagination.map((item) => {
            if (item.type !== "page") {
              return (
                <span key={item.key} className="px-1 text-muted-foreground" aria-hidden>
                  ...
                </span>
              );
            }

            const isActive = item.value.current || item.value.page === page;

            return (
              <Link
                key={item.value.page}
                href={item.value.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={isActive ? `Current page ${item.value.page}` : `Go to page ${item.value.page}`}
                onClick={(event) => {
                  event.preventDefault();
                  setPage(item.value.page);
                }}
              >
                <Badge
                  className={cn(
                    "h-10 w-10 justify-center rounded-lg border p-0 text-sm transition-colors",
                    isActive
                      ? "border-foreground/40 bg-muted text-foreground ring-1 ring-foreground/15 ring-offset-1 ring-offset-background font-semibold"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                  variant="outline"
                >
                  {item.value.page}
                </Badge>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
