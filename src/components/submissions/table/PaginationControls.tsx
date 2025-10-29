import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";

interface PaginationControlsProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

const PaginationControls = <TData,>({
  table,
  pageSizeOptions = [5, 10, 20, 50, 100],
}: PaginationControlsProps<TData>) => {
  const totalEntries = table.getFilteredRowModel().rows.length;
  const pageNumber = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const startEntry = (pageNumber - 1) * pageSize + 1;
  const endEntry = Math.min(pageNumber * pageSize, totalEntries);

  const showingPageOfPages = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;
  const pageOfPages = `Page ${pageNumber} of ${table.getPageCount()}`;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 mt-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">Show</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">entries</p>
      </div>

      <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
        {showingPageOfPages}
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-[100px] text-right text-sm font-medium">
          {pageOfPages}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { PaginationControls };
