import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("rounded skeleton", className)} />;
}

type AuthPageSkeletonProps = {
  titleWidth: string;
  fieldLabelWidths: string[];
  helperWidth: string;
};

export function AuthPageSkeleton({ titleWidth, fieldLabelWidths, helperWidth }: AuthPageSkeletonProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className={cn("h-8", titleWidth)} />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fieldLabelWidths.map((width, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className={cn("h-4", width)} />
                <Skeleton className="h-10" />
              </div>
            ))}
            <Skeleton className="h-10" />
            <Skeleton className={cn("h-4", helperWidth)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type TableSkeletonColumn = {
  headWidth: string;
  headClassName?: string;
  cellWidth?: string;
  cellClassName?: string;
};

type TableSkeletonProps = {
  columns: TableSkeletonColumn[];
  rows?: number;
};

export function TableSkeleton({ columns, rows = 6 }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={`head-${index}`} className={column.headClassName}>
              <Skeleton className={cn("h-4", column.headWidth)} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <TableCell key={`cell-${rowIndex}-${columnIndex}`} className={column.cellClassName}>
                <Skeleton className={cn("h-4", column.cellWidth ?? "w-full")} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
