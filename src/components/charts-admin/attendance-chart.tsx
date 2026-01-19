'use client';

import { Pie, PieChart, Cell, Label } from 'recharts';
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

const chartConfig = {
  count: {
    label: 'Count',
  },
  Present: {
    label: 'Present',
    color: 'hsl(var(--chart-1))',
  },
  Absent: {
    label: 'Absent',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const COLORS = {
  Present: 'hsl(var(--chart-1))',
  Absent: 'hsl(var(--chart-4))',
};

export interface AttendanceData {
  status: 'Present' | 'Absent';
  count: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  attendanceRate: number;
}

export function AttendanceChart({ data, attendanceRate }: AttendanceChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Event Attendance</CardTitle>
        <CardDescription>Check-in rate for past events</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
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
              innerRadius={50}
              outerRadius={70}
              strokeWidth={5}
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.status} 
                  fill={COLORS[entry.status]} 
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
                          className="fill-foreground text-2xl font-bold"
                        >
                          {attendanceRate.toFixed(0)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Attended
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/2 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
