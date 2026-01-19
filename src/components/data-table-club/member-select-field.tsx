"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2, Search, Users, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchClubMembers, type ClubMember } from "@/actions/club/action";

export interface SelectedMember {
  user_id: string;
  email: string;
  full_name?: string;
}

interface MemberSelectFieldProps {
  clubId: string;
  value: SelectedMember[];
  onChange: (members: SelectedMember[]) => void;
  minMembers?: number;
  maxMembers?: number;
}

const getInitials = (name?: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function MemberSelectField({
  clubId,
  value = [],
  onChange,
  minMembers = 1,
  maxMembers,
}: MemberSelectFieldProps) {
  const [members, setMembers] = React.useState<ClubMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  // Use ref to track if we're currently updating to prevent loops
  const isUpdatingRef = React.useRef(false);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Fetch members on mount
  React.useEffect(() => {
    async function loadMembers() {
      if (!clubId) return;
      
      setIsLoading(true);
      const { data, error } = await fetchClubMembers(clubId);
      
      if (error || !data) {
        console.error("Error fetching members:", error);
        setIsLoading(false);
        return;
      }
      
      // Only show verified members
      const verifiedMembers = data.filter(m => m.is_verified);
      setMembers(verifiedMembers);
      
      // Initialize selection from value prop
      const initialSelection: Record<string, boolean> = {};
      value.forEach(v => {
        const memberIndex = verifiedMembers.findIndex(m => m.user_id === v.user_id);
        if (memberIndex !== -1) {
          initialSelection[memberIndex.toString()] = true;
        }
      });
      setRowSelection(initialSelection);
      
      setIsLoading(false);
    }
    
    loadMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  // Handle row selection change - call parent onChange directly
  const handleRowSelectionChange = React.useCallback((updater: React.SetStateAction<Record<string, boolean>>) => {
    setRowSelection(prev => {
      const newSelection = typeof updater === 'function' ? updater(prev) : updater;
      
      // Notify parent of selection change
      if (members.length > 0 && !isUpdatingRef.current) {
        isUpdatingRef.current = true;
        
        const selectedMembers: SelectedMember[] = [];
        for (const key of Object.keys(newSelection)) {
          if (!newSelection[key]) continue;
          const member = members[parseInt(key)];
          if (!member) continue;
          selectedMembers.push({
            user_id: member.user_id,
            email: member.email,
            full_name: member.user_metadata?.full_name,
          });
        }
        
        // Use setTimeout to break the sync update cycle
        setTimeout(() => {
          onChangeRef.current(selectedMembers);
          isUpdatingRef.current = false;
        }, 0);
      }
      
      return newSelection;
    });
  }, [members]);

  const columns: ColumnDef<ClubMember>[] = React.useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(checked) => {
            if (maxMembers && table.getFilteredRowModel().rows.length > maxMembers) {
              // Don't allow select all if it exceeds max
              return;
            }
            table.toggleAllPageRowsSelected(!!checked);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row, table }) => {
        const currentSelected = Object.values(table.getState().rowSelection).filter(Boolean).length;
        const isSelected = row.getIsSelected();
        const wouldExceedMax = !!(maxMembers && !isSelected && currentSelected >= maxMembers);
        
        return (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (wouldExceedMax) return;
              row.toggleSelected(!!checked);
            }}
            disabled={wouldExceedMax}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user_metadata.full_name",
      id: "name",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        const fullName = member.user_metadata?.full_name || "Unknown User";
        const avatarUrl = member.user_metadata?.avatar_url;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-xs font-medium">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{fullName}</span>
              <span className="text-xs text-muted-foreground md:hidden">
                {member.email}
              </span>
            </div>
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        const member = row.original;
        const fullName = member.user_metadata?.full_name?.toLowerCase() || "";
        const email = member.email.toLowerCase();
        const search = filterValue.toLowerCase();
        return fullName.includes(search) || email.includes(search);
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm hidden md:block">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "user_role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.user_role;
        return (
          <Badge
            variant="outline"
            className={
              role === "club_rep"
                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
            }
          >
            {role === "club_rep" ? "Rep" : "Member"}
          </Badge>
        );
      },
    },
  ], [maxMembers]);

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Loading club members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Users className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-1">No Verified Members</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no verified club members available for selection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with selection count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-primary" />
          <span className="font-medium">
            {selectedCount} member{selectedCount !== 1 ? "s" : ""} selected
          </span>
          {minMembers > 0 && (
            <span className="text-sm text-muted-foreground">
              (min: {minMembers}{maxMembers ? `, max: ${maxMembers}` : ""})
            </span>
          )}
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-8 w-full sm:w-[250px]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    const currentSelected = Object.values(table.getState().rowSelection).filter(Boolean).length;
                    const isSelected = row.getIsSelected();
                    if (maxMembers && !isSelected && currentSelected >= maxMembers) {
                      return;
                    }
                    row.toggleSelected(!isSelected);
                  }}
                >
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
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
      )}

      {/* Validation message */}
      {selectedCount < minMembers && (
        <p className="text-sm text-destructive">
          Please select at least {minMembers} member{minMembers !== 1 ? "s" : ""} to continue.
        </p>
      )}
    </div>
  );
}
