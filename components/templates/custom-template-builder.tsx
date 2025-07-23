"use client"

import { useState, useCallback } from "react"
import { Plus, Trash2, Copy, Save, Download, FileText, Settings, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  type CustomTemplate,
  type CustomField,
  type FieldType,
  FIELD_TYPE_OPTIONS,
  TEMPLATE_CATEGORIES,
  generateCustomTemplateCSV,
  generateCustomTemplateDocumentation,
  validateCustomTemplate,
  createFieldFromPreset,
} from "@/lib/utils/custom-template-builder"

const FIELD_PRESETS = [
  { id: "product-name", label: "Product Name", icon: "📦" },
  { id: "brand", label: "Brand", icon: "🏷️" },
  { id: "condition", label: "Condition", icon: "⭐" },
  { id: "quantity", label: "Quantity", icon: "🔢" },
  { id: "price", label: "Price", icon: "💰" },
  { id: "category", label: "Category", icon: "📂" },
  { id: "sku", label: "SKU", icon: "🏷️" },
  { id: "date", label: "Date", icon: "📅" },
]

export default function CustomTemplateBuilder() {
  const [template, setTemplate] = useState<Partial<CustomTemplate>>({
    name: "",
    description: "",
    category: "",
    fields: [],
    tags: [],
    isPublic: false,
  })

  const [previewMode, setPreviewMode] = useState<"form" | "csv" | "documentation">("form")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const validateTemplate = useCallback(() => {
    const result = validateCustomTemplate(template)
    setValidationErrors(result.errors)
    return result.isValid
  }, [template])

  const addField = (preset?: string) => {
    const newField: CustomField = preset
      ? createFieldFromPreset(preset)
      : {
          id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: "",
          description: "",
          type: "text",
          required: false,
          options: [],
          validation: {},
          defaultValue: "",
          placeholder: "",
          helpText: "",
        }

    setTemplate((prev) => ({
      ...prev,
      fields: [...(prev.fields || []), newField],
    }))

    // Expand the new field
    setExpandedFields((prev) => ({
      ...prev,
      [newField.id]: true,
    }))
  }

  const updateField = (fieldId: string, updates: Partial<CustomField>) => {
    setTemplate((prev) => ({
      ...prev,
      fields: prev.fields?.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)) || [],
    }))
  }

  const removeField = (fieldId: string) => {
    setTemplate((prev) => ({
      ...prev,
      fields: prev.fields?.filter((field) => field.id !== fieldId) || [],
    }))
  }

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = template.fields?.find((f) => f.id === fieldId)
    if (fieldToDuplicate) {
      const duplicatedField: CustomField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${fieldToDuplicate.name} (Copy)`,
      }
      setTemplate((prev) => ({
        ...prev,
        fields: [...(prev.fields || []), duplicatedField],
      }))
    }
  }

  const moveField = (fieldId: string, direction: "up" | "down") => {
    setTemplate((prev) => {
      const fields = [...(prev.fields || [])]
      const index = fields.findIndex((f) => f.id === fieldId)
      if (index === -1) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= fields.length) return prev
      ;[fields[index], fields[newIndex]] = [fields[newIndex], fields[index]]
      return { ...prev, fields }
    })
  }

  const toggleFieldExpansion = (fieldId: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const handleSaveTemplate = () => {
    if (validateTemplate()) {
      // In a real app, this would save to a database
      console.log("Saving template:", template)
      alert("Template saved successfully!")
    }
  }

  const handleDownloadCSV = (includeExamples = false) => {
    if (!template.name || !template.fields?.length) {
      alert("Please add a template name and at least one field")
      return
    }

    const csvContent = generateCustomTemplateCSV(template as CustomTemplate, includeExamples)
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.name?.replace(/\s+/g, "_")}_template.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadDocumentation = () => {
    if (!template.name || !template.fields?.length) {
      alert("Please add a template name and at least one field")
      return
    }

    const documentation = generateCustomTemplateDocumentation(template as CustomTemplate)
    const blob = new Blob([documentation], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.name?.replace(/\s+/g, "_")}_documentation.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const addTag = (tag: string) => {
    if (tag && !template.tags?.includes(tag)) {
      setTemplate((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTemplate((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Template Builder</h1>
          <p className="text-muted-foreground mt-2">Create custom CSV templates tailored to your specific needs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
            <Settings className="h-4 w-4 mr-2" />
            {showAdvancedOptions ? "Hide" : "Show"} Advanced
          </Button>
          <Button onClick={handleSaveTemplate} disabled={!template.name || !template.fields?.length}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Please fix the following errors:</div>
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm">
                  • {error}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
              <CardDescription>Basic information about your custom template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name *</Label>
                  <Input
                    id="template-name"
                    placeholder="Enter template name"
                    value={template.name || ""}
                    onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-category">Category *</Label>
                  <Select
                    value={template.category || ""}
                    onValueChange={(value) => setTemplate((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Describe what this template is used for"
                  value={template.description || ""}
                  onChange={(e) => setTemplate((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {showAdvancedOptions && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-template"
                      checked={template.isPublic || false}
                      onCheckedChange={(checked) => setTemplate((prev) => ({ ...prev, isPublic: checked }))}
                    />
                    <Label htmlFor="public-template">Make template public (others can use it)</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {template.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add tags (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fields */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Template Fields</CardTitle>
                  <CardDescription>
                    Add and configure fields for your template ({template.fields?.length || 0} fields)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add from Preset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Field from Preset</DialogTitle>
                        <DialogDescription>Choose a common field type to add to your template</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-3">
                        {FIELD_PRESETS.map((preset) => (
                          <Button
                            key={preset.id}
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                            onClick={() => {
                              addField(preset.id)
                              // Close dialog
                              document.querySelector('[data-state="open"]')?.click()
                            }}
                          >
                            <span className="text-2xl">{preset.icon}</span>
                            <span className="text-sm">{preset.label}</span>
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => addField()} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.fields?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-lg mb-2">No fields added yet</div>
                  <div className="text-sm">Add your first field to get started</div>
                </div>
              )}

              {template.fields?.map((field, index) => (
                <Collapsible
                  key={field.id}
                  open={expandedFields[field.id]}
                  onOpenChange={() => toggleFieldExpansion(field.id)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-muted px-2 py-1 rounded">#{index + 1}</span>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {field.type}
                          </Badge>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{field.name || "Unnamed Field"}</div>
                          {field.description && (
                            <div className="text-sm text-muted-foreground">{field.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedFields[field.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-4 border-t bg-muted/25 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Field Name *</Label>
                            <Input
                              placeholder="Enter field name"
                              value={field.name}
                              onChange={(e) => updateField(field.id, { name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value: FieldType) => updateField(field.id, { type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_TYPE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div>
                                      <div className="font-medium">{option.label}</div>
                                      <div className="text-xs text-muted-foreground">{option.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            placeholder="Describe what this field is for"
                            value={field.description || ""}
                            onChange={(e) => updateField(field.id, { description: e.target.value })}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                          />
                          <Label>Required field</Label>
                        </div>

                        {field.type === "select" && (
                          <div className="space-y-2">
                            <Label>Options (one per line)</Label>
                            <Textarea
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                              value={field.options?.join("\n") || ""}
                              onChange={(e) =>
                                updateField(field.id, { options: e.target.value.split("\n").filter(Boolean) })
                              }
                            />
                          </div>
                        )}

                        {showAdvancedOptions && (
                          <div className="space-y-4 pt-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Placeholder</Label>
                                <Input
                                  placeholder="Placeholder text"
                                  value={field.placeholder || ""}
                                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Default Value</Label>
                                <Input
                                  placeholder="Default value"
                                  value={field.defaultValue || ""}
                                  onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Help Text</Label>
                              <Input
                                placeholder="Additional help or instructions"
                                value={field.helpText || ""}
                                onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                              />
                            </div>

                            {(field.type === "text" || field.type === "number") && (
                              <div className="grid grid-cols-2 gap-4">
                                {field.type === "text" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label>Min Length</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={field.validation?.minLength || ""}
                                        onChange={(e) =>
                                          updateField(field.id, {
                                            validation: {
                                              ...field.validation,
                                              minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Max Length</Label>
                                      <Input
                                        type="number"
                                        placeholder="No limit"
                                        value={field.validation?.maxLength || ""}
                                        onChange={(e) =>
                                          updateField(field.id, {
                                            validation: {
                                              ...field.validation,
                                              maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                                {field.type === "number" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label>Min Value</Label>
                                      <Input
                                        type="number"
                                        placeholder="No minimum"
                                        value={field.validation?.min || ""}
                                        onChange={(e) =>
                                          updateField(field.id, {
                                            validation: {
                                              ...field.validation,
                                              min: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Max Value</Label>
                                      <Input
                                        type="number"
                                        placeholder="No maximum"
                                        value={field.validation?.max || ""}
                                        onChange={(e) =>
                                          updateField(field.id, {
                                            validation: {
                                              ...field.validation,
                                              max: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                                            },
                                          })
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveField(field.id, "up")}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moveField(field.id, "down")}
                              disabled={index === (template.fields?.length || 0) - 1}
                            >
                              ↓
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => duplicateField(field.id)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => removeField(field.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your template will look</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="form" className="text-xs">
                    Form
                  </TabsTrigger>
                  <TabsTrigger value="csv" className="text-xs">
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="documentation" className="text-xs">
                    Docs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="space-y-3 mt-4">
                  {template.fields?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">Add fields to see preview</div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {template.fields?.map((field) => (
                        <div key={field.id} className="space-y-1">
                          <Label className="text-xs">
                            {field.name || "Unnamed Field"}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {field.type === "select" ? (
                            <Select disabled>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder={field.placeholder || "Select option"} />
                              </SelectTrigger>
                            </Select>
                          ) : field.type === "boolean" ? (
                            <div className="flex items-center space-x-2">
                              <Switch disabled />
                              <span className="text-xs text-muted-foreground">Yes/No</span>
                            </div>
                          ) : (
                            <Input
                              className="h-8 text-xs"
                              placeholder={field.placeholder || `Enter ${field.name?.toLowerCase()}`}
                              type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                              disabled
                            />
                          )}
                          {field.helpText && <div className="text-xs text-muted-foreground">{field.helpText}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="csv" className="mt-4">
                  {template.fields?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">Add fields to see CSV preview</div>
                  ) : (
                    <div className="space-y-3">
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto max-h-64">
                        {generateCustomTemplateCSV(template as CustomTemplate, true)}
                      </pre>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownloadCSV(false)}>
                          <Download className="h-3 w-3 mr-1" />
                          Headers
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadCSV(true)}>
                          <Download className="h-3 w-3 mr-1" />
                          Examples
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documentation" className="mt-4">
                  {template.fields?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Add fields to see documentation
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded text-xs max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">
                          {generateCustomTemplateDocumentation(template as CustomTemplate)}
                        </pre>
                      </div>
                      <Button size="sm" variant="outline" onClick={handleDownloadDocumentation}>
                        <FileText className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
