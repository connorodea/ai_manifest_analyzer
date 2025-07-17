"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, MoreHorizontal, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

// Mock data for demonstration
const mockItems = Array.from({ length: 20 }).map((_, i) => ({
  id: `item-${i + 1}`,
  title: [
    "Apple iPhone 13 Pro 256GB",
    'Samsung 55" 4K Smart TV',
    "Sony WH-1000XM4 Headphones",
    "Dyson V11 Vacuum Cleaner",
    "KitchenAid Stand Mixer",
    "Nike Air Jordan 1 Size 10",
    "Levi's 501 Jeans 32x32",
    "LEGO Star Wars Set",
    "Instant Pot Duo 6Qt",
    "Patagonia Down Jacket M",
  ][Math.floor(Math.random() * 10)],
  category: ["Electronics", "Home & Kitchen", "Clothing", "Toys & Games", "Other"][Math.floor(Math.random() * 5)],
  condition: ["Excellent", "Good", "Fair", "Poor", "Damaged"][Math.floor(Math.random() * 5)],
  estimatedValue: Math.floor(Math.random() * 1000) + 50,
  marketValue: Math.floor(Math.random() * 1200) + 50,
  riskScore: Math.floor(Math.random() * 100) + 1,
}))

interface ItemsTableProps {
  manifestId: string
}

export function ItemsTable({ manifestId }: ItemsTableProps) {
  const [items, setItems] = useState(mockItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(items)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term === "") {
      setFilteredItems(items)
    } else {
      setFilteredItems(
        items.filter((item) => item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)),
      )
    }
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items Analysis</CardTitle>
        <CardDescription>Detailed analysis of all items in this manifest</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search items..." className="pl-8" value={searchTerm} onChange={handleSearch} />
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
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Est. Value</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Market Research</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
