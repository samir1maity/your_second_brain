"use client";

import { LayoutDashboard, Bookmark, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">LinkVault</h1>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <Bookmark className="mr-2 h-5 w-5" />
            All Links
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="lg">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
      </div>
    </div>
  );
}