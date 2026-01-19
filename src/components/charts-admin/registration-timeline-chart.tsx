'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  registrations: {
    label: 'Registrations',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export interface TimelineData {
  daysBeforeEvent: string;
  registrations: number;
}

interface RegistrationTimelineChartProps {
  data: TimelineData[];
  peakDay: string;
}

export function RegistrationTimelineChart({
  data,
  peakDay,
}: RegistrationTimelineChartProps) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Registration Timeline</CardTitle>
        <CardDescription>
          When people register relative to event date
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12, top: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="daysBeforeEvent"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillTimeline" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-registrations)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="registrations"
              type="monotone"
              fill="url(#fillTimeline)"
              fillOpacity={0.4}
              stroke="var(--color-registrations)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Peak registration period:{' '}
          <span className="font-medium text-foreground">{peakDay}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
