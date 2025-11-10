"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ActiveUsersCard() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-bold">2,847</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-primary">+12.5%</span> from last month
        </p>
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-xs text-muted-foreground">Daily Active</span>
            <span className="font-semibold text-xs">1,234</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-xs text-muted-foreground">Weekly Active</span>
            <span className="font-semibold text-xs">2,103</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-xs text-muted-foreground">Monthly Active</span>
            <span className="font-semibold text-xs">2,847</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
