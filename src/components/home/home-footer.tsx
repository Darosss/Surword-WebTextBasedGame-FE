"use client";
import { Sparkles } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

type HomeFooterProps = {
  isLoggedIn: boolean;
};

export const HomeFooter: FC<HomeFooterProps> = ({ isLoggedIn }) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700/50 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4">
            Your Legend Begins Now
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of adventurers in the ultimate Surword experience.
            Create your character, gather your party, and write your own epic
            story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <>
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="border-gray-600 hover:bg-gray-700 text-lg px-8 py-3"
                >
                  <Link href="/overview">View Character</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-lg px-8 py-3"
                >
                  <Link href="auth/register">Create Character</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="border-gray-600 hover:bg-gray-700 text-lg px-8 py-3 bg-transparent"
                >
                  <Link href="auth/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
