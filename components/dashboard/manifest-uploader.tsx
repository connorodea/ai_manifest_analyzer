"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadManifest } from "@/lib/actions/manifest-actions"
import { useToast } from "@/hooks/use-toast"

export function ManifestUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [manifestName, setManifestName] = useState("")
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
    ]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV, Excel, or PDF file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      })
      return
    }

    setFile(file)
    // Set default manifest name from file name
    setManifestName(file.name.split(".")[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    if (!manifestName.trim()) {
      toast({
        title: "Missing manifest name",
        description: "Please provide a name for this manifest.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Convert file to text content for processing
      const fileContent = await file.text()

      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", manifestName)
      formData.append("content", fileContent)
      formData.append("type", file.type)

      const result = await uploadManifest(formData)

      if (result.success) {
        toast({
          title: "Upload successful",
          description: "Your manifest is now being analyzed.",
        })

        // Reset form
        setFile(null)
        setManifestName("")

        // Optional: Redirect to the manifest detail page
        // if (result.id) {
        //   window.location.href = `/dashboard/manifests/${result.id}`
        // }
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "There was an error uploading your manifest. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Manifest</CardTitle>
        <CardDescription>
          Upload your liquidation manifest for AI analysis. We support CSV, Excel, and PDF formats.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
              file ? "bg-primary/5" : "",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              {file ? (
                <>
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </>
              ) : (
                <>
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  <div className="text-sm font-medium">Drag and drop your file here, or click to browse</div>
                  <div className="text-xs text-muted-foreground">CSV, Excel, or PDF up to 10MB</div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manifest-name">Manifest Name</Label>
            <Input
              id="manifest-name"
              placeholder="Enter a name for this manifest"
              value={manifestName}
              onChange={(e) => setManifestName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!file || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload and Analyze</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
