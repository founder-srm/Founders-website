"use client"

import { getRegistrationById } from "@/actions/admin/registrations"
import type { Registration } from "@/types/registrations"
import type { Database } from "../../../database.types"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatInTimeZone } from "date-fns-tz"

const isValidDate = (value: string) => {
  const date = new Date(value);
  // biome-ignore lint/suspicious/noGlobalIsNan: otherwise the check will fail and return normal strings instead of datestrings
  return date instanceof Date && !isNaN(date.getTime());
};

const formatValue = (value: string[] | string | boolean | number): React.ReactNode => {
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
  if (typeof value === "string" && isValidDate(value)) {
    return formatInTimeZone(new Date(value),'Asia/Kolkata','dd MMMM yyyy');
  }

  // Boolean
  if (typeof value === "boolean") {
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {value ? "Yes" : "No"}
      </span>
    );
  }

  // Number
  if (typeof value === "number") {
    return <span className="font-mono">{value}</span>;
  }

  // Link
  if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {value}
      </a>
    );
  }

  // Paragraph (multi-line text)
  if (typeof value === "string" && value.includes("\n")) {
    return (
      <div className="whitespace-pre-wrap">
        {value}
      </div>
    );
  }

  // Default string
  return value;
};

export default function RegistrationDetails({ slug }: { slug: string }) {
  const supabase = createClient()
  const { data: registration, error, isLoading } = useQuery<Registration>(getRegistrationById(supabase, slug))
  const Router = useRouter()

  const [attendance, setAttendance] = useState(registration?.attendance)
  const [isApproved, setIsApproved] = useState(registration?.is_approved)
  const [isUpdating, setIsUpdating] = useState(false)

  if (isLoading) {
    return <RegistrationSkeleton />
  }

  if (error) {
    return <ErrorAlert error={error} />
  }

  if (!registration) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Registration not found.</AlertDescription>
      </Alert>
    )
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    // Implement your update logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API call
    setIsUpdating(false)
  }

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Registration Details</CardTitle>
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${registration.registration_email}`}
            alt="User Avatar"
          />
          <AvatarFallback>{registration.registration_email.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant={isApproved === "ACCEPTED" ? "default" : "destructive"}>
          {isApproved === "ACCEPTED" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>{isApproved === "ACCEPTED" ? "Approved" : "Not Approved"}</AlertTitle>
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
                  {/* biome-ignore lint/style/noNonNullAssertion: prefetch will handle this */}
                  <TableCell>{new Date(registration.created_at!).toLocaleString()}</TableCell>
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
                <TableRow>
                  {/* <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{(registration.details as any).name}</TableCell> */}
                </TableRow>
                {/* Add more applicant details here */}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="user-entry">
            <Table>
              <TableBody>
                {Object.entries(registration.details || {}).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium capitalize w-1/3">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </TableCell>
                    <TableCell>{formatValue(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Update Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="attendance" className="block text-sm font-medium text-gray-700">
                Attendance
              </label>
              <Select onValueChange={(value: Database['public']['Enums']['attendance']) => setAttendance(value)} value={attendance}>
                <SelectTrigger id="attendance">
                  <SelectValue defaultValue={attendance}>
                    {attendance || "Select attendance"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PRESENT">Present</SelectItem>
                    <SelectItem value="ABSENT">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="approval" className="block text-sm font-medium text-gray-700">
                Approval Status
              </label>
              <Select onValueChange={(value: Database['public']['Enums']['registration-status']) => setIsApproved(value)} value={isApproved}>
                <SelectTrigger id="approval">
                  <SelectValue placeholder="Select approval status" />
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
          {isUpdating ? "Updating..." : "Update Registration"}
        </Button>
      </CardFooter>
    </Card>
  )
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
  )
}

function ErrorAlert({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}

