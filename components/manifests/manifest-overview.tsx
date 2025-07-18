"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
// import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
const mockCategoryData = [
  { name: "Electronics", value: 42, percentage: 48.3, trend: "up" },
  { name: "Home & Kitchen", value: 18, percentage: 20.7, trend: "down" },
  { name: "Clothing", value: 15, percentage: 17.2, trend: "up" },
  { name: "Toys & Games", value: 8, percentage: 9.2, trend: "neutral" },
  { name: "Other", value: 4, percentage: 4.6, trend: "neutral" },
]

const mockValueData = [
  { category: "Electronics", value: 8750.25 },
  { category: "Home & Kitchen", value: 1850.5 },
  { category: "Clothing", value: 1200.0 },
  { category: "Toys & Games", value: 450.0 },
  { category: "Other", value: 200.0 },
]

const mockRiskData = [
  { name: "Low Risk", value: 62, color: "bg-green-500" },
  { name: "Medium Risk", value: 18, color: "bg-yellow-500" },
  { name: "High Risk", value: 7, color: "bg-red-500" },
]

const mockTrendData = [
  { month: "Jan", value: 4000 },
  { month: "Feb", value: 3000 },
  { month: "Mar", value: 5000 },
  { month: "Apr", value: 4500 },
  { month: "May", value: 6000 },
  { month: "Jun", value: 5500 },
  { month: "Jul", value: 7000 },
]

interface ManifestOverviewProps {
  manifestId: string
}

export function ManifestOverview({ manifestId }: ManifestOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Manifest Summary</CardTitle>
          <CardDescription>Overview of manifest analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="flex items-center">
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" /> Completed
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">Total Items</div>
              <div className="text-2xl font-bold">87</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">Estimated Value</div>
              <div className="text-2xl font-bold">{formatCurrency(12450.75)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-muted-foreground">AI Confidence</div>
              <div className="flex items-center gap-2">
                <Progress value={92} className="h-2" />
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Distribution of items by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCategoryData.map((category) => (
              <div key={category.name} className="flex items-center">
                <div className="w-1/3 font-medium">{category.name}</div>
                <div className="w-1/3">
                  <div className="flex items-center gap-2">
                    <Progress value={category.percentage} className="h-2" />
                    <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                  </div>
                </div>
                <div className="w-1/3 flex items-center gap-2">
                  <span className="font-medium">{category.value} items</span>
                  {category.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {category.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Item risk distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRiskData.map((risk) => (
              <div key={risk.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{risk.name}</span>
                  <span className="text-sm text-muted-foreground">{risk.value} items</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className={`h-2 rounded-full ${risk.color}`} style={{ width: `${(risk.value / 87) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Value by Category</CardTitle>
          <CardDescription>Estimated values across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockValueData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="font-medium">{item.category}</span>
                <span className="text-lg font-bold">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
