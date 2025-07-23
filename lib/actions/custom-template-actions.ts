"use server"

import { revalidatePath } from "next/cache"
import type { CustomTemplate } from "@/lib/utils/custom-template-builder"

// In a real application, these would interact with a database
const customTemplates: CustomTemplate[] = []

export async function saveCustomTemplate(template: CustomTemplate): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate template
    if (!template.name || !template.category || !template.fields?.length) {
      return { success: false, error: "Template name, category, and at least one field are required" }
    }

    // Generate ID if not provided
    if (!template.id) {
      template.id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // Set timestamps
    const now = new Date()
    template.createdAt = template.createdAt || now
    template.updatedAt = now

    // Check if template already exists (update) or is new (create)
    const existingIndex = customTemplates.findIndex((t) => t.id === template.id)
    if (existingIndex >= 0) {
      customTemplates[existingIndex] = template
    } else {
      customTemplates.push(template)
    }

    revalidatePath("/dashboard/templates")
    return { success: true }
  } catch (error) {
    console.error("Error saving custom template:", error)
    return { success: false, error: "Failed to save template" }
  }
}

export async function getCustomTemplates(): Promise<CustomTemplate[]> {
  // In a real app, this would fetch from database with user filtering
  return customTemplates
}

export async function getCustomTemplateById(id: string): Promise<CustomTemplate | null> {
  return customTemplates.find((t) => t.id === id) || null
}

export async function deleteCustomTemplate(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const index = customTemplates.findIndex((t) => t.id === id)
    if (index === -1) {
      return { success: false, error: "Template not found" }
    }

    customTemplates.splice(index, 1)
    revalidatePath("/dashboard/templates")
    return { success: true }
  } catch (error) {
    console.error("Error deleting custom template:", error)
    return { success: false, error: "Failed to delete template" }
  }
}

export async function duplicateCustomTemplate(
  id: string,
  newName: string,
): Promise<{ success: boolean; template?: CustomTemplate; error?: string }> {
  try {
    const originalTemplate = customTemplates.find((t) => t.id === id)
    if (!originalTemplate) {
      return { success: false, error: "Template not found" }
    }

    const duplicatedTemplate: CustomTemplate = {
      ...originalTemplate,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    customTemplates.push(duplicatedTemplate)
    revalidatePath("/dashboard/templates")
    return { success: true, template: duplicatedTemplate }
  } catch (error) {
    console.error("Error duplicating custom template:", error)
    return { success: false, error: "Failed to duplicate template" }
  }
}

export async function getPublicCustomTemplates(): Promise<CustomTemplate[]> {
  return customTemplates.filter((t) => t.isPublic)
}

export async function searchCustomTemplates(query: string): Promise<CustomTemplate[]> {
  const lowercaseQuery = query.toLowerCase()
  return customTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowercaseQuery) ||
      t.description?.toLowerCase().includes(lowercaseQuery) ||
      t.category.toLowerCase().includes(lowercaseQuery) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
