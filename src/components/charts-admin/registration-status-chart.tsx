'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';
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
import type { RegistrationStatusData } from '@/components/providers/DashboardDataProvider';

const chartConfig = {
  count: {
    label: 'Count',
  },
  Accepted: {
    label: 'Accepted',
    color: 'hsl(var(--chart-1))',
  },
  Pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-3))',
  },
  Rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

const COLORS = {
  Accepted: 'hsl(var(--chart-1))',
  Pending: 'hsl(var(--chart-3))',
  Rejected: 'hsl(var(--chart-5))',
};

interface RegistrationStatusChartProps {
  data: RegistrationStatusData[];
  acceptanceRate: number;
}

export function RegistrationStatusChart({ data, acceptanceRate }: RegistrationStatusChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Registration Status</CardTitle>
        <CardDescription>Approval distribution</CardDescription>
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
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.status} 
                  fill={COLORS[entry.status as keyof typeof COLORS]} 
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {acceptanceRate.toFixed(0)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Accepted
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
