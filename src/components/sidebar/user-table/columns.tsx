'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

export type UserData = {
  id: string;
  email: string;
};

// Make sure ID is explicitly a string
const idAccessor = (row: UserData): string => row.id;

export const columns: ColumnDef<UserData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={e => e.stopPropagation()}
      />
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'id',
    accessorFn: idAccessor, // Explicit accessor to ensure it's a string
    header: 'User ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <div className="font-mono text-xs truncate max-w-[200px]">{id}</div>
      );
    },
  },
];
