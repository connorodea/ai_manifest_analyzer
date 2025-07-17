"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, BarChart3, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockManifests = [
  {
    id: "m1",
    name: "Electronics Pallet #4872",
    status: "completed",
    totalItems: 87,
    estimatedValue: 12450.75,
    createdAt: "2023-07-15T10:30:00Z",
    confidence: 0.92,
  },
  {
    id: "m2",
    name: "Home Goods Returns",
    status: "completed",
    totalItems: 124,
    estimatedValue: 8320.5,
    createdAt: "2023-07-14T14:15:00Z",
    confidence: 0.88,
  },
  {
    id: "m3",
    name: "Clothing Lot #A773",
    status: "processing",
    totalItems: 215,
    estimatedValue: null,
    createdAt: "2023-07-17T09:45:00Z",
    confidence: null,
  },
]

export function RecentManifests() {
  const [manifests, setManifests] = useState(mockManifests)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-500">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Processing
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Manifests</CardTitle>
        <CardDescription>Your recently uploaded and analyzed manifests.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Items</th>
                <th className="text-left py-3 px-4 font-medium">Est. Value</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {manifests.map((manifest) => (
                <tr key={manifest.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/manifests/${manifest.id}`} className="font-medium hover:underline">
                      {manifest.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(manifest.status)}</td>
                  <td className="py-3 px-4">{manifest.totalItems}</td>
                  <td className="py-3 px-4">
                    {manifest.estimatedValue ? formatCurrency(manifest.estimatedValue) : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      {formatDate(manifest.createdAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/manifests/${manifest.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      {manifest.status === "completed" && (
                        <>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/manifests/${manifest.id}/analytics`}>
                              <BarChart3 className="h-4 w-4" />
                              <span className="sr-only">Analytics</span>
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/manifests">View All Manifests</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
