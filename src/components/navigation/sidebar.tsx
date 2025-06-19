"use client";

import Link from "next/link";
import { FC, type JSX } from "react";
import {
  X,
  Swords,
  Shield,
  Users,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { COOKIE_TOKEN_NAME } from "@/api/fetch";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../auth";
import { Button } from "../components/ui/button";
import Logo from "./Logo";
import { cn } from "../lib/utils";
import { UserDetails } from "../user";

type LinksType = {
  href: string;
  label: string;
  icon: JSX.Element;
  isButton?: boolean;
  action?: () => void;
};

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
  const commonLinks: LinksType[] = [
    {
      href: "/overview",
      label: "Overview",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      href: "/skirmishes",
      label: "Skirmishes",
      icon: <Swords className="h-5 w-5" />,
    },
    {
      href: "/dungeons",
      label: "Dungeons",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      href: "/leaderboards",
      label: "Leaderboards",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const loggedInLinks: LinksType[] = [
    ...commonLinks,
    {
      href: "#",
      label: "Logout",
      icon: <LogOut className="h-5 w-5" />,
      action: handleOnLogout,
      isButton: true,
    },
  ];

  const loggedOutLinks: LinksType[] = [
    {
      href: "/auth/login",
      label: "Login",
      icon: <LogIn className="h-5 w-5" />,
      isButton: true,
    },
    {
      href: "/auth/register",
      label: "Register",
      icon: <UserPlus className="h-5 w-5" />,
      isButton: true,
    },
  ];

  const navLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-secondary md: border-r border-gray-700/50 z-[101] transition-transform duration-300 ease-in-out",
          "flex flex-col md:header-size",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
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
