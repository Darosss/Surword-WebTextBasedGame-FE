"use client";

import { ItemStatisticStatsList, InventoryItemType } from "@/api/types";
import styles from "./item-display.module.scss";
import Image from "next/image";
import React, { FC } from "react";
import { Tooltip } from "react-tooltip";
import { isConsumableItem, isWearableItem } from "@/api/utils";
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
      className={styles.itemDisplayWrapper}
      onMouseEnter={() => onHover(item)}
      ref={refForWrapper}
      style={{ opacity }}
    >
      <div
        className={`${styles.levelDisplay} ${
          styles[item.rarity.toLowerCase()]
        }`}
      >
        {item.level}
      </div>
      {costOptions ? (
        <div className={styles.costDisplay}>
          <span
            className={`${!costOptions.canAfford ? styles.cantAfford : ""}`}
          >
            {costOptions.value.toLocaleString()}
          </span>
          <span className={styles.goldIcon}>$</span>
        </div>
      ) : null}
      <div className={styles.itemDisplayBackground}></div>
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
