"use client";

import { InventoryItemType, ItemStatisticStatsList } from "@/api/types";
import Image from "next/image";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { rarityStyles } from "./utils";
import { ItemHoverCardContentDisplay } from "./item-hover-card-content";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
type ItemDisplayProps = {
  item: InventoryItemType;
  refForWrapper?: React.Ref<HTMLDivElement> | undefined;
  opacity?: number;
  costOptions?: {
    value: number;
    canAfford: boolean;
  };
};

export const ItemDisplay: FC<ItemDisplayProps> = ({
  item,
  refForWrapper,
  opacity,
  costOptions,
}) => {
  return (
    <HoverCard openDelay={150} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "group relative aspect-square w-full rounded-lg border-2 flex flex-col items-center justify-center transition-all scale-95 hover:scale-100 hover:shadow-lg",
            rarityStyles[item.rarity].bg
          )}
          ref={refForWrapper}
          style={{ opacity }}
        >
          <div
            className={cn(
              "absolute flex justify-between rounded-sm p-1 top-1 right-1 z-[50] brightness-150 text-xs",
              rarityStyles[item.rarity].bg
            )}
          >
            {item.level}
          </div>
          {costOptions ? (
            <div
              className={cn(
                "absolute flex justify-between rounded-sm p-1 bottom-1 right-1 z-[50] text-xs",
                rarityStyles[item.rarity].bg
              )}
            >
              <span
                className={cn(
                  !costOptions.canAfford ? "text-danger" : "text-primary"
                )}
              >
                {costOptions.value.toLocaleString()}
              </span>
              <span className="text-warning">$</span>
            </div>
          ) : null}
          <Image
            src={`/images/items/${item.type.toLowerCase()}/${item.subtype.toLowerCase()}.png`}
            sizes="(max-width: 768px) 50px, 100px"
            alt="item"
            fill
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        className="z-[102] bg-current border-none shadow-none w-auto"
      >
        <ItemHoverCardContentDisplay item={item} />
      </HoverCardContent>
    </HoverCard>
  );
};

type ItemStatisticsProps<StatNameType extends string> = {
  statistics: ItemStatisticStatsList<StatNameType>;
};
