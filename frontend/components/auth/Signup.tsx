"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner";
import { userSignup } from '@/Api/user';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await userSignup(email, password);
      toast.success("Account created successfully! 🎉");
      router.push("/dashboard");
    } catch (error: any) {
      setError(error?.message || "Failed to create account. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid -z-10"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow -z-10"></div>
      
      <div className="w-full max-w-md">
        <div className="flex justify-start mb-6">
          <Link href="/" className="flex items-center text-foreground/70 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to home</span>
          </Link>
        </div>
        
        <Card className="glass-card border-white/5 animate-fade-in">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Start organizing your second brain today
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-background/50 border-white/10"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-background/50 border-white/10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-white/10"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 border-white/10"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <Button 
                  type="submit" 
                  className="w-full button-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
            
            <div className="space-y-3 mt-2">
              <div className="flex items-center text-sm text-foreground/70">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Free to start, no credit card required</span>
              </div>
              <div className="flex items-center text-sm text-foreground/70">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Store up to 100 items in the free plan</span>
              </div>
              <div className="flex items-center text-sm text-foreground/70">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Advanced AI processing on all plans</span>
              </div>
            </div>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-foreground/60">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="border-white/10 bg-background/50"
                disabled={isLoading}
              >
                Google
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 bg-background/50"
                disabled={isLoading}
              >
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-foreground/70">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
