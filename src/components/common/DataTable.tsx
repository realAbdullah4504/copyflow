import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ColumnDef, type Table as TableType } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/utils";

interface DataTableProps<TData> {
  table: TableType<TData>;
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
}

const DataTable = <TData,>({
  table,
  columns,
  isLoading = false,
}: DataTableProps<TData>) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  className={cn({
                    'cursor-pointer select-none': header.column.getCanSort(),
                  })}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <span className="ml-2">
                        {(() => {
                          const isSorted = header.column.getIsSorted();
                          if (isSorted === 'desc' || isSorted === 'asc') {
                            return <ArrowUpDown className="h-4 w-4" />;
                          }
                          return <ArrowUpDown className="h-4 w-4 opacity-30" />;
                        })()}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-slate-500"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-slate-500"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
