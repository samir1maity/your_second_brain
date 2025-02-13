"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LinkGrid } from "@/components/links/LinkGrid";
import AddLinkDialog from "@/components/links/AddLinkDialog";
import { initialLinks } from "@/lib/data";
import { Link } from "@/types/link";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredLinks = links.filter((link) => {
    const matchesSearch = link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.description.toLowerCase().includes(search.toLowerCase()) ||
      link.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = category === "all" || link.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddLink = (newLink: Omit<Link, "id">) => {
    setLinks([...links, { ...newLink, id: links.length + 1 }]);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1">
        <TopBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          onAddClick={() => setIsDialogOpen(true)}
        />
        
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