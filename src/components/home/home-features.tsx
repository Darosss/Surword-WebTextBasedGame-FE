"use client";
import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { features } from "./features-list";

export const HomeFeatures: FC = () => {
  return (
    <section className="bg-gray-800/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4">
            Epic Features Await
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the depth and excitement that makes every adventure unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:from-blue-500 group-hover:to-purple-500 transition-all">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
