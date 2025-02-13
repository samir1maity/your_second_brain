"use client";

import { Search, Plus, Moon, Sun, Settings, User } from "lucide-react";
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

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onAddClick: () => void;
}

export function TopBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onAddClick,
}: TopBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              className="pl-10"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={onCategoryChange} >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="study">Study</SelectItem>
              <SelectItem value="docs">Documentation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button onClick={onAddClick}>
            <Plus className="h-5 w-5 mr-2" />
            Add Link
          </Button>
          <UserNav />
        </div>
      </div>
    </div>
  );
}