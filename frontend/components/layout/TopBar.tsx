"use client";

import { Search, Plus, Moon, Sun, Settings, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { UserNav } from "@/components/layout/UserNav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // <div className="border-b border-border">
    //   <div className="flex items-center justify-between p-4">
    //     <div className="flex items-center flex-1 max-w-xl">
    //       <div className="relative flex-1">
    //         <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
    //         <Input
    //           placeholder="Search links..."
    //           className="pl-10"
    //           value={search}
    //           onChange={(e) => onSearchChange(e.target.value)}
    //         />
    //       </div>
    //       <Select value={category} onValueChange={onCategoryChange} >
    //         <SelectTrigger className="w-[180px]">
    //           <SelectValue placeholder="Category" />
    //         </SelectTrigger>
    //         <SelectContent>
    //           <SelectItem value="all">All Categories</SelectItem>
    //           <SelectItem value="social">Social</SelectItem>
    //           <SelectItem value="study">Study</SelectItem>
    //           <SelectItem value="docs">Documentation</SelectItem>
    //         </SelectContent>
    //       </Select>
    //     </div>

    //     <div className="flex items-center gap-4 ml-4">
    //       <Button
    //         variant="outline"
    //         size="icon"
    //         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    //       >
    //         {theme && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
    //       </Button>
    //       <Button onClick={onAddClick}>
    //         <Plus className="h-5 w-5 mr-2" />
    //         Add Link
    //       </Button>
    //       <UserNav />
    //     </div>
    //   </div>
    // </div>
    <header className="shadow-sm lg:ml-64">
    <div className="flex items-center justify-between p-4">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-600 hover:text-gray-900"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
          />
        </div>
      </div>

      <button onClick={onAddClick} className="flex items-center space-x-2 bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
        <Plus size={20} />
        <span>Add New</span>
      </button>
    </div>
  </header>
  );
}