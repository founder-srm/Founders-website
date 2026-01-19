'use client';

import * as React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import type { EventTypeDistribution } from '@/components/providers/DashboardDataProvider';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface EventTypeChartProps {
  data: EventTypeDistribution[];
}

export function EventTypeChart({ data }: EventTypeChartProps) {
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: { label: 'Count' },
    };
    data.forEach((item, index) => {
      config[item.type.toLowerCase()] = {
        label: item.type,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [data]);

  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Event Types</CardTitle>
        <CardDescription>Distribution by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={80}
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.type}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
