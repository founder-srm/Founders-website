'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type OnChangeFn,
  type RowSelectionState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  rowSelection?: Record<string, boolean>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowSelectionChange,
  rowSelection = {},
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Create a wrapper function for onRowSelectionChange that conforms to OnChangeFn<RowSelectionState>
  const handleRowSelectionChange: OnChangeFn<
    RowSelectionState
  > = updaterOrValue => {
    if (!onRowSelectionChange) return;

    // Handle both function updaters and direct values
    const newState =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(rowSelection as RowSelectionState)
        : updaterOrValue;

    onRowSelectionChange(newState as Record<string, boolean>);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection: rowSelection as RowSelectionState,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: false,
    pageCount: Math.ceil(data.length / 10),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn('email')?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    row.toggleSelected(!row.getIsSelected());
                    console.log('Row clicked', row.id, !row.getIsSelected());
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'select' ? (
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={value => {
                            row.toggleSelected(!!value);
                          }}
                          onClick={e => {
                            // Prevent row click event from firing
                            e.stopPropagation();
                          }}
                          aria-label="Select row"
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
