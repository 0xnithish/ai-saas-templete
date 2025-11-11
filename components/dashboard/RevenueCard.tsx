"use client"

import * as React from "react"
import { Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", value: 12500 },
  { month: "Feb", value: 14800 },
  { month: "Mar", value: 13200 },
  { month: "Apr", value: 16100 },
  { month: "May", value: 14500 },
  { month: "Jun", value: 17800 },
  { month: "Jul", value: 15231 },
]

const chartConfig = {
  value: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RevenueCard() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-bold">$15,231.89</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-primary">+20.1%</span> from last month
        </p>
        <div className="pt-2">
          <ChartContainer
            config={chartConfig}
            className="h-[120px] w-full"
          >
            <LineChart data={revenueData} margin={{ top: 5, right: 15, left: 15, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis 
                tickLine={false}
                tick={false}
                axisLine={false}
                width={0}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 5 }}
                className="stroke-primary"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
