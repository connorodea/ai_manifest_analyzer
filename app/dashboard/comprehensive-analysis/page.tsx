import { ComprehensiveManifestUploader } from "@/components/dashboard/comprehensive-manifest-uploader"

export default function ComprehensiveAnalysisPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Comprehensive AI Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your liquidation manifest for deep AI-powered research, market analysis, and strategic insights with
          complete transparency into our thinking process.
        </p>
      </div>

      <ComprehensiveManifestUploader />
    </div>
  )
}
