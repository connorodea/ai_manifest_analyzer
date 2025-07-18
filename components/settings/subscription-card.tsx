"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, CreditCard, Calendar } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  role: string
  subscriptionTier: string
  subscriptionStatus: string
  createdAt: Date
  emailVerified: boolean
}

interface SubscriptionCardProps {
  user: User
}

export function SubscriptionCard({ user }: SubscriptionCardProps) {
  const getTierInfo = (tier: string) => {
    const tiers = {
      starter: {
        name: "Starter",
        price: 49,
        manifestsLimit: 5,
        itemsLimit: 100,
        features: ["Basic AI analysis", "PDF/CSV export", "Email support"],
      },
      professional: {
        name: "Professional",
        price: 149,
        manifestsLimit: 50,
        itemsLimit: 1000,
        features: ["Advanced AI analysis", "Risk assessment", "API access", "Priority support"],
      },
      enterprise: {
        name: "Enterprise",
        price: 499,
        manifestsLimit: "unlimited",
        itemsLimit: "unlimited",
        features: ["Custom AI models", "White-label options", "Dedicated support", "SLA guarantee"],
      },
    }

    return tiers[tier as keyof typeof tiers] || tiers.starter
  }

  const tierInfo = getTierInfo(user.subscriptionTier)
  const usagePercentage = 60 // Mock usage data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Subscription
        </CardTitle>
        <CardDescription>Manage your subscription and billing information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{tierInfo.name} Plan</h3>
            <p className="text-sm text-muted-foreground">
              {typeof tierInfo.price === "number" ? `$${tierInfo.price}/month` : "Custom pricing"}
            </p>
          </div>
          <Badge className={user.subscriptionStatus === "active" ? "bg-green-500" : "bg-red-500"}>
            {user.subscriptionStatus}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Manifests this month</span>
              <span>3 / {tierInfo.manifestsLimit}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Plan Features</h4>
            <ul className="text-sm space-y-1">
              {tierInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing History
          </Button>
          <Button className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
