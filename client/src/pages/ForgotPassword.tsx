import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implement forgot password API call
      console.log("Reset password for:", email);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center my-12">
          <div className="container max-w-md text-center space-y-6 animate-fade-in">
            <CheckCircle className="w-16 h-16 text-accent mx-auto" />
            <h1 className="text-4xl font-light">Check Your Email</h1>
            <p className="text-lg text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>. Check your email and follow the instructions to reset your password.
            </p>
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setSubmitted(false)}
                className="text-accent hover:underline"
              >
                try again
              </button>
              .
            </p>
            <Link href="/login">
              <a>
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex-1 flex items-center justify-center py-12 md:py-0 my-12">
        <div className="container max-w-md">
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
              <Link href="/login">
                <a className="inline-flex items-center gap-2 text-accent hover:underline">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </a>
              </Link>
              <h1 className="text-4xl md:text-5xl font-light mt-4">
                Reset Password
              </h1>
              <p className="text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="luxury-button w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            {/* Help Text */}
            <div className="p-4 bg-secondary/50 rounded-lg text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Need help?</p>
              <p>
                If you don't have access to your email, please{" "}
                <a href="mailto:support@mayiljewels.com" className="text-accent hover:underline">
                  contact our support team
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
