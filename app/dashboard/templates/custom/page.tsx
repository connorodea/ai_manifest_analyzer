"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import CustomTemplateBuilder from "@/components/templates/custom-template-builder"
import CustomTemplateManager from "@/components/templates/custom-template-manager"
import type { CustomTemplate } from "@/lib/utils/custom-template-builder"

type ViewMode = "manager" | "builder" | "editor"

export default function CustomTemplatesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("manager")
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null)

  const handleCreateNew = () => {
    setEditingTemplate(null)
    setViewMode("builder")
  }

  const handleEditTemplate = (template: CustomTemplate) => {
    setEditingTemplate(template)
    setViewMode("editor")
  }

  const handleBackToManager = () => {
    setEditingTemplate(null)
    setViewMode("manager")
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {viewMode !== "manager" && (
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackToManager}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h2 className="text-lg font-semibold">
                {viewMode === "builder" ? "Create New Template" : `Edit: ${editingTemplate?.name}`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {viewMode === "builder" ? "Build a custom template from scratch" : "Modify your existing template"}
              </p>
            </div>
          </div>
        )}

        {viewMode === "manager" && (
          <CustomTemplateManager onCreateNew={handleCreateNew} onEditTemplate={handleEditTemplate} />
        )}

        {(viewMode === "builder" || viewMode === "editor") && <CustomTemplateBuilder />}
      </div>
    </DashboardShell>
  )
}
