"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CheckCircle, AlertCircle, Info, TrendingUp, FileText, Shield, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { ManifestValidation } from "@/lib/utils/enhanced-manifest-parser"

interface ValidationReportProps {
  validation: ManifestValidation
  dataQuality?: {
    overallScore: number
    completenessScore: number
    consistencyScore: number
    accuracyScore: number
    insights: string[]
  }
}

export function ValidationReport({ validation, dataQuality }: ValidationReportProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    errors: true,
    warnings: false,
    suggestions: false,
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-50"
    if (score >= 70) return "bg-yellow-50"
    return "bg-red-50"
  }

  return (
    <div className="space-y-6">
      {/* Data Quality Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Quality Report
          </CardTitle>
          <CardDescription>Comprehensive validation and quality analysis of your manifest data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`text-center p-4 rounded-lg ${getScoreBgColor(validation.dataQualityScore)}`}>
              <div className={`text-2xl font-bold ${getScoreColor(validation.dataQualityScore)}`}>
                {validation.dataQualityScore}%
              </div>
              <div className="text-sm text-gray-600">Overall Quality</div>
            </div>

            {dataQuality && (
              <>
                <div className={`text-center p-4 rounded-lg ${getScoreBgColor(dataQuality.completenessScore)}`}>
                  <div className={`text-2xl font-bold ${getScoreColor(dataQuality.completenessScore)}`}>
                    {dataQuality.completenessScore}%
                  </div>
                  <div className="text-sm text-gray-600">Completeness</div>
                </div>

                <div className={`text-center p-4 rounded-lg ${getScoreBgColor(dataQuality.consistencyScore)}`}>
                  <div className={`text-2xl font-bold ${getScoreColor(dataQuality.consistencyScore)}`}>
                    {dataQuality.consistencyScore}%
                  </div>
                  <div className="text-sm text-gray-600">Consistency</div>
                </div>

                <div className={`text-center p-4 rounded-lg ${getScoreBgColor(dataQuality.accuracyScore)}`}>
                  <div className={`text-2xl font-bold ${getScoreColor(dataQuality.accuracyScore)}`}>
                    {dataQuality.accuracyScore}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-700">{validation.totalItems}</div>
              <div className="text-sm text-blue-600">Total Items</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-700">{validation.validItems}</div>
              <div className="text-sm text-green-600">Valid Items</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-700">{validation.invalidItems}</div>
              <div className="text-sm text-red-600">Invalid Items</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Structure Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">{validation.fileValidation.metadata.totalLines}</div>
              <div className="text-sm text-gray-600">Total Lines</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">{validation.fileValidation.metadata.headerCount}</div>
              <div className="text-sm text-gray-600">Columns</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">{validation.fileValidation.metadata.estimatedRows}</div>
              <div className="text-sm text-gray-600">Data Rows</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">
                {validation.fileValidation.metadata.fileSize > 0
                  ? `${(validation.fileValidation.metadata.fileSize / 1024).toFixed(1)} KB`
                  : "N/A"}
              </div>
              <div className="text-sm text-gray-600">File Size</div>
            </div>
          </div>

          {validation.fileValidation.errors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>File Structure Issues:</strong>
                <ul className="mt-1 list-disc list-inside">
                  {validation.fileValidation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validation.fileValidation.warnings.length > 0 && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>File Structure Warnings:</strong>
                <ul className="mt-1 list-disc list-inside">
                  {validation.fileValidation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detailed Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-4">
              {/* Errors Section */}
              {validation.errors.length > 0 && (
                <Collapsible open={expandedSections.errors} onOpenChange={() => toggleSection("errors")}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-700">Errors ({validation.errors.length})</span>
                    </div>
                    {expandedSections.errors ? (
                      <ChevronDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-red-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {validation.errors.map((error, index) => (
                      <div key={index} className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-red-800">
                              {error.field && `${error.field}: `}
                              {error.message}
                            </div>
                            {error.rowIndex && <div className="text-sm text-red-600 mt-1">Row {error.rowIndex}</div>}
                            {error.suggestion && (
                              <div className="text-sm text-red-700 mt-2 italic">💡 {error.suggestion}</div>
                            )}
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {error.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Warnings Section */}
              {validation.warnings.length > 0 && (
                <Collapsible open={expandedSections.warnings} onOpenChange={() => toggleSection("warnings")}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold text-yellow-700">Warnings ({validation.warnings.length})</span>
                    </div>
                    {expandedSections.warnings ? (
                      <ChevronDown className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-yellow-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {validation.warnings.map((warning, index) => (
                      <div key={index} className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-yellow-800">
                              {warning.field && `${warning.field}: `}
                              {warning.message}
                            </div>
                            {warning.rowIndex && (
                              <div className="text-sm text-yellow-600 mt-1">Row {warning.rowIndex}</div>
                            )}
                            {warning.suggestion && (
                              <div className="text-sm text-yellow-700 mt-2 italic">💡 {warning.suggestion}</div>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {warning.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {validation.errors.length === 0 && validation.warnings.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-700">No Issues Found!</h3>
                  <p className="text-green-600">Your data passed all validation checks.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {dataQuality?.insights && dataQuality.insights.length > 0 ? (
                <div className="space-y-3">
                  {dataQuality.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-800">{insight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No quality insights available</div>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {validation.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {validation.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-green-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No suggestions available</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
