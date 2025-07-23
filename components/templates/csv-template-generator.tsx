"use client"

import { useState } from "react"
import { Download, FileText, Copy, Check, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  generateCSVContent,
  generateTemplateDocumentation,
  getTemplatesByCategory,
  type CSVTemplate,
  type TemplateType,
} from "@/lib/utils/csv-template-generator"

export default function CSVTemplateGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<CSVTemplate | null>(null)
  const [templateType, setTemplateType] = useState<TemplateType>("with-examples")
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const templatesByCategory = getTemplatesByCategory()

  const handleDownloadCSV = (template: CSVTemplate, type: TemplateType) => {
    const csvContent = generateCSVContent(template, type)
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.id}-${type}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadDocumentation = (template: CSVTemplate) => {
    const documentation = generateTemplateDocumentation(template)
    const blob = new Blob([documentation], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.id}-documentation.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyContent = async (content: string, key: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (error) {
      console.error("Failed to copy content:", error)
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CSV Template Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate properly formatted CSV templates for different manifest types
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Choose from industry-specific templates below. Each template includes field descriptions, validation rules,
          and example data to ensure your manifests are properly formatted.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Template Categories</CardTitle>
              <CardDescription>Browse templates by industry type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(templatesByCategory).map(([category, templates]) => (
                <Collapsible
                  key={category}
                  open={expandedCategories[category]}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                      <div className="text-left">
                        <div className="font-medium">{category}</div>
                        <div className="text-sm text-muted-foreground">
                          {templates.length} template{templates.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <Badge variant="secondary">{templates.length}</Badge>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2 ml-4">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate?.id === template.id ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div>
                          <div className="font-medium text-sm">{template.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {template.fields.length} fields
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.fields.filter((f) => f.required).length} required
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Template Details */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </div>
                  <Badge>{selectedTemplate.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="preview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="fields">Field Guide</TabsTrigger>
                    <TabsTrigger value="download">Download</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          variant={templateType === "with-examples" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTemplateType("with-examples")}
                        >
                          With Examples
                        </Button>
                        <Button
                          variant={templateType === "headers-only" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTemplateType("headers-only")}
                        >
                          Headers Only
                        </Button>
                        <Button
                          variant={templateType === "with-empty-rows" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTemplateType("with-empty-rows")}
                        >
                          With Empty Rows
                        </Button>
                      </div>

                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                          {generateCSVContent(selectedTemplate, templateType)}
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 bg-transparent"
                          onClick={() =>
                            handleCopyContent(
                              generateCSVContent(selectedTemplate, templateType),
                              `csv-${selectedTemplate.id}-${templateType}`,
                            )
                          }
                        >
                          {copiedStates[`csv-${selectedTemplate.id}-${templateType}`] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fields" className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedTemplate.fields.length}</div>
                          <div className="text-muted-foreground">Total Fields</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedTemplate.fields.filter((f) => f.required).length}
                          </div>
                          <div className="text-muted-foreground">Required</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedTemplate.fields.filter((f) => !f.required).length}
                          </div>
                          <div className="text-muted-foreground">Optional</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-red-600 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Required Fields
                        </h4>
                        {selectedTemplate.fields
                          .filter((f) => f.required)
                          .map((field) => (
                            <div key={field.name} className="border rounded-lg p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">{field.name}</h5>
                                <div className="flex gap-2">
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {field.dataType}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{field.description}</p>
                              {field.example && (
                                <div className="text-sm">
                                  <span className="font-medium">Example: </span>
                                  <code className="bg-muted px-1 rounded">{field.example}</code>
                                </div>
                              )}
                              {field.validation && (
                                <div className="text-sm text-blue-600">
                                  <span className="font-medium">Validation: </span>
                                  {field.validation}
                                </div>
                              )}
                              {field.enumValues && (
                                <div className="text-sm">
                                  <span className="font-medium">Valid Values: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {field.enumValues.map((value) => (
                                      <Badge key={value} variant="outline" className="text-xs">
                                        {value}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                        <h4 className="font-semibold text-green-600 flex items-center gap-2 mt-6">
                          <Info className="h-4 w-4" />
                          Optional Fields
                        </h4>
                        {selectedTemplate.fields
                          .filter((f) => !f.required)
                          .map((field) => (
                            <div key={field.name} className="border rounded-lg p-3 space-y-2 opacity-75">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">{field.name}</h5>
                                <div className="flex gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Optional
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {field.dataType}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{field.description}</p>
                              {field.example && (
                                <div className="text-sm">
                                  <span className="font-medium">Example: </span>
                                  <code className="bg-muted px-1 rounded">{field.example}</code>
                                </div>
                              )}
                              {field.enumValues && (
                                <div className="text-sm">
                                  <span className="font-medium">Valid Values: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {field.enumValues.map((value) => (
                                      <Badge key={value} variant="outline" className="text-xs">
                                        {value}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="download" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">CSV Templates</h4>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">Template with Examples</div>
                              <div className="text-sm text-muted-foreground">
                                Includes sample data to show proper formatting
                              </div>
                            </div>
                            <Button onClick={() => handleDownloadCSV(selectedTemplate, "with-examples")} size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">Headers Only</div>
                              <div className="text-sm text-muted-foreground">
                                Just the column headers, ready for your data
                              </div>
                            </div>
                            <Button onClick={() => handleDownloadCSV(selectedTemplate, "headers-only")} size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">With Empty Rows</div>
                              <div className="text-sm text-muted-foreground">
                                Headers plus 5 empty rows for immediate data entry
                              </div>
                            </div>
                            <Button onClick={() => handleDownloadCSV(selectedTemplate, "with-empty-rows")} size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Documentation</h4>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Field Guide & Validation Rules</div>
                            <div className="text-sm text-muted-foreground">
                              Complete documentation with examples and validation requirements
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDownloadDocumentation(selectedTemplate)}
                            size="sm"
                            variant="outline"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">Select a Template</h3>
                  <p className="text-muted-foreground">
                    Choose a template from the categories on the left to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
