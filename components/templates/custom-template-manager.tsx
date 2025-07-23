"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Copy, Trash2, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type CustomTemplate, TEMPLATE_CATEGORIES } from "@/lib/utils/custom-template-builder"
import {
  getCustomTemplates,
  getPublicCustomTemplates,
  deleteCustomTemplate,
  duplicateCustomTemplate,
} from "@/lib/actions/custom-template-actions"

interface CustomTemplateManagerProps {
  onCreateNew: () => void
  onEditTemplate: (template: CustomTemplate) => void
}

export default function CustomTemplateManager({ onCreateNew, onEditTemplate }: CustomTemplateManagerProps) {
  const [templates, setTemplates] = useState<CustomTemplate[]>([])
  const [publicTemplates, setPublicTemplates] = useState<CustomTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<CustomTemplate | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const [userTemplates, publicTemplatesList] = await Promise.all([getCustomTemplates(), getPublicCustomTemplates()])
      setTemplates(userTemplates)
      setPublicTemplates(publicTemplatesList)
    } catch (error) {
      console.error("Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (template: CustomTemplate) => {
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return

    const result = await deleteCustomTemplate(templateToDelete.id)
    if (result.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id))
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    } else {
      alert(result.error || "Failed to delete template")
    }
  }

  const handleDuplicateTemplate = async (template: CustomTemplate) => {
    const newName = prompt(`Enter name for duplicated template:`, `${template.name} (Copy)`)
    if (!newName) return

    const result = await duplicateCustomTemplate(template.id, newName)
    if (result.success && result.template) {
      setTemplates((prev) => [...prev, result.template!])
    } else {
      alert(result.error || "Failed to duplicate template")
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const filteredPublicTemplates = publicTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const TemplateCard = ({ template, isPublic = false }: { template: CustomTemplate; isPublic?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
          </div>
          <Badge variant={isPublic ? "secondary" : "default"}>{isPublic ? "Public" : "Private"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{template.category}</span>
          <span>{template.fields.length} fields</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {template.fields.slice(0, 3).map((field) => (
            <Badge key={field.id} variant="outline" className="text-xs">
              {field.name}
            </Badge>
          ))}
          {template.fields.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.fields.length - 3} more
            </Badge>
          )}
        </div>

        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - 2} tags
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {template.fields.filter((f) => f.required).length} required fields
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEditTemplate(template)}>
              <Eye className="h-3 w-3" />
            </Button>
            {!isPublic && (
              <Button size="sm" variant="ghost" onClick={() => onEditTemplate(template)}>
                <Edit className="h-3 w-3" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => handleDuplicateTemplate(template)}>
              <Copy className="h-3 w-3" />
            </Button>
            {!isPublic && (
              <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Custom Templates</h1>
            <p className="text-muted-foreground mt-2">Manage your custom CSV templates</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Templates</h1>
          <p className="text-muted-foreground mt-2">Manage and create custom CSV templates for your specific needs</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {TEMPLATE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="my-templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-templates">My Templates ({templates.length})</TabsTrigger>
          <TabsTrigger value="public-templates">Public Templates ({publicTemplates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-templates" className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    {templates.length === 0 ? "No templates yet" : "No templates match your search"}
                  </h3>
                  <p className="text-muted-foreground">
                    {templates.length === 0
                      ? "Create your first custom template to get started"
                      : "Try adjusting your search or filters"}
                  </p>
                  {templates.length === 0 && (
                    <Button onClick={onCreateNew} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Template
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public-templates" className="space-y-6">
          {filteredPublicTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">No public templates found</h3>
                  <p className="text-muted-foreground">
                    {publicTemplates.length === 0
                      ? "No public templates are available yet"
                      : "No public templates match your search"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPublicTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} isPublic />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
