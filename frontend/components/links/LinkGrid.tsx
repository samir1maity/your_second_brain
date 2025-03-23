"use client";

import { LinkCard } from "@/components/links/LinkCard";
import { Link } from "@/types/link";

interface LinkGridProps {
  links: Link[];
  processingLinks?: string[];
}

export function LinkGrid({ links, processingLinks = [] }: LinkGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:pl-64">
      {links.map((link) => (
        <LinkCard 
          key={link.id} 
          link={link} 
          isProcessing={processingLinks.includes(link.id) || link.isProcessing}
        />
      ))}
    </div>
  );
}