'use client';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import type { Event } from '@/types/events';
import type { Registration } from '@/types/registrations';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig;

interface BarChartHorizontalProps {
  events: Event[];
  registrations: Registration[];
}

export function Component({ events, registrations }: BarChartHorizontalProps) {
  const barChartData = useMemo(() => {
    return events.map(event => {
      const eventRegs = registrations.filter(r => r.event_id === event.id);
      return {
        eventName: event.title,
        registrations: eventRegs.length,
      };
    });
  }, [events, registrations]);

  return (
    <Card className="">
      <CardContent className="flex-1 pb-0 h-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={barChartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="eventName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="registrations" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="registrations"
              layout="vertical"
              fill="var(--color-registrations)"
              radius={4}
            >
              <LabelList
                dataKey="eventName"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="registrations"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total registrations overview <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
