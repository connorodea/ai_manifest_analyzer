"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, Play, Loader2, CheckCircle, AlertTriangle, Brain } from "lucide-react"
import { uploadEnhancedManifest } from "@/lib/actions/enhanced-manifest-actions"

interface TestDataConfig {
  manifestType: string
  itemCount: number
  priceRange: { min: number; max: number }
  categories: string[]
  conditions: string[]
  customCategories: string
}

const MANIFEST_TYPES = {
  electronics: {
    name: "Electronics Pallet",
    description: "High-value tech items and gadgets",
    categories: ["Smartphones", "Laptops", "Tablets", "Gaming", "Audio", "Smart Home"],
    priceRange: { min: 50, max: 1200 },
    conditions: ["New", "Open Box", "Refurbished", "Used - Good", "Used - Fair"],
  },
  mixed: {
    name: "Mixed Retail",
    description: "Diverse merchandise from various categories",
    categories: ["Electronics", "Clothing", "Home & Garden", "Sports", "Beauty", "Books"],
    priceRange: { min: 10, max: 500 },
    conditions: ["New", "New with Tags", "Used - Excellent", "Used - Good", "Damaged"],
  },
  apparel: {
    name: "Apparel Returns",
    description: "Clothing and fashion accessories",
    categories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry", "Bags"],
    priceRange: { min: 15, max: 300 },
    conditions: ["New with Tags", "New without Tags", "Used - Excellent", "Used - Good", "Stained/Damaged"],
  },
  home: {
    name: "Home Goods",
    description: "Furniture, appliances, and home decor",
    categories: ["Furniture", "Kitchen Appliances", "Home Decor", "Bedding", "Tools", "Garden"],
    priceRange: { min: 25, max: 800 },
    conditions: ["New", "Open Box", "Used - Excellent", "Used - Good", "Needs Repair"],
  },
  custom: {
    name: "Custom Mix",
    description: "Your own category combination",
    categories: [],
    priceRange: { min: 10, max: 500 },
    conditions: ["New", "Used - Good", "Used - Fair", "Damaged"],
  },
}

const SAMPLE_PRODUCTS = {
  Electronics: [
    "Apple iPhone 14 Pro Max 256GB",
    "Samsung Galaxy S23 Ultra",
    "MacBook Air M2 13-inch",
    "Dell XPS 13 Laptop",
    "iPad Pro 12.9-inch",
    "Sony WH-1000XM5 Headphones",
    "Nintendo Switch OLED",
    "PlayStation 5 Console",
    "Apple Watch Series 8",
    "Samsung 55-inch 4K Smart TV",
  ],
  Clothing: [
    "Nike Air Max 270 Sneakers",
    "Levi's 501 Original Jeans",
    "Adidas Ultraboost 22 Running Shoes",
    "North Face Fleece Jacket",
    "Champion Reverse Weave Hoodie",
    "Under Armour Athletic Shorts",
    "Calvin Klein Cotton T-Shirt",
    "Patagonia Down Vest",
    "Converse Chuck Taylor All Star",
    "Tommy Hilfiger Polo Shirt",
  ],
  "Home & Garden": [
    "KitchenAid Stand Mixer",
    "Dyson V15 Cordless Vacuum",
    "Instant Pot Duo 7-in-1",
    "Ninja Foodi Air Fryer",
    "Keurig K-Elite Coffee Maker",
    "Shark Navigator Vacuum",
    "Hamilton Beach Blender",
    "Black+Decker Toaster Oven",
    "Cuisinart Food Processor",
    "Breville Espresso Machine",
  ],
}

