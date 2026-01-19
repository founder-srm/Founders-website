'use client';

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
  featured: {
    label: 'Featured',
    color: 'hsl(var(--chart-1))',
  },
  regular: {
    label: 'Regular',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export interface FeaturedComparisonData {
  metric: string;
  featured: number;
  regular: number;
}

interface FeaturedPerformanceChartProps {
  data: FeaturedComparisonData[];
  featuredAvg: number;
  regularAvg: number;
}

export function FeaturedPerformanceChart({ data, featuredAvg, regularAvg }: FeaturedPerformanceChartProps) {
  const improvement = regularAvg > 0 
    ? ((featuredAvg - regularAvg) / regularAvg * 100).toFixed(0) 
    : '∞';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured vs Regular</CardTitle>
        <CardDescription>Registration comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="metric"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="featured" fill="var(--color-featured)" radius={4} />
            <Bar dataKey="regular" fill="var(--color-regular)" radius={4} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="font-medium leading-none">
          Featured events: <span className="text-primary">+{improvement}%</span> registrations
        </div>
        <div className="leading-none text-muted-foreground text-xs">
          Avg: {featuredAvg.toFixed(1)} (featured) vs {regularAvg.toFixed(1)} (regular)
        </div>
      </CardFooter>
    </Card>
  );
}
