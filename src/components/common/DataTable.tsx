import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  total?: number;
  isLoading?: boolean;
  maxRows?: number;
}

const DataTable = <T extends { id: string | number }>({
  data,
  columns,
  pagination,
  setPagination,
  total,
  isLoading = false,
  maxRows,
}: DataTableProps<T>) => {
  const table = useReactTable({
    data: maxRows ? data.slice(0, maxRows) : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  const pageCount = Math.ceil((total || data.length) / (pagination?.pageSize || 10));

  return (
    <Card className="p-6 space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {pagination ? (pagination.pageIndex * pagination.pageSize) + 1 : 1} to{' '}
          {pagination ? Math.min((pagination.pageIndex + 1) * pagination.pageSize, total || data.length) : data.length} of {total || data.length} entries
        </div>
        
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pagination?.pageSize || 10}`}
              onValueChange={(value) => {
                setPagination?.(prev => ({
                  ...prev,
                  pageSize: Number(value),
                  pageIndex: 0
                }));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination?.pageSize || 10} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pagination ? pagination.pageIndex + 1 : 1} of {pageCount}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination?.(prev => ({
                ...prev,
                pageIndex: 0
              }))}
              disabled={!pagination || pagination.pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination?.(prev => ({
                ...prev,
                pageIndex: Math.max(0, prev.pageIndex - 1)
              }))}
              disabled={!pagination || pagination.pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination?.(prev => ({
                ...prev,
                pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1)
              }))}
              disabled={!pagination || !pageCount || pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPagination?.(prev => ({
                ...prev,
                pageIndex: pageCount - 1
              }))}
              disabled={!pagination || !pageCount || pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataTable;
