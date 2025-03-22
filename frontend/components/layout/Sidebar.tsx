import { BarChart2, Home, Settings, Users, X, Tag, Search, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export type SidebarProps = {
  sidebarOpen: boolean; 
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTags?: string[];
  onTagSelect?: (tagId: string) => void;
};

export function Sidebar({ sidebarOpen, setSidebarOpen, selectedTags = [], onTagSelect }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);
  
  // Hardcoded tags data
  const hardcodedTags = [
    { id: "1", name: "JavaScript" },
    { id: "2", name: "React" },
    { id: "3", name: "TypeScript" },
    { id: "4", name: "Node.js" },
    { id: "5", name: "CSS" },
    { id: "6", name: "HTML" },
    { id: "7", name: "Next.js" },
    { id: "8", name: "Database" },
    { id: "9", name: "API" },
    { id: "10", name: "Frontend" },
    { id: "11", name: "Backend" },
    { id: "12", name: "DevOps" },
  ];

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Tag, label: "Tags", href: "/tags" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const filteredTags = hardcodedTags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = localSelectedTags.includes(tagId)
      ? localSelectedTags.filter(id => id !== tagId)
      : [...localSelectedTags, tagId];
    
    setLocalSelectedTags(newSelectedTags);
    
    if (onTagSelect) {
      onTagSelect(tagId);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-[#171717] text-white p-4 transform transition-transform duration-300 ease-in-out z-30 flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">YSB</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mb-6">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-[#252525] transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-2 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tags</h2>
          {localSelectedTags.length > 0 && (
            <button 
              onClick={() => setLocalSelectedTags([])}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Clear all
            </button>
          )}
        </div>
        
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#252525] rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {localSelectedTags.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-2">Selected tags:</div>
            <div className="flex flex-wrap gap-2">
              {localSelectedTags.map(tagId => {
                const tag = hardcodedTags.find(t => t.id === tagId);
                return tag ? (
                  <div 
                    key={tag.id} 
                    className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 flex items-center"
                  >
                    <span className="mr-1">{tag.name}</span>
                    <button 
                      onClick={() => handleTagToggle(tag.id)}
                      className="hover:bg-blue-700 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        <div className="overflow-y-auto max-h-[calc(100vh-350px)] space-y-1 pr-1 custom-scrollbar">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => {
              const isSelected = localSelectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`flex items-center w-full text-left p-2 rounded-md text-sm transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "hover:bg-[#252525] text-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 mr-2 flex-shrink-0 rounded border ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-gray-500'} flex items-center justify-center`}>
                    {isSelected && <Check size={12} />}
                  </div>
                  <span className="truncate">{tag.name}</span>
                </button>
              );
            })
          ) : (
            <div className="text-gray-400 text-sm py-2 text-center">
              No tags found
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-[#333333]">
        <div className="flex items-center p-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
            <span className="font-medium text-sm">US</span>
          </div>
          <div className="text-sm">
            <p className="font-medium">User Name</p>
            <p className="text-gray-400 text-xs">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
