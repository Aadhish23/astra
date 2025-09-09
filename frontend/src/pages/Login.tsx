import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

// Enhanced Google Sign-In Button Component
const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    // Add your Google sign-in logic here
    console.log('Google sign-in clicked');
  };

  return (
    <div className="relative group">
      {/* Animated border wrapper */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      
      {/* Main button */}
      <button
        onClick={handleGoogleSignIn}
        className="relative flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-300 w-full border border-blue-500/30 hover:border-blue-400/50 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transform"
      >
        {/* Shining effect overlay */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
        
        {/* Google Logo SVG with enhanced glow */}
        <div className="relative z-10 flex items-center justify-center w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(66,133,244,0.5)]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </div>
        
        <span className="relative z-10 text-sm font-semibold tracking-wide group-hover:text-blue-100 transition-colors duration-300">
          Sign in with Google
        </span>
        
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-md bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  );
};

export const Login = () => {
  const [email, setEmail] = useState('admin@lovable.dev');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login(email, password, rememberMe);
      toast({
        title: 'Login Successful',
        description: 'Welcome to Lovable Admin',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
      
      {/* Enhanced Card with shining blue border effects */}
      <div className="relative group w-full max-w-md">
        {/* Animated border wrapper for the entire card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 animate-pulse"></div>
        
        <Card className="relative backdrop-blur-sm bg-card/95 border-blue-500/20 shadow-elegant hover:shadow-blue-500/20 transition-all duration-500">
          {/* Shining effect overlay for card */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-blue-400/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 ease-in-out"></div>
          
          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400 opacity-60"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-400 opacity-60"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400 opacity-60"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-400 opacity-60"></div>
          
          <CardHeader className="text-center space-y-6 relative z-10">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10 animate-pulse-glow relative">
                {/* Enhanced glow effect for shield icon */}
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse"></div>
                <Shield className="h-12 w-12 text-primary relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Admin
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Secure access to your control center
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary border-blue-500/20 focus:border-blue-400 hover:border-blue-300/50"
                  />
                  {/* Subtle glow effect on focus */}
                  <div className="absolute inset-0 rounded-md bg-blue-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary border-blue-500/20 focus:border-blue-400 hover:border-blue-300/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {/* Subtle glow effect on focus */}
                  <div className="absolute inset-0 rounded-md bg-blue-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-blue-500/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200 shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transform"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Enhanced Google Sign-In Button */}
            <GoogleSignInButton />
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
};