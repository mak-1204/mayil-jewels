import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { signinFirebase } from "@/lib/firebase";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signinFirebase(email, password);
      setLocation("/admin");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Google Sign-In is not enabled. Please log in with Email & Password (e.g. admin@mayiljewels.com).");
  };

  return (
    <PageLayout>
      <div className="flex-1 flex items-center justify-center py-12 md:py-0 my-12">
        <div className="container max-w-md">
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-light">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to your Mayil Jewels account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link href="/forgot-password">
                    <a className="text-sm text-accent hover:underline">
                      Forgot password?
                    </a>
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="luxury-button w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Administrator Note */}
            <div className="pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                This portal is restricted to authorized store administrators only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
