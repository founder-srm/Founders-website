'use client';

import type { ColumnDef, Row } from '@tanstack/react-table';
import {
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eye,
  Mail,
  Loader2,
  FilePlus,
  UserRoundCog,
  UserCheck,
  UserX,
  TicketCheck,
  TicketSlash,
  TicketX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import type { Registration } from '@/types/registrations';
import type { Database } from '../../../../database.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Tiptap from './tiptap-email';
import {
  updateRegistrationApproval,
  updateRegistrationAttendance,
} from '@/actions/admin/hooks/registrations';
import { useToast } from '@/hooks/use-toast';

export const RegistrationColumns: ColumnDef<Registration>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'event_title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Event Title
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: 'registration_email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Registration Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.getValue('created_at')
        ? new Date(row.getValue('created_at') as string).toLocaleDateString()
        : 'N/A';
    },
  },
  {
    accessorKey: 'attendance',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Attendance
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const attendance = row.getValue('attendance') as string;
      return attendance ? (
        <Badge
          variant="secondary"
          className={cn(
            attendance === 'Present' ? 'bg-emerald-900' : 'bg-rose-900'
          )}
        >
          {attendance}
        </Badge>
      ) : (
        'N/A'
      );
    },
  },
  {
    accessorKey: 'is_approved',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Approval Status
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const isApproved = row.getValue(
        'is_approved'
      ) as Database['public']['Enums']['registration-status'];
      return (
        <Badge
          variant={
            isApproved === 'ACCEPTED'
              ? 'default'
              : isApproved === 'INVALID'
                ? 'destructive'
                : 'outline'
          }
        >
          {isApproved}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'ticket_id',
    header: 'Ticket',
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
