"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Download, Shuffle, Play, Loader2, CheckCircle, FileText, Zap } from "lucide-react"
import { uploadEnhancedManifest } from "@/lib/actions/enhanced-manifest-actions"
import type { ComprehensiveManifestAnalysisResult } from "@/lib/ai/enhanced-analysis-service"

interface TestDataConfig {
  itemCount: number
  categories: string[]
  priceRange: { min: number; max: number }
  conditionMix: string[]
  manifestType: string
}

const SAMPLE_CATEGORIES = [
  "Electronics",
  "Home & Garden",
  "Clothing & Accessories",
  "Sports & Outdoors",
  "Toys & Games",
  "Books & Media",
  "Health & Beauty",
  "Automotive",
  "Tools & Hardware",
  "Kitchen & Dining",
]

const SAMPLE_CONDITIONS = ["New", "Like New", "Very Good", "Good", "Fair", "Poor"]

const MANIFEST_TYPES = [
  { value: "electronics", label: "Electronics Pallet", description: "High-value electronics and gadgets" },
  { value: "mixed", label: "Mixed Retail", description: "Diverse retail merchandise" },
  { value: "clothing", label: "Apparel Returns", description: "Clothing and fashion items" },
  { value: "home", label: "Home Goods", description: "Furniture and home decor" },
  { value: "custom", label: "Custom Mix", description: "Create your own category mix" },
]

