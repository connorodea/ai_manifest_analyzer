import { notFound } from "next/navigation"
import { getComprehensiveManifestById } from "@/lib/actions/comprehensive-manifest-actions"
import { ComprehensiveAnalysisDisplay } from "@/components/manifests/comprehensive-analysis-display"

interface ComprehensiveManifestPageProps {
  params: {
    id: string
  }
}

export default async function ComprehensiveManifestPage({ params }: ComprehensiveManifestPageProps) {
  try {
    const analysis = await getComprehensiveManifestById(params.id)

    return (
      <div className="container mx-auto py-8">
        <ComprehensiveAnalysisDisplay analysis={analysis} />
      </div>
    )
  } catch (error) {
    console.error("Error loading comprehensive manifest:", error)
    notFound()
  }
}
