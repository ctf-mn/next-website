import { AuthPageSkeleton } from "@/components/site/page-skeletons";

export default function LoginLoading() {
  return <AuthPageSkeleton titleWidth="w-24" fieldLabelWidths={["w-32", "w-20"]} helperWidth="w-48" />;
}
