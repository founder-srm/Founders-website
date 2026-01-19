'use client';

import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { DashboardStats } from '@/components/providers/DashboardDataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
          <p className="text-xs text-muted-foreground">Events created</p>
        </CardContent>
      </Card>

      {/* Total Registrations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registrations</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.recentTrend === 'up' ? (
              <>
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">
                  +{stats.trendPercentage.toFixed(1)}%
                </span>
                <span className="ml-1">from last week</span>
              </>
            ) : stats.recentTrend === 'down' ? (
              <>
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                <span className="text-red-500">
                  -{stats.trendPercentage.toFixed(1)}%
                </span>
                <span className="ml-1">from last week</span>
              </>
            ) : (
              <span>Stable this week</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acceptance Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.acceptanceRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.acceptedRegistrations} accepted
          </p>
        </CardContent>
      </Card>

      {/* Pending Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingRegistrations}</div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>
    </div>
  );
}
