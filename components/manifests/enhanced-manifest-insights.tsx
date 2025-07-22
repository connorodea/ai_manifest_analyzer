"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart2,
  Zap,
  Loader2,
  Brain,
  ChevronDown,
  ChevronUp,
  Target,
  Clock,
  Shield,
  Cog,
} from "lucide-react"
import { getEnhancedManifestById } from "@/lib/actions/enhanced-manifest-actions"
import type { ComprehensiveManifestAnalysisResult } from "@/lib/ai/enhanced-analysis-service"

interface EnhancedManifestInsightsProps {
  manifestId: string
}

export function EnhancedManifestInsights({ manifestId }: EnhancedManifestInsightsProps) {
  const [analysis, setAnalysis] = useState<ComprehensiveManifestAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [showThinking, setShowThinking] = useState(false)
  const [selectedItemThinking, setSelectedItemThinking] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const result = await getEnhancedManifestById(manifestId)
        setAnalysis(result)
      } catch (error) {
        console.error("Error fetching enhanced analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [manifestId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading comprehensive AI analysis...</span>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center p-8">
        <p>No enhanced analysis data available for this manifest.</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* AI Thinking Process Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>AI Analysis Process</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowThinking(!showThinking)}>
              {showThinking ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showThinking ? "Hide" : "Show"} AI Thinking
            </Button>
          </div>
          <CardDescription>Transparency into how our AI analyzed your manifest</CardDescription>
        </CardHeader>
        {showThinking && (
          <CardContent className="space-y-4">
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertTitle>Overall Strategy</AlertTitle>
              <AlertDescription>{analysis.thinkingProcess.overallStrategy}</AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Market Research Findings
                </h4>
                <ul className="space-y-1 text-sm">
                  {analysis.thinkingProcess.marketResearchFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valuation Methodology
                </h4>
                <p className="text-sm">{analysis.thinkingProcess.valuationMethodology}</p>

                <h4 className="font-semibold flex items-center gap-2 mt-4">
                  <Shield className="h-4 w-4" />
                  Risk Assessment
                </h4>
                <p className="text-sm">{analysis.thinkingProcess.riskAssessmentApproach}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                Recommendation Rationale
              </h4>
              <p className="text-sm">{analysis.thinkingProcess.recommendationRationale}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>Executive Summary</CardTitle>
          </div>
          <CardDescription>AI-powered comprehensive analysis and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Key Findings</AlertTitle>
            <AlertDescription>{analysis.insights.executiveSummary}</AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold">Financial Overview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{analysis.analyzedItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retail Value:</span>
                  <span className="font-medium">{formatCurrency(analysis.totalRetailValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Value:</span>
                  <span className="font-medium">{formatCurrency(analysis.totalEstimatedValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Potential Profit:</span>
                  <span className="font-medium text-green-600">{formatCurrency(analysis.totalPotentialProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected ROI:</span>
                  <span className="font-medium">{formatPercentage(analysis.summary.expectedROI)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Market Analysis</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      analysis.insights.marketAnalysis.overallMarketCondition === "Excellent"
                        ? "default"
                        : analysis.insights.marketAnalysis.overallMarketCondition === "Good"
                          ? "secondary"
                          : analysis.insights.marketAnalysis.overallMarketCondition === "Fair"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {analysis.insights.marketAnalysis.overallMarketCondition}
                  </Badge>
                  <span className="text-sm">Market Condition</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Top Categories:</strong>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.insights.marketAnalysis.topPerformingCategories.map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">AI Confidence</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Progress value={analysis.summary.confidenceScore * 100} className="flex-1" />
                  <span className="text-sm font-medium">{Math.round(analysis.summary.confidenceScore * 100)}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Analysis confidence based on data quality and market knowledge
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Processed in {(analysis.processingTime / 1000).toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="items">Item Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Projections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Investment Overview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Investment:</span>
                      <span className="font-medium">
                        {formatCurrency(analysis.insights.financialProjections.totalInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Revenue:</span>
                      <span className="font-medium">
                        {formatCurrency(analysis.insights.financialProjections.projectedRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Profit:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(analysis.insights.financialProjections.estimatedProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected ROI:</span>
                      <span className="font-medium">
                        {formatPercentage(analysis.insights.financialProjections.expectedROI)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Break-even:</span>
                      <span className="font-medium">{analysis.insights.financialProjections.breakEvenTimeframe}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Cash Flow Projection</h4>
                  <div className="space-y-2">
                    {analysis.insights.financialProjections.cashFlowProjection.slice(0, 6).map((month) => (
                      <div key={month.month} className="flex items-center gap-2 text-sm">
                        <span className="w-12">M{month.month}:</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span>Rev: {formatCurrency(month.revenue)}</span>
                            <span className="text-green-600">Profit: {formatCurrency(month.profit)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">Immediate Actions</h4>
                  <ul className="space-y-2">
                    {analysis.insights.strategicRecommendations.immediate.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Zap className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-600">Short-term (1-3 months)</h4>
                  <ul className="space-y-2">
                    {analysis.insights.strategicRecommendations.shortTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Clock className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">Long-term (3+ months)</h4>
                  <ul className="space-y-2">
                    {analysis.insights.strategicRecommendations.longTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Market Opportunities</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {analysis.insights.marketAnalysis.marketOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Analysis & Mitigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600">Major Risks</h4>
                  <ul className="space-y-2">
                    {analysis.insights.riskAnalysis.majorRisks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-600">Mitigation Strategies</h4>
                  <ul className="space-y-2">
                    {analysis.insights.riskAnalysis.mitigationStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Shield className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">Contingency Plans</h4>
                  <ul className="space-y-2">
                    {analysis.insights.riskAnalysis.contingencyPlans.map((plan, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Zap className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{plan}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Risk Distribution</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  {Object.entries(analysis.summary.riskDistribution).map(([level, count]) => (
                    <div key={level} className="text-center">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm capitalize">{level.replace(/([A-Z])/g, " $1").trim()}</div>
                      <Badge
                        variant={
                          level === "veryLow"
                            ? "default"
                            : level === "low"
                              ? "secondary"
                              : level === "medium"
                                ? "outline"
                                : level === "high"
                                  ? "destructive"
                                  : "destructive"
                        }
                        className="text-xs"
                      >
                        {level === "veryLow"
                          ? "Very Low"
                          : level === "low"
                            ? "Low"
                            : level === "medium"
                              ? "Medium"
                              : level === "high"
                                ? "High"
                                : "Very High"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                Operational Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="font-semibold">Inventory Management</h4>
                  <ul className="space-y-2">
                    {analysis.insights.operationalInsights.inventoryManagement.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <BarChart2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Logistics</h4>
                  <ul className="space-y-2">
                    {analysis.insights.operationalInsights.logisticsConsiderations.map((consideration, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Cog className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Quality Control</h4>
                  <ul className="space-y-2">
                    {analysis.insights.operationalInsights.qualityControl.map((control, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{control}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Individual Item Analysis
              </CardTitle>
              <CardDescription>Detailed AI analysis for each item with thinking process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.analysisResults.slice(0, 10).map((result, index) => (
                <Collapsible key={result.id}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.analysis.cleanedTitle.substring(0, 60)}...</span>
                        <Badge variant="outline">{result.analysis.category}</Badge>
                        <Badge
                          variant={
                            result.analysis.riskScore <= 40
                              ? "default"
                              : result.analysis.riskScore <= 70
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          Risk: {result.analysis.riskScore}
                        </Badge>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <h5 className="font-semibold">Analysis Results</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Brand:</span>
                            <span className="font-medium">{result.analysis.brand}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Market Value:</span>
                            <span className="font-medium">{formatCurrency(result.analysis.marketValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Liquidation Value:</span>
                            <span className="font-medium">{formatCurrency(result.analysis.liquidationValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Profit Potential:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(result.analysis.profitPotential)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Market Demand:</span>
                            <Badge variant="outline">{result.analysis.marketDemand}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span className="font-medium">{Math.round(result.analysis.confidence * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-semibold">Resale Strategy</h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Platforms:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.analysis.resaleStrategy.recommendedPlatform.map((platform, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Pricing:</span>
                            <p className="mt-1">{result.analysis.resaleStrategy.pricingStrategy}</p>
                          </div>
                          <div>
                            <span className="font-medium">Timing:</span>
                            <p className="mt-1">{result.analysis.resaleStrategy.timingAdvice}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedItemThinking(selectedItemThinking === result.id ? null : result.id)}
                        className="mb-3"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        {selectedItemThinking === result.id ? "Hide" : "Show"} AI Thinking Process
                      </Button>

                      {selectedItemThinking === result.id && (
                        <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                          <div>
                            <h6 className="font-medium text-sm">Initial Observation</h6>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.thinkingProcess.initialObservation}
                            </p>
                          </div>
                          <div>
                            <h6 className="font-medium text-sm">Category Analysis</h6>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.thinkingProcess.categoryAnalysis}
                            </p>
                          </div>
                          <div>
                            <h6 className="font-medium text-sm">Market Research</h6>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.thinkingProcess.marketResearch}
                            </p>
                          </div>
                          <div>
                            <h6 className="font-medium text-sm">Valuation Reasoning</h6>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.thinkingProcess.valuationReasoning}
                            </p>
                          </div>
                          <div>
                            <h6 className="font-medium text-sm">Risk Assessment</h6>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.thinkingProcess.riskAssessment}
                            </p>
                          </div>
                          <div>
                            <h6 className="font-medium text-sm">Final Conclusion</h6>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.thinkingProcess.finalConclusion}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
