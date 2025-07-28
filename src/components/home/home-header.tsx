"use client";
import { Star, TrendingUp, Crown } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { User } from "@/api/types";
import { HeroDetailsType } from "../auth/auth-context";
import Link from "next/link";

type HomeHeaderProps = {
  isLoggedIn: boolean;
  user: User;
  heroDetails: HeroDetailsType | null;
};

export const HomeHeader: FC<HomeHeaderProps> = ({
  isLoggedIn,
  user,
  heroDetails,
}) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/40" />
      <div className="relative container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Welcome to the Surword
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Embark on epic adventures, forge legendary weapons, and become the
            ultimate champion
          </p>

          {isLoggedIn && heroDetails ? (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700/50">
              <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
                Welcome back, {user.username}!
              </h2>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-400" />
                  Level {heroDetails.level}
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  {heroDetails.experience}/{heroDetails.neededExp} XP
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  {user.gold.toLocaleString()} Gold
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                <Link href="/auth/login">Start Your Journey</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-600 hover:bg-gray-700 text-lg px-8 py-3 bg-transparent"
              >
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
