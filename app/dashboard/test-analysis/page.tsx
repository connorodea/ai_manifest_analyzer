import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedManifestUploader } from "@/components/dashboard/enhanced-manifest-uploader"
import { TestDataGenerator } from "@/components/testing/test-data-generator"
import { AnalysisTestResults } from "@/components/testing/analysis-test-results"
import { Brain, TestTube, Upload, FileSpreadsheet } from "lucide-react"

export default function TestAnalysisPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TestTube className="h-8 w-8" />
            Test AI Analysis
          </h1>
          <p className="text-muted-foreground">
            Test the comprehensive AI analysis features with sample data or upload your own CSV manifest
          </p>
        </div>
      </div>

      {/* Testing Options */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Real CSV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Your CSV Manifest
            </CardTitle>
            <CardDescription>
              Upload a real CSV manifest file to test the comprehensive AI analysis with your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedManifestUploader />
          </CardContent>
        </Card>

        {/* Generate Test Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Generate Test Data
            </CardTitle>
            <CardDescription>
              Generate sample manifest data to test the AI analysis features with realistic examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestDataGenerator />
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Recent Analysis Results
          </CardTitle>
          <CardDescription>
            View and compare recent analysis results to understand the AI's capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading analysis results...</div>}>
            <AnalysisTestResults />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
