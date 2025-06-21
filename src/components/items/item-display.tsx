"use client";

import {
  ItemStatisticStatsList,
  InventoryItemType,
  ItemRarity,
} from "@/api/types";
import Image from "next/image";
import React, { FC } from "react";
import { Tooltip } from "react-tooltip";
import { isConsumableItem, isWearableItem } from "@/api/utils";
import styles from "./item-display.module.scss";
import { cn } from "@/lib/utils";
type ItemDisplayProps = {
  item: InventoryItemType;
  tooltipId: string;
  onHover: (item: InventoryItemType) => void;
  refForWrapper?: React.Ref<HTMLDivElement> | undefined;
  opacity?: number;
  costOptions?: {
    value: number;
    canAfford: boolean;
  };
};
const rarityStyles: Record<ItemRarity, string> = {
  COMMON: "border-gray-400 bg-gray-700/30",
  UNCOMMON: "border-green-500 bg-green-400/30",
  RARE: "border-blue-500 bg-blue-600/30",
  VERY_RARE: "border-purple-500 bg-sky-400/30",
  EPIC: "border-orange-500 bg-purple-400/30",
  LEGENDARY: "border-orange-500 bg-orange-500/30",
  MYTHIC: "border-orange-500 bg-yellow-600/30",
};
export const ItemDisplay: FC<ItemDisplayProps> = ({
  item,
  tooltipId,
  onHover,
  refForWrapper,
  opacity,
  costOptions,
}) => {
  return (
    <div
      data-tooltip-id={tooltipId}
      className={cn(
        "group relative aspect-square w-full rounded-lg border-2 flex flex-col items-center justify-center transition-all scale-95 hover:scale-100 hover:shadow-lg",
        rarityStyles[item.rarity]
      )}
      onMouseEnter={() => onHover(item)}
      ref={refForWrapper}
      style={{ opacity }}
    >
      <div
        className={cn(
          "absolute flex justify-between rounded-sm p-1 top-1 right-1 z-[50] brightness-150 text-xs",
          rarityStyles[item.rarity]
        )}
      >
        {item.level}
      </div>
      {costOptions ? (
        <div
          className={cn(
            "absolute flex justify-between rounded-sm p-1 bottom-1 right-1 z-[50] text-xs",
            rarityStyles[item.rarity]
          )}
        >
          <span
            className={cn(
              !costOptions.canAfford ? "text-danger" : "text-primary"
            )}
          >
            {costOptions.value.toLocaleString()}
          </span>
          <span className={styles.goldIcon}>$</span>
        </div>
      ) : null}
      <Image
        src={`/images/items/${item.type.toLowerCase()}/${item.subtype.toLowerCase()}.png`}
        sizes="(max-width: 768px) 50px, 100px"
        alt="item"
        fill
      />
    </div>
  );
};

type ItemStatisticsProps<StatNameType extends string> = {
  statistics: ItemStatisticStatsList<StatNameType>;
};

//TODO: here shoould be an enum or type depends on statistic
export const ItemStatistics: FC<ItemStatisticsProps<string>> = ({
  statistics,
}) => {
  return Object.entries(statistics)
    .sort()
    .map(([name, stat]) => {
      const statValuePositive = stat.value > 0;
      const statValuePercentPositive = stat.percentageValue > 0;
      return (
        <React.Fragment key={name}>
          <div className={styles.statisticWrapper}>
            <div className={styles.statName}>{stat.name}</div>
            <div
              className={`${
                statValuePositive ? styles.statPositive : styles.statNegative
              }`}
            >
              {statValuePositive ? "+" : ""}
              {stat.value}
            </div>
          </div>
          {stat.percentageValue ? (
            <div className={styles.statisticWrapper}>
              <div className={styles.statName}>{stat.name}</div>
              <div
                className={`${
                  statValuePercentPositive
                    ? styles.statPositive
                    : styles.statNegative
                }`}
              >
                {statValuePercentPositive ? "+" : ""}
                {stat.percentageValue}%
              </div>
            </div>
          ) : null}
        </React.Fragment>
      );
    });
};

type ItemTooltipContentProps = {
  item: InventoryItemType;
};

export const ItemTooltipContent: FC<ItemTooltipContentProps> = ({ item }) => {
  const wearable = isWearableItem(item);
  const consumable = isConsumableItem(item);

  return (
    <div className={styles.itemTooltipContentWrapper}>
      <div>{wearable ? item.nameWithPrefixAndSuffix : item.name}</div>
      <div className={styles.itemStatisticsWrapper}>
        {item.statistics ? (
          <>
            <div>
              <ItemStatistics statistics={item.statistics.baseStatistics} />
            </div>
            <div>
              <ItemStatistics
                statistics={item.statistics.additionalStatistics}
              />
            </div>
          </>
        ) : null}
        {consumable ? (
          <div>
            <div> Health points </div>
            <div>{item.hpGain} </div>
          </div>
        ) : null}
      </div>
      <div className={styles.itemBasicDetailsWrapper}>
        <div>
          <div>Level: {item.level}</div>
          <div>Value: {item.value}</div>
          <div>Type: {item.type}</div>
          <div>Subtype: {item.subtype}</div>
        </div>
        <div>
          <div>Rarity: {item.rarity}</div>
          <div>Upgrade points: {item.upgradePoints}</div>
          <div>Weight: {item.weight.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

type ItemTooltipContentWrapperProps = {
  item: InventoryItemType | null;
  tooltipId: string;
  opacity?: number;
  customClassName?: string;
};

export const ItemTooltipContentWrapper: FC<ItemTooltipContentWrapperProps> = ({
  item,
  tooltipId,
  opacity,
  customClassName,
}) => {
  return (
    <Tooltip
      className={`${styles.itemsTooltip} ${customClassName}`}
      id={tooltipId}
      opacity={opacity !== 0 ? opacity : 0}
    >
      {item ? <ItemTooltipContent item={item} /> : null}
    </Tooltip>
  );
};
