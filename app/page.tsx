import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CheckCircle,
  Bot,
  BarChart,
  ShieldCheck,
  UploadCloud,
  Search,
  Lightbulb,
  DollarSign,
  Zap,
  Star,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-gray-800 dark:text-white" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Manifest Analyzer Pro</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Features
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Pricing
          </a>
          <a href="#faq" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            FAQ
          </a>
        </nav>
        <Button>Get Started</Button>
      </header>

      <main className="flex-1">
        <section id="hero" className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Turn Liquidation Manifests into Profitable Insights
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Our enterprise-grade AI platform analyzes your liquidation manifests instantly, providing automated
              categorization, market valuation, and risk assessment to maximize your returns.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg">Upload Manifest for Free</Button>
              <Button size="lg" variant="outline">
                Request a Demo
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">No credit card required.</div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Powerful AI-Driven Features
              </h3>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                Everything you need to make smarter decisions, faster.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Automated Data Extraction"
                description="Our AI automatically parses and cleans data from various formats including CSV, Excel, and even scanned PDFs, saving you hours of manual work."
              />
              <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="Intelligent Categorization"
                description="Leveraging fine-tuned models, we accurately categorize every item, extracting brand, model, and other key attributes with over 95% accuracy."
              />
              <FeatureCard
                icon={<DollarSign className="h-8 w-8 text-primary" />}
                title="Precise Market Valuation"
                description="Get real-time, data-driven value estimates for each item, including market-low and market-high prices, based on millions of data points."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-primary" />}
                title="Comprehensive Risk Assessment"
                description="Identify potential issues with authenticity, market saturation, and condition. Our AI flags high-risk items so you can bid with confidence."
              />
              <FeatureCard
                icon={<BarChart className="h-8 w-8 text-primary" />}
                title="Market Trend Analysis"
                description="Understand demand, seasonality, and competition levels for your product categories to optimize your pricing and sales strategy."
              />
              <FeatureCard
                icon={<Lightbulb className="h-8 w-8 text-primary" />}
                title="Actionable Insights"
                description="Go beyond raw data. Our platform generates clear, actionable insights and summaries for each manifest, highlighting key opportunities and risks."
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Get Started in 3 Simple Steps
              </h3>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                From complex manifest to clear analysis in minutes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">1. Upload Manifest</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Drag and drop your manifest file. We support CSV, Excel, PDF, and even image formats.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">2. AI Analysis</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Our AI pipeline gets to work, cleaning data, categorizing items, estimating value, and assessing risk.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 mb-4">
                  <BarChart className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">3. Get Insights</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Receive a detailed report with actionable insights, market values, and risk scores to inform your
                  decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Flexible Pricing for Every Business
              </h3>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                Choose the plan that fits your needs. Cancel or upgrade anytime.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <PricingCard
                plan="Starter"
                price={49}
                description="For individuals and small businesses getting started."
                features={[
                  "5 manifest uploads/month",
                  "Up to 100 items per manifest",
                  "Basic AI analysis",
                  "PDF/CSV export",
                  "Email support",
                ]}
              />
              <PricingCard
                plan="Professional"
                price={149}
                description="For growing businesses that need advanced tools and API access."
                features={[
                  "50 manifest uploads/month",
                  "Up to 1000 items per manifest",
                  "Advanced AI analysis",
                  "Risk assessment",
                  "Market trend analysis",
                  "API access",
                  "Priority support",
                ]}
                isPopular={true}
              />
              <PricingCard
                plan="Enterprise"
                price="Custom"
                description="For large-scale operations requiring custom solutions."
                features={[
                  "Unlimited uploads & items",
                  "Custom AI models",
                  "White-label options",
                  "Dedicated account manager",
                  "Advanced analytics & reporting",
                  "Integration support",
                  "SLA guarantee",
                ]}
                buttonText="Contact Sales"
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Trusted by Industry Leaders
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="This tool has revolutionized our workflow. We now process manifests 10x faster and our profitability is up 20%."
                name="John Doe"
                title="Owner, Regional Auction House"
              />
              <TestimonialCard
                quote="The accuracy of the AI valuation is uncanny. It's like having a team of market research analysts on call 24/7. A must-have for any serious reseller."
                name="Jane Smith"
                title="High-Volume eBay Seller"
              />
              <TestimonialCard
                quote="The risk assessment feature alone has saved us from several bad buys. The confidence it gives our team is invaluable."
                name="Samuel Lee"
                title="Liquidation Manager, National Retailer"
              />
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h3>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What file formats do you support?</AccordionTrigger>
                <AccordionContent>
                  We support a wide range of formats including CSV, Excel (.xls, .xlsx), PDF (both text-based and
                  scanned images), and common image files (JPG, PNG). Our OCR technology can extract data from
                  image-based documents.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do you ensure data security?</AccordionTrigger>
                <AccordionContent>
                  Data security is our top priority. We use AES-256 encryption for data at rest and TLS 1.3 for data in
                  transit. All data is stored in secure cloud infrastructure with strict access controls. We are fully
                  GDPR compliant.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How accurate is the AI analysis?</AccordionTrigger>
                <AccordionContent>
                  Our AI models are continuously trained on millions of data points. Our item categorizer achieves over
                  95% accuracy. While market valuation is an estimate, it's based on real-time data from multiple
                  sources to provide a highly accurate price range.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I integrate this with my existing systems?</AccordionTrigger>
                <AccordionContent>
                  Yes! Our Professional and Enterprise plans include API access, allowing you to integrate our analysis
                  capabilities directly into your own software and workflows. The Enterprise plan also includes
                  dedicated integration support.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Bot className="h-8 w-8" />
                <h2 className="text-xl font-bold">AI Manifest Analyzer Pro</h2>
              </div>
              <p className="mt-2 text-gray-400">Maximizing your liquidation returns with AI.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#features" className="text-gray-400 hover:text-white">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-gray-400 hover:text-white">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="text-gray-400 hover:text-white">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Manifest Analyzer Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-start p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function PricingCard({
  plan,
  price,
  description,
  features,
  isPopular = false,
  buttonText = "Choose Plan",
}: {
  plan: string
  price: number | string
  description: string
  features: string[]
  isPopular?: boolean
  buttonText?: string
}) {
  return (
    <Card className={`flex flex-col ${isPopular ? "border-primary border-2" : ""}`}>
      {isPopular && (
        <div className="py-1 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg -mt-px text-center">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{plan}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          {typeof price === "number" ? (
            <span className="text-4xl font-extrabold">${price}</span>
          ) : (
            <span className="text-4xl font-extrabold">{price}</span>
          )}
          {typeof price === "number" && <span className="text-lg text-gray-500">/month</span>}
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={isPopular ? "default" : "outline"}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestimonialCard({ quote, name, title }: { quote: string; name: string; title: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">"{quote}"</p>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
