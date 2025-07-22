"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestDataGenerator } from "@/components/testing/test-data-generator"
import { AnalysisTestResults } from "@/components/testing/analysis-test-results"
import { Brain, Upload, BarChart3, FileText } from "lucide-react"

export default function TestAnalysisPage() {
  const [activeTab, setActiveTab] = useState("generator")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Analysis Testing</h1>
          <p className="text-muted-foreground">
            Test the enhanced AI analysis features with sample data or real CSV files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Test Data
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload CSV
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Data Generator</CardTitle>
              <CardDescription>Generate realistic manifest data to test the AI analysis capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <TestDataGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV Manifest</CardTitle>
              <CardDescription>Upload your own CSV manifest file to test the enhanced AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Upload CSV File</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your CSV manifest file or click to browse
                </p>
                <Button asChild>
                  <a href="/dashboard/manifests">Go to Manifest Upload</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <AnalysisTestResults />
        </TabsContent>
      </Tabs>
    </div>
  )
}
