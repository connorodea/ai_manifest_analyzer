"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, MoreHorizontal, AlertTriangle, CheckCircle, AlertCircle, Eye, Loader2 } from "lucide-react"
import { getManifestItems } from "@/lib/actions/manifest-actions"

interface ManifestItem {
  id: string
  title: string
  category: string
  condition: string
  estimatedValue: number
  marketValue: number
  riskScore: number
  brand: string
  model: string
  originalDescription: string
  riskFactors: string[]
  aiReasoning: {
    categorization: string
    valuation: string
    risk: string
  }
}

interface ItemsTableProps {
  manifestId: string
}

export function ItemsTable({ manifestId }: ItemsTableProps) {
  const [items, setItems] = useState<ManifestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState<ManifestItem[]>([])
  const [selectedItem, setSelectedItem] = useState<ManifestItem | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        const result = await getManifestItems(manifestId)
        setItems(result)
        setFilteredItems(result)
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [manifestId])

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredItems(items)
    } else {
      setFilteredItems(
        items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [searchTerm, items])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const getRiskBadge = (score: number) => {
    if (score <= 30) {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" /> Low
        </Badge>
      )
    } else if (score <= 70) {
      return (
        <Badge className="bg-yellow-500">
          <AlertCircle className="h-3 w-3 mr-1" /> Medium
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" /> High
        </Badge>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading items...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Analyzed Items</CardTitle>
        <CardDescription>Detailed AI analysis of all items in this manifest</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items, categories, or brands..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>AI-Generated Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Est. Value</TableHead>
                <TableHead className="text-right">Market High</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[200px] truncate" title={item.title}>
                    {item.title}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.brand || "Unknown"}</TableCell>
                  <TableCell>{item.condition}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.estimatedValue)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.marketValue)}</TableCell>
                  <TableCell>{getRiskBadge(item.riskScore)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Eye className="h-4 w-4 mr-2" />
                              View AI Analysis
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{item.title}</DialogTitle>
                              <DialogDescription>Detailed AI analysis for this item</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Original Description</h4>
                                <p className="text-sm text-muted-foreground">{item.originalDescription}</p>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-semibold mb-2">Product Details</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Category:</span>
                                      <Badge variant="outline">{item.category}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Brand:</span>
                                      <span>{item.brand || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Model:</span>
                                      <span>{item.model || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Condition:</span>
                                      <span>{item.condition}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Valuation</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Estimated Value:</span>
                                      <span className="font-medium">{formatCurrency(item.estimatedValue)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Market High:</span>
                                      <span>{formatCurrency(item.marketValue)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Risk Score:</span>
                                      {getRiskBadge(item.riskScore)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {item.riskFactors.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Risk Factors</h4>
                                  <ul className="space-y-1">
                                    {item.riskFactors.map((factor, index) => (
                                      <li key={index} className="flex items-center gap-2 text-sm">
                                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                        {factor}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold mb-2">AI Reasoning</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Categorization:</span>
                                    <p className="text-muted-foreground">{item.aiReasoning.categorization}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Valuation:</span>
                                    <p className="text-muted-foreground">{item.aiReasoning.valuation}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Risk Assessment:</span>
                                    <p className="text-muted-foreground">{item.aiReasoning.risk}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>Market Research</DropdownMenuItem>
                        <DropdownMenuItem>Export Item</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No items found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
