import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export interface Column<T> {
  key: keyof T;
  label: string;
  format?: (value: any, row?: T) => React.ReactNode; // optional formatter
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  maxRows?: number;
  title?: string;
}

const DataTable = <T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  maxRows,
  title,
}: DataTableProps<T>) => {
  const displayedData = maxRows ? data.slice(0, maxRows) : data;

  return (
    <Card className="p-6">
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>{col.label}</TableHead>
              ))}
            </TableRow>
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
            ) : displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-slate-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              displayedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.format
                        ? col.format(row[col.key], row)
                        : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default DataTable;