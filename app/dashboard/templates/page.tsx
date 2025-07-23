import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import CSVTemplateGenerator from "@/components/templates/csv-template-generator"

export const metadata: Metadata = {
  title: "CSV Templates | Manifest Analysis Platform",
  description: "Generate properly formatted CSV templates for different manifest types",
}

export default function TemplatesPage() {
  return (
    <DashboardShell>
      <CSVTemplateGenerator />
    </DashboardShell>
  )
}
