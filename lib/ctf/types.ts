export type AppNav = {
  isAuthenticated: boolean;
  currentUser: { name: string; href: string } | null;
  links: Array<{ href: string; label: string }>;
};

export type ChallengeListItem = {
  rank: number;
  href: string;
  title: string;
  category: string;
  author: string;
  authorHref: string;
  solved: number;
  score: number;
  isSolved?: boolean;
};

export type SelectOption = {
  value: string;
  label: string;
  selected: boolean;
};

export type ChallengeListPage = {
  title: string;
  nav: AppNav;
  categories: SelectOption[];
  events: SelectOption[];
  statuses: SelectOption[];
  items: ChallengeListItem[];
};

export type ChallengeListFilters = {
  category: string;
  event: string;
  status: string;
};

export type ChallengeListApiResponse = {
  categories: SelectOption[];
  events: SelectOption[];
  statuses: SelectOption[];
  items: ChallengeListItem[];
};

export type ScoreboardPage = {
  title: string;
  nav: AppNav;
  rows: Array<{ rank: number; user: string; userHref: string; solved: number; score: number }>;
  pages: Array<{ page: number; href: string; current: boolean }>;
};

export type ActivityPage = {
  title: string;
  nav: AppNav;
  rows: Array<{ time: string; user: string; userHref: string; challenge: string; challengeHref: string; status: string; correct: boolean }>;
};

export type ChallengeDetailPage = {
  title: string;
  nav: AppNav;
  id: number;
  challengeTitle: string;
  category: string;
  categoryHref: string;
  event: string;
  eventHref: string;
  author: string;
  authorHref: string;
  solved: number;
  score: number;
  markdown: string;
  solvedUsers: Array<{ time: string; user: string; userHref: string }>;
  csrfToken: string | null;
  loginRequired: boolean;
  alreadySolved: boolean;
};

export type UserProfilePage = {
  title: string;
  nav: AppNav;
  user: string;
  solvedCount: number;
  score: number;
  rows: Array<{ time: string; challenge: string; challengeHref: string; score: number; status: string }>;
};

export type AuthorProfilePage = {
  title: string;
  nav: AppNav;
  author: string;
  rows: Array<{ title: string; challengeHref: string; category: string; categoryHref: string; event: string; eventHref: string; solved: number; score: number }>;
};

export type AuthPage = {
  title: string;
  csrfToken: string | null;
  alert: string | null;
  fieldErrors: Record<string, string>;
  fieldValues: Record<string, string>;
};

export type FlashMessage = {
  type: "success" | "error" | "info";
  message: string;
};
