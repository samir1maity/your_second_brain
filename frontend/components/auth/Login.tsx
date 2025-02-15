"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { WavesIcon } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful! 🎉 Redirecting...");
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Toaster position="top-right" richColors />
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="hidden w-1/2 bg-blue-600 p-10 lg:flex flex-col items-center justify-center text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">
            New Scheduling And Routing Options
          </h2>
          <p className="mb-8 text-blue-100">
            We just updated the format of products and rewards.
          </p>
          <Image
            src="/placeholder.svg"
            alt="Scheduling Interface"
            width={400}
            height={400}
            className="mx-auto"
            priority
          />
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <div className="mx-auto max-w-md space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="rounded-full bg-blue-50 p-2">
                <WavesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Hello Again!
              </h1>
              <p className="text-sm text-gray-500">
                Aliquam consectetur et placerat non orci.
              </p>
            </div>
            <div className="space-y-4">
              <Input type="email" placeholder="Email" />
              <div className="space-y-2">
                <Input type="password" placeholder="Password" />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Recovery Password
                  </Link>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleSubmit}
              >
                Login
              </Button>
              <div className="relative flex items-center justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
              <Button variant="outline" className="w-full" size="lg">
                <Image
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Sign in with Google
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
