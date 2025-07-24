"use client";

import { ConfigsResponseType } from "@/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem, Percent } from "lucide-react";
import { rarityStyles } from "../items/utils";

interface LootConfigSectionProps {
  config: ConfigsResponseType["lootConfig"];
  onChange: (config: ConfigsResponseType["lootConfig"]) => void;
}

export const LootConfigSection = ({
  config,
  onChange,
}: LootConfigSectionProps) => {
  const handleRarityChange = (
    rarity: keyof typeof config.raritiesBonusMultipliers.rarityBonuses,
    value: number
  ) => {
    onChange({
      ...config,
      raritiesBonusMultipliers: {
        ...config.raritiesBonusMultipliers,
        rarityBonuses: {
          ...config.raritiesBonusMultipliers.rarityBonuses,
          [rarity]: value,
        },
      },
    });
  };

  const handleBaseFactorChange = (value: number) => {
    onChange({
      ...config,
      raritiesBonusMultipliers: {
        ...config.raritiesBonusMultipliers,
        baseFactor: value,
      },
    });
  };

  const handleItemChanceChange = (value: number) => {
    onChange({
      ...config,
      itemChanceBonusMultiplier: value,
    });
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-300">
          <Gem className="h-5 w-5" />
          Loot Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure item drop rates and rarity multipliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="baseFactor" className="text-gray-300">
              Base Factor
            </Label>
            <Input
              id="baseFactor"
              type="number"
              step="0.1"
              value={config.raritiesBonusMultipliers.baseFactor}
              onChange={(e) =>
                handleBaseFactorChange(Number.parseFloat(e.target.value) || 0)
              }
              className="bg-gray-900/50 border-gray-600 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="itemChance"
              className="text-gray-300 flex items-center gap-2"
            >
              Item Chance Multiplier
            </Label>
            <Input
              id="itemChance"
              type="number"
              step="0.1"
              value={config.itemChanceBonusMultiplier}
              onChange={(e) =>
                handleItemChanceChange(Number.parseFloat(e.target.value) || 0)
              }
              className="bg-gray-900/50 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-200 mb-3">
            Rarity Bonus Multipliers
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(config.raritiesBonusMultipliers.rarityBonuses).map(
              ([rarity, value]) => (
                <div key={rarity} className="space-y-2">
                  <Label
                    htmlFor={`rarity-${rarity}`}
                    className={`text-sm font-medium ${
                      rarityStyles[rarity as keyof typeof rarityStyles].text
                    }`}
                  >
                    {rarity.replace("_", " ")}
                  </Label>
                  <Input
                    id={`rarity-${rarity}`}
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={(e) =>
                      handleRarityChange(
                        rarity as keyof typeof config.raritiesBonusMultipliers.rarityBonuses,
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-gray-900/50 border-gray-600 text-gray-100"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
