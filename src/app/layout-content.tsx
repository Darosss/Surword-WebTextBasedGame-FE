"use client";
import { AuthContextProvider } from "@/components/auth";
import { ToastContainer } from "react-toastify";
import { FC, ReactNode, useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileHeader } from "@/components/navigation/mobile-header";

type LayoutContentProps = {
  children: ReactNode;
};

export const LayoutContent: FC<LayoutContentProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex z-[100]">
      <AuthContextProvider>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <ToastContainer />
        <div className="w-full h-screen flex grow md:ml-[20dvw] ml-0 z-[100] pb-1 pr-1">
          {children}
        </div>
      </AuthContextProvider>
    </div>
  );
};
