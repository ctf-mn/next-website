"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ChallengeListApiResponse, ChallengeListFilters } from "@ctf-mn/api/types";

type Props = {
  initialData: ChallengeListApiResponse;
  initialFilters: ChallengeListFilters;
};

function normalizeFilters(filters: ChallengeListFilters): ChallengeListFilters {
  return {
    category: filters.category || "all",
    event: filters.event || "all",
    status: filters.status || "all",
  };
}

function createFilterSearchParams(filters: ChallengeListFilters) {
  const params = new URLSearchParams();
  if (filters.category !== "all") {
    params.set("category", filters.category);
  }
  if (filters.event !== "all") {
    params.set("event", filters.event);
  }
  if (filters.status !== "all") {
    params.set("status", filters.status);
  }
  return params;
}

async function fetchChallengeList(filters: ChallengeListFilters, signal: AbortSignal): Promise<ChallengeListApiResponse> {
  const params = createFilterSearchParams(filters);
  const query = params.toString();
  const response = await fetch(`/api/challenge/list${query ? `?${query}` : ""}`, {
    method: "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to load challenge list (${response.status})`);
  }

  return response.json() as Promise<ChallengeListApiResponse>;
}

export function ChallengeListFilters({ initialData, initialFilters }: Props) {
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
      <ChallengeListFiltersContent initialData={initialData} initialFilters={initialFilters} />
    </QueryClientProvider>
  );
}

function ChallengeListFiltersContent({ initialData, initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedInitialFilters = normalizeFilters(initialFilters);
  const [filters, setFilters] = useState<ChallengeListFilters>(() => normalizedInitialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<ChallengeListFilters>(() => normalizedInitialFilters);
  const didMount = useRef(false);
  const hasFilterChanged =
    debouncedFilters.category !== normalizedInitialFilters.category ||
    debouncedFilters.event !== normalizedInitialFilters.event ||
    debouncedFilters.status !== normalizedInitialFilters.status;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => {
      window.clearTimeout(timer);
    };
  }, [filters]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const params = createFilterSearchParams(debouncedFilters);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debouncedFilters, pathname, router]);

  const query = useQuery({
    queryKey: ["challenge-list", debouncedFilters.category, debouncedFilters.event, debouncedFilters.status],
    queryFn: ({ signal }) => fetchChallengeList(debouncedFilters, signal),
    initialData,
    enabled: hasFilterChanged,
  });

  const data = query.data ?? initialData;
  const updateFilter = useCallback((key: keyof ChallengeListFilters, value: string) => {
    setFilters((prev) => {
      if (prev[key] === value) {
        return prev;
      }
      return { ...prev, [key]: value };
    });
  }, []);
  const handleCategoryChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateFilter("category", event.target.value);
    },
    [updateFilter],
  );
  const handleEventChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateFilter("event", event.target.value);
    },
    [updateFilter],
  );
  const handleStatusChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateFilter("status", event.target.value);
    },
    [updateFilter],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground" htmlFor="category">
                Category
              </label>
              <NativeSelect
                id="category"
                name="category"
                value={filters.category}
                onChange={handleCategoryChange}
              >
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
              <NativeSelect
                id="event"
                name="event"
                value={filters.event}
                onChange={handleEventChange}
              >
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
                <NativeSelect
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleStatusChange}
                >
                  {data.statuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            ) : null}
          </div>
          {query.isFetching ? <p className="mt-3 text-sm text-muted-foreground">Updating results...</p> : null}
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
                    <div className="flex items-center gap-2">
                      <Link href={item.href} className="font-medium text-foreground hover:underline">
                        {item.title}
                      </Link>
                      {item.isSolved ? (
                        <Badge
                          variant="secondary"
                          className="border-green-200 bg-green-50 text-green-700"
                        >
                          Solved
                        </Badge>
                      ) : null}
                    </div>
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
  );
}
