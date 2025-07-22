"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Brain,
  TrendingUp,
  DollarSign,
  BarChart3,
  Clock,
} from "lucide-react"
import { uploadComprehensiveManifest } from "@/lib/actions/comprehensive-manifest-actions"

export function ComprehensiveManifestUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setCurrentStep("Uploading file...")
    setError(null)
    setResult(null)

    try {
      // Simulate progress steps
      const steps = [
        { step: "Uploading file...", progress: 10 },
        { step: "Parsing CSV data...", progress: 20 },
        { step: "Validating manifest structure...", progress: 30 },
        { step: "Initializing AI analysis...", progress: 40 },
        { step: "Performing deep market research...", progress: 60 },
        { step: "Analyzing liquidation scenarios...", progress: 75 },
        { step: "Calculating risk assessments...", progress: 85 },
        { step: "Generating strategic insights...", progress: 95 },
        { step: "Finalizing comprehensive analysis...", progress: 100 },
      ]

      for (const { step, progress } of steps) {
        setCurrentStep(step)
        setUploadProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await uploadComprehensiveManifest(formData)

      if (response.success) {
        setResult(response.result)
        setCurrentStep("Analysis complete!")
      } else {
        throw new Error(response.error || "Upload failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setCurrentStep("Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const viewAnalysis = () => {
    if (result?.manifestId) {
      router.push(`/dashboard/manifests/${result.manifestId}/comprehensive`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Comprehensive AI Analysis</CardTitle>
          <CardDescription>
            Upload your manifest for deep market research, risk assessment, and strategic insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="comprehensive-file-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                  isUploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </div>
                <input
                  id="comprehensive-file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Market Research</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>Profit Analysis</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Risk Assessment</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                <Brain className="h-4 w-4 text-orange-600" />
                <span>AI Insights</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 animate-spin" />
              Processing Analysis
            </CardTitle>
            <CardDescription>Performing comprehensive market research and analysis...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{currentStep}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
              <div className="text-xs text-gray-500">
                This may take a few moments as we perform deep market research and analysis...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Card */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Upload Failed:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Card */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Analysis Complete!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your manifest has been analyzed with comprehensive market research and strategic insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${result.executiveSummary?.totalPotentialProfit?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-green-700">Potential Profit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.executiveSummary?.averageROI?.toFixed(1) || "0"}%
                  </div>
                  <div className="text-sm text-blue-700">Average ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{result.validItems || 0}</div>
                  <div className="text-sm text-purple-700">Items Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {((result.executiveSummary?.aiConfidence || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-orange-700">AI Confidence</div>
                </div>
              </div>

              {/* Market Condition */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600">Market Condition:</span>
                <Badge
                  className={`${
                    result.executiveSummary?.marketCondition === "Excellent"
                      ? "bg-green-100 text-green-800"
                      : result.executiveSummary?.marketCondition === "Good"
                        ? "bg-blue-100 text-blue-800"
                        : result.executiveSummary?.marketCondition === "Fair"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {result.executiveSummary?.marketCondition || "Unknown"}
                </Badge>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <Button onClick={viewAnalysis} className="bg-green-600 hover:bg-green-700">
                  <FileText className="h-4 w-4 mr-2" />
                  View Comprehensive Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
