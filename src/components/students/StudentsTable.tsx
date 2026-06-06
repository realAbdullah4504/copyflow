import { DataTable } from "@/components/common";
import { Card } from "@/components/ui/card";
import type { Student } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface StudentsTableProps {
  data: Student[];
  columns: ColumnDef<Student>[];
  isLoading?: boolean;
}

const StudentsTable = ({ data, columns, isLoading }: StudentsTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const tableData = useMemo(() => data, [data]);

  const table = useReactTable<Student>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const student = row.original;
      return (
        student.firstName.toLowerCase().includes(search) ||
        student.lastName.toLowerCase().includes(search) ||
        student.grade.toLowerCase().includes(search)
      );
    },
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>
      <Card className="overflow-hidden">
        <DataTable<Student>
          table={table}
          isLoading={isLoading}
          columns={columns}
        />
      </Card>
    </div>
  );
};

export default StudentsTable;
