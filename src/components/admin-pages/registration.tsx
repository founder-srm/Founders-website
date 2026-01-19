'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { formatInTimeZone } from 'date-fns-tz';
import {
  AlertTriangle,
  ArrowLeft,
  AtSign,
  Calendar,
  CheckCircle,
  Clock,
  FilePlus,
  Loader2,
  Mail,
  Ticket,
  Users,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useUpdateRegistrationApprovalMutation,
  useUpdateRegistrationAttendanceMutation,
} from '@/actions/admin/hooks/registrations';
import { getRegistrationById } from '@/actions/admin/registrations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { cn } from '@/lib/utils';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/client';
import type { Database } from '../../../database.types';
import Tiptap from '../data-table-admin/registrations/tiptap-email';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
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
  // const [isUpdating, setIsUpdating] = useState(false);

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

  // const handleUpdate = async () => {
  //   setIsUpdating(true);
  //   // Implement your update logic here
  //   await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
  //   setIsUpdating(false);
  // };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => Router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Registrations
      </Button>

      {/* Header Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${registration.registration_email}`}
                  alt="User Avatar"
                />
                <AvatarFallback className="text-lg">
                  {registration.registration_email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {registration.event_title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <AtSign className="h-4 w-4" />
                  {registration.registration_email}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {registration.is_team_entry && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-violet-500/20 text-violet-600"
                >
                  <Users className="h-3 w-3" />
                  Team Entry
                </Badge>
              )}
              <Dialog
                open={isEmailDialogOpen}
                onOpenChange={setIsEmailDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-2xl z-[1000]"
                  onPointerDownOutside={e => e.preventDefault()}
                  onFocusOutside={e => e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogTitle>Send Email</DialogTitle>
                    <DialogDescription>
                      Send an email to the registrant.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">To</Label>
                      <Input
                        id="email"
                        value={registration.registration_email}
                        disabled
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Template</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={insertTemplate}
                        className="gap-2"
                      >
                        <FilePlus className="h-4 w-4" /> Invalid Pitch Deck
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={emailSubject}
                        onChange={e => setEmailSubject(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="body">Message</Label>
                      <Tiptap
                        key={emailBody}
                        content={emailBody}
                        onUpdate={html => setEmailBody(html)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSendEmail} disabled={isSending}>
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
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status Banner */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={cn(
            'border-l-4',
            isApproved === 'ACCEPTED'
              ? 'border-l-emerald-500'
              : isApproved === 'SUBMITTED'
                ? 'border-l-amber-500'
                : 'border-l-rose-500'
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {isApproved === 'ACCEPTED' ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : isApproved === 'SUBMITTED' ? (
                <Clock className="h-4 w-4 text-amber-500" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-500" />
              )}
              Approval Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                isApproved === 'ACCEPTED'
                  ? 'default'
                  : isApproved === 'SUBMITTED'
                    ? 'secondary'
                    : 'destructive'
              }
              className={cn(
                isApproved === 'ACCEPTED'
                  ? 'bg-emerald-600'
                  : isApproved === 'SUBMITTED'
                    ? 'bg-amber-500/20 text-amber-600'
                    : ''
              )}
            >
              {isApproved === 'SUBMITTED' ? 'Pending' : isApproved}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Ticket Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-mono font-bold">
              #{registration.ticket_id?.toString().padStart(5, '0')}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Registered On
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-medium">
              {registration.created_at
                ? formatInTimeZone(
                    new Date(registration.created_at),
                    'Asia/Kolkata',
                    'dd MMM yyyy, hh:mm a'
                  )
                : 'N/A'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="user-entry" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="user-entry">Form Response</TabsTrigger>
                  <TabsTrigger value="details">Metadata</TabsTrigger>
                  {registration.is_team_entry && (
                    <TabsTrigger value="team">Team Members</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="user-entry" className="mt-4">
                  <Table>
                    <TableBody>
                      {Object.entries(registration.details || {}).map(
                        ([key, value]) => {
                          // Skip team_members as it has its own tab
                          if (key === 'team_members' || key === 'teamMembers')
                            return null;
                          return (
                            <TableRow key={key}>
                              <TableCell className="font-medium capitalize w-1/3">
                                {key
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/_/g, ' ')
                                  .toLowerCase()}
                              </TableCell>
                              <TableCell>{formatValue(value)}</TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="details" className="mt-4">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-1/3">
                          Registration ID
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {registration.id}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Application ID
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {registration.application_id}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Event ID</TableCell>
                        <TableCell className="font-mono text-sm">
                          {registration.event_id}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Entry Type
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              registration.is_team_entry
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {registration.is_team_entry
                              ? 'Team Entry'
                              : 'Individual'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Attendance
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              attendance === 'Present'
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-rose-500 text-rose-600'
                            )}
                          >
                            {attendance || 'Not marked'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                {registration.is_team_entry && (
                  <TabsContent value="team" className="mt-4">
                    {(() => {
                      const details = registration.details as Record<
                        string,
                        unknown
                      >;
                      const teamMembers =
                        details?.team_members || details?.teamMembers;
                      if (
                        Array.isArray(teamMembers) &&
                        teamMembers.length > 0
                      ) {
                        return (
                          <div className="space-y-3">
                            {teamMembers.map(
                              (
                                member: {
                                  name?: string;
                                  email?: string;
                                  id?: string;
                                },
                                idx: number
                              ) => (
                                <Card key={member.id || idx} className="p-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage
                                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name || member.email}`}
                                      />
                                      <AvatarFallback>
                                        {(member.name || member.email || 'U')
                                          .charAt(0)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {member.name || 'Team Member'}
                                      </p>
                                      {member.email && (
                                        <p className="text-sm text-muted-foreground">
                                          {member.email}
                                        </p>
                                      )}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="ml-auto"
                                    >
                                      Member {idx + 1}
                                    </Badge>
                                  </div>
                                </Card>
                              )
                            )}
                          </div>
                        );
                      }
                      return (
                        <p className="text-muted-foreground text-center py-4">
                          No team members found
                        </p>
                      );
                    })()}
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Update registration status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance</Label>
                <Select
                  onValueChange={handleAttendanceUpdate}
                  value={attendance}
                  disabled={isUpdatingAttendance}
                >
                  <SelectTrigger id="attendance">
                    <SelectValue>
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
                    <SelectItem value="Present">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Present
                      </span>
                    </SelectItem>
                    <SelectItem value="Absent">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-500" />
                        Absent
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="approval">Approval Status</Label>
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
                      ) : isApproved === 'SUBMITTED' ? (
                        'Pending'
                      ) : (
                        isApproved || 'Select status'
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBMITTED">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        Pending
                      </span>
                    </SelectItem>
                    <SelectItem value="ACCEPTED">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Accept
                      </span>
                    </SelectItem>
                    <SelectItem value="REJECTED">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-500" />
                        Reject
                      </span>
                    </SelectItem>
                    <SelectItem value="INVALID">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-gray-500" />
                        Invalid
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Event Title</p>
                <p className="font-medium">{registration.event_title}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">
                  Registrant Email
                </p>
                <p className="font-medium break-all">
                  {registration.registration_email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
