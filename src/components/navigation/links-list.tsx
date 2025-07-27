import { type JSX } from "react";
import { Swords, Shield, Users, LogOut, LogIn, UserPlus } from "lucide-react";

export type LinksType = {
  href: string;
  label: string;
  icon: JSX.Element;
  isButton?: boolean;
  action?: () => void;
};
export const commonLinks: LinksType[] = [
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

export const loggedInLinks = (handleOnLogout: () => void): LinksType[] => [
  ...commonLinks,
  {
    href: "#",
    label: "Logout",
    icon: <LogOut className="h-5 w-5" />,
    action: handleOnLogout,
    isButton: true,
  },
];

export const loggedOutLinks: LinksType[] = [
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
