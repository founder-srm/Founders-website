'use client';

import { TrendingUp } from 'lucide-react';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  registrations: {
    label: 'Registrations',
    color: 'hsl(var(--chart-1))',
  },
  events: {
    label: 'Events',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface MonthlyOverviewChartProps {
  data: { month: string; registrations: number; events: number }[];
}

export function MonthlyOverviewChart({ data }: MonthlyOverviewChartProps) {
  const totalRegistrations = data.reduce(
    (sum, item) => sum + item.registrations,
    0
  );
  const totalEvents = data.reduce((sum, item) => sum + item.events, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Events and registrations by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="registrations"
              fill="var(--color-registrations)"
              radius={4}
            />
            <Bar dataKey="events" fill="var(--color-events)" radius={4} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {totalRegistrations} registrations across {totalEvents} events
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Last 6 months</div>
      </CardFooter>
    </Card>
  );
}
