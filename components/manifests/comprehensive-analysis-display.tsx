"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Brain,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Target,
  BarChart3,
  Clock,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Shield,
  Zap,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type { ComprehensiveAnalysisResult } from "@/lib/ai/deep-research-analysis"

interface ComprehensiveAnalysisDisplayProps {
  analysis: ComprehensiveAnalysisResult
}

export function ComprehensiveAnalysisDisplay({ analysis }: ComprehensiveAnalysisDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "BUY":
      case "Strong Buy":
        return "bg-green-100 text-green-800 border-green-200"
      case "BORDERLINE":
      case "Hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "PASS":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Executive Dashboard */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                Comprehensive Analysis Results
              </CardTitle>
              <CardDescription className="text-lg">AI-powered deep research and strategic insights</CardDescription>
            </div>
            <div className="text-right">
              <Badge
                className={`text-lg px-4 py-2 ${getVerdictColor(analysis.manifestInsights.executiveSummary.recommendedAction)}`}
              >
                {analysis.manifestInsights.executiveSummary.recommendedAction}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">
                Processed in {(analysis.processingTime / 1000).toFixed(1)}s
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">Expected Profit</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analysis.manifestInsights.executiveSummary.expectedProfit)}
              </div>
              <div className="text-sm text-gray-500">
                {formatPercentage(analysis.manifestInsights.executiveSummary.averageROI)} ROI
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">Investment</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analysis.manifestInsights.executiveSummary.totalInvestment)}
              </div>
              <div className="text-sm text-gray-500">{analysis.validItems} items</div>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-700">AI Confidence</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(analysis.manifestInsights.executiveSummary.confidenceScore * 100)}%
              </div>
              <Progress value={analysis.manifestInsights.executiveSummary.confidenceScore * 100} className="mt-2 h-2" />
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-gray-700">Market Condition</span>
              </div>
              <div className="text-lg font-bold text-orange-600">
                {analysis.manifestInsights.marketIntelligence.overallMarketCondition}
              </div>
              <div className="text-sm text-gray-500">Current assessment</div>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="mt-6 bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Strategic Highlights
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
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="thinking" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="thinking" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            AI Thinking
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Market
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            Strategy
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Risks
          </TabsTrigger>
        </TabsList>

        {/* AI Thinking Process Tab */}
        <TabsContent value="thinking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Thinking Process
              </CardTitle>
              <CardDescription>Complete transparency into how the AI analyzed your manifest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Initial Assessment */}
              <Collapsible open={expandedSections.initial} onOpenChange={() => toggleSection("initial")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Initial Assessment</span>
                    </div>
                    {expandedSections.initial ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>First Impressions:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.initialAssessment.firstImpressions}
                      </p>
                    </div>
                    <div>
                      <strong>Category Distribution:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.initialAssessment.categoryDistribution}
                      </p>
                    </div>
                    <div>
                      <strong>Brand Recognition:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.initialAssessment.brandRecognition}
                      </p>
                    </div>
                    <div>
                      <strong>Price Point Analysis:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.initialAssessment.pricePointAnalysis}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Market Research Process */}
              <Collapsible open={expandedSections.research} onOpenChange={() => toggleSection("research")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Market Research Process</span>
                    </div>
                    {expandedSections.research ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Research Strategy:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.marketResearchProcess.researchStrategy}
                      </p>
                    </div>
                    <div>
                      <strong>Data Sources Used:</strong>
                      <ul className="text-gray-600 mt-1 list-disc list-inside">
                        {analysis.manifestInsights.aiThinkingProcess.marketResearchProcess.dataSourcesUsed.map(
                          (source, index) => (
                            <li key={index}>{source}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <strong>Competitive Analysis:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.marketResearchProcess.competitiveAnalysis}
                      </p>
                    </div>
                    <div>
                      <strong>Demand Assessment:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.marketResearchProcess.demandAssessment}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Valuation Methodology */}
              <Collapsible open={expandedSections.valuation} onOpenChange={() => toggleSection("valuation")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Valuation Methodology</span>
                    </div>
                    {expandedSections.valuation ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Approach Used:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.valuationMethodology.approachUsed}
                      </p>
                    </div>
                    <div>
                      <strong>Factors Considered:</strong>
                      <ul className="text-gray-600 mt-1 list-disc list-inside">
                        {analysis.manifestInsights.aiThinkingProcess.valuationMethodology.factorsConsidered.map(
                          (factor, index) => (
                            <li key={index}>{factor}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <strong>Adjustments Applied:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.valuationMethodology.adjustmentsApplied}
                      </p>
                    </div>
                    <div>
                      <strong>Confidence Rationale:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.valuationMethodology.confidenceRationale}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Risk Evaluation */}
              <Collapsible open={expandedSections.riskEval} onOpenChange={() => toggleSection("riskEval")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Risk Evaluation</span>
                    </div>
                    {expandedSections.riskEval ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Identified Risks:</strong>
                      <ul className="text-gray-600 mt-1 list-disc list-inside">
                        {analysis.manifestInsights.aiThinkingProcess.riskEvaluation.identifiedRisks.map(
                          (risk, index) => (
                            <li key={index}>{risk}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <strong>Risk Weighting:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.riskEvaluation.riskWeighting}
                      </p>
                    </div>
                    <div>
                      <strong>Mitigation Strategies:</strong>
                      <ul className="text-gray-600 mt-1 list-disc list-inside">
                        {analysis.manifestInsights.aiThinkingProcess.riskEvaluation.mitigationStrategies.map(
                          (strategy, index) => (
                            <li key={index}>{strategy}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Strategic Recommendations */}
              <Collapsible open={expandedSections.stratRec} onOpenChange={() => toggleSection("stratRec")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Strategic Recommendations</span>
                    </div>
                    {expandedSections.stratRec ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Pricing Strategy:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.strategicRecommendations.pricingStrategy}
                      </p>
                    </div>
                    <div>
                      <strong>Timing Considerations:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.strategicRecommendations.timingConsiderations}
                      </p>
                    </div>
                    <div>
                      <strong>Channel Recommendations:</strong>
                      <ul className="text-gray-600 mt-1 list-disc list-inside">
                        {analysis.manifestInsights.aiThinkingProcess.strategicRecommendations.channelRecommendations.map(
                          (channel, index) => (
                            <li key={index}>{channel}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <strong>Marketing Approach:</strong>
                      <p className="text-gray-600 mt-1">
                        {analysis.manifestInsights.aiThinkingProcess.strategicRecommendations.marketingApproach}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Final Conclusion */}
              <Collapsible open={expandedSections.conclusion} onOpenChange={() => toggleSection("conclusion")}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Final Conclusion</span>
                    </div>
                    {expandedSections.conclusion ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Key Insights:</strong>
                      <ul className="text-gray-600 mt-1 list-disc list-inside">
                        {analysis.manifestInsights.aiThinkingProcess.finalConclusion.keyInsights.map(
                          (insight, index) => (
                            <li key={index}>{insight}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <strong>Confidence Rating:</strong>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          value={analysis.manifestInsights.aiThinkingProcess.finalConclusion.confidenceRating * 100}
                          className="flex-1 h-2"
                        />
                        <span className="text-gray-600 text-xs">
                          {Math.round(
                            analysis.manifestInsights.aiThinkingProcess.finalConclusion.confidenceRating * 100,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <strong>Recommended Actions:</strong>
                      <ul className="text-gray-600 mt-1 list-disc list-inside">
                        {analysis.manifestInsights.aiThinkingProcess.finalConclusion.recommendedActions.map(
                          (action, index) => (
                            <li key={index}>{action}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Portfolio Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.valuationAgentResults.brand_market_comps.slice(0, 8).map((brand: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{brand.brand}</span>
                        <div className="text-sm text-gray-500">{brand.unit_count} units</div>
                      </div>
                      <Badge variant="outline">{formatPercentage(brand.resale_pct_msrp_est)} resale</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.marketIntelligence.trendingCategories.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{trend.category}</span>
                        <div className="text-sm text-gray-500">Confidence: {formatPercentage(trend.confidence)}</div>
                      </div>
                      <Badge
                        variant={
                          trend.trend === "Rising" ? "default" : trend.trend === "Stable" ? "secondary" : "destructive"
                        }
                      >
                        {trend.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Conservative</span>
                      <Badge className="bg-green-100 text-green-800">
                        {formatPercentage(
                          analysis.manifestInsights.financialProjections.scenarioAnalysis.conservative.roi,
                        )}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        analysis.manifestInsights.financialProjections.scenarioAnalysis.conservative.profit,
                      )}
                    </div>
                    <div className="text-sm text-green-700">
                      {analysis.manifestInsights.financialProjections.scenarioAnalysis.conservative.timeline}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800">Realistic</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {formatPercentage(
                          analysis.manifestInsights.financialProjections.scenarioAnalysis.realistic.roi,
                        )}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(analysis.manifestInsights.financialProjections.scenarioAnalysis.realistic.profit)}
                    </div>
                    <div className="text-sm text-blue-700">
                      {analysis.manifestInsights.financialProjections.scenarioAnalysis.realistic.timeline}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-purple-800">Optimistic</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {formatPercentage(
                          analysis.manifestInsights.financialProjections.scenarioAnalysis.optimistic.roi,
                        )}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(
                        analysis.manifestInsights.financialProjections.scenarioAnalysis.optimistic.profit,
                      )}
                    </div>
                    <div className="text-sm text-purple-700">
                      {analysis.manifestInsights.financialProjections.scenarioAnalysis.optimistic.timeline}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Break-Even Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-800">
                      {formatCurrency(analysis.manifestInsights.financialProjections.breakEvenAnalysis.breakEvenPoint)}
                    </div>
                    <div className="text-sm text-gray-600">Break-Even Point</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {analysis.manifestInsights.financialProjections.breakEvenAnalysis.timeToBreakEven}
                      </div>
                      <div className="text-sm text-gray-600">Time to Break-Even</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        {formatPercentage(
                          analysis.manifestInsights.financialProjections.breakEvenAnalysis.marginOfSafety,
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Margin of Safety</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Projections */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {analysis.manifestInsights.financialProjections.monthlyProjections.slice(0, 6).map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Month {month.month}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Sales: {formatCurrency(month.projectedSales)}</span>
                      <span>Profit: {formatCurrency(month.cumulativeProfit)}</span>
                      <span>Inventory: {month.inventoryRemaining}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Condition</span>
                    <Badge
                      className={getVerdictColor(analysis.manifestInsights.marketIntelligence.overallMarketCondition)}
                    >
                      {analysis.manifestInsights.marketIntelligence.overallMarketCondition}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Price Volatility</span>
                    <Badge
                      variant={
                        analysis.manifestInsights.marketIntelligence.priceVolatility === "Low"
                          ? "default"
                          : analysis.manifestInsights.marketIntelligence.priceVolatility === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {analysis.manifestInsights.marketIntelligence.priceVolatility}
                    </Badge>
                  </div>

                  <div>
                    <span className="font-medium">Competitive Landscape</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {analysis.manifestInsights.marketIntelligence.competitiveLandscape}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.manifestInsights.marketIntelligence.seasonalFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Strategy Tab */}
        <TabsContent value="strategy" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-500" />
                  Immediate Actions (0-30 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.strategicRecommendations.immediate.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div
                        className={`p-1 rounded ${
                          action.priority === "Critical"
                            ? "bg-red-100"
                            : action.priority === "High"
                              ? "bg-orange-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        <AlertCircle
                          className={`h-4 w-4 ${
                            action.priority === "Critical"
                              ? "text-red-600"
                              : action.priority === "High"
                                ? "text-orange-600"
                                : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{action.action}</span>
                          <Badge variant="outline" className="text-xs">
                            {action.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{action.timeline}</div>
                        <div className="text-sm text-gray-500">{action.expectedImpact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Short-Term Actions (1-6 months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.strategicRecommendations.shortTerm.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div
                        className={`p-1 rounded ${
                          action.priority === "High"
                            ? "bg-blue-100"
                            : action.priority === "Medium"
                              ? "bg-green-100"
                              : "bg-gray-100"
                        }`}
                      >
                        <CheckCircle
                          className={`h-4 w-4 ${
                            action.priority === "High"
                              ? "text-blue-600"
                              : action.priority === "Medium"
                                ? "text-green-600"
                                : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{action.action}</span>
                          <Badge variant="outline" className="text-xs">
                            {action.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{action.timeline}</div>
                        <div className="text-sm text-gray-500">{action.expectedImpact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Long-Term Actions (6+ months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.strategicRecommendations.longTerm.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div
                        className={`p-1 rounded ${
                          action.priority === "High"
                            ? "bg-green-100"
                            : action.priority === "Medium"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                        }`}
                      >
                        <TrendingUp
                          className={`h-4 w-4 ${
                            action.priority === "High"
                              ? "text-green-600"
                              : action.priority === "Medium"
                                ? "text-blue-600"
                                : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{action.action}</span>
                          <Badge variant="outline" className="text-xs">
                            {action.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{action.timeline}</div>
                        <div className="text-sm text-gray-500">{action.expectedImpact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.manifestInsights.riskAssessment.criticalRisks.map((risk, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-red-800">{risk.risk}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getRiskColor(risk.impact)} bg-white`}>
                            Impact: {risk.impact}
                          </Badge>
                          <Badge className={`text-xs ${getRiskColor(risk.probability)} bg-white`}>
                            Probability: {risk.probability}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-red-700">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-500" />
                    Operational Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.manifestInsights.riskAssessment.operationalRisks.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{risk.risk}</span>
                          <Badge variant="outline" className={`text-xs ${getRiskColor(risk.impact)}`}>
                            {risk.impact}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">{risk.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Market Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.manifestInsights.riskAssessment.marketRisks.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{risk.risk}</span>
                          <Badge variant="outline" className={`text-xs ${getRiskColor(risk.impact)}`}>
                            {risk.impact}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">{risk.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
