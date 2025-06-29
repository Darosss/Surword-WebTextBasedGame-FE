"use client";

import { InventoryItemType, ItemsCostType } from "@/api/types";
import React, { FC, useMemo, useState } from "react";
import { filterItemsEntries, getSortedItems } from "@/components/items";
import type { FilterType, SortType } from "@/components/items";
import { MerchantItem } from "./merchant-item";
import { fetchBackendApi } from "@/api/fetch";
import { useAuthContext } from "@/components/auth";
import { toast } from "react-toastify";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { ItemType } from "@/api/enums";
import { allowDropToPrefixes } from "../dndHelpers";
import dndStyles from "../dnd.module.scss";
import { useMerchantContext } from "./merchant-context";
import {
  BaseDropResultsFromInventory,
  UseDropBaseCollectedProps,
} from "../dndTypes";
import { PossibleDropResultActions } from "../equipment";
import { MerchantCommodityTimer } from "./merchant-commodity-timer";
import { useInventoryManagementContext } from "../inventory";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Coins } from "lucide-react";
import { ItemsHeaderFilter } from "@/components/items/items-header-filter";
import { ItemsSidebarFilter } from "@/components/items/items-sidebar-filter";

const findCostForItem = (itemsCost: ItemsCostType, itemId: string) =>
  Object.entries(itemsCost).find(([id]) => id === itemId);

export const Merchant: FC = () => {
  const [{ canDrop, isOver }, drop] = useDrop<
    unknown,
    BaseDropResultsFromInventory,
    UseDropBaseCollectedProps
  >(
    () => ({
      accept: Object.values(ItemType).map(
        (val) => allowDropToPrefixes.equipmentAndMerchant + val
      ),
      drop: () => ({
        dropAction: PossibleDropResultActions.SELL_ITEM,
      }),
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    ["any"]
  );

  const { manageMerchantItems, items, commodityRefreshAt, itemsCost } =
    useMerchantContext();

  const {
    user: { gold },
    updateUserDetails,
  } = useAuthContext();
  const { manageInventoryItems } = useInventoryManagementContext();

  const [filter, setFilter] = useState<FilterType>({
    name: null,
    showType: [],
  });
  const [sort, setSort] = useState<SortType>({
    sortBy: "name",
    descending: true,
  });

  const itemsToRender = useMemo(
    () => getSortedItems(filterItemsEntries(items || {}, filter), sort),
    [filter, sort, items]
  );

  const handleOnBuyItem = (id: string, cost: number) => {
    if (gold < cost) return toast.error("You do not have enough gold");
    fetchBackendApi<InventoryItemType>({
      url: `merchants/buy-item/${id}`,
      method: "POST",
      notification: { pendingText: "Trying to buy item" },
    }).then((response) => {
      const responseData = response.body.data;
      if (responseData) {
        manageMerchantItems({ type: "buy", id: responseData.id });

        manageInventoryItems({ type: "add", item: responseData });
        updateUserDetails({ gold: gold - responseData.value });
      }
    });
  };

  const isActive = canDrop && isOver;
  return (
    <div className="space-y-4 flex flex-col max-h-[calc(100dvh-10rem)] overflow-hidden">
      <div className="flex justify-between items-center border-b border-gray-600 pb-3">
        <h3 className="text-xl font-semibold text-yellow-200">
          Traveling Merchant
        </h3>
        <div className="flex items-center gap-2 text-yellow-400">
          <Coins className="h-5 w-5" />
          <span>Your Gold: {gold.toLocaleString()}</span>{" "}
          {/* Placeholder, get from auth context */}
        </div>
      </div>
      <div className="flex items-center gap-2 text-yellow-400">
        <MerchantCommodityTimer commodityRefreshAt={commodityRefreshAt} />
      </div>
      <ItemsHeaderFilter setFilter={setFilter} sort={sort} setSort={setSort} />
      <ItemsSidebarFilter setFilter={setFilter} filter={filter} />

      <ScrollArea className="flex-grow">
        <ScrollBar />
        <div
          className={`max-h-[calc(100dvh-10rem)] grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 pr-2
               ${isActive ? dndStyles.active : canDrop ? dndStyles.canDrop : ""}
         `}
          ref={drop}
        >
          {itemsToRender?.map((value) => {
            const itemCost =
              findCostForItem(itemsCost || {}, value[0])?.[1] || -1;

            return (
              <MerchantItem
                key={value[0]}
                itemData={{ item: value[1], cost: itemCost }}
                onItemBuy={handleOnBuyItem}
                currentGold={gold}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
