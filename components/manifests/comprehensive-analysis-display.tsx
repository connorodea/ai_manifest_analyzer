"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Brain,
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  BarChart3,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Award,
  PieChart,
  LineChart,
  Activity,
  Briefcase,
  Search,
  Calendar,
  Globe,
  Layers,
  Filter,
} from "lucide-react"
import type { ComprehensiveManifestAnalysis } from "@/lib/ai/deep-research-analysis"

interface ComprehensiveAnalysisDisplayProps {
  analysis: ComprehensiveManifestAnalysis
}

export function ComprehensiveAnalysisDisplay({ analysis }: ComprehensiveAnalysisDisplayProps) {
  const [showAIThinking, setShowAIThinking] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"profit" | "roi" | "risk" | "value">("profit")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very Low":
        return "text-green-600 bg-green-50"
      case "Low":
        return "text-green-500 bg-green-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "High":
        return "text-orange-600 bg-orange-50"
      case "Very High":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Rising":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "Declining":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const sortedResults = [...analysis.researchResults].sort((a, b) => {
    switch (sortBy) {
      case "profit":
        return b.productResearch.profitAnalysis.netProfit - a.productResearch.profitAnalysis.netProfit
      case "roi":
        return b.productResearch.profitAnalysis.roi - a.productResearch.profitAnalysis.roi
      case "risk":
        return a.productResearch.riskAssessment.riskScore - b.productResearch.riskAssessment.riskScore
      case "value":
        return (
          b.productResearch.liquidationAnalysis.estimatedLiquidationValue -
          a.productResearch.liquidationAnalysis.estimatedLiquidationValue
        )
      default:
        return 0
    }
  })

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{analysis.manifestName}</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive AI Analysis • {analysis.analyzedItems} items • Processed in{" "}
              {(analysis.processingTime / 1000).toFixed(1)}s
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="bg-white">
              <Award className="h-3 w-3 mr-1" />
              Deep Research
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Expected Profit</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analysis.manifestInsights.executiveSummary.expectedProfit)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatPercentage(analysis.manifestInsights.executiveSummary.averageROI)} ROI
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Investment</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(analysis.manifestInsights.executiveSummary.totalInvestment)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Projected Revenue: {formatCurrency(analysis.manifestInsights.executiveSummary.projectedRevenue)}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(analysis.manifestInsights.executiveSummary.confidenceScore * 100)}%
            </div>
            <Progress value={analysis.manifestInsights.executiveSummary.confidenceScore * 100} className="mt-2 h-2" />
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Market Condition</span>
            </div>
            <div className="text-lg font-bold text-orange-600">
              {analysis.manifestInsights.marketIntelligence.overallMarketCondition}
            </div>
            <div className="text-xs text-gray-500 mt-1">Current market assessment</div>
          </div>
        </div>
      </div>

      {/* AI Thinking Process */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Strategic Thinking Process</CardTitle>
                <CardDescription>Transparent view into how our AI analyzed your manifest</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAIThinking(!showAIThinking)}
              className="border-blue-200 hover:bg-blue-50"
            >
              {showAIThinking ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showAIThinking ? "Hide" : "Show"} AI Thinking
            </Button>
          </div>
        </CardHeader>

        {showAIThinking && (
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <Briefcase className="h-4 w-4" />
                  <AlertTitle className="text-blue-800">Portfolio Strategy</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    {analysis.aiOverallThinking.portfolioStrategy}
                  </AlertDescription>
                </Alert>

                <Alert className="border-green-200 bg-green-50">
                  <Globe className="h-4 w-4" />
                  <AlertTitle className="text-green-800">Market Analysis</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {analysis.aiOverallThinking.marketAnalysis}
                  </AlertDescription>
                </Alert>

                <Alert className="border-orange-200 bg-orange-50">
                  <Shield className="h-4 w-4" />
                  <AlertTitle className="text-orange-800">Risk Assessment</AlertTitle>
                  <AlertDescription className="text-orange-700">
                    {analysis.aiOverallThinking.riskAssessment}
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-4">
                <Alert className="border-purple-200 bg-purple-50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle className="text-purple-800">Opportunity Identification</AlertTitle>
                  <AlertDescription className="text-purple-700">
                    {analysis.aiOverallThinking.opportunityIdentification}
                  </AlertDescription>
                </Alert>

                <Alert className="border-indigo-200 bg-indigo-50">
                  <Target className="h-4 w-4" />
                  <AlertTitle className="text-indigo-800">Recommendation Rationale</AlertTitle>
                  <AlertDescription className="text-indigo-700">
                    {analysis.aiOverallThinking.recommendationRationale}
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Key Strategic Highlights
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                {analysis.manifestInsights.executiveSummary.keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategy
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risks
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Category Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(analysis.manifestInsights.portfolioAnalysis.categoryDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / analysis.analyzedItems) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Value Distribution</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {analysis.manifestInsights.portfolioAnalysis.valueDistribution.highValue}
                      </div>
                      <div className="text-xs text-green-600">High Value</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {analysis.manifestInsights.portfolioAnalysis.valueDistribution.mediumValue}
                      </div>
                      <div className="text-xs text-yellow-600">Medium Value</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-600">
                        {analysis.manifestInsights.portfolioAnalysis.valueDistribution.lowValue}
                      </div>
                      <div className="text-xs text-gray-600">Low Value</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.portfolioAnalysis.topPerformers.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.title.substring(0, 40)}...</div>
                        <div className="text-xs text-gray-500">
                          ROI: {formatPercentage(item.roi)} • Confidence: {Math.round(item.confidence * 100)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(item.expectedProfit)}</div>
                        <div className="text-xs text-gray-500">Expected Profit</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Financial Projections */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Monthly Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.manifestInsights.financialProjections.monthlyBreakdown.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">M{month.month}</span>
                        </div>
                        <div>
                          <div className="font-medium">Month {month.month}</div>
                          <div className="text-sm text-gray-500">Sales: {formatCurrency(month.expectedSales)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(month.cumulativeProfit)}</div>
                        <div className="text-sm text-gray-500">Cumulative Profit</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Scenario Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analysis.manifestInsights.financialProjections.scenarioAnalysis).map(
                    ([scenario, data]) => (
                      <div key={scenario} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{scenario} Scenario</h4>
                          <Badge
                            variant={
                              scenario === "optimistic" ? "default" : scenario === "realistic" ? "secondary" : "outline"
                            }
                          >
                            {formatPercentage(data.roi)} ROI
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Revenue:</span>
                            <div className="font-medium">{formatCurrency(data.totalRevenue)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Profit:</span>
                            <div className="font-medium text-green-600">{formatCurrency(data.totalProfit)}</div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {/* Market Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Market Conditions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Overall Condition</span>
                      <Badge
                        variant={
                          analysis.manifestInsights.marketIntelligence.overallMarketCondition === "Excellent"
                            ? "default"
                            : analysis.manifestInsights.marketIntelligence.overallMarketCondition === "Good"
                              ? "secondary"
                              : analysis.manifestInsights.marketIntelligence.overallMarketCondition === "Fair"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {analysis.manifestInsights.marketIntelligence.overallMarketCondition}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Price Volatility:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        {analysis.manifestInsights.marketIntelligence.priceVolatility}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Competitive Landscape:</span>
                      <p className="text-sm text-gray-600 mt-1">
                        {analysis.manifestInsights.marketIntelligence.competitiveLandscape}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Trending Categories</h4>
                  <div className="space-y-2">
                    {analysis.manifestInsights.marketIntelligence.trendingCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{category}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-medium mb-3 mt-6">Seasonal Opportunities</h4>
                  <div className="space-y-2">
                    {analysis.manifestInsights.marketIntelligence.seasonalOpportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          {/* Strategic Recommendations */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Zap className="h-5 w-5" />
                  Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.strategicRecommendations.immediate.map((action, index) => (
                    <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="destructive" className="text-xs">
                          {action.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {action.effort} Effort
                        </Badge>
                      </div>
                      <div className="font-medium text-sm mb-1">{action.action}</div>
                      <div className="text-xs text-gray-600">{action.impact}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-5 w-5" />
                  Short-term (1-3 months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.strategicRecommendations.shortTerm.map((action, index) => (
                    <div key={index} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="font-medium text-sm mb-1">{action.action}</div>
                      <div className="text-xs text-gray-600 mb-2">Timeline: {action.timeline}</div>
                      <div className="text-xs text-green-600">{action.expectedBenefit}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Target className="h-5 w-5" />
                  Long-term (3+ months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.strategicRecommendations.longTerm.map((action, index) => (
                    <div key={index} className="p-3 border border-green-200 rounded-lg bg-green-50">
                      <div className="font-medium text-sm mb-1">{action.action}</div>
                      <div className="text-xs text-gray-600 mb-2">Timeline: {action.timeline}</div>
                      <div className="text-xs text-blue-600">{action.strategicValue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          {/* Risk Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Critical Risks</h4>
                <div className="space-y-3">
                  {analysis.manifestInsights.riskManagement.criticalRisks.map((risk, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{risk.risk}</h5>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              risk.impact === "Critical"
                                ? "destructive"
                                : risk.impact === "High"
                                  ? "destructive"
                                  : risk.impact === "Medium"
                                    ? "outline"
                                    : "secondary"
                            }
                          >
                            {risk.impact} Impact
                          </Badge>
                          <Badge
                            variant={
                              risk.probability === "High"
                                ? "destructive"
                                : risk.probability === "Medium"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {risk.probability} Probability
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Contingency Plans</h4>
                  <div className="space-y-2">
                    {analysis.manifestInsights.riskManagement.contingencyPlans.map((plan, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{plan}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Insurance Recommendations</h4>
                  <div className="space-y-2">
                    {analysis.manifestInsights.riskManagement.insuranceRecommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Individual Items Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Individual Item Analysis
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="profit">Sort by Profit</option>
                    <option value="roi">Sort by ROI</option>
                    <option value="risk">Sort by Risk</option>
                    <option value="value">Sort by Value</option>
                  </select>
                </div>
              </div>
              <CardDescription>
                Deep AI research and analysis for each item with transparent thinking process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedResults.slice(0, 15).map((result) => (
                  <Collapsible key={result.id}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between p-4 h-auto bg-transparent">
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex-1">
                            <div className="font-medium">
                              {result.productResearch.productIdentification.cleanedTitle}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {result.productResearch.productIdentification.brand} •
                              {result.productResearch.productIdentification.category}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                {formatCurrency(result.productResearch.profitAnalysis.netProfit)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatPercentage(result.productResearch.profitAnalysis.roi)} ROI
                              </div>
                            </div>
                            <Badge className={getRiskColor(result.productResearch.riskAssessment.overallRisk)}>
                              {result.productResearch.riskAssessment.overallRisk}
                            </Badge>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-6 pt-6">
                      {/* Item Analysis Details */}
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Product Research */}
                        <div className="space-y-4">
                          <h5 className="font-semibold flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Market Research
                          </h5>

                          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <div>
                              <span className="text-sm font-medium">Current Market Price:</span>
                              <div className="text-lg font-bold text-blue-600">
                                {formatCurrency(result.productResearch.marketResearch.currentMarketPrice.average)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {result.productResearch.marketResearch.currentMarketPrice.amazon &&
                                  `Amazon: ${formatCurrency(result.productResearch.marketResearch.currentMarketPrice.amazon)} • `}
                                {result.productResearch.marketResearch.currentMarketPrice.ebay &&
                                  `eBay: ${formatCurrency(result.productResearch.marketResearch.currentMarketPrice.ebay)}`}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Price Trend:</span>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(result.productResearch.marketResearch.historicalPricing.trend)}
                                <span className="text-sm font-medium">
                                  {result.productResearch.marketResearch.historicalPricing.trend}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Search Volume:</span>
                                <div className="font-medium">
                                  {result.productResearch.marketResearch.demandAnalysis.searchVolume}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Competition:</span>
                                <div className="font-medium">
                                  {result.productResearch.marketResearch.demandAnalysis.competitionLevel}
                                </div>
                              </div>
                            </div>

                            <div>
                              <span className="text-sm text-gray-500">Peak Demand:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.productResearch.marketResearch.demandAnalysis.peakDemandMonths.map(
                                  (month, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {month}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Liquidation Analysis */}
                        <div className="space-y-4">
                          <h5 className="font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Liquidation Analysis
                          </h5>

                          <div className="p-4 bg-green-50 rounded-lg space-y-3">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <div className="text-sm font-bold text-red-600">
                                  {formatCurrency(result.productResearch.liquidationAnalysis.conservativeValue)}
                                </div>
                                <div className="text-xs text-gray-500">Conservative</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-green-600">
                                  {formatCurrency(result.productResearch.liquidationAnalysis.estimatedLiquidationValue)}
                                </div>
                                <div className="text-xs text-gray-500">Realistic</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-blue-600">
                                  {formatCurrency(result.productResearch.liquidationAnalysis.optimisticValue)}
                                </div>
                                <div className="text-xs text-gray-500">Optimistic</div>
                              </div>
                            </div>

                            <div>
                              <span className="text-sm font-medium">Time to Sell:</span>
                              <div className="text-sm text-gray-600 mt-1">
                                Conservative: {result.productResearch.liquidationAnalysis.timeToSell.conservative} •
                                Realistic: {result.productResearch.liquidationAnalysis.timeToSell.realistic}
                              </div>
                            </div>

                            <div>
                              <span className="text-sm font-medium">Best Platforms:</span>
                              <div className="space-y-2 mt-2">
                                {result.productResearch.liquidationAnalysis.bestPlatforms
                                  .slice(0, 3)
                                  .map((platform, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                      <span>{platform.platform}</span>
                                      <div className="text-right">
                                        <div className="font-medium text-green-600">
                                          {formatCurrency(platform.netProfit)}
                                        </div>
                                        <div className="text-xs text-gray-500">{platform.timeframe}</div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Thinking Process for this item */}
                      <div className="border-t pt-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItemId(selectedItemId === result.id ? null : result.id)}
                          className="mb-4"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          {selectedItemId === result.id ? "Hide" : "Show"} AI Thinking Process
                        </Button>

                        {selectedItemId === result.id && (
                          <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-3">
                                <div>
                                  <h6 className="font-medium text-sm text-blue-800">Initial Assessment</h6>
                                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                                    <p>
                                      <strong>First Impression:</strong>{" "}
                                      {result.aiThinking.initialAssessment.firstImpression}
                                    </p>
                                    <p>
                                      <strong>Product Recognition:</strong>{" "}
                                      {result.aiThinking.initialAssessment.productRecognition}
                                    </p>
                                    <p>
                                      <strong>Category Classification:</strong>{" "}
                                      {result.aiThinking.initialAssessment.categoryClassification}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h6 className="font-medium text-sm text-blue-800">Market Research Process</h6>
                                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                                    <p>
                                      <strong>Strategy:</strong>{" "}
                                      {result.aiThinking.marketResearchProcess.researchStrategy}
                                    </p>
                                    <p>
                                      <strong>Data Sources:</strong>{" "}
                                      {result.aiThinking.marketResearchProcess.dataSourcesUsed.join(", ")}
                                    </p>
                                    <p>
                                      <strong>Price Analysis:</strong>{" "}
                                      {result.aiThinking.marketResearchProcess.priceComparisons}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h6 className="font-medium text-sm text-blue-800">Valuation Methodology</h6>
                                  <div className="text-sm text-blue-700 mt-1">
                                    <p>
                                      <strong>Approach:</strong> {result.aiThinking.valuationMethodology.approachUsed}
                                    </p>
                                    <p>
                                      <strong>Confidence:</strong>{" "}
                                      {Math.round(result.aiThinking.valuationMethodology.confidenceLevel * 100)}%
                                    </p>
                                    <p>
                                      <strong>Reasoning:</strong> {result.aiThinking.valuationMethodology.reasoning}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <h6 className="font-medium text-sm text-blue-800">Risk Evaluation</h6>
                                  <div className="text-sm text-blue-700 mt-1">
                                    <p>
                                      <strong>Key Risks:</strong>
                                    </p>
                                    <ul className="list-disc list-inside ml-2 space-y-1">
                                      {result.aiThinking.riskEvaluation.identifiedRisks.map((risk, i) => (
                                        <li key={i}>{risk}</li>
                                      ))}
                                    </ul>
                                    <p className="mt-2">
                                      <strong>Mitigation:</strong> {result.aiThinking.riskEvaluation.mitigationPlanning}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h6 className="font-medium text-sm text-blue-800">Strategic Recommendations</h6>
                                  <div className="text-sm text-blue-700 mt-1 space-y-1">
                                    <p>
                                      <strong>Pricing:</strong>{" "}
                                      {result.aiThinking.strategicRecommendations.pricingStrategy}
                                    </p>
                                    <p>
                                      <strong>Timing:</strong>{" "}
                                      {result.aiThinking.strategicRecommendations.timingStrategy}
                                    </p>
                                    <p>
                                      <strong>Platform:</strong>{" "}
                                      {result.aiThinking.strategicRecommendations.platformStrategy}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h6 className="font-medium text-sm text-blue-800">Final Conclusion</h6>
                                  <div className="text-sm text-blue-700 mt-1">
                                    <p>
                                      <strong>Confidence:</strong>{" "}
                                      {Math.round(result.aiThinking.finalConclusion.confidenceRating * 100)}%
                                    </p>
                                    <p>
                                      <strong>Recommended Action:</strong>{" "}
                                      {result.aiThinking.finalConclusion.recommendedAction}
                                    </p>
                                    <p>
                                      <strong>Expected Outcome:</strong>{" "}
                                      {result.aiThinking.finalConclusion.expectedOutcome}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-blue-200 pt-4">
                              <h6 className="font-medium text-sm text-blue-800 mb-2">Key Insights</h6>
                              <div className="grid gap-2 md:grid-cols-2">
                                {result.aiThinking.finalConclusion.keyInsights.map((insight, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm text-blue-700">
                                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span>{insight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Profit Analysis Summary */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          Profit Analysis Summary
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(result.productResearch.profitAnalysis.grossProfit)}
                            </div>
                            <div className="text-xs text-gray-500">Gross Profit</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(result.productResearch.profitAnalysis.netProfit)}
                            </div>
                            <div className="text-xs text-gray-500">Net Profit</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              {formatPercentage(result.productResearch.profitAnalysis.profitMargin)}
                            </div>
                            <div className="text-xs text-gray-500">Profit Margin</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">
                              {formatPercentage(result.productResearch.profitAnalysis.roi)}
                            </div>
                            <div className="text-xs text-gray-500">ROI</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">List Price:</span>
                              <div className="font-medium">
                                {formatCurrency(result.productResearch.profitAnalysis.recommendedPricing.listPrice)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Minimum Price:</span>
                              <div className="font-medium">
                                {formatCurrency(result.productResearch.profitAnalysis.recommendedPricing.minimumPrice)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Buy It Now:</span>
                              <div className="font-medium">
                                {formatCurrency(result.productResearch.profitAnalysis.recommendedPricing.buyItNowPrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
