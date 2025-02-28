'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import type { Json } from "../../../database.types";

type RegistrationData = {
  id: string;
  created_at: string;
  ticket_id: number;
  event_id: string;
  event_title: string;
  application_id: string;
  details: Json;
  attendance: "Present" | "Absent";
  registration_email: string;
  is_approved: "SUBMITTED" | "APPROVED" | "REJECTED" | "INVALID";
};

interface RegistrationTableProps {
  data: RegistrationData[];
}

export function RegistrationTable({ data }: RegistrationTableProps) {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/admin/registrations/view/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registered</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((registration) => (
          <TableRow 
            key={registration.id}
            onClick={() => handleRowClick(registration.id)}
            className="cursor-pointer hover:bg-muted"
          >
            <TableCell className="font-medium">
              {registration.event_title}
            </TableCell>
            <TableCell>{registration.registration_email}</TableCell>
            <TableCell>
              {registration.is_approved === "APPROVED" ? (
                <Badge className="bg-green-500 hover:bg-green-600 inline-flex items-center gap-1">
                  <Check size={12} />
                  <span>Approved</span>
                </Badge>
              ) : registration.is_approved === "REJECTED" ? (
                <Badge variant="destructive" className="inline-flex items-center gap-1">
                  <X size={12} />
                  <span>Rejected</span>
                </Badge>
              ) : registration.is_approved === "INVALID" ? (
                <Badge variant="outline" className="text-red-500 border-red-500 inline-flex items-center gap-1">
                  <X size={12} />
                  <span>Invalid</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-500 border-amber-500 inline-flex items-center gap-1">
                  <X size={12} />
                  <span>Pending</span>
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {registration.created_at 
                ? formatDistanceToNow(new Date(registration.created_at), { addSuffix: true }) 
                : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
