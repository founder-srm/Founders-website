'use client';

import type { Table } from '@tanstack/react-table';
import { RefreshCw, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onRefresh?: () => void;
  activeTab?: 'all' | 'pending' | 'accepted' | 'team';
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  onRefresh,
  activeTab = 'all',
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || globalFilter.length > 0;

  const approvalColumn = table.getColumn('is_approved');
  const attendanceColumn = table.getColumn('attendance');
  const teamEntryColumn = table.getColumn('is_team_entry');

  // Hide status filter when on pending/accepted tabs (already filtered by page)
  const showStatusFilter = activeTab === 'all' || activeTab === 'team';
  // Hide team filter when on team tab (already filtered by page)
  const showTeamFilter = activeTab !== 'team';

  return (
    <div className="flex flex-col gap-4">
      {/* Search and main actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, event, or ticket..."
            value={globalFilter}
            onChange={event => setGlobalFilter(event.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Approval Status Filter - only show when on 'all' or 'team' tabs */}
          {showStatusFilter && approvalColumn && (
            <Select
              value={(approvalColumn.getFilterValue() as string) ?? 'all'}
              onValueChange={value =>
                approvalColumn.setFilterValue(
                  value === 'all' ? undefined : value
                )
              }
            >
              <SelectTrigger className="h-10 w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="SUBMITTED">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="INVALID">Invalid</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Attendance Filter */}
          {attendanceColumn && (
            <Select
              value={(attendanceColumn.getFilterValue() as string) ?? 'all'}
              onValueChange={value =>
                attendanceColumn.setFilterValue(
                  value === 'all' ? undefined : value
                )
              }
            >
              <SelectTrigger className="h-10 w-[140px]">
                <SelectValue placeholder="Attendance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attendance</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Team Entry Filter - only show when not on 'team' tab */}
          {showTeamFilter && teamEntryColumn && (
            <Select
              value={
                teamEntryColumn.getFilterValue() === undefined
                  ? 'all'
                  : teamEntryColumn.getFilterValue() === true
                    ? 'team'
                    : 'individual'
              }
              onValueChange={value =>
                teamEntryColumn.setFilterValue(
                  value === 'all' ? undefined : value === 'team'
                )
              }
            >
              <SelectTrigger className="h-10 w-[140px]">
                <SelectValue placeholder="Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="team">Team Entry</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Reset Filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                setGlobalFilter('');
              }}
              className="h-10 px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {isFiltered && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {globalFilter && (
            <Badge variant="secondary" className="gap-1">
              Search: &ldquo;{globalFilter}&rdquo;
              <button
                type="button"
                onClick={() => setGlobalFilter('')}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {((): React.ReactNode => {
            const val = approvalColumn?.getFilterValue();
            if (!val) return null;
            return (
              <Badge variant="secondary" className="gap-1">
                Status: {String(val)}
                <button
                  type="button"
                  onClick={() => approvalColumn?.setFilterValue(undefined)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })()}
          {((): React.ReactNode => {
            const val = attendanceColumn?.getFilterValue();
            if (!val) return null;
            return (
              <Badge variant="secondary" className="gap-1">
                Attendance: {String(val)}
                <button
                  type="button"
                  onClick={() => attendanceColumn?.setFilterValue(undefined)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })()}
          {((): React.ReactNode => {
            const val = teamEntryColumn?.getFilterValue();
            if (val === undefined) return null;
            return (
              <Badge variant="secondary" className="gap-1">
                Type: {val ? 'Team' : 'Individual'}
                <button
                  type="button"
                  onClick={() => teamEntryColumn?.setFilterValue(undefined)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })()}
        </div>
      )}
    </div>
  );
}
