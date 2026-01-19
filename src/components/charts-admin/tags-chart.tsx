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

export interface TagData {
  tag: string;
  count: number;
}

interface TagsChartProps {
  data: TagData[];
}

export function TagsChart({ data }: TagsChartProps) {
  const chartData = data.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Tags</CardTitle>
        <CardDescription>Most used event tags</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 10, right: 10 }}
          >
            <XAxis
              dataKey="tag"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
