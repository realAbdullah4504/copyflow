import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/common";
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table";
import type { ClassEntityV2 } from "@/types";

interface ClassesTableProps {
  data: ClassEntityV2[];
  columns: ColumnDef<ClassEntityV2>[];
  isLoading?: boolean;
}

const ClassesTable = ({ data, columns, isLoading }: ClassesTableProps) => {
  const table = useReactTable<ClassEntityV2>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
      <Card className="p-6 space-y-4">
        <DataTable<ClassEntityV2> table={table} columns={columns} isLoading={isLoading} />
    </Card>
  );
};

export default ClassesTable;
