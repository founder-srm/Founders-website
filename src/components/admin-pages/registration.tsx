'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { formatInTimeZone } from 'date-fns-tz';
import {
  AlertTriangle,
  CheckCircle,
  FilePlus,
  Loader2,
  Mail,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useUpdateRegistrationApprovalMutation,
  useUpdateRegistrationAttendanceMutation,
} from '@/actions/admin/hooks/registrations';
import { getRegistrationById } from '@/actions/admin/registrations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '../../../database.types';
import Tiptap from '../data-table-admin/registrations/tiptap-email';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const isValidDate = (value: string) => {
  const date = new Date(value);
  // biome-ignore lint/suspicious/noGlobalIsNan: otherwise the check will fail and return normal strings instead of datestrings
  return date instanceof Date && !isNaN(date.getTime());
};

const formatValue = (
  value: string[] | string | boolean | number
): React.ReactNode => {
  // Arrays
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => (
          <span key={index} className="px-2 py-1 bg-muted rounded-md text-sm">
            {item}
          </span>
        ))}
      </div>
    );
  }

  // Date
  if (typeof value === 'string' && isValidDate(value)) {
    return formatInTimeZone(new Date(value), 'Asia/Kolkata', 'dd MMMM yyyy');
  }

  // Boolean
  if (typeof value === 'boolean') {
    return (
      <span
        className={`px-2 py-1 rounded-full text-sm ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
      >
        {value ? 'Yes' : 'No'}
      </span>
    );
  }

  // Number
  if (typeof value === 'number') {
    return <span className="font-mono">{value}</span>;
  }

  // Link
  if (
    typeof value === 'string' &&
    (value.startsWith('http://') || value.startsWith('https://'))
  ) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {value}
      </a>
    );
  }

  // Paragraph (multi-line text)
  if (typeof value === 'string' && value.includes('\n')) {
    return <div className="whitespace-pre-wrap">{value}</div>;
  }

  // Default string
  return value;
};

export default function RegistrationDetails({ slug }: { slug: string }) {
  const supabase = createClient();
  const {
    data: registration,
    error,
    isLoading,
    refetch,
  } = useQuery<Registration>(getRegistrationById(supabase, slug));
  const Router = useRouter();
  const { toast } = useToast();

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingAttendance, setIsUpdatingAttendance] = useState(false);
  const [isUpdatingApproval, setIsUpdatingApproval] = useState(false);
  const [attendance, setAttendance] = useState(registration?.attendance);
  const [isApproved, setIsApproved] = useState(registration?.is_approved);
  const [isUpdating, setIsUpdating] = useState(false);

  const UpdateRegistrationAttendanceMutation =
    useUpdateRegistrationAttendanceMutation();
  const UpdateRegistrationApprovalMutation =
    useUpdateRegistrationApprovalMutation();

  const [templateResponse] = useState(`
    <p>Dear Applicant,</p>
    <p>We appreciate the immense efforts you have invested in making your profound and intricate pitch deck.</p>
    <p>However, WE REGRET TO INFORM YOU that your pitch deck is unsatisfactory and ineligible for selection of physical presence. We appreciate your enthusiasm and hope to see you again in our future engagements.</p>
    <p>Wishing you all the luck the world has for you and your future endeavors,</p>
    <p>Warm regards,<br/>Admin [Your Name]</p>
  `);

  if (isLoading) {
    return <RegistrationSkeleton />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (!registration) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Registration not found.</AlertDescription>
      </Alert>
    );
  }

  function RegistrationSkeleton() {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-[150px]" />
        </CardFooter>
      </Card>
    );
  }

  function ErrorAlert({ error }: { error: Error }) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const handleAttendanceUpdate = async (
    attendance: Database['public']['Enums']['attendance']
  ) => {
    if (!registration.id || isUpdatingAttendance) return;

    setIsUpdatingAttendance(true);
    try {
      await UpdateRegistrationAttendanceMutation.mutateAsync({
        Attendance: attendance,
        RegistrationId: registration.id,
      });
      setAttendance(attendance); // Update local state
      toast({
        title: 'Attendance Updated',
        description: `Registration ${registration.registration_email} marked as ${attendance}`,
      });
      await refetch();
      setIsUpdatingAttendance(false);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setIsUpdatingAttendance(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update attendance. Please try again.',
      });
    }
  };

  const handleApprovalUpdate = async (
    approval: Database['public']['Enums']['registration-status']
  ) => {
    if (!registration.id || isUpdatingApproval) return; // Fixed checking wrong state

    setIsUpdatingApproval(true);
    try {
      await UpdateRegistrationApprovalMutation.mutateAsync({
        Approval: approval,
        RegistrationId: registration.id,
      });
      setIsApproved(approval); // Update local state
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
      await refetch();
      setIsUpdatingApproval(false);
    } catch (error) {
      console.error('Error updating approval:', error);
      setIsUpdatingApproval(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update approval status. Please try again.',
      });
    }
  };

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

  const handleUpdate = async () => {
    setIsUpdating(true);
    // Implement your update logic here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
    setIsUpdating(false);
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4 ">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${registration.registration_email}`}
              alt="User Avatar"
            />
            <AvatarFallback>
              {registration.registration_email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">
            Registration Details
          </CardTitle>
        </div>
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
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
            className="sm:max-w-2xl z-[1000]"
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
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant={isApproved === 'ACCEPTED' ? 'default' : 'destructive'}>
          {isApproved === 'ACCEPTED' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {isApproved === 'ACCEPTED' ? 'Approved' : 'Not Approved'}
          </AlertTitle>
          <AlertDescription>
            This registration is currently {isApproved}.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="event">Event Info</TabsTrigger>
            <TabsTrigger value="applicant">Applicant Info</TabsTrigger>
            <TabsTrigger value="user-entry">User Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Registration ID</TableCell>
                  <TableCell>{registration.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Application ID</TableCell>
                  <TableCell>{registration.application_id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell>
                    {/* biome-ignore lint/style/noNonNullAssertion: prefetch will handle this */}
                    {new Date(registration.created_at!).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ticket ID</TableCell>
                  <TableCell>{registration.ticket_id}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="event">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Event Title</TableCell>
                  <TableCell>{registration.event_title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Event ID</TableCell>
                  <TableCell>{registration.event_id}</TableCell>
                </TableRow>
                {/* Add more event details here */}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="applicant">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{registration.registration_email}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="user-entry">
            <Table>
              <TableBody>
                {Object.entries(registration.details || {}).map(
                  ([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium capitalize w-1/3">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </TableCell>
                      <TableCell>{formatValue(value)}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Update Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="attendance"
                className="block text-sm font-medium text-gray-700"
              >
                Attendance
              </label>
              <Select
                onValueChange={handleAttendanceUpdate}
                value={attendance}
                disabled={isUpdatingAttendance}
              >
                <SelectTrigger id="attendance">
                  <SelectValue defaultValue={attendance}>
                    {isUpdatingAttendance ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      attendance || 'Select attendance'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="approval"
                className="block text-sm font-medium text-gray-700"
              >
                Approval Status
              </label>
              <Select
                onValueChange={handleApprovalUpdate}
                value={isApproved}
                disabled={isUpdatingApproval}
              >
                <SelectTrigger id="approval">
                  <SelectValue>
                    {isUpdatingApproval ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      isApproved || 'Select approval status'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="INVALID">Invalid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => Router.back()}>
          Back to List
        </Button>
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Registration'}
        </Button>
      </CardFooter>
    </Card>
  );
}
