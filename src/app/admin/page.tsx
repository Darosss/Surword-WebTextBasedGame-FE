"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockGameConfig } from "./mock-config";

import {
  Save,
  RefreshCw,
  Shield,
  Gem,
  TrendingUp,
  Coins,
  Store,
  Settings,
} from "lucide-react";
import { ConfigsResponseType } from "@/api/types";
import { LootConfigSection } from "@/components/admin/loot-config-section";
import { SkirmishConfigSection } from "@/components/admin/skirmish-config-section";
import { SystemConfigSection } from "@/components/admin/system-config-section";
import { XpConfigSection } from "@/components/admin/xp-config.section";
import { useFetch } from "@/hooks/useFetch";
import { fetchBackendApi } from "@/api/fetch";

export default function AdminPage() {
  const {
    api: {
      responseData: { data },
    },
    fetchData: refetchConfigs,
  } = useFetch<ConfigsResponseType>({
    url: "admin/app-config/",
    method: "GET",
  });

  const [config, setConfig] = useState<ConfigsResponseType>(mockGameConfig);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setConfig(data);
  }, [data]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      fetchBackendApi<ConfigsResponseType>({
        url: `admin/app-config/`,
        method: "POST",
        body: config,
        notification: { pendingText: "Trying to update configs..." },
      }).then((data) => {
        const { data: responseData } = data.body;

        if (!responseData) return;
        setConfig(responseData);
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    refetchConfigs();
  };

  const handleGoldConfigChange = (
    field: keyof ConfigsResponseType["goldConfig"],
    value: number
  ) => {
    setConfig((prev) => ({
      ...prev,
      goldConfig: {
        ...prev.goldConfig,
        [field]: value,
      },
    }));
  };

  const handleMerchantConfigChange = (
    field: keyof ConfigsResponseType["merchantConfig"],
    value: number
  ) => {
    setConfig((prev) => ({
      ...prev,
      merchantConfig: {
        ...prev.merchantConfig,
        [field]: value,
      },
    }));
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-300 mb-2">
          Game Configuration Admin Panel
        </h1>
        <p className="text-gray-400">
          Manage and configure all game settings from this central dashboard.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Configuration"}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-600 hover:bg-gray-700 bg-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="skirmish" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-800/50 h-auto p-1 gap-1">
          <TabsTrigger
            value="skirmish"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Skirmish</span>
          </TabsTrigger>
          <TabsTrigger
            value="loot"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <Gem className="h-4 w-4" />
            <span className="hidden sm:inline">Loot</span>
          </TabsTrigger>
          <TabsTrigger
            value="xp"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger
            value="gold"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <Coins className="h-4 w-4" />
            <span className="hidden sm:inline">Gold</span>
          </TabsTrigger>
          <TabsTrigger
            value="merchant"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Merchant</span>
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="flex items-center gap-2 py-2 bg-primary brightness-125"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skirmish">
          <SkirmishConfigSection
            config={config.skirmishConfig}
            onChange={(newConfig) =>
              setConfig((prev) => ({ ...prev, skirmishConfig: newConfig }))
            }
          />
        </TabsContent>

        <TabsContent value="loot">
          <LootConfigSection
            config={config.lootConfig}
            onChange={(newConfig) =>
              setConfig((prev) => ({ ...prev, lootConfig: newConfig }))
            }
          />
        </TabsContent>

        <TabsContent value="xp">
          <XpConfigSection
            config={config.xpConfig}
            onChange={(newConfig) =>
              setConfig((prev) => ({ ...prev, xpConfig: newConfig }))
            }
          />
        </TabsContent>

        <TabsContent value="gold">
          <Card className="bg-gray-800/60 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Coins className="h-5 w-5" />
                Gold Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure gold rewards and calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="baseGoldPerEnemyLevel"
                    className="text-gray-300"
                  >
                    Base Gold Per Enemy Level
                  </Label>
                  <Input
                    id="baseGoldPerEnemyLevel"
                    type="number"
                    value={config.goldConfig.baseGoldPerEnemyLevel}
                    onChange={(e) =>
                      handleGoldConfigChange(
                        "baseGoldPerEnemyLevel",
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    className="bg-gray-900/50 border-gray-600 text-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="enemyDefeatSurvivedAdjustGold"
                    className="text-gray-300"
                  >
                    Survived Adjustment Factor
                  </Label>
                  <Input
                    id="enemyDefeatSurvivedAdjustGold"
                    type="number"
                    step="0.1"
                    value={config.goldConfig.enemyDefeatSurvivedAdjustGold}
                    onChange={(e) =>
                      handleGoldConfigChange(
                        "enemyDefeatSurvivedAdjustGold",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-gray-900/50 border-gray-600 text-gray-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchant">
          <Card className="bg-gray-800/60 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Store className="h-5 w-5" />
                Merchant Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure merchant refresh rates and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commodityRefreshMS" className="text-gray-300">
                    Commodity Refresh (ms)
                  </Label>
                  <Input
                    id="commodityRefreshMS"
                    type="number"
                    value={config.merchantConfig.commodityRefreshMS}
                    onChange={(e) =>
                      handleMerchantConfigChange(
                        "commodityRefreshMS",
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    className="bg-gray-900/50 border-gray-600 text-gray-100"
                  />
                  <p className="text-xs text-gray-500">
                    {Math.floor(
                      config.merchantConfig.commodityRefreshMS /
                        (1000 * 60 * 60)
                    )}{" "}
                    hours
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="buyCostValueMultiplier"
                    className="text-gray-300"
                  >
                    Buy Cost Multiplier
                  </Label>
                  <Input
                    id="buyCostValueMultiplier"
                    type="number"
                    step="0.1"
                    value={config.merchantConfig.buyCostValueMultiplier}
                    onChange={(e) =>
                      handleMerchantConfigChange(
                        "buyCostValueMultiplier",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-gray-900/50 border-gray-600 text-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="sellCostValueMultiplier"
                    className="text-gray-300"
                  >
                    Sell Cost Multiplier
                  </Label>
                  <Input
                    id="sellCostValueMultiplier"
                    type="number"
                    step="0.1"
                    value={config.merchantConfig.sellCostValueMultiplier}
                    onChange={(e) =>
                      handleMerchantConfigChange(
                        "sellCostValueMultiplier",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-gray-900/50 border-gray-600 text-gray-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <SystemConfigSection
            config={config.systemConfig}
            onChange={(newConfig) =>
              setConfig((prev) => ({ ...prev, systemConfig: newConfig }))
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
