"use client";
import AddMemberButton from "@/components/AddMemberButton";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"

const members = [
  {
    sNo: 1,
    name: "Alex Johnson",
    raNumber: "RA2021001",
    phoneNumber: "+91-9876543210",
    department: "Computer Science",
    faName: "Dr. Rajesh Kumar",
    faPhoneNumber: "+91-9876543001",
    faEmail: "rajesh.kumar@university.edu",
  },
  {
    sNo: 2,
    name: "Priya Sharma",
    raNumber: "RA2021002",
    phoneNumber: "+91-9876543211",
    department: "Electronics & Communication",
    faName: "Dr. Meera Nair",
    faPhoneNumber: "+91-9876543002",
    faEmail: "meera.nair@university.edu",
  },
  {
    sNo: 3,
    name: "Rahul Verma",
    raNumber: "RA2021003",
    phoneNumber: "+91-9876543212",
    department: "Mechanical Engineering",
    faName: "Dr. Suresh Reddy",
    faPhoneNumber: "+91-9876543003",
    faEmail: "suresh.reddy@university.edu",
  },
  {
    sNo: 4,
    name: "Sneha Patel",
    raNumber: "RA2021004",
    phoneNumber: "+91-9876543213",
    department: "Civil Engineering",
    faName: "Dr. Anita Singh",
    faPhoneNumber: "+91-9876543004",
    faEmail: "anita.singh@university.edu",
  },
  {
    sNo: 5,
    name: "Arjun Iyer",
    raNumber: "RA2021005",
    phoneNumber: "+91-9876543214",
    department: "Information Technology",
    faName: "Dr. Rajesh Kumar",
    faPhoneNumber: "+91-9876543001",
    faEmail: "rajesh.kumar@university.edu",
  },
  {
    sNo: 6,
    name: "Divya Menon",
    raNumber: "RA2021006",
    phoneNumber: "+91-9876543215",
    department: "Computer Science",
    faName: "Dr. Vikram Das",
    faPhoneNumber: "+91-9876543005",
    faEmail: "vikram.das@university.edu",
  },
  {
    sNo: 7,
    name: "Karthik Rao",
    raNumber: "RA2021007",
    phoneNumber: "+91-9876543216",
    department: "Electronics & Communication",
    faName: "Dr. Meera Nair",
    faPhoneNumber: "+91-9876543002",
    faEmail: "meera.nair@university.edu",
  },
]

const page = () => {
  return (
    <div className="px-4 py-6 max-w-7xl mx-auto font-sans space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tighter">Club Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-400/20 px-4 py-1 rounded-full text-sm text-red-400">Club Name</div>
          <div className="bg-blue-400/20 px-4 py-1 rounded-full text-sm text-blue-400">Representative&apos;s Name</div>
          <div className="bg-green-400/20 px-4 py-1 rounded-full text-sm text-green-400">(Number) Members</div>
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-lg overflow-hidden">
        <div className="flex justify-between mb-4">
          <span className="text-sm">Club Members&apos; List</span>
          <AddMemberButton />
        </div>
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">UUID</TableHead>
              <TableHead>Picture</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>FA Name</TableHead>
              <TableHead>FA Phone Number</TableHead>
              <TableHead>FA Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.raNumber}>
                <TableCell className="font-medium">{member.sNo}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.raNumber}</TableCell>
                <TableCell className="">{member.phoneNumber}</TableCell>
                <TableCell className="">{member.department}</TableCell>
                <TableCell className="">{member.faName}</TableCell>
                <TableCell className="">{member.faPhoneNumber}</TableCell>
                <TableCell className="">{member.faEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default page