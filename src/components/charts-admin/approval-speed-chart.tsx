'use client';

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  autoApproved: {
    label: 'Auto-Approved',
    color: 'hsl(var(--chart-1))',
  },
  manualReview: {
    label: 'Manual Review',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export interface ApprovalWorkflowData {
  type: string;
  count: number;
}

interface ApprovalWorkflowChartProps {
  data: ApprovalWorkflowData[];
  autoApproveRate: number;
}

export function ApprovalWorkflowChart({
  data,
  autoApproveRate,
}: ApprovalWorkflowChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Workflow</CardTitle>
        <CardDescription>
          Auto-approved vs manual review ({autoApproveRate.toFixed(0)}% auto)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 10, right: 10 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              width={100}
              tick={{ fontSize: 11 }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-3))'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
