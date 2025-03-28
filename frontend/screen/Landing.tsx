'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  SearchIcon, 
  FileText, 
  Folder, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Book,
  Bookmark,
  Database
} from 'lucide-react';
import Link from 'next/link';
import HeroAnimation from '@/components/Landing/hero-animation';

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    // Animation on scroll
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observerRef.current?.observe(el);
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 glass-panel bg-grid">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
              <div className="flex items-center px-4 py-2 bg-secondary/40 backdrop-blur-md rounded-full mb-6 border border-white/5">
                <span className="text-xs md:text-sm text-foreground/70">Powered by AI + AI-powered contextual search</span>
                <div className="w-2 h-2 bg-primary rounded-full ml-3 mr-1 animate-pulse"></div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-shadow">
                Your <span className="text-gradient">Second Brain</span> <br />
                for Everything
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl leading-relaxed mb-8">
                Save content from anywhere, find it instantly with context-based search, 
                powered by advanced AI and vector embeddings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button className="button-glow text-lg py-6 px-8" size="lg" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg py-6 px-8 border-white/10" asChild>
                  <Link href="/#how-it-works" className="flex items-center gap-2">
                    See How It Works <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 mt-8 lg:mt-0 flex items-center justify-center sm:p-5">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-background px-5">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock the Power of Your <span className="text-gradient">Second Brain</span></h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              A revolutionary way to store, organize, and retrieve your digital content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="glass-card hover-card animate-on-scroll">
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                  <Folder className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Save Everything</h3>
                <p className="text-foreground/70">
                  Effortlessly save articles, notes, images, and more into your organized digital brain.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="glass-card hover-card animate-on-scroll">
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                  <SearchIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Context-Based Search</h3>
                <p className="text-foreground/70">
                  Find exactly what you're looking for by describing it in natural language.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="glass-card hover-card animate-on-scroll">
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
                <p className="text-foreground/70">
                  Our advanced AI understands the meaning behind your content for better retrieval.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 4 */}
            <Card className="glass-card hover-card animate-on-scroll">
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Vector Embeddings</h3>
                <p className="text-foreground/70">
                  Revolutionary similarity search technology that understands content relationships.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 5 */}
            <Card className="glass-card hover-card animate-on-scroll">
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                  <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Categories</h3>
                <p className="text-foreground/70">
                  Organize content with intelligent categorization that adapts to your needs.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 6 */}
            <Card className="glass-card hover-card animate-on-scroll">
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Contextual Recall</h3>
                <p className="text-foreground/70">
                  Ask questions in natural language and get meaningful answers from your stored content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background gradient-dots px-5">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Your <span className="text-gradient">Second Brain</span> Works</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Three simple steps to unlock your digital memory potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Save Content</h3>
              <p className="text-foreground/70 mb-4">
                Clip articles, save notes, bookmark pages, or upload files - your Second Brain remembers it all.
              </p>
              <div className="mt-auto pt-4">
                <Book className="h-10 w-10 text-primary/60 mx-auto" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Processing</h3>
              <p className="text-foreground/70 mb-4">
                Our intelligent system analyzes and indexes your content, creating vector embeddings for advanced retrieval.
              </p>
              <div className="mt-auto pt-4">
                <Zap className="h-10 w-10 text-primary/60 mx-auto" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Instantly</h3>
              <p className="text-foreground/70 mb-4">
                Simply describe what you're looking for in natural language, and your Second Brain retrieves the exact information.
              </p>
              <div className="mt-auto pt-4">
                <SearchIcon className="h-10 w-10 text-primary/60 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden glass-panel">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
        
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-shadow animate-on-scroll">Ready to Upgrade Your Digital Memory?</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8 animate-on-scroll">
            Join thousands of knowledge workers who've transformed how they store and retrieve information.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-on-scroll">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
          
          <Button className="button-glow text-lg py-6 px-8 animate-on-scroll" size="lg" asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;
