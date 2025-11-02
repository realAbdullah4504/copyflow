import { DataTable } from "@/components/common";
import { Card } from "@/components/ui/card";
import type { User } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

interface UsersTableProps {
  data: User[];
  columns: ColumnDef<User>[];
  total?: number;
  isLoading?: boolean;
}

const UsersTable = ({ data, columns, total, isLoading }: UsersTableProps) => {
  const tableData = useMemo(
    () => (total ? data.slice(0, total) : data),
    [data, total]
  );
  const table = useReactTable<User>({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="overflow-hidden">
      <DataTable<User> table={table} isLoading={isLoading} columns={columns} />
    </Card>
  );
};

export default UsersTable;
