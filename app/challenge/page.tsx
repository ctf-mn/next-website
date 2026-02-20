import { redirect } from "next/navigation";

export default function ChallengeIndexPage() {
  redirect("/challenge/list");
}
