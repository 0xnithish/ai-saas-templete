"use client"

import * as React from "react"
import { Bar, BarChart, Cell, XAxis } from "recharts"

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

const subscriptionData = [
  { value: 240, label: "240" },
  { value: 300, label: "300" },
  { value: 200, label: "200" },
  { value: 278, label: "278" },
  { value: 189, label: "189" },
  { value: 239, label: "239" },
  { value: 278, label: "278" },
  { value: 189, label: "189" },
]

const chartConfig = {
  value: {
    label: "Subscriptions",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SubscriptionCard() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-bold">+4850</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-primary">+180.1%</span> from last month
        </p>
        <div className="pt-2">
          <ChartContainer
            config={chartConfig}
            className="h-[100px] w-full"
          >
            <BarChart data={subscriptionData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="value" 
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    className="fill-primary"
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