export function TestDataGenerator() {
  const [config, setConfig] = useState<TestDataConfig>({
    itemCount: 25,
    categories: ["Electronics", "Home & Garden"],
    priceRange: { min: 10, max: 500 },
    conditionMix: ["New", "Like New", "Very Good", "Good"],
    manifestType: "mixed",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedCSV, setGeneratedCSV] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<ComprehensiveManifestAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateSampleData = async () => {
    setIsGenerating(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate generation progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const csvData = createSampleCSV(config)
      setGeneratedCSV(csvData)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate test data")
    } finally {
      setIsGenerating(false)
    }
  }

  const analyzeGeneratedData = async () => {
    if (!generatedCSV) return

    setIsAnalyzing(true)
    setError(null)
    setProgress(0)

    try {
      // Create a File object from the CSV string
      const blob = new Blob([generatedCSV], { type: "text/csv" })
      const file = new File([blob], `test-manifest-${Date.now()}.csv`, { type: "text/csv" })

      const formData = new FormData()
      formData.append("file", file)

      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90))
      }, 500)

      const response = await uploadEnhancedManifest(formData)

      clearInterval(progressInterval)
      setProgress(100)

      if (response.success && response.result) {
        setAnalysisResult(response.result)
      } else {
        throw new Error(response.error || "Analysis failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const downloadCSV = () => {
    if (!generatedCSV) return

    const blob = new Blob([generatedCSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `test-manifest-${config.manifestType}-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const updateManifestType = (type: string) => {
    const manifestType = MANIFEST_TYPES.find((t) => t.value === type)
    if (!manifestType) return

    let categories: string[]
    let priceRange: { min: number; max: number }

    switch (type) {
      case "electronics":
        categories = ["Electronics", "Computers & Tablets", "Cell Phones & Accessories"]
        priceRange = { min: 50, max: 1200 }
        break
      case "clothing":
        categories = ["Clothing & Accessories", "Shoes", "Jewelry & Watches"]
        priceRange = { min: 15, max: 300 }
        break
      case "home":
        categories = ["Home & Garden", "Kitchen & Dining", "Furniture"]
        priceRange = { min: 25, max: 800 }
        break
      case "mixed":
        categories = ["Electronics", "Home & Garden", "Clothing & Accessories", "Sports & Outdoors"]
        priceRange = { min: 10, max: 500 }
        break
      default:
        categories = config.categories
        priceRange = config.priceRange
    }

    setConfig((prev) => ({
      ...prev,
      manifestType: type,
      categories,
      priceRange,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="manifestType">Manifest Type</Label>
            <Select value={config.manifestType} onValueChange={updateManifestType}>
              <SelectTrigger>
                <SelectValue placeholder="Select manifest type" />
              </SelectTrigger>
              <SelectContent>
                {MANIFEST_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemCount">Number of Items</Label>
            <Input
              id="itemCount"
              type="number"
              min="5"
              max="100"
              value={config.itemCount}
              onChange={(e) => setConfig((prev) => ({ ...prev, itemCount: Number.parseInt(e.target.value) || 25 }))}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={config.priceRange.min}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: Number.parseInt(e.target.value) || 10 },
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={config.priceRange.max}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: Number.parseInt(e.target.value) || 500 },
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-1">
              {config.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={generateSampleData} disabled={isGenerating} className="flex items-center gap-2">
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}
          Generate Test Data
        </Button>

        {generatedCSV && (
          <>
            <Button variant="outline" onClick={downloadCSV} className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>

            <Button onClick={analyzeGeneratedData} disabled={isAnalyzing} className="flex items-center gap-2">
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Analyze with AI
            </Button>
          </>
        )}
      </div>

      {/* Progress */}
      {(isGenerating || isAnalyzing) && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{isGenerating ? "Generating test data..." : "Running AI analysis..."}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Generated Data Preview */}
      {generatedCSV && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Test Data
            </CardTitle>
            <CardDescription>Preview of the generated CSV manifest ({config.itemCount} items)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">CSV generated successfully with {config.itemCount} items</span>
              </div>

              <Textarea
                value={generatedCSV.split("\n").slice(0, 6).join("\n") + "\n..."}
                readOnly
                className="font-mono text-xs"
                rows={6}
              />

              <div className="flex flex-wrap gap-2">
                {config.categories.map((category) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Analysis Complete
            </CardTitle>
            <CardDescription>AI analysis completed for test manifest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{analysisResult.analyzedItems}</div>
                <div className="text-sm text-blue-600">Items Analyzed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  ${analysisResult.totalPotentialProfit.toFixed(0)}
                </div>
                <div className="text-sm text-green-600">Potential Profit</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {analysisResult.summary.expectedROI.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-600">Expected ROI</div>
              </div>
            </div>

            <div className="mt-4">
              <Button asChild>
                <a href={`/dashboard/manifests/${analysisResult.manifestId}`}>View Full Analysis</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function createSampleCSV(config: TestDataConfig): string {
  const headers = [
    "Product Description",
    "Brand",
    "Model",
    "Category",
    "Condition",
    "Quantity",
    "Retail Price",
    "UPC",
    "SKU",
  ]

  const sampleProducts = {
    Electronics: [
      { product: "Wireless Bluetooth Headphones", brand: "Sony", model: "WH-1000XM4" },
      { product: "Smart TV 55 inch 4K", brand: "Samsung", model: "QN55Q60A" },
      { product: "Gaming Laptop", brand: "ASUS", model: "ROG Strix G15" },
      { product: "Smartphone", brand: "Apple", model: "iPhone 13" },
      { product: "Tablet 10.9 inch", brand: "Apple", model: "iPad Air" },
      { product: "Wireless Speaker", brand: "JBL", model: "Charge 5" },
      { product: "Digital Camera", brand: "Canon", model: "EOS R6" },
      { product: "Smartwatch", brand: "Apple", model: "Watch Series 8" },
    ],
    "Home & Garden": [
      { product: "Coffee Maker 12-Cup", brand: "Cuisinart", model: "DCC-3200P1" },
      { product: "Air Fryer 6-Quart", brand: "Ninja", model: "AF101" },
      { product: "Vacuum Cleaner Cordless", brand: "Dyson", model: "V15 Detect" },
      { product: "Stand Mixer", brand: "KitchenAid", model: "Artisan" },
      { product: "Outdoor Patio Set", brand: "Hampton Bay", model: "Woodbury" },
      { product: "Garden Hose 50ft", brand: "Flexzilla", model: "HFZ5850YW" },
      { product: "Power Drill Cordless", brand: "DeWalt", model: "DCD771C2" },
      { product: "Lawn Mower Electric", brand: "Greenworks", model: "25142" },
    ],
    "Clothing & Accessories": [
      { product: "Men's Running Shoes", brand: "Nike", model: "Air Zoom Pegasus" },
      { product: "Women's Handbag", brand: "Coach", model: "Gallery Tote" },
      { product: "Leather Jacket", brand: "Levi's", model: "Trucker Jacket" },
      { product: "Designer Sunglasses", brand: "Ray-Ban", model: "Aviator Classic" },
      { product: "Winter Coat", brand: "North Face", model: "McMurdo Parka" },
      { product: "Athletic Wear Set", brand: "Adidas", model: "Essentials" },
      { product: "Dress Shoes", brand: "Cole Haan", model: "Grand Crosscourt" },
      { product: "Watch", brand: "Fossil", model: "Gen 6" },
    ],
    "Sports & Outdoors": [
      { product: "Yoga Mat Premium", brand: "Manduka", model: "PRO" },
      { product: "Camping Tent 4-Person", brand: "Coleman", model: "Sundome" },
      { product: "Bicycle Mountain", brand: "Trek", model: "Marlin 7" },
      { product: "Fishing Rod Combo", brand: "Ugly Stik", model: "GX2" },
      { product: "Kayak Inflatable", brand: "Intex", model: "Explorer K2" },
      { product: "Golf Club Set", brand: "Callaway", model: "Strata Complete" },
      { product: "Hiking Backpack", brand: "Osprey", model: "Atmos AG 65" },
      { product: "Exercise Bike", brand: "Peloton", model: "Bike+" },
    ],
  }

  const rows = [headers.join(",")]

  for (let i = 0; i < config.itemCount; i++) {
    const category = config.categories[Math.floor(Math.random() * config.categories.length)]
    const products = sampleProducts[category as keyof typeof sampleProducts] || sampleProducts["Electronics"]
    const product = products[Math.floor(Math.random() * products.length)]

    const condition = config.conditionMix[Math.floor(Math.random() * config.conditionMix.length)]
    const quantity = Math.floor(Math.random() * 5) + 1
    const retailPrice =
      Math.floor(Math.random() * (config.priceRange.max - config.priceRange.min)) + config.priceRange.min
    const upc = Math.floor(Math.random() * 900000000000) + 100000000000
    const sku = `SKU${Math.floor(Math.random() * 90000) + 10000}`

    const row = [
      `"${product.product}"`,
      `"${product.brand}"`,
      `"${product.model}"`,
      `"${category}"`,
      `"${condition}"`,
      quantity,
      retailPrice,
      upc,
      `"${sku}"`,
    ]

    rows.push(row.join(","))
  }

  return rows.join("\n")
}
