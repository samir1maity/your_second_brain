"use client";

import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  rounded?: string;
}

export function Shimmer({ 
  className, 
  height = "100%", 
  width = "100%", 
  rounded = "md" 
}: ShimmerProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-[#1a1a1a] via-[#232323] to-[#1a1a1a] bg-[length:400%_100%]",
        `rounded-${rounded}`,
        className
      )}
      style={{ 
        height, 
        width,
        backgroundPosition: "0% 0%",
        animation: "shimmer 1.5s infinite linear"
      }}
    />
  );
}

export function LinkCardShimmer() {
  return (
    <div className="border border-[#232323] bg-[#121212] rounded-lg overflow-hidden h-[280px] flex flex-col">
      <div className="h-36 w-full">
        <Shimmer height="100%" rounded="none" />
      </div>
      <div className="p-4 flex-1 flex flex-col space-y-3">
        <Shimmer height={20} width="85%" rounded="sm" />
        <Shimmer height={16} width="60%" rounded="sm" />
        <div className="mt-auto flex items-center justify-between">
          <Shimmer height={14} width={80} rounded="full" />
          <Shimmer height={24} width={24} rounded="full" />
        </div>
      </div>
    </div>
  );
}

export function ContentShimmer() {
  return (
    <div className="w-full space-y-8 lg:pl-64">
      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {[...Array(15)].map((_, i) => (
          <LinkCardShimmer key={i} />
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
} 