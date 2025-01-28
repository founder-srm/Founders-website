"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUp, ArrowDown, ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { Registration } from "@/types/registrations"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const RegistrationColumns: ColumnDef<Registration>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "event_title",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Event Title
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
  },
  {
    accessorKey: "registration_email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Registration Date
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.getValue("created_at") ? new Date(row.getValue("created_at") as string).toLocaleDateString() : "N/A"
    },
  },
  {
    accessorKey: "attendance",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Attendance
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const attendance = row.getValue("attendance") as string
      return attendance ? <Badge variant="secondary" className={cn(attendance === 'Present' ? 'bg-emerald-900' : 'bg-rose-900')}>{attendance}</Badge> : "N/A"
    },
  },
  {
    accessorKey: "is_approved",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Approval Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const isApproved = row.getValue("is_approved") as boolean
      return <Badge variant={isApproved ? "default" : "destructive"}>{isApproved ? "Approved" : "Not Approved"}</Badge>
    },
  },
  {
    accessorKey: "ticket_id",
    header: "Ticket",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const registration = row.original

      return (
        <div className="flex items-center">
          <Link href={`/admin/registrations/${registration.id}`} passHref>
            <Button variant="ghost" className="h-8 w-8 p-0" title="View registration details">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(registration.id || "")}>
                Copy registration ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit registration</DropdownMenuItem>
              <DropdownMenuItem>Cancel registration</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

