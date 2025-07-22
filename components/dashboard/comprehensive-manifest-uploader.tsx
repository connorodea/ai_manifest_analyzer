"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Search,
  BarChart3,
  Target,
  TrendingUp,
  Award,
  Clock,
  Eye,
} from "lucide-react"
import { uploadComprehensiveManifest } from "@/lib/actions/comprehensive-manifest-actions"
import type { ComprehensiveManifestAnalysis } from "@/lib/ai/deep-research-analysis"

export function ComprehensiveManifestUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ComprehensiveManifestAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<string>("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
    }
  }

  const simulateProgress = () => {
    const steps = [
      { step: "Parsing CSV file...", progress: 10 },
      { step: "Validating data structure...", progress: 20 },
      { step: "Generating market context...", progress: 30 },
      { step: "Performing deep product research...", progress: 50 },
      { step: "Analyzing market trends...", progress: 70 },
      { step: "Generating AI insights...", progress: 85 },
      { step: "Finalizing comprehensive analysis...", progress: 95 },
      { step: "Analysis complete!", progress: 100 },
    ]

    let currentStepIndex = 0
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex].step)
        setProgress(steps[currentStepIndex].progress)
        currentStepIndex++
      } else {
        clearInterval(interval)
      }
    }, 2000)

    return interval
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress(0)
    setCurrentStep("Starting comprehensive analysis...")

    const progressInterval = simulateProgress()

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await uploadComprehensiveManifest(formData)

      clearInterval(progressInterval)

      if (response.success && response.result) {
        setResult(response.result)
        setProgress(100)
        setCurrentStep("Analysis complete!")
      } else {
        setError(response.error || "Upload failed")
        setProgress(0)
        setCurrentStep("")
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setProgress(0)
      setCurrentStep("")
    } finally {
      setUploading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Comprehensive AI Analysis</CardTitle>
              <CardDescription>
                Upload your manifest for deep research, market analysis, and strategic insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <Search className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium text-sm">Deep Research</div>
                <div className="text-xs text-gray-500">Market & pricing analysis</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium text-sm">AI Thinking</div>
                <div className="text-xs text-gray-500">Transparent reasoning</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium text-sm">ROI Analysis</div>
                <div className="text-xs text-gray-500">Profit projections</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
              <Target className="h-5 w-5 text-orange-500" />
              <div>
                <div className="font-medium text-sm">Strategy</div>
                <div className="text-xs text-gray-500">Actionable recommendations</div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="comprehensive-file-upload"
              />
              <label
                htmlFor="comprehensive-file-upload"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                Choose CSV File
              </label>
              {file && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                </div>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Comprehensive Analysis
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentStep}</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Brain className="h-4 w-4 animate-pulse" />
                <span>AI is performing deep analysis on your manifest...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-green-800">Analysis Complete!</CardTitle>
                  <CardDescription className="text-green-700">
                    Comprehensive AI analysis with deep research insights
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-white">
                <Clock className="h-3 w-3 mr-1" />
                {(result.processingTime / 1000).toFixed(1)}s
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Expected Profit</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(result.manifestInsights.executiveSummary.expectedProfit)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.manifestInsights.executiveSummary.averageROI.toFixed(1)}% ROI
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Investment</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.manifestInsights.executiveSummary.totalInvestment)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{result.analyzedItems} items analyzed</div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">AI Confidence</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(result.manifestInsights.executiveSummary.confidenceScore * 100)}%
                </div>
                <Progress value={result.manifestInsights.executiveSummary.confidenceScore * 100} className="mt-2 h-2" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Market Condition</span>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  {result.manifestInsights.marketIntelligence.overallMarketCondition}
                </div>
                <div className="text-xs text-gray-500 mt-1">Current assessment</div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Key Strategic Highlights
              </h4>
              <div className="grid gap-2 md:grid-cols-2">
                {result.manifestInsights.executiveSummary.keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <a href={`/dashboard/manifests/${result.manifestId}/comprehensive`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Complete Analysis
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
