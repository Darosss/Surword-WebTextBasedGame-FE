"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Users, Plus, Trash2 } from "lucide-react";
import { ConfigsResponseType } from "@/api/types";

interface SystemConfigSectionProps {
  config: ConfigsResponseType["systemConfig"];
  onChange: (config: ConfigsResponseType["systemConfig"]) => void;
}

export const SystemConfigSection = ({
  config,
  onChange,
}: SystemConfigSectionProps) => {
  const handleLeaderboardCooldownChange = (value: number) => {
    onChange({
      ...config,
      leaderboardRefreshCooldownMs: value,
    });
  };

  const handleMercenaryLimitChange = (
    index: number,
    field: "requiredLevel" | "charactersLimit",
    value: number
  ) => {
    const newLimits = [...config.mercenaryCharacterLimits];
    newLimits[index] = { ...newLimits[index], [field]: value };
    onChange({
      ...config,
      mercenaryCharacterLimits: newLimits,
    });
  };

  const addMercenaryLimit = () => {
    onChange({
      ...config,
      mercenaryCharacterLimits: [
        ...config.mercenaryCharacterLimits,
        { requiredLevel: 1, charactersLimit: 1 },
      ],
    });
  };

  const removeMercenaryLimit = (index: number) => {
    onChange({
      ...config,
      mercenaryCharacterLimits: config.mercenaryCharacterLimits.filter(
        (_, i) => i !== index
      ),
    });
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours} hours`;
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-300">
          <Settings className="h-5 w-5" />
          System Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure system-wide settings and mercenary limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="leaderboardCooldown" className="text-gray-300">
            Leaderboard Refresh Cooldown (ms)
          </Label>
          <Input
            id="leaderboardCooldown"
            type="number"
            value={config.leaderboardRefreshCooldownMs}
            onChange={(e) =>
              handleLeaderboardCooldownChange(
                Number.parseInt(e.target.value) || 0
              )
            }
            className="bg-gray-900/50 border-gray-600 text-gray-100"
          />
          <p className="text-xs text-gray-500">
            Current: {formatTime(config.leaderboardRefreshCooldownMs)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mercenary Character Limits
            </h4>
            <Button
              onClick={addMercenaryLimit}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Limit
            </Button>
          </div>

          <div className="space-y-3">
            {config.mercenaryCharacterLimits.map((limit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg"
              >
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-gray-300 text-xs">
                      Required Level
                    </Label>
                    <Input
                      type="number"
                      value={limit.requiredLevel}
                      onChange={(e) =>
                        handleMercenaryLimitChange(
                          index,
                          "requiredLevel",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      className="bg-gray-800/50 border-gray-600 text-gray-100 h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300 text-xs">
                      Characters Limit
                    </Label>
                    <Input
                      type="number"
                      value={limit.charactersLimit}
                      onChange={(e) =>
                        handleMercenaryLimitChange(
                          index,
                          "charactersLimit",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      className="bg-gray-800/50 border-gray-600 text-gray-100 h-8"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => removeMercenaryLimit(index)}
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
