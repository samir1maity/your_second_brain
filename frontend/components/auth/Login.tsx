"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Brain, ArrowLeft, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login successful! 🎉 Redirecting...");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error);
      setError(error?.message || "Invalid email or password. Please try again.");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow -z-10"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow -z-10"></div>
      
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
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your second brain
              It&apos;s a great day!
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
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
                <Button 
                  type="submit" 
                  className="w-full button-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-foreground/60">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-white/10 bg-background/50" disabled={isLoading}>
                Google
              </Button>
              <Button variant="outline" className="border-white/10 bg-background/50" disabled={isLoading}>
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-foreground/70">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
