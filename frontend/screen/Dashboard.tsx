"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LinkGrid } from "@/components/links/LinkGrid";
import AddLinkDialog from "@/components/links/AddLinkDialog";
// import { initialLinks } from "@/lib/data";
import { Link } from "@/types/link";
import { useAuth } from "@/lib/auth-context";
import { getContents, postContent, searchContent } from "@/Api/content";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user } = useAuth();

  const handleAddLink = async (newLink: Link) => {
    if (!user?.jwt_token) return;
    try {
      setIsLoading(true);
      const response = await postContent(user.jwt_token, newLink);
      await getAllContent();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllContent = useCallback(async () => {
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
  }, [user?.jwt_token]);

  const handleSearchContent = useCallback(async (searchTerm: string) => {
    if (!user?.jwt_token) return;
    
    setIsLoading(true);
    try {
      if (!searchTerm.trim()) {
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
  }, [user?.jwt_token, page, limit, getAllContent]);

  const handleTagSelect = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // Initial load
  useEffect(() => {
    if (user?.jwt_token) {
      getAllContent();
    }
  }, [user?.jwt_token, getAllContent]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (search.trim()) {
        handleSearchContent(search);
      }
    }, 300); 

    return () => clearTimeout(debounceTimeout);
  }, [search, handleSearchContent]);

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
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />
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
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
              <p className="mt-4 text-gray-400">Loading your content...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-[#1a1a1a] rounded-lg p-8 shadow-md">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No content found</h3>
              <p className="mb-4">
                {search.trim() 
                  ? "No results found for your search" 
                  : "No content available yet. Click 'Add Link' to get started!"}
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Add Your First Link
              </Button>
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
