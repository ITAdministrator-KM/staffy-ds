import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { useAuthActions } from "@/hooks/useAuthActions"
import { 
  User, 
  Mail, 
  Lock, 
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react"

const AccountSettings = () => {
  const { currentUser } = useAuth()
  const { resetPassword, logOut } = useAuthActions()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handlePasswordReset = async () => {
    if (!currentUser?.email) {
      setError("No email address found")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const { success, error } = await resetPassword(currentUser.email)
      
      if (success) {
        setMessage("Password reset email sent! Check your inbox.")
      } else {
        setError(error || "Failed to send password reset email")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    }
    
    setLoading(false)
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await logOut()
    } catch (err) {
      setError("Failed to sign out")
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your basic account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={currentUser?.displayName || ""}
                placeholder="Your display name"
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={currentUser?.email || ""}
                  placeholder="Your email address"
                  readOnly
                  className="pl-10 bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label>Password</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Reset your password to maintain account security
                </p>
                <Button 
                  onClick={handlePasswordReset}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? "Sending..." : "Reset Password"}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label className="text-destructive">Danger Zone</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Sign out of your account
                </p>
                <Button 
                  onClick={handleSignOut}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading ? "Signing Out..." : "Sign Out"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AccountSettings