export function TestDataGenerator() {
  const [config, setConfig] = useState<TestDataConfig>({
    manifestType: "electronics",
    itemCount: 25,
    priceRange: { min: 50, max: 1200 },
    categories: MANIFEST_TYPES.electronics.categories,
    conditions: MANIFEST_TYPES.electronics.conditions,
    customCategories: "",
  })

  const [generating, setGenerating] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedCSV, setGeneratedCSV] = useState<string>("")

  const handleManifestTypeChange = (type: string) => {
    const manifestType = MANIFEST_TYPES[type as keyof typeof MANIFEST_TYPES]
    setConfig({
      ...config,
      manifestType: type,
      categories: manifestType.categories,
      priceRange: manifestType.priceRange,
      conditions: manifestType.conditions,
    })
  }

  const generateTestData = () => {
    setGenerating(true)
    setProgress(0)
    setError(null)

    try {
      const categories =
        config.manifestType === "custom"
          ? config.customCategories
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : config.categories

      if (categories.length === 0) {
        throw new Error("Please specify at least one category")
      }

      const items = []
      const headers = ["Product", "Category", "Brand", "Condition", "Quantity", "Retail Price", "Total Retail Price"]

      for (let i = 0; i < config.itemCount; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)]
        const products = SAMPLE_PRODUCTS[category as keyof typeof SAMPLE_PRODUCTS] || [
          `${category} Item ${i + 1}`,
          `Premium ${category} Product`,
          `Professional ${category} Equipment`,
        ]

        const product = products[Math.floor(Math.random() * products.length)]
        const brand = ["Apple", "Samsung", "Sony", "Nike", "Adidas", "Dell", "HP", "LG", "Generic"][
          Math.floor(Math.random() * 9)
        ]
        const condition = config.conditions[Math.floor(Math.random() * config.conditions.length)]
        const quantity = Math.floor(Math.random() * 5) + 1
        const retailPrice =
          Math.floor(Math.random() * (config.priceRange.max - config.priceRange.min)) + config.priceRange.min
        const totalRetailPrice = retailPrice * quantity

        items.push([
          product,
          category,
          brand,
          condition,
          quantity.toString(),
          retailPrice.toString(),
          totalRetailPrice.toString(),
        ])

        setProgress(((i + 1) / config.itemCount) * 100)
      }

      const csvContent = [headers, ...items].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

      setGeneratedCSV(csvContent)
      setGenerating(false)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate test data")
      setGenerating(false)
    }
  }

  const downloadCSV = () => {
    const blob = new Blob([generatedCSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `test-manifest-${config.manifestType}-${config.itemCount}-items.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const analyzeGeneratedData = async () => {
    if (!generatedCSV) {
      setError("No test data generated yet")
      return
    }

    setAnalyzing(true)
    setProgress(0)
    setError(null)
    setResult(null)

    try {
      // Create a FormData object with the generated CSV
      const formData = new FormData()
      const blob = new Blob([generatedCSV], { type: "text/csv" })
      const file = new File([blob], `test-manifest-${config.manifestType}.csv`, { type: "text/csv" })
      formData.append("file", file)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const response = await uploadEnhancedManifest(formData)

      clearInterval(progressInterval)
      setProgress(100)

      if (response.success) {
        setResult(response.result)
      } else {
        throw new Error(response.error || "Analysis failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="manifestType">Manifest Type</Label>
            <Select value={config.manifestType} onValueChange={handleManifestTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MANIFEST_TYPES).map(([key, type]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="itemCount">Number of Items</Label>
            <Input
              id="itemCount"
              type="number"
              min="5"
              max="100"
              value={config.itemCount}
              onChange={(e) => setConfig({ ...config, itemCount: Number.parseInt(e.target.value) || 25 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice">Min Price ($)</Label>
              <Input
                id="minPrice"
                type="number"
                min="1"
                value={config.priceRange.min}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    priceRange: { ...config.priceRange, min: Number.parseInt(e.target.value) || 10 },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Price ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                min="1"
                value={config.priceRange.max}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    priceRange: { ...config.priceRange, max: Number.parseInt(e.target.value) || 500 },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {config.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {config.manifestType === "custom" && (
            <div>
              <Label htmlFor="customCategories">Custom Categories (comma-separated)</Label>
              <Textarea
                id="customCategories"
                placeholder="Electronics, Clothing, Books, Toys"
                value={config.customCategories}
                onChange={(e) => setConfig({ ...config, customCategories: e.target.value })}
              />
            </div>
          )}

          <div>
            <Label>Conditions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {config.conditions.map((condition) => (
                <Badge key={condition} variant="outline">
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={generateTestData} disabled={generating} className="flex-1">
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Generate Test Data
            </>
          )}
        </Button>

        {generatedCSV && (
          <>
            <Button variant="outline" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button onClick={analyzeGeneratedData} disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </>
        )}
      </div>

      {/* Progress */}
      {(generating || analyzing) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{generating ? "Generating test data..." : "Running AI analysis..."}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success */}
      {generatedCSV && !generating && !error && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Successfully generated {config.itemCount} test items. You can now download the CSV or run AI analysis.
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis Results
            </CardTitle>
            <CardDescription>Analysis completed for manifest: {result.manifestName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-700">${result.totalRetailValue.toLocaleString()}</div>
                <div className="text-xs text-blue-600">Retail Value</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-700">${result.totalEstimatedValue.toLocaleString()}</div>
                <div className="text-xs text-green-600">Est. Value</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-700">${result.totalPotentialProfit.toLocaleString()}</div>
                <div className="text-xs text-purple-600">Profit</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-700">{result.summary.expectedROI.toFixed(1)}%</div>
                <div className="text-xs text-orange-600">ROI</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">Analysis ID: {result.manifestId}</div>
              <Button asChild>
                <a href={`/dashboard/manifests/${result.manifestId}`}>View Full Analysis</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
