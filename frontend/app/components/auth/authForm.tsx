"use client"

import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';

interface AuthFormProps {
  theme: string;
  isLogin: boolean;
}

export function AuthForm({ theme, isLogin }: AuthFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className={`block text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Email
        </label>
        <div className="relative group">
          <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-500 group-focus-within:text-violet-400' : 'text-gray-400 group-focus-within:text-violet-600'
          }`} />
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-violet-500 placeholder-gray-500'
                : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-violet-500 placeholder-gray-400'
            } border-2`}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className={`block text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Password
        </label>
        <div className="relative group">
          <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-500 group-focus-within:text-violet-400' : 'text-gray-400 group-focus-within:text-violet-600'
          }`} />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-violet-500 placeholder-gray-500'
                : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-violet-500 placeholder-gray-400'
            } border-2`}
            required
          />
        </div>
      </div>

      {isLogin && (
        <div className="flex justify-end">
          <button
            type="button"
            className={`text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-violet-400' 
                : 'text-gray-600 hover:text-violet-600'
            }`}
          >
            Forgot password?
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
        } ${loading ? 'opacity-80 cursor-not-allowed' : ''} shadow-lg`}
      >
        <div className="flex items-center justify-center">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          )}
        </div>
      </button>
    </form>
  );
}