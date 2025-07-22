"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Brain,
  Target,
  Clock,
  Shield,
} from "lucide-react"
import type { ComprehensiveAnalysisResult, DeepResearchItem } from "@/lib/ai/deep-research-analysis"

interface ComprehensiveAnalysisDisplayProps {
  analysis: ComprehensiveAnalysisResult
}

export function ComprehensiveAnalysisDisplay({ analysis }: ComprehensiveAnalysisDisplayProps) {
  const [selectedItem, setSelectedItem] = useState<DeepResearchItem | null>(null)
  const [expandedThinking, setExpandedThinking] = useState<string | null>(null)

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getROIColor = (roi: number) => {
    if (roi > 50) return "text-green-600"
    if (roi > 25) return "text-blue-600"
    if (roi > 10) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Executive Dashboard */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900">Comprehensive Manifest Analysis</CardTitle>
              <CardDescription className="text-blue-700">
                {analysis.fileName} • {analysis.validItems} items analyzed •{" "}
                {(analysis.processingTime / 1000).toFixed(1)}s processing
              </CardDescription>
            </div>
            <Badge
              className={`px-3 py-1 text-sm font-semibold ${
                analysis.executiveSummary.marketCondition === "Excellent"
                  ? "bg-green-100 text-green-800"
                  : analysis.executiveSummary.marketCondition === "Good"
                    ? "bg-blue-100 text-blue-800"
                    : analysis.executiveSummary.marketCondition === "Fair"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
              }`}
            >
              {analysis.executiveSummary.marketCondition} Market
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${analysis.executiveSummary.totalPotentialProfit.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Potential Profit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.executiveSummary.averageROI.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Average ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${analysis.executiveSummary.estimatedLiquidationValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Est. Liquidation Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {(analysis.executiveSummary.aiConfidence * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">AI Confidence</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>AI Confidence Score</span>
                <span>{(analysis.executiveSummary.aiConfidence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={analysis.executiveSummary.aiConfidence * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Low Risk: {analysis.executiveSummary.riskDistribution.low}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Medium Risk: {analysis.executiveSummary.riskDistribution.medium}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>High Risk: {analysis.executiveSummary.riskDistribution.high}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Critical Risk: {analysis.executiveSummary.riskDistribution.critical}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Portfolio Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.executiveSummary.topCategories.map((cat, index) => (
                    <div key={cat.category} className="flex justify-between items-center">
                      <span className="font-medium">{cat.category}</span>
                      <div className="text-right">
                        <div className="font-semibold">${cat.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{cat.count} items</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Product Identification</span>
                      <span>{(analysis.aiAnalysisLog.confidenceMetrics.productIdentification * 100).toFixed(0)}%</span>
                    </div>
                    <Progress
                      value={analysis.aiAnalysisLog.confidenceMetrics.productIdentification * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Pricing</span>
                      <span>{(analysis.aiAnalysisLog.confidenceMetrics.marketPricing * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={analysis.aiAnalysisLog.confidenceMetrics.marketPricing * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Evaluation</span>
                      <span>{(analysis.aiAnalysisLog.confidenceMetrics.riskEvaluation * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={analysis.aiAnalysisLog.confidenceMetrics.riskEvaluation * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Monthly Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span className="font-semibold">
                      ${analysis.portfolioInsights.financialProjections.monthly.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">
                      ${analysis.portfolioInsights.financialProjections.monthly.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI</span>
                    <span
                      className={`font-semibold ${getROIColor(analysis.portfolioInsights.financialProjections.monthly.roi)}`}
                    >
                      {analysis.portfolioInsights.financialProjections.monthly.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quarterly Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span className="font-semibold">
                      ${analysis.portfolioInsights.financialProjections.quarterly.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">
                      ${analysis.portfolioInsights.financialProjections.quarterly.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI</span>
                    <span
                      className={`font-semibold ${getROIColor(analysis.portfolioInsights.financialProjections.quarterly.roi)}`}
                    >
                      {analysis.portfolioInsights.financialProjections.quarterly.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Annual Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span className="font-semibold">
                      ${analysis.portfolioInsights.financialProjections.annual.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">
                      ${analysis.portfolioInsights.financialProjections.annual.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI</span>
                    <span
                      className={`font-semibold ${getROIColor(analysis.portfolioInsights.financialProjections.annual.roi)}`}
                    >
                      {analysis.portfolioInsights.financialProjections.annual.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Category Performance</h4>
                  <div className="space-y-2">
                    {Object.entries(analysis.portfolioInsights.categoryDistribution).map(([category, data]) => (
                      <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{category}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{data.avgROI.toFixed(1)}% ROI</div>
                          <div className="text-xs text-gray-500">{data.count} items</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Market Opportunities</h4>
                  <div className="space-y-2">
                    {analysis.portfolioInsights.riskAnalysis.opportunities.map((opportunity, index) => (
                      <Alert key={index} className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{opportunity}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.portfolioInsights.strategicRecommendations.immediate.map((action, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-800">{action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Short-term (1-3 months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.portfolioInsights.strategicRecommendations.shortTerm.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-yellow-50 rounded border border-yellow-200"
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-yellow-800">{action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Long-term (3+ months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.portfolioInsights.strategicRecommendations.longTerm.map((action, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-blue-800">{action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Analysis & Mitigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">Critical Risks</h4>
                  <div className="space-y-2">
                    {analysis.portfolioInsights.riskAnalysis.criticalRisks.map((risk, index) => (
                      <Alert key={index} className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{risk}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-blue-700">Recommendations</h4>
                  <div className="space-y-2">
                    {analysis.portfolioInsights.riskAnalysis.recommendations.map((rec, index) => (
                      <Alert key={index} className="border-blue-200 bg-blue-50">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">{rec}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Items List */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Item Analysis</CardTitle>
                <CardDescription>Click on any item to see detailed analysis and AI thinking process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {analysis.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedItem?.id === item.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{item.cleanedTitle}</h4>
                        <Badge className={getRiskColor(item.riskAssessment.overallRisk)}>
                          {item.riskAssessment.overallRisk}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>
                          ROI:{" "}
                          <span className={getROIColor(item.profitAnalysis.roi)}>
                            {item.profitAnalysis.roi.toFixed(1)}%
                          </span>
                        </span>
                        <span>Profit: ${item.profitAnalysis.netProfit.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Item Detail */}
            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedItem.cleanedTitle}</CardTitle>
                  <CardDescription>
                    {selectedItem.brand && `${selectedItem.brand} • `}
                    {selectedItem.category}
                    {selectedItem.upc && ` • UPC: ${selectedItem.upc}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Market Research */}
                  <div>
                    <h4 className="font-semibold mb-2">Market Research</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Amazon: ${selectedItem.marketResearch.amazonPrice?.toFixed(2) || "N/A"}</div>
                      <div>eBay: ${selectedItem.marketResearch.ebayPrice?.toFixed(2) || "N/A"}</div>
                      <div>Walmart: ${selectedItem.marketResearch.walmartPrice?.toFixed(2) || "N/A"}</div>
                      <div>Average: ${selectedItem.marketResearch.averageMarketPrice.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Demand: {selectedItem.marketResearch.demandLevel}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {selectedItem.marketResearch.trendDirection === "Up" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : selectedItem.marketResearch.trendDirection === "Down" ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : null}
                        {selectedItem.marketResearch.trendDirection}
                      </Badge>
                    </div>
                  </div>

                  {/* Liquidation Analysis */}
                  <div>
                    <h4 className="font-semibold mb-2">Liquidation Scenarios</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>
                          Conservative ({(selectedItem.liquidationAnalysis.conservative.probability * 100).toFixed(0)}
                          %):
                        </span>
                        <span>${selectedItem.liquidationAnalysis.conservative.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Realistic ({(selectedItem.liquidationAnalysis.realistic.probability * 100).toFixed(0)}%):
                        </span>
                        <span>${selectedItem.liquidationAnalysis.realistic.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Optimistic ({(selectedItem.liquidationAnalysis.optimistic.probability * 100).toFixed(0)}%):
                        </span>
                        <span>${selectedItem.liquidationAnalysis.optimistic.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Recommended:</span>
                        <span>${selectedItem.liquidationAnalysis.recommendedPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      Best Platform: {selectedItem.liquidationAnalysis.recommendedPlatform}
                    </Badge>
                  </div>

                  {/* Profit Analysis */}
                  <div>
                    <h4 className="font-semibold mb-2">Profit Analysis</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Gross Profit:</span>
                        <span className="text-green-600">${selectedItem.profitAnalysis.grossProfit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Net Profit:</span>
                        <span className="text-green-600">${selectedItem.profitAnalysis.netProfit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI:</span>
                        <span className={getROIColor(selectedItem.profitAnalysis.roi)}>
                          {selectedItem.profitAnalysis.roi.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Break-even:</span>
                        <span>${selectedItem.profitAnalysis.breakEvenPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Thinking Process */}
                  <div>
                    <Collapsible
                      open={expandedThinking === selectedItem.id}
                      onOpenChange={(open) => setExpandedThinking(open ? selectedItem.id : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full justify-between bg-transparent">
                          <span className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            View AI Thinking Process
                          </span>
                          {expandedThinking === selectedItem.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3 mt-3">
                        <div className="space-y-3 text-sm">
                          <div className="p-3 bg-blue-50 rounded border border-blue-200">
                            <h5 className="font-semibold text-blue-800 mb-1">Initial Assessment</h5>
                            <p className="text-blue-700">{selectedItem.aiThinking.initialAssessment}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded border border-green-200">
                            <h5 className="font-semibold text-green-800 mb-1">Market Research Process</h5>
                            <p className="text-green-700">{selectedItem.aiThinking.marketResearchProcess}</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded border border-purple-200">
                            <h5 className="font-semibold text-purple-800 mb-1">Valuation Methodology</h5>
                            <p className="text-purple-700">{selectedItem.aiThinking.valuationMethodology}</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded border border-orange-200">
                            <h5 className="font-semibold text-orange-800 mb-1">Risk Evaluation</h5>
                            <p className="text-orange-700">{selectedItem.aiThinking.riskEvaluation}</p>
                          </div>
                          <div className="p-3 bg-indigo-50 rounded border border-indigo-200">
                            <h5 className="font-semibold text-indigo-800 mb-1">Strategic Recommendations</h5>
                            <p className="text-indigo-700">{selectedItem.aiThinking.strategicRecommendations}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <h5 className="font-semibold text-gray-800 mb-1">Final Conclusion</h5>
                            <p className="text-gray-700">{selectedItem.aiThinking.finalConclusion}</p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
