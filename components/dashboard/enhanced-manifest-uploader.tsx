"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Brain, Search, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { uploadEnhancedManifest } from "@/lib/actions/enhanced-manifest-actions"
import type { EnhancedManifestResult } from "@/lib/ai/deep-research-enhanced-service"

interface UploadStage {
  id: string
  name: string
  icon: React.ReactNode
  status: "pending" | "processing" | "completed" | "error"
}

export function EnhancedManifestUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<EnhancedManifestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)

  const stages: UploadStage[] = [
    { id: "upload", name: "File Upload", icon: <Upload className="h-4 w-4" />, status: "pending" },
    { id: "parse", name: "Parsing", icon: <FileText className="h-4 w-4" />, status: "pending" },
    { id: "analyze", name: "AI Analysis", icon: <Brain className="h-4 w-4" />, status: "pending" },
    { id: "research", name: "Deep Research", icon: <Search className="h-4 w-4" />, status: "pending" },
    { id: "enhance", name: "Enhancement", icon: <TrendingUp className="h-4 w-4" />, status: "pending" },
  ]

  const [stageStatuses, setStageStatuses] = useState<UploadStage[]>(stages)

  const updateStageStatus = (stageIndex: number, status: UploadStage["status"]) => {
    setStageStatuses((prev) => prev.map((stage, index) => (index === stageIndex ? { ...stage, status } : stage)))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
      setProgress(0)
      setCurrentStage(0)
      setStageStatuses(stages)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setResult(null)
    setProgress(0)

    try {
      // Stage 1: Upload
      setCurrentStage(0)
      updateStageStatus(0, "processing")
      setProgress(10)

      const formData = new FormData()
      formData.append("file", file)

      // Stage 2: Parse
      setCurrentStage(1)
      updateStageStatus(0, "completed")
      updateStageStatus(1, "processing")
      setProgress(25)

      // Stage 3: AI Analysis
      setCurrentStage(2)
      updateStageStatus(1, "completed")
      updateStageStatus(2, "processing")
      setProgress(50)

      // Stage 4: Deep Research
      setCurrentStage(3)
      updateStageStatus(2, "completed")
      updateStageStatus(3, "processing")
      setProgress(75)

      // Stage 5: Enhancement
      setCurrentStage(4)
      updateStageStatus(3, "completed")
      updateStageStatus(4, "processing")
      setProgress(90)

      const response = await uploadEnhancedManifest(formData)

      if (response.success && response.result) {
        updateStageStatus(4, "completed")
        setProgress(100)
        setResult(response.result)
      } else {
        throw new Error(response.error || "Upload failed")
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during upload")
      updateStageStatus(currentStage, "error")
    } finally {
      setIsUploading(false)
    }
  }

  const getStageIcon = (stage: UploadStage) => {
    switch (stage.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "processing":
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      default:
        return stage.icon
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Enhanced Manifest Analyzer
          </CardTitle>
          <CardDescription>
            Upload your CSV manifest for comprehensive AI analysis with deep market research
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Processing..." : "Analyze Manifest"}
              </Button>
            </div>
          )}

          {isUploading && (
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />

              <div className="space-y-2">
                {stageStatuses.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      index === currentStage ? "bg-blue-50" : ""
                    }`}
                  >
                    {getStageIcon(stage)}
                    <span
                      className={`text-sm ${
                        stage.status === "completed"
                          ? "text-green-700"
                          : stage.status === "error"
                            ? "text-red-700"
                            : stage.status === "processing"
                              ? "text-blue-700"
                              : "text-gray-500"
                      }`}
                    >
                      {stage.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Analysis Results</CardTitle>
            <CardDescription>Comprehensive analysis with market research for {result.manifestName}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="research">Market Research</TabsTrigger>
                <TabsTrigger value="insights">Enhanced Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{result.totalItems}</div>
                    <div className="text-sm text-blue-600">Total Items</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">${result.totalRetailValue.toFixed(0)}</div>
                    <div className="text-sm text-green-600">Retail Value</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">${result.totalEstimatedValue.toFixed(0)}</div>
                    <div className="text-sm text-purple-600">Est. Value</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">{result.summary.expectedROI.toFixed(1)}%</div>
                    <div className="text-sm text-orange-600">Expected ROI</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Category Breakdown</h4>
                  {Object.entries(result.summary.categoryBreakdown).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span>{category}</span>
                      <Badge variant="outline">{count} items</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="research" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Market Trends</h4>
                  {result.deepResearch.marketTrends.map((trend, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">{trend.category}</h5>
                        <Badge
                          variant={
                            trend.trend === "Rising"
                              ? "default"
                              : trend.trend === "Stable"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {trend.trend}
                        </Badge>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {trend.insights.map((insight, i) => (
                          <li key={i}>• {insight}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Pricing Recommendations</h4>
                  {result.deepResearch.valuationInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">{insight.category}</h5>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Min: ${insight.recommendedPricing.min.toFixed(0)}</div>
                        <div>Optimal: ${insight.recommendedPricing.optimal.toFixed(0)}</div>
                        <div>Max: ${insight.recommendedPricing.max.toFixed(0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-700">Market Opportunities</h4>
                    <ul className="text-sm space-y-1">
                      {result.enhancedInsights.marketOpportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-700">Risk Mitigation</h4>
                    <ul className="text-sm space-y-1">
                      {result.enhancedInsights.riskMitigation.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Strategic Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    {result.deepResearch.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
