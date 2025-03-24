"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { 
  X, 
  Search, 
  Tag, 
  LogOut,
  User,
  Check,
  ChevronDown,
  ChevronRight,
  Hash
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllTags } from "@/Api/tags";
import { Tags } from "@/types/tag";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Logo from "../Landing/logo";

interface SidebarProps {
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void;
  selectedTags: string[];
  onTagSelect: (tagId: string | null) => void;
}

export function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen,
  selectedTags,
  onTagSelect
}: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);
  const [tags, setTags] = useState<Tags[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      if (user?.jwt_token) {
        try {
          const tags = await getAllTags(user.jwt_token);
          setTags(tags);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      }
    };

    fetchTags();
  }, [user]);

  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = localSelectedTags.includes(tagId)
      ? localSelectedTags.filter(id => id !== tagId)
      : [...localSelectedTags, tagId];
    
    setLocalSelectedTags(newSelectedTags);
    
    if (onTagSelect) {
      onTagSelect(tagId);
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearAllTags = () => {
    setLocalSelectedTags([]);
    if (onTagSelect) {
      onTagSelect(null); 
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-[#232323] transition-transform duration-300 ease-in-out transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-[#232323]">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {/* Tags section */}
          <Collapsible 
            open={isTagsOpen} 
            onOpenChange={setIsTagsOpen}
            className="mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                  {isTagsOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                  <Tag className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Tags</span>
                </Button>
              </CollapsibleTrigger>
              
              {localSelectedTags.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllTags}
                  className="text-xs text-teal-400 hover:text-teal-300 p-0 h-auto hover:bg-transparent"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <CollapsibleContent>
              {/* Tag search */}
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-[#1a1a1a] border-[#333] text-sm h-8"
                />
              </div>
              
              {/* Selected tags */}
              {localSelectedTags.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {localSelectedTags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <Badge 
                          key={tag.id} 
                          variant="secondary"
                          className="bg-teal-900/30 hover:bg-teal-800/40 text-teal-300 border-teal-800/50 flex items-center gap-1 px-2 py-0.5"
                        >
                          <Hash className="h-3 w-3" />
                          {tag.name}
                          <button 
                            onClick={() => handleTagToggle(tag.id)}
                            className="ml-1 hover:bg-teal-800/60 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
              {/* Tag list */}
              <div className="space-y-1 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {isLoading ? (
                  <div className="text-center py-3">
                    <div className="animate-spin h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-xs text-gray-400">Loading tags...</p>
                  </div>
                ) : filteredTags.length > 0 ? (
                  filteredTags.map((tag) => {
                    const isSelected = localSelectedTags.includes(tag.id);
                    return (
        <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={cn(
                          "flex items-center w-full text-left p-2 rounded-md text-sm transition-colors",
                          isSelected 
                            ? "bg-teal-900/30 text-teal-300" 
                            : "text-gray-300 hover:bg-[#1e1e1e]"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 mr-2 flex-shrink-0 rounded border flex items-center justify-center",
                          isSelected ? "bg-teal-600 border-teal-500" : "border-gray-600"
                        )}>
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span className="truncate">{tag.name}</span>
        </button>
                    );
                  })
                ) : (
                  <div className="text-center py-3">
                    <p className="text-xs text-gray-400">No tags found</p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
      </div>

        {/* User profile and logout section */}
        <div className="p-4 border-t border-[#232323]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#1e1e1e] p-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full p-2 shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-medium truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-[#1a1a1a] border-[#333]">
              <DropdownMenuItem 
                className="text-red-400 focus:text-red-400 focus:bg-[#252525] cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
