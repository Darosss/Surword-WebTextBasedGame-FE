"use client";

import { InventoryItemType, ItemsCostType } from "@/api/types";
import React, { FC, useMemo, useState } from "react";
import styles from "./merchant.module.scss";
import {
  ItemTooltipContentWrapper,
  filterItemsEntries,
  getSortedItems,
} from "@/components/items";
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
import { FetchingInfo } from "@/components/common";
import { useInventoryManagementContext } from "../inventory";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Coins } from "lucide-react";
import { ItemsHeaderFilter } from "@/components/items/items-header-filter";
import { ItemsSidebarFilter } from "@/components/items/items-sidebar-filter";

const TOOLTIP_ID = "merchant-item-tooltip";

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

  const {
    apiMerchant: {
      api: { responseData, isPending, error },
      fetchData: fetchMerchantData,
    },
  } = useMerchantContext();

  const {
    apiUser: {
      api: { data: userData },
      fetchData: fetchUserData,
    },
  } = useAuthContext();

  const { fetchData: fetchInventoryData } = useInventoryManagementContext();

  const [currentItem, setCurrentItem] = useState<InventoryItemType | null>(
    null
  );

  const [filter, setFilter] = useState<FilterType>({
    name: null,
    showType: [],
  });
  const [sort, setSort] = useState<SortType>({
    sortBy: "name",
    descending: true,
  });

  const itemsToRender = useMemo(
    () =>
      getSortedItems(
        filterItemsEntries(responseData.data?.items || {}, filter),
        sort
      ),
    [filter, sort, responseData.data?.items]
  );

  const handleOnBuyItem = (id: string, cost: number) => {
    if (userData.user.gold < cost)
      return toast.error("You do not have enough gold");
    fetchBackendApi({
      url: `merchants/buy-item/${id}`,
      method: "POST",
      notification: { pendingText: "Trying to buy item" },
    }).then((response) => {
      if (response?.body.data) {
        fetchMerchantData();
        fetchInventoryData();
        fetchUserData();
      }
    });
  };

  if (isPending === null || error || !responseData.data) {
    return (
      <FetchingInfo
        isPending={isPending}
        error={error}
        refetch={fetchMerchantData}
      />
    );
  }

  const isActive = canDrop && isOver;
  return (
    <div className="space-y-4 flex flex-col max-h-[calc(100dvh-10rem)] overflow-hidden">
      <div className="flex justify-between items-center border-b border-gray-600 pb-3">
        <h3 className="text-xl font-semibold text-yellow-200">
          Traveling Merchant
        </h3>
        <div className="flex items-center gap-2 text-yellow-400">
          <Coins className="h-5 w-5" />
          <span>Your Gold: {userData.user.gold.toLocaleString()}</span>{" "}
          {/* Placeholder, get from auth context */}
        </div>
      </div>
      <div className="flex items-center gap-2 text-yellow-400">
        <MerchantCommodityTimer
          commodityRefreshAt={responseData.data.commodityRefreshAt}
        />
      </div>
      <ItemsHeaderFilter setFilter={setFilter} sort={sort} setSort={setSort} />
      <ItemsSidebarFilter setFilter={setFilter} filter={filter} />
      <ItemTooltipContentWrapper
        customClassName={styles.inventoryTooltip}
        item={currentItem}
        tooltipId={TOOLTIP_ID}
      />

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
              findCostForItem(
                responseData.data?.itemsCost || {},
                value[0]
              )?.[1] || -1;

            return (
              <MerchantItem
                key={value[0]}
                itemData={{ item: value[1], cost: itemCost }}
                tooltipId={TOOLTIP_ID}
                onHover={setCurrentItem}
                onItemBuy={handleOnBuyItem}
                currentGold={userData.user.gold}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
