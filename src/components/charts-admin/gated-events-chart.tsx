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
  Gated: {
    label: 'Club ',
    color: 'hsl(var(--chart-1))',
  },
  Open: {
    label: 'Open to All',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const COLORS = {
  Gated: 'hsl(var(--chart-1))',
  Open: 'hsl(var(--chart-3))',
};

export interface GatedEventData {
  type: 'Gated' | 'Open';
  count: number;
}

interface GatedEventsChartProps {
  data: GatedEventData[];
}

export function GatedEventsChart({ data }: GatedEventsChartProps) {
  const gatedCount = data.find(d => d.type === 'Gated')?.count || 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Event Access</CardTitle>
        <CardDescription>Gated vs open events</CardDescription>
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
                          {gatedCount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Gated
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
