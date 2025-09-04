'use client';

import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Event } from '@/types/events';

interface BarChartProps {
  data?: Event[] | null;
}

export function BarChartComponent({ data = [] }: BarChartProps) {
  const processedData = React.useMemo(() => {
    if (!data) return [];

    // Group events by type and count
    const eventTypeCount = data.reduce(
      (acc, event) => {
        const type = event.event_type || 'unspecified';
        if (!acc[type]) {
          acc[type] = {
            type: type,
            count: 0,
            featured: 0,
            pending: 0,
          };
        }
        acc[type].count += 1;
        if (event.is_featured) acc[type].featured += 1;
        if (!event.always_approve) acc[type].pending += 1;
        return acc;
      },
      {} as Record<
        string,
        {
          type: string;
          count: number;
          featured: number;
          pending: number;
        }
      >
    );

    return Object.values(eventTypeCount);
  }, [data]);

  const chartConfig = {
    count: {
      label: 'Total Events',
      color: 'hsl(var(--chart-1))',
    },
    featured: {
      label: 'Featured',
      color: 'hsl(var(--chart-2))',
    },
    pending: {
      label: 'Pending Approval',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Type Distribution</CardTitle>
        <CardDescription>Events by type and status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={processedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="featured"
              fill="var(--color-featured)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              fill="var(--color-pending)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {processedData.length} different event types{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution of events by type and their status
        </div>
      </CardFooter>
    </Card>
  );
}
