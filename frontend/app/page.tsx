"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/signin");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl font-bold mb-6">Welcome to Your2ndBrain</h1>
        <p className="text-xl mb-8">
          Your personal knowledge management system for saving, organizing, and retrieving information.
        </p>
        <div className="animate-pulse text-gray-400">
          Redirecting you to the right place...
        </div>
      </div>
    </div>
  );
}
