import { ConfigsResponseType } from "@/api/types";

export const mockGameConfig: ConfigsResponseType = {
  skirmishConfig: {
    challengeCooldownMS: 120000,
    dungeonCooldownMS: 600000,
  },
  lootConfig: {
    raritiesBonusMultipliers: {
      baseFactor: 1.0,
      rarityBonuses: {
        COMMON: 1.0,
        UNCOMMON: 1.0,
        RARE: 1.0,
        VERY_RARE: 1.0,
        EPIC: 1.0,
        LEGENDARY: 1.0,
        MYTHIC: 1.0,
      },
    },
    itemChanceBonusMultiplier: 1.0,
  },
  xpConfig: {
    basePerLevelXp: 100,
    scalingFactorXp: 30.0,
    factorBaseXp: 0.9,
    factorExponentXp: 1.1,
    enemyDefeatBaseXp: 50,
    enemyDefeatFactorBaseXp: 1.2,
    enemyDefeatFactorExponentXp: 0.3,
    enemyDefeatSurvivedAdjustXp: -0.3,
  },
  goldConfig: {
    baseGoldPerEnemyLevel: 33,
    enemyDefeatSurvivedAdjustGold: -0.3,
  },
  merchantConfig: {
    commodityRefreshMS: 86400000,
    buyCostValueMultiplier: 5.0,
    sellCostValueMultiplier: 1.0,
  },
  systemConfig: {
    leaderboardRefreshCooldownMs: 86400000,
    mercenaryCharacterLimits: [
      {
        requiredLevel: 10,
        charactersLimit: 2,
      },
      {
        requiredLevel: 30,
        charactersLimit: 3,
      },
      {
        requiredLevel: 50,
        charactersLimit: 4,
      },
    ],
  },
};
