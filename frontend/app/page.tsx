import Image from "next/image";
import React, { useState } from 'react';
import { Sun, Moon, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { AuthForm } from './components/AuthForm';

export default function Home() {

  const { theme, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#121212]' : 'bg-[#f8f9fa]'
    }`}>
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 text-amber-400' 
            : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg'
        }`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>

      <div className="container mx-auto min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg relative">
          {/* Background Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          {/* Main Card */}
          <div className={`relative backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/90 border border-gray-800' 
              : 'bg-white/90 shadow-2xl'
          }`}>
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-pink-600 to-blue-600"></div>

            <div className="p-8 sm:p-12">
              {/* Logo/Icon */}
              <div className="mb-8 text-center">
                <div className={`inline-flex p-3 rounded-full mb-4 ${
                  theme === 'dark' 
                    ? 'bg-gray-800' 
                    : 'bg-gray-100'
                }`}>
                  {isLogin ? (
                    <LogIn className={`w-8 h-8 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
                  ) : (
                    <UserPlus className={`w-8 h-8 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} />
                  )}
                </div>
                <h1 className={`text-4xl font-bold mb-3 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className={`text-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isLogin ? 'Sign in to your account' : 'Start your journey with us'}
                </p>
              </div>

              <AuthForm theme={theme} isLogin={isLogin} />

              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-violet-400' 
                      : 'text-gray-600 hover:text-violet-600'
                  }`}
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
