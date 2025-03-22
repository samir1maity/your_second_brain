"use client";

import { Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  setSidebarOpen: (value: boolean) => void;
  onAddClick: () => void;
}

export function TopBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onAddClick,
  setSidebarOpen
}: TopBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 right-0 left-0 lg:left-64 z-20 transition-all duration-200 ${
      isScrolled ? 'bg-[#121212]/95 backdrop-blur-md shadow-lg' : 'bg-[#121212]'
    }`}>
      <div className="flex items-center h-16 px-4 md:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="mr-3 lg:hidden text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-[#252525] transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Search - takes most of the space */}
        <div className="flex-1 relative">
          <div className="relative w-full max-w-3xl mx-auto lg:mx-0 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1d1d1d] border-0 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/50 text-sm transition-all"
            />
          </div>
        </div>

        {/* Add new button - always visible but adapts to screen size */}
        <div className="ml-3">
          <Button 
            onClick={onAddClick} 
            className="hidden sm:flex items-center space-x-2 bg-[#1d1d1d] hover:bg-[#252525] text-white border-0 shadow-sm"
            size="sm"
          >
            <Plus size={16} className="text-teal-400" />
            <span>Add New</span>
          </Button>
          
          <Button 
            onClick={onAddClick} 
            className="sm:hidden flex items-center justify-center w-9 h-9 p-0 rounded-md bg-[#1d1d1d] hover:bg-[#252525] text-teal-400 border-0 shadow-sm"
            size="icon"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}