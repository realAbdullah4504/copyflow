import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/common";
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table";
import type { ClassEntity } from "@/types";

interface ClassesTableProps {
  data: ClassEntity[];
  columns: ColumnDef<ClassEntity>[];
  isLoading?: boolean;
}

const ClassesTable = ({ data, columns, isLoading }: ClassesTableProps) => {
  const table = useReactTable<ClassEntity>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="p-6 space-y-4">
      <DataTable<ClassEntity> table={table} columns={columns} isLoading={isLoading} />
    </Card>
  );
};

export default ClassesTable;
