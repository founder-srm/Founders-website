'use client';

import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
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

const chartConfig = {
  count: {
    label: 'Events',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export interface VenueData {
  venue: string;
  count: number;
}

interface VenueChartProps {
  data: VenueData[];
}

export function VenueChart({ data }: VenueChartProps) {
  const chartData = data.slice(0, 6).map(item => ({
    ...item,
    shortVenue:
      item.venue.length > 15 ? item.venue.substring(0, 15) + '...' : item.venue,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events by Venue</CardTitle>
        <CardDescription>Most used event locations</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 10 }}
          >
            <YAxis
              dataKey="shortVenue"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              width={100}
              tick={{ fontSize: 11 }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    if (payload && payload[0]) {
                      return (payload[0].payload as VenueData).venue;
                    }
                    return '';
                  }}
                />
              }
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
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
