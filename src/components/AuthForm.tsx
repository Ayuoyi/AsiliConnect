import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase, type UserRole } from '@/lib/supabase'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useNavigate } from 'react-router-dom'
import { useToast } from './ui/use-toast'

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('buyer')
  const navigate = useNavigate()
  const { toast } = useToast()
  const location = useLocation()

  useEffect(() => {
    // Get role from URL parameter
    const params = new URLSearchParams(location.search)
    const roleParam = params.get('role') as UserRole
    if (roleParam && (roleParam === 'admin' || roleParam === 'buyer')) {
      setRole(roleParam)
    }
  }, [location])

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
            phone,
          },
        },
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Please check your email for verification link.",
      })

      // Redirect based on role
      if (data.user) {
        navigate(role === 'admin' ? '/farmer-dashboard' : '/buyer-dashboard')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user metadata to check role
      const userRole = data.user?.user_metadata.role as UserRole
      navigate(userRole === 'admin' ? '/farmer-dashboard' : '/buyer-dashboard')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid email or password.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Welcome to AgriConnect</CardTitle>
        <CardDescription>Sign in or create an account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={role === 'buyer' ? 'default' : 'outline'}
                    onClick={() => setRole('buyer')}
                  >
                    Buyer
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'admin' ? 'default' : 'outline'}
                    onClick={() => setRole('admin')}
                  >
                    Farmer/Admin
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Protected by Supabase Auth
      </CardFooter>
    </Card>
  )
}