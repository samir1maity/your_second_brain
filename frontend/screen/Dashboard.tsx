"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LinkGrid } from "@/components/links/LinkGrid";
import AddLinkDialog from "@/components/links/AddLinkDialog";
import { initialLinks } from "@/lib/data";
import { Link } from "@/types/link";
import { useAuth } from "@/lib/auth-context";
import { postContent } from "@/Api/content";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.description.toLowerCase().includes(search.toLowerCase()) ||
      link.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = category === "all" || link.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleAddLink = async (newLink: Omit<Link, "id">) => {
    // setLinks([...links, { ...newLink, id: links.length + 1 }]);
    console.log('user', user)
    console.log('user', user?.jwt_token)
    if(user?.jwt_token === undefined){
       return 
    }
    console.log('newLink', newLink)
    const response = await postContent(user?.jwt_token, newLink )
    setIsDialogOpen(false);
  };

  return (
    <>
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="min-h-screen">
        <TopBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          onAddClick={() => setIsDialogOpen(true)}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Main Content Area */}
        <div className="p-6 lg:ml-64">
          <LinkGrid links={filteredLinks} />
        </div>
      </main>
      <AddLinkDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddLink}
      />
    </>
  );
}
