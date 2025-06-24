import {
  CharacterEquipmentFields,
  EnemyType,
  FightReportStatus,
  ItemType,
  LeaderboardsCategories,
} from "./enums";

type CommonFieldTypes = {
  id: string;
  //TODO: createdAt updatedAt and others?
};

export type User = CommonFieldTypes & {
  username: string;
  email: string;
  roles: string[];
  lastLogin: string;
  gold: number;
};

export type NpcEnemy = CommonFieldTypes & {
  health: number;
  level: number;
  name: string;
  type: EnemyType;
  stats: HeroStats;
};

export type Character = CommonFieldTypes & {
  equipment: CharacterEquipment;
  health: number;
  level: number;
  name: string;
  stats: HeroStats;
};

export type MainCharacter = Character & {
  expToLevelUp: number;
  experience: number;
};
export type MercenaryCharacter = Character & {
  mercenary?: ItemMercenary;
};

export type CharacterTypesAlias = MainCharacter | MercenaryCharacter;

export type CharacterEquipment = CommonFieldTypes & {
  slots: CharacterEquipmentSlots;
};

export type CharacterEquipmentSlots = {
  [slot in CharacterEquipmentFields]?: ItemWearable;
};

export type HeroStats = {
  additionalStatistics: HeroAdditionalStatistics;
  statistics: HeroBaseStatistics;
};
export type HeroAdditionalStatistics = {
  [name: string]: HeroAdditionalStatisticsValues;
};

export type HeroStatisticsCommon = {
  bonus: number;
  effectiveValue: number;
  name: string;
  bonusPercentage: number;
};

export type HeroAdditionalStatisticsValues = HeroStatisticsCommon & {
  baseStatBonus: number;
  value: number;
};

export type HeroBaseStatistics = {
  [name: string]: HeroBaseStatisticsValues;
};

export type HeroBaseStatisticsValues = HeroStatisticsCommon & {
  max: number;
};

export type ReportTurn = {
  turnNumber: number;
  actions: ReportTurnAction[];
  endOfFight: boolean;
};

export type ReportTurnAction = {
  basicAttack: ReportTurnActionMove;
  doubledAttack?: ReportTurnActionMove;
};

export type ReportTurnActionMove = {
  attack: ReportTurnActionMoveAttack;
  defend: ReportTurnActionMoveDefend;
};

export type ReportTurnActionMoveAttack = {
  baseValues: {
    attackStrength: {
      attackStrength: "NORMAL" | "CRITIC" | "LETHAL";
      percentageBonusDamage: number;
    };
    value: number;
  };
  debuffs: any;
  name: string;
  withDoubledAttack: boolean;
};
export type ReportTurnActionMoveDefend = {
  defendType: "DODGED" | "BLOCKED" | "PAIRED" | "NULL";
  health: number;
  name: string;
  receivedDamage: number;
  parryAttack: ReportTurnAction | null;
};

export type Item = CommonFieldTypes & {
  name: string;
  description: string;
  level: number;
  rarity: ItemRarity;
  statistics: ItemStatistics | null;
  type: ItemType;
  subtype: string;
  upgradePoints: number;
  value: number;
  weight: number;
};

export type ItemWearable = Item & {
  prefix: string;
  suffix: string;
  nameWithPrefixAndSuffix: string;
};
export type ItemConsumable = Item & {
  hpGain: number | null;
  type: ItemType.CONSUMABLE;
};
export type ItemMercenary = Item & {
  type: ItemType.MERCENARY;
};

export type ItemRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "VERY_RARE"
  | "EPIC"
  | "LEGENDARY"
  | "MYTHIC";

export type ItemStatistics = {
  //TODO: here shoould be an enum or type depends on statistic
  baseStatistics: ItemStatisticStatsList<string>;
  additionalStatistics: ItemStatisticStatsList<string>;
};

export type ItemStatisticStatsList<NameType extends string> = {
  [name in NameType]: ItemStatisticsValues;
};

export type ItemStatisticsValues = {
  name: string; //TODO: later generic? with enum
  percentageValue: number;
  value: number;
};

export type FightReportType = {
  characters: Character[];
  enemies: NpcEnemy[];
  gainedExperience: number;
  gainedGold: number;
  loot: InventoryItemType[];
  status: FightReportStatus;
  turnsReports: ReportTurn[];
};

export type Inventory = CommonFieldTypes & {
  items?: InventoryItems;
  maxItems: number;
  maxWeight: number;
  currentWeight: number;
};

export type InventoryItemType = ItemWearable | ItemConsumable | ItemMercenary;

export type InventoryItems = {
  [id: string]: InventoryItemType;
};

export type EquipResponseType = Item;

export type UnEquipResponseType = Item;

export type ItemsCostType = {
  [id: string]: number;
};

export type YourMerchantResponseData = {
  commodityRefreshAt: string;
  id: string;
  items: InventoryItems;
  itemsCost: ItemsCostType;
};

export type LeaderboardsData = {
  place: number;
  userId: string;
  username: string;
  value: number;
};

export type LeaderboardsResponse = CommonFieldTypes & {
  category: LeaderboardsCategories;
  data: LeaderboardsData[];
};
