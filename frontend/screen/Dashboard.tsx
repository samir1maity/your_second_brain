"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { LinkGrid } from "@/components/links/LinkGrid";
import AddLinkDialog from "@/components/links/AddLinkDialog";
// import { initialLinks } from "@/lib/data";
import { Link } from "@/types/link";
import { useAuth } from "@/lib/auth-context";
import { getContents, postContent, searchContent, getContentByTags } from "@/Api/content";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { ContentShimmer } from "@/components/ui/shimmer";
import { Tags } from "@/types/tag";
import { getAllTags } from "@/Api/tags";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [processingLinks, setProcessingLinks] = useState<string[]>([]);
  const { user } = useAuth();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState<Tags[]>([]);

  const handleAddLink = async (newLink: Link) => {
    if (!user?.jwt_token) return;
    
    // Create a temporary ID for the new link
    const tempId = uuidv4();
    
    // Create a temporary link object with processing flag
    const tempLink: Link = {
      ...newLink,
      id: tempId,
      isProcessing: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        title: newLink.title,
        description: newLink.contentText,
        ogImage: "",
        ogTitle: newLink.title,
        ogDescription: newLink.contentText
      },
      category: newLink.category || "uncategorized"
    };
    
    // Add the temporary link to the links array
    setLinks(prevLinks => [tempLink, ...prevLinks]);
    
    // Add the temp ID to processing links
    setProcessingLinks(prev => [...prev, tempId]);
    
    // Close the dialog
    setIsDialogOpen(false);
    
    try {
      // Post the content to the server
      await postContent(user.jwt_token, newLink);
      
      // Refresh all content to get the actual data
      resetAndFetchContent();
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      // Remove the temp ID from processing links
      setProcessingLinks(prev => prev.filter(id => id !== tempId));
    }
  };

  const resetAndFetchContent = useCallback(() => {
    setPage(1);
    setLinks([]);
    setHasMore(true);
    getAllContent(1, true);
  }, []);

  const getAllContent = useCallback(async (pageNum = page, replace = false) => {
    if (!user?.jwt_token) return;
    
    if (replace) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const results = await getContents(user.jwt_token, pageNum, limit);
      const newLinks = results?.data?.posts || [];
      
      if (newLinks.length < limit) {
        setHasMore(false);
      }
      
      if (replace) {
        setLinks(newLinks);
      } else {
        setLinks(prev => [...prev, ...newLinks]);
      }
      
      return newLinks.length;
    } catch (error) {
      console.error("Error fetching content:", error);
      setHasMore(false);
      return 0;
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [user?.jwt_token, page, limit]);

  const handleSearchContent = useCallback(async (searchTerm: string) => {
    if (!user?.jwt_token) return;
    
    setIsLoading(true);
    try {
      if (!searchTerm.trim()) {
        resetAndFetchContent();
        return;
      }
      const data = await searchContent(user.jwt_token, searchTerm, 1, limit);
      setLinks(data?.data || []);
      setHasMore(false); // No pagination for search results
    } catch (error) {
      console.error("Error searching content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.jwt_token, limit, resetAndFetchContent]);

  const fetchContentByTags = useCallback(async (tagNames: string[], pageNum = 1, replace = false) => {
    if (!user?.jwt_token || tagNames.length === 0) {
      // If no tags selected, fetch all content
      return resetAndFetchContent();
    }
    
    if (replace) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const results = await getContentByTags(user.jwt_token, tagNames, pageNum, limit);
      const newLinks = results?.data?.data || [];
      const pagination = results?.data?.pagination || {};
      
      if (newLinks.length < limit || pageNum >= pagination.pages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (replace) {
        setLinks(newLinks);
      } else {
        setLinks(prev => [...prev, ...newLinks]);
      }
      
      return newLinks.length;
    } catch (error) {
      console.error("Error fetching content by tags:", error);
      setHasMore(false);
      return 0;
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [user?.jwt_token, limit, resetAndFetchContent]);

  const handleTagSelect = useCallback((tagId: string | null) => {
    if (tagId === null) {
      // Clear all selected tags
      setSelectedTags([]);
      resetAndFetchContent();
    } else {
      // Toggle the selected tag
      const newSelectedTags = selectedTags.includes(tagId)
        ? selectedTags.filter(id => id !== tagId)
        : [...selectedTags, tagId];
      
      setSelectedTags(newSelectedTags);
      
      // If we have tags selected, fetch filtered content
      if (newSelectedTags.length > 0) {
        // Get the tag names from the tag IDs
        const tagNames = newSelectedTags.map(id => {
          const tag = tags.find(t => t.id === id);
          return tag ? tag.name : '';
        }).filter(name => name !== '');
        
        setPage(1); // Reset pagination
        fetchContentByTags(tagNames, 1, true);
      } else {
        // If no tags selected, fetch all content
        resetAndFetchContent();
      }
    }
  }, [selectedTags, tags, fetchContentByTags, resetAndFetchContent]);

  // Initial load
  useEffect(() => {
    if (user?.jwt_token) {
      resetAndFetchContent();
    }
  }, [user?.jwt_token, resetAndFetchContent]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (search.trim()) {
        handleSearchContent(search);
      } else if (user?.jwt_token) {
        resetAndFetchContent();
      }
    }, 300); 

    return () => clearTimeout(debounceTimeout);
  }, [search, handleSearchContent, resetAndFetchContent, user?.jwt_token]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore && !search.trim()) {
          setPage(prevPage => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );
    
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, search]);

  // Load more content when page changes
  useEffect(() => {
    if (page > 1 && hasMore && !search.trim()) {
      if (selectedTags.length > 0) {
        // Get the tag names from the tag IDs
        const tagNames = selectedTags.map(id => {
          const tag = tags.find(t => t.id === id);
          return tag ? tag.name : '';
        }).filter(name => name !== '');
        
        fetchContentByTags(tagNames, page, false);
      } else {
        getAllContent(page, false);
      }
    }
  }, [page, hasMore, getAllContent, fetchContentByTags, selectedTags, tags, search]);

  // Fetch tags when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      if (user?.jwt_token) {
        try {
          const fetchedTags = await getAllTags(user.jwt_token);
          setTags(fetchedTags);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      }
    };

    fetchTags();
  }, [user?.jwt_token]);

  if (!links && isLoading) {
    return <div>loading....</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed position */}
      <div className="fixed top-0 left-0 h-full z-30">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
      </div>
      
      {/* Main content area - with proper margin */}
      <div className="flex-1 flex flex-col min-h-screen w-full pt-16">
        {/* TopBar - fixed at the top of the content area */}
        <TopBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          onAddClick={() => setIsDialogOpen(true)}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Content with padding */}
        <main className="flex-1 p-6">
          {isLoading && links.length === 0 ? (
              <ContentShimmer />
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-[#1a1a1a] rounded-lg p-8 shadow-md lg:mx-64">
              <div className="mb-4">
                {search.trim() ? (
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-medium mb-2">
                {search.trim() ? "Hmm, nothing found" : "Your brain looks empty"}
              </h3>
              <p className="mb-4">
                {search.trim() 
                  ? "Your second brain couldn't find anything matching that search. Maybe try something less specific or check your spelling?" 
                  : "Time to feed your second brain with some knowledge! Add your first link to get started."}
              </p>
              {search.trim() ? (
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setSearch("")}
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    Clear Search
                  </Button>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Add New Link
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Add Your First Link
                </Button>
              )}
            </div>
          ) : (
            <>
              <LinkGrid 
                links={links} 
                processingLinks={processingLinks}
              />
              
              {/* Intersection observer target for infinite scroll */}
              <div 
                ref={observerTarget} 
                className="h-10 w-full mt-6 flex justify-center"
              >
                {isLoadingMore && (
                  <div className="flex items-center space-x-2 text-gray-400 lg:pl-64">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more...</span>
                  </div>
                )}
              </div>
              
              {!hasMore && links.length > 0 && !isLoadingMore && (
                <p className="text-center text-gray-500 mt-6 lg:pl-64">
                  You've reached the end of your content
                </p>
              )}
            </>
          )}
        </main>
      </div>
      
      <AddLinkDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddLink}
      />
    </div>
  );
}
