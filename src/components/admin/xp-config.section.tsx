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
import { TrendingUp } from "lucide-react";

interface XpConfigSectionProps {
  config: ConfigsResponseType["xpConfig"];
  onChange: (config: ConfigsResponseType["xpConfig"]) => void;
}

export const XpConfigSection = ({ config, onChange }: XpConfigSectionProps) => {
  const handleChange = (
    field: keyof ConfigsResponseType["xpConfig"],
    value: number
  ) => {
    onChange({ ...config, [field]: value });
  };

  const configFields = [
    {
      key: "basePerLevelXp",
      label: "Base XP Per Level",
      type: "number",
      step: "1",
    },
    {
      key: "scalingFactorXp",
      label: "Scaling Factor",
      type: "number",
      step: "0.1",
    },
    { key: "factorBaseXp", label: "Factor Base", type: "number", step: "0.1" },
    {
      key: "factorExponentXp",
      label: "Factor Exponent",
      type: "number",
      step: "0.1",
    },
    {
      key: "enemyDefeatBaseXp",
      label: "Enemy Defeat Base XP",
      type: "number",
      step: "1",
    },
    {
      key: "enemyDefeatFactorBaseXp",
      label: "Enemy Defeat Factor Base",
      type: "number",
      step: "0.1",
    },
    {
      key: "enemyDefeatFactorExponentXp",
      label: "Enemy Defeat Factor Exponent",
      type: "number",
      step: "0.1",
    },
    {
      key: "enemyDefeatSurvivedAdjustXp",
      label: "Survived Adjustment",
      type: "number",
      step: "0.1",
    },
  ] as const;

  return (
    <Card className="bg-gray-800/60 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-300">
          <TrendingUp className="h-5 w-5" />
          Experience Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure experience point calculations and scaling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {configFields.map(({ key, label, type, step }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-gray-300 text-sm">
                {label}
              </Label>
              <Input
                id={key}
                type={type}
                step={step}
                value={config[key]}
                onChange={(e) =>
                  handleChange(key, Number.parseFloat(e.target.value) || 0)
                }
                className="bg-gray-900/50 border-gray-600 text-gray-100"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
