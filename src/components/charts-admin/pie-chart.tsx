'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface PieChartProps {
  data?: {
    event_type?: string;
    registrations_count?: number;
  }[];
}

export default function PieChartComponent({ data = [] }: PieChartProps) {
  const processedData = React.useMemo(() => {
    if (!data) return [];

    const typeCount = data.reduce(
      (acc, curr) => {
        const type = curr.event_type || 'other';
        acc[type] = (acc[type] || 0) + (curr.registrations_count || 0);
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      fill: `var(--color-${type.toLowerCase()})`,
    }));
  }, [data]);

  const totalRegistrations = React.useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr.count, 0);
  }, [processedData]);

  const chartConfig = processedData.reduce((acc, curr) => {
    acc[curr.type.toLowerCase()] = {
      label: curr.type,
      color: `hsl(var(--chart-${Object.keys(acc).length + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0 h-full">
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
              data={processedData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          {totalRegistrations.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Registrations
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Registrations based on Status <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
