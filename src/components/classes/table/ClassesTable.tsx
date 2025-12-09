import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/common";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import type { ClassesWithSchedules } from "@/types";

interface ClassesTableProps {
  data: ClassesWithSchedules[];
  columns: ColumnDef<ClassesWithSchedules>[];
  isLoading?: boolean;
}

const ClassesTable = ({ data, columns, isLoading }: ClassesTableProps) => {
  const table = useReactTable<ClassesWithSchedules>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="p-6 space-y-4">
      <DataTable<ClassesWithSchedules>
        table={table}
        columns={columns}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default ClassesTable;
