'use client';

import type { ColumnDef, Row } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  FilePlus,
  Loader2,
  Mail,
  MoreHorizontal,
  TicketCheck,
  TicketSlash,
  TicketX,
  UserCheck,
  UserRoundCog,
  UserX,
  Users,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  updateRegistrationApproval,
  updateRegistrationAttendance,
} from '@/actions/admin/hooks/registrations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Registration } from '@/types/registrations';
import type { Database } from '../../../../database.types';
import Tiptap from './tiptap-email';

// Helper function for sortable header
const SortableHeader = ({
  column,
  title,
}: {
  column: { toggleSorting: (asc: boolean) => void; getIsSorted: () => string | false };
  title: string;
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    className="h-8 px-2 lg:px-3"
  >
    {title}
    {column.getIsSorted() === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === 'desc' ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
    )}
  </Button>
);

export const RegistrationColumns: ColumnDef<Registration>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'ticket_id',
    header: ({ column }) => <SortableHeader column={column} title="Ticket #" />,
    cell: ({ row }) => {
      const ticketId = row.getValue('ticket_id') as number;
      return (
        <div className="font-mono text-sm font-medium">
          #{ticketId?.toString().padStart(5, '0') || 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'event_title',
    header: ({ column }) => <SortableHeader column={column} title="Event" />,
    cell: ({ row }) => {
      const title = row.getValue('event_title') as string;
      return (
        <div className="max-w-[200px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium truncate block">{title}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: 'registration_email',
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const email = row.getValue('registration_email') as string;
      return (
        <div className="max-w-[200px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm truncate block text-muted-foreground">{email}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{email}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: 'is_team_entry',
    header: ({ column }) => <SortableHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const isTeam = row.getValue('is_team_entry') as boolean;
      return (
        <Badge
          variant={isTeam ? 'default' : 'secondary'}
          className={cn(
            'gap-1',
            isTeam ? 'bg-violet-600 hover:bg-violet-700' : ''
          )}
        >
          {isTeam ? (
            <>
              <Users className="h-3 w-3" />
              Team
            </>
          ) : (
            <>
              <User className="h-3 w-3" />
              Solo
            </>
          )}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <SortableHeader column={column} title="Registered" />,
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      
      const d = new Date(date);
      const formattedDate = d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const formattedTime = d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      
      return (
        <div className="text-sm">
          <div className="font-medium">{formattedDate}</div>
          <div className="text-muted-foreground text-xs">{formattedTime}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'attendance',
    header: ({ column }) => <SortableHeader column={column} title="Attendance" />,
    cell: ({ row }) => {
      const attendance = row.getValue('attendance') as string;
      return attendance ? (
        <Badge
          variant="outline"
          className={cn(
            'font-medium',
            attendance === 'Present' 
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' 
              : 'border-rose-500 bg-rose-500/10 text-rose-600'
          )}
        >
          {attendance}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'is_approved',
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue(
        'is_approved'
      ) as Database['public']['Enums']['registration-status'];
      
      const statusConfig = {
        ACCEPTED: { variant: 'default' as const, className: 'bg-emerald-600 hover:bg-emerald-700' },
        SUBMITTED: { variant: 'secondary' as const, className: 'bg-amber-500/20 text-amber-600 border-amber-500' },
        REJECTED: { variant: 'destructive' as const, className: '' },
        INVALID: { variant: 'outline' as const, className: 'border-gray-500 text-gray-500' },
      };
      
      const config = statusConfig[status] || statusConfig.SUBMITTED;
      
      return (
        <Badge variant={config.variant} className={config.className}>
          {status === 'SUBMITTED' ? 'Pending' : status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionColumnCell {...row} />,
  },
];

const ActionColumnCell = (row: Row<Registration>) => {
  const registration = row.original;
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingAttendance, setIsUpdatingAttendance] = useState(false);
  const [isUpdatingApproval, setIsUpdatingApproval] = useState(false);
  const { toast } = useToast();

  const handleAttendanceUpdate = async (
    attendance: Database['public']['Enums']['attendance']
  ) => {
    if (!registration.id || isUpdatingAttendance) return;

    setIsUpdatingAttendance(true);
    try {
      const { error } = await updateRegistrationAttendance(
        registration.id,
        attendance
      );
      if (error) {
        throw new Error(error.message);
      }
      toast({
        title: 'Attendance Updated',
        description: `Registration ${registration.registration_email} marked as ${attendance}`,
      });
      setIsUpdatingAttendance(false);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setIsUpdatingAttendance(false);
      alert('Failed to update attendance. Please try again.');
    }
  };

  const handleApprovalUpdate = async (
    approval: Database['public']['Enums']['registration-status']
  ) => {
    if (!registration.id || isUpdatingAttendance) return;

    setIsUpdatingApproval(true);
    try {
      const { error } = await updateRegistrationApproval(
        registration.id,
        approval
      );
      if (error) {
        throw new Error(error.message);
      }
      if (approval === 'ACCEPTED') {
        const response = await fetch('/api/send-approved-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: registration.registration_email,
            event: registration.event_title,
            ticketid: registration.ticket_id,
          }),
        });
        if (response.ok) {
          console.log('Email sent successfully!');
          toast({
            title: 'Approval Email Sent',
          });
        } else {
          throw new Error('Failed to send email');
        }
      }
      toast({
        title: 'Approval Updated',
        description: `Registration ${registration.registration_email} marked as ${approval}`,
      });
      setIsUpdatingApproval(false);
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
      setIsUpdatingApproval(false);
    }
  };

  const [templateResponse] = useState(`
    <p>Dear Applicant,</p>
    <p>We appreciate the immense efforts you have invested in making your profound and intricate pitch deck.</p>
    <p>However, WE REGRET TO INFORM YOU that your pitch deck is unsatisfactory and ineligible for selection of physical presence. We appreciate your enthusiasm and hope to see you again in our future engagements.</p>
    <p>Wishing you all the luck the world has for you and your future endeavors,</p>
    <p>Warm regards,<br/>Admin [Your Name]</p>
  `);

  const insertTemplate = () => {
    const filledTemplate = templateResponse
      .replace('{email}', registration.registration_email)
      .replace('{event_title}', registration.event_title);
    setEmailBody(filledTemplate);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: registration.registration_email,
          subject: emailSubject,
          body: emailBody,
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setIsEmailDialogOpen(false);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center">
      <Link href={`/admin/registrations/view/${registration.id}`} passHref>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          title="View registration details"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Dialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        modal={false} // Disable modal behavior
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            title="Send Email"
            size="icon"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-2xl"
          onPointerDownOutside={e => {
            // Prevent closing when clicking in editor
            e.preventDefault();
          }}
          onFocusOutside={e => {
            // Prevent focus trap from interfering with editor
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to the registrant.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="email" className="text-left w-full">
                To
              </Label>
              <Input
                id="email"
                value={registration.registration_email}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <span>Templates</span>
              <div className="col-start-2 col-span-3">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={insertTemplate}
                  className="w-full flex gap-2 items-center"
                >
                  <FilePlus /> Invalid Pitch Deck
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="subject" className="text-left w-full">
                Subject
              </Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor="body" className="text-left w-full">
                Message
              </Label>
              <Tiptap
                key={emailBody} // Force re-render when template is inserted
                content={emailBody}
                onUpdate={html => setEmailBody(html)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                'Send Email'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(registration.id || '')}
          >
            Copy registration ID
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserRoundCog className="mr-2 h-4 w-4" />
              <span>Mark Attendance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => handleAttendanceUpdate('Present')}
                  disabled={isUpdatingAttendance}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>
                    {isUpdatingAttendance ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Mark Present'
                    )}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleAttendanceUpdate('Absent')}
                  disabled={isUpdatingAttendance}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  <span>
                    {isUpdatingAttendance ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Mark Absent'
                    )}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TicketCheck className="mr-2 h-4 w-4" />
              <span>Approve</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => handleApprovalUpdate('ACCEPTED')}
                  disabled={isUpdatingApproval}
                >
                  <TicketCheck className="mr-2 h-4 w-4" />
                  <span>
                    {isUpdatingApproval ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Accept Entry'
                    )}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleApprovalUpdate('REJECTED')}
                  disabled={isUpdatingApproval}
                >
                  <TicketX className="mr-2 h-4 w-4" />
                  <span>
                    {isUpdatingApproval ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Deny Entry'
                    )}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleApprovalUpdate('INVALID')}
                  disabled={isUpdatingApproval}
                >
                  <TicketSlash className="mr-2 h-4 w-4" />
                  <span>
                    {isUpdatingApproval ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Invalid Entry'
                    )}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
