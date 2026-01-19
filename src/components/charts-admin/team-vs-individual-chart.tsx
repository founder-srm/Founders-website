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
  Team: {
    label: 'Team Entry',
    color: 'hsl(var(--chart-1))',
  },
  Individual: {
    label: 'Individual',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const COLORS = {
  Team: 'hsl(var(--chart-1))',
  Individual: 'hsl(var(--chart-3))',
};

export interface TeamVsIndividualData {
  type: 'Team' | 'Individual';
  count: number;
}

interface TeamVsIndividualChartProps {
  data: TeamVsIndividualData[];
}

export function TeamVsIndividualChart({ data }: TeamVsIndividualChartProps) {
  const teamCount = data.find(d => d.type === 'Team')?.count || 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Registration Type</CardTitle>
        <CardDescription>Team vs individual entries</CardDescription>
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
              nameKey="type"
              innerRadius={50}
              outerRadius={70}
              strokeWidth={5}
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.type} 
                  fill={COLORS[entry.type]} 
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
                          {teamCount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Teams
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/2 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
