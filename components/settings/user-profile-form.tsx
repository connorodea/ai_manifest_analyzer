"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

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

interface UserProfileFormProps {
  user: User
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
  })
  const { toast } = useToast()

  const handleSave = async () => {
    // In a real app, this would call an API to update the user
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center gap-2">
            <Input id="email" value={user.email} disabled />
            {user.emailVerified ? (
              <Badge className="bg-green-500">Verified</Badge>
            ) : (
              <Badge variant="destructive">Unverified</Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label>Account Type</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{user.role}</Badge>
            <Badge>{user.subscriptionTier}</Badge>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
