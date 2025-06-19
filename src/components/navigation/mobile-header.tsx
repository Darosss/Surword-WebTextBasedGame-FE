"use client";

import { Menu } from "lucide-react";
import { Button } from "../components/ui/button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden z-[101] fixed top-0 left-0 h-16 backdrop-blur-lg border-b border-gray-700/50 z-30 flex items-center px-4">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </header>
  );
}
