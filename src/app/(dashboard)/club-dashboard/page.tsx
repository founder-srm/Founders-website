"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Building2,
  Calendar,
  Globe,
  Loader2,
  Mail,
  Shield,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddMemberButton from "@/components/AddMemberButton";
import { EditClubProfileModal } from "@/components/EditClubProfileModal";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MembersDataTable } from "@/components/data-table-club/members-table";
import { columns } from "@/components/data-table-club/columns";
import useClub from "@/hooks/use-club";
import { useUser } from "@/stores/session";
import { fetchClubMembers, type ClubMember } from "@/actions/club/action";

const ClubDashboardPage = () => {
  const user = useUser();
  const router = useRouter();
  const { isClub, club, userRole, loading: clubLoading } = useClub({ user });
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchedClubId = useRef<string | null>(null);

  const fetchMembers = useCallback(async (clubId: string, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    }

    const { data, error } = await fetchClubMembers(clubId);

    if (error || !data) {
      console.error("Error fetching members:", error);
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoadingMembers(false);
      }
      return;
    }

    setMembers(data);
    if (isRefresh) {
      setIsRefreshing(false);
    } else {
      setIsLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    if (!club?.id || fetchedClubId.current === club.id) {
      if (!club?.id && !clubLoading) {
        setIsLoadingMembers(false);
      }
      return;
    }

    fetchedClubId.current = club.id;
    fetchMembers(club.id);
  }, [club?.id, clubLoading, fetchMembers]);

  useEffect(() => {
    if (!clubLoading && !isClub) {
      router.push("/dashboard/account");
    }
  }, [clubLoading, isClub, router]);

  const handleRefresh = useCallback(() => {
    if (club?.id && !isRefreshing) {
      fetchMembers(club.id, true);
    }
  }, [club?.id, isRefreshing, fetchMembers]);

  if (clubLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isClub || !club) {
    return null;
  }

  const verifiedCount = members.filter((m) => m.is_verified).length;
  const repsCount = members.filter((m) => m.user_role === "club_rep").length;

  const statsCards = [
    {
      title: "Total Members",
      value: members.length,
      description: "Active club members",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Representatives",
      value: repsCount,
      description: "Club administrators",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Verified Members",
      value: verifiedCount,
      description: `${members.length > 0 ? Math.round((verifiedCount / members.length) * 100) : 0}% verification rate`,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pending",
      value: members.length - verifiedCount,
      description: "Awaiting verification",
      icon: UserPlus,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/account">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Club Portal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Club Profile Card */}
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
              {/* Club Avatar */}
              <div className="relative">
                {club.profile_picture ? (
                  <Image
                    src={club.profile_picture}
                    alt={club.name}
                    width={96}
                    height={96}
                    className="rounded-xl border-4 border-background shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl border-4 border-background shadow-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-primary-foreground" />
                  </div>
                )}
                {userRole === "club_rep" ? (
                  <EditClubProfileModal
                    clubId={club.id}
                    clubName={club.name}
                    currentPicture={club.profile_picture}
                    onUpdate={() => {
                      // Force reload to see updated picture
                      window.location.reload();
                    }}
                  />
                ) : (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full" />
                  </span>
                )}
              </div>

              {/* Club Info */}
              <div className="flex-1 space-y-2 pb-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {club.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className={
                      userRole === "club_rep"
                        ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20"
                    }
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {userRole === "club_rep" ? "Representative" : "Member"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {club.email}
                  </span>
                  {club.website && (
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(club.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pb-2">
                <AddMemberButton />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Members Section */}
        <Card>
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-xl">Team Members</CardTitle>
              <CardDescription>
                Manage your club members and their roles
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <MembersDataTable
              columns={columns}
              data={members}
              isLoading={isLoadingMembers}
              isRefreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubDashboardPage;