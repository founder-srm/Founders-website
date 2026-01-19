'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { EventPerformance } from '@/components/providers/DashboardDataProvider';

const chartConfig = {
  registrations: {
    label: 'Registrations',
    color: 'var(--chart-1)',
  },
  accepted: {
    label: 'Accepted',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface EventPerformanceChartProps {
  data: EventPerformance[];
}

export function EventPerformanceChart({ data }: EventPerformanceChartProps) {
  // Take top 8 events
  const topEvents = data.slice(0, 8).map(event => ({
    ...event,
    shortTitle: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
  }));

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Event Performance</CardTitle>
        <CardDescription>
          Registrations by event (top 8)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={topEvents}
            layout="vertical"
            margin={{ left: 20, right: 20 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="shortTitle"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
              tick={{ fontSize: 12 }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    if (payload && payload[0]) {
                      return (payload[0].payload as EventPerformance).title;
                    }
                    return '';
                  }}
                />
              }
            />
            <Bar
              dataKey="registrations"
              fill="var(--color-registrations)"
              radius={[0, 4, 4, 0]}
            >
              {topEvents.map((entry, index) => (
                <Cell
                  key={`cell-${entry.title}`}
                  fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
