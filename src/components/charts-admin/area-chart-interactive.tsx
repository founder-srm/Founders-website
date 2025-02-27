'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import type { Event } from '@/types/events';
import type { Registration } from '@/types/registrations';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const chartConfig = {
  registrations: {
    label: 'Registrations',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface AreaChartProps {
  events: Event[];
  registrations: Registration[];
}

export function Component({ events, registrations }: AreaChartProps) {
  const [timeRange, setTimeRange] = React.useState('90d');

  const processedData = React.useMemo(() => {
    // Create a map of dates with registration counts per event
    const dateMap = new Map();

    // biome-ignore lint/complexity/noForEach: easier to work with
    registrations.forEach(reg => {
      const date = new Date(reg.created_at as string)
        .toISOString()
        .split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date,
          // biome-ignore lint/performance/noAccumulatingSpread: easier to work with
          ...events.reduce((acc, event) => ({ ...acc, [event.title]: 0 }), {}),
        });
      }
      const event = events.find(e => e.id === reg.event_id);
      if (event) {
        const dateData = dateMap.get(date);
        dateData[event.title] = (dateData[event.title] || 0) + 1;
      }
    });

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [events, registrations]);

  const filteredData = processedData.filter(item => {
    const date = new Date(item.date);
    const now = new Date();
    const daysToSubtract =
      timeRange === '30d' ? 30 : timeRange === '7d' ? 7 : 90;
    const startDate = new Date(now.setDate(now.getDate() - daysToSubtract));
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Registration Distribution</CardTitle>
          <CardDescription>Event registrations over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {events.map((event, index) => (
                <linearGradient
                  key={event.id}
                  id={`fill${event.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`hsl(${index * 60}, 70%, 50%)`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`hsl(${index * 60}, 70%, 50%)`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {events.map((event, index) => (
              <Area
                key={event.id}
                dataKey={event.title}
                type="monotone"
                fill={`url(#fill${event.id})`}
                stroke={`hsl(${index * 60}, 70%, 50%)`}
                stackId="1"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
