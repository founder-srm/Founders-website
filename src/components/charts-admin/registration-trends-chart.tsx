'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { RegistrationTrend } from '@/components/providers/DashboardDataProvider';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  registrations: {
    label: 'Total',
    color: 'var(--chart-1)',
  },
  accepted: {
    label: 'Accepted',
    color: 'var(--chart-2)',
  },
  rejected: {
    label: 'Rejected',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

interface RegistrationTrendsChartProps {
  data: RegistrationTrend[];
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export function RegistrationTrendsChart({
  data,
  trend,
  trendPercentage,
}: RegistrationTrendsChartProps) {
  // Format date for display
  const formattedData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Registration Trends</CardTitle>
        <CardDescription>
          Daily registration activity over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{ left: 12, right: 12, top: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient
                id="fillRegistrations"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAccepted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="registrations"
              type="monotone"
              fill="url(#fillRegistrations)"
              fillOpacity={0.4}
              stroke="var(--color-registrations)"
              strokeWidth={2}
            />
            <Area
              dataKey="accepted"
              type="monotone"
              fill="url(#fillAccepted)"
              fillOpacity={0.4}
              stroke="var(--color-accepted)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend === 'up' ? (
                <>
                  Trending up by {trendPercentage.toFixed(1)}% this week
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </>
              ) : trend === 'down' ? (
                <>
                  Trending down by {trendPercentage.toFixed(1)}% this week
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              ) : (
                <>Registrations are stable this week</>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Last 30 days
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
