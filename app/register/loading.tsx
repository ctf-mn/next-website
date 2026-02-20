import { AuthPageSkeleton } from "@/components/site/page-skeletons";

export default function RegisterLoading() {
  return <AuthPageSkeleton titleWidth="w-28" fieldLabelWidths={["w-24", "w-16", "w-20", "w-32"]} helperWidth="w-44" />;
}
