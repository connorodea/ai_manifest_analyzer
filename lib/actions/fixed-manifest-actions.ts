"use server"

import { revalidatePath } from "next/cache"

// Mock data for demonstration
const mockManifests = [
  {
    id: "manifest-1",
    name: "Electronics Liquidation Lot #001",
    uploadDate: "2024-01-15",
    itemCount: 150,
    totalValue: 45000,
    status: "analyzed",
  },
  {
    id: "manifest-2",
    name: "Retail Returns - Mixed Categories",
    uploadDate: "2024-01-14",
    itemCount: 89,
    totalValue: 12500,
    status: "processing",
  },
  {
    id: "manifest-3",
    name: "Amazon Returns Pallet #A123",
    uploadDate: "2024-01-13",
    itemCount: 200,
    totalValue: 67800,
    status: "analyzed",
  },
]

export async function getFixedManifestSummary() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    totalManifests: mockManifests.length,
    totalItems: mockManifests.reduce((sum, manifest) => sum + manifest.itemCount, 0),
    totalValue: mockManifests.reduce((sum, manifest) => sum + manifest.totalValue, 0),
    recentManifests: mockManifests.slice(0, 3),
    analysisComplete: mockManifests.filter((m) => m.status === "analyzed").length,
    processingCount: mockManifests.filter((m) => m.status === "processing").length,
  }
}

export async function uploadFixedManifest(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock successful upload
    const newManifest = {
      id: `manifest-${Date.now()}`,
      name: file.name.replace(".csv", ""),
      uploadDate: new Date().toISOString().split("T")[0],
      itemCount: Math.floor(Math.random() * 200) + 50,
      totalValue: Math.floor(Math.random() * 50000) + 10000,
      status: "processing",
    }

    mockManifests.unshift(newManifest)
    revalidatePath("/dashboard")

    return {
      success: true,
      manifestId: newManifest.id,
      message: "Manifest uploaded successfully",
    }
  } catch (error) {
    console.error("Upload error:", error)
    return {
      success: false,
      error: "Failed to upload manifest",
    }
  }
}

export async function getFixedManifestById(id: string) {
  const manifest = mockManifests.find((m) => m.id === id)
  if (!manifest) {
    return null
  }

  return {
    ...manifest,
    items: [
      {
        id: "item-1",
        description: "Apple iPhone 14 Pro 128GB Space Black",
        brand: "Apple",
        condition: "Like New",
        quantity: 1,
        retailPrice: 999.0,
        estimatedValue: 750.0,
        category: "Electronics",
      },
      {
        id: "item-2",
        description: 'Samsung 55" QLED 4K Smart TV',
        brand: "Samsung",
        condition: "New",
        quantity: 2,
        retailPrice: 1299.99,
        estimatedValue: 950.0,
        category: "Electronics",
      },
      {
        id: "item-3",
        description: "Nike Air Max 270 Running Shoes Size 10",
        brand: "Nike",
        condition: "Very Good",
        quantity: 1,
        retailPrice: 150.0,
        estimatedValue: 85.0,
        category: "Footwear",
      },
    ],
    analysis: {
      categoryBreakdown: {
        Electronics: 75,
        Footwear: 15,
        Accessories: 10,
      },
      conditionBreakdown: {
        New: 40,
        "Like New": 35,
        "Very Good": 20,
        Good: 5,
      },
      insights: [
        "High-value electronics dominate this manifest",
        "Excellent condition distribution with 75% in top conditions",
        "Strong resale potential with average 65% of retail value",
      ],
    },
  }
}
