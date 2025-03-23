'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, LogIn, UserPlus, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "@/lib/auth-context";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Don't show navigation on login and signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user && !isAuthPage) {
      router.push('/dashboard');
    }
  }, [user, isLoading, isAuthPage, router]);
  
  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.href.includes(window.location.pathname)) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL without page reload
          window.history.pushState({}, '', anchor.hash);
          closeMobileMenu();
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gradient">Your Second Brain</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/#features" className="text-foreground/80 hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
                How It Works
              </Link>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login" className="flex items-center space-x-1">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button className="button-glow" asChild>
                  <Link href="/signup" className="flex items-center space-x-1">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-foreground p-2 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-background border-b border-border`}>
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              href="/" 
              className="block px-3 py-2 text-foreground/80 hover:text-primary hover:bg-secondary/30 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              href="/#features" 
              className="block px-3 py-2 text-foreground/80 hover:text-primary hover:bg-secondary/30 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="block px-3 py-2 text-foreground/80 hover:text-primary hover:bg-secondary/30 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              How It Works
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Button variant="ghost" asChild className="justify-start">
                <Link href="/login" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link href="/signup" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow pt-[76px]">
        {children}
      </main>
      
      <footer className="bg-background border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-gradient font-semibold">Your Second Brain</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
              <p className="text-foreground/50 text-sm">
                © {new Date().getFullYear()} Your Second Brain. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
