"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { getAllManifests } from "@/lib/actions/manifest-actions"

interface Manifest {
  id: string
  name: string
  status: "processing" | "completed" | "error"
  totalItems: number
  totalValue: number
  createdAt: string
  confidence?: number
}

export function RecentManifests() {
  const [manifests, setManifests] = useState<Manifest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchManifests() {
      try {
        // In a real app, get the actual user ID
        const userId = "demo-user"
        const data = await getAllManifests(userId)
        setManifests(data.slice(0, 5)) // Show only 5 most recent
      } catch (error) {
        console.error("Error fetching manifests:", error)
        // Set demo data for now
        setManifests([
          {
            id: "1",
            name: "Electronics Pallet #4872",
            status: "completed",
            totalItems: 87,
            totalValue: 12450.75,
            createdAt: "2024-01-15T10:30:00Z",
            confidence: 0.92,
          },
          {
            id: "2",
            name: "Home Goods Mix #3341",
            status: "completed",
            totalItems: 156,
            totalValue: 8920.5,
            createdAt: "2024-01-14T14:22:00Z",
            confidence: 0.88,
          },
          {
            id: "3",
            name: "Clothing Lot #2198",
            status: "processing",
            totalItems: 234,
            totalValue: 15670.25,
            createdAt: "2024-01-14T09:15:00Z",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchManifests()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {manifests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No manifests uploaded yet</p>
          <p className="text-sm">Upload your first manifest to get started</p>
        </div>
      ) : (
        manifests.map((manifest) => (
          <div
            key={manifest.id}
            className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">{manifest.name}</p>
                {getStatusBadge(manifest.status)}
              </div>

              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {manifest.totalItems} items
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatCurrency(manifest.totalValue)}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(manifest.createdAt)}
                </div>
              </div>

              {manifest.confidence && (
                <div className="mt-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">AI Confidence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${manifest.confidence * 100}%` }}
                      />
                    </div>
                    <span>{Math.round(manifest.confidence * 100)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = `/dashboard/manifests/${manifest.id}`)}
              >
                View
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
