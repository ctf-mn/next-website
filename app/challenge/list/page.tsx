import { ChallengeListFilters } from "@/components/challenge/challenge-list-filters";
import { PageShell } from "@/components/site/page-shell";
import { toUrlSearchParams, type NextSearchParams } from "@ctf-mn/api/search";
import { getChallengeList } from "@ctf-mn/api/service";

export const revalidate = 120;

type Props = {
  searchParams: NextSearchParams;
};

export default async function ChallengeListPage({ searchParams }: Props) {
  const params = await toUrlSearchParams(searchParams);
  const data = await getChallengeList(params);
  const initialFilters = {
    category: data.categories.find((option) => option.selected)?.value ?? "all",
    event: data.events.find((option) => option.selected)?.value ?? "all",
    status: data.statuses.find((option) => option.selected)?.value ?? "all",
  };

  return (
    <PageShell nav={data.nav}>
      <ChallengeListFilters
        initialData={{
          categories: data.categories,
          events: data.events,
          statuses: data.statuses,
          items: data.items,
        }}
        initialFilters={initialFilters}
      />
    </PageShell>
  );
}
