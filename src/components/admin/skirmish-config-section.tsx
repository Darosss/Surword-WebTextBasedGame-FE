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
import { Swords, Clock } from "lucide-react";

interface SkirmishConfigSectionProps {
  config: ConfigsResponseType["skirmishConfig"];
  onChange: (config: ConfigsResponseType["skirmishConfig"]) => void;
}

export const SkirmishConfigSection = ({
  config,
  onChange,
}: SkirmishConfigSectionProps) => {
  const handleChange = (
    field: keyof ConfigsResponseType["skirmishConfig"],
    value: number
  ) => {
    onChange({ ...config, [field]: value });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-300">
          <Swords className="h-5 w-5" />
          Skirmish Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure cooldown timers for challenges and dungeons
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="challengeCooldown"
              className="text-gray-300 flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Challenge Cooldown
            </Label>
            <Input
              id="challengeCooldown"
              type="number"
              value={config.challengeCooldownMS}
              onChange={(e) =>
                handleChange(
                  "challengeCooldownMS",
                  Number.parseInt(e.target.value) || 0
                )
              }
              className="bg-gray-900/50 border-gray-600 text-gray-100"
            />
            <p className="text-xs text-gray-500">
              Current: {formatTime(config.challengeCooldownMS)} (
              {config.challengeCooldownMS}ms)
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="dungeonCooldown"
              className="text-gray-300 flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Dungeon Cooldown
            </Label>
            <Input
              id="dungeonCooldown"
              type="number"
              value={config.dungeonCooldownMS}
              onChange={(e) =>
                handleChange(
                  "dungeonCooldownMS",
                  Number.parseInt(e.target.value) || 0
                )
              }
              className="bg-gray-900/50 border-gray-600 text-gray-100"
            />
            <p className="text-xs text-gray-500">
              Current: {formatTime(config.dungeonCooldownMS)} (
              {config.dungeonCooldownMS}ms)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
