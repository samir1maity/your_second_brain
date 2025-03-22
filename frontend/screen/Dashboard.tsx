"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LinkGrid } from "@/components/links/LinkGrid";
import AddLinkDialog from "@/components/links/AddLinkDialog";
// import { initialLinks } from "@/lib/data";
import { Link } from "@/types/link";
import { useAuth } from "@/lib/auth-context";
import { getContents, postContent, searchContent } from "@/Api/content";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth();

  // const filteredLinks = links.filter((link) => {
  //   const matchesSearch =
  //     link.title.toLowerCase().includes(search.toLowerCase()) ||
  //     link.description.toLowerCase().includes(search.toLowerCase()) ||
  //     link.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

  //   const matchesCategory = category === "all" || link.category === category;

  //   return matchesSearch && matchesCategory;
  // });

  const handleAddLink = async (newLink: Link) => {
    if (!user?.jwt_token) return;
    try {
      const response = await postContent(user.jwt_token, newLink);
      await getAllContent();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const getAllContent = async () => {
    if (!user?.jwt_token) return;
    
    setIsLoading(true);
    try {
      const results = await getContents(user.jwt_token);
      setLinks(results?.data?.posts || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchContent = async (searchTerm: string) => {
    if (!user?.jwt_token) return;
    
    setIsLoading(true);
    try {
      if (!searchTerm.trim()) {
        console.log('reached here')
        await getAllContent();
        return;
      }
      const data = await searchContent(user.jwt_token, searchTerm, page, limit);
      setLinks(data?.data || []);
    } catch (error) {
      console.error("Error searching content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllContent();
  }, [user?.jwt_token]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearchContent(search);
    }, 300); 

    return () => clearTimeout(debounceTimeout);
  }, [search, page, limit]);

  if (!links) {
    return <div>loading....</div>;
  }

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
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {search.trim() 
                ? "No results found for your search" 
                : "No content available yet. Click 'Add Link' to get started!"}
            </div>
          ) : (
            <LinkGrid links={links} />
          )}
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
