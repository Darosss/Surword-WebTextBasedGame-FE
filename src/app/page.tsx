"use client";

import { useAuthContext } from "@/components/auth";
import { HomeHeader } from "@/components/home/home-header";
import { HomeQuickAcions } from "@/components/home/home-quick-actions";
import { HomeFeatures } from "@/components/home/home-features";
import { HomeFooter } from "@/components/home/home-footer";

export default function HomePage() {
  const { isLoggedIn, heroDetails, user } = useAuthContext();

  return (
    <div className="min-h-screen w-full overflow-auto">
      <HomeHeader
        isLoggedIn={isLoggedIn}
        heroDetails={heroDetails}
        user={user}
      />

      <HomeQuickAcions />
      <HomeFeatures />
      <HomeFooter isLoggedIn={isLoggedIn} />
    </div>
  );
}
