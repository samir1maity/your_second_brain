"use client";

import { ExternalLink, Clock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Link } from "@/types/link";
import { useState } from "react";

interface LinkCardProps {
  link: Link;
  isProcessing?: boolean;
}

export function LinkCard({ link, isProcessing = false }: LinkCardProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop';
  
  // Format date to show how long ago
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className={`group overflow-hidden border-0 bg-[#1a1a1a] shadow-md hover:shadow-lg transition-all duration-300 ${isProcessing ? 'opacity-80' : ''}`}>
      <div className="relative aspect-video overflow-hidden bg-[#111]">
        <Image
          src={link?.metadata?.ogImage && !imageError ? link.metadata.ogImage : fallbackImage}
          alt={link.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
        
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge className="bg-yellow-600 text-white px-2 py-1 flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Processing
            </Badge>
          </div>
        )}
        
        {/* <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white"
        >
          <Bookmark className="h-4 w-4" />
        </Button> */}
        
        <div className="absolute bottom-2 left-2 flex items-center text-xs text-gray-300">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatDate(link.createdAt)}</span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-100 line-clamp-1">{link.title}</h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
          </a>
        </div>
        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
          { link.contentText || "No description available"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {link?.tags?.length ? (
            link.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-[#252525] text-gray-300 border-[#333]">
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-xs bg-[#252525] text-gray-300 border-[#333]">
              Uncategorized
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
