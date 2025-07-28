"use client";

import { ChevronRight, Map, Shield, Swords, Trophy } from "lucide-react";
import { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const quickActions = [
  {
    title: "Character Overview",
    description: "Review your heroes, manage equipment, and track progression",
    icon: Shield,
    href: "/overview",
    color: "from-blue-600 to-blue-800",
    hoverColor: "hover:from-blue-500 hover:to-blue-700",
    badge: "Essential",
    badgeColor: "bg-blue-500",
  },
  {
    title: "Leaderboards",
    description: "See how you rank against other adventurers",
    icon: Trophy,
    href: "/leaderboards",
    color: "from-yellow-600 to-orange-600",
    hoverColor: "hover:from-yellow-500 hover:to-orange-500",
    badge: "Competitive",
    badgeColor: "bg-yellow-500",
  },
  {
    title: "Skirmishes",
    description: "Quick battles for experience and loot",
    icon: Swords,
    href: "/skirmishes",
    color: "from-red-600 to-red-800",
    hoverColor: "hover:from-red-500 hover:to-red-700",
    badge: "Action",
    badgeColor: "bg-red-500",
  },
  {
    title: "Dungeons",
    description: "Challenging expeditions with epic rewards",
    icon: Map,
    href: "/dungeons",
    color: "from-purple-600 to-purple-800",
    hoverColor: "hover:from-purple-500 hover:to-purple-700",
    badge: "Epic",
    badgeColor: "bg-purple-500",
  },
];

export const HomeQuickAcions: FC = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4">
          Choose Your Path
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Every great adventure begins with a single step. Where will your
          journey take you today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Link key={action.title} href={action.href} className="group">
              <Card
                className={`
                relative overflow-hidden border-gray-700/50 bg-gradient-to-br ${action.color} 
                transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl
                ${action.hoverColor} group-hover:border-gray-600 h-full justify-center
              `}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4">
                  <Badge className={`${action.badgeColor} text-white border-0`}>
                    {action.badge}
                  </Badge>
                </div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-2 group-hover:text-yellow-200 transition-colors">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        {action.description}
                      </CardDescription>
                    </div>
                    <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
