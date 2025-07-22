"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComprehensiveManifestUploader } from "@/components/dashboard/comprehensive-manifest-uploader"
import { Brain, TrendingUp, Shield, DollarSign } from "lucide-react"

export default function ComprehensiveAnalysisPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comprehensive AI Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get deep market research, risk assessment, and strategic insights powered by advanced AI analysis
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-900">Deep Market Research</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-blue-700">
              Real-time pricing across Amazon, eBay, Walmart with demand analysis and trend detection
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg text-green-900">Profit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-green-700">
              Detailed ROI calculations, break-even analysis, and multiple liquidation scenarios
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg text-purple-900">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-purple-700">
              Comprehensive risk scoring with specific mitigation strategies and confidence levels
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Brain className="h-5 w-5 text-orange-600" />
            </div>
            <CardTitle className="text-lg text-orange-900">AI Transparency</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-orange-700">
              Complete visibility into AI thinking process and decision-making methodology
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <ComprehensiveManifestUploader />

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Comprehensive Analysis Works</CardTitle>
          <CardDescription>Our advanced AI system performs institutional-quality analysis in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold">Product Identification</h3>
              <p className="text-sm text-gray-600">
                AI cleans titles, identifies brands, detects UPCs, and categorizes products with high precision
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold">Market Research</h3>
              <p className="text-sm text-gray-600">
                Real-time pricing data, demand analysis, trend detection, and seasonal opportunity identification
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold">Strategic Insights</h3>
              <p className="text-sm text-gray-600">
                Comprehensive risk assessment, profit analysis, and actionable recommendations with priority levels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
