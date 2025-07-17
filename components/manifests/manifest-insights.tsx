"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, TrendingUp, AlertTriangle, DollarSign, Calendar, ShoppingBag, BarChart2, Zap } from "lucide-react"

interface ManifestInsightsProps {
  manifestId: string
}

export function ManifestInsights({ manifestId }: ManifestInsightsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>AI-Generated Insights</CardTitle>
          </div>
          <CardDescription>Key insights and recommendations based on AI analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Executive Summary</AlertTitle>
            <AlertDescription>
              This manifest contains 87 items with an estimated total value of $12,450.75. The majority (48.3%) are
              electronics items, with particularly strong value in Apple products and gaming consoles. Overall risk is
              low, with 71% of items having low risk scores. Expected profit margin is approximately 42% based on
              current market conditions.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="opportunities">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="market">Market Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="opportunities" className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">High-Value Opportunities</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Apple Products Premium</p>
                      <p className="text-sm text-muted-foreground">
                        The 12 Apple products in this manifest have an average 58% profit margin, significantly higher
                        than the overall average.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Seasonal Opportunity</p>
                      <p className="text-sm text-muted-foreground">
                        Gaming consoles are showing increased demand (up 23% this month) as we approach the holiday
                        season.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShoppingBag className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Bundle Potential</p>
                      <p className="text-sm text-muted-foreground">
                        Consider bundling the 8 pairs of headphones with smartphones to increase overall value by an
                        estimated 15%.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="risks" className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold">Risk Factors</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Authenticity Concerns</p>
                      <p className="text-sm text-muted-foreground">
                        7 items have high authenticity risk scores, particularly the designer clothing items which
                        should be verified before resale.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Market Saturation</p>
                      <p className="text-sm text-muted-foreground">
                        The market for Bluetooth speakers is currently saturated, with prices down 12% in the last 30
                        days.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Condition Issues</p>
                      <p className="text-sm text-muted-foreground">
                        18 items are in fair or poor condition, which may require refurbishment to achieve optimal
                        value.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="market" className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Market Analysis</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Rising Categories</p>
                      <p className="text-sm text-muted-foreground">
                        Wireless earbuds (+18%), gaming accessories (+15%), and smart home devices (+12%) are showing
                        strong upward price trends.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Optimal Selling Window</p>
                      <p className="text-sm text-muted-foreground">
                        Based on historical data, the next 45 days represent the optimal selling window for 65% of the
                        items in this manifest.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShoppingBag className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Platform Recommendations</p>
                      <p className="text-sm text-muted-foreground">
                        Electronics items achieve 22% higher prices on specialized marketplaces compared to general
                        platforms.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Value Optimization</CardTitle>
          </div>
          <CardDescription>Recommendations to maximize the value of this manifest</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Pricing Strategy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI analysis suggests the following pricing strategy to maximize returns:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Premium Pricing</span>
                    <p className="text-xs text-muted-foreground">For high-demand, excellent condition items</p>
                  </div>
                  <Badge>32 items</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Competitive Pricing</span>
                    <p className="text-xs text-muted-foreground">For moderate-demand, good condition items</p>
                  </div>
                  <Badge>41 items</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Value Pricing</span>
                    <p className="text-xs text-muted-foreground">For low-demand or poor condition items</p>
                  </div>
                  <Badge>14 items</Badge>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Refurbishment Opportunities</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These items would benefit from minor repairs or refurbishment before selling:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Samsung Galaxy S21 (cracked screen)</span>
                  <span className="font-medium">+$120 value potential</span>
                </li>
                <li className="flex justify-between">
                  <span>MacBook Pro (battery replacement)</span>
                  <span className="font-medium">+$200 value potential</span>
                </li>
                <li className="flex justify-between">
                  <span>Dyson Vacuum (filter replacement)</span>
                  <span className="font-medium">+$75 value potential</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
