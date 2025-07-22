"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share } from "lucide-react"
import Link from "next/link"
import { ComprehensiveAnalysisDisplay } from "@/components/manifests/comprehensive-analysis-display"
import { getComprehensiveManifestById } from "@/lib/actions/comprehensive-manifest-actions"
import type { ComprehensiveAnalysisResult } from "@/lib/ai/deep-research-analysis"

export default function ComprehensiveAnalysisPage() {
  const params = useParams()
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const id = params.id as string
        const result = await getComprehensiveManifestById(id)
        setAnalysis(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analysis")
      } finally {
        setLoading(false)
      }
    }

    loadAnalysis()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading comprehensive analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Analysis</CardTitle>
            <CardDescription className="text-red-700">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/manifests">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Manifests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Not Found</CardTitle>
            <CardDescription>The requested analysis could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/manifests">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Manifests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/manifests">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Comprehensive Analysis</h1>
            <p className="text-gray-600">
              {analysis.fileName} • Analyzed {new Date(analysis.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analysis Display */}
      <ComprehensiveAnalysisDisplay analysis={analysis} />
    </div>
  )
}
