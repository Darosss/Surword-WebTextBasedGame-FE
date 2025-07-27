"use client";

import Link from "next/link";
import { FC } from "react";
import { X } from "lucide-react";
import { COOKIE_TOKEN_NAME } from "@/api/fetch";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../auth";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { UserDetails } from "../user";
import { loggedInLinks, loggedOutLinks } from "./links-list";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const pathname = usePathname();

  const router = useRouter();
  const handleOnLogout = () => {
    Cookies.remove(COOKIE_TOKEN_NAME);

    setIsLoggedIn(false);
    router.replace("/auth/login");
  };

  const navLinks = isLoggedIn ? loggedInLinks(handleOnLogout) : loggedOutLinks;

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-secondary md:border-r border-gray-700/50 z-[101] transition-transform duration-300 ease-in-out",
          "flex flex-col lg:header-size",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <Logo />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        {/* Hero Details Section */}
        {isLoggedIn && <UserDetails />}
        <nav className="flex-grow p-4 overflow-hidden">
          <ul className="space-y-2">
            {isLoggedIn &&
              navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-blue-800/50 hover:text-white transition-colors",
                      pathname === link.href &&
                        "bg-blue-700/60 text-white font-semibold"
                    )}
                    onClick={onClose}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
