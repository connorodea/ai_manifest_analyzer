"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Eye,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Search,
  MoreHorizontal,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { getAllManifests } from "@/lib/actions/manifest-actions"

interface Manifest {
  id: string
  name: string
  status: string
  totalItems: number
  estimatedValue: number
  createdAt: string
  confidence: number
}

interface ManifestsListProps {
  userId: string
}

export function ManifestsList({ userId }: ManifestsListProps) {
  const [manifests, setManifests] = useState<Manifest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredManifests, setFilteredManifests] = useState<Manifest[]>([])

  useEffect(() => {
    async function fetchManifests() {
      try {
        const result = await getAllManifests(userId)
        setManifests(result)
        setFilteredManifests(result)
      } catch (error) {
        console.error("Error fetching manifests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchManifests()
  }, [userId])

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredManifests(manifests)
    } else {
      setFilteredManifests(
        manifests.filter((manifest) => manifest.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
  }, [searchTerm, manifests])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading manifests...</span>
      </div>
    )
  }

  if (manifests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No manifests yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Upload your first liquidation manifest to get started with AI-powered analysis.
          </p>
          <Button asChild>
            <Link href="/dashboard">Upload Manifest</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Manifests</CardTitle>
            <CardDescription>
              {manifests.length} manifest{manifests.length !== 1 ? "s" : ""} analyzed
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard">
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search manifests..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Est. Value</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManifests.map((manifest) => (
                <TableRow key={manifest.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/manifests/${manifest.id}`} className="hover:underline">
                      {manifest.name}
                    </Link>
                  </TableCell>
                  <TableCell>{getStatusBadge(manifest.status)}</TableCell>
                  <TableCell className="text-right">{manifest.totalItems}</TableCell>
                  <TableCell className="text-right">
                    {manifest.estimatedValue > 0 ? formatCurrency(manifest.estimatedValue) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(manifest.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {manifest.confidence > 0 ? (
                      <Badge variant="outline">{Math.round(manifest.confidence * 100)}%</Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/manifests/${manifest.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {manifest.status === "completed" && (
                          <>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export Data
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/manifests/${manifest.id}?tab=insights`}>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Insights
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredManifests.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No manifests found matching "{searchTerm}"</p>
          </div>
        )}

        {filteredManifests.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>
              Showing {filteredManifests.length} of {manifests.length} manifest{manifests.length !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-4">
              <div>Total Value: {formatCurrency(filteredManifests.reduce((sum, m) => sum + m.estimatedValue, 0))}</div>
              <div>Total Items: {filteredManifests.reduce((sum, m) => sum + m.totalItems, 0)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
