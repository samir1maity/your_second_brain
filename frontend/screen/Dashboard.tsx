"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LinkGrid } from "@/components/links/LinkGrid";
import AddLinkDialog from "@/components/links/AddLinkDialog";
import { initialLinks } from "@/lib/data";
import { Link } from "@/types/link";
import { Menu, Plus, Search } from "lucide-react";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.description.toLowerCase().includes(search.toLowerCase()) ||
      link.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = category === "all" || link.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleAddLink = (newLink: Omit<Link, "id">) => {
    setLinks([...links, { ...newLink, id: links.length + 1 }]);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="!ml-64 min-h-screen">
        <TopBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          onAddClick={() => setIsDialogOpen(true)}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Main Content Area */}
        <div className="p-6">
          <LinkGrid links={filteredLinks} />
        </div>
      </div>
      <AddLinkDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddLink}
      />
    </div>
  );
}
