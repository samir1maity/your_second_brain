"use client"

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WavesIcon } from "lucide-react";
import { useState } from "react";
import { userSignup } from "@/Api/user";

export default function SignupPage() {

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  async function handleSignup(){
    await userSignup(email, password)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="hidden w-1/2 bg-blue-600 p-10 lg:flex flex-col items-center justify-center text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">New Scheduling And Routing Options</h2>
          <p className="mb-8 text-blue-100">We just updated the format of products and rewards.</p>
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
              <h1 className="text-2xl font-semibold text-gray-900">Create an Account</h1>
              <p className="text-sm text-gray-500">Join us to get started.</p>
            </div>
            <div className="space-y-4">
              <Input type="text" placeholder="Name" />
              <Input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
              <div className="space-y-2">
                <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleSignup}>Sign Up</Button>
              <div className="relative flex items-center justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
              <Button variant="outline" className="w-full" size="lg">
                <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} className="mr-2" />
                Sign up with Google
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
