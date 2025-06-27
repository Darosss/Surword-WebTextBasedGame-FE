"use client";

import { InventoryItemType, ItemRarity } from "@/api/types";
import Image from "next/image";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { ItemHoverCardContentDisplay } from "./item-hover-card-content";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { rarityStyles } from "./utils";
type ItemDisplayProps = ItemWrapper & {
  item: InventoryItemType;
};
type ItemWrapper = {
  rarity?: ItemRarity;
  refForWrapper?: React.Ref<HTMLDivElement> | undefined;
  opacity?: number;
  costOptions?: {
    value: number;
    canAfford: boolean;
  };
  children?: React.ReactNode;
};
const ItemWrapper: FC<ItemWrapper> = ({
  rarity,
  refForWrapper,
  opacity,
  children,
}) => {
  const currentRarityStyles = rarity ? rarityStyles[rarity] : null;
  return (
    <div
      className={cn(
        "group relative aspect-square w-full rounded-lg border-2 flex flex-col items-center justify-center transition-all scale-95",
        currentRarityStyles
          ? `${currentRarityStyles?.bg} hover:scale-100 hover:shadow-lg`
          : "brightness-50"
      )}
      ref={refForWrapper}
      style={{ opacity }}
    >
      {children}
    </div>
  );
};

export const ItemDisplay: FC<ItemDisplayProps> = ({
  item,
  costOptions,
  ...props
}) => {
  const currentRarityStyles = rarityStyles[item.rarity];
  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger className="w-full">
        <ItemWrapper rarity={item.rarity} {...props}>
          {item ? (
            <>
              <div
                className={cn(
                  "absolute flex justify-between rounded-sm p-1 top-1 right-1 z-[50] brightness-150 text-xs",
                  currentRarityStyles?.bg
                )}
              >
                {item.level}
              </div>
              {costOptions ? (
                <div
                  className={cn(
                    "absolute flex justify-between rounded-sm p-1 bottom-1 right-1 z-[50] text-xs backdrop-blur-lg",
                    currentRarityStyles?.bg
                  )}
                >
                  <span
                    className={cn(
                      "font-semibold",
                      !costOptions.canAfford && "text-danger"
                    )}
                  >
                    {costOptions.value.toLocaleString()}
                  </span>
                  <span className="text-warning"> G</span>
                </div>
              ) : null}
              <Image
                src={`/images/items/${item.type.toLowerCase()}/${item.subtype.toLowerCase()}.png`}
                sizes="(max-width: 768px) 50px, 100px"
                alt="item"
                fill
              />
            </>
          ) : null}
        </ItemWrapper>
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
export const EmptyItemDisplay: FC<ItemWrapper> = (props) => {
  return <ItemWrapper {...props} />;
};
